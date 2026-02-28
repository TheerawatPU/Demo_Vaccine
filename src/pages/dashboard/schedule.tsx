import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";

type EventType = {
  id: string;
  date: string;
  childId: string;
  nationalId: string;
  child: string;
  gender: string;
  birthDate: string;
  parentName: string;
  parentPhone: string;
  lineId: string;
  address: string;
  vaccine: string;
  doctor: string;
  time: string;
  note: string;
  color: string;
  status: "Pending" | "Attended" | "Missed";
};

const colors = [
  "#3b82f6", "#6366f1", "#14b8a6", "#22c55e", 
  "#f59e0b", "#ef4444", "#ec4899", "#8b5cf6"
];

// const VACCINE_LIST = ["IPV", "HBV", "BCG", "JE", "MMR", "DTP", "OPV", "Rotavirus", "Influenza (ไข้หวัดใหญ่)"];
// const DOCTOR_LIST = ["พญ.ใจดี เมตตา", "นพ.สมชาย เก่งกาจ", "พญ.รักดี ดูแล", "หมอเวร (On Call)"];
const TIME_SLOTS = ["09:00", "09:30", "10:00", "10:30", "11:00", "13:00", "13:30", "14:00", "14:30", "15:00"];

const vaccineColorMap: Record<string, string> = {
  ipv: "#22c55e",
  hbv: "#3b82f6",
  bcg: "#ec4899",
  je: "#f59e0b",
  mmr: "#8b5cf6",
};

const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const calculateAge = (dob: string) => {
  if (!dob) return "-";
  const birthDate = new Date(dob);
  const today = new Date();
  
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  
  if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
    years--;
    months += 12;
  }
  
  if (today.getDate() < birthDate.getDate()) {
    months--;
    if (months < 0) {
      months = 11;
    }
  }
  
  return `${years} ปี ${months} เดือน`;
};

