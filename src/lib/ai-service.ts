import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function generateSummary(text: string) {
    if (!genAI) {
        throw new Error("GEMINI_API_KEY is not configured");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

        // Clean up markdown code blocks if present to parse JSON
        const jsonString = textResponse.replace(/^```json\n|\n```$/g, "").trim();

        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error generating summary:", error);
        throw new Error("Failed to generate summary from AI");
    }
}
