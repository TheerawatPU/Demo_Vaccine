import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import { supabase } from "../../supabaseClient";

type AttendanceRecord = {
  id: string;
  hn_code: string;
  child_name: string;
  birth_date: string;
  parent_name: string;
  parent_phone: string;
  line_id: string;
  appointment_date: string;
  status: string;
  follow_up_status: "Not Contacted" | "Contacted" | "Rescheduled" | "Unreachable";
  note: string;
  vaccines: {
    short_name: string;
    category: number;
  };
};

const FOLLOW_UP_OPTIONS = [
  { label: "ยังไม่ได้ติดต่อ", value: "Not Contacted" },
  { label: "ติดต่อได้ / รับสาย", value: "Contacted" },
  { label: "นัดหมายใหม่แล้ว", value: "Rescheduled" },
  { label: "ติดต่อไม่ได้", value: "Unreachable" },
];

const CATEGORY_MAP: Record<number, string> = {
  1: "Essential",
  2: "Optional",
};

function Attendance() {
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "", type: "success" });

  useEffect(() => {
    fetchRecords();
  }, []);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: "", type: "success" }), 3000);
  };

  const fetchRecords = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("appointments")
      .select(`*, vaccines (short_name, category)`)
      .eq("status", "Missed")
      .order("appointment_date", { ascending: false });

    if (error) {
      showToast("โหลดข้อมูลไม่สำเร็จ", "error");
    } else {
      setRecords(data as any);
    }
    setIsLoading(false);
  };

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return "-";
    const birth = new Date(birthDate);
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    if (months < 0) { years--; months += 12; }
    return `${years} ปี ${months} เดือน`;
  };

  const handleSave = async () => {
    if (!selectedRecord) return;
    const { error } = await supabase
      .from("appointments")
      .update({
        follow_up_status: selectedRecord.follow_up_status,
        note: selectedRecord.note
      })
      .eq("id", selectedRecord.id);

    if (error) {
      showToast("บันทึกไม่สำเร็จ", "error");
    } else {
      showToast("บันทึกข้อมูลเรียบร้อย", "success");
      setModalOpen(false);
      fetchRecords();
    }
  };

  const filteredRecords = records.filter(r =>
    r.child_name.includes(searchQuery) || r.hn_code?.includes(searchQuery)
  );

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] font-sans text-slate-800 antialiased overflow-hidden relative">
      
      {/* Toast Notification */}
      <div className={`fixed top-6 right-6 z-[1001] transition-all duration-300 ${toast.show ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"}`}>
        <div className={`px-5 py-3.5 rounded-2xl shadow-xl font-bold text-sm border bg-white flex items-center gap-3
          ${toast.type === "success" ? "border-emerald-100 text-emerald-700" : "border-red-100 text-red-700"}`}>
          <div className={`w-2 h-2 rounded-full ${toast.type === "success" ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
          {toast.msg}
        </div>
      </div>

      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={`flex-1 flex flex-col h-full transition-all duration-300 ${collapsed ? "md:ml-20" : "md:ml-64"}`}>
        <TopNav collapsed={collapsed} setCollapsed={setCollapsed} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-10">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-950 tracking-tight">Defaulter <span className="text-blue-600">Tracking</span></h1>
                <p className="text-sm font-medium text-slate-500 mt-1">ติดตามและอัปเดตสถานะเด็กที่ไม่ได้มารับวัคซีนตามนัด</p>
              </div>

              <div className="relative w-full md:w-80">
                <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">🔍</span>
                <input 
                  type="text" 
                  placeholder="ค้นหาชื่อเด็ก หรือ HN..."
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none shadow-sm transition-all"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Table Area */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">นัดหมาย / วัคซีน</th>
                      <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">ข้อมูลเด็ก</th>
                      <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">ชื่อผู้ปกครอง / ติดต่อ</th>
                      <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] text-center">สถานะติดตาม</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-slate-950 font-medium antialiased">
                    {isLoading ? (
                      <tr><td colSpan={4} className="px-6 py-20 text-center text-slate-400">กำลังโหลดข้อมูล...</td></tr>
                    ) : filteredRecords.map((item) => (
                      <tr 
                        key={item.id} 
                        className="hover:bg-blue-50/30 cursor-pointer transition-colors group"
                        onClick={() => { setSelectedRecord(item); setModalOpen(true); }}
                      >
                        <td className="px-6 py-6">
                          <div className="text-sm font-bold">{item.appointment_date}</div>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100 uppercase">
                              {item.vaccines?.short_name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="text-sm font-bold group-hover:text-blue-600 transition-colors">{item.child_name}</div>
                          <div className="text-xs text-slate-400 font-mono mt-0.5">HN: {item.hn_code}</div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="text-sm font-bold">{item.parent_name || "-"}</div>
                          <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">📞 {item.parent_phone}</div>
                        </td>
                        <td className="px-6 py-6 text-center">
                          <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold border ${
                            item.follow_up_status === 'Contacted' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                            item.follow_up_status === 'Rescheduled' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                            item.follow_up_status === 'Unreachable' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                            'bg-slate-50 text-slate-500 border-slate-200'
                          }`}>
                            {item.follow_up_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* --- RIGHT DRAWER --- */}
      <div className={`fixed inset-0 z-[1000] ${modalOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div onClick={() => setModalOpen(false)} className={`absolute inset-0 bg-slate-900/10 backdrop-blur-sm transition-opacity duration-400 ${modalOpen ? "opacity-100" : "opacity-0"}`} />
        <div className={`absolute right-0 top-0 h-full w-full sm:max-w-[440px] bg-white shadow-2xl transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col ${modalOpen ? "translate-x-0" : "translate-x-full"}`}>
          
          <div className="px-8 py-8 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
             <div>
                <h3 className="text-xl font-bold text-slate-950 tracking-tight">บันทึกผลการติดตาม</h3>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">HN: {selectedRecord?.hn_code}</p>
             </div>
             <button onClick={() => setModalOpen(false)} className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-2xl text-slate-400 transition-all border border-transparent hover:border-slate-100">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide">
            
            {/* Patient & Guardian Group */}
            <section className="space-y-4">
              <h4 className="text-[14px] font-bold text-blue-600 uppercase tracking-[0.2em] ml-1">Information</h4>
              <div className="bg-slate-50/50 rounded-[16px] p-6 border border-slate-100 space-y-6 shadow-inner">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">ชื่อเด็ก</span>
                    <span className="text-sm font-bold text-slate-950">{selectedRecord?.child_name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">อายุ</span>
                    <span className="text-sm font-bold text-slate-950">{selectedRecord ? calculateAge(selectedRecord.birth_date) : "-"}</span>
                  </div>
                </div>
                <div className="h-px bg-slate-200/50"></div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">ชื่อผู้ปกครอง</span>
                    <span className="text-sm font-bold text-slate-950">{selectedRecord?.parent_name || "ไม่ระบุ"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">วัคซีนที่ค้าง</span>
                    <span className="text-sm font-bold text-rose-500">{selectedRecord?.vaccines?.short_name}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Group */}
            <section className="space-y-4">
               <h4 className="text-[14px] font-bold text-blue-600 uppercase tracking-[0.2em] ml-1">Contact Actions</h4>
               <div className="grid grid-cols-2 gap-4">
                  <a href={`tel:${selectedRecord?.parent_phone}`} className="flex flex-col items-center justify-center p-5 bg-white border border-slate-200 rounded-[16px] hover:border-blue-400 hover:bg-blue-50/50 transition-all shadow-sm group">
                    <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">📞</div>
                    <span className="text-[13px] font-bold text-slate-950">{selectedRecord?.parent_phone}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase mt-1">โทรด่วน</span>
                  </a>
                  <a href={`https://line.me/ti/p/~${selectedRecord?.line_id}`} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center p-5 bg-white border border-slate-200 rounded-[16px] hover:border-emerald-400 hover:bg-emerald-50/50 transition-all shadow-sm group">
                    <div className="w-11 h-11 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">💬</div>
                    <span className="text-[13px] font-bold text-slate-950 truncate w-full text-center px-2">{selectedRecord?.line_id || "N/A"}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase mt-1">แชท LINE</span>
                  </a>
               </div>
            </section>

            {/* Input Log Group */}
            <section className="space-y-6">
              <h4 className="text-[14px] font-bold text-blue-600 uppercase tracking-[0.2em] ml-1">Update Status</h4>
              <div className="space-y-6">
                <div>
                  {/* <label className="block text-[10px] font-bold text-slate-400 uppercase mb-3 ml-1">ผลการติดตาม</label> */}
                  <div className="grid grid-cols-2 gap-3">
                    {FOLLOW_UP_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setSelectedRecord(prev => prev ? {...prev, follow_up_status: opt.value as any} : null)}
                        className={`py-3.5 px-3 text-[11px] font-bold rounded-[12px] border transition-all ${
                          selectedRecord?.follow_up_status === opt.value 
                          ? "bg-slate-950 text-white border-slate-950 shadow-xl shadow-slate-200" 
                          : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-900"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[14px] font-bold text-blue-600 uppercase mb-3 ml-1">Note</label>
                  <textarea 
                    value={selectedRecord?.note || ""}
                    onChange={(e) => setSelectedRecord(prev => prev ? {...prev, note: e.target.value} : null)}
                    className="w-full min-h-[160px] p-5 border border-slate-200 rounded-[16px] text-sm font-medium text-slate-950 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none resize-none transition-all placeholder:text-slate-300" 
                    placeholder=""
                  />
                </div>
              </div>
            </section>
          </div>

          <div className="p-8 bg-white border-t border-slate-50 mt-auto pb-12">
            <button 
              onClick={handleSave} 
              className="w-full py-4.5 bg-blue-600 text-white rounded-[16px] text-sm font-bold shadow-2xl shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-[0.98]"
            >
              บันทึกข้อมูลการติดตาม
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Attendance;