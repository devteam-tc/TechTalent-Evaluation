import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const barData = [
  { name: "90-100", value: 2, fill: "#10B981" }, // green
  { name: "80-89", value: 2, fill: "#3B82F6" }, // blue
  { name: "70-79", value: 2, fill: "#8B5CF6" }, // purple
  { name: "60-69", value: 0, fill: "#E5E7EB" }, // empty
  { name: "Below 60", value: 2, fill: "#EF4444" }, // red
];

const pieData = [
  { name: "Pass", value: 75 },
  { name: "Fail", value: 25 },
];

const COLORS = ["#10B981", "#EF4444"];

function ResultCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Grade Distribution */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="text-gray-700 font-semibold mb-4">Grade Distribution</h2>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                <Cell fill="#10B981" />
                <Cell fill="#3B82F6" />
                <Cell fill="#8B5CF6" />
                <Cell fill="#E5E7EB" />
                <Cell fill="#EF4444" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pass/Fail Ratio */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Pass/Fail Ratio
        </h2>

        <div className="flex items-center justify-center relative h-64">
          <PieChart width={260} height={260}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={0}
              outerRadius={90}
              paddingAngle={0}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>

          {/* Labels positioned like UI */}
          <div className="absolute top-6 left-10 text-green-600 text-sm font-medium">
            Pass: 75%
          </div>
          <div className="absolute bottom-6 right-10 text-red-500 text-sm font-medium">
            Fail: 25%
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultCharts;
