import { Globe, Brain } from "lucide-react";
import about1 from "../assests/about1.png";
import about2 from "../assests/about2.png";
import about3 from "../assests/about3.png";
import about4 from "../assests/about4.png";

interface AboutSectionProps { }

const AboutSection: React.FC<AboutSectionProps> = () => {
  return (
    <section id="about" className="py-4 sm:py-16 md:py-4 bg-white w-full overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4 sm:gap-6 p-6 sm:p-8 lg:p-12 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-[#961BAC] shadow-xl sm:shadow-2xl">
              <img
                src={about1}
                alt="AI Assessment"
                className="w-full rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg sm:shadow-xl"
              />
              <img
                src={about2}
                alt="Coding"
                className="w-full rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg sm:shadow-xl"
              />
              <img
                src={about3}
                alt="Brain AI"
                className="w-full rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg sm:shadow-xl"
              />
              <img
                src={about4}
                alt="Analytics"
                className="w-full rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg sm:shadow-xl"
              />
            </div>
          </div>

          <div className="space-y-6 sm:space-y-8 order-1 lg:order-2">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#33329C]">
              About DevTalent
            </h2>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              At DevTalent, we're redefining how companies discover, evaluate
              and hire tech talent. Designed to transform the interview and
              assessment process, our AI-driven platform connects students,
              colleges and recruiters to make hiring faster, smarter and
              fairer.
            </p>

            <div className="space-y-4 sm:space-y-6 mt-6 sm:mt-8 lg:mt-10">
              <div className="flex items-start gap-3 sm:gap-5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#961BAC] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Globe className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#33329C] mb-2">
                    Vision
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base">
                    To empower students, developers and recruiters with
                    advanced AI tools that simplify hiring, reduce bias and
                    ensure fair opportunities for all.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-5">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#961BAC] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Brain className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#33329C] mb-2">
                    Impact
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base">
                    DevTalent is bridging the gap between learning and hiring
                    — empowering thousands of students, educators, and
                    recruiters worldwide.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;