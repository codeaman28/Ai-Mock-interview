import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { interviewService } from "../services/interviewService.js";
import { 
  BrainCircuit, 
  Code2, 
  Database, 
  Cpu, 
  Users, 
  ChevronRight, 
  Loader2, 
  AlertCircle,
  Play,
  CheckCircle2
} from "lucide-react";

export default function Interview() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();

  // Resume flow: questions passed from ResumeUpload via navigation state
  const resumeState = location.state;

  // Game State: 'setup' -> 'loading' -> 'interview' -> 'saving'
  const [stage, setStage] = useState("setup");
  const [topic, setTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [error, setError] = useState("");
  
  // Interview Data
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [transcript, setTranscript] = useState([]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const startTimeRef = useRef(null);

  // Auto-start interview when coming from Resume Upload
  useEffect(() => {
    if (resumeState?.fromResume && Array.isArray(resumeState.resumeQuestions) && resumeState.resumeQuestions.length > 0) {
      setTopic(resumeState.topic || "Resume-Based");
      setQuestions(resumeState.resumeQuestions);
      startTimeRef.current = Date.now();
      setStage("interview");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const predefinedTopics = [
    { id: "React", icon: Code2, label: "React & Hooks", color: "text-cyan-400" },
    { id: "Node.js", icon: Database, label: "Node.js & Express", color: "text-green-400" },
    { id: "System Design", icon: Cpu, label: "System Design", color: "text-purple-400" },
    { id: "Behavioral", icon: Users, label: "Behavioral & Leadership", color: "text-orange-400" }
  ];

  const handleStart = async () => {
    const finalTopic = topic === "Custom" ? customTopic : topic;
    if (!finalTopic.trim()) {
      setError("Please select or type a topic.");
      return;
    }
    
    setError("");
    setStage("loading");
    
    try {
      const gQuestions = await interviewService.generateQuestions(finalTopic, token);
      setQuestions(gQuestions);
      startTimeRef.current = Date.now();
      setStage("interview");
    } catch (err) {
      setError(err.message || "Failed to generate questions. Please try again.");
      setStage("setup");
    }
  };

  const handleEvaluateAnswer = async () => {
    if (!currentAnswer.trim()) {
      setError("Please enter an answer.");
      return;
    }

    setError("");
    setIsEvaluating(true);
    
    const finalTopic = topic === "Custom" ? customTopic : topic;
    const currentQ = questions[currentIndex];

    try {
      const evaluation = await interviewService.evaluateAnswer(
        finalTopic,
        currentQ,
        currentAnswer,
        token
      );
      
      const updatedTranscript = [
        ...transcript,
        {
          question: currentQ,
          answer: currentAnswer,
          score: evaluation.score,
          feedback: evaluation.feedback
        }
      ];
      
      setTranscript(updatedTranscript);
      
      if (currentIndex < questions.length - 1) {
        setCurrentAnswer("");
        setCurrentIndex(prev => prev + 1);
        setIsEvaluating(false);
      } else {
        // Finished all questions
        await handleSaveSession(finalTopic, updatedTranscript);
      }
    } catch (err) {
      setError(err.message || "Failed to evaluate answer. Try submitting again.");
      setIsEvaluating(false);
    }
  };

  const handleSaveSession = async (finalTopic, finalTranscript) => {
    setStage("saving");
    try {
      const durationMinutes = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 60000));
      const sessionId = await interviewService.saveSession({
        topic: finalTopic,
        durationMinutes,
        transcript: finalTranscript
      }, token);
      
      navigate(`/result?id=${sessionId}`);
    } catch (err) {
      setError("Interview finished, but failed to save. " + (err.message || ""));
      setStage("saving_error");
    }
  };

  // ---------------------------------------------------------------------------
  // RENDER: SETUP STAGE
  // ---------------------------------------------------------------------------
  if (stage === "setup") {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        {/* Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
              <BrainCircuit className="w-8 h-8 text-indigo-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Configure Your Interview</h1>
            <p className="text-slate-400">Select a topic for the AI to generate a custom technical mock interview.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {predefinedTopics.map((t) => (
              <button
                key={t.id}
                onClick={() => setTopic(t.id)}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 text-left ${
                  topic === t.id 
                    ? "bg-indigo-600/20 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]" 
                    : "bg-slate-950/50 border-slate-800 hover:border-slate-600"
                }`}
              >
                <div className={`w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center ${t.color}`}>
                  <t.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-white">{t.label}</div>
                  <div className="text-xs text-slate-500">5 tailored questions</div>
                </div>
              </button>
            ))}
            
            <button
              onClick={() => setTopic("Custom")}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 text-left ${
                topic === "Custom" 
                  ? "bg-indigo-600/20 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]" 
                  : "bg-slate-950/50 border-slate-800 hover:border-slate-600"
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-yellow-400">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-white">Custom Topic</div>
                <div className="text-xs text-slate-500">Type what you want</div>
              </div>
            </button>
          </div>

          {topic === "Custom" && (
            <div className="mb-8 animate-in fade-in slide-in-from-top-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">What do you want to practice?</label>
              <input 
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="e.g. Next.js App Router, Docker, Python Data Structures..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              />
            </div>
          )}

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-4 mt-8">
            <button onClick={() => navigate("/dashboard")} className="px-6 py-3 text-slate-400 hover:text-white transition-colors">
              Cancel
            </button>
            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]"
            >
              <Play className="w-4 h-4 fill-white" />
              Begin Interview
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: LOADING STAGES
  // ---------------------------------------------------------------------------
  if (stage === "loading" || stage === "saving") {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-24 h-24 relative mb-8">
          <div className="absolute inset-0 rounded-full border-t-2 border-indigo-500 animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-r-2 border-cyan-500 animate-spin-reverse"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <BrainCircuit className="w-8 h-8 text-white animate-pulse" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          {stage === "loading" ? "Generating Context..." : "Processing Results..."}
        </h2>
        <p className="text-slate-400 max-w-sm text-center">
          {stage === "loading" 
            ? "Our AI is crafting a custom set of deep technical questions for your interview." 
            : "The AI is finalizing your evaluation and calculating your overall score."}
        </p>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: INTERVIEW STAGE
  // ---------------------------------------------------------------------------
  if (stage === "interview") {
    const progress = ((currentIndex) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-slate-950 flex flex-col pt-20">
        {/* Header / Progress */}
        <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4 sm:flex sm:items-center justify-between">
            <div className="flex items-center gap-3 mb-4 sm:mb-0">
              <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                <BrainCircuit className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-white font-semibold">Mock Interview</h2>
                <div className="text-xs text-slate-400">{topic === "Custom" ? customTopic : (resumeState?.fromResume ? "📄 Resume-Based" : topic)}</div>
              </div>
            </div>
            
            <div className="flex-1 max-w-xs mx-auto sm:mx-0 w-full ml-auto">
              <div className="flex justify-between text-xs text-slate-400 mb-2 font-medium">
                <span>Question {currentIndex + 1} of {questions.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 flex flex-col">
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Question Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 mb-6 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
            <h3 className="text-slate-400 text-sm font-medium mb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              AI Interviewer
            </h3>
            <p className="text-xl sm:text-2xl text-white font-medium leading-relaxed">
              {questions[currentIndex]}
            </p>
          </div>

          {/* Answer Box */}
          <div className="flex-1 flex flex-col min-h-[300px]">
            <h3 className="text-slate-400 text-sm font-medium mb-3 flex items-center gap-2 px-1">
              <Code2 className="w-4 h-4 text-cyan-400" />
              Your Answer
            </h3>
            <textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Type your complete answer here. Discuss trade-offs, edge cases, and best practices to score higher..."
              className="flex-1 w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none shadow-inner"
              disabled={isEvaluating}
            />
          </div>

          {/* Action Footer */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleEvaluateAnswer}
              disabled={isEvaluating}
              className="group flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-semibold transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] disabled:shadow-none"
            >
              {isEvaluating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : currentIndex === questions.length - 1 ? (
                <>
                  Finish & Get Results
                  <CheckCircle2 className="w-5 h-5 text-green-300" />
                </>
              ) : (
                <>
                  Submit & Next Question
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
