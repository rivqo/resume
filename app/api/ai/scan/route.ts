import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
const pdf = require("pdf-parse/lib/pdf-parse.js");
import mammoth from "mammoth";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "API key not configured" },
                { status: 500 }
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        let text = "";

        if (file.type === "application/pdf") {
            try {
                const data = await pdf(buffer);
                text = data.text;
            } catch (e) {
                console.error("PDF Parse Error", e);
                return NextResponse.json({ error: "Failed to parse PDF" }, { status: 500 });
            }
        } else if (
            file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
            file.type === "application/msword"
        ) {
            try {
                const result = await mammoth.extractRawText({ buffer });
                text = result.value;
            } catch (e) {
                console.error("DOCX Parse Error", e);
                return NextResponse.json({ error: "Failed to parse DOCX" }, { status: 500 });
            }
        } else {
            return NextResponse.json(
                { error: "Unsupported file type" },
                { status: 400 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const systemPrompt = `
    You are an expert resume reviewer and data parser.
    First, analyze the provided resume text and extract the data into a JSON object.
    Second, provide a critique of the resume with a score.
    
    The output MUST be a valid JSON object with the following structure:
    
    {
      "data": {
         // Matching the ResumeData interface
        "personalInfo": { ... },
        "education": [ ... ],
        "experience": [ ... ],
        "projects": [ ... ],
        "skills": [ ... ],
        "sectionOrder": [ ... ]
      },
      "review": {
        "score": number; // 0-100
        "summary": string; // Brief overall feedback
        "strengths": string[]; // List of 3-5 strengths
        "weaknesses": string[]; // List of 3-5 areas for improvement
      }
    }

    For the 'data' part, Ensure the ID fields are generated uniquely.
    If dates are missing, estimate or leave empty string but respect the format (YYYY-MM) if possible.
    
    Do not include markdown formatting, just return the raw JSON string.
    `;

        const result = await model.generateContent([systemPrompt, `Resume Text:\n${text}`]);
        const response = await result.response;
        const responseText = response.text();
        const jsonString = responseText.replace(/```json/g, "").replace(/```/g, "").trim();

        try {
            const parsed = JSON.parse(jsonString);

            // Post-process to ensure unique IDs and existing arrays
            if (parsed.data) {
                parsed.data.education = (parsed.data.education || []).map((item: any) => ({ ...item, id: crypto.randomUUID() }));
                parsed.data.experience = (parsed.data.experience || []).map((item: any) => ({ ...item, id: crypto.randomUUID() }));
                parsed.data.projects = (parsed.data.projects || []).map((item: any) => ({ ...item, id: crypto.randomUUID() }));
                parsed.data.skills = parsed.data.skills || [];
                parsed.data.sectionOrder = parsed.data.sectionOrder || ["summary", "experience", "projects", "education", "skills"];
            }

            return NextResponse.json(parsed);
        } catch (e) {
            console.error("AI Parse Error", responseText);
            return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
        }

    } catch (error) {
        console.error("Error scanning resume:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
