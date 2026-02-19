import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";

type EventType = {
  id: string;
  date: string;
  childId: string;
  child: string;
  parentName: string;
  parentPhone: string;
  lineId: string; // เพิ่มฟิลด์ LINE ID
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
    id: "ev-001",
    date: "2026-02-18",
    childId: "HN-10005",
    child: "น้องซัมเมอร์",
    parentName: "คุณแม่เมย์",
    parentPhone: "089-999-8888",
    lineId: "may_mommy",
    vaccine: "MMR",
    doctor: "พญ.ใจดี เมตตา",
    status: "Missed",
    followUpStatus: "Not Contacted",
    followUpNote: "",
  },
  {
    id: "ev-002",
    date: "2026-02-17",
    childId: "HN-10006",
    child: "น้องต้นข้าว",
    parentName: "คุณพ่อเอก",
    parentPhone: "086-123-4455",
    lineId: "ek_daddy",
    vaccine: "DTP",
    doctor: "พญ.นภา ศรีสุข",
    status: "Missed",
    followUpStatus: "Contacted",
    followUpNote: "ผู้ปกครองแจ้งว่าติดธุระ จะพามารับวัคซีนภายในสัปดาห์นี้",
    lastCalled: "19/2/2569 10:30:00",
  },
  {
    id: "ev-003",
    date: "2026-02-16",
    childId: "HN-10007",
    child: "น้องฟ้าใส",
    parentName: "คุณแม่จอย",
    parentPhone: "081-555-2233",
    lineId: "joymom_22",
    vaccine: "IPV",
    doctor: "พญ.วราภรณ์ ใจงาม",
    status: "Missed",
    followUpStatus: "Rescheduled",
    followUpNote: "นัดใหม่วันที่ 25 ก.พ. 2569 เวลา 09:00 น.",
    lastCalled: "18/2/2569 14:10:00",
  },
  {
    id: "ev-004",
    date: "2026-02-15",
    childId: "HN-10008",
    child: "น้องข้าวหอม",
    parentName: "คุณพ่อบอย",
    parentPhone: "082-998-1122",
    lineId: "boy_family",
    vaccine: "HBV",
    doctor: "พญ.ชลธิชา สุขใจ",
    status: "Missed",
    followUpStatus: "Unreachable",
    followUpNote: "โทรไม่รับสาย 3 ครั้ง",
    lastCalled: "17/2/2569 16:45:00",
  },
  {
    id: "ev-005",
    date: "2026-02-14",
    childId: "HN-10009",
    child: "น้องพริม",
    parentName: "คุณแม่แอน",
    parentPhone: "095-112-8899",
    lineId: "ann_mom",
    vaccine: "BCG",
    doctor: "พญ.สุรีย์ แสงทอง",
    status: "Missed",
    followUpStatus: "Not Contacted",
    followUpNote: "",
  },
  {
    id: "ev-006",
    date: "2026-02-13",
    childId: "HN-10010",
    child: "น้องไทเกอร์",
    parentName: "คุณพ่อแม็กซ์",
    parentPhone: "090-221-6677",
    lineId: "maxdad",
    vaccine: "JE",
    doctor: "พญ.ดารินทร์ มณี",
    status: "Missed",
    followUpStatus: "Contacted",
    followUpNote: "ผู้ปกครองรับทราบและจะเข้ามาภายใน 2 วัน",
    lastCalled: "18/2/2569 11:20:00",
  },
  {
    id: "ev-007",
    date: "2026-02-12",
    childId: "HN-10011",
    child: "น้องมีนา",
    parentName: "คุณแม่ฝน",
    parentPhone: "084-778-9922",
    lineId: "rainmom",
    vaccine: "Rotavirus",
    doctor: "พญ.อรอุมา ศรีทอง",
    status: "Missed",
    followUpStatus: "Rescheduled",
    followUpNote: "เลื่อนนัดเป็นวันที่ 26 ก.พ.",
    lastCalled: "17/2/2569 09:15:00",
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

  const inputStyle = `w-full h-11 px-4 bg-white border border-slate-200 rounded-2xl text-[12px] font-semibold text-slate-700 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all duration-300 `;
  const inputStyle2 = `w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-[12px] font-semibold text-slate-700 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all duration-300 `;
  const labelStyle = `block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 ml-1`;

  return (
    <div className="h-screen overflow-hidden bg-[#f8fafc] font-sans text-slate-800">
      <div className={`fixed top-0 ${collapsed ? "left-20" : "left-64"} right-0 z-40 transition-all duration-300 max-md:left-0`}>
        <TopNav collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>
      <div className="hidden md:block">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      <div className={`${collapsed ? "ml-20" : "ml-64"} pt-16 md:pt-24 h-full p-6 flex flex-col transition-all duration-300 max-md:ml-0 overflow-hidden`}>
        <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col min-h-0 overflow-hidden">
          
          {/* --- HEADER --- */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 shrink-0 px-2 gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                ติดตาม <span className="text-rose-500">เด็กผิดนัด</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Vaccine Defaulter Management</p>
            </div>
            <div className="relative group w-full md:w-80">
              <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400">🔍</span>
              <input 
                type="text" 
                placeholder="ค้นหาชื่อ, HN, เบอร์โทร, LINE..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* --- TABLE --- */}
          <div className="flex-1 overflow-y-auto custom-scrollbar border border-slate-100 rounded-2xl">
            <table className="w-full text-left">
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
                {defaulters.filter(d => d.child.includes(searchQuery) || d.lineId.includes(searchQuery)).map((item) => (
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
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-blue-600 font-black text-xs font-mono">📞 {item.parentPhone}</div>
                        <div className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] bg-emerald-50 w-fit px-2 py-0.5 rounded-md border border-emerald-100 uppercase tracking-wider">
                          Line: {item.lineId}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border 
                        ${item.followUpStatus === 'Contacted' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                          item.followUpStatus === 'Rescheduled' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                          item.followUpStatus === 'Unreachable' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
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

      {/* --- SIDE PANEL MODAL --- */}
      <div className={`fixed inset-0 z-[100] ${modalOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div onClick={() => setModalOpen(false)} className={`absolute inset-0 bg-slate-900/10 backdrop-blur-sm transition-opacity duration-500 ${modalOpen ? "opacity-100" : "opacity-0"}`} />
        <div className={`absolute right-0 top-0 h-full w-full sm:max-w-[480px] bg-white shadow-2xl transition-transform duration-500 ease-in-out flex flex-col ${modalOpen ? "translate-x-0" : "translate-x-full"}`}>
          
          <div className="relative p-10 pb-6 shrink-0">
             <div className="absolute top-0 right-0 p-8">
                <button onClick={() => setModalOpen(false)} className="bg-slate-50 hover:bg-slate-200 text-slate-400 w-9 h-9 flex items-center justify-center rounded-2xl transition-all">✕</button>
             </div>
             <h3 className="text-3xl font-black text-slate-800 tracking-tight">Follow-up Log</h3>
             <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">บันทึกการติดตามเด็กผิดนัด</p>
          </div>

          <div className="border-b border-slate-100 mx-10 mb-8"></div>

          <div className="flex-1 overflow-y-auto px-10 space-y-12 custom-scrollbar pb-12">
            
            {/* Identity */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                 <div className="h-6 w-1 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                 <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Patient Identity</p>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                <div className="col-span-2">
                  <label className={labelStyle}>ชื่อเด็ก (Child Name)</label>
                  <input disabled value={selectedCase?.child} className={inputStyle2} />
                </div>
                <div className="col-span-1">
                  <label className={labelStyle}>Missing Vaccine</label>
                  <input readOnly value={selectedCase?.vaccine} className={inputStyle2} />
                </div>
                <div className="col-span-1">
                  <label className={labelStyle}>LINE ID</label>
                  <input readOnly value={selectedCase?.lineId} className={inputStyle2} />
                </div>
              </div>
            </div>

            {/* Contact Actions */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                 <div className="h-6 w-1 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                 <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Contact Actions</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <a href={`tel:${selectedCase?.parentPhone}`} className="flex items-center justify-center gap-2 py-3.5 bg-emerald-500 text-white rounded-2xl font-black text-[11px] tracking-widest shadow-xl shadow-emerald-200 hover:bg-emerald-600 transition-all active:scale-95">
                  CALL PARENT
                </a>
                <a href={`https://line.me/ti/p/~${selectedCase?.lineId}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 py-3.5 bg-blue-500 text-white rounded-2xl font-black text-[11px] tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-600 transition-all active:scale-95">
                  OPEN LINE
                </a>
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                 <div className="h-6 w-1 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                 <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Update Progress</p>
              </div>
              <div className="space-y-6">
                <div>
                  <label className={labelStyle}>Follow-up Result</label>
                  <select 
                    value={selectedCase?.followUpStatus} 
                    onChange={(e) => setSelectedCase(prev => prev ? {...prev, followUpStatus: e.target.value as any} : null)}
                    className={inputStyle + " appearance-none cursor-pointer pr-10"}
                  >
                    {FOLLOW_UP_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelStyle}>Log Note</label>
                  <textarea 
                    value={selectedCase?.followUpNote}
                    onChange={(e) => setSelectedCase(prev => prev ? {...prev, followUpNote: e.target.value} : null)}
                    className={inputStyle + " h-32 py-4 resize-none"} 
                    placeholder="ระบุรายละเอียดผลการสนทนา..."
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-10 bg-white border-t border-slate-50 flex items-center gap-4 shrink-0">
            <button onClick={handleSave} className="flex-1 py-4 bg-slate-900 text-white rounded-[1.2rem] text-[11px] font-black tracking-widest shadow-xl shadow-slate-200 hover:bg-blue-600 transition-all active:scale-[0.98]">
              SAVE FOLLOW-UP LOG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Attendance;