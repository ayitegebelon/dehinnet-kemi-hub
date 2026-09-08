// Qwen Cloud API Integration - Dehinnet Kemi AI v2

import axios from "axios";

const QWEN_API_KEY = process.env.QWEN_API_KEY;

export const qwenClient = axios.create({
  baseURL: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
  headers: {
    "Authorization": `Bearer ${QWEN_API_KEY}`,
    "Content-Type": "application/json"
  }
});

export async function analyzeChemical(prompt) {
  const response = await qwenClient.post("/chat/completions", {
    model: "qwen-turbo",
    messages: [
      {
        role: "system",
        content: "You are a chemical safety AI assistant for risk analysis."
      },
      {
        role: "user",
        content: prompt
      }
    ]
  });

  return response.data;
}
