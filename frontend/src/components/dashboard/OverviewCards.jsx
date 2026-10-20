import { motion } from "framer-motion";
import AnimatedCounter from "../ui/AnimatedCounter";

import {
  FileText,
  Brain,
  Briefcase,
  Trophy,
  ArrowUpRight,
} from "lucide-react";

const cards = [
  {
    id: 1,
    title: "Resume Score",
    value: 92,
    suffix: "%",
    icon: FileText,
    color: "bg-indigo-500",
    bg: "bg-indigo-50",
    progress: 92,
    growth: "+8%",
    status: "Excellent",
  },
  {
    id: 2,
    title: "Interview Readiness",
    value: 84,
    suffix: "%",
    icon: Brain,
    color: "bg-cyan-500",
    bg: "bg-cyan-50",
    progress: 84,
    growth: "+5%",
    status: "Good",
  },
  {
    id: 3,
    title: "Applications",
    value: 34,
    suffix: "",
    icon: Briefcase,
    color: "bg-emerald-500",
    bg: "bg-emerald-50",
    progress: 68,
    growth: "+12%",
    status: "Active",
  },
  {
    id: 4,
    title: "Completed Interviews",
    value: 18,
    suffix: "",
    icon: Trophy,
    color: "bg-orange-500",
    bg: "bg-orange-50",
    progress: 70,
    growth: "+3%",
    status: "Completed",
  },
];

const OverviewCards = () => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={card.id}
            whileHover={{
              y: -6,
              scale: 1.02,
            }}
            transition={{
              duration: 0.25,
            }}
            className={`${card.bg} rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl`}
          >
            {/* Header */}

            <div className="flex items-center justify-between">
              <div
                className={`${card.color} flex h-12 w-12 items-center justify-center rounded-2xl`}
              >
                <Icon size={22} color="white" />
              </div>

              <div className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                <ArrowUpRight size={14} />
                {card.growth}
              </div>
            </div>

            {/* Value */}

            <h2 className="mt-8 text-xl font-black text-slate-900">
              <AnimatedCounter
                value={card.value}
                suffix={card.suffix}
              />
            </h2>

            <p className="mt-2 text-lg font-semibold text-slate-700">
              {card.title}
            </p>

            {/* Progress */}

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-slate-500">Progress</span>

                <span className="font-semibold">
                  {card.progress}%
                </span>
              </div>

              <div className="h-2 rounded-full bg-white">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{
                    width: `${card.progress}%`,
                  }}
                  transition={{
                    duration: 1,
                  }}
                  className={`${card.color} h-2 rounded-full`}
                />
              </div>
            </div>

            {/* Footer */}

            <div className="mt-6 flex items-center justify-between">
              <span className="text-sm text-slate-500">
                {card.status}
              </span>

              <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                View →
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default OverviewCards;