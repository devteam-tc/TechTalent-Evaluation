import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type ParticipationChartProps = {
  participationData: { month: string; value: number }[];
};

const ParticipationChart: React.FC<ParticipationChartProps> = ({ participationData }) => {
  return (
    <div className="bg-white rounded-2xl border border-grey-200 p-3 sm:p-4 md:p-5 shadow-sm">
      <h2 className="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[18px] font-semibold text-[#111827] mb-4">
        Exam Participation Rate
      </h2>

      <div className="w-full h-[260px] sm:h-[320px] md:h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={participationData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#4F46E5"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ParticipationChart;
