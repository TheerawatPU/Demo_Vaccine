import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faRightFromBracket,
  faBars,
} from "@fortawesome/free-solid-svg-icons";

type SidebarProps = {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
};

function TopNav({ collapsed, setCollapsed }: SidebarProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("login");
    navigate("/");
  };

  return (
    <div className="w-full h-16 bg-[#f8fafc] border-b border-gray-200 flex items-center justify-between px-6 shadow-[0_3px_8px_rgba(0,0,0,0.03)]">
      {/* LEFT */}
      <div className="flex items-center space-x-4">
        {/* 🟦 HAMBURGER */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-500 hover:text-blue-600 transition text-lg cursor-pointer"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>

        <div>
          <h1 className="text-[18px] md:text-[20px] font-bold text-gray-700">Pediatric Vaccine</h1>
          <p className="text-[8px] text-gray-400 uppercase tracking-widest hidden sm:block">
            System by Administrator
          </p>
        </div>
      </div>

      {/* PROFILE */}
      <div className="relative">
        <div
          onClick={() => setOpen(!open)}
          className="flex items-center space-x-3 cursor-pointer px-3 py-1.5 rounded-md hover:bg-blue-50 transition"
        >
          <div className="text-right hidden sm:block">
            <p className="text-[13px] font-medium text-gray-700">Admin</p>
            <p className="text-[11px] text-gray-400">Administrator</p>
          </div>

          <img
            src="https://i.pravatar.cc/40"
            className="w-9 h-9 rounded-full border border-gray-200"
            alt=""
          />
        </div>

        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 border border-gray-100">
            <div
              onClick={() => navigate("/profile")}
              className="flex items-center px-4 py-2 text-[13px] hover:bg-blue-50 cursor-pointer text-gray-700"
            >
              <FontAwesomeIcon icon={faUser} className="mr-3 text-blue-400" />
              Profile
            </div>

            <div className="border-t border-gray-100"></div>

            <div
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-[13px] hover:bg-red-50 cursor-pointer text-gray-700"
            >
              <FontAwesomeIcon
                icon={faRightFromBracket}
                className="mr-3 text-red-400"
              />
              Logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TopNav;