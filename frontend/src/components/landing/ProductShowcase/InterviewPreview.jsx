import { motion } from "framer-motion";

const questions = [
  { q: "What is the Virtual DOM and how does it work?", tag: "React" },
  { q: "Explain the difference between JWT and Session-based auth.", tag: "Security" },
  { q: "How would you optimize a React app for performance?", tag: "Performance" },
  { q: "What are closures and how are they used in JavaScript?", tag: "JavaScript" },
];

const InterviewPreview = () => {
  return (
    <div className="bg-white rounded-[24px] border border-slate-200 shadow-xl p-6 sm:p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900">AI Interview</h3>
          <p className="text-sm text-slate-400 mt-1">Real-time practice session</p>
        </div>
        <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full text-xs font-semibold border border-emerald-100">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Live
        </span>
      </div>

      <div className="space-y-3">
        {questions.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border border-slate-200 rounded-xl p-4 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all duration-300"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-slate-800 leading-relaxed">{item.q}</p>
              <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md whitespace-nowrap shrink-0 border border-indigo-100">
                {item.tag}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-3">
        <div className="flex-1 h-1.5 rounded-full bg-slate-100">
          <div className="h-1.5 rounded-full bg-indigo-600" style={{ width: "60%" }}></div>
        </div>
        <span className="text-xs font-medium text-slate-400">3/5 answered</span>
      </div>
    </div>
  );
};

export default InterviewPreview;
