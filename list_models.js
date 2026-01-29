const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');

async function listModels() {
    const apiKey = "AIzaSyB_TVjV-pQfG63A0I3fVSAoEVdEL2RtdhI";
    if (!apiKey) {
        console.error("GOOGLE_API_KEY not set");
        return;
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.models) {
            const names = data.models.map(m => m.name).join('\n');
            fs.writeFileSync('models.txt', names);
            console.log("Wrote models to models.txt");
        } else {
            console.log("No models found or error:", data);
        }
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
