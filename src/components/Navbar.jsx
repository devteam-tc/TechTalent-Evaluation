// // src/components/Navbar.jsx
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Menu, X } from "lucide-react";
// import logo from "../assests/logo.png";
// import techlogo from "../assests/techlogo.png";

// const Navbar = () => {
//   const navigate = useNavigate();
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const navItems = [
//     { label: "Home", href: "#home" },
//     { label: "About", href: "#about" },
//     { label: "Vision", href: "#vision" },
//     { label: "Pain Points", href: "#pain-points" },
//     { label: "Solution", href: "#solution" },
//     { label: "Gallery", href: "#gallery" },
//     { label: "Demo", href: "#demo" },
//   ];

//   const scrollToSection = (href) => {
//     if (href.startsWith("#")) {
//       const element = document.querySelector(href);
//       if (element) {
//         element.scrollIntoView({ behavior: "smooth" });
//         setIsMobileMenuOpen(false);
//       }
//     }
//   };

//   return (
//     <header className="sticky top-0 z-50 backdrop-blur-2xl bg-white/10 border-b border-white/10 shadow-xl">
//       <div className="container mx-auto px-4 py-3">
//         <div className="flex items-center justify-between">
//           {/* Logo */}
//           <div
//             className="flex items-center space-x-3 hover:scale-105 transition-transform duration-300 cursor-pointer group"
//             onClick={() => scrollToSection("#home")}
//           >
//             <img
//               src={logo}
//               alt="SecurXpert Logo"
//               className="w-32 h-12 object-contain drop-shadow-lg group-hover:rotate-12 transition-transform duration-700"
//             />
//           </div>

//           {/* Desktop Nav */}
//           <nav className="hidden md:flex items-center space-x-6">
//             {navItems.map((item) => (
//               <button
//                 key={item.href}
//                 onClick={() => scrollToSection(item.href)}
//                 className="text-foreground hover:text-primary transition-all duration-300 relative group hover:-translate-y-1 text-sm hover:shadow-glow"
//               >
//                 {item.label}
//                 <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-purple-600 transition-all duration-300 group-hover:w-full" />
//               </button>
//             ))}
//           </nav>

//           {/* Right Side: Tech Logo + Buttons */}
//           <div className="flex items-center space-x-4">
//             <div className="flex items-center space-x-3 hover:scale-105 transition-transform duration-300 group">
//               <img
//                 src={techlogo}
//                 alt="Tech Logo"
//                 className="w-32 h-12 object-contain drop-shadow-lg group-hover:rotate-12 transition-transform duration-700"
//               />
//             </div>

//             {/* Desktop Buttons */}
//             <div className="hidden md:flex items-center space-x-2">
//               <Button
//                 onClick={() => navigate("/login")}
//                 className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg hover:shadow-xl text-sm px-4 py-2 animate-pulse-subtle"
//               >
//                 Login
//               </Button>
//               <Button
//                 onClick={() => navigate("/contact")}
//                 className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-600/90 hover:to-green-800/90 shadow-lg hover:shadow-xl text-sm px-4 py-2"
//               >
//                 Contact Us
//               </Button>
//               <Button
//                 onClick={() => navigate("/admin")}
//                 className="bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-600/90 hover:to-gray-800/90 shadow-lg hover:shadow-xl text-sm px-4 py-2"
//               >
//                 Admin Login
//               </Button>
//             </div>

//             {/* Mobile Menu Toggle */}
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               className="md:hidden text-foreground hover:text-primary"
//             >
//               {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//             </Button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {isMobileMenuOpen && (
//           <div className="md:hidden mt-4 pb-4 border-t border-gray-200 animate-slide-down-enhanced">
//             <nav className="flex flex-col space-y-4">
//               {navItems.map((item, idx) => (
//                 <button
//                   key={item.href}
//                   onClick={() => scrollToSection(item.href)}
//                   className="text-foreground hover:text-primary text-left py-2 hover:translate-x-2 transition-all"
//                 >
//                   {item.label}
//                 </button>
//               ))}
//               <div className="space-y-2 pt-4 border-t border-gray-200">
//                 <Button onClick={() => navigate("/login")} className="w-full">
//                   Login
//                 </Button>
//                 <Button onClick={() => navigate("/contact")} variant="outline" className="w-full">
//                   Contact Us
//                 </Button>
//                 <Button onClick={() => navigate("/admin")} variant="secondary" className="w-full">
//                   Admin Login
//                 </Button>
//               </div>
//             </nav>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// };

// export default Navbar;





// src/components/Navbar.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import logo from "../assests/logo.png";
import techlogo from "../assests/techlogo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Vision", href: "#vision" },
    { label: "Pain points", href: "#pain-points" },
    { label: "Solution", href: "#solution" },
    { label: "Gallery", href: "#gallery" },
    { label: "Demo", href: "#demo" },
  ];

  const scrollToSection = (href) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        setIsMobileMenuOpen(false);
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-purple-100 border-b border-purple-200">
      <div className="container mx-auto px-6 py-4 w-full ">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src={logo}
              alt="Dev Talent Logo"
              className="h-16 object-contain cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => scrollToSection("#home")}
            />
          </div>

          {/* Desktop Navigation Links - Centered */}
          <nav className="hidden lg:flex items-center space-x-8 flex-1 justify-center">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className="text-gray-800 font-medium text-base hover:text-purple-700 transition-colors duration-200 relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </nav>

          {/* Right Side Buttons */}
          <div className="flex items-center space-x-4">
            {/* Tech Logo - Hidden on small screens */}
            <img
              src={techlogo}
              alt="Tech Logo"
              className="h-14 hidden xl:block object-contain"
            />

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <Button
                onClick={() => navigate("/login")}
                className="bg-white text-purple-700 border border-purple-300 rounded-full px-6 py-2.5 font-medium hover:bg-purple-50 hover:border-purple-400 transition-all shadow-sm"
              >
                Login
              </Button>
              <Button
                onClick={() => navigate("/contact")}
                className="bg-white text-purple-700 border border-purple-300 rounded-full px-6 py-2.5 font-medium hover:bg-purple-50 hover:border-purple-400 transition-all shadow-sm"
              >
                Contact us
              </Button>
              <Button
                onClick={() => navigate("/admin")}
                style={{ background: "linear-gradient(90deg, #961BAC 0%, #B14BDB 100%)" }}
                className="text-white rounded-full px-6 py-2.5 font-medium shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                Admin login
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-gray-800 p-2"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-6 pb-6 border-t border-purple-200 pt-6">
            <nav className="flex flex-col space-y-5 mb-6">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className="text-gray-800 font-medium text-left text-lg hover:text-purple-700 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="flex flex-col space-y-3">
              <Button
                onClick={() => navigate("/login")}
                className="w-full bg-white text-purple-700 border border-purple-300 rounded-full py-6 font-medium text-lg hover:bg-purple-50"
              >
                Login
              </Button>
              <Button
                onClick={() => navigate("/contact")}
                className="w-full bg-white text-purple-700 border border-purple-300 rounded-full py-6 font-medium text-lg hover:bg-purple-50"
              >
                Contact us
              </Button>
              <Button
                onClick={() => navigate("/admin")}
                style={{ background: "linear-gradient(90deg, #961BAC 0%, #B14BDB 100%)" }}
                className="w-full text-white rounded-full py-6 font-medium text-lg shadow-lg hover:shadow-xl"
              >
                Admin login
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;