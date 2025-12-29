import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv"; // to read the .env file

dotenv.config();
const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); // initializes the Gemini client with the API key from the .env file

const askGemini = async (userPrompt) => {
  const result = await gemini.models.generateContent({
    model: "gemini-2.5-flash",
    contents: userPrompt
  });
  return result.text;
};

const isPositiveReview = (llmResult) => {
  // Check if the LLM response contains "positive" (case-insensitive)
  return llmResult.toLowerCase().includes("positive");
};

const run = async () => {
  const userPrompt = `
  Is the following a positive or negative review?
  "Yeah, this was the *best* book ever, only made me want to pull my eyes out of their sockets"`;

  const response = await askGemini(userPrompt);

  console.log(response);
  console.log("\n\n---\n\n");

  if (isPositiveReview(response)) {
    console.log("Celebrate.");
  } else {
    console.log("Alert the author!");
  }
};

run();
