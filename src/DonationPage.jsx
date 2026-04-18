// src/DonationPage.jsx
import { useEffect, useState } from "react";
import Navbar from "./Navbar.jsx";

// ================= CONFIGURATION =================
// 1. วันที่ "ปิด" รับบริจาค (YYYY-MM-DDTHH:mm:ss)
const END_DATE = new Date("2026-04-15T12:00:00").getTime(); 

// 2. Google Sheet ID สำหรับดึงยอดเงิน
const SHEET_ID = "ใส่_SHEET_ID_ของคุณที่นี่"; 
const TAB_NAME = "Form Responses 1"; 

// 3. รายละเอียดโครงการ
const PROJECT_DETAILS = {
  title: "ยอดบริจาคโปรเจกต์ร่วมทำบุญ",
  description: "ร่วมเป็นส่วนหนึ่งในโปรเจกต์ทำบุญและจัดทำป้ายแสดงความยินดี เพื่อเฉลิมฉลองตำแหน่งเซนเตอร์ของน้องโรส",
  link: "https://facebook.com/rollzybunny",
  formLink: "ใส่ลิงก์ฟอร์มรับโดเนทตรงนี้" 
};
// =================================================

function DonationPage() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isClosed, setIsClosed] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  // 1. ระบบ Countdown ถอยหลังถึงวันปิดรับ
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = END_DATE - now;

      if (distance < 0) {
        clearInterval(timer);
        setIsClosed(true); 
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. ดึงยอดเงินเรียลไทม์
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await fetch(`https://opensheet.elk.sh/${SHEET_ID}/${TAB_NAME}`);
        const data = await res.json();
        const total = data.reduce((sum, row) => sum + Number(row["จำนวนเงิน"] || 0), 0);
        setTotalAmount(total);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    
    fetchDonations();
    const interval = setInterval(fetchDonations, 10000);
    return () => clearInterval(interval);
  }, []);

  // ตรรกะป้ายสถานะ
  const projectStatusText = isClosed ? "ปิดรับโดเนทแล้ว" : "อยู่ระหว่างการเปิดรับโดเนท";
  const projectStatusColor = isClosed 
    ? { bg: "#fef2f2", text: "#ef4444", border: "#fecaca", dot: "#ef4444" } 
    : { bg: "#ecfdf5", text: "#10b981", border: "#a7f3d0", dot: "#10b981" };

  return (
    <div className="app-root" style={{ background: "#fcfaff", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      
      <style>
        {`
          @keyframes pulse-dot { 
            0% { transform: scale(0.8); opacity: 0.5; } 
            50% { transform: scale(1.2); opacity: 1; } 
            100% { transform: scale(0.8); opacity: 0.5; } 
          }
          @keyframes bounce-arrow {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
          }
          /* ซ่อน scrollbar เวลาจอเล็กแล้วปุ่มเรียงแนวนอนล้น */
          .countdown-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: stretch;
            gap: 16px;
          }
          /* ขนาดตัวเลข ปรับลดลงอัตโนมัติบนมือถือไม่ให้ล้นจอ */
          .amount-number {
            font-size: clamp(80px, 15vw, 150px);
            font-family: "Bebas Neue", sans-serif;
            background: linear-gradient(135deg, #a78bfa, #8b5cf6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            line-height: 1;
            padding-bottom: 10px;
          }
        `}
      </style>

      {/* พื้นหลังตกแต่ง (Soft Gradient) */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, background: "radial-gradient(circle at 50% 0%, #fbf5ff 0%, #fcfaff 60%)", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "50vw", height: "50vw", background: "rgba(248, 182, 232, 0.2)", filter: "blur(100px)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", top: "20%", right: "-10%", width: "40vw", height: "40vw", background: "rgba(197, 116, 255, 0.15)", filter: "blur(100px)", borderRadius: "50%" }} />
      </div>

      {/* =========================================
          ส่วนที่ 1 : หน้าจอหลัก (Full Screen 100vh - เห็นแค่ยอดเงิน) 
          ========================================= */}
      <section style={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 1, paddingTop: "60px" }}>
        <div style={{ animation: "heroFadeInUp 0.6s ease-out", width: "100%", maxWidth: "800px", textAlign: "center", margin: "0 auto", padding: "0 20px" }}>
          
          {/* Header ด้านบน */}
          <header style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "clamp(26px, 5vw, 42px)", fontFamily: '"Mitr", sans-serif', fontWeight: "600", color: "#2c2537", margin: "0", letterSpacing: "0.02em" }}>
              {PROJECT_DETAILS.title}
            </h2>
          </header>

          {/* ป้ายสถานะสีเขียวมินิมอล */}
          <div style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: "8px", 
            background: projectStatusColor.bg, 
            color: projectStatusColor.text, 
            border: `1px solid ${projectStatusColor.border}`,
            padding: "8px 24px", 
            borderRadius: "999px", 
            fontSize: "14px", 
            fontWeight: "600", 
            fontFamily: '"Mitr", sans-serif',
            marginBottom: "24px"
          }}>
            {!isClosed && <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: projectStatusColor.dot, animation: "pulse-dot 2s infinite" }}></span>}
            {projectStatusText}
          </div>
          
          {/* ยอดเงินตรงกลาง (ใหญ่ตะโกน) */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "baseline", gap: "12px" }}>
            <span className="amount-number">
              {totalAmount.toLocaleString()}
            </span>
            <span style={{ fontSize: "clamp(30px, 6vw, 48px)", fontFamily: '"Mitr", sans-serif', color: "#a78bfa", fontWeight: "500" }}>
              ฿
            </span>
          </div>

        </div>

        {/* ลูกศรเลื่อนลง (Scroll Indicator) */}
        <div style={{ position: "absolute", bottom: "40px", left: "0", right: "0", display: "flex", flexDirection: "column", alignItems: "center", opacity: 0.6, animation: "heroFadeInUp 1s ease-out forwards 0.8s" }}>
          <span style={{ fontSize: "12px", fontFamily: '"Mitr", sans-serif', color: "#8a7b9e", marginBottom: "8px", letterSpacing: "0.05em" }}>SCROLL DOWN</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "bounce-arrow 2s infinite" }}>
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </section>

      {/* =========================================
          ส่วนที่ 2 : เลื่อนลงมาเจอเวลาและปุ่ม (Scroll View)
          ========================================= */}
      <section style={{ padding: "60px 20px 80px", display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 1 }}>
        
        {/* กล่องเวลานับถอยหลัง */}
        <div className="countdown-container" style={{ marginBottom: "40px", animation: "heroFadeInUp 0.8s ease-out" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            {[
              { v: timeLeft.days, l: "วัน" },
              { v: timeLeft.hours, l: "ชม." },
              { v: timeLeft.minutes, l: "นาที" },
              { v: timeLeft.seconds, l: "วิ" }
            ].map((t, i) => (
              <div key={i} style={{ 
                background: "#ffd1e3", 
                padding: "18px 14px", 
                borderRadius: "16px", 
                minWidth: "85px", 
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 6px 16px rgba(255, 209, 227, 0.5)"
              }}>
                <div style={{ fontSize: "36px", fontFamily: '"Bebas Neue", sans-serif', fontWeight: "bold", color: "#004b87", lineHeight: "1" }}>
                  {t.v}
                </div>
                <div style={{ fontSize: "14px", fontFamily: '"Mitr", sans-serif', fontWeight: "500", color: "#004b87", marginTop: "6px" }}>
                  {t.l}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ปุ่มโดเนท */}
        {!isClosed && (
          <div style={{ animation: "heroFadeInUp 1s ease-out" }}>
            <a 
              href={PROJECT_DETAILS.formLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ 
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "18px 56px",
                background: "linear-gradient(135deg, #c574ff, #8ce4c6)",
                color: "#ffffff",
                borderRadius: "999px",
                textDecoration: "none",
                boxShadow: "0 10px 24px rgba(197, 116, 255, 0.3)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                fontSize: "18px", 
                fontWeight: "600", 
                fontFamily: '"Mitr", sans-serif',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 14px 30px rgba(197, 116, 255, 0.45)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 24px rgba(197, 116, 255, 0.3)";
              }}
            >
              ร่วมโดเนทคลิก ✦
            </a>
          </div>
        )}

        {/* 📦 รายละเอียดโครงการ */}
        <div style={{ 
          maxWidth: "800px", 
          width: "100%",
          margin: "60px auto 0", 
          background: "rgba(255,255,255,0.7)", 
          borderRadius: "24px", 
          padding: "32px", 
          border: "1px solid #eadeff", 
          textAlign: "center",
          backdropFilter: "blur(10px)"
        }}>
          <p style={{ fontFamily: '"Mitr", sans-serif', fontSize: "15px", color: "#475569", margin: "0 0 12px 0", lineHeight: "1.6" }}>
            📍 {PROJECT_DETAILS.description}
          </p>
          <a href={PROJECT_DETAILS.link} target="_blank" rel="noreferrer" style={{ 
            display: "inline-block", 
            color: "#8b5cf6", 
            fontWeight: "600", 
            fontSize: "14px", 
            fontFamily: '"Mitr", sans-serif', 
            textDecoration: "underline", 
            textUnderlineOffset: "4px" 
          }}>
            อ่านรายละเอียดฉบับเต็ม ↗
          </a>
        </div>

      </section>

      {/* Footer */}
      <footer className="footer" style={{ padding: "12px 0", fontSize: "12px", position: "relative", zIndex: 1 }}>
        <p className="footer-line1" style={{ margin: "2px 0" }}>-`♡´- Fansite Project made by RollzyBunny</p>
        <p className="footer-line2" style={{ margin: "0" }}>Original Content & Artist © by Independent Artist Management (iAM).</p>
      </footer>
    </div>
  );
}

export default DonationPage;