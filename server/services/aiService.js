import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const transcribeAudioFile = async (base64Audio) => {
  const prompt = "Please transcribe this audio exactly as spoken. Do not add any conversational text. Return only the raw transcript string. If it is silent or incomprehensible, return an empty string.";
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: "audio/webm",
            data: base64Audio
          }
        },
        prompt
      ],
      config: { temperature: 0.1 },
    });
    return response.text.trim();
  } catch (error) {
    console.error("Gemini Transcribe API error:", error);
    throw new Error("Failed to transcribe audio via Gemini");
  }
};

export const generateInterviewQuestions = async (topic) => {
  const prompt = `You are an expert technical interviewer hiring for a ${topic} position.
Generate exactly 5 distinct, practical, and challenging interview questions for this topic.
The questions should test real-world understanding, not just trivia.

Return ONLY a raw JSON array of strings (the questions). Do NOT wrap in markdown formatting like \`\`\`json.
Example output format:
[
  "Can you explain the difference between a process and a thread?",
  "How would you design a scalable URL shortener?"
]`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    });

    const text = response.text;

    // Clean up potential markdown formatting in case Gemini didn't listen
    let cleanText = text.trim();
    if (cleanText.startsWith("```json")) {
      cleanText = cleanText.replace(/```json\n?/, "").replace(/```\n?$/, "");
    } else if (cleanText.startsWith("```")) {
      cleanText = cleanText.replace(/```\n?/, "").replace(/```\n?$/, "");
    }

    const questions = JSON.parse(cleanText);

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("Invalid format returned by AI");
    }

    return questions.slice(0, 5); // Ensure exactly 5
  } catch (error) {
    console.error("AI Generation Error:", error);
    // Fallback questions if AI fails
    return [
      `Could you explain a challenging project you built related to ${topic}?`,
      `What are the core principles to keep in mind when working with ${topic}?`,
      `How do you handle error handling and edge cases in ${topic}?`,
      `Can you describe a time you had to optimize performance in a ${topic} application?`,
      `What is your approach to testing your ${topic} code?`,
    ];
  }
};

/**
 * Generate a comprehensive coaching report for the full interview session.
 */
export const generateSessionFeedback = async (topic, transcript) => {
  const transcriptText = transcript
    .map(
      (item, i) =>
        `Q${i + 1}: ${item.question}\nAnswer: ${item.answer || "(no answer)"}\nScore: ${item.score}/10\nFeedback: ${item.feedback}`,
    )
    .join("\n\n");

  const prompt = `You are an expert technical career coach. A candidate just completed a ${topic} mock interview.

Here is their full interview transcript:\n\n${transcriptText}\n\nBased on the above, generate a comprehensive coaching report.

Return ONLY a raw JSON object. Do NOT wrap in markdown. Format:
{
  "overall_summary": "2-3 sentence holistic assessment of the candidate's performance",
  "performance_level": "Excellent" | "Good" | "Average" | "Needs Work",
  "strengths": ["specific strength 1", "specific strength 2", "specific strength 3"],
  "areas_to_improve": ["specific gap 1", "specific gap 2", "specific gap 3"],
  "recommended_topics": ["topic to study 1", "topic to study 2", "topic to study 3"]
}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { temperature: 0.4 },
    });

    let text = response.text.trim();
    if (text.startsWith("```json"))
      text = text.replace(/```json\n?/, "").replace(/```\n?$/, "");
    else if (text.startsWith("```"))
      text = text.replace(/```\n?/, "").replace(/```\n?$/, "");

    return JSON.parse(text);
  } catch (error) {
    console.error("Session feedback error:", error);
    return {
      overall_summary:
        "The interview was completed. Detailed AI coaching is temporarily unavailable.",
      performance_level: "Average",
      strengths: ["Completed the full interview"],
      areas_to_improve: ["Review the AI feedback on each individual question"],
      recommended_topics: [topic],
    };
  }
};
export const evaluateAnswer = async (topic, question, answer) => {
  const prompt = `You are an expert technical interviewer assessing a candidate for a ${topic} role.

Question asked: "${question}"
Candidate's answer: "${answer}"

Grade the candidate's answer based on accuracy, depth, and clarity. 
Provide a "score" from 0 to 10 (integer).
Provide "feedback" (2-3 sentences max) explaining what they did well and what was missing or incorrect. If it's a great answer, give a high score and say why. If it's terrible or empty, give a low score and explain the correct concept simply.

Return ONLY a raw JSON object. Do NOT wrap in markdown formatting like \`\`\`json.
Example output format:
{
  "score": 8,
  "feedback": "Good understanding of the core concept. You clearly explained the main difference, but missed mentioning the edge cases involved in concurrent access."
}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.2, // lower temperature for more consistent grading
      },
    });

    const text = response.text;

    // Clean up potential markdown formatting
    let cleanText = text.trim();
    if (cleanText.startsWith("```json")) {
      cleanText = cleanText.replace(/```json\n?/, "").replace(/```\n?$/, "");
    } else if (cleanText.startsWith("```")) {
      cleanText = cleanText.replace(/```\n?/, "").replace(/```\n?$/, "");
    }

    const result = JSON.parse(cleanText);

    return {
      score: typeof result.score === "number" ? result.score : 0,
      feedback: result.feedback || "Answer recorded.",
    };
  } catch (error) {
    console.error("AI Evaluation Error:", error);
    return {
      score: 5,
      feedback: "Answer recorded. (AI evaluation temporarily unavailable)",
    };
  }
};
