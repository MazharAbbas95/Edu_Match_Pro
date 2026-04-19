import { GoogleGenAI, Type } from "@google/genai";

export const generateECATQuestions = async (difficulty: string, subject: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const prompt = `
      Generate 5 unique ECAT-style Multiple Choice Questions (MCQs) for the subject "${subject}" with difficulty level "${difficulty}".
      The questions should be challenging and follow standard entry test formats (NTS/ECAT).
      Return them as a JSON array where each object has:
      - text: The question string
      - options: An array of 4 possible answer strings
      - correctIndex: The 0-based index of the correct answer
      - explanation: A brief explanation of the solution
      - difficulty: "${difficulty}"
      - subject: "${subject}"
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING },
              difficulty: { type: Type.STRING },
              subject: { type: Type.STRING }
            },
            required: ["text", "options", "correctIndex", "difficulty", "subject"]
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Gemini MCQ Generation Error:", error);
    return [];
  }
};
