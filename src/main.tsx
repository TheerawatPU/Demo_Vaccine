import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import DatePicker from "react-datepicker";
import { BrowserRouter } from "react-router-dom";
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/Demo_Vaccine">
      <App />
    </BrowserRouter>
  </StrictMode>,
)
