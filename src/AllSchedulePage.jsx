// src/AllSchedulePage.jsx
import { useEffect } from "react";
import Navbar from "./Navbar.jsx";
import Eventslist from "./Eventslist.jsx";
import "./App.css";

function AllSchedulePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="app-root">
      <Navbar />
      <main className="page-section page-section--tone2 all-schedule-page">
        <div className="page-section-inner">
          <h1 style={{ marginBottom: "16px" }}>All Schedule (Beta)</h1>
          <Eventslist />
        </div>
      </main>
    </div>
  );
}

export default AllSchedulePage;
