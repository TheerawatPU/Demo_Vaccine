import { useState } from "react";
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
const generateData = (type: string) => {
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
    <div className="flex h-screen w-full bg-[#f8fafc] overflow-hidden">
      
      {/* 🟦 BACKDROP: พื้นหลังสีดำจางๆ บนมือถือเวลาเปิด Sidebar */}
      {!collapsed && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 z-40 transition-opacity"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* 🟦 SIDEBAR */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* 🟦 MAIN LAYOUT AREA */}
      <div
        className={`flex-1 flex flex-col h-full transition-all duration-300 relative
        ${collapsed ? "md:ml-20" : "md:ml-64"}
        ml-0`} 
      >
        {/* TOPNAV */}
        <div className="shrink-0 z-30 relative">
          <TopNav collapsed={collapsed} setCollapsed={setCollapsed} />
        </div>

        {/* DASHBOARD CONTENT: เนื้อหาที่ไถ Scroll ได้ */}
        {/* 🛠️ แก้ไข: เพิ่ม flex flex-col เพื่อให้ลูกข้างในใช้ flex-1 ยืดให้เต็มจอได้ */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 w-full flex flex-col">
          
          {/* KPI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 shrink-0">
            <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-4 md:p-6 flex items-center justify-between relative overflow-hidden h-[130px] md:h-[160px]">
              <div className="relative z-10">
                <p className="text-sm text-gray-400">เด็กมาตามนัด</p>
                <h2 className="text-3xl md:text-4xl font-semibold text-blue-600 mt-1 md:mt-2">85</h2>
                <p className="text-[10px] md:text-xs text-blue-400 mt-1">+5% จากสัปดาห์ก่อน</p>
              </div>

              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-[6px] border-blue-500 flex items-center justify-center shrink-0 relative z-10">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full"></div>
              </div>

              <div className="absolute -bottom-10 -right-10 w-32 h-32 md:w-40 md:h-40 bg-blue-50 rounded-full opacity-30"></div>
            </div>

            <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-4 md:p-6 flex items-center justify-between relative overflow-hidden h-[130px] md:h-[160px]">
              <div className="relative z-10">
                <p className="text-sm text-gray-400">เด็กผิดนัด</p>
                <h2 className="text-3xl md:text-4xl font-semibold text-red-500 mt-1 md:mt-2">15</h2>
                <p className="text-[10px] md:text-xs text-red-400 mt-1">+2 จากเมื่อวาน</p>
              </div>

              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-[6px] border-red-500 flex items-center justify-center shrink-0 relative z-10">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 rounded-full"></div>
              </div>

              <div className="absolute -bottom-10 -right-10 w-32 h-32 md:w-40 md:h-40 bg-red-50 rounded-full opacity-30"></div>
            </div>
          </div>

          {/* CHART PANEL */}
          {/* 🛠️ แก้ไข: ลบ md:h-auto ออก และใช้ min-h-[350px] ร่วมกับ md:flex-1 เพื่อให้กราฟมีพื้นที่เสมอ */}
          <div className="mt-4 md:mt-6 bg-white rounded-2xl border border-sky-50 shadow-sm p-4 md:p-5 flex flex-col min-h-[350px] md:flex-1 shrink-0 mb-6 md:mb-0">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 text-sm shrink-0">
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
              <div className="flex bg-gray-100 rounded-full p-1 w-full sm:w-auto justify-between">
                {["day", "month", "year"].map((item) => (
                  <button
                    key={item}
                    onClick={() => setRange(item)}
                    className={`flex-1 sm:flex-none px-4 py-1 text-[12px] rounded-full transition-all duration-200 cursor-pointer text-center
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
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-1 shrink-0"></div>
                มาตามนัด
              </div>

              <div className="flex items-center text-red-500">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-1 shrink-0"></div>
                ผิดนัด
              </div>
            </div>

            {/* GRAPH */}
            <div className="flex-1 w-full min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} width={30} />
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
      </div>
    </div>
  );
}

export default Dashboard;