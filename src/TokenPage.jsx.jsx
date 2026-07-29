import { useEffect, useState, useRef } from "react";
import Navbar from "./Navbar.jsx"; 

// 🌟 1. กำหนดเวลาเปิดโหวต ปิดโหวต และสถานะ
const VOTING_START_DATE = "2026-10-01T12:00:00+07:00"; // ตั้งเวลาเปิดโหวตตรงนี้
const VOTING_END_DATE = "2026-11-12T21:00:00+07:00";   // ตั้งเวลาปิดโหวตตรงนี้

const IS_VOTING_ENDED = true; // แนะนำให้ตั้งเป็น false ไว้ เพื่อให้ปิดบังตัวเลขเป็น X 

// 🌟 2. วาง maskNumber ไว้ตรงนี้จุดเดียวเท่านั้น
const maskNumber = (num) => {
  const str = Number(num).toLocaleString(); 
  if (IS_VOTING_ENDED) return str; 
  if (str.length <= 1) return str;
  return str.replace(/[0-9]/g, 'X'); 
};

const PROJECT_CONFIG = {
  "SummerFest": {
    icon: "/SummerFest.jpg", 
    apiUrl: "https://opensheet.elk.sh/1pLkCTv-nlDK2t4zQmzLV50NX7bd87JHEOFSgK7E6L8w/StatusWeb", 
    searchLabel: "ระบุเลข IAM Wallet Code ของคุณ",
    placeholder: "0x1234abcd...",
    resultTitle: "Wallet ID",
    keyHint: ["wallet", "iam"] 
  },
  "Merch": { 
    icon: "/bnktoken.png", 
    apiUrl: "https://opensheet.elk.sh/1EmBLs1QoFC3nxamRZy4Op6gyOr4OAhyDHGB-o3a4rjA/StatusWeb", 
    searchLabel: "ระบุชื่อ-นามสกุล หรือ อีเมลของคุณ",
    placeholder: "เช่น โรซี่ บันนี่ หรือ rollzy@gmail.com",
    resultTitle: "ข้อมูลผู้จอง",
    keyHint: ["ชื่อ", "name", "order", "ออร์เดอร์"] 
  },
  "default": { 
    icon: "/billboard.jpg", 
    apiUrl: "https://opensheet.elk.sh/1pLkCTv-nlDK2t4zQmzLV50NX7bd87JHEOFSgK7E6L8w/StatusWeb",
    searchLabel: "ค้นหาข้อมูลของคุณ",
    placeholder: "กรอกข้อมูลเพื่อค้นหา...",
    resultTitle: "ผลการค้นหา",
    keyHint: ["wallet", "ชื่อ", "id"]
  }, 
  "Shared": { 
    icon: "/your-new-image.jpg", // ใส่ Path รูปภาพใหม่ที่ต้องการที่นี่
    apiUrl: "", 
    searchLabel: "",
    placeholder: "",
    resultTitle: "",
    keyHint: []
  }, 
  "2-Shot": { 
    icon: "/your-new-image.jpg", // ใส่ Path รูปภาพใหม่ที่ต้องการที่นี่
    apiUrl: "", 
    searchLabel: "",
    placeholder: "",
    resultTitle: "",
    keyHint: []
  }
};

// ==========================================
// 📖 กำหนดข้อมูลนิทาน Reward 10 ตอน
// ตอน 1-9: ปลดล็อคด้วย Token (เป้าหมาย 20,000)
// ตอน 10: ผลอันดับการโหวต (ปลดล็อคเมื่อถึงวันที่กำหนด)
// แก้ไข title, content, image ได้ตามต้องการ
// ==========================================
const STORY_CHAPTERS = [
  { chapter: 1, title: "ตอนที่ 1", content: "(รอเพิ่มเนื้อเรื่อง)", requiredTokens: 8000, emoji: "🌸", image: "", isComingSoon: true },
  { chapter: 2, title: "ตอนที่ 2", content: "(รอเพิ่มเนื้อเรื่อง)", requiredTokens: 8500, emoji: "🌿", image: "", isComingSoon: true },
  { chapter: 3, title: "ตอนที่ 3", content: "(รอเพิ่มเนื้อเรื่อง)", requiredTokens: 9000, emoji: "🦋", image: "", isComingSoon: true },
  { chapter: 4, title: "ตอนที่ 4", content: "(รอเพิ่มเนื้อเรื่อง)", requiredTokens: 9500, emoji: "⭐", image: "", isComingSoon: true },
  { chapter: 5, title: "ตอนที่ 5", content: "(รอเพิ่มเนื้อเรื่อง)", requiredTokens: 10000, emoji: "🌙", image: "", isComingSoon: true },
  { chapter: 6, title: "ตอนที่ 6", content: "(รอเพิ่มเนื้อเรื่อง)", requiredTokens: 10500, emoji: "🔮", image: "", isComingSoon: true },
  { chapter: 7, title: "ตอนที่ 7", content: "(รอเพิ่มเนื้อเรื่อง)", requiredTokens: 11000, emoji: "💫", image: "", isComingSoon: true },
  { chapter: 8, title: "ตอนที่ 8", content: "(รอเพิ่มเนื้อเรื่อง)", requiredTokens: 11500, emoji: "🌟", image: "", isComingSoon: true },
  { chapter: 9, title: "ตอนที่ 9", content: "(รอเพิ่มเนื้อเรื่อง)", requiredTokens: 12000, emoji: "✨", image: "", isComingSoon: true },
  { chapter: 10, title: "ผลอันดับการโหวต", content: "(รอเพิ่มผลอันดับ)", emoji: "🏆", image: "", isFinalRanking: true },
];

// ==========================================
// ฟังก์ชันเสริม: แปลงลิงก์รูปให้แสดงผลได้ 100%
// ==========================================
const getDirectImageLink = (url) => {
  if (!url) return "";
  
  const driveMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
  }
  
  return url; 
};

