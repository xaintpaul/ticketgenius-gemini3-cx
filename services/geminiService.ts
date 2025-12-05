import { GoogleGenAI, Type, Schema } from "@google/genai";
import { TicketPriority, TicketSuggestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Schema for structured output
const suggestionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A concise, professional title for the ticket based on the description.",
    },
    nextAction: {
      type: Type.STRING,
      description: "A recommended immediate next step or action to resolve the issue.",
    },
    priority: {
      type: Type.STRING,
      enum: [TicketPriority.LOW, TicketPriority.MEDIUM, TicketPriority.HIGH, TicketPriority.CRITICAL],
      description: "The estimated priority level based on urgency and impact.",
    },
    tags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of 2-3 short keywords/tags for categorization (e.g., 'UI', 'Backend', 'Bug').",
    },
  },
  required: ["title", "nextAction", "priority", "tags"],
};

export const analyzeTicketDescription = async (description: string): Promise<TicketSuggestion | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are a helpful IT and Product support assistant. Analyze the following ticket description and provide structured data including a title, next action, priority, and tags.\n\nDescription: "${description}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: suggestionSchema,
        temperature: 0.3, // Low temperature for deterministic results
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as TicketSuggestion;
    }
    return null;
  } catch (error) {
    console.error("Error analyzing ticket with Gemini:", error);
    return null;
  }
};

export const generateResolutionSummary = async (tickets: string): Promise<string> => {
   try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Summarize the current status of these tickets and suggest general improvements for the team:\n${tickets}`,
    });
    return response.text || "Unable to generate summary.";
  } catch (error) {
    console.error("Error generating summary:", error);
    return "Error generating summary.";
  }
}
