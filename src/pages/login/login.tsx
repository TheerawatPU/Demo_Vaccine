// import React, { useState } from "react";
import { useState } from "react";
import bg from "../../assets/bg.jpg";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Login() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {

    if (username === "admin" && password === "1234") {

      Swal.fire({
        icon: "success",
        title: "Login Success",
        text: "Welcome Admin",
        confirmButtonColor: "#4f46e5",
        timer: 1500,
        showConfirmButton: false
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

    } else {

      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Username หรือ Password ไม่ถูกต้อง",
        confirmButtonColor: "#ef4444"
      });

    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center px-4 py-4">

      <div className="max-w-5xl w-full md:h-[560px] bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden">

        {/* LEFT (ซ่อนในมือถือ) */}
        <div className="hidden md:block md:w-1/2 relative">
          <img src={bg} className="w-full h-full object-cover" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-800/80 to-transparent flex flex-col justify-end p-8 text-white">
            <h1 className="text-4xl font-bold mb-1">Pediatric Vaccine</h1>
            <p className="text-sm opacity-90">ระบบนัดหมายวัคซีนสำหรับเด็ก</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full md:w-1/2 relative flex flex-col items-center justify-center px-6 md:px-10 bg-[#f5f9ff] overflow-hidden">

          {/* LOGO */}
          <div className="absolute top-4 md:top-8 w-full flex justify-center">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center shadow-md border">
              <img
                src="https://img.freepik.com/free-vector/international-day-women-girls-science_1308-126213.jpg"
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-2 border-blue-300 shadow"
                alt="hospital logo"
              />
            </div>
          </div>

          {/* FORM */}
          <div className="relative z-10 w-full max-w-xs mt-28 md:mt-24 text-center">

            <h2 className="text-3xl md:text-4xl font-extrabold tracking-wide text-indigo-700 mt-6 md:mt-10 mb-5">
              Welcome
              <span className="block text-xs font-medium text-indigo-500 mt-1">
                Pediatric Vaccine System
              </span>
            </h2>

            {/* USERNAME */}
            <label className="text-xs text-indigo-500 mb-1 block text-left">
              Username
            </label>
            <div className="flex items-center border border-indigo-300 rounded-lg px-3 h-11 mb-4 bg-white shadow-sm">
              <span className="mr-2 text-gray-400">👤</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full outline-none text-sm bg-transparent"
              />
            </div>

            {/* PASSWORD */}
            <label className="text-xs text-indigo-500 mb-1 block text-left">
              Password
            </label>
            <div className="flex items-center border border-indigo-300 rounded-lg px-3 h-11 mb-1 bg-white shadow-sm">
              <span className="mr-2 text-gray-400">🔐</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="1234"
                className="w-full outline-none text-sm bg-transparent"
              />
            </div>

            {/* LOGIN */}
            <button
              onClick={handleLogin}
              className="w-full cursor-pointer py-2.5 my-6 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-lg text-sm shadow-md"
            >
              LOGIN
            </button>

            {/* FOOTER */}
            <div className="flex items-center my-4 opacity-70">
              <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-indigo-300 to-transparent"></div>
              <span className="px-3 text-[11px] text-indigo-500 tracking-wider">
                SYSTEM BY ADMIN
              </span>
              <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-indigo-300 to-transparent"></div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
