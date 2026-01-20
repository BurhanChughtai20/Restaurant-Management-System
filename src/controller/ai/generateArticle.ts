 import { llm } from "../../libs/langchain.ts";
import { articlePrompt } from "./prompts/articlePrompt.ts";

export async function generateArticleAI(input: {
  title: string;
  restaurantName: string;
  keywords?: string;
  address?: string;
  phoneNumber?: string;
  mapLink?: string;
}) {
  const response = await llm.invoke(articlePrompt(input));

  try {
    return JSON.parse(response.content as string);
  } catch {
    throw new Error("AI response parsing failed");
  }
}
