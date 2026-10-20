import { motion } from "framer-motion";

const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {

  const variants = {

    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700",

    secondary:
      "bg-white border border-slate-300 hover:bg-slate-100",

    success:
      "bg-green-600 text-white hover:bg-green-700",

  };

  return (
    <motion.button
      whileTap={{
        scale: 0.96,
      }}
      whileHover={{
        scale: 1.02,
      }}
      className={`
        px-6
        py-3
        rounded-xl
        font-medium
        transition-all
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;