import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BrainCircuit,
  Play,
  Clock,
  TrendingUp,
  Target,
  Award,
  ChevronRight,
  Calendar,
  BarChart2,
  Zap,
  BookOpen,
  LogOut,
  Flame,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { authService } from "../services/authService.js";

function StatCard({ icon: Icon, label, value, color, gradient, suffix = "" }) {
  return (
    <div
      className={`relative overflow-hidden bg-slate-900/60 backdrop-blur border border-slate-800 rounded-2xl p-6 group hover:border-slate-700 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,0,0,0.3)]`}
    >
      {/* Gradient background accent */}
      <div
        className={`absolute top-0 right-0 w-24 h-24 ${gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}
      />
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${color} bg-opacity-10`}>
          <Icon className={`w-5 h-5 ${color.replace("bg-", "text-")}`} />
        </div>
        <span className="text-xs text-slate-500 font-medium">ALL TIME</span>
      </div>
      <div className="text-3xl font-bold text-white mb-1">
        {value}
        <span className="text-lg text-slate-400 ml-1">{suffix}</span>
      </div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  );
}

function CategoryBadge({ category }) {
  const colors = {
    "Data Structures": "text-blue-400 bg-blue-400/10",
    Algorithms: "text-purple-400 bg-purple-400/10",
    "System Design": "text-orange-400 bg-orange-400/10",
    Behavioral: "text-green-400 bg-green-400/10",
    General: "text-cyan-400 bg-cyan-400/10",
  };
  return (
    <span
      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
        colors[category] || colors["General"]
      }`}
    >
      {category}
    </span>
  );
}

function ScoreBadge({ score }) {
  const color =
    score >= 80
      ? "text-green-400"
      : score >= 60
      ? "text-yellow-400"
      : "text-red-400";
  return <span className={`font-bold text-sm ${color}`}>{score}%</span>;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const [stats, setStats] = useState({ totalInterviews: 0, avgScore: 0 });
  const [recentInterviews, setRecentInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await authService.getDashboardStats(token);
        setStats(data.stats);
        setRecentInterviews(data.recentInterviews);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    if (token) fetchDashboard();
  }, [token]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const quickStartCards = [
    {
      icon: BrainCircuit,
      title: "Technical Round",
      desc: "Data Structures & Algorithms",
      color: "from-indigo-600 to-purple-600",
      glow: "rgba(99,102,241,0.3)",
    },
    {
      icon: Target,
      title: "System Design",
      desc: "Architect scalable systems",
      color: "from-cyan-600 to-blue-600",
      glow: "rgba(6,182,212,0.3)",
    },
    {
      icon: BookOpen,
      title: "Behavioral",
      desc: "STAR method coaching",
      color: "from-emerald-600 to-teal-600",
      glow: "rgba(16,185,129,0.3)",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Background orbs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-[0_0_25px_rgba(99,102,241,0.4)] flex-shrink-0">
              {getUserInitials(user?.name)}
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-0.5">Welcome back,</p>
              <h1 className="text-2xl sm:text-3xl font-bold">
                {user?.name || "User"} 👋
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/interview")}
              className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)]"
            >
              <Zap className="w-4 h-4" />
              Start Interview
            </button>
            <button
              onClick={() => { logout(); navigate("/"); }}
              className="flex items-center gap-2 px-4 py-3 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-400/40 rounded-xl transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard
            icon={Play}
            label="Total Interviews"
            value={isLoading ? "—" : stats.totalInterviews}
            color="bg-indigo-500"
            gradient="bg-indigo-500"
          />
          <StatCard
            icon={BarChart2}
            label="Average Score"
            value={isLoading ? "—" : stats.avgScore}
            suffix="%"
            color="bg-cyan-500"
            gradient="bg-cyan-500"
          />
          <StatCard
            icon={Flame}
            label="Current Streak"
            value="—"
            suffix=" days"
            color="bg-orange-500"
            gradient="bg-orange-500"
          />
          <StatCard
            icon={Award}
            label="Best Category"
            value="—"
            color="bg-purple-500"
            gradient="bg-purple-500"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Start — 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Start Interview */}
            <div className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-indigo-400" />
                  Quick Start
                </h2>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {quickStartCards.map(({ icon: Icon, title, desc, color, glow }) => (
                  <button
                    key={title}
                    onClick={() => navigate("/interview")}
                    className="group relative overflow-hidden bg-slate-950/60 border border-slate-800 hover:border-slate-600 rounded-xl p-5 text-left transition-all duration-300"
                    style={{
                      "--glow": glow,
                    }}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="font-semibold text-white text-sm mb-1">{title}</div>
                    <div className="text-xs text-slate-400">{desc}</div>
                    <ChevronRight className="absolute top-4 right-4 w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Interviews */}
            <div className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  Recent Interviews
                </h2>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : recentInterviews.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <BrainCircuit className="w-8 h-8 text-indigo-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">No interviews yet</h3>
                  <p className="text-slate-400 text-sm mb-5">
                    Start your first AI-powered mock interview to see results here.
                  </p>
                  <button
                    onClick={() => navigate("/interview")}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-colors"
                  >
                    Start First Interview
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentInterviews.map((interview) => (
                    <div
                      key={interview.id}
                      onClick={() => navigate(`/result?id=${interview.id}`)}
                      className="flex items-center justify-between p-4 bg-slate-950/50 rounded-xl border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                          <BrainCircuit className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                          <div className="font-medium text-white text-sm">
                            {interview.title}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <CategoryBadge category={interview.category} />
                            <span className="text-xs text-slate-500">
                              {formatDate(interview.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                          <ScoreBadge score={interview.score} />
                          <div className="text-xs text-slate-500 mt-0.5">
                            {interview.duration_minutes}m
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column — Profile + Tips */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                Your Profile
              </h2>
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
                  {getUserInitials(user?.name)}
                </div>
                <h3 className="font-bold text-white text-xl mb-1">{user?.name}</h3>
                <p className="text-slate-400 text-sm mb-5">{user?.email}</p>
                <div className="w-full h-px bg-slate-800 mb-5" />
                <div className="w-full space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Member since
                    </span>
                    <span className="text-slate-200 font-medium">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 flex items-center gap-2">
                      <Play className="w-4 h-4" /> Interviews
                    </span>
                    <span className="text-slate-200 font-medium">
                      {stats.totalInterviews}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/20 rounded-2xl p-6">
              <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                Pro Tip
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Practice the{" "}
                <span className="text-indigo-300 font-medium">STAR method</span> for
                behavioral questions — Situation, Task, Action, Result. Structured
                answers consistently score 20% higher.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
