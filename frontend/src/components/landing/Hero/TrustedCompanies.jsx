import { motion } from "framer-motion";

const companies = [
  { name: "Google", letter: "G" },
  { name: "Microsoft", letter: "M" },
  { name: "Amazon", letter: "A" },
  { name: "Adobe", letter: "Ad" },
  { name: "Netflix", letter: "N" },
  { name: "Infosys", letter: "I" },
  { name: "TCS", letter: "T" },
  { name: "Accenture", letter: "Ac" },
];

const TrustedCompanies = () => {
  return (
    <section className="py-16 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-sm text-slate-400 font-medium uppercase tracking-wider mb-10">
          Trusted by developers preparing for interviews at
        </p>

        <div className="flex flex-wrap justify-center items-center gap-6">
          {companies.map((company, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -4, scale: 1.05 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-2.5 px-5 py-3 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md cursor-default transition-all duration-300"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-200/60">
                {company.letter}
              </div>
              <span className="font-semibold text-slate-600 text-sm">{company.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedCompanies;
