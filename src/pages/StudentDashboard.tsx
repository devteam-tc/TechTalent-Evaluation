import { useNavigate } from "react-router-dom";
import Devlogo from "../assests/Devlogo.png";
import FilterIcon from "../assests/icon.png";
import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { Dot } from "lucide-react";
import {
  Link,
  PlayCircle,
  BarChart3,
  Award,
  FileText,
  ChevronRight,
  CreditCard,
} from "lucide-react";
import {
  User,
  LogOut,
  BookOpen,
  CheckCircle,
  Clock,
  Calendar,
  Trophy,
  Medal,
  Circle,
  CheckCircle2,
} from "lucide-react";

const StudentDashboard = () => {
  const navigate = useNavigate();

  const [course, setCourse] = useState("Non-Technical");
  const [time, setTime] = useState("All Time");

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 px-4 sm:px-8 pt-24 pb-10">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="flex justify-between items-center px-6 py-3">
          <img
            src={Devlogo}
            alt="logo"
            style={{ width: "72px", height: "72px", opacity: 1 }}
          />

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 font-medium text-gray-700"
            >
              <User className="w-4 h-4" />
              Rahul Sharma
            </button>

            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-red-500 hover:text-red-700 transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* HEADER */}
      <div className="mb-6 mt-10">
        <h1 className="text-2xl font-bold">Welcome back, Rahul!</h1>
        <p className="text-gray-500">Here's your learning progress overview</p>
      </div>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-5 rounded-xl shadow-xl flex justify-between items-center">
          <BookOpen />
          <div className="text-right">
            <p className="text-2xl font-bold">2</p>
            <p className="text-sm">Active Courses</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-5 rounded-xl shadow-xl flex justify-between items-center">
          <CheckCircle />
          <div className="text-right">
            <p className="text-2xl font-bold">12</p>
            <p className="text-sm">Completed Exams</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-5 rounded-xl shadow-xl flex justify-between items-center">
          <Clock />
          <div className="text-right">
            <p className="text-2xl font-bold">8</p>
            <p className="text-sm">Pending Exams</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white p-5 rounded-xl shadow-xl flex justify-between items-center">
          <Calendar />
          <div className="text-right">
            <p className="text-2xl font-bold">135</p>
            <p className="text-sm">Days Remaining</p>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">
          {/* PERFORMANCE CARD */}
          <div className="rounded-2xl shadow-xl border border-purple-200 overflow-hidden bg-white">
            {/* HEADER */}
            <div className="bg-gradient-to-r from-purple-200 to-purple-100 px-6 py-5">
              <h2 className="font-semibold text-lg flex items-center gap-2 text-gray-800">
                <Trophy className="w-5 h-5 text-purple-600" />
                Performance Metrics
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Your examination performance at a glance
              </p>
            </div>

            {/* CONTENT */}
            <div className="p-6 space-y-6">
              {/* STATS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div
                  className="rounded-xl py-8 text-center shadow-sm"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(124, 58, 237, 0.5) 0%, #FAF5FF 100%)",
                  }}
                >
                  <p className="text-4xl font-bold text-purple-700">82%</p>
                  <p className="text-gray-600 text-sm mt-1">Avg Score</p>
                </div>

                <div
                  className="rounded-xl py-8 text-center shadow-sm"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(11, 176, 121, 0.5) 10%, #F0FDF4 100%)",
                  }}
                >
                  <p className="text-4xl font-bold text-green-700">12</p>
                  <p className="text-gray-600 text-sm mt-1">Passed</p>
                </div>

                <div
                  className="rounded-xl py-8 text-center shadow-sm"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(245, 158, 11, 0.5) 0%, #FFF7ED 100%)",
                  }}
                >
                  <p className="text-4xl font-bold text-orange-500">100%</p>
                  <p className="text-gray-600 text-sm mt-1">Pass Rate</p>
                </div>
              </div>

              {/* CURRENT LEVEL */}
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <p className="font-semibold text-gray-800 flex items-center gap-2">
                    <Medal className="w-5 h-5 text-purple-600" />
                    Current Level
                  </p>

                  <p className="text-orange-500 text-sm mt-1">
                    Congratulations! You've reached the highest level
                  </p>
                </div>

                <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium w-fit">
                  L4 - Advanced
                </span>
              </div>
            </div>
          </div>

          {/* PROGRESS */}
          {/* OVERALL PROGRESS */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
            <h2 className="flex items-center gap-2 font-semibold text-lg mb-4">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Overall Progress
            </h2>

            {/* Progress Label */}
            <div className="flex justify-between text-sm mb-2">
              <p className="text-gray-700">Exam Completion</p>
              <p className="text-purple-600 font-semibold">60%</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-purple-200 rounded-full overflow-hidden">
              <div className="h-full bg-purple-700 w-[60%]" />
            </div>

            <div className="border-t my-4"></div>

            {/* Stats */}
            <div className="flex justify-between text-center">
              <div>
                <p className="text-3xl font-bold text-green-500">12</p>
                <p className="text-gray-500 text-sm">Completed</p>
              </div>

              <div>
                <p className="text-3xl font-bold text-orange-500">8</p>
                <p className="text-gray-500 text-sm">Pending</p>
              </div>
            </div>
          </div>
          {/* TECHNICAL COURSE */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">Technical Course</h2>
              <p className="text-gray-500 text-sm">6 / 10 exams</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-purple-200 rounded-full overflow-hidden mb-5">
              <div className="h-full bg-purple-700 w-[60%]" />
            </div>

            {/* Subjects */}
            <div className="space-y-3">
              {/* ITEM */}
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                <CheckCircle className="text-green-500 w-5 h-5" />
                <div>
                  <p className="font-medium text-gray-800">
                    Data Structures & Algorithms
                  </p>
                  <p className="text-green-600 text-sm">Score: 69%</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                <CheckCircle className="text-green-500 w-5 h-5" />
                <div>
                  <p className="font-medium text-gray-800">
                    Object-Oriented Programming
                  </p>
                  <p className="text-green-600 text-sm">Score: 67%</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                <CheckCircle className="text-green-500 w-5 h-5" />
                <div>
                  <p className="font-medium text-gray-800">
                    Database Management Systems
                  </p>
                  <p className="text-green-600 text-sm">Score: 79%</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-5">
              <button className="text-purple-600 font-medium hover:underline">
                View All Exams →
              </button>
            </div>
          </div>
          {/* NON-TECHNICAL COURSE */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">Non-Technical Course</h2>
              <p className="text-gray-500 text-sm">6 / 10 exams</p>
            </div>

            {/* PROGRESS BAR */}
            <div className="w-full h-2 bg-purple-200 rounded-full overflow-hidden mb-5">
              <div className="h-full bg-purple-700 w-[60%]" />
            </div>

            {/* SUBJECT LIST */}
            <div className="space-y-4">
              {/* ITEM */}
              <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-4">
                <CheckCircle className="text-green-500 w-5 h-5" />
                <div>
                  <p className="font-medium text-gray-900">
                    Communication Skills
                  </p>
                  <p className="text-green-600 text-sm">Score: 74%</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-4">
                <CheckCircle className="text-green-500 w-5 h-5" />
                <div>
                  <p className="font-medium text-gray-900">Logical Reasoning</p>
                  <p className="text-green-600 text-sm">Score: 73%</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-4">
                <CheckCircle className="text-green-500 w-5 h-5" />
                <div>
                  <p className="font-medium text-gray-900">
                    Quantitative Aptitude
                  </p>
                  <p className="text-green-600 text-sm">Score: 84%</p>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="text-center mt-6">
              <button className="text-purple-600 font-medium hover:underline">
                View All Exams →
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">
          {/* FILTERS */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div
              className="text-black p-4"
              style={{
                background:
                  "linear-gradient(90deg, rgba(124, 58, 237, 0.5) 0%, #FAF5FF 50%, #F5F3FF 100%)",
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    opacity: 1,
                    borderRadius: "12px",
                    background:
                      "linear-gradient(180deg, #7C3AED 0%, #6D28D9 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "6px",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={FilterIcon}
                    alt="Filters Icon"
                    style={{
                      width: "20px",
                      height: "20px",
                      opacity: 1,
                    }}
                  />
                </div>
                <div>
                  <h2 className="font-semibold">Filters</h2>
                  <p
                    className="text-sm opacity-80"
                    style={{ color: "#6B7280" }}
                  >
                    Customize stats view
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-6">
              {/* COURSE TYPE */}
              <div>
                <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-600" />
                  Course Type
                </p>

                <div className="space-y-3">
                  {["All Courses", "Technical", "Non-Technical"].map((item) => (
                    <button
                      key={item}
                      onClick={() => setCourse(item)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition
          ${
            course === item
              ? "bg-purple-600 text-white shadow-md border-purple-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            course === item ? "bg-white" : "bg-purple-500"
                          }`}
                        ></span>
                        {item}
                      </div>

                      {course === item && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* DIVIDER */}
              <div className="border-t"></div>

              {/* TIME PERIOD */}
              <div>
                <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green-600" />
                  Time Period
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {["All Time", "Week", "Month", "3 Months"].map((item) => (
                    <button
                      key={item}
                      onClick={() => setTime(item)}
                      className={`py-2.5 rounded-xl border transition
          ${
            time === item
              ? "bg-green-500 text-white shadow-md border-green-500"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
                    >
                      {time === item && "✔ "}
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* ACTIVE TAG */}
              <div className="text-sm text-gray-600">
                Active:{" "}
                <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs">
                  {course === "Non-Technical" ? "Non-Tech" : course}
                </span>
              </div>

              {/* APPLY BUTTON */}
              <button className="w-full bg-purple-700 text-white py-3 rounded-xl shadow-md hover:opacity-90 transition">
                Apply Filters
              </button>
            </div>
          </div>

          {/* QUICK LINKS */}
          {/* QUICK LINKS */}
          <div className="bg-white rounded-2xl shadow-xl border border-purple-200 overflow-hidden">
            {/* HEADER */}
            <div className="bg-gradient-to-r from-purple-200 to-purple-100 px-5 py-4 flex items-center gap-2">
              <Link className="text-purple-700 w-5 h-5" />
              <h2 className="font-semibold text-purple-800">Quick Links</h2>
            </div>

            {/* LIST */}
            <div className="p-4 space-y-3">
              {/* ITEM */}
              <div
                className="flex items-center justify-between bg-gray-50 border rounded-xl px-4 py-3 hover:bg-purple-50 transition cursor-pointer"
                onClick={() => {
                  navigate("/individualterms");
                  window.scrollTo(0, 0);
                }}
              >
                <div className="flex items-center gap-3">
                  <PlayCircle className="text-purple-600 w-5 h-5" />
                  <p className="font-medium text-gray-800">Start Exam</p>
                </div>
                <ChevronRight className="text-purple-500 w-5 h-5" />
              </div>

              <div
                className="flex items-center justify-between bg-gray-50 border rounded-xl px-4 py-3 hover:bg-purple-50 transition cursor-pointer"
                onClick={() => {
                  navigate("/performance");
                  window.scrollTo(0, 0);
                }}
              >
                <div className="flex items-center gap-3">
                  <BarChart3 className="text-purple-600 w-5 h-5" />
                  <p className="font-medium text-gray-800">Analytics</p>
                </div>
                <ChevronRight className="text-purple-500 w-5 h-5" />
              </div>

              <div
                className="flex items-center justify-between bg-gray-50 border rounded-xl px-4 py-3 hover:bg-purple-50 transition cursor-pointer"
                onClick={() => {
                  navigate("/certificate");
                  window.scrollTo(0, 0);
                }}
              >
                <div className="flex items-center gap-3">
                  <Award className="text-purple-600 w-5 h-5" />
                  <p className="font-medium text-gray-800">Certificates</p>
                </div>
                <ChevronRight className="text-purple-500 w-5 h-5" />
              </div>

              <div
                className="flex items-center justify-between bg-gray-50 border rounded-xl px-4 py-3 hover:bg-purple-50 transition cursor-pointer"
                onClick={() => {
                  navigate("/payments");
                  window.scrollTo(0, 0);
                }}
              >
                <div className="flex items-center gap-3">
                  <FileText className="text-purple-600 w-5 h-5" />
                  <p className="font-medium text-gray-800">Payments</p>
                </div>
                <ChevronRight className="text-purple-500 w-5 h-5" />
              </div>
            </div>
          </div>

          {/* SUBSCRIPTION */}
          {/* ACTIVE SUBSCRIPTION */}
          <div className="bg-white rounded-2xl shadow-xl border border-purple-200 overflow-hidden">
            {/* HEADER */}
            <div className="bg-gradient-to-r from-purple-200 to-purple-100 px-5 py-4 flex items-center gap-2">
              <CreditCard className="text-purple-700 w-5 h-5" />
              <h2 className="font-semibold text-purple-800">
                Active Subscription
              </h2>
            </div>

            {/* CONTENT */}
            <div className="p-5 space-y-4 text-gray-700">
              <div>
                <p className="text-sm text-gray-500">Plan</p>
                <p className="font-semibold text-gray-900">Dual Course Plan</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Courses</p>
                <p className="font-medium text-gray-800">
                  Technical, Non-Technical
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Validity</p>
                <p className="text-green-600 font-semibold">
                  135 days remaining
                </p>
                <p className="text-sm text-gray-500">Expires: 29/06/2026</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="text-green-600 font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Active
                </p>
              </div>

              {/* BUTTON */}
              <button className="w-full mt-3 border rounded-xl py-2 flex items-center justify-center gap-2 hover:bg-gray-50 transition">
                <FileText className="w-4 h-4" />
                Download Invoice
              </button>
            </div>
          </div>

          {/* UPGRADE */}
          {/* UPGRADE CARD */}
          <div
            className="rounded-2xl p-6 shadow-xl text-center border border-yellow-400"
            style={{
              background:
                "linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, #FEF9C2 100%)",
            }}
          >
            {/* ICON */}
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-yellow-500 flex items-center justify-center shadow-md">
              <Award className="text-white w-6 h-6" />
            </div>

            {/* TITLE */}
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Unlock Advanced
            </h3>

            {/* DESCRIPTION */}
            <p className="text-gray-500 text-sm mb-5">
              Get access to L4 Advanced certification
              <br />
              and premium exams
            </p>

            {/* BUTTON */}
            <button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold py-3 rounded-xl shadow hover:opacity-90 transition">
              Upgrade Now
            </button>
          </div>
          {/* RECENT ACTIVITY */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
            {/* TITLE */}
            <h2 className="text-lg font-semibold mb-5">Recent Activity</h2>

            {/* LIST */}
            <div className="space-y-4">
              {/* ITEM */}
              <div className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 mt-2 bg-green-500 rounded-full"></span>
                <div>
                  <p className="font-medium text-gray-800">
                    Data Structures & Algorithms
                  </p>
                  <p className="text-sm text-gray-500">
                    Completed - Score: 69%
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 mt-2 bg-green-500 rounded-full"></span>
                <div>
                  <p className="font-medium text-gray-800">
                    Object-Oriented Programming
                  </p>
                  <p className="text-sm text-gray-500">
                    Completed - Score: 67%
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 mt-2 bg-green-500 rounded-full"></span>
                <div>
                  <p className="font-medium text-gray-800">
                    Database Management Systems
                  </p>
                  <p className="text-sm text-gray-500">
                    Completed - Score: 79%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
