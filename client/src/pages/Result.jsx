import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { interviewService } from "../services/interviewService.js";
import { 
  Trophy, 
  BrainCircuit, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  ArrowLeft,
  MessageSquare
} from "lucide-react";

export default function Result() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("id");
  const navigate = useNavigate();
  const { token } = useAuth();

  const [session, setSession] = useState(null);
  const [transcript, setTranscript] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) {
      navigate("/dashboard");
      return;
    }

    const fetchResult = async () => {
      try {
        const data = await interviewService.getResult(sessionId, token);
        setSession(data.session);
        setTranscript(data.transcript);
      } catch (err) {
        setError(err.message || "Failed to load interview results.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResult();
  }, [sessionId, token, navigate]);

  const getScoreColor = (score) => {
    if (score >= 8) return "text-green-400 bg-green-400/10 border-green-500/30";
    if (score >= 5) return "text-yellow-400 bg-yellow-400/10 border-yellow-500/30";
    return "text-red-400 bg-red-400/10 border-red-500/30";
  };

  const getScoreGradient = (score) => {
    if (score >= 80) return "from-emerald-500 to-teal-400";
    if (score >= 50) return "from-yellow-500 to-orange-400";
    return "from-red-500 to-pink-500";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-slate-400 font-medium animate-pulse">Analyzing Interview Session...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Error Loading Results</h2>
        <p className="text-slate-400 mb-6">{error}</p>
        <button 
          onClick={() => navigate("/dashboard")}
          className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-950 pt-28 pb-16">
      
      {/* Background Orbs */}
      <div className="fixed top-20 left-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header / Back Button */}
        <button 
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        {/* Hero Score Card */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 sm:p-12 mb-10 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]" />

          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/50 text-indigo-300 text-sm font-medium mb-6">
              <BrainCircuit className="w-4 h-4" />
              {session.category} Interview
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Interview Results</h1>
            <div className="flex flex-wrap items-center gap-6 text-slate-400 font-medium">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-500" />
                {session.duration_minutes} Minutes
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                {transcript.length} Questions Answered
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative w-40 h-40 flex items-center justify-center mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="74" fill="none" stroke="currentColor" className="text-slate-800" strokeWidth="12" />
                <circle 
                  cx="80" cy="80" r="74" fill="none" 
                  stroke="url(#score-gradient)" className="transition-all duration-1000 ease-out" 
                  strokeWidth="12"
                  strokeDasharray={`${2 * Math.PI * 74}`}
                  strokeDashoffset={`${2 * Math.PI * 74 * (1 - session.score / 100)}`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={session.score >= 80 ? "#10b981" : session.score >= 50 ? "#f59e0b" : "#ef4444"} />
                    <stop offset="100%" stopColor={session.score >= 80 ? "#2dd4bf" : session.score >= 50 ? "#fb923c" : "#ec4899"} />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-white">{session.score}</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">out of 100</span>
              </div>
            </div>
            <div className={`text-sm font-semibold tracking-wide ${
              session.score >= 80 ? "text-emerald-400" : session.score >= 50 ? "text-yellow-400" : "text-red-400"
            }`}>
              {session.score >= 80 ? "EXCELLENT PERFORMANCE" : session.score >= 50 ? "GOOD EFFORT" : "NEEDS IMPROVEMENT"}
            </div>
          </div>
        </div>

        {/* Detailed Feedback Section */}
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-indigo-400" />
          Detailed Feedback
        </h2>

        <div className="space-y-6">
          {transcript.map((item, index) => (
            <div key={item.id || index} className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-colors">
              
              {/* Question Header */}
              <div className="bg-slate-900/80 p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="text-indigo-400 text-sm font-bold mb-2">QUESTION {index + 1}</div>
                  <h3 className="text-lg text-white font-medium leading-relaxed">{item.question_text}</h3>
                </div>
                <div className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl border font-bold text-lg shadow-sm ${getScoreColor(item.score)}`}>
                  {item.score}<span className="text-sm opacity-60">/10</span>
                </div>
              </div>

              {/* Answer & Feedback Body */}
              <div className="p-6 grid md:grid-cols-2 gap-6">
                
                {/* User Answer */}
                <div>
                  <div className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                    Your Answer
                  </div>
                  <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4 text-slate-300 text-sm leading-relaxed min-h-[120px] whitespace-pre-wrap font-mono text-opacity-90">
                    {item.user_answer}
                  </div>
                </div>

                {/* AI Feedback */}
                <div>
                  <div className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    AI Feedback
                  </div>
                  <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-xl p-4 text-indigo-100 text-sm leading-relaxed min-h-[120px] shadow-inner shadow-indigo-900/20">
                    {item.ai_feedback}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
        
        {/* Bottom CTA */}
        <div className="mt-12 flex justify-center">
          <button 
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-all shadow-lg"
          >
            Return to Dashboard
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
}
