const ProductTabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="mt-12 flex flex-wrap justify-center gap-3">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-6 py-2.5 rounded-xl transition-all duration-300 text-sm font-semibold ${
            activeTab === tab
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
              : "bg-white border border-slate-200 text-slate-500 hover:border-indigo-200 hover:text-indigo-600"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default ProductTabs;
