import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowRight, Brain, AlertCircle, Loader2 } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { authService } from "../services/authService.js";
import { useAuth } from "../context/AuthContext.jsx";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    try {
      const data = await authService.register({ name, email, password });
      login(data); // store token + user in context
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
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
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="auth-element w-full max-w-md bg-slate-900/60 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-slate-800 relative z-10 my-8">
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
          <h2 className="text-3xl font-bold mb-2">Create an Account</h2>
          <p className="text-slate-400">Start your journey to technical interview mastery.</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="auth-element space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Full Name</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="auth-element space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="auth-element space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                placeholder="Min. 6 characters"
              />
            </div>
          </div>

          <div className="auth-element space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Confirm Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              </div>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="auth-element relative w-full flex justify-center items-center gap-2 py-3 sm:py-4 px-4 mt-2 border border-transparent rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="auth-element text-sm text-slate-400 text-center mt-8">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
