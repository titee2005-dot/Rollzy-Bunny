import { useEffect, useState, useRef } from "react";
import Navbar from "./Navbar.jsx"; 

// 1. Component ล้อหมุนตัวเลข (Odometer)
function Digit({ targetValue, trigger, digitIndex, forceSpin }) {
  const [offset, setOffset] = useState(0);
  
  // ⏳ ความเร็วเดิมที่คุณตั้งไว้
  const duration = 2.0 + (digitIndex * 3.5); 
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
    <div style={{
      display: "inline-block",
      height: "82px",
      width: "46px",
      overflow: "hidden",
      textAlign: "center",
      margin: "0 1px"
    }}>
      <div style={{
        display: "block",
        transition: transition,
        transform: `translateY(-${offset * 82}px)`, 
      }}>
        {digitsArray.map((d, i) => (
          <div key={i} style={{
            height: "82px",
            lineHeight: "82px",
            fontFamily: '"Bebas Neue", sans-serif',
            fontSize: "82px",
            fontWeight: "bold",
            background: "linear-gradient(135deg, var(--accent), var(--accent-mint))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            {d}
          </div>
        ))}
      </div>
    </div>
  );
}

// 2. Component หั่นตัวเลขเป็นหลักๆ
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
      elements.unshift(
        <span key={`comma-${stableKey}`} style={{
          fontSize: "82px",
          fontFamily: '"Bebas Neue", sans-serif',
          fontWeight: "bold",
          lineHeight: "65px",
          background: "linear-gradient(135deg, var(--accent), var(--accent-mint))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          margin: "0 2px"
        }}>
          ,
        </span>
      );
    } else {
      const forceSpin = diff >= Math.pow(10, currentDigitIndex);
      elements.unshift(
        <Digit 
          key={`digit-${stableKey}`} 
          targetValue={parseInt(char)} 
          trigger={value} 
          digitIndex={currentDigitIndex} 
          forceSpin={forceSpin} 
        />
      );
      currentDigitIndex++;
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", height: "82px" }}>
      {elements}
    </div>
  );
}

