import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGauge,
  faCalendarCheck,
  faSyringe,
  faChartLine,
  faClipboardList,
} from "@fortawesome/free-solid-svg-icons";

function Sidebar({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Auto collapse เมื่อจอเล็ก
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🟦 NEW MENU
  const menu = [
    { name: "Dashboard", icon: faGauge, path: "/dashboard" },
    { name: "Schedule", icon: faCalendarCheck, path: "/schedule" },
    { name: "Vaccine", icon: faSyringe, path: "/vaccine" },
    { name: "Reports", icon: faChartLine, path: "/reports" },
    { name: "Attendance", icon: faClipboardList, path: "/attendance" },
  ];

  return (
    <div
      className={`${collapsed ? "w-20" : "w-64"}
      h-screen fixed left-0 top-0 z-50 bg-white border-r border-gray-100 flex flex-col
      transition-all duration-300 ease-in-out
      shadow-[4px_0_12px_rgba(0,0,0,0.04)]`}
    >
      {/* LOGO */}
      <div className="h-16 flex items-center px-3 border-b justify-center border-gray-100">
        <img
          src="https://img.freepik.com/free-vector/international-day-women-girls-science_1308-126213.jpg"
          className="w-10 h-10 rounded-full"
          alt=""
        />

        {!collapsed && (
          <div className="flex items-baseline mx-4">
            <span className="text-[14px] font-bold text-gray-600 mr-1">
              Pediatric
            </span>
            <span className="text-[16px] font-bold text-blue-600">
              Vaccine
            </span>
          </div>
        )}
      </div>

      {/* MENU */}
      <div className="mt-3 px-2 flex-1">
        {menu.map((item, i) => {
          const active = location.pathname === item.path;

          return (
            <div
              key={i}
              onClick={() => navigate(item.path)}
              className={`flex items-center h-10
              ${collapsed ? "justify-center" : "px-4"}
              mb-1 text-[13px] rounded-lg cursor-pointer transition-all duration-150
              ${
                active
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              }
              `}
            >
              <FontAwesomeIcon icon={item.icon} className="text-[14px]" />

              {!collapsed && <span className="ml-3">{item.name}</span>}
            </div>
          );
        })}
      </div>

      {!collapsed && (
        <div className="px-6 py-3 border-t border-gray-100 text-[10px] text-gray-400 text-center">
          Pediatric Vaccine System
        </div>
      )}
    </div>
  );
}

export default Sidebar;
