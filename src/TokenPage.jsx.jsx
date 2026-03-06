import { useEffect, useState, useRef } from "react";
import Navbar from "./Navbar.jsx"; 

// 1. Component ล้อหมุนตัวเลข (Odometer)
function Digit({ targetValue, trigger, digitIndex, forceSpin }) {
  const [offset, setOffset] = useState(0);
  
  // หลักหน่วยหยุดก่อน (0.6s) หลักสิบหยุดตาม (0.75s) หลักร้อยหยุดตาม (0.9s)
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
      
      // ✅ ถ้าเลขเดิมเป๊ะ และไม่ได้ถูกบังคับให้หมุนตามหลักอื่น ให้หยุดนิ่ง!
      if (currentDigit === targetValue && !forceSpin) {
        return prev;
      }

      let steps = targetValue - currentDigit;
      
      // ถ้าเป้าหมายคือเลขเดิม แต่ถูกบังคับให้หมุน (forceSpin) มันจะบวก 10 เพื่อหมุนครบรอบพอดี
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

// 2. Component หั่นตัวเลขเป็นหลักๆ พร้อมระบบเช็กระยะทาง
function NumberTicker({ value }) {
  const stringValue = value.toLocaleString(); 
  const chars = stringValue.split("");
  const length = chars.length;

  // จำค่ายอดรวมก่อนหน้าเอาไว้ เพื่อหาว่าเพิ่มขึ้นมาเท่าไหร่
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
      // ✅ กฎเหล็ก: ถ้าผลต่างของยอดรวม มีค่า >= ค่าประจำหลักของตัวเอง แปลว่าหลักนั้นต้องโดนลากให้หมุนด้วย!
      // เช่น 175 -> 185 (ผลต่าง = 10) / หลักหน่วยมีค่าแค่ 1 (10 >= 1) หลักหน่วยเลยโดนบังคับหมุน
      const forceSpin = diff >= Math.pow(10, currentDigitIndex);

      elements.unshift(
        <Digit 
          key={`digit-${stableKey}`} 
          targetValue={parseInt(char)} 
          trigger={value} 
          digitIndex={currentDigitIndex} 
          forceSpin={forceSpin} // ส่งคำสั่งบังคับหมุนไปให้ลูก
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
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-root">
      <Navbar />
      
      <main className="page-section page-section--tone2">
        <div className="page-section-inner" style={{ textAlign: "center", padding: "60px 20px" }}>
          
          <div className="section-header">
            <h2>Total Tokens</h2>
            <p>ยอดรวม Tokens จากโปรเจกต์ทั้งหมด</p>
          </div>

          <div style={{
            background: "#ffffff",
            borderRadius: "24px",
            padding: "40px",
            maxWidth: "450px",
            margin: "30px auto",
            boxShadow: "0 12px 26px rgba(150, 125, 215, 0.2)",
            border: "1px solid rgba(197, 116, 255, 0.22)",
            display: "flex",
            justifyContent: "center",
            overflow: "hidden" 
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
                    opacity: 0.3 
                 }}>0</span>
               </div>
            ) : (
               <NumberTicker value={totalTokens} />
            )}

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