import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type SuccessRateChartProps = {
  successData: { name: string; value: number; label: string }[];
};

const SuccessRateChart: React.FC<SuccessRateChartProps> = ({ successData }) => {
  return (
    <div className="bg-white rounded-2xl border border-[#e5e7eb] p-3 sm:p-4 md:p-5 shadow-sm">
      <h2 className="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[18px] font-semibold text-[#111827] text-[10px] mb-4">
        Student Success Rate
      </h2>

      <div className="w-full h-[240px] sm:h-[300px] md:h-[340px] lg:h-[360px] xl:h-[380px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={successData}
              cx="50%"
              cy="50%"
              innerRadius={0}
              outerRadius={95}
                dataKey="value"
              stroke="white"
              strokeWidth={2}
            >
              <Cell fill="#10B981" />
              <Cell fill="#EF4444" />
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        {/* Left Label */}
        <div className="absolute left-0 sm:left-2 top-1/3 -translate-y-1/6 text-[#19B985] text-[8px] sm:text-[10px] md:text-[12px] font-medium">
          Pass: 745 (88%)
        </div>

        {/* Right Label */}
        <div className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/6 text-[#F44343] text-[8px] sm:text-[10px] md:text-[12px] font-medium">
          Fail: 103 (12%)
        </div>
      </div>
    </div>
  );
};

export default SuccessRateChart;
