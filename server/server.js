import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import pool from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import protect from "./middleware/authMiddleware.js";
import resumeRoutes from "./routes/resumeRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

// ─── Security Headers ──────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ──────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: Origin ${origin} not allowed`));
      }
    },
    credentials: true,
  })
);

// ─── Rate Limiting ─────────────────────────────────────────────────────────
// Strict limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,                    // 20 attempts per window
  message: { message: "Too many requests, please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { message: "Too many requests, please slow down." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/auth", authLimiter);
app.use("/api", apiLimiter);

// ─── Body Parsers ──────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ─── Routes ────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/resume", resumeRoutes);

// ─── Health Check ──────────────────────────────────────────────────────────
app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      status: "ok",
      env: NODE_ENV,
      db: "supabase",
      time: result.rows[0].now,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// ─── Dashboard Stats (Protected) ───────────────────────────────────────────
app.get("/api/dashboard/stats", protect, async (req, res) => {
  try {
    const userId = req.user.id;

    const totalInterviews = await pool.query(
      "SELECT COUNT(*) FROM interview_sessions WHERE user_id = $1",
      [userId]
    );

    const avgScore = await pool.query(
      "SELECT ROUND(AVG(score)) as avg_score FROM interview_sessions WHERE user_id = $1",
      [userId]
    );

    const recentInterviews = await pool.query(
      `SELECT id, title, category, score, duration_minutes, status, created_at
       FROM interview_sessions
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 5`,
      [userId]
    );

    res.json({
      stats: {
        totalInterviews: parseInt(totalInterviews.rows[0].count),
        avgScore: parseInt(avgScore.rows[0].avg_score) || 0,
      },
      recentInterviews: recentInterviews.rows,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ─── 404 Handler ───────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ─── Global Error Handler ──────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(`[GLOBAL ERROR] ${err.stack || err.message}`);
  // Provide a generic error response without leaking stack traces
  res.status(err.status || 500).json({
    message: err.message || "Internal server error"
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${NODE_ENV} mode on port ${PORT}`);
});
