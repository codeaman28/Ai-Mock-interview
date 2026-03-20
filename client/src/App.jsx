import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Interview from "./pages/Interview";
import Result from "./pages/Result";
import Landing from "./pages/Landing";
import ResumeUpload from "./pages/ResumeUpload";

// Protected route — redirects to /login if not authenticated
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Global layout wraps every page with Navbar + Footer
function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/interview"
          element={
            <ProtectedRoute>
              <Interview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/result"
          element={
            <ProtectedRoute>
              <Result />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resume"
          element={
            <ProtectedRoute>
              <ResumeUpload />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
}

export default App;
