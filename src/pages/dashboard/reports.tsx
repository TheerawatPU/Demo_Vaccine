import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from "recharts";
import { supabase } from "../../supabaseClient";
import { 
  startOfMonth, 
  endOfMonth, 
  format, 
  eachDayOfInterval, 
  parseISO,
  isSameDay 
} from "date-fns";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const VAX_COLORS = ["#3b82f6", "#6366f1", "#10b981", "#22c55e", "#f59e0b", "#f43f5e", "#d946ef", "#8b5cf6", "#a855f7", "#64748b"];

function Reports() {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ 
    month: format(new Date(), "MMMM"), 
    year: format(new Date(), "yyyy") 
  });

  const [kpi, setKpi] = useState({
    totalChildren: 0,
    activeVaccineTypes: 0,
    monthlyAttended: 0,
    monthlyMissed: 0
  });
  const [attendanceTrend, setAttendanceTrend] = useState<any[]>([]);
  const [topVaccines, setTopVaccines] = useState<any[]>([]);

  useEffect(() => {
    fetchReportData();
  }, [filter]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const selectedDate = new Date(`${filter.month} 1, ${filter.year}`);
      const monthStart = startOfMonth(selectedDate);
      const monthEnd = endOfMonth(selectedDate);

      const [
        { count: totalCount }, 
        { count: activeVaxCount },
        { data: monthlyApps },
        { data: allVaxUsage }
      ] = await Promise.all([
        supabase.from("appointments").select("*", { count: 'exact', head: true }),
        supabase.from("vaccines").select("*", { count: 'exact', head: true }).eq("is_active", true),
        supabase.from("appointments").select("status, appointment_date")
          .gte("appointment_date", format(monthStart, "yyyy-MM-dd"))
          .lte("appointment_date", format(monthEnd, "yyyy-MM-dd")),
        supabase.from("appointments").select("vaccines(short_name)")
      ]);

      const attendedCount = monthlyApps?.filter(a => a.status === "Attended").length || 0;
      const missedCount = monthlyApps?.filter(a => a.status === "Missed").length || 0;

      setKpi({
        totalChildren: totalCount || 0,
        activeVaccineTypes: activeVaxCount || 0,
        monthlyAttended: attendedCount,
        monthlyMissed: missedCount
      });

      const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
      const trend = daysInMonth.map(day => {
        const matches = monthlyApps?.filter(a => isSameDay(parseISO(a.appointment_date), day)) || [];
        return {
          name: format(day, "dd/MM/yyyy"),
          attended: matches.filter(m => m.status === "Attended").length,
          missed: matches.filter(m => m.status === "Missed").length,
        };
      });
      setAttendanceTrend(trend);

      const vaxMap: Record<string, number> = {};
      allVaxUsage?.forEach((item: any) => {
        const name = item.vaccines?.short_name || "Unknown";
        vaxMap[name] = (vaxMap[name] || 0) + 1;
      });

      const sortedVax = Object.entries(vaxMap)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      setTopVaccines(sortedVax);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Vaccination Report");

    worksheet.mergeCells("A1:E1");
    const titleCell = worksheet.getCell("A1");
    titleCell.value = "VACCINATION ANALYTICAL REPORT";
    titleCell.font = { name: "Arial Black", size: 16, color: { argb: "FFFFFFFF" } };
    titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1E293B" } };
    titleCell.alignment = { vertical: "middle", horizontal: "center" };

    worksheet.mergeCells("A2:E2");
    const subTitle = worksheet.getCell("A2");
    subTitle.value = `Period: ${filter.month} ${filter.year} | Exported: ${format(new Date(), "dd/MM/yyyy HH:mm")}`;
    subTitle.font = { size: 10, italic: true };
    subTitle.alignment = { horizontal: "center" };

    worksheet.addRow([]); 

    const kpiHeader = ["Metric", "Value", "Unit"];
    const kpiRows = [
      ["Total Registered Children", kpi.totalChildren, "Persons"],
      ["Active Vaccine Types", kpi.activeVaccineTypes, "Types"],
      ["Monthly Attended", kpi.monthlyAttended, "Cases"],
      ["Monthly Missed", kpi.monthlyMissed, "Cases"]
    ];

    const kpiTableHead = worksheet.addRow(kpiHeader);
    kpiTableHead.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF3B82F6" } };
      cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    });

    kpiRows.forEach(row => {
      const r = worksheet.addRow(row);
      r.eachCell(c => c.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } });
    });

    worksheet.addRow([]); 

    const trendHeader = ["No.", "Date", "Attended", "Missed", "Total"];
    const trendTableHead = worksheet.addRow(trendHeader);
    trendTableHead.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0F172A" } };
      cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    });

    attendanceTrend.forEach((data, index) => {
      const r = worksheet.addRow([index + 1, data.name, data.attended, data.missed, data.attended + data.missed]);
      r.eachCell(c => c.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } });
    });

    worksheet.addRow([]);

    const vaxHeader = ["Rank", "Vaccine Name", "Usage Doses"];
    const vaxTableHead = worksheet.addRow(vaxHeader);
    vaxTableHead.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF10B981" } };
      cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    });

    topVaccines.forEach((vax, index) => {
      const r = worksheet.addRow([index + 1, vax.name, vax.count]);
      r.eachCell(c => c.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } });
    });

    worksheet.getColumn(1).width = 10;
    worksheet.getColumn(2).width = 25;
    worksheet.getColumn(3).width = 15;
    worksheet.getColumn(4).width = 15;
    worksheet.getColumn(5).width = 15;

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, `Vaccine_Report_${filter.month}_${filter.year}.xlsx`);
  };

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
      
      {!collapsed && (
        <div className="md:hidden fixed inset-0 bg-black/30 z-40 transition-opacity" onClick={() => setCollapsed(true)} />
      )}

      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={`flex-1 flex flex-col h-full transition-all duration-300 relative ${collapsed ? "md:ml-20" : "md:ml-64"} ml-0`}>
        <TopNav collapsed={collapsed} setCollapsed={setCollapsed} />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 w-full flex flex-col gap-4 sm:gap-5">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0 px-1">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Analytical <span className="text-blue-600">Overview</span></h1>
              <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Vaccination Performance Data</p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex flex-1 sm:flex-none bg-gray-100 rounded-full p-1 shadow-sm">
                <select className="bg-transparent text-[11px] font-bold px-3 py-1 outline-none cursor-pointer" value={filter.month} onChange={(e) => setFilter({...filter, month: e.target.value})}>
                  {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => <option key={m}>{m}</option>)}
                </select>
                <select className="bg-transparent text-[11px] font-bold px-3 py-1 outline-none cursor-pointer" value={filter.year} onChange={(e) => setFilter({...filter, year: e.target.value})}>
                  <option>2026</option><option>2025</option>
                </select>
              </div>
              
              <button 
                onClick={handleExportExcel}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full text-[10px] font-black tracking-widest transition-all active:scale-95 shadow-lg disabled:opacity-50 whitespace-nowrap"
              >
                {loading ? "PROCESSING..." : "DOWNLOAD EXCEL"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
            <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-5 relative overflow-hidden h-[120px]">
                <p className="text-xs text-gray-400 font-medium">จำนวนเด็กทั้งหมด</p>
                <h2 className="text-3xl font-bold text-emerald-600 mt-1">{loading ? "..." : kpi.totalChildren.toLocaleString()}</h2>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-emerald-50 rounded-full opacity-40"></div>
            </div>
            <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-5 relative overflow-hidden h-[120px]">
                <p className="text-xs text-gray-400 font-medium">จำนวนชนิดวัคซีน</p>
                <h2 className="text-3xl font-bold text-amber-600 mt-1">{loading ? "..." : kpi.activeVaccineTypes}</h2>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-amber-50 rounded-full opacity-40"></div>
            </div>
            <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5 relative overflow-hidden h-[120px]">
                <p className="text-xs text-gray-400 font-medium">Attended ({filter.month})</p>
                <h2 className="text-3xl font-bold text-blue-600 mt-1">{loading ? "..." : kpi.monthlyAttended}</h2>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-50 rounded-full opacity-50"></div>
            </div>
            <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-5 relative overflow-hidden h-[120px]">
                <p className="text-xs text-gray-400 font-medium">Missed ({filter.month})</p>
                <h2 className="text-3xl font-bold text-red-500 mt-1">{loading ? "..." : kpi.monthlyMissed}</h2>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-red-50 rounded-full opacity-50"></div>
            </div>
          </div>

          <div className="flex-1 flex flex-col lg:grid lg:grid-cols-5 gap-5 min-h-0">
            <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col min-h-[300px]">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
                  <p className="text-sm font-black text-slate-700 uppercase tracking-tighter">Attendance Trend</p>
                </div>
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={attendanceTrend}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" tick={{fontSize: 9}} hide />
                      <YAxis tick={{fontSize: 10, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area name="มาตามนัด" type="monotone" dataKey="attended" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.1} strokeWidth={3} />
                      <Area name="ผิดนัด" type="monotone" dataKey="missed" stroke="#ef4444" fill="transparent" strokeDasharray="5 5" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col min-h-[350px]">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-6 bg-emerald-500 rounded-full"></div>
                  <p className="text-sm font-black text-slate-700 uppercase tracking-tighter">Top 10 Usage</p>
                </div>
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topVaccines} layout="vertical">
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" tick={{fontSize: 10, fontWeight: 800, fill: '#475569'}} width={60} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{fill: '#f8fafc'}} content={<CustomTooltip />} />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={14}>
                        {topVaccines.map((_, index) => <Cell key={index} fill={VAX_COLORS[index % VAX_COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex justify-between items-center text-[10px] font-black tracking-widest text-slate-500">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
                <p className="text-slate-300 uppercase">Supabase Live Connection</p>
              </div>
              <p className="text-slate-500 uppercase">Analytical Engine v2.6</p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Reports;