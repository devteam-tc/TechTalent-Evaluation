import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import img1 from "../assests/img1.png";

interface HeroSectionProps { }

const HeroSection: React.FC<HeroSectionProps> = () => {
  const navigate = useNavigate();

  return (
    <section
      id="home"
      className="relative min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-white flex items-center w-full overflow-x-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-full grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        <div className="space-y-6 sm:space-y-8 lg:space-y-10 py-12 lg:py-16">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight"
            style={{ marginTop: "-250px !important" }}
          >
            <span className="text-[#33329C]">
              The Most Advanced Next-Gen Interview Assessments Platform
            </span>
            <br />
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed max-w-2xl">
            Empowering Recruiters And Students With AI-Driven Hiring,
            <br />
            Real-Time Coding Tests And Skill-Based Insights
          </p>
          <Button
            onClick={() => navigate("/login")}
            className="bg-gradient-to-r from-[#961BAC] to-[#33329C] hover:from-[#961BAC]/90 hover:to-[#33329C]/90 text-white font-bold text-base sm:text-lg md:text-xl py-4 sm:py-5 md:py-6 lg:py-7 px-6 sm:px-8 md:px-10 lg:px-12 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 w-full sm:w-auto"
          >
            Start Your Journey <ArrowRight className="ml-2 sm:ml-3 md:ml-4 w-5 h-5 sm:w-6 h-6 md:w-7 h-7" />
          </Button>
        </div>
        <div className="relative order-first lg:order-last">
          <img
            src={img1}
            alt="Students"
            className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl drop-shadow-2xl h-auto mx-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;