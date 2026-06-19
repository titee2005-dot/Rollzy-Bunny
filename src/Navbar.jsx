// src/Navbar.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom"; 

const SECTION_IDS = ["home", "about", "schedule", "discography", "highlight", "social", "gallery", "rollzy"];
const HEADER_OFFSET = 80;

function Navbar() {
  const location = useLocation(); 
  const isHome = location.pathname === "/";
  const isToken = location.pathname === "/tokens"; 

  const [open, setOpen] = useState(false);
  
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const showSpecial = isHovered || isPinned;

  const [activeId, setActiveId] = useState(isToken ? "token" : "home");

  const dropdownRef = useRef(null);
  const hoverTimeoutRef = useRef(null); 
  
  // 🌟 เพิ่มตัวแปรสำหรับล็อกไม่ให้เมนูเปลี่ยนสีมั่วตอนกำลังกดสไลด์
  const isClickScrolling = useRef(false);
  const scrollTimeoutRef = useRef(null);

  const toggleMenu = () => setOpen((o) => !o);
  const closeMenu = () => setOpen(false);

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
    
    // 1. เปิดระบบล็อก: สั่งให้ Scroll Listener หยุดทำงานชั่วคราว
    isClickScrolling.current = true;
    
    // 2. ไฮไลท์สีที่ปุ่มเป้าหมายทันที
    setActiveId(id);

    // 3. สไลด์หน้าจอไปที่เป้าหมาย
    scrollToSection(id);
    closeMenu();

    // 4. ตั้งเวลาปลดล็อก: หลังจากสไลด์เสร็จ (ประมาณ 800 มิลลิวินาที) ให้กลับมาจับตำแหน่งตามปกติ
    clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      isClickScrolling.current = false;
    }, 800);
  };

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

    const handleScroll = () => {
      // 🌟 ถ้ากำลังสไลด์หน้าจอจากการกดปุ่ม ให้ข้ามการคำนวณไปเลย (แก้ปัญหาสีแวบๆ)
      if (isClickScrolling.current) return;

      const scrollPosition = window.scrollY + HEADER_OFFSET + 200; 
      let currentSection = "home";

      SECTION_IDS.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPosition) {
          currentSection = id; 
        }
      });

      if ((window.innerHeight + Math.round(window.scrollY)) >= document.body.offsetHeight - 50) {
        currentSection = SECTION_IDS[SECTION_IDS.length - 1]; 
      }

      setActiveId(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); 

    return () => window.removeEventListener("scroll", handleScroll);
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
            .nav-dropdown {
              display: flex;
              flex-direction: row;
              align-items: center;
              gap: 6px;
            }
            .nav-dropdown-menu {
              position: static;
              transform: none;
              flex-direction: row;
              box-shadow: none;
              border: none;
              background: transparent;
              padding: 0;
              min-width: auto;
              animation: none;
              gap: 6px;
            }
            .nav-dropdown-menu::before {
              display: none;
            }
            .nav-dropdown-menu a {
              background: rgba(255, 255, 255, 0.95) !important;
              border: 1px solid transparent !important;
              color: var(--text-soft) !important;
              border-radius: 999px !important;
              padding: 6px 10px !important;
              font-size: 0.8rem;
            }
            .nav-dropdown-menu a:hover, .nav-dropdown-menu a.active-sub {
              color: var(--text-main) !important;
              border-color: rgba(197, 116, 255, 0.6) !important;
              background: rgba(197, 116, 255, 0.14) !important;
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
            <a href="/#discography" onClick={handleNavClick("discography")} className={linkClass("discography")}>Discography</a>
            <a href="/#highlight" onClick={handleNavClick("highlight")} className={linkClass("highlight")}>Highlight</a>
            <a href="/#social" onClick={handleNavClick("social")} className={linkClass("social")}>Social Media</a>
            <a href="/#gallery" onClick={handleNavClick("gallery")} className={linkClass("gallery")}>Gallery</a>
            <a href="/#rollzy" onClick={handleNavClick("rollzy")} className={linkClass("rollzy")}>Rollzy Bunny</a>
            
            <Link to="/tokens" onClick={closeMenu} className={linkClass("token")}>
              Tokens
            </Link>

            <div 
              className="nav-dropdown" 
              ref={dropdownRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                className={`nav-link-btn ${['merch'].includes(activeId) ? 'nav-link--active' : ''} ${showSpecial ? 'dropdown-open' : ''}`}
                onClick={(e) => { 
                  e.preventDefault(); 
                  setIsPinned(!isPinned);
                }}
              >
                Special {showSpecial ? '▴' : '▾'}
              </button>

           {/*   {showSpecial && (
                <div className="nav-dropdown-menu">
                  <Link to="/merch" onClick={handleSpecialLinkClick} className={activeId === 'merch' ? 'active-sub' : ''}>Merch</Link>
                </div>
              )} */}
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

export default Navbar;