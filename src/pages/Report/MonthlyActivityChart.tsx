import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type MonthlyActivityChartProps = {
  monthlyActivityData: { month: string; exams: number }[];
};

const MonthlyActivityChart: React.FC<MonthlyActivityChartProps> = ({ monthlyActivityData }) => {
  return (
    <div className="bg-white rounded-2xl border border-[#e5e7eb] p-3 sm:p-4 md:p-5 shadow-sm">
      <h2 className="text-base sm:text-lg font-semibold text-[15px] mb-4">
        Monthly Exam Activity
      </h2>

      <div className="w-full h-[260px] sm:h-[320px] md:h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyActivityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="exams" fill="#6366F1" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyActivityChart;
