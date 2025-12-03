import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_KEY_API;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function generateSummary(text: string) {
    if (!genAI) {
        throw new Error("GEMINI_API_KEY (or GEMINI_KEY_API) is not configured");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
    You are an expert academic researcher. Please analyze the following academic text and provide a structured summary.
    
    The output must be a valid JSON object with the following keys:
    - "researchArea": A concise description of the research field.
    - "innovativePoints": A list of key innovations or novel contributions.
    - "experimentalResults": A summary of the experimental findings and metrics.
    - "conclusion": The main conclusion of the paper.
    - "summary": A general summary of the paper (about 100-150 words).

    Text to analyze:
    ${text.substring(0, 30000)} // Truncate to avoid token limits if necessary, though 1.5 flash has a large context.
  `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const textResponse = response.text();

        // Robustly extract JSON: remove markdown code blocks
        let jsonString = textResponse.replace(/```json/g, "").replace(/```/g, "").trim();

        // Sometimes the model adds extra text, try to find the first { and last }
        const firstBrace = jsonString.indexOf("{");
        const lastBrace = jsonString.lastIndexOf("}");

        if (firstBrace !== -1 && lastBrace !== -1) {
            jsonString = jsonString.substring(firstBrace, lastBrace + 1);
        }

        try {
            return JSON.parse(jsonString);
        } catch (e) {
            console.error("JSON Parse Error. Raw text:", textResponse);
            throw new Error(`Invalid JSON from AI: ${textResponse.substring(0, 100)}...`);
        }
    } catch (error: any) {
        console.error("Error generating summary:", error);
        // Propagate the specific error message
        throw new Error(`AI Error: ${error.message || error}`);
    }
}
