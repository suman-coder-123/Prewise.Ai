import { motion } from "framer-motion";
import { BarChart3, Target, Sparkles } from "lucide-react";

const HeroCards = () => {
  return (
    <div className="relative flex justify-center items-center">
      {/* Main Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-[480px] bg-white rounded-3xl shadow-2xl shadow-slate-200/80 border border-slate-200/80 p-6"
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Dashboard</h2>
            <p className="text-sm text-slate-400">Interview Overview</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold border border-emerald-100">
            Ready
          </span>
        </div>

        {/* Readiness */}
        <div className="mt-7">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Interview Readiness</span>
            <span className="text-sm font-bold text-indigo-600">86%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-100">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "86%" }}
              transition={{ duration: 1.5, delay: 0.3 }}
              className="h-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-500"
            />
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 gap-4 mt-7">
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-2xl p-4 border border-indigo-100/50">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center mb-3">
              <Target size={16} className="text-white" />
            </div>
            <p className="text-slate-500 text-xs font-medium">Resume Score</p>
            <h3 className="mt-1 text-2xl font-extrabold text-slate-900">92%</h3>
          </div>
          <div className="bg-gradient-to-br from-violet-50 to-violet-100/50 rounded-2xl p-4 border border-violet-100/50">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center mb-3">
              <Sparkles size={16} className="text-white" />
            </div>
            <p className="text-slate-500 text-xs font-medium">AI Interviews</p>
            <h3 className="mt-1 text-2xl font-extrabold text-slate-900">18</h3>
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="mt-7">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Weekly Progress</h3>
          <div className="flex items-end gap-2 h-24">
            {[30, 60, 45, 90, 70, 100, 85].map((value, index) => (
              <motion.div
                key={index}
                initial={{ height: 0 }}
                animate={{ height: `${value}%` }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.7, ease: "easeOut" }}
                className="flex-1 rounded-t-lg bg-gradient-to-t from-indigo-600 to-indigo-400"
              />
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <span key={i} className="text-[10px] text-slate-400 flex-1 text-center">{d}</span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Floating Resume Score Card */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-6 top-8 bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-4 border border-slate-200/80 z-10"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
            <BarChart3 size={18} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">ATS Score</p>
            <h2 className="text-lg font-extrabold text-slate-900">92%</h2>
          </div>
        </div>
      </motion.div>

      {/* Floating AI Card */}
      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -right-6 bottom-10 bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-4 border border-slate-200/80 z-10"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
            <Sparkles size={18} className="text-indigo-600" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">AI Questions</p>
            <h2 className="text-lg font-extrabold text-slate-900">150+</h2>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroCards;
