// import React, { useState } from "react";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";

function Profile() {
  const [collapsed, setCollapsed] = useState(false);

  // ข้อมูล Admin แบบละเอียด
  const [admin, setAdmin] = useState({
    firstName: "สมชาย",
    lastName: "เก่งกาจ",
    email: "somchai.k@hospital.go.th",
    phone: "081-234-5678",
    role: "Senior System Administrator",
    dept: "Medical Informatics Division",
    id: "ADM-69001",
    hospital: "โรงพยาบาลศูนย์กุมารเวช",
    licenseNo: "MD-9921445",
    joined: "January 2024"
  });

  const inputStyle = `w-full h-10 px-4 bg-slate-50/50 border border-slate-200 rounded-xl text-[12px] font-semibold text-slate-700 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all duration-300 shadow-sm`;
  const labelStyle = `block text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1.5 ml-1`;

  return (
    <div className="h-screen overflow-hidden bg-[#f8fafc] font-sans text-slate-800">
      <div className={`fixed top-0 ${collapsed ? "left-20" : "left-64"} right-0 z-40 transition-all duration-300 max-md:left-0`}>
        <TopNav collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>
      <div className="hidden md:block">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      <div className={`${collapsed ? "ml-20" : "ml-64"} pt-16 md:pt-24 h-full p-6 flex flex-col transition-all duration-300 max-md:ml-0 overflow-hidden`}>
        <div className="flex-1 bg-white rounded-xl rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-8 flex flex-col min-h-0 overflow-hidden relative"> 
          
          {/* --- TOP HEADER: PROFILE SUMMARY --- */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-10 shrink-0">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-400 p-1 shadow-xl">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-4xl shadow-inner">👨‍⚕️</div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-slate-900 text-white rounded-xl border-4 border-white flex items-center justify-center shadow-lg group cursor-pointer hover:bg-blue-600 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">{admin.firstName} {admin.lastName}</h2>
                <span className="w-fit mx-auto md:mx-0 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-blue-100/50">System Root Admin</span>
              </div>
              <p className="text-slate-400 font-bold text-sm mt-1 uppercase tracking-tight">{admin.dept} • {admin.hospital}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 flex items-center gap-2">
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">ID:</span>
                  <span className="text-[11px] font-bold text-slate-600">{admin.id}</span>
                </div>
                <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 flex items-center gap-2">
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">License:</span>
                  <span className="text-[11px] font-bold text-slate-600 font-mono">{admin.licenseNo}</span>
                </div>
              </div>
            </div>
          </div>

          {/* --- MAIN CONTENT AREA: BENTO FORM GRID --- */}
          <div className="flex-1 min-h-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10 max-w-7xl h-full content-start">
              
              {/* Column 1: Personal Credentials */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-1 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                  <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em]">Personal Credentials</p>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-1">
                    <label className={labelStyle}>Given Name</label>
                    <input value={admin.firstName} onChange={(e) => setAdmin({...admin, firstName: e.target.value})} className={inputStyle} />
                  </div>
                  <div className="col-span-1">
                    <label className={labelStyle}>Family Name</label>
                    <input value={admin.lastName} onChange={(e) => setAdmin({...admin, lastName: e.target.value})} className={inputStyle} />
                  </div>
                  <div className="col-span-2">
                    <label className={labelStyle}>Professional Email</label>
                    <div className="relative">
                       <input value={admin.email} onChange={(e) => setAdmin({...admin, email: e.target.value})} className={inputStyle + " pl-10"} />
                       <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">@</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 2: Workplace & Security */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-1 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                  <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em]">Workplace Information</p>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2">
                    <label className={labelStyle}>Primary Institution</label>
                    <input value={admin.hospital} onChange={(e) => setAdmin({...admin, hospital: e.target.value})} className={inputStyle} />
                  </div>
                  <div className="col-span-1">
                    <label className={labelStyle}>Contact Extension</label>
                    <input value={admin.phone} onChange={(e) => setAdmin({...admin, phone: e.target.value})} className={inputStyle} />
                  </div>
                  <div className="col-span-1">
                    <label className={labelStyle}>Professional Title</label>
                    <input value={admin.role} readOnly className={inputStyle + " bg-slate-50 cursor-default border-transparent"} />
                  </div>
                </div>

                {/* --- COMPACT SECURITY CARD --- */}
                <div className="mt-8 p-5 bg-slate-900 rounded-3xl flex items-center justify-between shadow-xl shadow-slate-200">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl">🔐</div>
                    <div>
                      <p className="text-[10px] font-black text-white uppercase tracking-widest">Authentication</p>
                      <p className="text-[9px] font-bold text-slate-400 mt-0.5">Last password reset: 12 Feb 2026</p>
                    </div>
                  </div>
                  <button className="px-5 py-2 bg-white text-slate-900 rounded-xl text-[9px] font-black hover:bg-blue-500 hover:text-white transition-all">RE-SECURE</button>
                </div>
              </div>

            </div>
          </div>

          {/* --- FOOTER ACTION BAR --- */}
          <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between shrink-0">
            <div className="hidden sm:block">
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Profile Integrity Verified • Session: {admin.joined.split(' ')[1]}</p>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none px-6 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-500 transition-colors">Reset</button>
              <button className="flex-1 sm:flex-none px-10 py-3 bg-slate-900 text-white rounded-[1.2rem] text-[10px] font-black tracking-widest shadow-xl shadow-slate-200 hover:bg-blue-600 transition-all active:scale-95">
                SAVE CONFIGURATION
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;