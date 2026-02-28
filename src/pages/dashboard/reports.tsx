import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from "recharts";

// --- CONSTANTS & MOCK DATA ---
const VAX_COLORS = ["#3b82f6", "#6366f1", "#10b981", "#22c55e", "#f59e0b", "#f43f5e", "#d946ef", "#8b5cf6", "#a855f7", "#64748b"];

const ATTENDANCE_TREND = [
  { name: "01/05", attended: 45, missed: 5 },
  { name: "05/05", attended: 52, missed: 8 },
  { name: "10/05", attended: 48, missed: 3 },
  { name: "15/05", attended: 61, missed: 12 },
  { name: "20/05", attended: 55, missed: 7 },
  { name: "25/05", attended: 68, missed: 4 },
  { name: "30/05", attended: 70, missed: 6 },
];

const TOP_10_VACCINES = [
  { name: "BCG", count: 120 },
  { name: "HBV", count: 98 },
  { name: "MMR", count: 86 },
  { name: "DTP", count: 75 },
  { name: "JE", count: 68 },
  { name: "IPV", count: 54 },
  { name: "OPV", count: 42 },
  { name: "HPV", count: 38 },
  { name: "FLU", count: 30 },
  { name: "ROT", count: 25 },
];

function Reports() {
  const [collapsed, setCollapsed] = useState(false);
  const [filter, setFilter] = useState({ month: "May", year: "2026" });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-md p-3 border border-slate-100 shadow-xl rounded-xl">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-[11px] font-bold" style={{ color: entry.color }}>
              {entry.name}: {entry.value} ราย
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] font-sans text-slate-800 overflow-hidden relative">
      
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
        {/* TOPNAV: ไม่ใช้ Fixed แล้ว เพื่อแก้ปัญหาเนื้อหาซ้อนทับกัน */}
        <div className="shrink-0 z-30 relative">
          <TopNav collapsed={collapsed} setCollapsed={setCollapsed} />
        </div>

        {/* CONTENT AREA */}
        {/* เพิ่ม overflow-y-auto เพื่อให้จอเล็กไถขึ้นลงได้ */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 w-full flex flex-col gap-4 sm:gap-5">
          
          {/* --- HEADER & FILTER BAR --- */}
          {/* ปรับเป็น flex-col บนมือถือ และ flex-row บนจอใหญ่ */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0 px-1 sm:px-2">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Analytical <span className="text-blue-600">Overview</span></h1>
              <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Vaccination Performance Data</p>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto">
              <div className="flex flex-1 sm:flex-none bg-gray-100 rounded-full p-1 shadow-sm justify-between">
                <select 
                  className="bg-transparent text-[11px] font-bold px-3 py-1 outline-none cursor-pointer border-r border-gray-200 flex-1 sm:flex-none text-center"
                  value={filter.month}
                  onChange={(e) => setFilter({...filter, month: e.target.value})}
                >
                  <option>January</option><option>May</option>
                </select>
                <select 
                  className="bg-transparent text-[11px] font-bold px-3 py-1 outline-none cursor-pointer flex-1 sm:flex-none text-center"
                  value={filter.year}
                  onChange={(e) => setFilter({...filter, year: e.target.value})}
                >
                  <option>2026</option><option>2025</option>
                </select>
              </div>
              <button className="bg-slate-900 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-[10px] font-black tracking-widest transition-all active:scale-95 shadow-sm whitespace-nowrap">
                EXPORT
              </button>
            </div>
          </div>

          {/* --- KPI ROW (4 Boxes) --- */}
          {/* ปรับ Grid และเพิ่ม h-auto สำหรับจอเล็ก */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0 sm:h-[140px]">
            {/* Box 1: จำนวนเด็กทั้งหมด */}
            <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-4 sm:p-5 flex items-center justify-between relative overflow-hidden group h-[120px] sm:h-auto">
              <div className="relative z-10">
                <p className="text-[11px] sm:text-xs text-gray-400">จำนวนเด็กทั้งหมด</p>
                <h2 className="text-3xl font-semibold text-emerald-600 mt-1">1,240</h2>
                <p className="text-[9px] sm:text-[10px] text-emerald-400 mt-1">ลงทะเบียนในระบบ</p>
              </div>
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-[4px] sm:border-[5px] border-emerald-500 flex items-center justify-center relative z-10 bg-white shrink-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 rounded-full flex items-center justify-center text-lg group-hover:scale-110 transition-transform"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 sm:-bottom-8 sm:-right-8 w-24 h-24 sm:w-32 sm:h-32 bg-emerald-50 rounded-full opacity-30 group-hover:scale-110 transition-transform"></div>
            </div>

            {/* Box 2: จำนวนชนิดวัคซีน */}
            <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-4 sm:p-5 flex items-center justify-between relative overflow-hidden group h-[120px] sm:h-auto">
              <div className="relative z-10">
                <p className="text-[11px] sm:text-xs text-gray-400">จำนวนชนิดวัคซีน</p>
                <h2 className="text-3xl font-semibold text-amber-600 mt-1">24</h2>
                <p className="text-[9px] sm:text-[10px] text-amber-400 mt-1">ชนิดทั้งหมดที่มี</p>
              </div>
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-[4px] sm:border-[5px] border-amber-500 flex items-center justify-center relative z-10 bg-white shrink-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-100 rounded-full flex items-center justify-center text-lg group-hover:scale-110 transition-transform"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 sm:-bottom-8 sm:-right-8 w-24 h-24 sm:w-32 sm:h-32 bg-amber-50 rounded-full opacity-30 group-hover:scale-110 transition-transform"></div>
            </div>

            {/* Box 3: Attended */}
            <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-4 sm:p-5 flex items-center justify-between relative overflow-hidden group h-[120px] sm:h-auto">
              <div className="relative z-10">
                <p className="text-[11px] sm:text-xs text-gray-400">Attended (เดือนนี้)</p>
                <h2 className="text-3xl font-semibold text-blue-600 mt-1">482</h2>
                <p className="text-[9px] sm:text-[10px] text-blue-400 mt-1">+12% จากเดือนก่อน</p>
              </div>
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-[4px] sm:border-[5px] border-blue-500 flex items-center justify-center relative z-10 bg-white shrink-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg group-hover:scale-110 transition-transform"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 sm:-bottom-8 sm:-right-8 w-24 h-24 sm:w-32 sm:h-32 bg-blue-50 rounded-full opacity-30 group-hover:scale-110 transition-transform"></div>
            </div>

            {/* Box 4: Missed */}
            <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-4 sm:p-5 flex items-center justify-between relative overflow-hidden group h-[120px] sm:h-auto">
              <div className="relative z-10">
                <p className="text-[11px] sm:text-xs text-gray-400">Missed (เดือนนี้)</p>
                <h2 className="text-3xl font-semibold text-red-500 mt-1">36</h2>
                <p className="text-[9px] sm:text-[10px] text-red-400 mt-1">+2 จากสัปดาห์ที่แล้ว</p>
              </div>
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-[4px] sm:border-[5px] border-red-500 flex items-center justify-center relative z-10 bg-white shrink-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-full flex items-center justify-center text-lg group-hover:scale-110 transition-transform"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 sm:-bottom-8 sm:-right-8 w-24 h-24 sm:w-32 sm:h-32 bg-red-50 rounded-full opacity-30 group-hover:scale-110 transition-transform"></div>
            </div>
          </div>

          {/* --- CHARTS AREA --- */}
          {/* เพิ่ม min-h บนมือถือ และ flex-1 md:flex-none */}
          <div className="flex-1 flex flex-col lg:grid lg:grid-cols-5 gap-4 sm:gap-5 min-h-0">
            {/* Area Chart */}
            <div className="lg:col-span-3 bg-white rounded-2xl border border-sky-50 shadow-sm p-4 sm:p-6 flex flex-col min-h-[300px] lg:min-h-0 shrink-0">
                <div className="flex items-center justify-between mb-4 sm:mb-5 shrink-0">
                   <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 text-sm">📈</div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-700">Attendance Trend</p>
                        <p className="text-[10px] sm:text-[11px] text-gray-400">Monthly statistical view</p>
                      </div>
                   </div>
                </div>
                <div className="flex-1 min-h-[200px] lg:min-h-0 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={ATTENDANCE_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="attended" stroke="#2563eb" strokeWidth={3} fill="url(#colorTrend)" />
                      <Area type="monotone" dataKey="missed" stroke="#ef4444" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
            </div>

            {/* Bar Chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-sky-50 shadow-sm p-4 sm:p-6 flex flex-col min-h-[350px] lg:min-h-0 shrink-0 mb-4 sm:mb-0">
                <div className="flex items-center gap-2 mb-4 sm:mb-5 shrink-0">
                   <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 text-sm">📊</div>
                   <div>
                     <p className="text-xs sm:text-sm font-medium text-gray-700">Top 10 Vaccines</p>
                   </div>
                </div>
                <div className="flex-1 min-h-[250px] lg:min-h-0 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={TOP_10_VACCINES} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#64748b'}} width={40} />
                      <Tooltip cursor={{fill: '#f8fafc'}} content={<CustomTooltip />} />
                      <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={10}>
                        {TOP_10_VACCINES.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={VAX_COLORS[index % VAX_COLORS.length]} fillOpacity={0.8} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
            </div>
          </div>

          {/* --- FOOTER --- */}
          <div className="bg-white border border-slate-100 rounded-xl sm:rounded-2xl p-3 sm:p-3.5 flex justify-between items-center shrink-0 shadow-sm">
             <div className="flex items-center gap-2 sm:gap-3 ml-1 sm:ml-2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <p className="text-[8px] sm:text-[9px] font-black text-blue-600 uppercase tracking-[0.1em] sm:tracking-[0.15em]">System Active</p>
             </div>
             <div className="flex items-center gap-2 mr-1 sm:mr-2">
                <p className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-widest">Update: Feb 2026</p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Reports;