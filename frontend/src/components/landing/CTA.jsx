import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 p-12 sm:p-16 text-center">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles size={14} />
              Start for free — No credit card required
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight max-w-2xl mx-auto">
              Ready to Ace Your Next Interview?
            </h2>

            <p className="mt-5 text-lg text-white/70 max-w-xl mx-auto leading-relaxed">
              Join thousands of developers who are preparing smarter with
              AI-powered tools. Get started in seconds.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 bg-white text-indigo-700 hover:bg-slate-50 px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-xl shadow-black/10"
              >
                Get Started Free
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-2xl font-bold transition-all duration-300"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
