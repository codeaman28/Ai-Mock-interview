import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  generateQuestions,
  evaluateSingleAnswer,
  saveInterviewSession,
  getInterviewResult
} from "../controllers/interviewController.js";

const router = express.Router();

// All interview routes require authentication
router.use(protect);

// API Endpoints
router.post("/generate", generateQuestions);
router.post("/evaluate", evaluateSingleAnswer);
router.post("/save", saveInterviewSession);
router.get("/:id", getInterviewResult);

export default router;
