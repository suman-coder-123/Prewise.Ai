import { motion } from "framer-motion";

const ProgressBar = ({
  progress,
  color = "bg-indigo-600",
}) => {
  return (
    <div className="h-2 rounded-full bg-slate-200">

      <motion.div
        initial={{
          width: 0,
        }}
        whileInView={{
          width: `${progress}%`,
        }}
        transition={{
          duration: 1,
        }}
        className={`h-2 rounded-full ${color}`}
      />

    </div>
  );
};

export default ProgressBar;