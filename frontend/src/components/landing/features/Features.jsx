import {
  Brain,
  FileText,
  Briefcase,
  BarChart3,
} from "lucide-react";

import FeatureCard from "./FeatureCard";

const features = [
  {
    title: "AI Interview Generator",
    description:
      "Generate personalized interview questions based on your skills, experience and preferred technology stack.",
    icon: Brain,
    color: "from-indigo-600 to-violet-600",
    bg: "bg-indigo-50",
  },
  {
    title: "Resume Analyzer",
    description:
      "Upload your resume and receive AI-powered feedback with improvement suggestions and ATS scoring.",
    icon: FileText,
    color: "from-emerald-600 to-teal-600",
    bg: "bg-emerald-50",
  },
  {
    title: "Job Tracker",
    description:
      "Track all your job applications with a modern Kanban board from Applied to Offer.",
    icon: Briefcase,
    color: "from-amber-500 to-orange-600",
    bg: "bg-amber-50",
  },
  {
    title: "Performance Analytics",
    description:
      "Visualize your interview preparation progress with beautiful interactive charts and reports.",
    icon: BarChart3,
    color: "from-cyan-500 to-blue-600",
    bg: "bg-cyan-50",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">
            Features
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Everything You Need
          </h2>
          <p className="mt-5 text-slate-500 leading-relaxed text-lg">
            A complete platform to prepare for interviews, improve your resume
            and manage your job search.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
