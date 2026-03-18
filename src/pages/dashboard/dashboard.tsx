import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { supabase } from "../../supabaseClient";
import { 
  startOfWeek, 
  endOfWeek, 
  subWeeks, 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  startOfYear,
  endOfYear,
  eachMonthOfInterval,
  isWithinInterval,
  parseISO
} from "date-fns";

// --- Types ---
interface ChartData {
  name: string;
  attend: number;
  miss: number;
}

interface Stats {
  totalAttend: number; // ยอดรวมทั้งหมด
  totalMiss: number;   // ยอดรวมทั้งหมด
  diffAttend: number;  // ส่วนต่างสัปดาห์นี้เทียบสัปดาห์ก่อน
  diffMiss: number;    // ส่วนต่างสัปดาห์นี้เทียบสัปดาห์ก่อน
}

function Dashboard() {
  const [range, setRange] = useState("day");
  const [collapsed, setCollapsed] = useState(false);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalAttend: 0,
    totalMiss: 0,
    diffAttend: 0,
    diffMiss: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [range]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const now = new Date();

      // 1. 📅 เตรียมช่วงเวลาสำหรับเปรียบเทียบสัปดาห์ (จันทร์-อาทิตย์)
      const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 });
      const thisWeekEnd = endOfWeek(now, { weekStartsOn: 1 });
      const lastWeekStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
      const lastWeekEnd = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });

      // 2. 🔍 Query ข้อมูล "ทั้งหมด" จากตาราง appointments
      const { data, error } = await supabase
        .from("appointments")
        .select("status, appointment_date");

      if (error) throw error;

      if (data) {
        // --- ส่วนที่ 1: คำนวณยอดรวมทั้งหมด (Total All Time) ---
        const totalAttend = data.filter(d => d.status === "Attended").length;
        const totalMiss = data.filter(d => d.status === "Missed").length;

        // --- ส่วนที่ 2: คำนวณส่วนต่างสัปดาห์ (จันทร์-อาทิตย์) ---
        const thisWeekEntries = data.filter(d => 
          isWithinInterval(parseISO(d.appointment_date), { start: thisWeekStart, end: thisWeekEnd })
        );
        const lastWeekEntries = data.filter(d => 
          isWithinInterval(parseISO(d.appointment_date), { start: lastWeekStart, end: lastWeekEnd })
        );

        const currentWeekAttend = thisWeekEntries.filter(d => d.status === "Attended").length;
        const currentWeekMiss = thisWeekEntries.filter(d => d.status === "Missed").length;
        const lastWeekAttend = lastWeekEntries.filter(d => d.status === "Attended").length;
        const lastWeekMiss = lastWeekEntries.filter(d => d.status === "Missed").length;

        setStats({
          totalAttend,
          totalMiss,
          diffAttend: currentWeekAttend - lastWeekAttend,
          diffMiss: currentWeekMiss - lastWeekMiss,
        });

        // --- ส่วนที่ 3: จัดการข้อมูลสำหรับ Chart ---
        let formatted: ChartData[] = [];
        if (range === "day") {
          const daysInMonth = eachDayOfInterval({ start: startOfMonth(now), end: endOfMonth(now) });
          formatted = daysInMonth.map(day => {
            const dayStr = format(day, "yyyy-MM-dd");
            const matches = data.filter(d => d.appointment_date === dayStr);
            return {
              name: format(day, "d"),
              attend: matches.filter(m => m.status === "Attended").length,
              miss: matches.filter(m => m.status === "Missed").length,
            };
          });
        } else {
          const monthsInYear = eachMonthOfInterval({ start: startOfYear(now), end: endOfYear(now) });
          formatted = monthsInYear.map(month => {
            const monthLabel = format(month, "MMM");
            const matches = data.filter(d => 
              format(parseISO(d.appointment_date), "MMM yyyy") === format(month, "MMM yyyy")
            );
            return {
              name: monthLabel,
              attend: matches.filter(m => m.status === "Attended").length,
              miss: matches.filter(m => m.status === "Missed").length,
            };
          });
        }
        setChartData(formatted);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] overflow-hidden">
      {!collapsed && (
        <div className="md:hidden fixed inset-0 bg-black/30 z-40" onClick={() => setCollapsed(true)} />
      )}

      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={`flex-1 flex flex-col h-full transition-all duration-300 ${collapsed ? "md:ml-20" : "md:ml-64"}`}>
        <TopNav collapsed={collapsed} setCollapsed={setCollapsed} />

        <div className="flex-1 overflow-y-auto p-4 md:p-6 w-full flex flex-col">
          
          {/* 📊 KPI CARDS (แสดงยอดรวมทั้งหมด) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 shrink-0">
            
            {/* มาตามนัดทั้งหมด */}
            <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-4 md:p-6 flex items-center justify-between relative overflow-hidden h-[130px] md:h-[160px]">
              <div className="relative z-10">
                <p className="text-sm text-gray-400 font-medium">เด็กมาตามนัดทั้งหมด</p>
                <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mt-1 md:mt-2">
                  {loading ? "..." : stats.totalAttend}
                </h2>
                <div className={`flex items-center text-[10px] md:text-xs mt-1 font-semibold ${stats.diffAttend >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                  <span className="mr-1">{stats.diffAttend >= 0 ? "▲" : "▼"}</span>
                  {Math.abs(stats.diffAttend)} รายการจันทร์-อาทิตย์นี้
                </div>
              </div>
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-[6px] border-blue-500/10 flex items-center justify-center shrink-0 z-10">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl shadow-lg">✓</div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 md:w-40 md:h-40 bg-blue-50 rounded-full opacity-40"></div>
            </div>

            {/* ผิดนัดทั้งหมด */}
            <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-4 md:p-6 flex items-center justify-between relative overflow-hidden h-[130px] md:h-[160px]">
              <div className="relative z-10">
                <p className="text-sm text-gray-400 font-medium">เด็กผิดนัดทั้งหมด</p>
                <h2 className="text-3xl md:text-4xl font-bold text-red-500 mt-1 md:mt-2">
                  {loading ? "..." : stats.totalMiss}
                </h2>
                <div className={`flex items-center text-[10px] md:text-xs mt-1 font-semibold ${stats.diffMiss <= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                  <span className="mr-1">{stats.diffMiss > 0 ? "▲" : "▼"}</span>
                  {Math.abs(stats.diffMiss)} รายการจันทร์-อาทิตย์นี้
                </div>
              </div>
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-[6px] border-red-500/10 flex items-center justify-center shrink-0 z-10">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-red-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">!</div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 md:w-40 md:h-40 bg-red-50 rounded-full opacity-40"></div>
            </div>
          </div>

          {/* 📈 CHART PANEL */}
          <div className="mt-4 md:mt-6 bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-5 flex flex-col min-h-[400px] md:flex-1 shrink-0 mb-6 md:mb-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-lg shadow-sm">📊</div>
                <div>
                  <h3 className="text-base font-semibold text-gray-800">Vaccine Attendance Overview</h3>
                  <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">
                    {range === 'day' ? 'Daily (Current Month)' : 'Monthly (Current Year)'}
                  </p>
                </div>
              </div>

              <div className="flex bg-gray-100/80 p-1 rounded-xl w-full sm:w-auto">
                {["day", "month"].map((item) => (
                  <button
                    key={item}
                    onClick={() => setRange(item)}
                    className={`flex-1 sm:flex-none px-6 py-1.5 text-xs rounded-lg transition-all duration-300 font-bold
                    ${range === item ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                  >
                    {item === "day" ? "รายวัน" : "รายเดือน"}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end mb-4 space-x-6 text-[11px] font-bold">
              <div className="flex items-center text-blue-600"><span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>มาตามนัด</div>
              <div className="flex items-center text-red-500"><span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>ผิดนัด</div>
            </div>

            <div className="flex-1 w-full min-h-[250px]">
              {loading ? (
                <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm animate-pulse italic">กำลังประมวลผลข้อมูลทั้งหมด...</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                    <Line type="monotone" dataKey="attend" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', stroke: '#fff' }} />
                    <Line type="monotone" dataKey="miss" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444', stroke: '#fff' }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;