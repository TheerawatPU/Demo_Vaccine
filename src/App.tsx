import {  Routes, Route } from "react-router-dom";
import Login from "./pages/login/login";
import Dashboard from "../src/pages/dashboard/dashboard";
import Schedule from "../src/pages/dashboard/schedule";
import Vaccine from "../src/pages/dashboard/vaccine";
import Reports from "../src/pages/dashboard/reports";
import Attendance from "../src/pages/dashboard/attendance";
import Profile from "../src/pages/components/Profile";


function App() {
  return (
    // <BrowserRouter>
    //   <Routes>
    //     <Route path="/" element={<Login />} />
    //     <Route path="/login" element={<Login />} />
    //     <Route path="/dashboard" element={<Dashboard />} />
    //     <Route path="/schedule" element={<Schedule />} />
    //     <Route path="/vaccine" element={<Vaccine />} />
    //     <Route path="/reports" element={<Reports />} />
    //     <Route path="/attendance" element={<Attendance />} />
    //     <Route path="/profile" element={<Profile />} />
    //   </Routes>
    // </BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/vaccine" element={<Vaccine />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
  );
}

export default App;
