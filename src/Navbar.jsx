// src/Navbar.jsx
import { useEffect, useState } from "react";

// id ของแต่ละ section บนหน้า
const SECTION_IDS = ["home", "about", "schedule", "discography", "social", "rollzy"];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    // เวลา hash ใน URL เปลี่ยน (เช่น /#about) ให้ active ตาม
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (SECTION_IDS.includes(hash)) {
        setActiveSection(hash);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange(); // เช็กตอนโหลดครั้งแรก

    // ใช้ IntersectionObserver ดูว่า section ไหนอยู่กลางจอ → ให้ active ตัวนั้น
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (SECTION_IDS.includes(id)) {
              setActiveSection(id);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: "-50% 0px -50% 0px", // โซนกลางหน้าจอ
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

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  const linkClass = (id) =>
    "nav-link" + (activeSection === id ? " nav-link--active" : "");

  return (
    <header className="nav-wrapper">
      <nav className="nav">
        {/* แถวบน: โลโก้ + ชื่อ + ปุ่มสามขีด */}
        <div className="nav-main">
          <div className="nav-brand">
            {/* ตรง src เปลี่ยนเป็นโลโก้ที่คุณใช้จริงได้เลย */}
            <img
              src="/rose-logo.png"
              alt="Rose logo"
              className="nav-logo-image"
            />
            <span className="nav-logo-text">Rose&apos;s Garden</span>
          </div>

          <button
  type="button"
  className={`nav-toggle ${menuOpen ? "nav-toggle--open" : ""}`}
  onClick={toggleMenu}
>
  <span className="nav-toggle-line"></span>
  <span className="nav-toggle-line"></span>
  <span className="nav-toggle-line"></span>
</button>
        </div>

        {/* เมนู – เดสก์ท็อปโชว์ตลอด / มือถือโชว์ตอน menuOpen = true */}
        <div className={`nav-links ${menuOpen ? "nav-links--open" : ""}`}>
          <a href="/#home" className={linkClass("home")} onClick={closeMenu}>
            Home
          </a>
          <a href="/#about" className={linkClass("about")} onClick={closeMenu}>
            About Rose
          </a>
          <a
            href="/#schedule"
            className={linkClass("schedule")}
            onClick={closeMenu}
          >
            Schedule
          </a>
          <a
            href="/#discography"
            className={linkClass("discography")}
            onClick={closeMenu}
          >
            Highlight
          </a>
          <a href="/#social" className={linkClass("social")} onClick={closeMenu}>
            Social Media
          </a>
          <a href="/#rollzy" className={linkClass("rollzy")} onClick={closeMenu}>
            Rollzy Bunny
          </a>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
