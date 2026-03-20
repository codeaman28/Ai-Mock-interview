import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

function ResumeUpload() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null); // { skills, questions }
  const fileInputRef = useRef(null);

  // ─── File selection ───────────────────────────────────────────────────────
  const handleFile = (selected) => {
    setError("");
    setResult(null);
    if (!selected) return;
    if (selected.type !== "application/pdf") {
      setError("Only PDF files are supported.");
      return;
    }
    if (selected.size > 5 * 1024 * 1024) {
      setError("File is too large. Maximum size is 5MB.");
      return;
    }
    setFile(selected);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  // ─── Upload & AI Analysis ─────────────────────────────────────────────────
  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF resume first.");
      return;
    }
    if (!token) {
      setError("You must be logged in to upload a resume.");
      return;
    }

    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await fetch(`${API_URL}/resume/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // NOTE: Do NOT set Content-Type here — browser sets it with
          // the correct multipart boundary automatically
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to process resume");
      }

      setResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Start interview from resume questions ────────────────────────────────
  const handleStartInterview = () => {
    // Pass questions to Interview page via navigation state
    navigate("/interview", {
      state: {
        fromResume: true,
        resumeQuestions: result.questions,
        topic: "Resume-Based",
      },
    });
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.iconWrap}>
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="url(#grad1)">
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#a78bfa" />
                </linearGradient>
              </defs>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 style={styles.title}>Resume Analysis</h1>
          <p style={styles.subtitle}>
            Upload your PDF resume and our AI will generate personalised interview questions based on your skills and experience.
          </p>
        </div>

        {/* Drop Zone */}
        {!result && (
          <div
            style={{
              ...styles.dropZone,
              ...(isDragging ? styles.dropZoneActive : {}),
              ...(file ? styles.dropZoneFile : {}),
            }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              style={{ display: "none" }}
              onChange={(e) => handleFile(e.target.files?.[0])}
            />

            {file ? (
              <>
                <span style={styles.fileIcon}>📄</span>
                <p style={styles.fileName}>{file.name}</p>
                <p style={styles.fileSize}>{(file.size / 1024).toFixed(1)} KB</p>
                <p style={styles.changeHint}>Click to change file</p>
              </>
            ) : (
              <>
                <span style={styles.uploadIcon}>☁️</span>
                <p style={styles.dropText}>
                  {isDragging ? "Drop your resume here" : "Drag & drop your PDF here"}
                </p>
                <p style={styles.dropSub}>or click to browse (PDF only, max 5MB)</p>
              </>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={styles.errorBox}>
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Upload Button */}
        {!result && (
          <button
            onClick={handleUpload}
            disabled={!file || isLoading}
            style={{
              ...styles.uploadBtn,
              ...(!file || isLoading ? styles.uploadBtnDisabled : {}),
            }}
          >
            {isLoading ? (
              <span style={styles.spinnerWrap}>
                <span style={styles.spinner} />
                Analysing Resume with AI…
              </span>
            ) : (
              "✨ Analyse Resume & Generate Questions"
            )}
          </button>
        )}

        {/* Results */}
        {result && (
          <div style={styles.resultsWrap}>
            {/* Skills */}
            {result.skills?.length > 0 && (
              <div style={styles.skillsSection}>
                <h2 style={styles.sectionTitle}>🔍 Skills Detected</h2>
                <div style={styles.skillsRow}>
                  {result.skills.map((skill, i) => (
                    <span key={i} style={styles.skillChip}>{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Questions */}
            <div>
              <h2 style={styles.sectionTitle}>🤖 AI-Generated Interview Questions</h2>
              <p style={styles.questionsSubtitle}>
                {result.questions.length} tailored questions based on your resume
              </p>
              <div style={styles.questionsList}>
                {result.questions.map((q, i) => (
                  <div key={i} style={styles.questionCard}>
                    <span style={styles.questionNum}>Q{i + 1}</span>
                    <p style={styles.questionText}>{q}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={styles.actionsRow}>
              <button style={styles.startBtn} onClick={handleStartInterview}>
                🚀 Start Interview with These Questions
              </button>
              <button
                style={styles.uploadAgainBtn}
                onClick={() => { setResult(null); setFile(null); setError(""); }}
              >
                Upload Different Resume
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0c29, #1a1a3e, #0f0c29)",
    padding: "48px 16px",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  container: {
    maxWidth: "720px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  header: {
    textAlign: "center",
  },
  iconWrap: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 64,
    height: 64,
    borderRadius: 16,
    background: "rgba(99, 102, 241, 0.15)",
    border: "1px solid rgba(99, 102, 241, 0.3)",
    marginBottom: 16,
  },
  title: {
    fontSize: "2rem",
    fontWeight: 700,
    color: "#fff",
    margin: "0 0 8px",
    background: "linear-gradient(135deg, #818cf8, #a78bfa)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    color: "rgba(255,255,255,0.55)",
    fontSize: "0.95rem",
    maxWidth: 480,
    margin: "0 auto",
    lineHeight: 1.6,
  },
  dropZone: {
    border: "2px dashed rgba(99,102,241,0.4)",
    borderRadius: 16,
    padding: "48px 24px",
    textAlign: "center",
    cursor: "pointer",
    background: "rgba(99,102,241,0.05)",
    transition: "all 0.2s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  dropZoneActive: {
    border: "2px dashed #818cf8",
    background: "rgba(99,102,241,0.12)",
    transform: "scale(1.01)",
  },
  dropZoneFile: {
    border: "2px solid rgba(99,102,241,0.5)",
    background: "rgba(99,102,241,0.08)",
  },
  uploadIcon: { fontSize: 40 },
  fileIcon: { fontSize: 40 },
  dropText: { color: "#c4b5fd", fontSize: "1.05rem", fontWeight: 600, margin: 0 },
  dropSub: { color: "rgba(255,255,255,0.35)", fontSize: "0.85rem", margin: 0 },
  fileName: { color: "#a5b4fc", fontWeight: 600, fontSize: "1rem", margin: 0 },
  fileSize: { color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", margin: 0 },
  changeHint: { color: "rgba(255,255,255,0.3)", fontSize: "0.78rem", margin: 0 },
  errorBox: {
    background: "rgba(239,68,68,0.12)",
    border: "1px solid rgba(239,68,68,0.4)",
    borderRadius: 10,
    padding: "12px 16px",
    color: "#fca5a5",
    fontSize: "0.9rem",
    display: "flex",
    gap: 8,
    alignItems: "center",
  },
  uploadBtn: {
    width: "100%",
    padding: "14px",
    borderRadius: 12,
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#fff",
    fontWeight: 700,
    fontSize: "1rem",
    border: "none",
    cursor: "pointer",
    transition: "opacity 0.2s ease, transform 0.1s ease",
    letterSpacing: "0.02em",
  },
  uploadBtnDisabled: {
    opacity: 0.45,
    cursor: "not-allowed",
    transform: "none",
  },
  spinnerWrap: { display: "flex", alignItems: "center", justifyContent: "center", gap: 10 },
  spinner: {
    display: "inline-block",
    width: 18,
    height: 18,
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  resultsWrap: {
    display: "flex",
    flexDirection: "column",
    gap: 28,
  },
  skillsSection: {},
  sectionTitle: {
    color: "#c4b5fd",
    fontSize: "1.05rem",
    fontWeight: 700,
    marginBottom: 12,
  },
  questionsSubtitle: {
    color: "rgba(255,255,255,0.4)",
    fontSize: "0.85rem",
    marginBottom: 16,
  },
  skillsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  skillChip: {
    background: "rgba(99,102,241,0.2)",
    border: "1px solid rgba(99,102,241,0.35)",
    color: "#a5b4fc",
    padding: "4px 12px",
    borderRadius: 999,
    fontSize: "0.82rem",
    fontWeight: 600,
    textTransform: "capitalize",
  },
  questionsList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  questionCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: "14px 16px",
    display: "flex",
    gap: 14,
    alignItems: "flex-start",
  },
  questionNum: {
    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    color: "#fff",
    fontSize: "0.75rem",
    fontWeight: 700,
    borderRadius: 6,
    padding: "2px 8px",
    flexShrink: 0,
    marginTop: 2,
  },
  questionText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: "0.9rem",
    lineHeight: 1.6,
    margin: 0,
  },
  actionsRow: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },
  startBtn: {
    flex: 1,
    minWidth: 200,
    padding: "13px 20px",
    borderRadius: 12,
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#fff",
    fontWeight: 700,
    fontSize: "0.95rem",
    border: "none",
    cursor: "pointer",
    letterSpacing: "0.01em",
  },
  uploadAgainBtn: {
    padding: "13px 20px",
    borderRadius: 12,
    background: "transparent",
    color: "rgba(255,255,255,0.55)",
    fontWeight: 600,
    fontSize: "0.9rem",
    border: "1px solid rgba(255,255,255,0.12)",
    cursor: "pointer",
  },
};

// Inject spin keyframe once
if (typeof document !== "undefined" && !document.getElementById("resume-spin-style")) {
  const style = document.createElement("style");
  style.id = "resume-spin-style";
  style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
  document.head.appendChild(style);
}

export default ResumeUpload;
