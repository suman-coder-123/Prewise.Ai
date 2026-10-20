import { useState } from "react";
import { motion } from "framer-motion";
import ProductTabs from "./ProductTabs";
import DashboardScreen from "./DashboardScreen";

const tabs = [
  "Resume Analysis",
  "AI Interview",
  "Job Tracker",
  "Analytics",
];

const ProductShowcase = () => {
  const [activeTab, setActiveTab] = useState("Resume Analysis");

  return (
    <section id="product-showcase" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">
            Product Showcase
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
            One Platform.
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Everything You Need.
            </span>
          </h2>
          <p className="mt-6 text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">
            Manage interview preparation, resume analysis, mock interviews and
            job applications from one beautifully designed dashboard.
          </p>
        </div>

        <ProductTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-12"
        >
          <DashboardScreen activeTab={activeTab} />
        </motion.div>
      </div>
    </section>
  );
};

export default ProductShowcase;
