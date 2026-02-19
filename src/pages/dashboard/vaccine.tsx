// import React, { useState } from "react";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";

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

const CATEGORIES = ["Essential", "Optional"];
const VAX_COLORS = ["#3b82f6", "#6366f1", "#10b981", "#22c55e", "#f59e0b", "#f43f5e", "#d946ef", "#8b5cf6"];

function Vaccines() {
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [vaccines, setVaccines] = useState<VaccineType[]>([
    { id: "1", name: "BCG", fullName: "Bacillus Calmette-Guérin", category: "Essential", age: "แรกเกิด", dose: "1 Dose", method: "ID", storage: "2-8°C", color: "#f43f5e", note: "ป้องกันวัณโรค", manufacturer: "Serum Institute", price: "0", lotNumber: "BCG-9921" },
    { id: "2", name: "HBV", fullName: "Hepatitis B Vaccine", category: "Essential", age: "แรกเกิด, 1, 6 เดือน", dose: "3 Doses", method: "IM", storage: "2-8°C", color: "#3b82f6", note: "ป้องกันตับอักเสบบี", manufacturer: "GSK", price: "0", lotNumber: "HB-8820" },
    { id: "3", name: "MMR", fullName: "Measles-Mumps-Rubella", category: "Essential", age: "9-12 เดือน", dose: "2 Doses", method: "SC", storage: "-50 ถึง -15°C", color: "#8b5cf6", note: "หัด-คางทูม-หัดเยอรมัน", manufacturer: "Merck", price: "450", lotNumber: "MR-7712" },
  ]);

  const [form, setForm] = useState<VaccineType>({
    id: "", name: "", fullName: "", category: "Essential", age: "", dose: "", method: "", storage: "", color: "#3b82f6", note: "", manufacturer: "", price: "", lotNumber: ""
  });

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

  const handleSave = () => {
    if (!form.name || !form.fullName) return;
    if (selectedIndex !== null) {
      const copy = [...vaccines];
      copy[selectedIndex] = form;
      setVaccines(copy);
    } else {
      setVaccines([...vaccines, { ...form, id: Date.now().toString() }]);
    }
    setModalOpen(false);
  };

  const inputStyle = `w-full h-11 px-4 bg-white border border-slate-200 rounded-2xl text-[12px] font-semibold text-slate-700 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all duration-300 `;
  const labelStyle = `block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 ml-1`;

  const filteredData = vaccines.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || v.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "All" || v.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-screen overflow-hidden bg-[#f8fafc] font-sans text-slate-800">
      <div className={`fixed top-0 ${collapsed ? "left-20" : "left-64"} right-0 z-40 transition-all duration-300 max-md:left-0`}>
        <TopNav collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>
      <div className="hidden md:block">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      <div className={`${collapsed ? "ml-20" : "ml-64"} pt-16 md:pt-24 h-full p-6 flex flex-col transition-all duration-300 max-md:ml-0 overflow-hidden`}>
        
        <div className="flex-1 bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-col min-h-0 overflow-hidden"> 

          {/* --- HEADER --- */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 shrink-0 px-2 gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Vaccine <span className="text-blue-600">Inventory</span></h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Medical Stock & Information Control</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative group flex-1 md:w-64">
                <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></span>
                <input 
                  type="text" 
                  placeholder="Search catalog..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-[11px] font-bold focus:ring-4 focus:ring-blue-500/5 outline-none shadow-sm transition-all"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-[11px] font-bold outline-none cursor-pointer shadow-sm hover:border-blue-300 transition-all"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <button 
                onClick={openCreate}
                className="bg-slate-900 hover:bg-blue-600 text-white px-6 py-2.5 rounded-2xl text-[10px] font-black tracking-widest transition-all active:scale-95 whitespace-nowrap shadow-lg shadow-slate-200"
              >
                + ADD NEW VACCINE
              </button>
            </div>
          </div>

          {/* --- COMPACT CARDS (Shadow Adjusted on Hover) --- */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
              {filteredData.map((v) => (
                <div 
                  key={v.id}
                  onClick={() => openEdit(v)}
                  className="group relative bg-white rounded-[2rem] border border-slate-100 shadow-md hover:shadow-[0_4px_10px_-2px_rgba(0,0,0,0.05)] hover:translate-y-0.5 transition-all duration-300 cursor-pointer overflow-hidden p-6"
                >
                  <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.01] transition-opacity duration-300 pointer-events-none text-7xl font-sans">💉</div>
                  
                  <div className="flex justify-between items-start mb-5">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-lg shadow-inner transition-transform group-hover:scale-95 duration-300" style={{ background: `${v.color}15`, color: v.color }}>💉</div>
                    <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black tracking-widest uppercase ${v.category === 'Essential' ? 'bg-blue-50 text-blue-500 border border-blue-100' : 'bg-amber-50 text-amber-500 border border-amber-100'}`}>
                      {v.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-slate-800 tracking-tight leading-tight group-hover:text-blue-600 transition-colors mb-1">{v.name}</h3>
                  <p className="text-[10px] font-bold text-slate-400 truncate mb-5 uppercase tracking-tighter">{v.fullName}</p>
                  
                  <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex justify-between text-[10px] font-bold pr-4">
                        <span className="text-slate-300 uppercase tracking-widest text-[8px]">Age</span>
                        <span className="text-slate-600">{v.age}</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold pr-4">
                        <span className="text-slate-300 uppercase tracking-widest text-[8px]">Lot</span>
                        <span className="text-slate-500 font-mono">{v.lotNumber || '-'}</span>
                      </div>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all transform scale-90 group-hover:scale-100 opacity-0 group-hover:opacity-100">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7" /></svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* --- SIDE PANEL MODAL --- */}
      <div className={`fixed inset-0 z-[100] ${modalOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div onClick={() => setModalOpen(false)} className={`absolute inset-0 bg-slate-900/10 backdrop-blur-sm transition-opacity duration-500 ${modalOpen ? "opacity-100" : "opacity-0"}`} />
        
        <div className={`absolute right-0 top-0 h-full w-full sm:max-w-[480px] bg-white shadow-2xl transition-transform duration-500 ease-in-out flex flex-col ${modalOpen ? "translate-x-0" : "translate-x-full"}`}>
          
          <div className="relative p-10 pb-6 shrink-0">
             <div className="absolute top-0 right-0 p-8">
                <button onClick={() => setModalOpen(false)} className="bg-slate-50 hover:bg-slate-200 text-slate-400 w-9 h-9 flex items-center justify-center rounded-2xl transition-all active:scale-90">✕</button>
             </div>
             <h3 className="text-3xl font-black text-slate-800 tracking-tight">{selectedIndex !== null ? "Edit Details" : "New Vaccine"}</h3>
             <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Inventory Management Protocol</p>
          </div>

          <div className="border-b border-slate-100 mx-10 mb-8"></div>

          <div className="flex-1 overflow-y-auto px-10 space-y-12 custom-scrollbar pb-12">
            {/* Section 1: Basic Identity */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                 <div className="h-6 w-1 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                 <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Basic Identification</p>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                <div className="col-span-1">
                  <label className={labelStyle}>Short Name *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputStyle} placeholder="e.g. BCG" />
                </div>
                <div className="col-span-1">
                  <label className={labelStyle}>Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as any })} className={inputStyle + " appearance-none cursor-pointer"}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className={labelStyle}>Full Scientific Name *</label>
                  <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className={inputStyle} placeholder="Enter official vaccine name..." />
                </div>
              </div>
            </div>

            {/* Section 2: Clinical Data */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                 <div className="h-6 w-1 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                 <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Clinical Standards</p>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                <div className="col-span-1"><label className={labelStyle}>Age Range</label><input value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className={inputStyle} placeholder="e.g. แรกเกิด" /></div>
                <div className="col-span-1"><label className={labelStyle}>Admin Method</label><input value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })} className={inputStyle} placeholder="IM, ID, SC" /></div>
                <div className="col-span-1"><label className={labelStyle}>Dose Required</label><input value={form.dose} onChange={(e) => setForm({ ...form, dose: e.target.value })} className={inputStyle} placeholder="e.g. 1 Dose" /></div>
                <div className="col-span-1"><label className={labelStyle}>Temp. Control</label><input value={form.storage} onChange={(e) => setForm({ ...form, storage: e.target.value })} className={inputStyle} placeholder="2-8°C" /></div>
              </div>
            </div>

            {/* Section 3: Supply Chain */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                 <div className="h-6 w-1 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                 <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Supply & Aesthetics</p>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                <div className="col-span-1"><label className={labelStyle}>Manufacturer</label><input value={form.manufacturer} onChange={(e) => setForm({ ...form, manufacturer: e.target.value })} className={inputStyle} placeholder="e.g. GSK" /></div>
                <div className="col-span-1"><label className={labelStyle}>Lot Number</label><input value={form.lotNumber} onChange={(e) => setForm({ ...form, lotNumber: e.target.value })} className={inputStyle} placeholder="Batch ID" /></div>
                <div className="col-span-2">
                   <label className={labelStyle}>Theme Color Mapping</label>
                   <div className="flex flex-wrap gap-3 p-1">
                      {VAX_COLORS.map((c, i) => (
                        <button key={i} type="button" onClick={() => setForm({ ...form, color: c })} className={`w-9 h-9 rounded-2xl transition-all transform hover:scale-110 active:scale-90 ${form.color === c ? "ring-4 ring-slate-100 shadow-md scale-110 opacity-100" : "opacity-30 hover:opacity-60"}`} style={{ background: c }} />
                      ))}
                   </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-10 bg-white border-t border-slate-50 flex items-center gap-4 shrink-0">
            {selectedIndex !== null && (
              <button onClick={() => { setVaccines(vaccines.filter((_, i) => i !== selectedIndex)); setModalOpen(false); }} className="w-12 h-12 flex items-center justify-center bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-95">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            )}
            <button onClick={handleSave} className="flex-1 py-4 bg-slate-900 text-white rounded-[1.2rem] text-[11px] font-black tracking-widest shadow-xl shadow-slate-200 hover:bg-blue-600 transition-all active:scale-[0.98]">
              SAVE CONFIGURATION
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Vaccines;