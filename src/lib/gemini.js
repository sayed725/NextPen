import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateSummary(content) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const prompt = `Summarize the following content in 2-3 sentences:\n${content}`;
  const result = await model.generateContent(prompt);
  return result.response.text();
}