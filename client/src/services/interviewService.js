const API_URL = `${import.meta.env.VITE_API_URL}/interview`;

export const interviewService = {
  /**
   * Generates 5 AI interview questions for a given topic
   */
  async generateQuestions(topic, token) {
    const res = await fetch(`${API_URL}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ topic }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to generate questions");
    return data.questions;
  },

  /**
   * Transcribes an audio blob using the backend
   */
  async transcribeAudio(audioBlob, token) {
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");

    const res = await fetch(`${API_URL}/transcribe`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to transcribe audio");
    return data.transcript;
  },

  /**
   * Evaluates a single answer using the AI
   */
  async evaluateAnswer(topic, question, answer, token) {
    const res = await fetch(`${API_URL}/evaluate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ topic, question, answer }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to evaluate answer");
    return data; // { score, feedback }
  },

  /**
   * Saves the entire completed interview session to the database
   */
  async saveSession(payload, token) {
    const res = await fetch(`${API_URL}/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to save session");
    return data.sessionId;
  },

  /**
   * Fetches a complete session result by ID
   */
  async getResult(sessionId, token) {
    const res = await fetch(`${API_URL}/${sessionId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch result");
    return data; // { session, transcript }
  },
};
