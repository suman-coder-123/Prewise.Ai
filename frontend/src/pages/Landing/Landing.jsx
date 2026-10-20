import Hero from "../../components/landing/Hero/Hero";
import Navbar from "../../components/ui/Navbar";
import TrustedCompanies from "../../components/landing/Hero/TrustedCompanies";
import ProductShowcase from "../../components/landing/ProductShowcase/ProductShowcase";
import Features from "../../components/landing/features/Features";
import HowItWorks from "../../components/landing/HowItWorks/HowItWorks";
import CTA from "../../components/landing/CTA";
import Footer from "../../components/landing/Footer";

const Landing = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <TrustedCompanies />
      <Features />
      <ProductShowcase />
      <HowItWorks />
      <CTA />
      <Footer />
    </>
  );
};

export default Landing;
