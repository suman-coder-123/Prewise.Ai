import HeroContent from "./HeroContent";
import HeroCards from "./HeroCards";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white pt-32 pb-20">
      {/* Background blurs */}
      <div className="absolute -top-32 -left-24 w-96 h-96 rounded-full bg-indigo-100/60 blur-3xl"></div>
      <div className="absolute top-1/2 -right-32 w-80 h-80 rounded-full bg-violet-100/40 blur-3xl"></div>
      <div className="absolute -bottom-20 left-1/3 w-72 h-72 rounded-full bg-cyan-100/30 blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <HeroContent />
          <HeroCards />
        </div>
      </div>
    </section>
  );
};

export default Hero;
