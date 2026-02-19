// import React, { useState } from "react";
import { useState } from "react";
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
    <div className="h-screen overflow-hidden bg-[#f8fafc] font-sans text-slate-800">
      <div className={`fixed top-0 ${collapsed ? "left-20" : "left-64"} right-0 z-40 transition-all duration-300`}>
        <TopNav collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={`${collapsed ? "ml-20" : "ml-64"} pt-20 h-full p-6 flex flex-col transition-all duration-300`}>
        
        <div className="flex-1 flex flex-col gap-5 min-h-0 overflow-hidden">
          
          {/* --- HEADER & FILTER BAR --- */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 px-2">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Analytical <span className="text-blue-600">Overview</span></h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Vaccination Performance Data</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex bg-gray-100 rounded-full p-1 shadow-sm">
                <select 
                  className="bg-transparent text-[11px] font-bold px-3 py-1 outline-none cursor-pointer border-r border-gray-200"
                  value={filter.month}
                  onChange={(e) => setFilter({...filter, month: e.target.value})}
                >
                  <option>January</option><option>May</option>
                </select>
                <select 
                  className="bg-transparent text-[11px] font-bold px-3 py-1 outline-none cursor-pointer"
                  value={filter.year}
                  onChange={(e) => setFilter({...filter, year: e.target.value})}
                >
                  <option>2026</option><option>2025</option>
                </select>
              </div>
              <button className="bg-slate-900 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-[10px] font-black tracking-widest transition-all active:scale-95 shadow-sm">
                EXPORT EXCEL
              </button>
            </div>
          </div>

          {/* --- KPI ROW (4 Boxes - Dashboard UI Style) --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0 h-[140px]">
            {/* Box 1: จำนวนเด็กทั้งหมด */}
            <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5 flex items-center justify-between relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-xs text-gray-400">จำนวนเด็กทั้งหมด</p>
                <h2 className="text-3xl font-semibold text-blue-600 mt-1">1,240</h2>
                <p className="text-[10px] text-blue-400 mt-1">ลงทะเบียนในระบบ</p>
              </div>
              <div className="w-16 h-16 rounded-full border-[5px] border-blue-500 flex items-center justify-center relative z-10 bg-white">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg group-hover:scale-110 transition-transform">👶</div>
              </div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-blue-50 rounded-full opacity-30 group-hover:scale-110 transition-transform"></div>
            </div>

            {/* Box 2: จำนวนชนิดวัคซีน */}
            <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5 flex items-center justify-between relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-xs text-gray-400">จำนวนชนิดวัคซีน</p>
                <h2 className="text-3xl font-semibold text-blue-600 mt-1">24</h2>
                <p className="text-[10px] text-blue-400 mt-1">ชนิดทั้งหมดที่มี</p>
              </div>
              <div className="w-16 h-16 rounded-full border-[5px] border-blue-500 flex items-center justify-center relative z-10 bg-white">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg group-hover:scale-110 transition-transform">📦</div>
              </div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-blue-50 rounded-full opacity-30 group-hover:scale-110 transition-transform"></div>
            </div>

            {/* Box 3: Attended */}
            <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5 flex items-center justify-between relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-xs text-gray-400">Attended (เดือนนี้)</p>
                <h2 className="text-3xl font-semibold text-blue-600 mt-1">482</h2>
                <p className="text-[10px] text-blue-400 mt-1">+12% จากเดือนก่อน</p>
              </div>
              <div className="w-16 h-16 rounded-full border-[5px] border-blue-500 flex items-center justify-center relative z-10 bg-white">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg group-hover:scale-110 transition-transform">✅</div>
              </div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-blue-50 rounded-full opacity-30 group-hover:scale-110 transition-transform"></div>
            </div>

            {/* Box 4: Missed */}
            <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-5 flex items-center justify-between relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-xs text-gray-400">Missed (เดือนนี้)</p>
                <h2 className="text-3xl font-semibold text-red-500 mt-1">36</h2>
                <p className="text-[10px] text-red-400 mt-1">+2 จากสัปดาห์ที่แล้ว</p>
              </div>
              <div className="w-16 h-16 rounded-full border-[5px] border-red-500 flex items-center justify-center relative z-10 bg-white">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-lg group-hover:scale-110 transition-transform">⚠️</div>
              </div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-red-50 rounded-full opacity-30 group-hover:scale-110 transition-transform"></div>
            </div>
          </div>

          {/* --- CHARTS AREA --- */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-5 min-h-0">
            <div className="lg:col-span-3 bg-white rounded-2xl border border-sky-50 shadow-sm p-6 flex flex-col">
                <div className="flex items-center justify-between mb-5 shrink-0">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 text-sm">📈</div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Attendance Trend Analysis</p>
                        <p className="text-[11px] text-gray-400">Monthly statistical view</p>
                      </div>
                   </div>
                </div>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={ATTENDANCE_TREND}>
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

            <div className="lg:col-span-2 bg-white rounded-2xl border border-sky-50 shadow-sm p-6 flex flex-col overflow-hidden">
                <div className="flex items-center gap-2 mb-5 shrink-0">
                   <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 text-sm">📊</div>
                   <p className="text-sm font-medium text-gray-700">Top 10 Vaccines Usage</p>
                </div>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={TOP_10_VACCINES} layout="vertical">
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#64748b'}} width={40} />
                      <Tooltip cursor={{fill: '#f8fafc'}} content={<CustomTooltip />} />
                      <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={10}>
                        {TOP_10_VACCINES.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={VAX_COLORS[index % VAX_COLORS.length]} fillOpacity={0.8} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
            </div>
          </div>

          {/* --- FOOTER --- */}
          <div className="bg-white border border-slate-100 rounded-2xl p-3.5 flex justify-between items-center shrink-0 shadow-sm">
             <div className="flex items-center gap-3 ml-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.15em]">Analytics System Active</p>
             </div>
             <div className="flex items-center gap-2 mr-2">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Last Update: Feb 2026</p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Reports;