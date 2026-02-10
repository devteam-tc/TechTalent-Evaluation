import { Globe, Brain } from "lucide-react";
import coding from "../assests/coding.jpg";
import charts from "../assests/OIP.jpeg";

interface OurSolutionsSectionProps {}

const OurSolutionsSection: React.FC<OurSolutionsSectionProps> = () => {
  const solutions = [
    {
      icon: Globe,
      title: "AI-Powered Assessments",
      description:
        "Automated evaluations with real-time feedback for unbiased results.",
      image:
        "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    },
    {
      icon: Brain,
      title: "Scalable Platform",
      description:
        "Easily manage thousands of candidates with seamless integration.",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    },
    {
      icon: Globe,
      title: "Live Coding Challenges",
      description: "Interactive tests that simulate real interview scenarios.",
      image: coding,
    },
    {
      icon: Brain,
      title: "Data-Driven Insights",
      description:
        "Analytics to identify top talent and streamline hiring decisions.",
      image: charts,
    },
  ];

  return (
    <section
      id="solution"
      className="py-5 sm:py-16 md:py-5 mx-2 sm:mx-4 md:mx-8 lg:mx-0 w-full overflow-x-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-full">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center text-[#33329C] mb-8 sm:mb-10 md:mb-4 lg:mb-12 mt-8 sm:mt-10 md:mt-6">
          Our Solution
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 md:gap-16 lg:gap-20 justify-items-center">
          {solutions.map((s, i) => (
            <div key={i} className="relative group">
              <div className="absolute inset-0 -m-2 sm:-m-3 rounded-full border-2 sm:border-4 border-dashed border-purple-400/50"></div>

              <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-60 md:h-60 lg:w-64 lg:h-64 bg-white rounded-full shadow-xl sm:shadow-2xl overflow-hidden flex flex-col border-4 sm:border-6 lg:border-8 border-purple-500/30 transition-all duration-300 hover:scale-105 hover:shadow-3xl">
                <div className="flex-1 px-3 sm:px-4 md:px-5 lg:px-6 py-4 sm:py-6 md:py-8 text-center flex flex-col justify-center bg-gradient-to-b from-purple-50 to-white">
                  <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-[#33329C] mb-2 leading-tight">
                    {s.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed px-1 sm:px-2">
                    {s.description}
                  </p>
                </div>

                <div className="h-16 sm:h-20 md:h-24 relative overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 via-transparent to-transparent"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurSolutionsSection;
