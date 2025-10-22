import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateTaskDescription = async (taskTitle: string, difficulty: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `My task is: "${taskTitle}". Its difficulty is "${difficulty}". Generate a short, flavorful RPG quest description for battling this task as if it were a monster, in the style of the game Ragnarok Online (max 30 words).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: {
              type: Type.STRING,
              description: "A short, RPG-style quest description for the task (max 30 words)."
            }
          },
          required: ["description"],
        }
      }
    });

    const jsonText = response.text.trim();
    const parsed = JSON.parse(jsonText);
    return { description: parsed.description };
  } catch (error) {
    console.error("Error generating task description:", error);
    // Fallback in case of API error
    return { description: `A mysterious beast that represents the task: ${taskTitle}.` };
  }
};


export const generateLevelUpMessage = async (newLevel: number) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `A player in my productivity game just reached level ${newLevel}. Write a short, encouraging, and epic congratulatory message in the style of a Ragnarok Online NPC like a Kafra Staff or a wise sage from Prontera. Keep it under 40 words.`
        });
        return response.text;
    } catch(error) {
        console.error("Error generating level up message:", error);
        return `Congratulations! You have reached level ${newLevel}! Your power grows!`;
    }
}