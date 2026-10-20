import { motion, AnimatePresence } from "framer-motion";

import ResumePreview from "./ResumePreview";
import InterviewPreview from "./InterviewPreview";
import JobTrackerPreview from "./JobTrackerPreview";
import AnalyticsPreview from "./AnalyticsPreview";

const content = {
  "Resume Analysis": {
    title: "Resume Score",
    score: "92%",
    color: "bg-indigo-600",
    description:
      "Analyze your resume with AI, improve ATS compatibility and discover missing skills.",
  },

  "AI Interview": {
    title: "Questions Generated",
    score: "250+",
    color: "bg-cyan-600",
    description:
      "Practice technical interviews with AI-generated questions and real interview scenarios.",
  },

  "Job Tracker": {
    title: "Applications",
    score: "34",
    color: "bg-emerald-600",
    description:
      "Organize every job application with an intuitive Kanban workflow and never miss an opportunity.",
  },

  Analytics: {
    title: "Weekly Progress",
    score: "+18%",
    color: "bg-orange-500",
    description:
      "Visualize your preparation progress using beautiful charts and performance insights.",
  },
};

const DashboardScreen = ({ activeTab }) => {
  const data = content[activeTab];

  const renderPreview = () => {
    switch (activeTab) {
      case "Resume Analysis":
        return <ResumePreview />;
      case "AI Interview":
        return <InterviewPreview />;
      case "Job Tracker":
        return <JobTrackerPreview />;
      case "Analytics":
        return <AnalyticsPreview />;
      default:
        return null;
    }
  };

  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-2xl shadow-slate-200/60">
      <div className="grid lg:grid-cols-12">
        {/* Left Side */}
        <div className="lg:col-span-4 p-8 border-b lg:border-b-0 lg:border-r border-slate-200">
          <span className={`${data.color} inline-flex rounded-xl px-4 py-2 text-sm font-semibold text-white`}>
            {activeTab}
          </span>

          <h2 className="mt-6 text-5xl font-extrabold text-slate-900">{data.score}</h2>
          <h3 className="mt-3 text-xl font-bold text-slate-800">{data.title}</h3>
          <p className="mt-4 text-sm leading-relaxed text-slate-500">{data.description}</p>

          <div className="mt-8 space-y-3">
            {[
              { label: "Accuracy", value: "98%" },
              { label: "AI Powered", value: "Enabled" },
              { label: "Real Time", value: "Active", green: true },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <span className="text-slate-400">{item.label}</span>
                <span className={`font-semibold ${item.green ? "text-emerald-600" : "text-slate-700"}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side */}
        <div className="lg:col-span-8 bg-slate-50 p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderPreview()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
