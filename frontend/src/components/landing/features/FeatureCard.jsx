import { motion } from "framer-motion";

const FeatureCard = ({ title, description, icon: Icon, color, bg }) => {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-3xl p-7 border border-slate-200 hover:border-indigo-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 cursor-default"
    >
      <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={26} className="text-indigo-600" />
      </div>

      <h3 className="mt-6 text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-3 text-sm text-slate-500 leading-relaxed">{description}</p>
    </motion.div>
  );
};

export default FeatureCard;
