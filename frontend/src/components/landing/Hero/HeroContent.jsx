import { motion } from "framer-motion";
import HeroButtons from "./HeroButtons";
import HeroStats from "./HeroStats";

const HeroContent = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}
    >
      <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 px-5 py-2 text-sm font-semibold">
        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
        AI-Powered Interview Preparation
      </span>

      <h1 className="mt-8 text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.1] text-slate-900 tracking-tight">
        Ace Every
        <br />
        Interview{" "}
        <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
          with AI
        </span>
      </h1>

      <p className="mt-6 text-lg leading-relaxed text-slate-500 max-w-xl">
        Prepare smarter with AI-generated interview questions, resume analysis,
        mock interviews, and job tracking — everything you need to land your
        dream job.
      </p>

      <HeroButtons />
      <HeroStats />
    </motion.div>
  );
};

export default HeroContent;
