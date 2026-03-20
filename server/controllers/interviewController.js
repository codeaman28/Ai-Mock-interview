import pool from "../config/db.js";
import { generateInterviewQuestions, evaluateAnswer } from "../services/aiService.js";

// @desc    Generate questions for a specific topic
// @route   POST /api/interview/generate
// @access  Private
export const generateQuestions = async (req, res) => {
  try {
    const { topic } = req.body;
    
    if (!topic) {
      return res.status(400).json({ message: "Topic is required" });
    }

    const questions = await generateInterviewQuestions(topic);
    res.json({ questions });
  } catch (error) {
    console.error("Generate questions error:", error);
    res.status(500).json({ message: "Failed to generate questions" });
  }
};

// @desc    Evaluate a single answer
// @route   POST /api/interview/evaluate
// @access  Private
export const evaluateSingleAnswer = async (req, res) => {
  try {
    const { topic, question, answer } = req.body;
    
    if (!topic || !question || !answer) {
      return res.status(400).json({ message: "Topic, question, and answer are required" });
    }

    const evaluation = await evaluateAnswer(topic, question, answer);
    res.json(evaluation);
  } catch (error) {
    console.error("Evaluate answer error:", error);
    res.status(500).json({ message: "Failed to evaluate answer" });
  }
};

// @desc    Save completed interview session and transcript
// @route   POST /api/interview/save
// @access  Private
export const saveInterviewSession = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { topic, durationMinutes, transcript } = req.body;
    const userId = req.user.id;

    if (!transcript || transcript.length === 0) {
      return res.status(400).json({ message: "Transcript is required" });
    }

    // Calculate total score average
    const totalScore = transcript.reduce((sum, item) => sum + (item.score || 0), 0);
    const avgScore = Math.round((totalScore / transcript.length) * 10); // Convert X/10 sum to percentage (X/100)

    await client.query("BEGIN");

    // 1. Insert the main session
    const sessionResult = await client.query(
      `INSERT INTO interview_sessions 
       (user_id, title, category, score, duration_minutes, status) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id`,
      [
        userId, 
        `${topic} Interview`, 
        topic, 
        avgScore, 
        durationMinutes || 0, 
        "completed"
      ]
    );

    const sessionId = sessionResult.rows[0].id;

    // 2. Insert all the Q&A items into transcript table
    for (const item of transcript) {
      await client.query(
        `INSERT INTO interview_questions 
         (session_id, question_text, user_answer, ai_feedback, score) 
         VALUES ($1, $2, $3, $4, $5)`,
        [sessionId, item.question, item.answer, item.feedback, item.score]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({ 
      message: "Session saved successfully", 
      sessionId 
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Save session error:", error);
    res.status(500).json({ message: "Failed to save session" });
  } finally {
    client.release();
  }
};

// @desc    Get complete details of a specific session
// @route   GET /api/interview/:id
// @access  Private
export const getInterviewResult = async (req, res) => {
  try {
    const sessionId = req.params.id;
    const userId = req.user.id;

    // Verify session belongs to user
    const sessionResult = await pool.query(
      "SELECT * FROM interview_sessions WHERE id = $1 AND user_id = $2",
      [sessionId, userId]
    );

    if (sessionResult.rows.length === 0) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Get the transcript
    const questionsResult = await pool.query(
      "SELECT id, question_text, user_answer, ai_feedback, score FROM interview_questions WHERE session_id = $1 ORDER BY id ASC",
      [sessionId]
    );

    res.json({
      session: sessionResult.rows[0],
      transcript: questionsResult.rows
    });
  } catch (error) {
    console.error("Get result error:", error);
    res.status(500).json({ message: "Failed to fetch result" });
  }
};