// ==========================================
// 1. Component ล้อหมุนตัวเลข (Odometer) - อัปเดตให้รองรับตัว X หมุน
// ==========================================
function Digit({ targetValue, trigger, digitIndex, forceSpin, isMasked }) {
  const [offset, setOffset] = useState(0);
  const duration = 1.0 + (digitIndex * 2.5); 
  const defaultTransition = `transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1)`;
  const [transition, setTransition] = useState(defaultTransition);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      setOffset(targetValue);
      return;
    }
    setOffset((prev) => {
      const currentDigit = prev % 10;
      if (currentDigit === targetValue && !forceSpin) return prev;
      let steps = targetValue - currentDigit;
      if (steps <= 0) steps += 10;
      return prev + steps;
    });
  }, [trigger, targetValue, forceSpin]);

  useEffect(() => {
    if (offset >= 10) {
      const timer = setTimeout(() => {
        setTransition("none");           
        setOffset(offset % 10);          
        setTimeout(() => {
          setTransition(defaultTransition);
        }, 50);
      }, duration * 1000); 
      return () => clearTimeout(timer);
    }
  }, [offset, duration, defaultTransition]);

  const digitsArray = Array.from({ length: 50 }, (_, i) => i % 10);

  return (
    <div style={{ display: "inline-block", height: "82px", width: "46px", overflow: "hidden", textAlign: "center", margin: "0 1px" }}>
      <div style={{ display: "block", transition: transition, transform: `translateY(-${offset * 82}px)` }}>
        {digitsArray.map((d, i) => (
          <div key={i} style={{ height: "82px", lineHeight: "82px", fontFamily: '"Bebas Neue", sans-serif', fontSize: "82px", fontWeight: "bold", background: "linear-gradient(135deg, var(--accent), var(--accent-mint))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {/* 🌟 ถ้าโดนซ่อน (isMasked) ให้แสดงเป็น X แทนตัวเลข */}
            {isMasked ? "X" : d}
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 2. Component หั่นตัวเลขเป็นหลักๆ - แก้ไขให้ฐานตรงกัน
// ==========================================
function NumberTicker({ value }) {
  const stringValue = value.toLocaleString(); 
  const chars = stringValue.split("");
  const length = chars.length;
  const prevValueRef = useRef(value);
  const diff = Math.abs(value - prevValueRef.current);

  useEffect(() => {
    prevValueRef.current = value;
  }, [value]);

  const elements = [];
  let currentDigitIndex = 0; 

  for (let i = length - 1; i >= 0; i--) {
    const char = chars[i];
    const stableKey = length - i;

    if (char === ",") {
      // 🌟 แก้ไข: ปรับ height และ lineHeight ให้เป็น 82px ตรงกับตัวเลข
      elements.unshift(
        <span key={`comma-${stableKey}`} style={{ display: "inline-block", height: "82px", lineHeight: "82px", fontSize: "82px", fontFamily: '"Bebas Neue", sans-serif', fontWeight: "bold", background: "linear-gradient(135deg, var(--accent), var(--accent-mint))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: "0 2px" }}>,</span>
      );
    } else {
      const showFirstDigit = false; //เปลี่ยน false ปิดเลขทุกตัว, true เปิดแค่ตัวเลขหน้าตัวเดียว
      const isFirstChar = i === 0;

      // 🌟 เช็คว่าตัวนี้ต้องถูกซ่อนเป็นตัว X หรือไม่ (อ้างอิงสวิตช์ IS_VOTING_ENDED)
      const isMasked = !IS_VOTING_ENDED && !(showFirstDigit && isFirstChar);
      
      const forceSpin = diff >= Math.pow(10, currentDigitIndex);
      
      // 🌟 ใช้ Digit ในการเรนเดอร์ทั้งหมดเพื่อรักษาระนาบและการหมุน
      elements.unshift(
        <Digit 
          key={`digit-${stableKey}`} 
          targetValue={parseInt(char)} 
          trigger={value} 
          digitIndex={currentDigitIndex} 
          forceSpin={forceSpin} 
          isMasked={isMasked} 
        />
      );
      currentDigitIndex++;
    }
  }

  return (
    // 🌟 เปลี่ยน alignItems เป็น "center" เพื่อให้ทุกกล่องที่มีความสูงเท่ากันจัดกึ่งกลางพอดีเป๊ะ
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "82px" }}>
      {elements}
    </div>
  );
}

// ============================================================================
// 🌟 3. Component หน้าเช็คสถานะแยก (ปรับปรุงเฉพาะ 2 จุดตามสั่ง)
// ============================================================================
function ProjectStatusView({ project, onBack }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showProof, setShowProof] = useState(false);
  const [expandedTracking, setExpandedTracking] = useState({});

  useEffect(() => { 
    window.scrollTo(0, 0); 
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return; 
    
    setIsSearching(true);
    setHasSearched(true);
    setSearchResult(null);
    setShowProof(false);
    setExpandedTracking({}); 

    try {
    const projName = project.Project ? project.Project.toString().trim() : "";
      const settings = PROJECT_CONFIG[projName] || PROJECT_CONFIG.default;

      const res = await fetch(settings.apiUrl);
      const data = await res.json();

      const foundRows = data.filter(row => {
        return Object.values(row).some(val => 
          val !== null && 
          val !== undefined && 
          val.toString().trim() === searchQuery.trim()
        );
      });

      if (foundRows.length > 0) {
        const mainKey = Object.keys(foundRows[0]).find(k => 
          settings.keyHint.some(hint => k.toLowerCase().includes(hint.toLowerCase()))
        );
        const finalMainText = mainKey ? foundRows[0][mainKey] : searchQuery.trim();

        const itemsList = foundRows.map(row => {
          const itemKey = Object.keys(row).find(k => k.includes("รายการ") || k.includes("สินค้า") || k.includes("โปรเจกต์"));
          const statusKey = Object.keys(row).find(k => k.includes("สถานะ"));
         const proofKey = Object.keys(row).find(k => k.includes("หลักฐาน") || k.includes("สลิป") || k.toLowerCase().includes("slip") || k.includes("รูป") || k.toLowerCase().includes("tracking") || k.includes("เลข"));

          return {
            Name: itemKey && row[itemKey] ? row[itemKey].toString().trim() : "ไม่ระบุชื่อรายการ",
            Status: statusKey && row[statusKey] ? row[statusKey].toString().trim() : "ไม่ระบุสถานะ",
            Proof: (proofKey && row[proofKey] && row[proofKey].toString().trim() !== "") ? row[proofKey].toString().trim() : null
          };
        });

        setSearchResult({ MainText: finalMainText, Items: itemsList, settings: settings });

        // 3. บันทึกผลลัพธ์เป็น Array (มีตัวแปร Items เพิ่มเข้ามา)
      } else {
        setSearchResult({ error: "ไม่พบข้อมูลในระบบ โปรดตรวจสอบความถูกต้อง" });
      }
    } catch (error) {
      console.error("Search Error:", error);
      setSearchResult({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล โปรดลองอีกครั้งในภายหลัง" });
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusStyle = (status) => {
    if (!status) return { bg: "#f1f5f9", text: "#64748b", border: "#e2e8f0" }; 
    const s = status.toString().trim();
    
    // ❗ คืนสไตล์สถานะ "กำลังดำเนินการ" เป็นส้ม/เหลืองเดิม (ไม่มี Glow และตัวหนา)
    if (s === "อยู่ระหว่างดำเนินการ" || s === "กำลังดำเนินการ") {
      return { bg: "linear-gradient(135deg, #fffbeb, #fef3c7)", text: "#d97706", border: "#fde68a", shadow: "0 4px 12px rgba(245, 158, 11, 0.15)", Weight: "500"}; 
    }
    
    if (s === "ยังไม่โอน") return { bg: "#fef2f2", text: "#ef4444", border: "#fecaca" }; 
    if (s === "โอนบัตรแล้ว") return { bg: "linear-gradient(135deg, #f0fdf4, #dcfce7)", text: "#16a34a", border: "#bbf7d0",shadow: "0 4px 12px rgba(34, 197, 94, 0.15)", weight: "500" }; 
    if (s === "จัดส่งแล้ว") return { bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0" };
    
    return { bg: "#f8fafc", text: "#334155", border: "#e2e8f0" }; 
  };

  return (
    <div className="app-root" style={{ animation: "heroFadeInUp 0.4s ease-out forwards", backgroundColor: "#fcfaff" }}>
      <Navbar />
      
      <style>
        {`
          button { outline: none !important; -webkit-tap-highlight-color: transparent !important; }
          
          /* ❗ คืนสไตล์ปุ่ม Back กลับเป็นเหมือนต้นฉบับเป๊ะๆ */
          .back-button-original {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 20px 10px 16px;
            background: transparent;
            color: #8a7b9e;
            font-size: 15px;
            font-weight: 600;
            font-family: "Mitr", sans-serif;
            border: 1px solid transparent;
            border-radius: 999px;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .back-button-original:hover {
            background: #ffffff;
            color: #6b50c5;
            border-color: #eadeff;
            box-shadow: 0 4px 12px rgba(139, 92, 246, 0.08);
            transform: translateX(-4px);
          }
          .back-button-original svg {
            transition: transform 0.3s ease;
          }
          .back-button-original:hover svg {
            transform: translateX(-4px);
          }

          .proof-toggle-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            padding: 14px 32px;
            background: #ffffff;
            color: #6b50c5;
            border: 1.5px solid #eadeff;
            border-radius: 16px;
            font-family: "Mitr", sans-serif;
            font-size: 15px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 4px 12px rgba(107, 80, 197, 0.06);
          }
          .proof-toggle-btn:hover {
            transform: translateY(-3px);
            border-color: #b48cff;
            box-shadow: 0 8px 20px rgba(107, 80, 197, 0.12);
          }
          .proof-toggle-btn.active {
            background: #f8f6ff;
            color: #5b40b5;
            border-color: #c7b3ff;
            transform: translateY(1px);
            box-shadow: inset 0 2px 5px rgba(107, 80, 197, 0.1);
          }
          .proof-toggle-btn svg {
            transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
          .proof-toggle-btn:hover svg {
            transform: scale(1.2) rotate(10deg);
          }
          .image-reveal-container {
            max-height: 0;
            opacity: 0;
            overflow: hidden;
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .image-reveal-container.visible {
            max-height: 1000px;
            opacity: 1;
            margin-top: 24px;
          }
        `}
      </style>

      <section className="page-section" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 70px)", padding: "40px 20px" }}>
        <div className="page-section-inner" style={{ textAlign: "center", width: "100%" }}>
          <div style={{ maxWidth: "520px", margin: "0 auto" }}>
            <div className="section-header" style={{ marginBottom: "40px", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
              <h2 style={{ fontSize: "42px", fontFamily: '"Bebas Neue", sans-serif', margin: "0", color: "#0f172a", letterSpacing: "0.04em" }}>CHECK STATUS</h2>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", padding: "8px 24px 8px 10px", backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "999px", boxShadow: "0 2px 10px rgba(0, 0, 0, 0.02)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", backgroundColor: "#f8fafc", borderRadius: "50%", border: "1px solid #f1f5f9" }}>
               <img 
  src={(PROJECT_CONFIG[project.Project] || PROJECT_CONFIG.default).icon}
  alt="Project Icon" 
  style={{ height: "20px", width: "auto", display: "block" }} // ปรับความสูงให้พอดีกับวงกลม 36px
/>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                  <span style={{ color: "#64748b", fontSize: "14px", fontWeight: "500", fontFamily: '"Mitr", sans-serif' }}>โปรเจกต์ :</span>
                  <span style={{ color: "#0f172a", fontWeight: "600", fontSize: "16px", fontFamily: '"Mitr", sans-serif' }}>{project.Project || "ไม่ทราบชื่อโปรเจกต์"}</span>
                </div>
              </div>
            </div>

            <div style={{ background: "#ffffff", padding: "40px 32px", borderRadius: "24px", border: "1px solid #e2e8f0", boxShadow: "0 10px 30px rgba(0, 0, 0, 0.03)" }}>
             <h3 style={{ fontSize: "16px", color: "#475569", margin: "0 0 20px 0", fontFamily: '"Mitr", sans-serif', fontWeight: "500" }}>
                {(PROJECT_CONFIG[project.Project] || PROJECT_CONFIG.default).searchLabel}
              </h3>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <input type="text" placeholder={(PROJECT_CONFIG[project.Project] || PROJECT_CONFIG.default).placeholder} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} style={{ flex: "1", minWidth: "220px", padding: "16px 20px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none", fontSize: "15px", fontFamily: '"Mitr", sans-serif', color: "#0f172a", backgroundColor: "#f8fafc", transition: "all 0.2s ease" }} />
                <button onClick={handleSearch} disabled={isSearching} style={{ padding: "16px 32px", borderRadius: "12px", backgroundColor: "#0f172a", color: "#ffffff", border: "none", fontSize: "15px", fontWeight: "500", fontFamily: '"Mitr", sans-serif', cursor: isSearching ? "wait" : "pointer", opacity: isSearching ? 0.7 : 1 }}>{isSearching ? "กำลังค้นหา..." : "ค้นหาข้อมูล"}</button>
              </div>

              {hasSearched && (
                <div style={{ marginTop: "32px", animation: "heroFadeInUp 0.4s ease-out forwards" }}>
                  {searchResult?.error ? (
                    <div style={{ padding: "18px", background: "#fef2f2", color: "#dc2626", borderRadius: "16px", border: "1px solid #fecaca", fontSize: "14.5px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", boxShadow: "0 4px 12px rgba(220, 38, 38, 0.05)", fontFamily: '"Mitr", sans-serif' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                      {searchResult.error}
                    </div>
                  ) : searchResult ? (
                    <div style={{ padding: "32px", background: "#ffffff", borderRadius: "20px", border: "1px solid #e2e8f0", textAlign: "left", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
                      
                      {/* หัวข้อ Wallet ID */}
                     <div style={{ marginBottom: "28px" }}>
                        <div style={{ fontSize: "14px", color: "#927bb3", fontWeight: "500", marginBottom: "6px", fontFamily: '"Mitr", sans-serif', letterSpacing: "0.01em" }}> 
                          {searchResult.settings?.resultTitle || "ข้อมูลของคุณ"} 
                        </div>
                        <div style={{ background: "#f8f9fa", padding: "12px 16px", borderRadius: "10px", display: "flex", alignItems: "center", border: "1px solid #f1f5f9" }}>
                          <span style={{ color: "#7c7b7e", fontWeight: "500", fontSize: "14px", fontFamily: '"Inter", "Mitr", sans-serif', wordBreak: "break-all", letterSpacing: "0.03em" }}> 
                            {searchResult.MainText} 
                          </span>
                        </div>
                      </div>

                      {/* รายการสั่งซื้อ (ลูปตามจำนวนที่หาเจอ) */}
                      <div style={{ fontSize: "15px", fontWeight: "600", color: "#475569", fontFamily: '"Mitr", sans-serif', marginBottom: "12px" }}>รายการของคุณ ({searchResult.Items.length} รายการ)</div>
                      
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {searchResult.Items.map((item, index) => (
                          <div key={index} style={{
                            background: "#ffffff",
                            border: "1px solid #f1f5f9",
                            borderRadius: "14px",
                            padding: "16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexWrap: "wrap", // เผื่อหน้าจอมือถือเล็ก จะได้ปัดตกบรรทัด
                            gap: "12px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.01)"
                          }}>
                            {/* หมายเลข + ชื่อรายการ */}
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                              <div style={{ background: "#f8f6ff", color: "#3f1c80", width: "26px", height: "26px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "600", fontFamily: '"Inter", sans-serif' }}>
                                {index + 1}
                              </div>
                              <span style={{ fontSize: "15px", color: "#2c2537", fontWeight: "500", fontFamily: '"Mitr", sans-serif' }}>
                                {item.Name}
                              </span>
                            </div>

                            {/* กรุ๊ปสถานะ + ปุ่มดูหลักฐาน */}
                            {/* ➡️ ฝั่งขวา: ป้ายสถานะ (ที่กลายเป็นปุ่มกดเมื่อโอนบัตรแล้ว) */}
<div style={{ display: "flex", alignItems: "center" }}>

 {item.Status === "จัดส่งแล้ว" && item.Proof ? (
          /* 👉 สร้างกล่อง Column ขึ้นมาครอบเฉพาะปุ่มกับเลขพัสดุ บังคับตกลงล่างแน่นอน */
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
            
            {/* 1. ปุ่มสถานะ */}
            <div 
              onClick={() => setExpandedTracking(prev => ({...prev, [index]: !prev[index]}))}
              style={{ 
                background: expandedTracking[index] ? "#dcfce7" : "linear-gradient(135deg, #f0fdf4, #dcfce7)", 
                color: "#16a34a", 
                border: "1px solid #bbf7d0", 
                padding: "6px 18px", 
                borderRadius: "999px", 
                fontSize: "13px", 
                fontWeight: "600", 
                fontFamily: '"Mitr", sans-serif',
                cursor: "pointer", 
                display: "flex",
                alignItems: "center",
                gap: "6px",
                userSelect: "none"
              }}
            >
              {item.Status}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ transform: expandedTracking[index] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>

            {/* 2. เลขพัสดุ (อัปเกรดดีไซน์เป็น Tag โค้งมนดูพรีเมียมขึ้น) */}
            {expandedTracking[index] && (
              <div 
                onClick={() => { 
                  navigator.clipboard.writeText(item.Proof); 
                  alert("คัดลอกเลข Tracking: " + item.Proof + " เรียบร้อยแล้ว!"); 
                }}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "8px",
                  marginTop: "4px", // เว้นระยะห่างจากปุ่มด้านบนนิดนึงให้หายใจได้
                  padding: "6px 14px", 
                  background: "#f8fafc", // พื้นหลังสีเทาอ่อนมากๆ ให้ดูเป็นกล่อง
                  border: "1px solid #e2e8f0", // เส้นขอบบางๆ
                  borderRadius: "10px", // มุมโค้งมนกำลังดีเข้ากับปุ่ม
                  cursor: "pointer", 
                  transition: "all 0.2s ease",
                  animation: "heroFadeInUp 0.2s ease-out forwards"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f1f5f9"; // ชี้แล้วเข้มขึ้นนิดนึง
                  e.currentTarget.style.borderColor = "#cbd5e1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#f8fafc";
                  e.currentTarget.style.borderColor = "#e2e8f0";
                }}
                title="คลิกเพื่อคัดลอก"
              >
                {/* เพิ่มคำว่าเลขพัสดุตัวเล็กๆ สีเทา ให้ดูเป็นสัดส่วน */}
                <span style={{ fontSize: "12px", color: "#64748b", fontFamily: '"Mitr", sans-serif', fontWeight: "500" }}>
                  Tracking
                </span>
                
                {/* ตัวเลขพัสดุ */}
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#334155", fontFamily: '"Inter", "Mitr", sans-serif', letterSpacing: "0.5px" }}>
                  {item.Proof}
                </span>

                {/* ไอคอน Copy สีม่วงอ่อนๆ ให้ดูน่ากด */}
                <div style={{ marginLeft: "2px", display: "flex", alignItems: "center" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </div>
              </div>
            )}
          </div>
    
  ) : item.Status === "โอนบัตรแล้ว" && item.Proof ? (
    /* 🔗 ถ้าสถานะคือ 'โอนบัตรแล้ว' ให้ครอบด้วยลิงก์หลักฐาน */
    <a 
      href={getDirectImageLink(item.Proof)} 
      target="_blank" 
      rel="noreferrer" 
      style={{ textDecoration: "none", cursor: "pointer" }}
    >
      <div style={{ 
        background: getStatusStyle(item.Status).bg, 
        color: getStatusStyle(item.Status).text, 
        border: `2px solid ${getStatusStyle(item.Status).border}`, // เน้นขอบให้รู้ว่ากดได้
        padding: "6px 18px", 
        borderRadius: "999px", 
        fontSize: "13px", 
        fontWeight: "500", 
        fontFamily: '"Mitr", sans-serif',
        display: "flex",
        alignItems: "center",
        gap: "6px",
        boxShadow: "0 4px 12px rgba(22, 163, 74, 0.12)" // เพิ่มเงาจางๆ ให้ดูเหมือนปุ่ม
      }}>
        {item.Status} 
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
      </div>
    </a>
  ) : (
    /* 🔒 ถ้าสถานะอื่นๆ ให้แสดงเป็นป้ายปกติที่กดไม่ได้ */
    <div style={{ 
      background: getStatusStyle(item.Status).bg, 
      color: getStatusStyle(item.Status).text, 
      border: `1px solid ${getStatusStyle(item.Status).border}`,
      padding: "6px 18px", 
      borderRadius: "999px", 
      fontSize: "13px", 
      fontWeight: "500", // เอาตัวหนาออกตามที่ต้องการ
      fontFamily: '"Mitr", sans-serif'
    }}>
      {item.Status}
    </div>
  )}
</div>
                            
                          </div>
                        ))}
                      </div>

                    </div>
                  ) : null}
                </div>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "center", marginTop: "24px" }}>
              {/* ❗ คืนร่างปุ่มกลับหน้ารวมโปรเจกต์เดิมเป๊ะๆ */}
              <button onClick={onBack} className="back-button-original">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                กลับหน้ารวมโปรเจกต์
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p className="footer-line1">-`♡´- Fansite Project made by RollzyBunny</p>
        <p className="footer-line2">Original Content & Artist © by Independent Artist Management (iAM).</p>
      </footer>
    </div>
  );
}



// ============================================================================
// 📖 COMPONENT: StoryRewardSection (ปลดล็อคนิทานตามยอด Token)
// ตอน 1-9: ปลดล็อคด้วย Token / ตอน 10: ปลดล็อคเมื่อถึงวันที่ (ผลอันดับ)
// ============================================================================
function StoryRewardSection({ totalTokens }) {
  const [openChapter, setOpenChapter] = useState(null);

  // ตอน 1-9 เช็คจาก Token, ตอน 10 เช็คจากวันที่
  const isChapterUnlocked = (chapter) => {
    if (chapter.isFinalRanking) {
      return new Date() >= new Date(VOTING_END_DATE);
    }
    return totalTokens >= chapter.requiredTokens;
  };

  const tokenChapters = STORY_CHAPTERS.filter(ch => !ch.isFinalRanking);
  const unlockedTokenCount = tokenChapters.filter(ch => totalTokens >= ch.requiredTokens).length;
  const totalTarget = 12000;
  const progressPercent = Math.min((totalTokens / totalTarget) * 100, 100);
  const nextTokenChapter = tokenChapters.find(ch => totalTokens < ch.requiredTokens);
  const isTargetReached = totalTokens >= totalTarget;

  return (
    <section className="page-section" style={{ padding: "72px 20px 80px", background: "#fdfcff" }}>
      <div style={{ textAlign: "center", width: "100%", maxWidth: "880px", margin: "0 auto" }}>

        {/* ─── Section Header ─── */}
        <div style={{ marginBottom: "44px" }}>
          <div style={{ fontSize: "40px", marginBottom: "8px" }}>📖</div>
          <h2 style={{ fontSize: "52px", color: "#2c2537", fontFamily: '"Bebas Neue", sans-serif', marginBottom: "6px", letterSpacing: "0.04em" }}>Special Story</h2>
          <p style={{ fontSize: "15px", color: "#8a7b9e", fontFamily: '"Mitr", sans-serif', marginBottom: "32px", fontWeight: "400" }}>ภารกิจพิเศษ สะสม Token เพื่อปลดล็อคตอน</p>

          {/* ─── Progress Bar ─── */}
          <div style={{ maxWidth: "480px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
              <span style={{ fontSize: "13px", color: isTargetReached ? "#3d8c6a" : "#6b50c5", fontWeight: "600", fontFamily: '"Mitr", sans-serif' }}>
                {isTargetReached
                  ? "✓ Mission Complete"
                  : `ปลดล็อคแล้ว ${unlockedTokenCount}/${tokenChapters.length} ตอน`}
              </span>
              {!isTargetReached && nextTokenChapter && (
                <span style={{ fontSize: "12px", color: "#a093b5", fontFamily: '"Mitr", sans-serif' }}>
                  ถัดไป: {nextTokenChapter.requiredTokens.toLocaleString()}
                </span>
              )}
            </div>
             <div style={{ width: "100%", height: "8px", background: isTargetReached ? "#d4eddf" : "#ede8f5", borderRadius: "999px", overflow: "hidden" }}>
              <div
                className={isTargetReached ? "story-progress-bar-complete" : "story-progress-bar"}
                style={{ width: `${progressPercent}%`, height: "100%", borderRadius: "999px", transition: "width 0.8s cubic-bezier(0.25, 0, 0.1, 1)" }}
              />
              </div>
            <div
              className={isTargetReached ? "story-completed-reveal" : ""}
              style={{ marginTop: "10px", display: "flex", justifyContent: "center", alignItems: "baseline", gap: "4px" }}
            >
              <span style={{
                fontSize: isTargetReached ? "24px" : "20px",
                fontWeight: "700",
                color: isTargetReached ? "#2a7c55" : "#3d2e5c",
                fontFamily: '"Bebas Neue", sans-serif',
                letterSpacing: "0.03em",
              }}>
                {totalTokens.toLocaleString()}
              </span>
              <span style={{
                fontSize: "13px",
                color: isTargetReached ? "#8abfa3" : "#c4bdd0",
                fontWeight: "500",
                fontFamily: '"Mitr", sans-serif',
              }}>
                / {totalTarget.toLocaleString()} Token
              </span>
            </div>
          </div>
        </div>

        {/* ─── Story Cards Grid ─── */}
        <div className="story-cards-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "14px" }}>
          {STORY_CHAPTERS.map((chapter) => {
             const isTokensReached = isChapterUnlocked(chapter);
            const isFinal = chapter.isFinalRanking;
            const isComingSoon = chapter.isComingSoon;
            const isUnlocked = isTokensReached && !isComingSoon;
            const tokensNeeded = isFinal ? 0 : (chapter.requiredTokens - totalTokens);

            return (
              <div
                key={chapter.chapter}
                className={`${isUnlocked ? 'story-card-unlocked' : 'story-card-locked'} ${isFinal ? 'story-card-final' : ''}`}
                onClick={() => isUnlocked && setOpenChapter(chapter)}
                style={{
                  position: "relative",
                  padding: "24px 12px 18px",
                  borderRadius: "16px",
                  border: isTokensReached
                    ? (isFinal ? "1px solid #e8d5a3" : (isComingSoon ? "1px dashed #c4bdd0" : "1px solid #e0d4f0"))
                    : "1px solid #e5e2eb",
                    background: isTokensReached
                    ? (isFinal ? "#fdf8ed" : (isComingSoon ? "#fcfbfe" : "#faf8ff"))
                    : "#f5f3f8",
                  cursor: isUnlocked ? "pointer" : "default",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                  minHeight: "164px",
                  justifyContent: "center",
                }}
              >
                {/* Chapter number badge */}
                <div style={{
                  position: "absolute", top: "8px", left: "8px",
                  width: "22px", height: "22px", borderRadius: "50%",
                  background: isUnlocked
                    ? (isFinal ? "#d4a853" : "#9b7fcf")
                    : "#c4bdd0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "10px", fontWeight: "700", color: "#fdfcff", fontFamily: '"Inter", sans-serif',
                }}>
                  {chapter.chapter}
                </div>

                {/* Emoji / Lock icon */}
                <div style={{
                  fontSize: "32px", marginTop: "2px",
                   opacity: isUnlocked ? 1 : 0.4,
                  filter: isUnlocked ? "none" : "grayscale(1)",
                  transition: "opacity 0.3s cubic-bezier(0.25, 0, 0.1, 1), filter 0.3s cubic-bezier(0.25, 0, 0.1, 1)",
                }}>
                   {isTokensReached ? chapter.emoji : "🔒"}
                </div>

                {/* Title */}
                <div style={{
                  fontSize: isFinal ? "12px" : "13px", fontWeight: "600",
                  color: isUnlocked ? (isFinal ? "#7c5a1e" : "#3d2e5c") : "#a09aae",
                  fontFamily: '"Mitr", sans-serif', lineHeight: "1.3",
                }}>
                  {chapter.title}
                </div>

                {/* Unlocked: subtle lock-open icon + token amount */}
                {isTokensReached && !isFinal && (
                  <div style={{
                    display: "flex", alignItems: "center", gap: "4px",
                    fontSize: "10px", color: "#a093b5", fontFamily: '"Mitr", sans-serif', fontWeight: "500",
                    marginTop: "2px",
                  }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
                    </svg>
                    {chapter.requiredTokens.toLocaleString()}
                  </div>
                )}

                {/* Unlocked: read CTA */}
                {isUnlocked && (
                  <div style={{
                    fontSize: "11px", fontWeight: "500",
                    color: isFinal ? "#a07d3a" : "#7b6ba0",
                    fontFamily: '"Mitr", sans-serif',
                    marginTop: "2px",
                  }}>
                    กดเพื่ออ่าน
                  </div>
                )}

                {/* Coming Soon status */}
                {isTokensReached && isComingSoon && !isFinal && (
                  <div style={{
                    fontSize: "11px", color: "#a09aae",
                    fontFamily: '"Mitr", sans-serif', fontWeight: "500",
                    marginTop: "2px",
                  }}>
                    เร็ว ๆ นี้
                  </div>
                )}

                {/* Final card: date-based status */}
                {!isTokensReached && isFinal && (
                  <div style={{
                    fontSize: "10px", color: "#a09aae",
                    fontFamily: '"Mitr", sans-serif', fontWeight: "500",
                    marginTop: "2px",
                  }}>
                    รอประกาศผล
                  </div>
                )}

                {/* Locked: tokens needed */}
                {!isTokensReached && !isFinal && (
                  <div style={{
                    fontSize: "10px", color: "#a09aae",
                    fontFamily: '"Mitr", sans-serif', fontWeight: "500",
                    marginTop: "2px",
                  }}>
                    อีก {tokensNeeded.toLocaleString()} Token
                  </div>
                )}

                {/* Shimmer overlay */}
                {isUnlocked && (
                  <div className="story-shimmer" style={{
                    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                    borderRadius: "16px", pointerEvents: "none",
                  }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Story Reading Modal ─── */}
      {openChapter && (
        <div
          onClick={(e) => e.target === e.currentTarget && setOpenChapter(null)}
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(22, 14, 36, 0.65)", backdropFilter: "blur(6px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 9999, padding: "20px",
            animation: "storyModalIn 0.25s cubic-bezier(0.25, 0, 0.1, 1) forwards",
          }}
        >
          <div style={{
            background: "#fdfcff", borderRadius: "20px",
            padding: "36px 28px", maxWidth: "500px", width: "100%",
            maxHeight: "80vh", overflowY: "auto", position: "relative",
            boxShadow: "0 16px 40px rgba(22, 14, 36, 0.2)",
            animation: "storyCardPop 0.3s cubic-bezier(0.25, 0, 0.1, 1) forwards",
          }}>
            {/* Close button */}
            <button
              className="story-modal-close"
              onClick={() => setOpenChapter(null)}
              style={{
                position: "absolute", top: "14px", right: "14px",
                width: "32px", height: "32px", borderRadius: "50%",
                border: "1px solid #e0d4f0", background: "#f5f3f8",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                color: "#8a7b9e", fontSize: "16px", transition: "all 0.2s cubic-bezier(0.25, 0, 0.1, 1)",
              }}
            >✕</button>

            {/* Chapter badge pill */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "5px 14px",
              background: openChapter.isFinalRanking ? "#fdf8ed" : "#f5f1fc",
              borderRadius: "999px",
              border: openChapter.isFinalRanking ? "1px solid #e8d5a3" : "1px solid #e0d4f0",
              marginBottom: "16px",
            }}>
              <span style={{ fontSize: "16px" }}>{openChapter.emoji}</span>
              <span style={{
                fontSize: "12px", fontWeight: "600",
                color: openChapter.isFinalRanking ? "#7c5a1e" : "#6b50c5",
                fontFamily: '"Mitr", sans-serif',
              }}>
                {openChapter.isFinalRanking ? "FINAL REWARD" : `CHAPTER ${openChapter.chapter}`}
              </span>
            </div>

            {/* Title */}
            <h3 style={{
              fontSize: "22px", fontWeight: "700", color: "#2c2537",
              fontFamily: '"Mitr", sans-serif', margin: "0 0 6px 0", lineHeight: "1.4",
            }}>
              {openChapter.title}
            </h3>

            {/* Milestone info */}
            <div style={{
              fontSize: "12px", color: "#a093b5", fontFamily: '"Mitr", sans-serif',
              marginBottom: "20px", display: "flex", alignItems: "center", gap: "5px",
            }}>
              {openChapter.isFinalRanking ? (
                <>📅 ปลดล็อคเมื่อสิ้นสุดการโหวต</>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
                  </svg>
                  ปลดล็อคที่ {openChapter.requiredTokens.toLocaleString()} Token
                </>
              )}
            </div>

            {/* Divider */}
            <div style={{ height: "1px", background: "#e8e2f0", marginBottom: "20px" }} />

            {/* Image (if exists) */}
            {openChapter.image && (
              <div style={{ marginBottom: "20px", borderRadius: "12px", overflow: "hidden" }}>
                <img src={openChapter.image} alt={openChapter.title} style={{ width: "100%", display: "block" }} />
              </div>
            )}

            {/* Content */}
            <div style={{
              fontSize: "15px", color: "#4a3f5c", fontFamily: '"Mitr", sans-serif',
              lineHeight: "1.8", fontWeight: "400", whiteSpace: "pre-line",
              textAlign: "left",
            }}>
              {openChapter.content}
            </div>

            {/* Navigation buttons */}
            <div style={{
              marginTop: "28px", display: "flex", justifyContent: "space-between", alignItems: "center",
              paddingTop: "16px", borderTop: "1px solid #ede8f5",
            }}>
              {/* Previous */}
              {openChapter.chapter > 1 && isChapterUnlocked(STORY_CHAPTERS[openChapter.chapter - 2]) ? (
                <button
                  className="story-modal-nav-btn"
                  onClick={() => setOpenChapter(STORY_CHAPTERS[openChapter.chapter - 2])}
                  style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    padding: "8px 16px", background: "transparent",
                    border: "1px solid #e0d4f0", borderRadius: "10px",
                    color: "#6b50c5", fontSize: "12px", fontWeight: "500",
                    fontFamily: '"Mitr", sans-serif', cursor: "pointer",
                  }}
                >
                  ← ก่อนหน้า
                </button>
              ) : <div />}

              {/* Next */}
              {openChapter.chapter < STORY_CHAPTERS.length && isChapterUnlocked(STORY_CHAPTERS[openChapter.chapter]) ? (
                <button
                  className="story-modal-nav-btn"
                  onClick={() => setOpenChapter(STORY_CHAPTERS[openChapter.chapter])}
                  style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    padding: "8px 16px",
                    background: "#3d2e5c",
                    border: "none", borderRadius: "10px",
                    color: "#fdfcff", fontSize: "12px", fontWeight: "500",
                    fontFamily: '"Mitr", sans-serif', cursor: "pointer",
                  }}
                >
                  ถัดไป →
                </button>
              ) : <div />}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}


// ============================================================================
// 4. COMPONENT: TokenPage (หน้ารวมโปรเจกต์หลัก) 
// ============================================================================
function TokenPage() {
  const [totalTokens, setTotalTokens] = useState(0);
  const [projects, setProjects] = useState([]); 
  const [selectedProject, setSelectedProject] = useState(null); 
  const [showAllProjects, setShowAllProjects] = useState(false);

  // 🌟 เพิ่มฟังก์ชันสำหรับแปลงตัวเลขที่นี่
 /* const maskNumber = (num) => {
    const str = Number(num).toLocaleString(); // จะได้ค่าเช่น "8,000"
    if (str.length <= 1) return str;
    
    // หากต้องการแสดงตัวแรก (8,XXX) ให้ใช้บรรทัดนี้:
   // return str.charAt(0) + str.slice(1).replace(/[0-9]/g, 'X'); 
    
    // หากต้องการปิดทั้งหมด (X,XXX) ให้ลบบรรทัดบนแล้วใช้บรรทัดนี้แทน:
     return str.replace(/[0-9]/g, 'X');
  }; */
  // นับถอยหลัง
 const calculateTimeLeft = () => {
    const now = +new Date();
    const startTime = +new Date(VOTING_START_DATE);
    const endTime = +new Date(VOTING_END_DATE);

    let targetTime = 0;
    let phase = ""; // สถานะ: "upcoming" (รอกด), "active" (กำลังโหวต), "ended" (จบแล้ว)

    if (now < startTime) {
      targetTime = startTime;
      phase = "upcoming";
    } else if (now < endTime) {
      targetTime = endTime;
      phase = "active";
    } else {
      phase = "ended";
      return { timeLeft: { days: 0, hours: 0, minutes: 0, seconds: 0 }, phase };
    }

    const difference = targetTime - now;
    return {
      timeLeft: {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      },
      phase
    };
  };

  const [timeData, setTimeData] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeData(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = () => {
      fetch("https://opensheet.elk.sh/1LdYwevfbc_sFhD8BKaBEEoYdTWLApQ5apSD9WIJRFz4/Sheet1")
        .then(res => res.json())
        .then(data => {
          let grandTotal = 0; let projectList = [];
          data.forEach(row => {
            if (row.Number !== "Total Tokens" && row.Project !== "Total Tokens") {
              if (row.Tokens !== undefined || row.Project) {
                grandTotal += Number(row.Tokens || 0);
                projectList.push(row); 
              }
            }
          });
          setTotalTokens(grandTotal);
          setProjects(projectList);
        }).catch(error => console.error(error));
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (selectedProject) return <ProjectStatusView project={selectedProject} onBack={() => setSelectedProject(null)} />;

  return (
    <div className="app-root">
      <Navbar />
      <style>{`
        @keyframes pulse-dot { 0% { transform: scale(0.8); opacity: 0.5; } 50% { transform: scale(1.2); opacity: 1; } 100% { transform: scale(0.8); opacity: 0.5; } }
        .project-card { transition: transform 0.25s ease, box-shadow 0.25s ease; cursor: pointer; }
        .project-card:hover { transform: translateY(-8px); box-shadow: 0 10px 28px rgba(180, 140, 255, 0.15), 0 0 0 2px rgba(197, 116, 255, 0.4); }
      `}</style>

      <section className="page-section" style={{ background: "radial-gradient(circle at center, #ffffff 0%, #faf5ff 40%, #fff0f8 100%)", minHeight: "calc(100vh - 70px)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "40px 20px" }}>
        <div className="page-section-inner" style={{ textAlign: "center", width: "100%" }}>
          <div className="section-header" style={{ marginBottom: "24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <img src="/bnktoken.png" alt="BNK Token" style={{ height: "56px", width: "auto", marginBottom: "16px", filter: "drop-shadow(0 4px 8px rgba(130, 90, 180, 0.2))" }} />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", margin: "0 0 8px 0" }}>
              <h2 style={{ fontSize: "56px", margin: "0", fontFamily: '"Bebas Neue", sans-serif', lineHeight: "1", color: "#2c2537" }}>TOTAL TOKENS</h2>
              <span style={{ 
                color: "#c24670",
                fontSize: "32px", 
                fontWeight: "900",
                fontFamily: '"Nunito", sans-serif',
                letterSpacing: "-0.01em",
              }}>
                #RoseToGE6
              </span>
            </div>
           {/* <p style={{ fontSize: "18px", color: "#8a7b9e", fontFamily: '"Mitr", sans-serif' }}>ยอดรวม Tokens จากโปรเจกต์ทั้งหมด</p> */}
          </div>
          <div style={{ position: "relative", background: "linear-gradient(180deg, #ffffff 0%, #fdfcff 100%)", borderRadius: "32px", padding: "40px 20px 32px", width: "100%", maxWidth: "400px", margin: "0 auto", boxShadow: "0 24px 50px rgba(180, 140, 255, 0.15)", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <NumberTicker value={totalTokens} />
            <div style={{ marginTop: "24px", display: "inline-flex", alignItems: "center", gap: "6px", padding: "5px 12px", background: "#f4f0ff", borderRadius: "999px", border: "1px solid #eadeff" }}>
              <div style={{ width: "7px", height: "7px", backgroundColor: "#22c55e", borderRadius: "50%", animation: "pulse-dot 2s infinite" }} />
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#6b50c5", fontFamily: '"Mitr", sans-serif' }}>LIVE UPDATE</span>
            </div>
          </div>
        </div>
        {/* 🌟 3. กล่องแสดงเวลานับถอยหลัง (เปลี่ยนคำตาม Phase อัตโนมัติ) */}
          {timeData.phase !== "ended" ? (
            <div style={{ marginTop: "32px", display: "flex", flexDirection: "column", alignItems: "center", animation: "heroFadeInUp 0.8s ease-out forwards" }}>
              <p style={{ fontSize: "18px", color: "#8a7b9e", fontFamily: '"Mitr", sans-serif', marginBottom: "14px", fontWeight: "600", letterSpacing: "0.02em" }}>
                {timeData.phase === "upcoming" ? "เปิดโหวตในอีก" : "สิ้นสุดการโหวตในอีก"}
              </p>
             <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                {[
                  { label: "วัน", value: timeData.timeLeft.days },
                  { label: "ชม.", value: timeData.timeLeft.hours },
                  { label: "นาที", value: timeData.timeLeft.minutes },
                  { label: "วิ", value: timeData.timeLeft.seconds }
                ].map((item, idx) => (
                  <div key={idx} style={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    alignItems: "center", 
                    background: "#ffffff", 
                    borderRadius: "16px", 
                    minWidth: "75px", 
                    boxShadow: "0 8px 24px rgba(180, 140, 255, 0.15)", 
                    border: "1px solid #eadeff",
                    overflow: "hidden" /* ซ่อนส่วนที่ล้นออกนอกมุมโค้ง */
                  }}>
                    {/* 🌟 ส่วนหัวปฏิทิน (แถบสีพาสเทล) */}
                    <div style={{
                      width: "100%",
                      background: "linear-gradient(135deg, #c5a3ff, #f9b4c3)",
                      padding: "6px 0",
                      fontSize: "13px",
                      color: "#ffffff",
                      fontFamily: '"Mitr", sans-serif',
                      fontWeight: "500",
                      textAlign: "center",
                      letterSpacing: "0.02em",
                      borderBottom: "1px dashed rgba(255,255,255,0.4)" /* เส้นประรอยฉีกกระดาษ */
                    }}>
                      {item.label}
                    </div>
                    
                    {/* 🌟 ส่วนตัวปฏิทิน (พื้นขาว + ตัวเลข) */}
                    <div style={{
                      width: "100%",
                      padding: "10px 0 12px",
                      textAlign: "center",
                      backgroundColor: "#ffffff"
                    }}>
                      <span style={{ 
                        fontSize: "34px", 
                        fontWeight: "bold", 
                        fontFamily: '"Bebas Neue", sans-serif', 
                        /* 🌟 ใช้สีชมพูอมม่วงเพื่อให้กลมกลืนกับโทนสีหลัก */
                        color: item.label === "วิ" ? "#c36aac" : "#6b50c5", 
                        lineHeight: "1" 
                      }}>
                        {String(item.value).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ marginTop: "32px", padding: "10px 24px", background: "#f0fdf4", color: "#16a34a", borderRadius: "999px", border: "1px solid #bbf7d0", fontSize: "15px", fontWeight: "500", fontFamily: '"Mitr", sans-serif', display: "inline-flex", animation: "heroFadeInUp 0.8s ease-out forwards" }}>
              🎉 สิ้นสุดระยะเวลาการโหวตแล้ว ขอบคุณทุกการสนับสนุน!
            </div>
          )}
          {/* 🌟 สิ้นสุดโค้ดนับถอยหลัง */}
      </section>

      {/* 📖 Story Rewards Section */}
      <StoryRewardSection totalTokens={totalTokens} />

      <section className="page-section" style={{ padding: "80px 20px" }}>
        <div className="page-section-inner" style={{ textAlign: "center", width: "100%" }}>
          <h2 style={{ fontSize: "56px", color: "#2c2537", fontFamily: '"Bebas Neue", sans-serif', marginBottom: "40px" }}>TOKENS BY PROJECT</h2>
          <p style={{ fontSize: "18px", color: "#8a7b9e", fontFamily: '"Mitr", sans-serif', marginBottom: "40px" }}>รายละเอียดจากแต่ละโปรเจกต์ย่อย</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px", maxWidth: "800px", margin: "0 auto" }}>
            {(showAllProjects ? [...projects].reverse() : [...projects].reverse().slice(0, 2)).map((proj, index) => {
  // 1. เช็คว่าถ้าเป็น Billboard ให้ถือว่ากดไม่ได้ (isClickable = false)
  // หรือถ้าต้องการให้กดได้เฉพาะ SummerFest กับ Merch ก็ใช้:
  // const isClickable = proj.Project === "SummerFest" || proj.Project === "Merch";
  const isClickable = 
    proj.Project !== "Billboard" && 
    proj.Project !== "Shared" && 
    proj.Project !== "2-Shot";

  const isMerch = proj.Project && proj.Project.toLowerCase().includes("merch");
  const hintText = isMerch ? "สถานะการจัดส่ง" : "สถานะการโอนบัตร";

  return (
    <div 
      key={index} 
      // 2. ถ้า isClickable เป็น false จะไม่ใส่ class "project-card" (ทำให้ไม่มีเงา/ไม่มีการขยับตอนชี้)
      className={isClickable ? "project-card" : ""} 
      
      // 3. ถ้า isClickable เป็น false ฟังก์ชัน onClick จะไม่ทำงาน
      onClick={() => isClickable && setSelectedProject(proj)} 
      
      style={{ 
        background: "#ffffff", 
        borderRadius: "28px", 
        padding: "32px 24px", 
        border: "1px solid rgba(197, 116, 255, 0.18)", 
        boxShadow: "0 10px 28px rgba(180, 140, 255, 0.08)", 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center",
        // 4. ถ้ากดไม่ได้ ให้เมาส์เป็นรูปปกติ ไม่ใช่รูปมือ
        cursor: isClickable ? "pointer" : "default" 
      }}
    >
      <img 
        src={(PROJECT_CONFIG[proj.Project] || PROJECT_CONFIG.default).icon}
        alt="Project Icon" 
        style={{ height: "48px", width: "auto", display: "block", marginBottom: "14px" }} 
      />
      <h4 style={{ margin: "0 0 14px 0", fontSize: "18px", color: "#6b50c5", fontWeight: "600", fontFamily: '"Mitr", sans-serif', textAlign: "center" }}>
        {proj.Project || "Unknown Project"}
      </h4>
      
      <div style={{ fontSize: "48px", fontFamily: '"Bebas Neue", sans-serif', background: "linear-gradient(135deg, var(--accent), var(--accent-mint))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: "bold", lineHeight: "1" }}>
        {maskNumber(proj.Tokens || 0)}
      </div>
      
      <div style={{ fontSize: "14px", color: "#a093b5", marginTop: "6px", fontWeight: "500", letterSpacing: "0.05em", fontFamily: '"Mitr", sans-serif' }}>
        TOKENS
      </div>

      {/* 5. ปรับให้แสดงป้าย "คลิกเพื่อตรวจสอบ" เฉพาะอันที่กดได้เท่านั้น */}
      {isClickable && (
        <div style={{ marginTop: "24px", padding: "8px 20px 8px 10px", borderRadius: "999px", background: "linear-gradient(to right, #fcfaff, #fff5f9)", border: "2px solid #f3e8ff", display: "flex", alignItems: "center", gap: "10px", color: "#927bb3", fontSize: "14px", fontFamily: '"Mitr", sans-serif', fontWeight: "500" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#ffffff", borderRadius: "50%", width: "28px", height: "28px", boxShadow: "0 2px 6px rgba(180, 140, 255, 0.1)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b48cff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          คลิกเพื่อตรวจสอบ{hintText}
        </div>
      )}
    </div>
  );
})}
          </div>
          
          {projects.length > 2 && (
            <div style={{ marginTop: "40px", display: "flex", justifyContent: "center" }}>
              <button 
                onClick={() => setShowAllProjects(!showAllProjects)}
                style={{
                  background: "#ffffff",
                  border: "1px solid #eadeff",
                  borderRadius: "999px",
                  padding: "10px 24px",
                  color: "#6b50c5",
                  fontSize: "14px",
                  fontWeight: "600",
                  fontFamily: '"Mitr", sans-serif',
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: "0 2px 8px rgba(107, 80, 197, 0.04)",
                  transition: "all 0.3s cubic-bezier(0.25, 0, 0.1, 1)"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "#faf8ff";
                  e.currentTarget.style.borderColor = "#c574ff";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(107, 80, 197, 0.08)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "#ffffff";
                  e.currentTarget.style.borderColor = "#eadeff";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(107, 80, 197, 0.04)";
                }}
              >
                {showAllProjects ? "Show less" : "Show more"}
                <svg 
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transform: showAllProjects ? "rotate(180deg)" : "none", transition: "transform 0.3s ease" }}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>
          )}
        </div>
      </section>
      <footer className="footer">
        <p className="footer-line1">-`♡´- Fansite Project made by RollzyBunny</p>
        <p className="footer-line2">Original Content & Artist © by Independent Artist Management (iAM).</p>
      </footer>
    </div>
  );
}

/*const maskNumber = (num) => {
    const str = Number(num).toLocaleString(); 
    
    // 🌟 ถ้าโหวตจบแล้ว ให้คืนค่าตัวเลขเต็มๆ กลับไปเลยโดยไม่แสดง X
    if (IS_VOTING_ENDED) return str; 

    if (str.length <= 1) return str;
    
    return str.charAt(0) + str.slice(1).replace(/[0-9]/g, 'X'); 

  }; */
export default TokenPage;