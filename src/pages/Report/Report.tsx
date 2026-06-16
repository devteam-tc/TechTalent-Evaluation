import React, { useMemo, useState } from "react";
import ReportHeader from "./ReportHeader";
import ReportStats from "./ReportStats";
import ParticipationChart from "./ParticipationChart";
import SuccessRateChart from "./SuccessRateChart";
import PerformanceChart from "./PerformanceChart";
import MonthlyActivityChart from "./MonthlyActivityChart";
import CoursePerformanceChart from "./CoursePerformanceChart";
import DetailedStatsTable from "./DetailedStatsTable";
import DetailedStatsCards from "./DetailedStatsCards";

type StatCard = {
  title: string;
  value: string;
  sub: string;
  color: "green" | "blue" | "purple";
};

type CourseRow = {
  course: string;
  students: number;
  exams: number;
  avgScore: number;
  passRate: number;
};

const Report: React.FC = () => {
  const [search, setSearch] = useState("");
  const [minPassRate, setMinPassRate] = useState<string>("0");
  const [error, setError] = useState("");

  const statCards: StatCard[] = [
    {
      title: "Overall Pass Rate",
      value: "87.8%",
      sub: "3.2% from last month",
      color: "green",
    },
    {
      title: "Avg. Participation",
      value: "82%",
      sub: "5% from last month",
      color: "blue",
    },
    {
      title: "Total Exams Conducted",
      value: "360",
      sub: "This year",
      color: "blue",
    },
    {
      title: "Avg. Exam Score",
      value: "78.5%",
      sub: "2.1% from last month",
      color: "purple",
    },
  ];

  const participationData = [
    { month: "Sep", value: 78 },
    { month: "Oct", value: 82 },
    { month: "Nov", value: 75 },
    { month: "Dec", value: 70 },
    { month: "Jan", value: 85 },
    { month: "Feb", value: 88 },
    { month: "Mar", value: 86 },
  ];

  const successData = [
    { name: "Pass", value: 745, label: "Pass: 745 (88%)" },
    { name: "Fail", value: 103, label: "Fail: 103 (12%)" },
  ];

  const avgPerformanceData = [
    { month: "Sep", avgScore: 72, passRate: 78 },
    { month: "Oct", avgScore: 74, passRate: 81 },
    { month: "Nov", avgScore: 72, passRate: 79 },
    { month: "Dec", avgScore: 78, passRate: 85 },
    { month: "Jan", avgScore: 80, passRate: 88 },
    { month: "Feb", avgScore: 82, passRate: 90 },
    { month: "Mar", avgScore: 81, passRate: 87 },
  ];

  const monthlyActivityData = [
    { month: "Sep", exams: 45 },
    { month: "Oct", exams: 52 },
    { month: "Nov", exams: 48 },
    { month: "Dec", exams: 40 },
    { month: "Jan", exams: 58 },
    { month: "Feb", exams: 62 },
    { month: "Mar", exams: 55 },
  ];

  const coursePerformanceData = [
    { course: "Computer Science", avgScore: 82, students: 450 },
    { course: "Data Science", avgScore: 78, students: 320 },
    { course: "Software Eng.", avgScore: 85, students: 280 },
    { course: "IT", avgScore: 75, students: 250 },
    { course: "Cybersecurity", avgScore: 80, students: 180 },
  ];

  const tableData: CourseRow[] = [
    {
      course: "Computer Science",
      students: 450,
      exams: 47,
      avgScore: 82,
      passRate: 90,
    },
    {
      course: "Data Science",
      students: 320,
      exams: 43,
      avgScore: 78,
      passRate: 86,
    },
    {
      course: "Software Eng.",
      students: 280,
      exams: 49,
      avgScore: 85,
      passRate: 92,
    },
    { course: "IT", students: 250, exams: 36, avgScore: 75, passRate: 92 },
    {
      course: "Cybersecurity",
      students: 180,
      exams: 44,
      avgScore: 80,
      passRate: 88,
    },
  ];

  const filteredRows = useMemo(() => {
    const value = Number(minPassRate);
    if (isNaN(value) || value < 0 || value > 100) return tableData;

    return tableData.filter((row) => {
      const matchesSearch = row.course
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesPassRate = row.passRate >= value;
      return matchesSearch && matchesPassRate;
    });
  }, [search, minPassRate]);

  return (
    <div className="min-h-screen bg-[#f5f3ff] px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 py-3 sm:py-4 md:py-5 lg:py-6">
      <div className="max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-[1400px] mx-auto">
        <ReportHeader />
        <ReportStats statCards={statCards} />

        {/* First Row Charts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 mb-6">
          <ParticipationChart participationData={participationData} />
          <SuccessRateChart successData={successData} />
        </div>

        {/* Second Row Charts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 mb-6">
          <PerformanceChart avgPerformanceData={avgPerformanceData} />
          <MonthlyActivityChart monthlyActivityData={monthlyActivityData} />
        </div>

        <CoursePerformanceChart coursePerformanceData={coursePerformanceData} />
        <DetailedStatsTable filteredRows={filteredRows} />
        <DetailedStatsCards filteredRows={filteredRows} />
      </div>
    </div>
  );
};

export default Report;
