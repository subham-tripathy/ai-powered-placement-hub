import { GoogleGenAI } from "@google/genai";

const API_KEY = 'AIzaSyBzNUD6nsqTFQsPo2f6ORkYIHa6McxAf6E';
const ai = new GoogleGenAI({ apiKey: API_KEY });

let chatSession = null;
let history = [];

export const initInterview = async (jd, resume, candidateName) => {
  const firstMessage = `You are an AI interviewer. Conduct a professional and realistic interview based on:

JOB DESCRIPTION: ${jd}

RESUME: ${resume}

Rules:
- Ask one question at a time
- Ask 5 questions total
- Start with a friendly greeting
- The first question should always be: "Please introduce yourself and briefly describe your background."
- Subsequent questions should be relevant to the candidate's experience and skills from the resume.
- After all questions are asked, start the response with "[DONE]"

Begin the interview with the greeting and first question.`;

  // Start history with a user message
  history = [
    { role: "user", parts: [{ text: firstMessage }] }
  ];

  // Create chat session
  chatSession = ai.chats.create({
    model: "gemini-2.5-flash-lite",
    history: history
  });

  const response = await chatSession.sendMessage({
    message: firstMessage,
    temperature: 0.7
  });

  const msg = response.text;

  // Push assistant response to history
  history.push({ role: "model", parts: [{ text: msg }] });

  return { message: msg.replace("[DONE]", "").trim(), isDone: msg.includes("[DONE]") };
};

export const sendAnswer = async (answer) => {
  // Push the user's answer to the history
  history.push({
    role: 'user',
    parts: [{ text: answer }],
  });

  // Call chatSession.sendMessage to process the conversation with AI and get a response
  const response = await chatSession.sendMessage({
    message: answer,
    temperature: 0.7,
  });

  const msg = response.text;

  // Push assistant response to history
  history.push({ role: "model", parts: [{ text: msg }] });

  // Return the AI's response (could be formatted as needed)
  return { message: msg.trim(), isDone: msg.includes("[DONE]") };
};




export const getFeedback = async () => {
  if (!chatSession) {
    throw new Error("Chat session not initialized");
  }

  const feedbackPrompt = "Give brief feedback: Score/10, Strengths, Improvements, Recommendation.";
  history.push({ role: "user", parts: [{ text: feedbackPrompt }] });

  const response = await chatSession.sendMessage({
    message: feedbackPrompt,
    temperature: 0.7,
  });

  const msg = response.text;
  history.push({ role: "model", parts: [{ text: msg }] });

  return { message: msg.trim(), isDone: true };
};

export const reset = () => {
  history = [];
  chatSession = null;
};
