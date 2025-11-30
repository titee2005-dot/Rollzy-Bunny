// src/Navbar.jsx
import { useState, useEffect } from "react";

const SECTION_IDS = ["home", "about", "schedule", "highlight", "social", "rollzy"];
const HEADER_OFFSET = 80; // ถ้ากดแล้วรู้สึกเลย/เตี้ยไป ปรับเลขนี้ได้

function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState("home");

  const toggleMenu = () => setOpen((o) => !o);
  const closeMenu = () => setOpen(false);

  // เลื่อนไป section แบบเผื่อความสูง navbar
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    const targetY = rect.top + scrollTop - HEADER_OFFSET;

    window.scrollTo({
      top: targetY,
      behavior: "smooth",
    });
  };

  const handleNavClick = (id) => (e) => {
    e.preventDefault();       // กันไม่ให้เบราว์เซอร์เลื่อนเอง (ซึ่งไม่เผื่อ navbar)
    scrollToSection(id);
    closeMenu();
  };

  // ให้ navbar รู้ว่าเรากำลังอยู่ section ไหน (สำหรับ highlight)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let mostVisible = null;

        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (!mostVisible || entry.intersectionRatio > mostVisible.intersectionRatio) {
            mostVisible = entry;
          }
        });

        if (mostVisible?.target?.id) {
          setActiveId(mostVisible.target.id);
        }
      },
      {
        root: null,
        threshold: 0.4,                       // ต้องเห็น 40% ของ section ถึงจะนับว่า active
        rootMargin: `-${HEADER_OFFSET}px 0px 0px 0px`, // ตัดส่วนที่โดน navbar บังออก
      }
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const linkClass = (id) =>
    activeId === id ? "nav-link--active" : "";

  return (
    <header className="nav-wrapper">
      <nav className="nav">
        <div className="nav-main">
          {/* โลโก้ + ชื่อ */}
          <div className="nav-logo">
            {/* เอาไฟล์โลโก้ไปวางไว้ที่ public/rosegarden-logo.png หรือชื่ออื่นแล้วแก้ src ให้ตรง */}
            <img
              src="/logo.png"
              alt="Rose's Garden Logo"
              className="nav-logo-img"
            />
            <span>ROSE&apos;S GARDEN</span>
          </div>

          {/* ปุ่ม 3 ขีด */}
          <button
            type="button"
            className="nav-toggle"
            onClick={toggleMenu}
            aria-label="Toggle navigation"
          >
            <span className="nav-toggle-lines">
              <span className="nav-toggle-line" />
              <span className="nav-toggle-line" />
              <span className="nav-toggle-line" />
            </span>
          </button>
        </div>

        {/* ลิงก์เมนู */}
        <div className={`nav-links ${open ? "nav-links--open" : ""}`}>
          <a
            href="/#home"
            onClick={handleNavClick("home")}
            className={linkClass("home")}
          >
            Home
          </a>
          <a
            href="/#about"
            onClick={handleNavClick("about")}
            className={linkClass("about")}
          >
            About Rose
          </a>
          <a
            href="/#schedule"
            onClick={handleNavClick("schedule")}
            className={linkClass("schedule")}
          >
            Schedule
          </a>
          <a
            href="/#highlight"         /* สำคัญ: id จริงของ section นี้คือ highlight */
            onClick={handleNavClick("highlight")}
            className={linkClass("highlight")}
          >
            Highlight
          </a>
          <a
            href="/#social"
            onClick={handleNavClick("social")}
            className={linkClass("social")}
          >
            Social Media
          </a>
          <a
            href="/#rollzy"
            onClick={handleNavClick("rollzy")}
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
