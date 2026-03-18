import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import { supabase } from "../../supabaseClient";

// --- Configuration & Helpers ---
type VaccineType = {
  id: string;
  name: string;
  fullName: string;
  category: "Essential" | "Optional";
  age: string;
  dose: string;
  method: string;
  storage: string;
  color: string;
  note: string;
  manufacturer: string;
  price: string;
  lotNumber: string;
};

// Mapping สำหรับแปลงค่า Database (int) <-> UI (string)
const CATEGORY_MAP: Record<number, "Essential" | "Optional"> = {
  1: "Essential",
  2: "Optional"
};

const CATEGORY_REVERSE_MAP: Record<string, number> = {
  "Essential": 1,
  "Optional": 2
};

const CATEGORIES: ("Essential" | "Optional")[] = ["Essential", "Optional"];
const VAX_COLORS = ["#3b82f6", "#6366f1", "#10b981", "#22c55e", "#f59e0b", "#f43f5e", "#d946ef", "#8b5cf6"];

const VaccineIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

function Vaccines() {
  // --- States ---
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [vaccines, setVaccines] = useState<VaccineType[]>([]);
  const [form, setForm] = useState<VaccineType>({
    id: "", name: "", fullName: "", category: "Essential", age: "", dose: "", method: "", storage: "", color: "#3b82f6", note: "", manufacturer: "", price: "", lotNumber: ""
  });

  const [toast, setToast] = useState<{ show: boolean; msg: string; type: "success" | "warning" | "error" }>({
    show: false, msg: "", type: "success"
  });

  // --- Effects ---
  useEffect(() => {
    fetchVaccines();
  }, []);

  // --- Functions ---
  const showToast = (msg: string, type: "success" | "warning" | "error" = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: "", type: "success" }), 3000);
  };

  const fetchVaccines = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("vaccines")
        .select("*")
        .eq("is_active", true) // ดึงเฉพาะตัวที่ยังไม่ลบ
        .order("id", { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedData: VaccineType[] = data.map((item: any) => ({
          id: item.id.toString(),
          name: item.short_name || "",
          fullName: item.full_name || "",
          category: CATEGORY_MAP[item.category as number] || "Essential", // แปลงจาก 1,2 เป็น text
          age: item.age_range || "",
          dose: item.dose_required || "",
          method: item.admin_method || "",
          storage: item.storage_temp || "",
          color: item.display_color || "#3b82f6",
          note: item.note || "",
          manufacturer: "", 
          price: "",
          lotNumber: ""
        }));
        setVaccines(formattedData);
      }
    } catch (error: any) {
      showToast("ไม่สามารถโหลดข้อมูลได้: " + error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const openCreate = () => {
    setSelectedIndex(null);
    setForm({ id: "", name: "", fullName: "", category: "Essential", age: "", dose: "", method: "", storage: "", color: "#3b82f6", note: "", manufacturer: "", price: "", lotNumber: "" });
    setModalOpen(true);
  };

  const openEdit = (v: VaccineType) => {
    setSelectedIndex(vaccines.findIndex(x => x.id === v.id));
    setForm(v);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.fullName) {
      showToast("กรุณากรอกชื่อย่อและชื่อเต็ม", "warning");
      return;
    }

    const payload = {
      short_name: form.name,
      full_name: form.fullName,
      category: CATEGORY_REVERSE_MAP[form.category], // แปลงจาก text เป็น 1 หรือ 2
      age_range: form.age,
      admin_method: form.method,
      dose_required: form.dose,
      storage_temp: form.storage,
      display_color: form.color,
      note: form.note,
      is_active: true
    };

    try {
      if (selectedIndex !== null && form.id) {
        // UPDATE
        const { error } = await supabase
          .from("vaccines")
          .update(payload)
          .eq("id", form.id);
        if (error) throw error;
        showToast("แก้ไขข้อมูลเรียบร้อย", "success");
      } else {
        // INSERT
        const { error } = await supabase
          .from("vaccines")
          .insert([payload]);
        if (error) throw error;
        showToast("เพิ่มข้อมูลวัคซีนใหม่สำเร็จ", "success");
      }
      
      fetchVaccines();
      setModalOpen(false);
    } catch (error: any) {
      showToast("เกิดข้อผิดพลาด: " + error.message, "error");
    }
  };

  const handleDelete = async () => {
    if (selectedIndex !== null && form.id) {
      try {
        // Soft Delete: เปลี่ยน is_active เป็น false
        const { error } = await supabase
          .from("vaccines")
          .update({ is_active: false })
          .eq("id", form.id);

        if (error) throw error;
        showToast("ลบข้อมูลเรียบร้อย", "success");
        fetchVaccines();
      } catch (error: any) {
        showToast("ไม่สามารถลบข้อมูลได้", "error");
      }
    }
    setModalOpen(false);
  };

  // --- Styles ---
  const inputStyle = `w-full h-10 px-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors`;
  const labelStyle = `block text-[13px] font-medium text-gray-700 mb-1.5`;

  const filteredData = vaccines.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || v.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "All" || v.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] font-sans text-slate-800 overflow-hidden relative">
      
      {/* Toast Notification */}
      <div className={`fixed top-4 right-4 z-[1001] transition-all duration-300 ${toast.show ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"}`}>
        <div className={`px-4 py-3 rounded-lg shadow-lg font-medium flex items-center gap-2 border bg-white
          ${toast.type === "success" ? "border-emerald-200 text-emerald-700" : toast.type === "warning" ? "border-amber-200 text-amber-700" : "border-red-200 text-red-700"}`}>
          <span className="text-sm">{toast.msg}</span>
        </div>
      </div>

      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={`flex-1 flex flex-col h-full transition-all duration-300 relative ${collapsed ? "md:ml-20" : "md:ml-64"}`}>
        <TopNav collapsed={collapsed} setCollapsed={setCollapsed} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-7xl mx-auto flex flex-col h-full">
            
            {/* Header & Controls */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-8 gap-5">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Vaccine <span className="text-blue-600">Inventory</span></h1>
                <p className="text-sm font-medium text-slate-500 mt-1">Manage database records</p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full xl:w-auto">
                <div className="relative flex-1 sm:w-72">
                  <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </span>
                  <input 
                    type="text" 
                    placeholder="Search vaccine..."
                    className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none shadow-sm transition-all"
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <select 
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none shadow-sm focus:border-blue-500 transition-all"
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                <button 
                  onClick={openCreate}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-600/20"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Add Vaccine
                </button>
              </div>
            </div>

            {/* Grid Display */}
            {isLoading ? (
               <div className="flex-1 flex items-center justify-center font-medium text-slate-400">กำลังโหลดข้อมูล...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-10">
                {filteredData.map((v) => (
                  <div 
                    key={v.id}
                    onClick={() => openEdit(v)}
                    className="group bg-white rounded-2xl border border-slate-200 hover:border-blue-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer p-5 flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${v.color}15`, color: v.color }}>
                        <VaccineIcon />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide ${v.category === 'Essential' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                        {v.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 leading-tight mb-1 group-hover:text-blue-600 transition-colors">{v.name}</h3>
                    <p className="text-xs font-medium text-slate-500 truncate mb-4">{v.fullName}</p>
                    
                    <div className="mt-auto pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase">Age Range</p>
                        <p className="text-sm font-medium text-slate-700 truncate">{v.age || '-'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase">Method</p>
                        <p className="text-sm font-medium text-slate-700 truncate">{v.method || '-'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Right Drawer Modal */}
      <div className={`fixed inset-0 z-[1000] ${modalOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div onClick={() => setModalOpen(false)} className={`absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity duration-300 ${modalOpen ? "opacity-100" : "opacity-0"}`} />
        <div className={`absolute right-0 top-0 h-full w-full sm:max-w-md bg-white shadow-2xl transition-transform duration-300 flex flex-col ${modalOpen ? "translate-x-0" : "translate-x-full"}`}>
          
          <div className="px-6 py-5 border-b flex justify-between items-center">
             <div>
                <h3 className="text-lg font-bold text-slate-900">{selectedIndex !== null ? "Edit Vaccine" : "New Vaccine"}</h3>
                <p className="text-xs text-slate-500">Enter vaccine details below</p>
             </div>
             <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <section>
              <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4">Basic Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                  <label className={labelStyle}>Short Name *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputStyle} placeholder="e.g. BCG" />
                </div>
                <div className="col-span-1">
                  <label className={labelStyle}>Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as any })} className={inputStyle}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className={labelStyle}>Scientific / Full Name *</label>
                  <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className={inputStyle} />
                </div>
              </div>
            </section>

            <section>
              <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4">Administration</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                  <label className={labelStyle}>Age Range</label>
                  <input value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className={inputStyle} />
                </div>
                <div className="col-span-1">
                  <label className={labelStyle}>Method</label>
                  <input value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })} className={inputStyle} />
                </div>
                <div className="col-span-1">
                  <label className={labelStyle}>Dose Required</label>
                  <input value={form.dose} onChange={(e) => setForm({ ...form, dose: e.target.value })} className={inputStyle} />
                </div>
                <div className="col-span-1">
                  <label className={labelStyle}>Storage Temp</label>
                  <input value={form.storage} onChange={(e) => setForm({ ...form, storage: e.target.value })} className={inputStyle} />
                </div>
                <div className="col-span-2">
                   <label className={labelStyle}>Display Color</label>
                   <div className="flex flex-wrap gap-2.5 pt-1">
                      {VAX_COLORS.map((c, i) => (
                        <button key={i} type="button" onClick={() => setForm({ ...form, color: c })} 
                          className={`w-7 h-7 rounded-full transition-all ${form.color === c ? "ring-2 ring-offset-2 ring-blue-500 scale-110 shadow-lg" : "opacity-40 hover:opacity-100"}`} 
                          style={{ background: c }} 
                        />
                      ))}
                   </div>
                </div>
                <div className="col-span-2">
                  <label className={labelStyle}>Notes / Description</label>
                  <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className={`${inputStyle} h-24 py-2 resize-none`} />
                </div>
              </div>
            </section>
          </div>

          <div className="p-4 bg-slate-50 border-t flex items-center gap-3">
            {selectedIndex !== null && (
              <button onClick={handleDelete} className="px-5 h-11 bg-white border border-red-200 text-red-600 rounded-xl hover:bg-red-50 text-sm font-semibold transition-all">
                Delete
              </button>
            )}
            <button onClick={handleSave} className="flex-1 h-11 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all">
              Save Record
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Vaccines;