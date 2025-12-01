// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import AllSchedulePage from "./AllSchedulePage.jsx";
import AllGalleryPage from "./AllGalleryPage.jsx";   // ← เพิ่มบรรทัดนี้
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/all-schedule" element={<AllSchedulePage />} />
        <Route path="/gallery" element={<AllGalleryPage />} /> {/* ใหม่ */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
