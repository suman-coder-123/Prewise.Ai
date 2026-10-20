import { motion } from "framer-motion";

const Card = ({
  children,
  className = "",
  hover = true,
}) => {
  return (
    <motion.div
      whileHover={
        hover
          ? {
              y: -4,
            }
          : {}
      }
      transition={{
        duration: 0.25,
      }}
      className={`
        bg-white
        rounded-3xl
        border
        border-slate-200
        shadow-sm
        hover:shadow-xl
        transition-all
        duration-300
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

export default Card;