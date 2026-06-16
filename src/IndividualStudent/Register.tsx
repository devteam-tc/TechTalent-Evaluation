import { useState, FormEvent, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Phone, Mail, GraduationCap, BookOpen } from "lucide-react";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import axios from "axios";
import { API_BASE_URL } from "@/pages/Services/api/api";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    college: "",
    country: "",
    educational_status: "",
    qualification: "",
    passedout_year: "",
    interest: "",
    state: "",
    city: "",
    courses: [] as string[],
  });

  const [error, setError] = useState("");

  // OTP State Variables
  const [showOtpModal, setShowOtpModal] = useState<boolean>(false);
  const [otpDigits, setOtpDigits] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const inputsRef = useRef<HTMLInputElement[]>([]);
  const finalOtp = otpDigits.join("");
  const [otpTimer, setOtpTimer] = useState<number>(120);
  const [otpSuccess, setOtpSuccess] = useState<boolean>(false);
  const [otpError, setOtpError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [otpResendMessage, setOtpResendMessage] = useState<string>("");

  // Handle checkbox selection
  const handleCourseChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      courses: prev.courses.includes(value) ? [] : [value],
    }));
  };

  // OTP Effects
  useEffect(() => {
    if (showOtpModal) {
      inputsRef.current[0]?.focus();
    }
  }, [showOtpModal]);

  useEffect(() => {
    if (!showOtpModal || otpTimer === 0) return;

    const interval = setInterval(() => {
      setOtpTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [showOtpModal, otpTimer]);

  // Helper Functions
  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.courses.length === 0) {
      setError("Please select at least one course.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Map form data to API requirements
      const apiData = {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        country: formData.country || "India",
        educational_status: formData.educational_status || "Student",
        qualification: formData.qualification || "Bachelor's",
        passedout_year: formData.passedout_year || "2024",
        interest: formData.courses.join(", "),
        state: formData.state || "Andhra Pradesh",
        city: formData.city || "Tirupati",
        college_name: formData.college,
      };

      console.log("Register Data:", apiData);
      console.log("College Name being sent:", formData.college);
      console.log(`Making API call to: ${API_BASE_URL}/student/register`);

      const response = await axios.post(
        `${API_BASE_URL}/student/register`,
        apiData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000, // Add timeout to prevent hanging
        }
      );

      console.log("Registration Response:", response.data);

      // Store selected course type to localStorage
      if (formData.courses.length > 0) {
        localStorage.setItem("registeredCourse", formData.courses[0]);
      }

      // Show OTP modal after successful registration
      setOtpTimer(120);
      setShowOtpModal(true);
      setOtpResendMessage(response.data?.message || "OTP sent to email");
    } catch (err: any) {
      console.error("Registration Error:", err);
      console.error("Error Response:", err.response?.data);

      if (err.response?.data?.detail) {
        // Handle specific college error
        if (err.response.data.detail.includes("College not found or inactive")) {
          setError("College not found or inactive. Please check your college name or contact support.");
        } else if (err.response.data.detail.includes("Email already registered") || err.response.data.detail.includes("already exists")) {
          setError("Email already registered. Please use a different email or login.");
        } else {
          setError(err.response.data.detail);
        }
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // OTP Handler Functions
  const handleOtpBoxChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otpDigits];
    newOtp[index] = value;
    setOtpDigits(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpBackspace = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = async () => {
    if (otpTimer > 0) return;

    try {
      console.log("Resending OTP for:", formData.email);

      const response = await axios.post(
        `${API_BASE_URL}/student/resend-otp`,
        {
          email: formData.email,
          purpose: "register", // Changed from "registration" to "register"
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Resend OTP Response:", response.data);

      // Reset OTP state and timer
      setOtpDigits(["", "", "", "", "", ""]);
      setOtpError("");
      setOtpTimer(120);
      setOtpResendMessage(response.data?.message || "OTP has been resent to your email");
      inputsRef.current[0]?.focus();

      // Clear resend message after 5 seconds
      setTimeout(() => {
        setOtpResendMessage("");
      }, 5000);
    } catch (err: any) {
      console.error("Resend OTP Error:", err);
      console.error("Error Response:", err.response?.data);
      setOtpError("Failed to resend OTP. Please try again.");
      setOtpResendMessage("");
    }
  };

  const handleVerify = () => {
    if (!/^\d{6}$/.test(finalOtp)) {
      setOtpError("OTP must be 6 digits");
      return;
    }

    // Accept any valid 6-digit OTP
    setOtpSuccess(true);
    setTimeout(() => {
      navigate("/success1", { state: { email: formData.email } });
    }, 3000);
  };

  const handleCloseOtpModal = () => {
    setShowOtpModal(false);
    setOtpDigits(["", "", "", "", "", ""]);
    setOtpTimer(120);
    setOtpSuccess(false);
    setOtpError("");
    setOtpResendMessage("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-[#7B2CBF] to-[#3C096C] p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <GraduationCap size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Create Your Account</h2>
              <p className="text-xs opacity-90">
                Join thousands of students advancing their skills
              </p>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User size={16} className="text-purple-600" />
                Full Name <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                required
                maxLength={50}
                value={formData.fullName}
                onChange={(e) => {
                  let value = e.target.value;

                  if (/^[A-Za-z\s]*$/.test(value)) {
                    value = value.replace(/\s{2,}/g, " ");
                    if (!value.startsWith(" ")) {
                      setFormData((prev) => ({
                        ...prev,
                        fullName: value,
                      }));
                    }
                  }
                }}
                onBlur={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    fullName: e.target.value.trim(),
                  }));
                }}
                placeholder="Enter your full name"
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />

              {formData.fullName &&
                (formData.fullName.length < 2 ||
                  !/^[A-Za-z]+(?:\s[A-Za-z]+)*$/.test(formData.fullName)) && (
                  <p className="text-red-500 text-xs mt-1">
                    Name must be 2–50 letters only.
                  </p>
                )}
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Phone size={16} className="text-purple-600" />
                Phone Number <span className="text-red-500">*</span>
              </label>

              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => {
                  const onlyNumbers = e.target.value.replace(/\D/g, "");
                  if (onlyNumbers.length <= 10) {
                    setFormData((prev) => ({
                      ...prev,
                      phone: onlyNumbers,
                    }));
                  }
                }}
                maxLength={10}
                inputMode="numeric"
                pattern="[0-9]{10}"
                placeholder="Enter 10 digit phone number"
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />

              {formData.phone && formData.phone.length !== 10 && (
                <p className="text-red-500 text-xs mt-1">
                  Phone number must be exactly 10 digits.
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Mail size={16} className="text-purple-600" />
                Email ID <span className="text-red-500">*</span>
              </label>

              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => {
                  const value = e.target.value;
                  if (!value.includes(" ")) {
                    setFormData((prev) => ({
                      ...prev,
                      email: value,
                    }));
                  }
                }}
                onBlur={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    email: e.target.value.trim(),
                  }));
                }}
                placeholder="your.email@example.com"
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />

              {formData.email &&
                !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(
                  formData.email,
                ) && (
                  <p className="text-red-500 text-xs mt-1">
                    Please enter a valid email address.
                  </p>
                )}
            </div>

            {/* College */}
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <GraduationCap size={16} className="text-purple-600" />
                College Name <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                required
                maxLength={60}
                value={formData.college}
                onChange={(e) => {
                  let value = e.target.value;

                  if (/^[A-Za-z.,\s]*$/.test(value)) {
                    value = value.replace(/\s{2,}/g, " ");
                    if (!value.startsWith(" ")) {
                      setFormData((prev) => ({
                        ...prev,
                        college: value,
                      }));
                    }
                  }
                }}
                onBlur={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    college: e.target.value.trim(),
                  }));
                }}
                placeholder="Enter your college name"
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />

              {formData.college &&
                !/^[A-Za-z.,]+(?:\s[A-Za-z.,]+)*$/.test(formData.college) && (
                  <p className="text-red-500 text-xs mt-1">
                    Only letters, spaces, "." and "," allowed.
                  </p>
                )}
            </div>

            {/* Courses */}
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <BookOpen size={16} className="text-purple-600" />
                Courses Opted <span className="text-red-500">*</span>
              </label>

              <div className="mt-2 space-y-3">
                {/* Technical */}
                <div
                  onClick={() => handleCourseChange("Technical")}
                  className={`p-3 rounded-lg border cursor-pointer transition ${formData.courses.includes("Technical")
                    ? "border-purple-600 bg-purple-50"
                    : "border-gray-200"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.courses.includes("Technical")}
                      readOnly
                      className="accent-purple-600"
                    />
                    <div>
                      <p className="font-medium text-sm">Technical</p>
                      <p className="text-xs text-gray-500">
                        Programming, Data Structures, Algorithms
                      </p>
                    </div>
                  </div>
                </div>

                {/* Non Technical */}
                <div
                  onClick={() => handleCourseChange("Non-Technical")}
                  className={`p-3 rounded-lg border cursor-pointer transition ${formData.courses.includes("Non-Technical")
                    ? "border-purple-600 bg-purple-50"
                    : "border-gray-200"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.courses.includes("Non-Technical")}
                      readOnly
                      className="accent-purple-600"
                    />
                    <div>
                      <p className="font-medium text-sm">Non-Technical</p>
                      <p className="text-xs text-gray-500">
                        Aptitude, Reasoning, Verbal Ability
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>

            {/* Note */}
            <div className="bg-purple-50 border border-purple-200 text-xs text-gray-600 p-3 rounded-lg">
              <span className="text-purple-600 font-medium">Note:</span> A
              temporary password will be sent to your registered email.
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#7B2CBF] to-[#3C096C] text-white py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register"}
            </button>

            {/* Login Redirect */}
            <div className="text-center text-sm text-gray-600">
              Already have an account?
              <button
                type="button"
                onClick={() => navigate("/individual")}
                className="ml-1 text-purple-600 hover:underline"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#f9fafb",
              padding: "40px 30px",
              borderRadius: "20px",
              width: "420px",
              maxWidth: "95%",
              textAlign: "center",
              position: "relative",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            }}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseOtpModal}
              style={{
                position: "absolute",
                top: "12px",
                right: "16px",
                border: "none",
                background: "transparent",
                fontSize: "22px",
                cursor: "pointer",
                color: "#999",
              }}
            >
              ×
            </button>

            {/* OTP Resend Message */}
            {otpResendMessage && (
              <div
                style={{
                  backgroundColor: "#10b981",
                  color: "white",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                  fontSize: "14px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  animation: "slideDown 0.3s ease-out",
                }}
              >
                ✓ {otpResendMessage}
              </div>
            )}

            {!otpSuccess ? (
              <>
                {/* Title */}
                <h2
                  style={{
                    fontSize: "32px",
                    fontWeight: "700",
                    color: "#7e22ce",
                    marginBottom: "12px",
                  }}
                >
                  Verify Your Email
                </h2>

                {/* Subtext */}
                <p
                  style={{
                    color: "#6b7280",
                    fontSize: "18px",
                    marginBottom: "4px",
                  }}
                >
                  We've sent a 6 digit OTP to
                </p>
                <p
                  style={{
                    fontWeight: "700",
                    fontSize: "20px",
                    marginBottom: "30px",
                  }}
                >
                  {formData.email}
                </p>

                {/* OTP Boxes */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "14px",
                    marginBottom: "30px",
                  }}
                >
                  {otpDigits.map((d, i) => (
                    <input
                      key={i}
                      ref={(el) => (inputsRef.current[i] = el!)}
                      value={d}
                      onChange={(e) => handleOtpBoxChange(e.target.value, i)}
                      onKeyDown={(e) => handleOtpBackspace(e, i)}
                      maxLength={1}
                      style={{
                        width: "45px",
                        height: "55px",
                        borderRadius: "12px",
                        border: "2px solid #d1d5db",
                        textAlign: "center",
                        fontSize: "20px",
                        fontWeight: "600",
                        outline: "none",
                        transition: "all 0.2s",
                        background: "#fff",
                        ...(i === otpDigits.findIndex((v) => v === "")
                          ? {
                            borderColor: "#7e22ce",
                            boxShadow: "0 0 0 3px rgba(126,34,206,0.15)",
                          }
                          : {}),
                        ...(d
                          ? {
                            background:
                              "linear-gradient(135deg, #7e22ce, #4f46e5)",
                            color: "#fff",
                            border: "none",
                          }
                          : {}),
                      }}
                    />
                  ))}
                </div>

                {otpError && (
                  <div
                    style={{
                      color: "#e74c3c",
                      fontSize: "13px",
                      marginTop: "6px",
                      marginBottom: "20px",
                    }}
                  >
                    {otpError}
                  </div>
                )}

                {/* Resend */}
                <button
                  onClick={handleResendOtp}
                  disabled={otpTimer !== 0}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#7e22ce",
                    fontSize: "18px",
                    fontWeight: "600",
                    cursor: "pointer",
                    textDecoration: "underline",
                    marginBottom: "10px",
                    opacity: otpTimer === 0 ? 1 : 0.5,
                  }}
                >
                  Resend OTP
                </button>

                {/* Timer */}
                <div
                  style={{
                    fontSize: "26px",
                    marginBottom: "30px",
                    color: "#111",
                  }}
                >
                  {formatTime(otpTimer)}
                </div>

                {/* Submit */}
                <button
                  onClick={handleVerify}
                  disabled={finalOtp.length !== 6}
                  style={{
                    width: "100%",
                    padding: "16px",
                    borderRadius: "14px",
                    border: "none",
                    background: "linear-gradient(90deg, #4f46e5, #7e22ce)",
                    color: "#fff",
                    fontSize: "20px",
                    fontWeight: "600",
                    cursor: "pointer",
                    opacity: finalOtp.length !== 6 ? 0.6 : 1,
                  }}
                >
                  Submit
                </button>
              </>
            ) : (
              <div className="text-center py-8">
                <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-green-600">
                  Registration Successful
                </h2>
                <p className="text-gray-600 mt-2">Redirecting…</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
