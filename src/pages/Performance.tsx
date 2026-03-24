import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, Target, Award, Zap } from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/* ---------------- DATA ---------------- */

type ExamData = {
  name: string;
  score: number;
  avg: number;
};

type CourseData = {
  name: string;
  value: number;
};

const examData: ExamData[] = [
  { name: "Exam 1", score: 70, avg: 70 },
  { name: "Exam 2", score: 65, avg: 70 },
  { name: "Exam 3", score: 80, avg: 70 },
  { name: "Exam 4", score: 85, avg: 70 },
  { name: "Exam 5", score: 95, avg: 70 },
  { name: "Exam 6", score: 97, avg: 70 },
  { name: "Exam 7", score: 74, avg: 70 },
  { name: "Exam 8", score: 72, avg: 70 },
  { name: "Exam 9", score: 85, avg: 70 },
  { name: "Exam 10", score: 83, avg: 70 },
  { name: "Exam 11", score: 98, avg: 70 },
  { name: "Exam 12", score: 87, avg: 70 },
];

const courseData: CourseData[] = [
  { name: "Technical", value: 78 },
  { name: "Non-Technical", value: 82 },
];

/* PROGRESS TREND DATA */
const trendData = [
  { week: "Week 1", score: 75 },
  { week: "Week 2", score: 78 },
  { week: "Week 3", score: 82 },
  { week: "Week 4", score: 85 },
];

/* SUBJECT PIE DATA */
const subjectData = [
  { name: "Programming", value: 85, color: "#6B21A8" },
  { name: "Data Structures", value: 78, color: "#3B82F6" },
  { name: "Algorithms", value: 72, color: "#10B981" },
  { name: "Aptitude", value: 88, color: "#F59E0B" },
];

/* ---------------- COMPONENT ---------------- */

const Performance = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white px-6 py-8 md:px-10 md:py-10">
        <button
          onClick={() => {
            navigate("/studentdashboard");
            window.scrollTo(0, 0);
          }}
          className="flex items-center gap-2 text-sm mb-6 hover:opacity-80"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <h1 className="text-2xl md:text-3xl font-bold">
          Performance Analytics
        </h1>
        <p className="text-sm opacity-90 mt-1">
          Detailed insights into your examination performance
        </p>
      </div>

      {/* CONTENT */}
      <div className="p-6 md:p-10 space-y-8">
        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* CARD */}
          <div className="bg-white rounded-xl shadow-md p-5 flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Average Score</p>
              <p className="text-3xl font-bold text-purple-600">82%</p>
            </div>
            <TrendingUp className="text-purple-300 w-6 h-6" />
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Total Exams</p>
              <p className="text-3xl font-bold text-green-600">12</p>
            </div>
            <Target className="text-green-300 w-6 h-6" />
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Pass Rate</p>
              <p className="text-3xl font-bold text-orange-500">100%</p>
            </div>
            <Award className="text-orange-300 w-6 h-6" />
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Highest Score</p>
              <p className="text-3xl font-bold text-yellow-500">96%</p>
            </div>
            <Zap className="text-yellow-300 w-6 h-6" />
          </div>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* EXAM PERFORMANCE */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="font-semibold mb-4">Exam-to-Exam Performance</h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={examData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />

                <Bar dataKey="score" fill="#6B21A8" name="Your Score" />
                <Bar dataKey="avg" fill="#DDD6FE" name="Average" />
              </BarChart>
            </ResponsiveContainer>

            <div className="flex gap-4 mt-4 text-sm">
              <span className="text-purple-700">■ Your Score</span>
              <span className="text-purple-300">■ Average</span>
            </div>
          </div>

          {/* COURSE ACCURACY */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="font-semibold mb-4">Course-wise Accuracy</h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart layout="vertical" data={courseData}>
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" />
                <Tooltip />

                <Bar dataKey="value" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* PROGRESS TREND */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="font-semibold mb-4">Progress Trend</h2>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <XAxis dataKey="week" />
                <YAxis domain={[0, 100]} />
                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#6B21A8"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>

            <p className="text-center text-purple-600 mt-2 text-sm">
              Avg Score
            </p>
          </div>

          {/* SUBJECT PIE CHART */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="font-semibold mb-4">Subject-wise Performance</h2>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={subjectData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {subjectData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* PERFORMANCE INSIGHTS */}
      <div className="bg-gradient-to-r from-purple-100 to-purple-200 rounded-2xl p-6 shadow-md border border-purple-200 mt-6 mb-6 mx-10">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-600" />
          Performance Insights
        </h2>

        <div className="space-y-3 text-gray-700">
          <div className="flex items-start gap-3">
            <span className="w-2 h-2 bg-green-500 rounded-full mt-2"></span>
            <p>
              Your average score of{" "}
              <span className="font-bold text-purple-700">82%</span> is above
              the passing threshold. Great job!
            </p>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-2 h-2 bg-green-500 rounded-full mt-2"></span>
            <p>
              You've shown consistent improvement in Non-Technical subjects with
              82% accuracy.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-2 h-2 bg-orange-400 rounded-full mt-2"></span>
            <p>
              Consider focusing more on Algorithms to improve your overall
              Technical score.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Performance;
