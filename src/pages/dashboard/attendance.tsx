import  { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";

type EventType = {
  id: string;
  date: string;
  childId: string;
  child: string;
  parentName: string;
  parentPhone: string;
  lineId: string;
  vaccine: string;
  doctor: string;
  status: "Missed";
  followUpStatus: "Not Contacted" | "Contacted" | "Rescheduled" | "Unreachable";
  followUpNote: string;
  lastCalled?: string;
};

const FOLLOW_UP_OPTIONS = [
  { label: "ยังไม่ได้ติดต่อ", value: "Not Contacted" },
  { label: "ติดต่อได้ / รับสาย", value: "Contacted" },
  { label: "นัดหมายใหม่แล้ว", value: "Rescheduled" },
  { label: "ติดต่อไม่ได้", value: "Unreachable" },
];

function Attendance() {
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<EventType | null>(null);

  const [defaulters, setDefaulters] = useState<EventType[]>([
    {
      id: "ev-001", date: "2026-02-18", childId: "HN-10005", child: "น้องซัมเมอร์",
      parentName: "คุณแม่เมย์", parentPhone: "089-999-8888", lineId: "may_mommy",
      vaccine: "MMR", doctor: "พญ.ใจดี เมตตา", status: "Missed", followUpStatus: "Not Contacted", followUpNote: "",
    },
    {
      id: "ev-002", date: "2026-02-17", childId: "HN-10006", child: "น้องต้นข้าว",
      parentName: "คุณพ่อเอก", parentPhone: "086-123-4455", lineId: "ek_daddy",
      vaccine: "DTP", doctor: "พญ.นภา ศรีสุข", status: "Missed", followUpStatus: "Contacted",
      followUpNote: "ผู้ปกครองแจ้งว่าติดธุระ จะพามารับวัคซีนภายในสัปดาห์นี้", lastCalled: "19/2/2569 10:30:00",
    },
    {
      id: "ev-003", date: "2026-02-16", childId: "HN-10007", child: "น้องฟ้าใส",
      parentName: "คุณแม่จอย", parentPhone: "081-555-2233", lineId: "joymom_22",
      vaccine: "IPV", doctor: "พญ.วราภรณ์ ใจงาม", status: "Missed", followUpStatus: "Rescheduled",
      followUpNote: "นัดใหม่วันที่ 25 ก.พ. 2569 เวลา 09:00 น.", lastCalled: "18/2/2569 14:10:00",
    },
    {
      id: "ev-004", date: "2026-02-15", childId: "HN-10008", child: "น้องข้าวหอม",
      parentName: "คุณพ่อบอย", parentPhone: "082-998-1122", lineId: "boy_family",
      vaccine: "HBV", doctor: "พญ.ชลธิชา สุขใจ", status: "Missed", followUpStatus: "Unreachable",
      followUpNote: "โทรไม่รับสาย 3 ครั้ง", lastCalled: "17/2/2569 16:45:00",
    }
  ]);

  const openFollowUp = (item: EventType) => {
    setSelectedCase({ ...item });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (selectedCase) {
      setDefaulters(defaulters.map(d => d.id === selectedCase.id ? { ...selectedCase, lastCalled: new Date().toLocaleString('th-TH') } : d));
      setModalOpen(false);
    }
  };

  const filteredDefaulters = defaulters.filter(d => 
    d.child.includes(searchQuery) || d.lineId.includes(searchQuery) || d.childId.includes(searchQuery) || d.parentPhone.includes(searchQuery)
  );

  const inputStyle = `w-full h-11 px-4 bg-white border border-slate-200 rounded-xl sm:rounded-2xl text-[12px] font-semibold text-slate-700 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all duration-300 `;
  const inputStyle2 = `w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl text-[12px] font-semibold text-slate-700 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all duration-300 cursor-not-allowed`;
  const labelStyle = `block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 ml-1`;

  // ฟังก์ชันช่วยจัดการสีของ Badge สถานะ
  const getBadgeStyle = (status: string) => {
    switch(status) {
      case 'Contacted': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Rescheduled': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Unreachable': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-400 border-slate-200';
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] font-sans text-slate-800 overflow-hidden relative">
      
      {/* 🟦 BACKDROP */}
      {!collapsed && (
        <div className="md:hidden fixed inset-0 bg-black/30 z-40 transition-opacity" onClick={() => setCollapsed(true)} />
      )}

      {/* 🟦 SIDEBAR */}
      <div className="print:hidden">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* 🟦 MAIN LAYOUT AREA */}
      <div className={`flex-1 flex flex-col h-full transition-all duration-300 relative ${collapsed ? "md:ml-20" : "md:ml-64"} ml-0 print:ml-0`}>
        <div className="shrink-0 z-30 relative print:hidden">
          <TopNav collapsed={collapsed} setCollapsed={setCollapsed} />
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 w-full flex flex-col print:p-0">
          <div className="flex-1 bg-white rounded-xl sm:rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 flex flex-col min-h-0 overflow-hidden print:border-none print:shadow-none print:rounded-none">
            
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 sm:mb-8 shrink-0 px-1 sm:px-2 gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 sm:gap-3">
                  ติดตาม <span className="text-rose-500">เด็กผิดนัด</span>
                </h1>
                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Vaccine Defaulter Management</p>
              </div>
              <div className="relative group w-full md:w-80">
                <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400">🔍</span>
                <input 
                  type="text" 
                  placeholder="ค้นหาชื่อ, HN, เบอร์โทร, LINE..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl text-[11px] font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* --- ADAPTIVE TABLE / CARDS AREA --- */}
            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
              
              {/* 📱 MOBILE VIEW (แสดงเป็น Card เมื่ออยู่บนจอมือถือ) */}
              <div className="md:hidden flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3 pb-4 px-1">
                {filteredDefaulters.map((item) => (
                  <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-3 relative cursor-pointer hover:border-blue-300 transition-all active:scale-[0.98]" onClick={() => openFollowUp(item)}>
                    
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-black text-slate-400 block mb-0.5">{item.date}</span>
                        <span className="text-sm font-bold text-slate-800">{item.vaccine}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-wider border ${getBadgeStyle(item.followUpStatus)}`}>
                        {item.followUpStatus}
                      </span>
                    </div>

                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-[13px] font-bold text-slate-800 block">{item.child}</span>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">HN: {item.childId}</span>
                      </div>
                      <div className="text-right flex flex-col gap-1 items-end">
                        <span className="text-blue-600 font-black text-[11px] font-mono">📞 {item.parentPhone}</span>
                        <span className="text-emerald-600 font-bold text-[9px] bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100 uppercase">
                          Line: {item.lineId}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-3 mt-1 flex justify-center text-[10px] font-bold text-slate-400">
                      แตะเพื่อจัดการการติดตาม ➔
                    </div>
                  </div>
                ))}
              </div>

              {/* 💻 DESKTOP VIEW (แสดงเป็น Table เมื่ออยู่บนจอใหญ่) */}
              <div className="hidden md:block flex-1 overflow-auto custom-scrollbar border border-slate-100 rounded-2xl">
                <table className="w-full text-left whitespace-nowrap">
                  <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200">
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <th className="px-6 py-4">นัดหมาย</th>
                      <th className="px-6 py-4">ข้อมูลเด็ก</th>
                      <th className="px-6 py-4">การติดต่อ</th>
                      <th className="px-6 py-4">สถานะติดตาม</th>
                      <th className="px-6 py-4 text-center">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredDefaulters.map((item) => (
                      <tr key={item.id} className="hover:bg-blue-50/30 transition-all group cursor-pointer" onClick={() => openFollowUp(item)}>
                        <td className="px-6 py-5">
                          <span className="text-[11px] font-black text-slate-400 block">{item.date}</span>
                          <span className="text-xs font-bold text-slate-800">{item.vaccine}</span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-xs font-bold text-slate-800 block">{item.child}</span>
                          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">HN: {item.childId}</span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 text-blue-600 font-black text-xs font-mono">📞 {item.parentPhone}</div>
                            <div className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] bg-emerald-50 w-fit px-2 py-0.5 rounded-md border border-emerald-100 uppercase tracking-wider">
                              Line: {item.lineId}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${getBadgeStyle(item.followUpStatus)}`}>
                            {item.followUpStatus}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-center">
                           <button className="h-8 w-8 inline-flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-400 group-hover:text-blue-600 group-hover:border-blue-400 transition-all shadow-sm">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- SIDE PANEL MODAL --- */}
      <div className={`fixed inset-0 z-[1000] print:hidden ${modalOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div onClick={() => setModalOpen(false)} className={`absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity duration-500 ${modalOpen ? "opacity-100" : "opacity-0"}`} />
        <div className={`absolute right-0 top-0 h-full w-full sm:max-w-[480px] bg-white shadow-2xl transition-transform duration-500 ease-in-out flex flex-col ${modalOpen ? "translate-x-0" : "translate-x-full"}`}>
          
          <div className="relative p-6 sm:p-8 pb-4 sm:pb-6 shrink-0 bg-white">
             <div className="absolute top-0 right-0 p-5 sm:p-6">
                <button onClick={() => setModalOpen(false)} className="bg-slate-50 hover:bg-slate-200 text-slate-400 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl sm:rounded-2xl transition-all">✕</button>
             </div>
             <h3 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">Follow-up Log</h3>
             <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1.5 sm:mt-2">บันทึกการติดตามเด็กผิดนัด</p>
          </div>

          <div className="border-b border-slate-100 mx-6 sm:mx-8 mb-6 sm:mb-8"></div>

          <div className="flex-1 overflow-y-auto px-6 sm:px-8 space-y-8 sm:space-y-10 custom-scrollbar pb-12">
            {/* Identity */}
            <div className="space-y-5 sm:space-y-6">
              <div className="flex items-center gap-3">
                 <div className="h-5 sm:h-6 w-1 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                 <p className="text-[10px] sm:text-[11px] font-black text-slate-800 uppercase tracking-widest">Patient Identity</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 sm:gap-y-6">
                <div className="col-span-1 sm:col-span-2">
                  <label className={labelStyle}>ชื่อเด็ก (Child Name)</label>
                  <input disabled value={selectedCase?.child || ""} className={inputStyle2} />
                </div>
                <div className="col-span-1">
                  <label className={labelStyle}>Missing Vaccine</label>
                  <input readOnly value={selectedCase?.vaccine || ""} className={inputStyle2} />
                </div>
                <div className="col-span-1">
                  <label className={labelStyle}>LINE ID</label>
                  <input readOnly value={selectedCase?.lineId || ""} className={inputStyle2} />
                </div>
              </div>
            </div>

            {/* Contact Actions */}
            <div className="space-y-5 sm:space-y-6">
              <div className="flex items-center gap-3">
                 <div className="h-5 sm:h-6 w-1 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                 <p className="text-[10px] sm:text-[11px] font-black text-slate-800 uppercase tracking-widest">Contact Actions</p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <a href={`tel:${selectedCase?.parentPhone}`} className="flex items-center justify-center gap-2 py-3 sm:py-3.5 bg-emerald-500 text-white rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-[11px] tracking-widest shadow-xl shadow-emerald-200 hover:bg-emerald-600 transition-all active:scale-95">
                  CALL PARENT
                </a>
                <a href={`https://line.me/ti/p/~${selectedCase?.lineId}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 py-3 sm:py-3.5 bg-blue-500 text-white rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-[11px] tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-600 transition-all active:scale-95">
                  OPEN LINE
                </a>
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-5 sm:space-y-6">
              <div className="flex items-center gap-3">
                 <div className="h-5 sm:h-6 w-1 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                 <p className="text-[10px] sm:text-[11px] font-black text-slate-800 uppercase tracking-widest">Update Progress</p>
              </div>
              <div className="space-y-5 sm:space-y-6">
                <div>
                  <label className={labelStyle}>Follow-up Result</label>
                  <div className="relative">
                    <select 
                      value={selectedCase?.followUpStatus || ""} 
                      onChange={(e) => setSelectedCase(prev => prev ? {...prev, followUpStatus: e.target.value as any} : null)}
                      className={inputStyle + " appearance-none cursor-pointer pr-10"}
                    >
                      {FOLLOW_UP_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label className={labelStyle}>Log Note</label>
                  <textarea 
                    value={selectedCase?.followUpNote || ""}
                    onChange={(e) => setSelectedCase(prev => prev ? {...prev, followUpNote: e.target.value} : null)}
                    className={inputStyle + " h-28 sm:h-32 py-3 sm:py-4 resize-none"} 
                    placeholder="ระบุรายละเอียดผลการสนทนา..."
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 bg-white border-t border-slate-50 flex items-center gap-4 shrink-0 pb-safe">
            <button onClick={handleSave} className="flex-1 py-3.5 sm:py-4 bg-slate-900 text-white rounded-[1rem] sm:rounded-[1.2rem] text-[10px] sm:text-[11px] font-black tracking-widest shadow-xl shadow-slate-200 hover:bg-blue-600 transition-all active:scale-[0.98]">
              SAVE FOLLOW-UP LOG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Attendance;