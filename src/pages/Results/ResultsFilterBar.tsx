import React from "react";
import {
  Search,
  FileSpreadsheet,
  Download,
  FileText,
  Calendar,
} from "lucide-react";

function ResultsFilterBar() {
  return (
    <div className=" mt-10 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      {/* Top Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Search */}
        <div className="relative w-full lg:w-[55%]">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by student name or exam..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-2 justify-start lg:justify-end">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 text-white text-sm font-medium shadow hover:bg-green-700 transition">
            <FileSpreadsheet size={14} />
            Export Excel
          </button>

          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium shadow hover:bg-blue-700 transition">
            <Download size={16} />
            Export CSV
          </button>

          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium shadow hover:bg-red-700 transition">
            <FileText size={16} />
            Export PDF
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-5" />

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Exam */}
        <div>
          <label className="text-sm text-gray-600 mb-1 block">Exam</label>
          <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Courses</option>
            <option>React</option>
            <option>Java</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="text-sm text-gray-600 mb-1 block">Status</label>
          <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Status</option>
            <option>Pass</option>
            <option>Fail</option>
          </select>
        </div>

        {/* Date Range */}
        <div>
          <label className="text-sm text-gray-600 mb-1 block">Date Range</label>
          <div className="relative">
            <Calendar
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Select Date Range"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultsFilterBar;
