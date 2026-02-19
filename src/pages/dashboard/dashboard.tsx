import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ===== AUTO DATA GENERATOR =====
const generateData = (type) => {
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();
  const startYear = 2018;

  let count = 0;
  let label = "";

  if (type === "D") {
    count = currentDay;
    label = "D";
  }

  if (type === "M") {
    count = currentMonth;
    label = "M";
  }

  if (type === "Y") {
    count = currentYear - startYear + 1;
    label = "Y";
  }

  return Array.from({ length: count }, (_, i) => ({
    name:
      label === "D"
        ? `${i + 1}`
        : label === "M"
          ? new Date(0, i).toLocaleString("en", { month: "short" })
          : `${startYear + i}`,
    attend: Math.floor(Math.random() * 50) + 20,
    miss: Math.floor(Math.random() * 20) + 5,
  }));
};

// ===== DATA =====
const daily = generateData("D");
const monthly = generateData("M");
const yearly = generateData("Y");

function Dashboard() {
  const [range, setRange] = useState("day");
  const [collapsed, setCollapsed] = useState(false);
  const data = range === "day" ? daily : range === "month" ? monthly : yearly;

  return (
    <div className="h-screen overflow-hidden">
      {/* TOPNAV */}
      <div
        className={`fixed top-0 ${collapsed ? "left-20" : "left-64"} right-0 z-40 transition-all duration-300`}
      >
        <TopNav collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* MAIN */}
      <div
        className={`${collapsed ? "ml-20" : "ml-64"} pt-20 bg-[#f8fafc] h-full p-6 flex flex-col transition-all duration-300`}
      >
        {/* KPI */}
        <div className="grid grid-cols-2 gap-6 h-[160px]">
          <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6 flex items-center justify-between relative overflow-hidden">
            <div>
              <p className="text-sm text-gray-400">เด็กมาตามนัด</p>
              <h2 className="text-4xl font-semibold text-blue-600 mt-2">85</h2>
              <p className="text-xs text-blue-400 mt-1">+5% จากสัปดาห์ก่อน</p>
            </div>

            <div className="w-20 h-20 rounded-full border-[6px] border-blue-500 flex items-center justify-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full"></div>
            </div>

            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-50 rounded-full opacity-30"></div>
          </div>

          <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6 flex items-center justify-between relative overflow-hidden">
            <div>
              <p className="text-sm text-gray-400">เด็กผิดนัด</p>
              <h2 className="text-4xl font-semibold text-red-500 mt-2">15</h2>
              <p className="text-xs text-red-400 mt-1">+2 จากเมื่อวาน</p>
            </div>

            <div className="w-20 h-20 rounded-full border-[6px] border-red-500 flex items-center justify-center">
              <div className="w-12 h-12 bg-red-100 rounded-full"></div>
            </div>

            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-red-50 rounded-full opacity-30"></div>
          </div>
        </div>

        {/* CHART PANEL */}
        <div className="flex-1 mt-6 bg-white rounded-2xl border border-sky-50 shadow-sm p-5 flex flex-col">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 text-sm">
                📊
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">
                  Vaccine Attendance Monitoring
                </p>
                <p className="text-[11px] text-gray-400">
                  Real-time up to today
                </p>
              </div>
            </div>

            {/* FILTER */}
            <div className="flex bg-gray-100 rounded-full p-1 ">
              {["day", "month", "year"].map((item) => (
                <button
                  key={item}
                  onClick={() => setRange(item)}
                  className={`px-4 py-1 text-[12px] rounded-full transition-all duration-200 cursor-pointer
                  ${
                    range === item
                      ? "bg-white shadow text-blue-600 font-medium"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {item.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* LEGEND */}
          <div className="flex justify-end mb-2 space-x-4 text-xs">
            <div className="flex items-center text-blue-600">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
              มาตามนัด
            </div>

            <div className="flex items-center text-red-500">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
              ผิดนัด
            </div>
          </div>

          {/* GRAPH */}
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="attend"
                stroke="#2563eb"
                strokeWidth={3}
                dot={false}
              />

              <Line
                type="monotone"
                dataKey="miss"
                stroke="#ef4444"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
