import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type CoursePerformanceChartProps = {
  coursePerformanceData: { course: string; avgScore: number; students: number }[];
};

const CoursePerformanceChart: React.FC<CoursePerformanceChartProps> = ({ coursePerformanceData }) => {
  return (
    <div className="bg-white rounded-2xl border border-[#e5e7eb] p-3 sm:p-4 md:p-5 shadow-sm mb-6">
      <h2 className="text-base sm:text-lg font-semibold text-[#111827] mb-5">
        Course-wise Performance
      </h2>

      <div className="w-full h-[360px] sm:h-[420px] md:h-[460px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={coursePerformanceData}
            layout="vertical"
            margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
            barCategoryGap={16}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              type="number"
              domain={[0, 600]}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              dataKey="course"
              type="category"
              width={90}
              tick={{ fontSize: 11 }}
            />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="students"
              name="Students"
              fill="#4F46E5"
              radius={[0, 8, 8, 0]}
            />
            <Bar
              dataKey="avgScore"
              name="Avg Score"
              fill="#06B6D4"
              radius={[0, 8, 8, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CoursePerformanceChart;
