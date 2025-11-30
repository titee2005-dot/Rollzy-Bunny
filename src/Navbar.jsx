// src/Navbar.jsx
import { useEffect, useState } from "react";

const SECTION_IDS = ["home", "about", "schedule", "highlight", "social", "rollzy"];

function Navbar() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    // ถ้าเปลี่ยน hash จากลิงก์ เช่น /#about ให้ active ตาม hash
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (SECTION_IDS.includes(hash)) {
        setActive(hash);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange(); // เช็กครั้งแรกตอนโหลด

    // ใช้ IntersectionObserver ตาม section ที่อยู่กลางหน้าจอ
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (SECTION_IDS.includes(id)) {
              setActive(id);
            }
          }
        });
      },
      {
        root: null,
        // ขอบเขตให้ส่วนที่อยู่แถวกลางจอถือว่า "active"
        rootMargin: "-45% 0px -45% 0px",
        threshold: 0,
      }
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      observer.disconnect();
    };
  }, []);

  const linkClass = (id) =>
    "nav-link" + (active === id ? " nav-link--active" : "");

  return (
    <header className="nav-wrapper">
      <nav className="nav">
        <div className="nav-logo">Rose&apos;s Garden</div>
        <div className="nav-links">
          <a href="/#home" className={linkClass("home")}>
            Home
          </a>
          <a href="/#about" className={linkClass("about")}>
            About Rose
          </a>
          <a href="/#schedule" className={linkClass("schedule")}>
            Schedule
          </a>
          <a href="/#highlight" className={linkClass("highlight")}>
            Highlight
          </a>
          <a href="/#social" className={linkClass("social")}>
            Social Media
          </a>
          <a href="/#rollzy" className={linkClass("rollzy")}>
            Rollzy Bunny
          </a>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
