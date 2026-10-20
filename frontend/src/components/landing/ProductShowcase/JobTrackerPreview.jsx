import { motion } from "framer-motion";

const columns = [
  {
    title: "Applied",
    color: "bg-blue-50 border-blue-200",
    dot: "bg-blue-500",
    jobs: ["Google", "Amazon"],
  },
  {
    title: "Interview",
    color: "bg-amber-50 border-amber-200",
    dot: "bg-amber-500",
    jobs: ["Infosys", "Meta"],
  },
  {
    title: "Offer",
    color: "bg-emerald-50 border-emerald-200",
    dot: "bg-emerald-500",
    jobs: ["Microsoft"],
  },
];

const JobTrackerPreview = () => {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {columns.map((column, ci) => (
        <div key={column.title} className={`rounded-2xl p-4 border ${column.color}`}>
          <div className="flex items-center gap-2 mb-4">
            <span className={`w-2.5 h-2.5 rounded-full ${column.dot}`}></span>
            <h3 className="font-bold text-sm text-slate-800">{column.title}</h3>
            <span className="text-[10px] font-bold bg-white/80 text-slate-500 px-1.5 py-0.5 rounded-full ml-auto">
              {column.jobs.length}
            </span>
          </div>
          <div className="space-y-2">
            {column.jobs.map((job, ji) => (
              <motion.div
                key={job}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: ci * 0.1 + ji * 0.08 }}
                className="bg-white rounded-xl p-3.5 shadow-sm border border-slate-100"
              >
                <p className="text-sm font-semibold text-slate-800">{job}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Software Engineer</p>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobTrackerPreview;
