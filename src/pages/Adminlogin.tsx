// import React, { useState } from "react";
// import {
//   FaBookOpen,
//   FaEnvelope,
//   FaLock,
//   FaEye,
//   FaEyeSlash,
//   FaShieldAlt,
//   FaUserShield,
// } from "react-icons/fa";
// import { toast } from "sonner";
// import { useNavigate } from "react-router-dom";

// const Adminlogin: React.FC = () => {
//   const [role, setRole] = useState<"superadmin" | "admin">("superadmin");
//   const [showPassword, setShowPassword] = useState(false);

//   const [adminLoginData, setAdminLoginData] = useState({
//     email: "",
//     password: "",
//   });

//   const [errors, setErrors] = useState({
//     email: "",
//     password: "",
//   });

//   const navigate = useNavigate();

//   // ✅ Simple handler (NO API)
//   const handleAdminLogin = (e: React.FormEvent) => {
//     e.preventDefault();

//     let newErrors = { email: "", password: "" };
//     let isValid = true;

//     // Email validation
//     if (!adminLoginData.email) {
//       newErrors.email = "Email is required";
//       isValid = false;
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminLoginData.email)) {
//       newErrors.email = "Enter a valid email";
//       isValid = false;
//     }

//     // Password validation
//     if (!adminLoginData.password) {
//       newErrors.password = "Password is required";
//       isValid = false;
//     } else if (adminLoginData.password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters";
//       isValid = false;
//     }

//     setErrors(newErrors);

//     if (!isValid) return;

//     // ✅ Success
//     toast.success(
//       `${role === "superadmin" ? "Super Admin" : "Admin"} login successful!`,
//     );

//     // 🔥 Role-based redirect
//     if (role === "superadmin") {
//       navigate("/superadmin-dashboard"); // change route if needed
//     } else {
//       navigate("/admindashboard"); // change route if needed
//     }
//   };

//   return (
//     <div className="min-h-screen flex bg-gradient-to-br from-[#f3f0ff] to-[#e6e9ff]">
//       {/* LEFT SIDE (UNCHANGED) */}
//       <div
//         className="w-1/2 hidden lg:flex flex-col justify-center items-center relative px-10"
//         style={{
//           background:
//             "linear-gradient(180deg, rgba(219, 177, 251, 0.1) 0%, rgba(168, 152, 250, 0.1) 100%)",
//         }}
//       >
//         <div className="relative grid grid-cols-2 gap-4">
//           <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-400/50 rounded-full"></div>
//           <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-300/50 rounded-full"></div>

//           <div className="relative w-[200px] h-[200px] bg-gradient-to-br from-[#4F46E5] to-[#9333EA] flex items-end justify-center overflow-visible rounded-l-[120px]">
//             <img
//               src="/login1.png"
//               className="h-[250px] w-[250px] object-cover"
//             />
//           </div>

//           <div className="relative w-[200px] h-[200px] bg-gradient-to-br from-[#9333EA] to-[#7C3AED] rounded-[30px] flex items-end justify-center overflow-visible">
//             <img
//               src="/login2.png"
//               className="h-[250px] w-[250px] object-cover"
//             />
//           </div>

//           <div className="relative w-[200px] h-[200px] bg-gradient-to-br from-[#9333EA] to-[#6D28D9] rounded-[30px] flex items-end justify-center overflow-visible mt-8">
//             <img
//               src="/login3.png"
//               className="h-[270px] w-[260px] object-cover"
//             />
//           </div>

//           <div className="relative w-[200px] h-[200px] bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-end justify-center overflow-visible rounded-r-[120px] mt-8">
//             <img
//               src="/login4.png"
//               className="h-[240px] w-[240px] object-cover"
//             />
//           </div>
//         </div>

//         <div className="mt-12 text-start">
//           <h2 className="text-3xl font-bold bg-gradient-to-r from-[#9C1BFB] to-[#5D1095] bg-clip-text text-transparent">
//             Built For Students
//           </h2>
//           <h3 className="text-5xl font-semibold bg-gradient-to-r from-[#9C1BFB] to-[#5D1095] bg-clip-text text-transparent mt-2">
//             Trusted by Educators.
//           </h3>
//           <p className="text-gray-500 mt-4 max-w-md">
//             Login confidently with a platform designed specifically for
//             educational institutions
//           </p>
//         </div>
//       </div>

//       {/* RIGHT SIDE */}
//       <div className="flex-1 flex items-center justify-center px-6">
//         <div className="w-full max-w-md bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-white/40">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg">
//               <FaBookOpen />
//             </div>

//             <h2 className="text-3xl font-bold text-purple-600 mt-5">
//               Welcome Back! 👋
//             </h2>

//             <p className="text-gray-500 text-sm mt-2">
//               Please select your role and login to continue
//             </p>
//           </div>

//           {/* Role Selection */}
//           <div className="mb-6">
//             <div className="flex items-center gap-2 mb-3 text-gray-600 text-sm">
//               <FaShieldAlt className="text-purple-500" />
//               <span>Choose Your Role</span>
//             </div>

//             <div className="flex gap-4">
//               {["superadmin", "admin"].map((r) => (
//                 <button
//                   key={r}
//                   onClick={() => setRole(r as any)}
//                   className={`flex-1 p-5 rounded-2xl transition-all duration-300 border ${
//                     role === r
//                       ? "text-white scale-[1.03]"
//                       : "bg-white text-gray-600 border-gray-200"
//                   }`}
//                   style={
//                     role === r
//                       ? {
//                           background:
//                             "linear-gradient(135deg, #8E51FF 0%, #9810FA 100%)",
//                           borderTop: "2.65px solid #C27AFF",
//                           boxShadow:
//                             "0px 5.29px 7.94px -5.29px #AD46FF4D, 0px 13.23px 19.85px -3.97px #AD46FF4D",
//                         }
//                       : {}
//                   }
//                 >
//                   <div className="flex flex-col items-center gap-2">
//                     <div className="p-3 rounded-xl bg-white/20">
//                       {r === "superadmin" ? <FaShieldAlt /> : <FaUserShield />}
//                     </div>
//                     <p className="font-semibold">
//                       {r === "superadmin" ? "Super Admin" : "Admin"}
//                     </p>
//                     <p className="text-xs opacity-80">
//                       {r === "superadmin"
//                         ? "Full system control"
//                         : "Manage platform"}
//                     </p>
//                   </div>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* FORM */}
//           <form onSubmit={handleAdminLogin} className="space-y-4">
//             <div className="flex flex-col">
//               <div
//                 className={`flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-3 border ${
//                   errors.email ? "border-red-500" : ""
//                 }`}
//               >
//                 <FaEnvelope className="text-gray-400" />
//                 <input
//                   type="email"
//                   placeholder="Email / Login ID"
//                   value={adminLoginData.email}
//                   onChange={(e) =>
//                     setAdminLoginData({
//                       ...adminLoginData,
//                       email: e.target.value,
//                     })
//                   }
//                   className="bg-transparent outline-none w-full text-sm"
//                 />
//               </div>

//               {errors.email && (
//                 <p className="text-red-500 text-xs mt-1">{errors.email}</p>
//               )}
//             </div>
//             <div className="flex flex-col">
//               <div
//                 className={`flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-3 border ${
//                   errors.password ? "border-red-500" : ""
//                 }`}
//               >
//                 <FaLock className="text-gray-400" />
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Password"
//                   value={adminLoginData.password}
//                   onChange={(e) =>
//                     setAdminLoginData({
//                       ...adminLoginData,
//                       password: e.target.value,
//                     })
//                   }
//                   className="bg-transparent outline-none w-full text-sm"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? <FaEyeSlash /> : <FaEye />}
//                 </button>
//               </div>

//               {errors.password && (
//                 <p className="text-red-500 text-xs mt-1">{errors.password}</p>
//               )}
//             </div>

//             <button
//               type="submit"
//               className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-lg hover:scale-[1.01] transition"
//             >
//               Login to Dashboard →
//             </button>
//           </form>

//           <p className="text-center text-xs text-gray-400 mt-3">
//             © 2026 EduExam Pro. Secured & Encrypted
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Adminlogin;



import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/pages/Services/api/api";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!data.email || !data.password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/auth/admin/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        // ✅ Store data
        localStorage.clear();
        localStorage.setItem("isAdminAuthenticated", "true");
        localStorage.setItem("adminToken", result.access_token);
        localStorage.setItem("adminEmail", data.email);

        toast.success("Login successful");

        // ✅ Redirect
        navigate("/admindashboard");
      } else {
        toast.error(result.detail || "Invalid credentials");
      }
    } catch (error) {
      toast.error("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-[#961BAC] mb-6">
          Admin Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* EMAIL */}
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={data.email}
              onChange={(e) =>
                setData({ ...data, email: e.target.value })
              }
              className="h-12 rounded-xl"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <Label>Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={data.password}
                onChange={(e) =>
                  setData({ ...data, password: e.target.value })
                }
                className="h-12 rounded-xl pr-12"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* BUTTON */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 text-lg font-bold bg-gradient-to-r from-[#961BAC] to-[#33329C] rounded-xl"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;