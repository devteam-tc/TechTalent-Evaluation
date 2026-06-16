import React, { useState, useEffect } from "react";
import {
  Check,
  Crown,
  Users,
  Code,
  ShoppingCart,
  TrendingUp,
  Sparkles,
  BarChart3,
  Award,
  Smartphone,
  HeadphonesIcon,
  Star,
  Database,
  Brain,
  Shield,
  Cloud,
  BookOpen,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Devlogo from "../assests/Devlogo.png";
import axios from "axios";
import { API_BASE_URL } from "@/pages/Services/api/api";

type PlanType = "single" | "dual" | "triple";

export default function Subscription() {
  const location = useLocation();
  const navigate = useNavigate();
  const state =
    (location.state as { userEmail?: string; userName?: string }) || {};
  const userEmail = state.userEmail || "user@example.com";
  const userName = state.userName || "User";
  const [plan, setPlan] = useState<PlanType>("single");
  const [courseType, setCourseType] = useState("Technical");
  const [selectedCourses, setSelectedCourses] = useState<string[]>(["Data Structures & Algorithms"]);
  const [selectedExam, setSelectedExam] = useState(2);

  const [singlePlans, setSinglePlans] = useState([
    { exams: 2, price: 199 },
    { exams: 3, price: 249 },
    { exams: 4, price: 369 },
    { exams: 6, price: 549 },
    { exams: 10, price: 899 },
  ]);

  const [dualPrice, setDualPrice] = useState(599);
  const [dualExams, setDualExams] = useState(6);
  const [dualId, setDualId] = useState<any>(null);
  const [triplePrice, setTriplePrice] = useState(599);
  const [tripleExams, setTripleExams] = useState(6);
  const [tripleId, setTripleId] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const toggleCourse = (courseName: string, max: number) => {
    setSelectedCourses((prev) => {
      if (prev.includes(courseName)) {
        return prev.filter((c) => c !== courseName);
      }
      if (prev.length < max) {
        return [...prev, courseName];
      }
      // If at max, replace the first one or just return prev?
      // Replacing the first one feels more interactive
      return [...prev.slice(1), courseName];
    });
  };

  const [apiCourses, setApiCourses] = useState<any[]>([]);

  useEffect(() => {
    const fetchPlansAndCourses = async () => {
      console.log("Fetch Plans started...");
      try {
        const token = localStorage.getItem("access_token") || localStorage.getItem("userToken");

        // Fetch Plans
        const plansResponse = await fetch(`${API_BASE_URL}/student/plans`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (plansResponse.ok) {
          let plansData = await plansResponse.json();
          console.log("Full Plans Response:", plansData);

          if (Array.isArray(plansData) && plansData.length > 0) {
            const single = plansData
              .filter((p: any) => String(p.plan_type || p.type).toLowerCase() === "single")
              .map((p: any) => ({
                id: p.id || p.plan_id,
                exams: p.exams || p.mcq_credit_total || p.course_limit,
                price: p.amount || p.price,
              }))
              .sort((a: any, b: any) => a.exams - b.exams);
            if (single.length > 0) setSinglePlans(single);

            const dual = plansData.find((p: any) => String(p.plan_type || p.type).toLowerCase() === "dual");
            if (dual) {
              setDualId(dual.id || dual.plan_id);
              setDualPrice(dual.amount || dual.price);
              setDualExams(dual.exams || dual.mcq_credit_total || dual.course_limit || 6);
            }

            const triple = plansData.find((p: any) => String(p.plan_type || p.type).toLowerCase() === "triple");
            if (triple) {
              setTripleId(triple.id || triple.plan_id);
              setTriplePrice(triple.amount || triple.price);
              setTripleExams(triple.exams || triple.mcq_credit_total || triple.course_limit || 6);
            }
          }
        } else {
          console.error("API Error:", plansResponse.status);
        }

        // Fetch Courses
        const coursesResponse = await fetch(`${API_BASE_URL}/admin/catalog/courses`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (coursesResponse.ok) {
          const coursesData = await coursesResponse.json();
          const formattedCourses = coursesData.map((c: any) => ({
            name: c.name,
            id: c.id,
            icon: BookOpen,
            type_id: c.type_id
          }));
          setApiCourses(formattedCourses);
        }
      } catch (error: any) {
        console.error("Error fetching data:", error);
        alert(`Network/Code Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPlansAndCourses();
  }, []);

  // 🔹 Handle Buy Now — Razorpay Full Flow
  const handleBuyNow = async () => {
    setIsProcessing(true);
    try {
      const token =
        localStorage.getItem("access_token") ||
        localStorage.getItem("userToken");

      // Step 1: Resolve Plan ID
      let selectedPlanId: any =
        plan === "single"
          ? singlePlans.find((p) => p.exams === selectedExam)?.id
          : plan === "dual"
            ? dualId
            : tripleId;

      if (!selectedPlanId && plan === "single" && singlePlans.length > 0) {
        selectedPlanId = singlePlans[0].id;
      }

      if (!selectedPlanId) {
        alert("Please select a valid plan.");
        setIsProcessing(false);
        return;
      }

      // Step 2: Create order
      const response = await fetch(`${API_BASE_URL}/student/subscription/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount_paise: Math.round(total * 100),
          currency: "INR",
          plan_id: selectedPlanId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create order");
      }

      const orderData = await response.json();
      console.log("Order Created:", orderData);

      // Step 3: Pick the Razorpay key from API response (field is key_id)
      const razorpayKey =
        orderData.key_id ||
        orderData.razorpay_key ||
        orderData.key ||
        "";

      if (!razorpayKey) {
        alert("Razorpay key missing from server response. Please contact support.");
        setIsProcessing(false);
        return;
      }

      // Step 4: Open Razorpay checkout
      const options = {
        key: razorpayKey,
        amount: orderData.amount_paise || Math.round(total * 100),
        currency: orderData.currency || "INR",
        name: "DevTalent",
        description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Course Subscription`,
        order_id: orderData.razorpay_order_id || orderData.order_id || orderData.id,
        prefill: { name: userName, email: userEmail },
        theme: { color: "#7C3AED" },

        // Step 5: On payment success → verify
        handler: async (paymentResponse: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            console.log("Payment Success:", paymentResponse);

            const verifyResponse = await fetch(
              `${API_BASE_URL}/student/subscription/verify-payment`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  plan_id: selectedPlanId,
                  razorpay_order_id: paymentResponse.razorpay_order_id,
                  razorpay_payment_id: paymentResponse.razorpay_payment_id,
                  razorpay_signature: paymentResponse.razorpay_signature,
                })
              }
            );

            if (!verifyResponse.ok) {
              const errorData = await verifyResponse.json();
              throw new Error(errorData.detail || "Verification failed");
            }

            const verificationStatus = await verifyResponse.json();
            console.log("Payment Verified:", verificationStatus);

            // Step 6: Navigate to summary after successful verification
            navigate("/summary", {
              state: {
                plan,
                totalExams,
                totalCourses,
                basePrice,
                total,
                orderData,
                paymentId: paymentResponse.razorpay_payment_id,
                verificationStatus: verificationStatus,
              },
            });
            window.scrollTo(0, 0);
          } catch (verifyError: any) {
            console.error("Verification Error:", verifyError.response?.data || verifyError);
            alert(
              "Payment received but verification failed. Contact support with payment ID: " +
              paymentResponse.razorpay_payment_id
            );
          } finally {
            setIsProcessing(false);
          }
        },

        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", (failResponse: any) => {
        console.error("Payment Failed:", failResponse.error);
        alert(`Payment failed: ${failResponse.error?.description || "Please try again."}`);
        setIsProcessing(false);
      });
      rzp.open();

    } catch (error: any) {
      console.error("Order Error:", error.message || error);
      alert("Failed to initiate purchase. Please try again.");
      setIsProcessing(false);
    }
  };

  // Calculate Price
  const basePrice =
    plan === "single"
      ? singlePlans.find((p) => p.exams === selectedExam)?.price || 0
      : plan === "dual"
        ? dualPrice
        : triplePrice;

  const gst = Math.round(basePrice * 0.18);
  const total = basePrice + gst;

  // Exams calculation based on plan
  const totalExams =
    plan === "single"
      ? selectedExam
      : plan === "dual"
        ? dualExams
        : tripleExams;

  const totalCourses = plan === "single" ? 1 : plan === "dual" ? 2 : 3;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* NAVBAR */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <img src={Devlogo} alt="DevTalent" className="h-14" />
            </div>

            {/* User Info */}
            <div className="text-right">
              <p className="font-semibold text-gray-800">{userName}</p>
              <p className="text-sm text-gray-500">{userEmail}</p>
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="p-6">
        {/* TITLE */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-purple-700">
            Subscription Plans
          </h2>
          <p className="text-gray-500 mt-2">
            Choose the perfect plan for your learning journey
          </p>
        </div>

        {/* PLANS */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* SINGLE COURSE */}
          <div
            onClick={() => {
              setPlan("single");

              if (!selectedExam) {
                setSelectedExam(2); // default
              }
            }}
            className={`bg-white rounded-xl shadow-md p-6 cursor-pointer border-2 ${plan === "single" ? "border-purple-600" : "border-transparent"
              }`}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">Single Course</h3>
              <Code className="text-purple-600" />
            </div>

            <p className="text-sm text-gray-500 mt-2">
              Choose one course with flexible exam counts
            </p>

            {/* Select Course */}
            <div className="mt-4">
              <h4 className="font-semibold text-gray-800 mb-2">
                Select Course:
              </h4>
              <div className="flex bg-gray-100 rounded-lg p-1">
                {["Technical", "Non-Tech"].map((type) => (
                  <button
                    key={type}
                    onClick={(e) => {
                      e.stopPropagation();

                      setPlan("single"); // 🔥 Important
                      setCourseType(type);
                    }}
                    className={`flex-1 py-1 rounded-md text-sm ${courseType === type
                      ? "bg-purple-600 text-white"
                      : "text-gray-600"
                      }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Course Selection List */}
            <div className="mt-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Select Course
              </h4>
              <div className="space-y-2">
                {apiCourses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center gap-3 p-2 rounded-lg border border-gray-200 bg-gray-50 transition-all"
                  >
                    <div className="p-1.5 rounded-md bg-white shadow-sm">
                      <course.icon size={18} className="text-gray-500" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {course.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Select Plan */}
            <div className="mt-4">
              <h4 className="font-semibold text-gray-800 mb-2">Select Plan:</h4>
              <div className="space-y-2">
                {singlePlans.map((item) => (
                  <div
                    key={item.exams}
                    onClick={(e) => {
                      e.stopPropagation();

                      setPlan("single"); // 🔥 Ensure card is selected
                      setSelectedExam(item.exams);
                    }}
                    className={`flex justify-between items-center p-3 rounded-lg border cursor-pointer ${selectedExam === item.exams
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-200"
                      }`}
                  >
                    <span>{item.exams} Exams</span>
                    <span className="text-purple-700 font-semibold">
                      ₹{item.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* DUAL COURSE */}
          <div
            onClick={() => setPlan("dual")}
            className={`bg-white rounded-xl shadow-md p-6 cursor-pointer border-2 relative ${plan === "dual" ? "border-purple-600" : "border-transparent"
              }`}
          >
            <span className="absolute -top-3 left-4 bg-purple-600 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
              <Star size={12} />
              POPULAR
            </span>

            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Dual Course</h3>
              <Users className="text-purple-600" />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Select 2 courses for balanced learning
            </p>

            {/* Course Selection List for Dual */}
            <div className="mt-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Select 2 Courses
              </h4>
              <div className="space-y-2">
                {apiCourses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center gap-3 p-2 rounded-lg border border-gray-200 bg-gray-50 transition-all"
                  >
                    <div className="p-1.5 rounded-md bg-white shadow-sm">
                      <course.icon size={18} className="text-gray-500" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {course.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="space-y-3 text-sm p-4 rounded-lg mt-5
                border-t border-[#7C3AED33]
                bg-gradient-to-br from-[rgba(124,58,237,0.1)] to-[rgba(109,40,217,0.1)]"
            >
              {" "}
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Courses:</span>
                <span className="font-medium text-gray-800">2 Courses</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Per Course:</span>
                <span className="font-medium text-gray-800">3 Exams</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Exams:</span>
                <span className="font-medium text-gray-800">{dualExams} Exams</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="text-gray-600">Base Price:</span>
                <span className="text-purple-700 font-semibold text-lg">
                  ₹{dualPrice}
                </span>
              </div>
              <p className="text-right text-gray-500 text-xs">+ GST</p>
            </div>

            <div className="mt-4 flex items-center text-sm text-gray-600">
              <Check size={14} className="text-green-600 mr-2" />
              <span>Technical + Non-Technical</span>
            </div>
          </div>

          {/* TRIPLE COURSE */}
          <div
            onClick={() => setPlan("triple")}
            className={`bg-white rounded-xl shadow-md p-6 cursor-pointer border-2 relative ${plan === "triple" ? "border-yellow-500" : "border-transparent"
              }`}
          >
            <span className="absolute -top-3 left-4 bg-yellow-500 text-black text-xs px-3 py-1 rounded-full flex items-center gap-1">
              <Crown size={12} />
              PREMIUM
            </span>

            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Triple Course</h3>
              <Crown className="text-yellow-500" />
            </div>

            <p className="text-sm text-gray-500 mt-2">
              Select 3 courses for comprehensive learning
            </p>

            {/* Course Selection List for Triple */}
            <div className="mt-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Select 3 Courses
              </h4>
              <div className="space-y-2">
                {apiCourses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center gap-3 p-2 rounded-lg border border-gray-200 bg-gray-50 transition-all"
                  >
                    <div className="p-1.5 rounded-md bg-white shadow-sm">
                      <course.icon size={18} className="text-gray-500" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {course.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="space-y-3 text-sm p-4 rounded-lg mt-5
                border-t border-[#FBBF2433]
                bg-gradient-to-br from-[rgba(251,191,36,0.1)] to-[rgba(208,135,0,0.1)]"
            >
              {" "}
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Courses:</span>
                <span className="font-medium text-gray-800">3 Courses</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Per Course:</span>
                <span className="font-medium text-gray-800">2 Exams</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Exams:</span>
                <span className="font-medium text-gray-800">{tripleExams} Exams</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="text-gray-600">Base Price:</span>
                <span className="text-yellow-600 font-semibold text-lg">
                  ₹{triplePrice}
                </span>
              </div>
              <p className="text-right text-gray-500 text-xs">+ GST</p>
            </div>

            <div className="mt-4 flex items-center text-sm text-gray-600">
              <Check size={14} className="text-green-600 mr-2" />
              <span>All Courses Included</span>
            </div>
          </div>
        </div>

        {/* PRICE SUMMARY */}
        <div className="mt-10 bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row justify-between gap-6">
          {/* LEFT */}
          <div
            onClick={() => {
              navigate("/summary", {
                state: {
                  plan,
                  totalExams,
                  totalCourses,
                  basePrice,
                  total,
                },
              });
              window.scrollTo(0, 0);
            }}
            className="w-full md:w-1/2 bg-gray-100 rounded-lg p-4 cursor-pointer hover:bg-gray-200 transition-colors"
          >
            <h4 className="font-semibold mb-3">Price Summary</h4>

            <div className="flex justify-between text-sm">
              <span>Base Price:</span>
              <span>₹{basePrice}</span>
            </div>

            <div className="flex justify-between text-sm mt-2">
              <span>Subtotal:</span>
              <span>₹{basePrice}</span>
            </div>

            <div className="flex justify-between text-sm mt-2">
              <span>GST (18%):</span>
              <span>₹{gst}</span>
            </div>

            <div className="flex justify-between font-bold text-lg mt-3">
              <span>Total Amount:</span>
              <span className="text-purple-700">₹{total}</span>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              {/* Exams */}
              <div className="bg-purple-100 rounded-xl py-4 text-center">
                <p className="text-xl font-bold text-purple-700">
                  {totalExams}
                </p>
                <p className="text-sm text-gray-600">Exams</p>
              </div>

              {/* Courses */}
              <div className="bg-green-100 rounded-xl py-4 text-center">
                <p className="text-xl font-bold text-green-700">
                  {totalCourses}
                </p>
                <p className="text-sm text-gray-600">Course</p>
              </div>

              {/* Days */}
              <div className="bg-yellow-100 rounded-xl py-4 text-center">
                <p className="text-xl font-bold text-yellow-600">90</p>
                <p className="text-sm text-gray-600">Days</p>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <div className="flex gap-3 mt-4">
              {/* Buy Now */}
              <button
                onClick={handleBuyNow}
                disabled={isProcessing}
                className="flex-1 bg-gradient-to-b from-[#7C3AED] to-[#5F28A3]
             text-white py-3 rounded-xl
             font-semibold
             hover:shadow-xl
             flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  <>
                    <ShoppingCart size={18} />
                    Buy Now →
                  </>
                )}
              </button>

              {/* Upgrade Later */}
              <button
                onClick={() => {
                  navigate("/studentdashboard");
                  window.scrollTo(0, 0);
                }}
                className="flex-1 border py-3 rounded-xl
             flex items-center justify-center gap-2
             hover:shadow-lg"
              >
                <TrendingUp size={18} />
                Upgrade Later
              </button>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 mt-4 text-sm">
              <p className="font-semibold mb-2 flex items-center gap-2">
                <Sparkles size={16} className="text-purple-600" />
                What's Included:
              </p>
              <ul className="space-y-1 text-gray-600">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-600" />
                  Detailed performance analytics
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-600" />
                  Industry-recognized certificates
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-600" />
                  Mobile & desktop access
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-green-600" />
                  24/7 customer support
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

