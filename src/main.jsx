// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import AllSchedulePage from "./AllSchedulePage.jsx";
import AllGalleryPage from "./AllGalleryPage.jsx";   // ← เพิ่มบรรทัดนี้
import TokenPage from "./TokenPage.jsx"; // 1. นำเข้า TokenPage
import "./index.css";
import MerchPage from './MerchPage.jsx';
import DonationPage from "./DonationPage.jsx";
import PlannerApp from "./Planner/PlannerApp.jsx";
import './App.css';
import BossBattlePage from './BossBattlePage.jsx';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/all-schedule" element={<AllSchedulePage />} />
        <Route path="/gallery" element={<AllGalleryPage />} /> {/* ใหม่ */}
        <Route path="/tokens" element={<TokenPage />} />
        <Route path="/merch" element={<MerchPage />} />
        <Route path="/donation" element={<DonationPage />} />
        <Route path="/planner" element={<PlannerApp />} />
        <Route path="/boss-battle" element={<BossBattlePage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