function Schedule() {
  const [collapsed, setCollapsed] = useState(false);
  const [view, setView] = useState<"day" | "month">("month");
  const [current, setCurrent] = useState(new Date());
  
  const todayDate = new Date();
  const todayStr = todayDate.toISOString().split("T")[0];
  
  // หาวันที่ล่วงหน้า 3 วัน และ 5 วัน สำหรับข้อมูลจำลองต่างวัน
  const futureDate1 = new Date(todayDate);
  futureDate1.setDate(todayDate.getDate() + 3);
  const futureStr1 = futureDate1.toISOString().split("T")[0];

  const futureDate2 = new Date(todayDate);
  futureDate2.setDate(todayDate.getDate() + 5);
  const futureStr2 = futureDate2.toISOString().split("T")[0];

  const [events, setEvents] = useState<EventType[]>([
    // --- วันเดียวกัน 3 คิว (วันนี้) ---
    {
      id: "mock1",
      date: todayStr,
      childId: "HN-25001",
      nationalId: "1100000000001",
      child: "ด.ญ. เอพริล รักเรียน",
      gender: "หญิง (Female)",
      birthDate: "2023-04-15",
      parentName: "คุณแม่จอย",
      parentPhone: "081-234-5678",
      lineId: "joy.april",
      address: "123 ถ.สุขุมวิท กรุงเทพฯ",
      vaccine: "IPV",
      doctor: "พญ.ใจดี เมตตา",
      time: "09:00",
      note: "ตรวจพัฒนาการด้วย, น้องมีน้ำมูกใสเล็กน้อย",
      color: "#22c55e",
      status: "Attended",
    },
    {
      id: "mock2",
      date: todayStr,
      childId: "HN-25042",
      nationalId: "1200000000002",
      child: "ด.ช. วินเทอร์ ลมหนาว",
      gender: "ชาย (Male)",
      birthDate: "2022-12-01",
      parentName: "คุณพ่อเอก",
      parentPhone: "089-876-5432",
      lineId: "aek_winter",
      address: "45/6 ถ.ลาดพร้าว กรุงเทพฯ",
      vaccine: "MMR",
      doctor: "นพ.สมชาย เก่งกาจ",
      time: "10:30",
      note: "เคยมีประวัติแพ้ไข่ (เฝ้าระวัง)",
      color: "#8b5cf6",
      status: "Pending",
    },
    {
      id: "mock3",
      date: todayStr,
      childId: "HN-25105",
      nationalId: "1300000000003",
      child: "ด.ญ. ซัมเมอร์ ร่าเริง",
      gender: "หญิง (Female)",
      birthDate: "2024-05-20",
      parentName: "คุณย่าศรี",
      parentPhone: "085-555-1234",
      lineId: "sri.family",
      address: "789 ถ.พระราม 9 กรุงเทพฯ",
      vaccine: "HBV",
      doctor: "พญ.รักดี ดูแล",
      time: "14:00",
      note: "",
      color: "#3b82f6",
      status: "Missed",
    },
    // --- ต่างวันอย่างละ 1 คิว ---
    {
      id: "mock4",
      date: futureStr1,
      childId: "HN-25211",
      nationalId: "1400000000004",
      child: "ด.ช. ออทัม ใบไม้",
      gender: "ชาย (Male)",
      birthDate: "2021-10-10",
      parentName: "คุณแม่วิไล",
      parentPhone: "082-111-2222",
      lineId: "wilai_autumn",
      address: "12 ซอยอารีย์ กรุงเทพฯ",
      vaccine: "JE",
      doctor: "นพ.สมชาย เก่งกาจ",
      time: "10:00",
      note: "เข็มที่ 2",
      color: "#f59e0b",
      status: "Pending",
    },
    {
      id: "mock5",
      date: futureStr2,
      childId: "HN-25309",
      nationalId: "1500000000005",
      child: "ด.ญ. สปริง สดใส",
      gender: "หญิง (Female)",
      birthDate: "2025-01-05",
      parentName: "คุณพ่อก้อง",
      parentPhone: "086-999-8888",
      lineId: "kong.spring",
      address: "34/5 ถ.พัฒนาการ กรุงเทพฯ",
      vaccine: "BCG",
      doctor: "พญ.ใจดี เมตตา",
      time: "13:30",
      note: "เลื่อนมาจากสัปดาห์ที่แล้ว",
      color: "#ec4899",
      status: "Pending",
    }
  ]);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [toast, setToast] = useState<{ show: boolean; msg: string; type: "success" | "warning" | "error" }>({
    show: false, msg: "", type: "success"
  });

  const emptyForm: EventType = {
    id: "", date: "", childId: "", nationalId: "", child: "", gender: "ไม่ระบุ", birthDate: "", 
    parentName: "", parentPhone: "", lineId: "", address: "", 
    vaccine: "", doctor: "", time: "09:00", note: "", color: "#3b82f6", status: "Pending"
  };

  const [form, setForm] = useState<EventType>(emptyForm);

  const showToast = (msg: string, type: "success" | "warning" | "error" = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: "", type: "success" }), 3000);
  };

  const filteredEvents = events.filter(e => 
    e.child.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.parentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.childId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.parentPhone.includes(searchQuery) ||
    e.vaccine.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getEvents = (d: string) => filteredEvents.filter((e) => e.date === d);

  const changeMonth = (v: number) => {
    setCurrent(new Date(current.getFullYear(), current.getMonth() + v, 1));
  };

  const openCreate = (d: string) => {
    setSelectedIndex(null);
    setForm({ ...emptyForm, date: d, id: Math.random().toString(36).substr(2, 9) });
    setModalOpen(true);
  };

  const openEdit = (ev: EventType) => {
    setSelectedIndex(events.findIndex(e => e.id === ev.id));
    setForm(ev);
    setModalOpen(true);
  };

  const handleVaccineChange = (val: string) => {
    const color = vaccineColorMap[val.toLowerCase()] || form.color;
    setForm({ ...form, vaccine: val, color });
  };

  const handleSave = () => {
    if (!form.child || !form.vaccine || !form.doctor) {
      showToast("กรุณากรอกข้อมูลสำคัญให้ครบถ้วน (ชื่อเด็ก, วัคซีน, แพทย์)", "error");
      return;
    }

    const conflict = events.find(e => 
      e.id !== form.id && e.date === form.date && e.time === form.time && e.doctor === form.doctor && e.doctor !== ""
    );

    if (conflict) { showToast(`⚠️ เตือน: ${form.doctor} มีคิวซ้อนเวลานี้!`, "warning"); } 
    else { showToast("✅ บันทึกข้อมูลสำเร็จ!", "success"); }

    if (selectedIndex !== null) {
      let copy = [...events];
      copy[selectedIndex] = form;
      setEvents(copy);
    } else {
      setEvents([...events, form]);
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (selectedIndex !== null) {
      setEvents(events.filter((_, i) => i !== selectedIndex));
      showToast("🗑️ ลบข้อมูลเรียบร้อย", "success");
    }
    setModalOpen(false);
  };

  const quickUpdateStatus = (id: string, newStatus: "Attended" | "Missed" | "Pending", e: React.MouseEvent) => {
    e.stopPropagation();
    const copy = [...events];
    const index = copy.findIndex(ev => ev.id === id);
    if (index > -1) {
      copy[index].status = newStatus;
      setEvents(copy);
      showToast(`อัปเดตสถานะเป็น ${newStatus === "Attended" ? "มาตามนัด" : newStatus === "Missed" ? "ผิดนัด" : "รอรับบริการ"}`, "success");
    }
  };

  const renderStatusBadge = (status: string) => {
    const configs: any = {
      Pending: { bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-400", label: "รอรับบริการ" },
      Attended: { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-400", label: "มาตามนัด" },
      Missed: { bg: "bg-rose-50", text: "text-rose-600", dot: "bg-rose-400", label: "ผิดนัด" },
    };
    const c = configs[status];
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide ${c.bg} ${c.text}`}>
        <span className={`w-1 h-1 rounded-full mr-1.5 ${c.dot}`}></span>
        {c.label}
      </span>
    );
  };

  const inputStyle = `w-full h-10 px-4 bg-white border border-slate-200 rounded-md text-[12px] font-semibold text-slate-700 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all duration-300 `;
  const labelStyle = `block text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 ml-1`;

  const renderDayView = () => {
    const ev = getEvents(todayStr).sort((a, b) => a.time.localeCompare(b.time));

    return (
      <div className="flex flex-col h-full animate-fade-in pb-4">
        {ev.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 mt-4 min-h-[300px]">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
              <span className="text-2xl">📭</span>
            </div>
            <h4 className="text-slate-600 text-sm font-semibold">ไม่มีนัดหมายในวันนี้</h4>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pr-2 mt-2 custom-scrollbar print:block">
            {ev.map((e) => (
              <div key={e.id} className="relative pl-8 sm:pl-12 py-3 group">
                <div className="absolute left-[15px] sm:left-[23px] top-0 bottom-0 w-[2px] bg-slate-100 group-last:bottom-auto group-last:h-full"></div>
                <div 
                  className={`absolute left-[9px] sm:left-[17px] top-6 w-3.5 h-3.5 rounded-full ring-4 ring-white shadow-sm transition-transform duration-300 group-hover:scale-125
                    ${e.status === 'Missed' ? 'bg-slate-300' : ''}`} 
                  style={e.status !== 'Missed' ? { background: e.color } : {}}
                ></div>

                <div
                  onClick={() => openEdit(e)}
                  className={`flex flex-col sm:flex-row sm:items-center p-3 sm:p-4 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer transition-all duration-200 relative overflow-hidden print:border-b print:shadow-none print:rounded-none
                    ${e.status === 'Missed' ? 'opacity-70 bg-slate-50/50 grayscale-[30%]' : ''}`}
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 transition-colors print:hidden" style={{ background: e.status === 'Missed' ? '#cbd5e1' : e.color }} />
                  
                  <div className="flex sm:flex-col justify-between items-center sm:items-start sm:w-28 mb-2 sm:mb-0 ml-2">
                    <span className={`text-base font-bold tracking-tight ${e.status === 'Missed' ? 'text-slate-400' : 'text-slate-700'}`}>
                      {e.time || "ไม่ระบุเวลา"}
                    </span>
                    <div className="sm:mt-1">{renderStatusBadge(e.status)}</div>
                  </div>
                  
                  <div className="flex-1 sm:ml-4 sm:border-l sm:border-slate-100 sm:pl-4">
                    <p className={`text-sm font-bold tracking-tight ${e.status === 'Missed' ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                      {e.child} {e.childId && <span className="text-[10px] text-slate-400 font-mono ml-1">#{e.childId}</span>}
                    </p>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">
                      ผู้ปกครอง: {e.parentName || '-'} <span className="mx-1 text-slate-300">|</span> 📞 {e.parentPhone || '-'}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] mt-2 text-slate-500 font-medium">
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: e.status === 'Missed' ? '#cbd5e1' : e.color }}></span>
                        {e.vaccine}
                      </div>
                      {e.doctor && (
                        <div className="flex items-center gap-1 text-slate-400">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                          {e.doctor}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 sm:mt-0 ml-2 sm:ml-4 flex items-center justify-end sm:justify-start gap-1.5 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200 print:hidden border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0">
                    <button 
                      onClick={(evt) => quickUpdateStatus(e.id, "Attended", evt)}
                      className={`flex-1 sm:flex-none h-8 sm:w-8 rounded-lg sm:rounded-full flex items-center justify-center border transition-all transform hover:scale-105 ${e.status === 'Attended' ? 'bg-emerald-500 border-emerald-600 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-400 hover:bg-emerald-50 hover:border-emerald-500 hover:text-emerald-500'}`}
                      title="มาตามนัด"
                    >
                      <svg className="w-4 h-4 mr-1 sm:mr-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                      <span className="text-xs font-bold sm:hidden">มาตามนัด</span>
                    </button>
                    <button 
                      onClick={(evt) => quickUpdateStatus(e.id, "Missed", evt)}
                      className={`flex-1 sm:flex-none h-8 sm:w-8 rounded-lg sm:rounded-full flex items-center justify-center border transition-all transform hover:scale-105 ${e.status === 'Missed' ? 'bg-rose-500 border-rose-600 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-400 hover:bg-rose-50 hover:border-rose-500 hover:text-rose-500'}`}
                      title="ผิดนัด"
                    >
                      <svg className="w-4 h-4 mr-1 sm:mr-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                      <span className="text-xs font-bold sm:hidden">ผิดนัด</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderMonthView = () => {
    let days = [];
    const start = new Date(current.getFullYear(), current.getMonth(), 1);
    let startDay = start.getDay();
    startDay = startDay === 0 ? 6 : startDay - 1; 
    
    const daysInMonth = new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate();
    const totalCells = startDay + daysInMonth;
    const requiredRows = totalCells > 35 ? 6 : 5;
    const renderCells = requiredRows * 7; 

    for (let i = 0; i < renderCells; i++) {
      const date = new Date(current.getFullYear(), current.getMonth(), i - startDay + 1);
      const full = date.toISOString().split("T")[0];
      const isToday = full === todayStr; 
      const isCurrentMonth = date.getMonth() === current.getMonth();
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      
      const ev = getEvents(full).sort((a, b) => a.time.localeCompare(b.time));
      const showEvents = ev.slice(0, 1); 
      const more = ev.length - 1;

      days.push(
        <div
          key={i}
          onClick={() => openCreate(full)}
          className={`p-1.5 sm:p-2 border-b border-r border-slate-100 relative flex flex-col transition-all cursor-pointer group min-h-[80px] sm:min-h-0 overflow-hidden
            ${!isCurrentMonth ? "bg-slate-50/40" : "bg-white hover:bg-slate-50/80"}
          `}
        >
          <div className="flex justify-between items-center mb-2 px-0.5">
            <span
              className={`text-[10px] sm:text-[11px] font-bold w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full transition-colors
                ${isToday ? "bg-blue-600 text-white shadow-md shadow-blue-500/30" : !isCurrentMonth ? "text-slate-300" : isWeekend ? "text-rose-400" : "text-slate-700 group-hover:bg-slate-200"}
              `}
            >
              {date.getDate()}
            </span>
            {ev.length > 0 && !isToday && (
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
            )}
          </div>

          <div className="flex-1 overflow-hidden space-y-1">
            {showEvents.map((e) => (
              <div
                key={e.id}
                onClick={(x) => { x.stopPropagation(); openEdit(e); }}
                className={`relative px-2 py-1 text-[10px] sm:text-[11px] rounded border-l-[3px] truncate transition-all flex items-baseline gap-1.5 hover:brightness-95
                  ${e.status === 'Missed' ? 'opacity-60 bg-slate-100 border-slate-300 text-slate-500 line-through' : ''}`}
                style={e.status !== 'Missed' ? { backgroundColor: hexToRgba(e.color, 0.1), borderColor: e.color } : { borderLeftWidth: '3px' }}
              >
                {e.time && <span className="font-extrabold tracking-tight shrink-0" style={{ color: e.status !== 'Missed' ? e.color : '' }}>{e.time}</span>}
                <span className={`truncate font-semibold ${e.status !== 'Missed' ? 'text-slate-700' : ''}`}>{e.child}</span>
              </div>
            ))}
          </div>

          {more > 0 && (
            <div className="mt-auto pt-1 px-1" onClick={(x) => { x.stopPropagation(); setView("day"); setCurrent(date); }}>
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 hover:text-blue-600 cursor-pointer transition-colors block truncate">
                + อีก {more} นัดหมาย
              </span>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm animate-fade-in">
        <div className="grid grid-cols-7 bg-slate-50/80 border-b border-slate-200 shrink-0">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
            <div key={d} className={`text-center text-[10px] font-bold uppercase tracking-wider py-2 sm:py-2.5 border-r border-slate-200 last:border-r-0 ${i >= 5 ? "text-rose-400" : "text-slate-500"}`}>
              <span className="hidden sm:inline">{d}</span>
              <span className="sm:hidden">{d.slice(0, 2)}</span>
            </div>
          ))}
        </div>
        
        <div className="flex-1 overflow-y-auto sm:overflow-hidden custom-scrollbar bg-white">
          <div className="grid grid-cols-7 bg-white min-h-[500px] sm:min-h-0 sm:h-full" style={{ gridTemplateRows: `repeat(${requiredRows}, minmax(0, 1fr))` }}>
            {days}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] font-sans text-slate-800 overflow-hidden relative">
      
      {/* Toast Notification */}
      <div className={`fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-[1000] transform transition-all duration-300 ease-out ${toast.show ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0 pointer-events-none"}`}>
        <div className={`px-4 py-2.5 rounded-xl shadow-lg shadow-slate-200/50 font-medium flex items-center space-x-2 border
          ${toast.type === "success" ? "bg-white border-emerald-100 text-slate-700" : toast.type === "warning" ? "bg-amber-50 border-amber-200 text-amber-800" : "bg-rose-50 border-rose-200 text-rose-800"}`}>
          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white ${toast.type === "success" ? "bg-emerald-500" : toast.type === "warning" ? "bg-amber-500" : "bg-rose-500"}`}>
            {toast.type === "success" ? <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg> : "!"}
          </div>
          <span className="text-[11px] sm:text-xs font-semibold">{toast.msg}</span>
        </div>
      </div>

      {/* 🟦 BACKDROP: พื้นหลังสีดำจางๆ บนมือถือเวลาเปิด Sidebar */}
      {!collapsed && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 z-40 transition-opacity print:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* 🟦 SIDEBAR (ลบ hidden md:block ออกเพื่อให้สไลด์เข้าออกได้) */}
      <div className="print:hidden">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* 🟦 MAIN LAYOUT AREA */}
      <div
        className={`flex-1 flex flex-col h-full transition-all duration-300 relative
        ${collapsed ? "md:ml-20" : "md:ml-64"}
        ml-0 print:ml-0`}
      >
        {/* TOPNAV: เปลี่ยนเป็น relative แทน fixed */}
        <div className="shrink-0 z-30 relative print:hidden">
          <TopNav collapsed={collapsed} setCollapsed={setCollapsed} />
        </div>

        {/* SCHEDULE CONTENT */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 w-full flex flex-col print:p-0 print:overflow-visible">
          <div className="flex-1 bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-col min-h-[600px] md:min-h-0 print:border-none print:shadow-none print:rounded-none overflow-hidden print:overflow-visible">
            
            <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-4 mb-5 shrink-0 print:hidden">
              <div className="flex bg-slate-100/80 p-1 rounded-full self-start sm:self-center shadow-inner">
                {["day", "month"].map((v) => (
                  <button 
                    key={v} 
                    onClick={() => setView(v as any)} 
                    className={`px-5 sm:px-6 py-1.5 text-[10px] sm:text-xs font-bold rounded-full transition-all duration-200 cursor-pointer uppercase tracking-wider
                      ${view === v ? "bg-white shadow-sm text-blue-600 scale-100" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"}`}
                  >
                    {v}
                  </button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <div className="relative flex-1 sm:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ค้นหาชื่อ, รหัส, เบอร์โทร..."
                    className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 hover:border-slate-400 focus:bg-white rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-slate-700 shadow-sm"
                  />
                </div>

                <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 p-1 shadow-sm sm:w-auto">
                  <button onClick={() => changeMonth(-1)} className="w-8 h-8 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-blue-600 rounded-lg transition-all active:scale-95">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <h2 className="text-xs sm:text-sm font-extrabold text-slate-700 w-28 sm:w-32 text-center tracking-wide uppercase">
                    {current.toLocaleString("en", { month: "short" })} {current.getFullYear()}
                  </h2>
                  <button onClick={() => changeMonth(1)} className="w-8 h-8 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-blue-600 rounded-lg transition-all active:scale-95">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>
            </div>

            {/* View Container: เพิ่ม flex flex-col เพื่อให้ตารางปฏิทินยืดได้สุดพื้นที่ */}
            <div className="flex-1 min-h-0 overflow-hidden flex flex-col print:overflow-visible">
              {view === "day" && renderDayView()}
              {view === "month" && renderMonthView()}
            </div>
          </div>
        </div>
      </div>

      {/* --- SIDE PANEL MODAL --- */}
      <div className={`fixed inset-0 z-[1000] print:hidden ${modalOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div onClick={() => setModalOpen(false)} className={`absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity duration-500 ${modalOpen ? "opacity-100" : "opacity-0"}`} />
        
        <div className={`absolute right-0 top-0 h-full w-full sm:max-w-[560px] bg-white shadow-2xl transition-transform duration-500 ease-in-out flex flex-col ${modalOpen ? "translate-x-0" : "translate-x-full"}`}>
          
          <div className="relative p-6 sm:p-8 pb-5 shrink-0 bg-white">
             <div className="absolute top-0 right-0 p-5 sm:p-6">
                <button onClick={() => setModalOpen(false)} className="bg-slate-50 hover:bg-slate-200 text-slate-400 w-9 h-9 flex items-center justify-center rounded-xl transition-all active:scale-90">✕</button>
             </div>
             <h3 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">{selectedIndex !== null ? "Edit Booking" : "New Booking"}</h3>
             <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1.5">
               {form.date ? new Date(form.date).toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "Appointment Form"}
             </p>
          </div>

          <div className="border-b border-slate-100 mx-6 sm:mx-8 mb-4"></div>

          <div className="flex-1 overflow-y-auto px-6 sm:px-8 space-y-8 custom-scrollbar pb-12">
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <div className="h-5 w-1 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.4)]"></div>
                 <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest">ข้อมูลผู้ป่วย (Patient Info)</p>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-8">
                
                <div className="col-span-2 sm:col-span-1">
                  <label className={labelStyle}>รหัสเด็ก (Child ID)</label>
                  <input value={form.childId} onChange={(e) => setForm({ ...form, childId: e.target.value })} className={inputStyle}  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className={labelStyle}>เลขบัตรประชาชน (National ID)</label>
                  <input value={form.nationalId} onChange={(e) => setForm({ ...form, nationalId: e.target.value })} maxLength={13} className={inputStyle}  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className={labelStyle}>ชื่อ-นามสกุล เด็ก *</label>
                  <input value={form.child} onChange={(e) => setForm({ ...form, child: e.target.value })} className={inputStyle}/>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className={labelStyle}>เพศ (Gender)</label>
                  <div className="relative">
                    <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className={inputStyle + " appearance-none cursor-pointer"}>
                      <option value="ไม่ระบุ">ไม่ระบุ</option>
                      <option value="ชาย (Male)">ชาย (Male)</option>
                      <option value="หญิง (Female)">หญิง (Female)</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className={labelStyle}>วันเกิด (Date of Birth)</label>
                  <input type="date" value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} className={inputStyle} />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className={labelStyle}>อายุ (คำนวณอัตโนมัติ)</label>
                  <input type="text" readOnly value={calculateAge(form.birthDate)} className={`${inputStyle} bg-slate-50 border-slate-100 text-slate-500 cursor-default focus:ring-0 hover:border-slate-100 shadow-none`}  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <div className="h-5 w-1 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.4)]"></div>
                 <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest">ข้อมูลการติดต่อ (Contact Info)</p>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-8">
                <div className="col-span-2 sm:col-span-1">
                  <label className={labelStyle}>ชื่อผู้ปกครอง (Parent Name)</label>
                  <input value={form.parentName} onChange={(e) => setForm({ ...form, parentName: e.target.value })} className={inputStyle}/>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className={labelStyle}>เบอร์โทรศัพท์ (Phone Number)</label>
                  <input value={form.parentPhone} onChange={(e) => setForm({ ...form, parentPhone: e.target.value })} className={inputStyle}  />
                </div>
                
                <div className="col-span-2">
                  <label className={labelStyle}>LINE ID</label>
                  <input value={form.lineId} onChange={(e) => setForm({ ...form, lineId: e.target.value })} className={inputStyle} />
                </div>

                <div className="col-span-2">
                  <label className={labelStyle}>ที่อยู่ (Address)</label>
                  <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={`${inputStyle} h-20 p-4 resize-none`}  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <div className="h-5 w-1 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.4)]"></div>
                 <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest">รายละเอียดนัดหมาย (Appointment)</p>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-8">
                
                <div className="col-span-2 sm:col-span-1">
                  <label className={labelStyle}>วัคซีน (Vaccine) *</label>
                  <div className="relative">
                    <select value={form.vaccine} onChange={(e) => handleVaccineChange(e.target.value)} className={inputStyle + " appearance-none cursor-pointer"}>
                      <option value="" disabled>เลือกวัคซีน</option>
                      <option value="IPV">IPV</option>
                      <option value="HBV">HBV</option>
                      <option value="BCG">BCG</option>
                      <option value="JE">JE</option>
                      <option value="MMR">MMR</option>
                      <option value="DTP">DTP</option>
                      <option value="OPV">OPV</option>
                      <option value="Rotavirus">Rotavirus</option>
                      <option value="Influenza (ไข้หวัดใหญ่)">Influenza (ไข้หวัดใหญ่)</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
                
                <div className="col-span-2 sm:col-span-1">
                  <label className={labelStyle}>แพทย์ (Doctor) *</label>
                  <div className="relative">
                    <select value={form.doctor} onChange={(e) => setForm({ ...form, doctor: e.target.value })} className={inputStyle + " appearance-none cursor-pointer"}>
                      <option value="" disabled>เลือกแพทย์</option>
                      <option value="พญ.ใจดี เมตตา">พญ.ใจดี เมตตา</option>
                      <option value="นพ.สมชาย เก่งกาจ">นพ.สมชาย เก่งกาจ</option>
                      <option value="พญ.รักดี ดูแล">พญ.รักดี ดูแล</option>
                      <option value="หมอเวร (On Call)">หมอเวร (On Call)</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>

                <div className="col-span-2">
                  <label className={labelStyle}>เวลานัดหมาย (Time)</label>
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap gap-2">
                      {TIME_SLOTS.map(t => (
                        <button 
                          key={t}
                          type="button" 
                          onClick={() => setForm({ ...form, time: t })}
                          className={`px-3.5 py-2 text-[11px] font-bold rounded-xl border transition-all duration-200
                            ${form.time === t ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-400 hover:bg-white'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 mt-1 p-2.5 bg-slate-50 rounded-xl border border-slate-100 w-full sm:w-1/2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Custom Time:</span>
                      <input 
                        type="time" 
                        value={form.time} 
                        onChange={(e) => setForm({ ...form, time: e.target.value })} 
                        className="h-8 flex-1 px-3 bg-white border border-slate-200 rounded-lg text-[11px] font-bold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm" 
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className={labelStyle}>สถานะ (Status)</label>
                  <div className="relative">
                    <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })} className={inputStyle + " appearance-none cursor-pointer"}>
                      <option value="Pending">🟡 รอรับบริการ (Pending)</option>
                      <option value="Attended">🟢 มาตามนัด (Attended)</option>
                      <option value="Missed">🔴 ผิดนัด (Missed)</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1">
                   <label className={labelStyle}>สีแสดงผลบนปฏิทิน (Tag Color)</label>
                   <div className="flex flex-wrap gap-2.5 pt-1">
                      {colors.map((c, i) => (
                        <button key={i} type="button" onClick={() => setForm({ ...form, color: c })} className={`w-8 h-8 rounded-full transition-all transform hover:scale-110 active:scale-90 shadow-sm ${form.color === c ? "ring-4 ring-slate-100 shadow-md scale-110 opacity-100" : "opacity-40 hover:opacity-100"}`} style={{ background: c }} />
                      ))}
                   </div>
                </div>

                <div className="col-span-2">
                  <label className={labelStyle}>หมายเหตุ (Note)</label>
                  <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className={`${inputStyle} h-20 p-4 resize-none`}  />
                </div>
              </div>
            </div>

          </div>

          <div className="p-6 sm:p-8 bg-white border-t border-slate-100 flex items-center gap-4 shrink-0 pb-safe">
            {selectedIndex !== null && (
              <button onClick={handleDelete} className="w-14 h-12 sm:w-12 flex items-center justify-center bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-95" title="Delete">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            )}
            <button onClick={handleSave} className="flex-1 py-4 bg-slate-900 text-white rounded-[1.2rem] text-[11px] sm:text-xs font-black tracking-widest shadow-xl shadow-slate-200 hover:bg-blue-600 transition-all active:scale-[0.98]">
              บันทึกนัดหมาย (SAVE APPOINTMENT)
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Schedule;