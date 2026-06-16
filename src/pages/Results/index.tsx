import React from "react";
import { TrendingUp, Award, AlertCircle, Download } from "lucide-react";
import { FiBarChart2 } from "react-icons/fi";
import ResultCharts from "./ResultCharts";
import ResultsFilterBar from "./ResultsFilterBar";
import ResultsTable from "./ResultsTable";

const Result: React.FC = () => {
  const data = [
    {
      title: "Total Results",
      value: "8",
      subtitle: "All submissions",
      icon: <FiBarChart2 size={20} />,
      gradient: "linear-gradient(135deg, #615FFF 0%, #9810FA 100%)",
    },
    {
      title: "Pass Rate",
      value: "75%",
      subtitle: "6 students passed",
      icon: <TrendingUp size={20} />,
      gradient: "linear-gradient(135deg, #00C950 0%, #009966 100%)",
    },
    {
      title: "Average Score",
      value: "76%",
      subtitle: "Overall performance",
      icon: <Award size={20} />,
      gradient: "linear-gradient(135deg, #2B7FFF 0%, #4F39F6 100%)",
    },
    {
      title: "Failed",
      value: "2",
      subtitle: "Require attention",
      icon: <AlertCircle size={20} />,
      gradient: "linear-gradient(135deg, #FB2C36 0%, #EC003F 100%)",
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Results Management
          </h1>
          <p className="text-gray-500 text-sm">
            Monitor and analyze exam performance across all students
          </p>
        </div>

        <button className="mt-4 md:mt-0 flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700 transition">
          <Download size={16} />
          Export Report
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {data.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow p-5 flex justify-between items-center"
          >
            <div>
              <p className="text-gray-500 text-sm">{item.title}</p>
              <h2 className="text-2xl font-bold text-gray-800">{item.value}</h2>
              <p className="text-xs text-gray-400 mt-1">{item.subtitle}</p>
            </div>

            <div
              className="p-3 rounded-lg text-white"
              style={{ background: item.gradient }}
            >
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <ResultCharts />

      {/* Filter Bar */}
      <ResultsFilterBar />

      {/* Results Table */}
      <ResultsTable />
    </div>
  );
};

export default Result;
