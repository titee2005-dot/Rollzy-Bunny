// src/Navbar.jsx
import { useState, useEffect } from "react";

function Navbar() {
  const [open, setOpen] = useState(false);

  // ถ้าหน้าจอกลับไปเป็นจอใหญ่ ให้ปิดเมนูมือถือ
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 720 && open) {
        setOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [open]);

  const toggleMenu = () => setOpen(!open);
  const closeMenu = () => setOpen(false);

  return (
    <header className="nav-wrapper">
      <nav className="nav">
        {/* โลโก้ + ปุ่ม 3 ขีด */}
        <div className="nav-main">
          <div className="nav-logo">Rose&apos;s Garden</div>

          <button
            type="button"
            className={`nav-toggle ${open ? "nav-toggle--open" : ""}`}
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

        {/* ลิสต์เมนู */}
        <div className={`nav-links ${open ? "nav-links--open" : ""}`}>
          <a href="/#home" onClick={closeMenu}>
            Home
          </a>
          <a href="/#about" onClick={closeMenu}>
            About Rose
          </a>
          <a href="/#schedule" onClick={closeMenu}>
            Schedule
          </a>
          <a href="/#discography" onClick={closeMenu}>
            Highlight
          </a>
          <a href="/#social" onClick={closeMenu}>
            Social Media
          </a>
          <a href="/#rollzy" onClick={closeMenu}>
            Rollzy Bunny
          </a>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
