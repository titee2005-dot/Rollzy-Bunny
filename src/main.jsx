// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import AllSchedulePage from "./AllSchedulePage.jsx";
import "./index.css";   // หรือ App.css แล้วแต่โปรเจกต์

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/all-schedule" element={<AllSchedulePage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
