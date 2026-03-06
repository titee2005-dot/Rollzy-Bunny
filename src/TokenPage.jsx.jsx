import { useEffect, useState, useRef } from "react";
import Navbar from "./Navbar.jsx"; 

// 1. Component ล้อหมุนตัวเลข (Odometer)
function Digit({ targetValue, trigger, digitIndex, forceSpin }) {
  const [offset, setOffset] = useState(0);
  const duration = 2.0 + (digitIndex * 0.35); 
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

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchData = () => {
      fetch("https://opensheet.elk.sh/1LdYwevfbc_sFhD8BKaBEEoYdTWLApQ5apSD9WIJRFz4/Sheet1")
        .then(res => res.json())
        .then(data => {
          const grandTotal = data.reduce((sum, row) => {
            if (row.Number !== "Total Tokens") {
              return sum + Number(row.Tokens || 0);
            }
            return sum;
          }, 0);
          setTotalTokens(grandTotal);
        })
        .catch(error => console.error("Error fetching tokens:", error));
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-root">
      <Navbar />
      
      <main className="page-section" style={{ 
        background: "radial-gradient(circle at top, #ffffff 0%, #faf5ff 50%, #fff0f8 100%)",
        minHeight: "calc(100vh - 120px)", 
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      }}>
        <div className="page-section-inner" style={{ textAlign: "center", padding: "40px 20px" }}>
          
          {/* 🎨 ย้ายภาพเหรียญ/โลโก้มาไว้ตรงนี้ เหนือคำว่า TOTAL TOKENS */}
          <div className="section-header" style={{ marginBottom: "24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <img 
              src="/bnktoken.png" 
              alt="Rose Icon" 
              style={{
                height: "56px", /* ปรับให้ใหญ่ขึ้นนิดนึงเพื่อให้รับกับหัวข้อ */
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
            padding: "40px 20px 32px", /* เพิ่ม padding ด้านบนให้กลับมาสมดุลเพราะเอารูปออกไปแล้ว */
            width: "100%",
            maxWidth: "400px", 
            margin: "0 auto",
            boxShadow: "0 24px 50px rgba(180, 140, 255, 0.15), 0 0 0 1px rgba(197, 116, 255, 0.1), inset 0 2px 0 rgba(255,255,255,0.9)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            overflow: "hidden" 
          }}>
            
            {/* โชว์เฉพาะตัวเลขวิ่งเน้นๆ ในการ์ดสีขาว */}
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
              <style>
                {`
                  @keyframes pulse-dot {
                    0% { transform: scale(0.8); opacity: 0.5; }
                    50% { transform: scale(1.2); opacity: 1; }
                    100% { transform: scale(0.8); opacity: 0.5; }
                  }
                `}
              </style>
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
      </main>

      <footer className="footer">
        <p className="footer-line1">-`♡´- Fansite Project made by RollzyBunny</p>
        <p className="footer-line2">Original Content & Artist © by Independent Artist Management (iAM).</p>
      </footer>
    </div>
  );
}

export default TokenPage;