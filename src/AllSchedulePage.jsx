// src/AllSchedulePage.jsx
import { useEffect } from "react";
import Navbar from "./Navbar.jsx";
import Eventslist from "./Eventslist.jsx";

function AllSchedulePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll(".section-reveal");

    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="app-root">
      <Navbar />
      <main className="page-section page-section--tone2 all-schedule-page">
        <div className="page-section-inner section-reveal">
        {/* <h1 style={{ marginBottom: "16px" }}>All Schedule (Beta)</h1> */}
          <Eventslist />
        </div>
      </main>
      {/* Footer แบบเดียวกับหน้า Home */}
      <footer className="footer">
        <p2>-`♡´- Fansite Project made by RollzyBunny</p2>
        <p>
          Original Content & Artist © by Independent Artist Management (iAM).
        </p>
      </footer>
    </div>
  );
}

export default AllSchedulePage;
