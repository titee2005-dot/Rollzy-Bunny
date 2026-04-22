// src/Navbar.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom"; 

const SECTION_IDS = ["home", "about", "schedule", "highlight", "social", "gallery", "rollzy"];
const HEADER_OFFSET = 80;

function Navbar() {
  const location = useLocation(); 
  const isHome = location.pathname === "/";
  const isToken = location.pathname === "/tokens"; 

  const [open, setOpen] = useState(false);
  
  // แยกสถานะการชี้ (Hover) กับการกดค้าง (Pin)
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  
  // เมนูจะแสดงก็ต่อเมื่อ กำลังชี้อยู่ หรือ กดล็อกเอาไว้
  const showSpecial = isHovered || isPinned;

  const [activeId, setActiveId] = useState(isToken ? "token" : "home");

  const dropdownRef = useRef(null);
  const hoverTimeoutRef = useRef(null); 

  const toggleMenu = () => setOpen((o) => !o);
  const closeMenu = () => setOpen(false);

  // ฟังก์ชันเวลาคลิกลิงก์ข้างในเมนูย่อย ให้ปิดทุกอย่าง
  const handleSpecialLinkClick = () => {
    closeMenu();
    setIsPinned(false);
    setIsHovered(false);
  };

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

  // --- จัดการเรื่องชี้เมาส์ (Hover) ---
  const handleMouseEnter = () => {
    if (window.innerWidth > 720) {
      clearTimeout(hoverTimeoutRef.current);
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth > 720) {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovered(false);
      }, 250); 
    }
  };

  // --- จัดการคลิกที่อื่นเพื่อปลดล็อก (Click Outside) ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsPinned(false);
        setIsHovered(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (location.pathname === "/tokens") { setActiveId("token"); return; }
    if (location.pathname === "/merch") { setActiveId("merch"); return; }
    if (location.pathname === "/dance-challenge") { setActiveId("dance"); return; }
    if (location.pathname === "/donation") { setActiveId("donation"); return; }

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
  }, [location.pathname, isHome]); 

  const linkClass = (id) =>
    activeId === id ? "nav-link--active" : "";

  return (
    <>
      <style>
        {`
          .nav-dropdown {
            position: relative;
            display: inline-flex;
            align-items: center;
          }
          .nav-link-btn {
            white-space: nowrap;
            font-size: 0.8rem;
            padding: 6px 10px;
            border-radius: 999px;
            color: var(--text-soft);
            text-decoration: none;
            background: rgba(255, 255, 255, 0.95);
            border: 1px solid transparent;
            transition: all 0.15s ease-out;
            cursor: pointer;
            font-family: inherit;
            outline: none;
          }
          .nav-link-btn:hover {
            color: var(--text-main);
            border-color: rgba(197, 116, 255, 0.5);
          }
          /* ค้างสีม่วงไว้ตอนที่เมนูเปิดอยู่ */
          .nav-link-btn.dropdown-open {
            color: var(--text-main);
            border-color: rgba(197, 116, 255, 0.5);
            background: rgba(197, 116, 255, 0.05);
          }
          .nav-link-btn.nav-link--active {
            color: var(--text-main);
            background: rgba(197, 116, 255, 0.14);
            border-color: rgba(197, 116, 255, 0.6);
          }
          
          .nav-dropdown-menu {
            position: absolute;
            top: calc(100% + 5px);
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 255, 255, 0.98);
            border: 1px solid rgba(197, 116, 255, 0.3);
            border-radius: 14px;
            padding: 8px;
            display: flex;
            flex-direction: column;
            gap: 4px;
            box-shadow: 0 10px 30px rgba(132, 107, 196, 0.18);
            z-index: 1000;
            min-width: 160px;
            animation: dropdownFadeIn 0.2s ease-out forwards;
          }

          /* สร้างสะพานล่องหนเชื่อมปุ่มกับเมนู */
          .nav-dropdown-menu::before {
            content: '';
            position: absolute;
            top: -15px; 
            left: 0;
            right: 0;
            height: 15px;
          }
          
          @keyframes dropdownFadeIn {
            from { opacity: 0; transform: translate(-50%, -10px); }
            to { opacity: 1; transform: translate(-50%, 0); }
          }
          
          .nav-dropdown-menu a {
            padding: 10px 14px !important;
            border-radius: 8px !important;
            white-space: nowrap;
            background: transparent !important;
            border: none !important;
            color: var(--text-main) !important;
            text-align: left;
            transition: all 0.15s ease;
          }
          .nav-dropdown-menu a:hover, .nav-dropdown-menu a.active-sub {
            background: rgba(197, 116, 255, 0.1) !important;
            color: var(--accent) !important;
          }

          @media (max-width: 720px) {
            /* 1. จัดปุ่ม Special ให้อยู่ตรงกลางและบังคับเรียงลงด้านล่าง */
            .nav-dropdown {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 8px;
              width: 100%;
            }
            
            /* 2. ทำให้เมนูย่อยเป็น "กล่องแยก" ออกมาอย่างชัดเจน */
            .nav-dropdown-menu {
              position: static;
              transform: none;
              flex-direction: column;
              width: 85%; /* ให้กล่องเล็กกว่าเมนูหลักนิดนึง จะได้ดูเป็นเมนูย่อย */
              padding: 10px;
              gap: 6px;
              background: rgba(197, 116, 255, 0.08); /* พื้นหลังกล่องสีม่วงอ่อนๆ */
              border: 1px solid rgba(197, 116, 255, 0.3); /* เส้นขอบกล่อง */
              border-radius: 14px; /* ขอบกล่องโค้งมน */
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); /* เพิ่มเงาบางๆ */
              animation: none;
            }
            
            /* ซ่อนสะพานเชื่อมเพราะไม่ได้ใช้บนมือถือ */
            .nav-dropdown-menu::before {
              display: none;
            }
            
            /* 3. ปรับดีไซน์ปุ่มลิงก์ข้างในกล่องให้กดง่ายและสวยงาม */
            .nav-dropdown-menu a {
              background: rgba(255, 255, 255, 0.95) !important;
              border: 1px solid transparent !important;
              color: var(--text-main) !important;
              border-radius: 10px !important;
              padding: 12px 10px !important; /* เพิ่มพื้นที่ให้ใช้นิ้วกดง่ายขึ้น */
              font-size: 0.85rem;
              text-align: center;
              display: block;
              width: 100%; /* ปุ่มกว้างเต็มกล่องย่อย */
            }
            
            .nav-dropdown-menu a:hover, .nav-dropdown-menu a.active-sub {
              color: var(--text-main) !important;
              border-color: rgba(197, 116, 255, 0.6) !important;
              background: rgba(197, 116, 255, 0.15) !important;
            }
          }
        `}
      </style>

      <header className="nav-wrapper">
        <nav className="nav">
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
            
            <Link to="/tokens" onClick={closeMenu} className={linkClass("token")}>
              Tokens
            </Link>

            {/* กล่องควบคุมเมนู Special */}
            <div 
              className="nav-dropdown" 
              ref={dropdownRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                className={`nav-link-btn ${['merch'/*, 'dance', 'donation'*/].includes(activeId) ? 'nav-link--active' : ''} ${showSpecial ? 'dropdown-open' : ''}`}
                onClick={(e) => { 
                  e.preventDefault(); 
                  // พอกดปุ่ม ให้สลับการล็อก (Pin)
                  setIsPinned(!isPinned);
                }}
              >
                Special {showSpecial ? '▴' : '▾'}
              </button>

              {showSpecial && (
                <div className="nav-dropdown-menu">
                  <Link to="/merch" onClick={handleSpecialLinkClick} className={activeId === 'merch' ? 'active-sub' : ''}>Merch</Link>
                 
                </div>
              )}
            </div>
            
          </div>
        </nav>
      </header>
    </>
  );
}

export default Navbar;