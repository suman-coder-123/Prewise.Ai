import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";

const HeroButtons = () => {
  return (
    <div className="flex flex-wrap gap-4 mt-8">
      <Link
        to="/register"
        className="group inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 text-white rounded-2xl font-semibold shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40"
      >
        Start Free
        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </Link>
      <a
        href="#product-showcase"
        className="inline-flex items-center gap-2 px-8 py-4 border-2 border-slate-200 rounded-2xl hover:border-slate-300 hover:bg-slate-50 transition-all duration-300 font-semibold text-slate-700"
      >
        <Play size={16} className="text-indigo-600" />
        See How It Works
      </a>
    </div>
  );
};

export default HeroButtons;