// 3. หน้า TokenPage หลัก
function TokenPage() {
  const [totalTokens, setTotalTokens] = useState(0);
  const [projects, setProjects] = useState([]); 
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchData = () => {
      fetch("https://opensheet.elk.sh/1LdYwevfbc_sFhD8BKaBEEoYdTWLApQ5apSD9WIJRFz4/Sheet1")
        .then(res => res.json())
        .then(data => {
          let grandTotal = 0;
          let projectList = [];

          data.forEach(row => {
            if (row.Number && row.Number !== "Total Tokens") {
              grandTotal += Number(row.Tokens || 0);
              projectList.push(row); 
            }
          });

          setTotalTokens(grandTotal);
          setProjects(projectList);
        })
        .catch(error => console.error("Error fetching tokens:", error));
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return; 
    
    setIsSearching(true);
    setHasSearched(true);
    setSearchResult(null);

    try {
      const res = await fetch("https://opensheet.elk.sh/1LdYwevfbc_sFhD8BKaBEEoYdTWLApQ5apSD9WIJRFz4/Status");
      const data = await res.json();

      const found = data.find(row => 
        row.Wallet && row.Wallet.toString().toLowerCase() === searchQuery.trim().toLowerCase()
      );

      if (found) {
        setSearchResult(found);
      } else {
        setSearchResult({ error: "ไม่พบข้อมูล Wallet นี้ในระบบ โปรดตรวจสอบความถูกต้อง" });
      }
    } catch (error) {
      console.error("Search Error:", error);
      setSearchResult({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล โปรดลองอีกครั้ง" });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="app-root">
      <Navbar />
      
      <style>
        {`
          @keyframes pulse-dot {
            0% { transform: scale(0.8); opacity: 0.5; }
            50% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(0.8); opacity: 0.5; }
          }
          .project-card {
            transition: transform 0.25s ease, box-shadow 0.25s ease;
          }
          .project-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 16px 32px rgba(180, 140, 255, 0.18);
          }
        `}
      </style>

      {/* ==============================================
          SECTION 1: TOTAL TOKENS
          ============================================== */}
      <section className="page-section" style={{ 
        background: "radial-gradient(circle at top, #ffffff 0%, #faf5ff 50%, #fff0f8 100%)",
        padding: "60px 0 20px",
        minHeight: "calc(100vh - 80px)", /* 👈 เพิ่มบรรทัดนี้: บังคับให้สูงเต็มจอ ดันเนื้อหาอื่นลงไป */
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      }}>
        <div className="page-section-inner" style={{ textAlign: "center", padding: "0 20px" }}>
          
          <div className="section-header" style={{ marginBottom: "24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <img 
              src="/bnktoken.png" 
              alt="BNK Token" 
              style={{
                height: "56px", 
                width: "auto",
                marginBottom: "16px",
                filter: "drop-shadow(0 4px 8px rgba(130, 90, 180, 0.2))"
              }}
            />
            <h2 style={{ fontSize: "56px", margin: "0 0 8px 0" }}>TOTAL TOKENS</h2>
            <p style={{ fontSize: "18px", color: "#8a7b9e" }}>ยอดรวม Tokens จากโปรเจกต์ทั้งหมด</p>
          </div>

          <div style={{
            position: "relative",
            background: "linear-gradient(180deg, #ffffff 0%, #fdfcff 100%)", 
            borderRadius: "32px",
            padding: "40px 20px 32px", 
            width: "100%",
            maxWidth: "400px", 
            margin: "0 auto",
            boxShadow: "0 24px 50px rgba(180, 140, 255, 0.15), 0 0 0 1px rgba(197, 116, 255, 0.1), inset 0 2px 0 rgba(255,255,255,0.9)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}>
            
            {totalTokens === 0 ? (
               <div style={{ height: "82px", display: "flex", alignItems: "center" }}>
                 <span style={{ 
                    fontSize: "82px", 
                    fontFamily: '"Bebas Neue", sans-serif', 
                    fontWeight: "bold", 
                    background: "linear-gradient(135deg, var(--accent), var(--accent-mint))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    opacity: 0.2 
                 }}>0</span>
               </div>
            ) : (
               <NumberTicker value={totalTokens} />
            )}

            <div style={{
              marginTop: "24px", 
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 12px", 
              background: "#f4f0ff",
              borderRadius: "999px",
              border: "1px solid #eadeff"
            }}>
              <div style={{
                width: "7px",
                height: "7px",
                backgroundColor: "#22c55e", 
                borderRadius: "50%",
                animation: "pulse-dot 2s infinite ease-in-out"
              }} />
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#6b50c5", letterSpacing: "0.02em" }}>
                LIVE UPDATE
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ==============================================
          SECTION 2: PROJECT BREAKDOWN
          ============================================== */}
      <section className="page-section" style={{ padding: "40px 0" }}>
        <div className="page-section-inner" style={{ textAlign: "center", padding: "0 20px" }}>
          
          <div className="section-header" style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "32px", color: "#2c2537", fontFamily: '"Bebas Neue", sans-serif', letterSpacing: "0.05em", margin: "0 0 4px 0" }}>
              TOKENS BY PROJECT
            </h2>
            <p style={{ fontSize: "15px", color: "#8a7b9e" }}>รายละเอียดจากแต่ละโปรเจกต์ย่อย</p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
            maxWidth: "900px",
            margin: "0 auto"
          }}>
            {projects.map((proj, index) => (
              <div key={index} className="project-card" style={{
                background: "#ffffff",
                borderRadius: "24px",
                padding: "24px 20px",
                border: "1px solid rgba(197, 116, 255, 0.18)",
                boxShadow: "0 8px 24px rgba(180, 140, 255, 0.08)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}>
                <div style={{ fontSize: "24px", marginBottom: "8px", filter: "drop-shadow(0 2px 4px rgba(255,182,232,0.4))" }}>🌸</div>
                
                <h4 style={{ margin: "0 0 12px 0", fontSize: "15px", color: "#6b50c5", fontWeight: "600", fontFamily: '"Mitr", sans-serif' }}>
                  {proj.Number}
                </h4>
                
                <div style={{
                  fontSize: "36px",
                  fontFamily: '"Bebas Neue", sans-serif',
                  background: "linear-gradient(135deg, var(--accent), var(--accent-mint))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: "bold",
                  lineHeight: "1"
                }}>
                  {Number(proj.Tokens || 0).toLocaleString()}
                </div>
                <div style={{ fontSize: "12px", color: "#a093b5", marginTop: "6px", fontWeight: "500", letterSpacing: "0.05em" }}>
                  TOKENS
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ==============================================
          SECTION 3: SEARCH STATUS
          ============================================== */}
      <section className="page-section page-section--tone2" id="check-status" style={{ padding: "50px 0 70px" }}>
        <div className="page-section-inner" style={{ textAlign: "center", padding: "0 20px" }}>
          
          <div className="section-header" style={{ marginBottom: "24px" }}>
            <h2 style={{ fontSize: "36px", fontFamily: '"Bebas Neue", sans-serif' }}>CHECK STATUS</h2>
            <p>ตรวจสอบสถานะการโอนบัตรของคุณ</p>
          </div>

          <div style={{
            maxWidth: "500px",
            margin: "0 auto",
            background: "#ffffff",
            padding: "36px 24px",
            borderRadius: "24px",
            border: "1px solid rgba(197, 116, 255, 0.22)",
            boxShadow: "0 12px 26px rgba(150, 125, 215, 0.12)"
          }}>
            <h3 style={{ fontSize: "18px", color: "#4a3c68", margin: "0 0 20px 0", fontFamily: '"Mitr", sans-serif' }}>
              ระบุเลข Wallet
            </h3>
            
            <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
              <input
                type="text"
                placeholder="0x1234abcd..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                style={{
                  flex: "1",
                  minWidth: "220px",
                  padding: "14px 20px",
                  borderRadius: "999px",
                  border: "1px solid #d8b4fe",
                  outline: "none",
                  fontSize: "15px",
                  color: "#333",
                  backgroundColor: "#fcfaff",
                  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)"
                }}
              />
              <button
                onClick={handleSearch}
                disabled={isSearching}
                style={{
                  padding: "14px 28px",
                  borderRadius: "999px",
                  background: "linear-gradient(135deg, var(--accent), var(--accent-mint))",
                  color: "#fff",
                  border: "none",
                  fontSize: "15px",
                  fontWeight: "bold",
                  cursor: isSearching ? "wait" : "pointer",
                  opacity: isSearching ? 0.7 : 1,
                  boxShadow: "0 4px 12px rgba(197, 116, 255, 0.3)",
                  transition: "transform 0.1s"
                }}
              >
                {isSearching ? "กำลังค้นหา..." : "ค้นหา"}
              </button>
            </div>

            {hasSearched && (
              <div style={{ marginTop: "24px", animation: "heroFadeInUp 0.4s ease-out forwards" }}>
                {searchResult?.error ? (
                  <div style={{ padding: "18px", background: "#fff1f2", color: "#be123c", borderRadius: "16px", border: "1px solid #fecdd3", fontSize: "14.5px" }}>
                    ❌ {searchResult.error}
                  </div>
                ) : searchResult ? (
                  <div style={{ padding: "20px", background: "#fcf9ff", color: "#4a044e", borderRadius: "16px", border: "1px solid #eadeff", textAlign: "left" }}>
                    <p style={{ margin: "0 0 12px", fontSize: "15px", color: "#9333ea", fontWeight: "600" }}>✅ พบข้อมูลของคุณในระบบ</p>
                    <p style={{ margin: "0 0 10px", fontSize: "14px", color: "#6b7280", wordBreak: "break-all" }}>
                      <strong>Wallet:</strong> <span style={{ color: "#374151" }}>{searchResult.Wallet}</span>
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "12px", paddingTop: "12px", borderTop: "1px dashed #eadeff" }}>
                      <span style={{ fontSize: "15px", fontWeight: "bold" }}>สถานะ:</span>
                      <span style={{ 
                        background: searchResult.Status === "กำลังดำเนินการ" ? "#fef08a" : "#bbf7d0", 
                        color: searchResult.Status === "กำลังดำเนินการ" ? "#854d0e" : "#166534",
                        padding: "6px 14px", 
                        borderRadius: "999px", 
                        fontSize: "14px", 
                        fontWeight: "bold" 
                      }}>
                        {searchResult.Status}
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
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

export default TokenPage;