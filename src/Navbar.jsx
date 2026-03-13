// src/Navbar.jsx
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom"; // 👈 เพิ่ม useLocation

const SECTION_IDS = ["home", "about", "schedule", "highlight", "social", "gallery", "rollzy"];
const HEADER_OFFSET = 80;

function Navbar() {
  const location = useLocation(); // 👈 ดึงข้อมูล path ปัจจุบันจาก React Router
  const isHome = location.pathname === "/";
  const isToken = location.pathname === "/tokens"; // 👈 เพิ่มตัวเช็กว่าอยู่หน้า tokens ไหม

  const [open, setOpen] = useState(false);
  
  // 👈 ปรับค่าเริ่มต้น: ถ้าเข้าหน้า /tokens ให้ highlight "token" ทันที ถ้าไม่ใช่ค่อยไป "home"
  const [activeId, setActiveId] = useState(isToken ? "token" : "home");

  const toggleMenu = () => setOpen((o) => !o);
  const closeMenu = () => setOpen(false);

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
    if (!isHome) {
      closeMenu();
      return;
    }

    e.preventDefault();
    scrollToSection(id);
    closeMenu();
  };

  useEffect(() => {
    // 👈 อัปเดตค่า activeId เสมอเมื่อ URL เปลี่ยนแปลง (สำคัญมากถ้าใช้ React Router แบบไม่โหลดหน้าใหม่)
    if (location.pathname === "/tokens") {
      setActiveId("token");
      return; // 👈 ถ้าอยู่หน้า tokens ให้ออกจาก useEffect เลย ไม่ต้องรัน Observer ดัก scroll
    }
    if (location.pathname === "/merch") {
      setActiveId("merch");
      return; 
    }

    // ถ้าไม่ได้อยู่หน้า Home ก็ไม่ต้องดักจับ Scroll
    if (!isHome) return; 

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
        threshold: 0.4,
        rootMargin: `-${HEADER_OFFSET}px 0px 0px 0px`,
      }
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [location.pathname, isHome]); // 👈 เพิ่ม dependency ให้ useEffect ทำงานใหม่เมื่อเปลี่ยน URL

  const linkClass = (id) =>
    activeId === id ? "nav-link--active" : "";

  return (
    <header className="nav-wrapper">
      <nav className="nav">
        {/* ... (ส่วนโลโก้และปุ่ม toggle เหมือนเดิมไม่เปลี่ยนแปลง) ... */}
        <div className="nav-main">
          <div className="nav-logo">
            <img src="/logo.png" alt="Rose's Garden Logo" className="nav-logo-img" />
            <span>ROSE&apos;S GARDEN</span>
          </div>

          <button type="button" className="nav-toggle" onClick={toggleMenu} aria-label="Toggle navigation">
            <span className="nav-toggle-lines">
              <span className="nav-toggle-line" />
              <span className="nav-toggle-line" />
              <span className="nav-toggle-line" />
            </span>
          </button>
        </div>

        <div className={`nav-links ${open ? "nav-links--open" : ""}`}>
          <a href="/#home" onClick={handleNavClick("home")} className={linkClass("home")}>Home</a>
          <a href="/#about" onClick={handleNavClick("about")} className={linkClass("about")}>About Rose</a>
          <a href="/#schedule" onClick={handleNavClick("schedule")} className={linkClass("schedule")}>Schedule</a>
          <a href="/#highlight" onClick={handleNavClick("highlight")} className={linkClass("highlight")}>Highlight</a>
          <a href="/#social" onClick={handleNavClick("social")} className={linkClass("social")}>Social Media</a>
          <a href="/#gallery" onClick={handleNavClick("gallery")} className={linkClass("gallery")}>Gallery</a>
          <a href="/#rollzy" onClick={handleNavClick("rollzy")} className={linkClass("rollzy")}>Rollzy Bunny</a>
          
          
          {/* ลิงก์ไปหน้า Tokens */}
          <Link to="/tokens" onClick={closeMenu} className={linkClass("token")}>
            Tokens
          </Link>
          <Link to="/merch" onClick={closeMenu} className={linkClass("merch")}>
            Special Merch
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;