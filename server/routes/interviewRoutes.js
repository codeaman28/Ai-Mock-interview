import express from "express";
import multer from "multer";
import protect from "../middleware/authMiddleware.js";
import {
  generateQuestions,
  evaluateSingleAnswer,
  saveInterviewSession,
  getInterviewResult,
  transcribeAudio
} from "../controllers/interviewController.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

const router = express.Router();

// All interview routes require authentication
router.use(protect);

// API Endpoints
router.post("/generate", generateQuestions);
router.post("/evaluate", evaluateSingleAnswer);
router.post("/save", saveInterviewSession);
router.post("/transcribe", upload.single("audio"), transcribeAudio);
router.get("/:id", getInterviewResult);

export default router;
