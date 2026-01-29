import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const systemPrompt = `
    You are an expert resume writer. Your task is to generate a JSON object representing a resume based on the user's description.
    The output MUST be a valid JSON object matching the following TypeScript interface:

    interface ResumeData {
      personalInfo: {
        firstName: string;
        lastName: string;
        title: string;
        email: string;
        phone: string;
        location: string;
        website: string;
        summary: string;
      };
      education: Array<{
        id: string; // Generate a unique short string
        institution: string;
        degree: string;
        fieldOfStudy: string;
        startDate: string; // Format: YYYY-MM
        endDate: string; // Format: YYYY-MM or "Present"
        description: string;
      }>;
      experience: Array<{
        id: string; // Generate a unique short string
        company: string;
        position: string;
        location: string;
        startDate: string; // Format: YYYY-MM
        endDate: string; // Format: YYYY-MM or "Present"
        description: string;
        bullets: string[]; // List of achievements
      }>;
      projects: Array<{
        id: string; // Generate a unique short string
        title: string;
        link: string;
        startDate: string;
        endDate: string;
        description: string;
        bullets: string[];
      }>;
      skills: string[]; // List of relevant skills
      sectionOrder: string[]; // Default: ["experience", "education", "projects", "skills"]
    }

    Ensure the data is realistic, professional, and directly relevant to the user's prompt.
    Do not include markdown formatting (like \`\`\`json), just return the raw JSON string.
    `;

    const result = await model.generateContent([systemPrompt, `User Prompt: ${prompt}`]);
    const response = await result.response;
    const text = response.text();

    // Clean up if the model includes markdown blocks
    const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      const resumeData = JSON.parse(jsonString);

      // Post-process to ensure unique IDs and existing arrays
      resumeData.education = (resumeData.education || []).map((item: any) => ({ ...item, id: crypto.randomUUID() }));
      resumeData.experience = (resumeData.experience || []).map((item: any) => ({ ...item, id: crypto.randomUUID() }));
      resumeData.projects = (resumeData.projects || []).map((item: any) => ({ ...item, id: crypto.randomUUID() }));
      resumeData.skills = resumeData.skills || [];
      resumeData.sectionOrder = resumeData.sectionOrder || ["summary", "experience", "projects", "education", "skills"];

      return NextResponse.json(resumeData);
    } catch (e) {
      console.error("Failed to parse AI response:", text);
      return NextResponse.json(
        { error: "Failed to generate valid JSON" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error generating resume:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
