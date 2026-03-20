import express from "express";
import multer from "multer";
import { createRequire } from "module";
import { GoogleGenAI } from "@google/genai";
import protect from "../middleware/authMiddleware.js";
import dotenv from "dotenv";
import fs from "fs";

import pdfParse from "pdf-parse";


dotenv.config();

const router = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ─── Multer: Memory Storage (no disk writes, production-safe) ──────────────
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max
  },
});

// ─── POST /api/resume/upload ───────────────────────────────────────────────
// Uses auth middleware to protect the route
router.post(
  "/upload",
  protect,
  upload.single("resume"),
  async (req, res) => {
    try {
      // Multer puts in-memory buffer on req.file.buffer
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded. Please attach a PDF resume." });
      }

      // Parse PDF from buffer (no disk write needed)
      const pdfData = await pdfParse(req.file.buffer);
      const resumeText = pdfData.text?.trim();

      if (!resumeText || resumeText.length < 50) {
        return res.status(422).json({
          message: "Could not extract meaningful text from the PDF. Is it a scanned image?",
        });
      }

      // Truncate to 6000 chars to stay within Gemini token limits
      const truncatedText = resumeText.slice(0, 6000);

      // ─── Gemini AI: Generate tailored questions from resume ──────────────
      const prompt = `You are a senior technical interviewer reviewing the following resume.
Analyze the candidate's skills, projects, experience, and technologies.
Generate exactly 7 tailored, insightful interview questions specifically for THIS candidate — not generic ones.
Questions should be based on what you see in their resume (e.g., specific projects, tech stack, experience level).

Resume Content:
---
${truncatedText}
---

Return ONLY a raw JSON object (no markdown, no \`\`\`json wrapper) in this exact format:
{
  "skills": ["skill1", "skill2", "skill3"],
  "questions": [
    "Question 1...",
    "Question 2...",
    "Question 3...",
    "Question 4...",
    "Question 5...",
    "Question 6...",
    "Question 7..."
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { temperature: 0.6 },
      });

      let text = response.text?.trim() ?? "";

      // Strip markdown code fences if Gemini adds them
      if (text.startsWith("```json")) {
        text = text.replace(/^```json\n?/, "").replace(/```\n?$/, "");
      } else if (text.startsWith("```")) {
        text = text.replace(/^```\n?/, "").replace(/```\n?$/, "");
      }

      const parsed = JSON.parse(text);

      if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
        throw new Error("AI returned invalid question format");
      }

      return res.json({
        skills: parsed.skills || [],
        questions: parsed.questions,
        charCount: resumeText.length,
      });
    } catch (error) {
      // Multer errors (file size, wrong type)
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({ message: "File too large. Maximum size is 5MB." });
      }
      if (error.message === "Only PDF files are allowed") {
        return res.status(415).json({ message: "Only PDF files are supported." });
      }

      fs.writeFileSync("upload_error_trace.txt", (error.stack || String(error)) + "\n\n" + JSON.stringify(error, null, 2), "utf-8");
      
      console.error("Resume upload deep stack:", error.stack || String(error));

      // If AI JSON parse fails, try to return a partial result
      if (error instanceof SyntaxError) {
        return res.status(500).json({
          message: "AI returned an unexpected response. Please try again.",
        });
      }

      return res.status(500).json({ message: "Failed to process resume. Please try again.", debug: String(error) });
    }
  }
);

export default router;
