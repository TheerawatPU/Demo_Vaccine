import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import { supabase } from "../../supabaseClient";

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
  vaccine_id: string; 
  vaccine_name?: string; 
  time: string;
  note: string;
  color: string;
  status: "Pending" | "Attended" | "Missed";
  is_confirmed?: boolean;
};

type Vaccine = {
  id: string;
  short_name: string;
  display_color: string;
};

const colors = [
  "#3b82f6", "#6366f1", "#14b8a6", "#22c55e", 
  "#f59e0b", "#ef4444", "#ec4899", "#8b5cf6"
];

const TIME_SLOTS = ["09:00", "09:30", "10:00", "10:30", "11:00", "13:00", "13:30", "14:00", "14:30", "15:00"];

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
    if (months < 0) months = 11;
  }
  
  return `${years} ปี ${months} เดือน`;
};

const inputStyle = `w-full h-10 px-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors disabled:bg-gray-100 disabled:text-gray-500`;
const labelStyle = `block text-[13px] font-medium text-gray-700 mb-1.5`;

function Schedule() {
  const [collapsed, setCollapsed] = useState(false);
  const [view, setView] = useState<"day" | "month">("month");
  const [current, setCurrent] = useState(new Date());
  const [loading, setLoading] = useState(true);
  
  const todayDate = new Date();
  const todayStr = todayDate.toISOString().split("T")[0];
  const [selectedDateStr, setSelectedDateStr] = useState<string>(todayStr);

  const [events, setEvents] = useState<EventType[]>([]);
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [toast, setToast] = useState<{ show: boolean; msg: string; type: "success" | "warning" | "error" }>({
    show: false, msg: "", type: "success"
  });

  const emptyForm: EventType = {
    id: "", date: "", childId: "", nationalId: "", child: "", gender: "ไม่ระบุ", birthDate: "", 
    parentName: "", parentPhone: "", lineId: "", address: "", 
    vaccine_id: "", time: "09:00", note: "", color: "#3b82f6", status: "Pending", is_confirmed: false
  };

  const [form, setForm] = useState<EventType>(emptyForm);

  const showToast = (msg: string, type: "success" | "warning" | "error" = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: "", type: "success" }), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: vData } = await supabase.from("vaccines").select("*").eq("is_active", true);
      if (vData) setVaccines(vData);

      const { data: aData, error } = await supabase
        .from("appointments")
        .select(`*, vaccines (short_name, display_color)`);

      if (error) throw error;
      if (aData) {
        const formatted: EventType[] = aData.map((d: any) => ({
          id: d.id,
          date: d.appointment_date,
          childId: d.hn_code || "",
          nationalId: d.national_id,
          child: d.child_name,
          gender: d.gender,
          birthDate: d.birth_date,
          parentName: d.parent_name || "",
          parentPhone: d.parent_phone || "",
          lineId: d.line_id || "",
          address: d.address || "",
          vaccine_id: d.vaccine_id,
          vaccine_name: d.vaccines?.short_name,
          time: d.appointment_time.substring(0, 5),
          note: d.note || "",
          color: d.display_color || d.vaccines?.display_color || "#3b82f6",
          status: d.status,
          is_confirmed: d.is_confirmed || false,
        }));
        setEvents(formatted);
      }
    } catch (err) {
      console.error(err);
      showToast("เกิดข้อผิดพลาดในการโหลดข้อมูล", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

const handleQuickUpdate = async (id: string, newStatus: "Attended" | "Missed", e: React.MouseEvent) => {
    e.stopPropagation();
    
    // ค้นหาข้อมูลนัดหมายปัจจุบันจาก State events เพื่อเอาข้อมูลมาส่ง LINE
    const appointment = events.find(ev => ev.id === id);
    if (!appointment) return;

    try {
      // 1. อัปเดตสถานะใน Database
      const { error } = await supabase
        .from("appointments")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
      
      showToast(`อัปเดตสถานะเป็น ${newStatus === 'Attended' ? 'มาตามนัด' : 'ผิดนัด'} เรียบร้อย`);

      // 2. ถ้ามี Line ID ให้ส่งแจ้งเตือน
      if (appointment.lineId) {
        let lineMessage = "";
        const dateThai = new Date(appointment.date).toLocaleDateString('th-TH', { 
          day: 'numeric', month: 'long', year: 'numeric' 
        });

        if (newStatus === "Attended") {
          lineMessage = `✅ บันทึกข้อมูลการรับบริการเรียบร้อยค่ะ\n\nผู้รับบริการ: ${appointment.child}\nวัคซีน: ${appointment.vaccine_name}\nวันที่: ${dateThai}\n\nขอบคุณที่ใช้บริการโรงพยาบาลของเรานะคะ 🙏😊`;
        } else if (newStatus === "Missed") {
          lineMessage = `⚠️ แจ้งเตือนการผิดนัดหมาย\n\nชื่อน้อง: ${appointment.child}\nรายการ: ${appointment.vaccine_name}\nวันที่นัด: ${dateThai}\n\nท่านไม่ได้เข้ารับบริการตามเวลานัดหมาย กรุณาติดต่อเจ้าหน้าที่เพื่อทำการนัดหมายใหม่นะคะ 📞`;
        }

        if (lineMessage) {
          await supabase.functions.invoke('send-line-notify', {
            body: { userId: appointment.lineId, message: lineMessage }
          });
        }
      }

      fetchData(); // รีโหลดข้อมูลหน้าจอ
    } catch (err) {
      console.error("Quick Update Error:", err);
      showToast("ไม่สามารถอัปเดตสถานะได้", "error");
    }
  };

  const filteredEvents = events.filter(e => 
    e.child.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.parentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.childId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.parentPhone.includes(searchQuery) ||
    e.vaccine_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getEvents = (d: string) => filteredEvents.filter((e) => e.date === d);

  const changeMonth = (v: number) => {
    setCurrent(new Date(current.getFullYear(), current.getMonth() + v, 1));
  };

  const openCreate = (d: string) => {
    setSelectedIndex(null);
    setForm({ ...emptyForm, date: d });
    setModalOpen(true);
  };

  const openEdit = (ev: EventType) => {
    setSelectedIndex(ev.id);
    setForm(ev);
    setModalOpen(true);
  };

  const saveToDb = async (confirmed: boolean) => {
    if (!form.child || !form.nationalId || !form.birthDate || !form.vaccine_id) {
      showToast("กรุณากรอกข้อมูลสำคัญให้ครบถ้วน", "error");
      return;
    }

    const payload = {
      hn_code: form.childId,
      national_id: form.nationalId,
      child_name: form.child,
      gender: form.gender,
      birth_date: form.birthDate,
      parent_name: form.parentName,
      parent_phone: form.parentPhone,
      line_id: form.lineId,
      address: form.address,
      vaccine_id: form.vaccine_id,
      appointment_date: form.date,
      appointment_time: form.time,
      status: form.status,
      note: form.note,
      display_color: form.color,
      is_confirmed: confirmed,
    };

    try {
      let dbError;

      if (selectedIndex) {
        const { error } = await supabase.from("appointments").update(payload).eq("id", selectedIndex);
        dbError = error;
      } else {
        const { error } = await supabase.from("appointments").insert([payload]);
        dbError = error;
      }

      if (dbError) throw dbError;

      // ถ้าเป็นการยืนยันและมี Line ID ให้ยิง API ไปที่ Supabase Edge Function
      if (confirmed && form.lineId) {
        showToast("กำลังส่งแจ้งเตือน LINE...", "success");
        const vName = vaccines.find(v => v.id === form.vaccine_id)?.short_name || "วัคซีน";
        const dateThai = new Date(form.date).toLocaleDateString('th-TH', { 
          day: 'numeric', month: 'long', year: 'numeric' 
        });
        const message = `ใบนัดหมายฉีดวัคซีน 💉\n\nชื่อน้อง: ${form.child}\nวัคซีน: ${vName}\nวันที่นัด: ${dateThai}\nเวลา: ${form.time} น.\n\nกรุณามาถึงก่อนเวลานัด 15 นาทีนะคะ 😊`;
        
        // ยิงคำสั่งไปยัง Edge Function ที่เราเพิ่ง Deploy ขึ้นไป!
        const { error: functionError } = await supabase.functions.invoke('send-line-notify', {
          body: { userId: form.lineId, message: message }
        });

        if (functionError) {
          console.error("Line Send Error:", functionError);
          showToast("บันทึกข้อมูลสำเร็จ แต่ส่ง LINE ไม่ผ่าน (ตรวจสอบ Line ID)", "warning");
        } else {
          showToast("✅ ยืนยันข้อมูลและส่งแจ้งเตือน LINE สำเร็จ");
        }
      } else {
        showToast(confirmed ? "✅ ยืนยันข้อมูลสำเร็จ (ไม่ได้ส่ง LINE)" : "✅ อัปเดตข้อมูลสำเร็จ");
      }

      setModalOpen(false);
      fetchData();
    } catch (err: any) {
      console.error("Supabase Save Error:", err);
      showToast("บันทึกไม่สำเร็จ โปรดตรวจสอบข้อมูล", "error");
    }
  };

  const handleSave = () => saveToDb(false);
  const handleConfirm = () => saveToDb(true);

  const handleDelete = async () => {
    if (!selectedIndex) return;
    if (window.confirm("คุณต้องการลบนัดหมายนี้ใช่หรือไม่?")) {
      const { error } = await supabase.from("appointments").delete().eq("id", selectedIndex);
      if (error) {
        showToast("ไม่สามารถลบข้อมูลได้", "error");
      } else {
        showToast("🗑️ ลบข้อมูลเรียบร้อย");
        setModalOpen(false);
        fetchData();
      }
    }
  };

  const renderStatusBadge = (status: string, isConfirmed: boolean = false) => {
    const configs: any = {
      Pending: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200", label: "รอรับบริการ" },
      Attended: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", label: "มาตามนัด" },
      Missed: { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-200", label: "ผิดนัด" },
    };
    const c = configs[status] || configs.Pending;
    return (
      <div className="flex items-center gap-2">
        {isConfirmed && <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border shadow-sm bg-blue-50 text-blue-600 border-blue-200">ยืนยันแล้ว</span>}
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border shadow-sm ${c.bg} ${c.text} ${c.border}`}>{c.label}</span>
      </div>
    );
  };

  const renderGenderIcon = (gender: string) => {
    if (gender === "ชาย (Male)") {
      return (
        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3 shadow-sm border border-blue-100">
          <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5z"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
        </div>
      );
    }
    if (gender === "หญิง (Female)") {
      return (
        <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center mr-3 shadow-sm border border-pink-100">
          <svg className="w-5 h-5 text-pink-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5z"/><path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="12" r="10" strokeOpacity="0.1"/></svg>
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center mr-3 shadow-sm border border-gray-100">
        <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      </div>
    );
  };

  const renderDayView = () => {
    const ev = getEvents(selectedDateStr).sort((a, b) => a.time.localeCompare(b.time));
    const displayDate = new Date(selectedDateStr).toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
      <div className="flex flex-col h-full overflow-y-auto relative pt-2">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white p-5 rounded-2xl border border-gray-100 mb-6 shrink-0 gap-3 shadow-sm">
           <div>
              <h3 className="text-base font-bold text-gray-800">นัดหมายประจำวันที่ {displayDate}</h3>
              <p className="text-xs text-gray-400 font-medium mt-1">จำนวนนัดหมายทั้งหมด <span className="text-blue-600 font-bold">{ev.length}</span> รายการ</p>
           </div>
           <button onClick={() => openCreate(selectedDateStr)} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-100 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14" /></svg>
              เพิ่มนัดหมาย
           </button>
        </div>

        {ev.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <p className="text-sm font-medium">ไม่มีรายการนัดหมายในวันนี้</p>
          </div>
        ) : (
          <div className="relative space-y-5 pr-2 pl-2">
            <div className="absolute top-4 bottom-4 left-[75px] w-[2px] bg-gray-100"></div>

            {ev.map((e) => (
              <div key={e.id} onClick={() => openEdit(e)} className="relative flex items-start gap-5 group cursor-pointer transition-all">
                <div className="w-14 text-right shrink-0 pt-3.5">
                  <div className="text-sm font-bold text-gray-800">{e.time}</div>
                </div>

                <div className="relative shrink-0 pt-4 z-10">
                  <div className="w-4 h-4 rounded-full border-[3px] border-white shadow-md ring-1 ring-gray-100 transition-transform duration-300 group-hover:scale-125" style={{ background: e.color }}></div>
                </div>

                <div className="flex-1 bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-100 transition-all">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-start">
                      {renderGenderIcon(e.gender)}
                      <div>
                        <h4 className="text-[16px] font-bold text-gray-900 flex items-center gap-2">
                          {e.child} 
                          <span className="text-[11px] font-semibold text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">#{e.childId}</span>
                        </h4>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2.5">
                          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-lg border border-gray-100">
                            <span className="w-2 h-2 rounded-full" style={{ background: e.color }}></span>
                            <span className="text-[12px] font-bold text-gray-700">{e.vaccine_name}</span>
                          </div>
                          <span className="text-[11px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">อายุ {calculateAge(e.birthDate)}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-3">
                          <p className="text-[12px] font-medium text-gray-500 flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            {e.parentName || '-'}
                          </p>
                          <p className="text-[12px] font-medium text-gray-500 flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            {e.parentPhone || '-'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      {renderStatusBadge(e.status, e.is_confirmed)}
                      {e.status === 'Pending' && (
                        <div className="flex items-center gap-2 mt-1">
                          <button onClick={(evt) => handleQuickUpdate(e.id, "Attended", evt)} className="w-9 h-9 flex items-center justify-center bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl hover:bg-emerald-500 hover:text-white transition-all shadow-sm"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7" /></svg></button>
                          <button onClick={(evt) => handleQuickUpdate(e.id, "Missed", evt)} className="w-9 h-9 flex items-center justify-center bg-rose-50 text-rose-600 border border-rose-100 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M6 18L18 6M6 6l12 12" /></svg></button>
                        </div>
                      )}
                    </div>
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
    const daysInMonth = new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate();
    const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7;

    for (let i = 0; i < totalCells; i++) {
      const date = new Date(current.getFullYear(), current.getMonth(), i - startDay + 1);
      const full = date.toISOString().split("T")[0];
      const isToday = full === todayStr; 
      const isCurrentMonth = date.getMonth() === current.getMonth();
      const ev = getEvents(full);

      days.push(
        <div key={i} onClick={() => { setSelectedDateStr(full); setView("day"); }}
          className={`min-h-[110px] p-2 border-b border-r border-gray-100 relative transition-all duration-200 cursor-pointer group flex flex-col ${!isCurrentMonth ? "bg-gray-50/50" : "bg-white hover:bg-blue-50/30 hover:shadow-inner"}`}
        >
          <div className="flex justify-between items-start mb-1.5">
            <span className={`text-xs w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${isToday ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-100" : !isCurrentMonth ? "text-gray-300 font-medium" : (date.getDay() === 0 || date.getDay() === 6) ? "text-rose-500 font-bold" : "text-gray-700 font-bold"} ${!isToday && "group-hover:bg-white group-hover:shadow-sm"}`}>
              {date.getDate()}
            </span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            {ev.length > 0 && (
              <div className="w-full mt-1 flex items-center justify-center gap-1.5 py-2 bg-blue-50/70 rounded-xl border border-blue-100 group-hover:bg-blue-100 group-hover:border-blue-200 transition-colors">
                <span className="w-2 h-2 rounded-full bg-blue-500 shadow-sm animate-pulse"></span>
                <span className="text-[11px] font-extrabold text-blue-700">{ev.length} คน</span>
              </div>
            )}
          </div>
        </div>
      );
    }

    const thaiDays = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];

    return (
      <div className="h-full flex flex-col mt-4 border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-md">
        <div className="grid grid-cols-7 bg-gray-50/80 border-b text-center py-3 text-[11px] font-black uppercase tracking-wider text-gray-500">
          {thaiDays.map((d, i) => (
            <div key={d} className={`${i === 0 || i === 6 ? "text-rose-500" : ""}`}>{d}</div>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto grid grid-cols-7">
          {days}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] font-sans text-gray-800 overflow-hidden relative">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className={`flex-1 flex flex-col h-full transition-all duration-300 ${collapsed ? "md:ml-20" : "md:ml-64"}`}>
        <TopNav collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className="flex-1 p-4 sm:p-7 overflow-hidden flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex bg-gray-200/40 p-1 rounded-xl shadow-inner">
                {["day", "month"].map((v) => (
                  <button key={v} onClick={() => setView(v as any)} className={`px-5 py-2 text-xs font-bold rounded-lg transition-all capitalize ${view === v ? "bg-white shadow-md text-blue-600 scale-100" : "text-gray-500 hover:text-gray-900"}`}>
                    {v === "day" ? "รายการ" : "ปฏิทิน"}
                  </button>
                ))}
              </div>
              {view === "month" && (
                <div className="flex items-center gap-2 ml-3 bg-white px-3 py-1 rounded-xl border border-gray-100 shadow-sm">
                  <button onClick={() => changeMonth(-1)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M15 19l-7-7 7-7" /></svg></button>
                  <h2 className="text-sm font-black text-gray-800 w-28 text-center">{current.toLocaleString("th-TH", { month: "short" })} {current.getFullYear() + 543}</h2>
                  <button onClick={() => changeMonth(1)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M9 5l7 7-7 7" /></svg></button>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row w-full sm:w-auto items-stretch sm:items-center gap-3">
              <div className="relative flex-1 sm:w-72 group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><svg className="w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg></div>
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="ค้นหาชื่อเด็ก, HN, ผู้ปกครอง..." className="w-full h-11 pl-10 pr-10 bg-white border border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-sm text-gray-800 outline-none transition-all shadow-sm" />
                {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg></button>}
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-hidden flex flex-col mt-4">
            {loading ? <div className="text-center py-20 flex flex-col items-center gap-3"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div><p className="text-sm font-bold text-gray-500">กำลังเตรียมข้อมูล...</p></div> : (view === "day" ? renderDayView() : renderMonthView())}
          </div>
        </div>
      </div>

      <div className={`fixed inset-0 z-[1000] ${modalOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div onClick={() => setModalOpen(false)} className={`absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300 ${modalOpen ? "opacity-100" : "opacity-0"}`} />
        <div className={`absolute right-0 top-0 h-full w-full sm:max-w-md bg-white shadow-2xl transition-transform duration-400 ease-out flex flex-col ${modalOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
             <div>
                <h3 className="text-xl font-black text-gray-900">
                  {selectedIndex !== null 
                    ? (form.is_confirmed ? "ข้อมูลนัดหมาย (ยืนยันแล้ว)" : "แก้ไขนัดหมาย") 
                    : "เพิ่มนัดหมายใหม่"}
                </h3>
                <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">{form.date ? new Date(form.date).toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : ""}</p>
             </div>
             <button onClick={() => setModalOpen(false)} className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
            <section>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1.5 h-5 bg-blue-600 rounded-full"></div>
                <h4 className="text-[13px] font-black uppercase tracking-widest text-gray-900">ข้อมูลผู้ป่วย</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1"><label className={labelStyle}>รหัส HN</label><input disabled={form.is_confirmed} value={form.childId} onChange={(e) => setForm({ ...form, childId: e.target.value })} className={inputStyle} placeholder="ระบุ HN" /></div>
                <div className="col-span-1"><label className={labelStyle}>เลขบัตรประชาชน *</label><input disabled={form.is_confirmed} value={form.nationalId} onChange={(e) => setForm({ ...form, nationalId: e.target.value })} maxLength={13} className={inputStyle} placeholder="13 หลัก" /></div>
                <div className="col-span-2"><label className={labelStyle}>ชื่อ-นามสกุล เด็ก *</label><input disabled={form.is_confirmed} value={form.child} onChange={(e) => setForm({ ...form, child: e.target.value })} className={inputStyle} placeholder="ชื่อ-นามสกุล" /></div>
                <div className="col-span-1"><label className={labelStyle}>เพศ *</label><select disabled={form.is_confirmed} value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className={inputStyle}><option value="ไม่ระบุ">ไม่ระบุ</option><option value="ชาย (Male)">ชาย</option><option value="หญิง (Female)">หญิง</option></select></div>
                <div className="col-span-1"><label className={labelStyle}>วันเกิด *</label><input disabled={form.is_confirmed} type="date" value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} className={inputStyle} /></div>
                <div className="col-span-2"><p className="text-[11px] font-black text-blue-600 bg-blue-50 px-3 py-2 rounded-lg inline-block">อายุปัจจุบัน: {calculateAge(form.birthDate)}</p></div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1.5 h-5 bg-amber-500 rounded-full"></div>
                <h4 className="text-[13px] font-black uppercase tracking-widest text-gray-900">ข้อมูลผู้ปกครอง</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className={labelStyle}>ชื่อ-นามสกุล ผู้ปกครอง</label><input disabled={form.is_confirmed} value={form.parentName} onChange={(e) => setForm({ ...form, parentName: e.target.value })} className={inputStyle} placeholder="ชื่อ-นามสกุล" /></div>
                <div className="col-span-1"><label className={labelStyle}>เบอร์โทรศัพท์</label><input disabled={form.is_confirmed} value={form.parentPhone} onChange={(e) => setForm({ ...form, parentPhone: e.target.value })} className={inputStyle} placeholder="0XX-XXX-XXXX" /></div>
                <div className="col-span-1"><label className={labelStyle}>Line ID</label><input disabled={form.is_confirmed} value={form.lineId} onChange={(e) => setForm({ ...form, lineId: e.target.value })} className={inputStyle} placeholder="ระบุ ID (U...)" /></div>
                <div className="col-span-2"><label className={labelStyle}>ที่อยู่</label><textarea disabled={form.is_confirmed} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={`${inputStyle} h-20 py-2 resize-none`} placeholder="ระบุที่อยู่" /></div>
              </div>
            </section>

            <section className="pb-10">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1.5 h-5 bg-emerald-500 rounded-full"></div>
                <h4 className="text-[13px] font-black uppercase tracking-widest text-gray-900">การนัดหมาย</h4>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                    <label className={labelStyle}>เลือกวัคซีน *</label>
                    <select 
                        disabled={form.is_confirmed}
                        value={form.vaccine_id} 
                        onChange={(e) => {
                            const v = vaccines.find(v => v.id === e.target.value);
                            setForm({ ...form, vaccine_id: e.target.value, color: v?.display_color || form.color });
                        }} 
                        className={inputStyle}
                    >
                        <option value="">กรุณาเลือกวัคซีน</option>
                        {vaccines.map(v => <option key={v.id} value={v.id}>{v.short_name}</option>)}
                    </select>
                </div>
                <div className="col-span-2">
                  <label className={labelStyle}>เวลานัดหมาย</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {TIME_SLOTS.map(t => (<button disabled={form.is_confirmed} key={t} type="button" onClick={() => !form.is_confirmed && setForm({ ...form, time: t })} className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${form.time === t ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100' : 'bg-white border-gray-200 text-gray-600'} ${!form.is_confirmed ? 'hover:border-blue-300' : 'opacity-70 cursor-not-allowed'}`}>{t}</button>))}
                  </div>
                  <input disabled={form.is_confirmed} type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className={inputStyle} />
                </div>
                <div className="col-span-1"><label className={labelStyle}>สถานะ</label><select disabled={form.is_confirmed} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })} className={inputStyle}><option value="Pending">🟡 รอรับบริการ</option><option value="Attended">🟢 มาตามนัด</option><option value="Missed">🔴 ผิดนัด</option></select></div>
                <div className="col-span-1"><label className={labelStyle}>สีแสดงผล (Tag)</label><div className="flex flex-wrap gap-2.5 pt-1.5">{colors.map((c, i) => (<button disabled={form.is_confirmed} key={i} type="button" onClick={() => !form.is_confirmed && setForm({ ...form, color: c })} className={`w-7 h-7 rounded-full transition-all border-2 border-white shadow-sm ${form.color === c ? "ring-2 ring-blue-500 scale-110" : "opacity-60"} ${!form.is_confirmed ? 'hover:opacity-100' : 'cursor-not-allowed'}`} style={{ background: c }} />))}</div></div>
              </div>
            </section>
          </div>
          
          {!form.is_confirmed && (
            <div className="p-5 border-t border-gray-100 bg-gray-50 flex items-center gap-3 shrink-0 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
              {selectedIndex !== null && (
                <button onClick={handleDelete} className="w-12 h-12 flex items-center justify-center bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>
                </button>
              )}
              <button onClick={handleSave} className="flex-1 h-12 bg-blue-50 text-blue-700 border border-blue-200 rounded-2xl text-[13px] font-black uppercase tracking-wide hover:bg-blue-100 transition-all shadow-sm active:scale-95">แก้ไขข้อมูล</button>
              <button onClick={handleConfirm} className="flex-1 h-12 bg-emerald-500 text-white rounded-2xl text-[13px] font-black uppercase tracking-wide hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200 active:scale-95">ยืนยันข้อมูล</button>
            </div>
          )}
        </div>
      </div>

      {toast.show && (
        <div className={`fixed bottom-6 right-6 z-[2000] px-6 py-3 rounded-2xl shadow-2xl text-white font-black text-sm flex items-center gap-3 animate-slide-up border border-white/20 backdrop-blur-md ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center shadow-inner">{toast.type === 'success' ? '✓' : '!'}</div>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

export default Schedule;