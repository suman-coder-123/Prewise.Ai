import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Landing from "./pages/Landing/Landing";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Login/Login";
import Register from "./pages/Login/Register";
import ResumeAnalyzer from "./pages/ResumeAnalyzer/ResumeAnalyzer";
import ResumeDashboard from "./pages/Dashboard/ResumeDashboard";
import InterviewGenerator from "./pages/InterviewGenerator/InterviewGenerator";
import JobTracker from "./pages/JobTracker/JobTracker";
import Analytics from "./pages/Analytics/Analytics";
import Settings from "./pages/Settings/Settings";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/resume-analyzer" element={<ProtectedRoute><ResumeAnalyzer /></ProtectedRoute>} />
          <Route path="/resume" element={<ProtectedRoute><ResumeDashboard /></ProtectedRoute>} />
          <Route path="/interview" element={<ProtectedRoute><InterviewGenerator /></ProtectedRoute>} />
          <Route path="/job-tracker" element={<ProtectedRoute><JobTracker /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
