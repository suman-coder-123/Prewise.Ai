const SectionTitle = ({
  title,
  subtitle,
}) => {
  return (
    <div>

      <h2 className="text-3xl font-bold text-slate-900">

        {title}

      </h2>

      <p className="mt-2 text-slate-500">

        {subtitle}

      </p>

    </div>
  );
};

export default SectionTitle;