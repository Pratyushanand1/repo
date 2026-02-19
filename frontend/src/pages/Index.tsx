import Navbar from "../components/Navbar";
import HeroSection from "@/components/HeroSection";
import UploadSection from "@/components/UploadSection";
import AboutSection from "@/components/AboutSection";
import TechStackSection from "@/components/TechStackSection";
import DisclaimerFooter from "@/components/DisclaimerFooter";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSection />
    <UploadSection />
    <AboutSection />
    <TechStackSection />
    <DisclaimerFooter />
  </div>
);

export default Index;
