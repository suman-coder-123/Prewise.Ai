import { motion } from "framer-motion";
import { UserPlus, FileSearch, MessageSquareText, Briefcase } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Create Your Account",
    description:
      "Sign up in seconds and set up your developer profile with your skills, experience, and career goals.",
    icon: UserPlus,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    number: "02",
    title: "Upload Your Resume",
    description:
      "Upload your resume and let AI analyze your strengths, weaknesses, and ATS score instantly.",
    icon: FileSearch,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    number: "03",
    title: "Practice Interviews",
    description:
      "Generate AI-powered interview questions, attend mock interviews, and improve your confidence.",
    icon: MessageSquareText,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    number: "04",
    title: "Track Job Applications",
    description:
      "Organize every application using a beautiful Kanban board and monitor your interview progress.",
    icon: Briefcase,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">
            How It Works
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Prepare Smarter in Four Simple Steps
          </h2>
          <p className="mt-6 text-lg text-slate-500 leading-relaxed">
            Everything you need to prepare for technical interviews, improve your
            resume, and land your dream job.
          </p>
        </div>

        <div className="mt-20 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className="relative bg-white rounded-3xl p-7 border border-slate-200 shadow-sm hover:shadow-lg hover:shadow-slate-200/60 transition-all duration-300"
            >
              {/* Step number */}
              <span className="text-6xl font-extrabold text-slate-100 absolute top-4 right-5 select-none">
                {step.number}
              </span>

              <div className={`w-12 h-12 rounded-xl ${step.bg} flex items-center justify-center mb-5`}>
                <step.icon size={24} className={step.color} />
              </div>

              <h3 className="text-lg font-bold text-slate-900 relative">{step.title}</h3>
              <p className="mt-3 text-sm text-slate-500 leading-relaxed relative">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
