import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Brain, AlertCircle, Loader2 } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { authService } from "../services/authService.js";
import { useAuth } from "../context/AuthContext.jsx";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".auth-element",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }
      );
    },
    { scope: containerRef }
  );

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const data = await authService.login({ email, password });
      login(data); // store token + user in context
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50 relative overflow-hidden p-4"
      ref={containerRef}
    >
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="auth-element w-full max-w-md bg-slate-900/60 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-slate-800 relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-indigo-500/10 p-2 rounded-xl border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors">
              <Brain className="w-8 h-8 text-indigo-400" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              MockAI
            </span>
          </Link>
        </div>

        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
          <p className="text-slate-400">Sign in to continue your interview prep.</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="auth-element space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 sm:py-4 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="auth-element space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-medium text-slate-300">Password</label>
              <a href="#" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                Forgot password?
              </a>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 sm:py-4 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="auth-element relative w-full flex justify-center items-center gap-2 py-3 sm:py-4 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="auth-element text-sm text-slate-400 text-center mt-8">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline transition-colors"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
