// src/Navbar.jsx
import { useState, useEffect } from "react";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState("home");

  const toggleMenu = () => setOpen(!open);
  const closeMenu = () => setOpen(false);

  // ทำ scroll spy ให้รู้ว่าอยู่ section ไหน
  useEffect(() => {
    const sectionIds = ["home", "about", "schedule", "discography", "social", "rollzy"];
    const OFFSET = 80; // เผื่อความสูง navbar

    const handleScroll = () => {
      let current = "home";

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        // ถ้าด้านบนของ section เลย navbar ขึ้นไปนิด และยังไม่หลุดล่างจอ
        if (rect.top <= OFFSET && rect.bottom > OFFSET) {
          current = id;
          break;
        }
      }

      setActiveId(current);
    };

    // เช็กครั้งแรกตอนโหลด
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const linkClass = (id) =>
    activeId === id ? "nav-link--active" : "";

  return (
    <header className="nav-wrapper">
      <nav className="nav">
        <div className="nav-main">
          {/* โลโก้ + ชื่อ ROSE GARDEN */}
          <div className="nav-logo">
            {/* เปลี่ยน path รูปตามที่เราใช้จริงใน public */}
            <img
              src="/logo.png"
              alt="Rose Garden Logo"
              className="nav-logo-img"
            />
            <span>ROSE'S GARDEN</span>
          </div>

          {/* ปุ่ม 3 ขีด */}
          <button
            type="button"
            className={`nav-toggle ${open ? "nav-toggle--open" : ""}`}
            onClick={toggleMenu}
          >
            <span className="nav-toggle-lines">
              <span className="nav-toggle-line" />
              <span className="nav-toggle-line" />
              <span className="nav-toggle-line" />
            </span>
          </button>
        </div>

        {/* เมนู ยาวแบบเดิม แต่บนมือถือจะซ่อน/แสดงตาม open */}
        <div className={`nav-links ${open ? "nav-links--open" : ""}`}>
          <a
            href="/#home"
            onClick={closeMenu}
            className={linkClass("home")}
          >
            Home
          </a>
          <a
            href="/#about"
            onClick={closeMenu}
            className={linkClass("about")}
          >
            About Rose
          </a>
          <a
            href="/#schedule"
            onClick={closeMenu}
            className={linkClass("schedule")}
          >
            Schedule
          </a>
          <a
            href="/#discography"
            onClick={closeMenu}
            className={linkClass("discography")}
          >
            Highlight
          </a>
          <a
            href="/#social"
            onClick={closeMenu}
            className={linkClass("social")}
          >
            Social Media
          </a>
          <a
            href="/#rollzy"
            onClick={closeMenu}
            className={linkClass("rollzy")}
          >
            Rollzy Bunny
          </a>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
