import { useEffect, useState } from "react";
import Navbar from "./Navbar.jsx"; 

function TokenPage() {
  const [totalTokens, setTotalTokens] = useState(0);

  useEffect(() => {
    // เลื่อนขึ้นบนสุดเมื่อโหลดหน้า
    window.scrollTo(0, 0);

    const fetchData = () => {
      // ⚠️ นำ Sheet ID และ ชื่อแท็บ มาใส่ตรงนี้ ⚠️
      // รูปแบบ: https://opensheet.elk.sh/[SHEET_ID]/[ชื่อแท็บ]
      fetch("https://opensheet.elk.sh/1LdYwevfbc_sFhD8BKaBEEoYdTWLApQ5apSD9WIJRFz4/Sheet1")
        .then(res => res.json())
        .then(data => {
          
          // คำนวณผลรวมจากคอลัมน์ "Tokens"
          const grandTotal = data.reduce((sum, row) => {
            // ดักไว้ว่า ถ้าคอลัมน์ Number เขียนว่า "Total Tokens" ให้ข้ามไป ไม่ต้องเอามาบวก
            if (row.Number !== "Total Tokens") {
               // นำตัวเลขในคอลัมน์ Tokens มาบวกกัน
              return sum + Number(row.Tokens || 0);
            }
            return sum;
          }, 0);

          setTotalTokens(grandTotal);
        })
        .catch(error => console.error("Error fetching tokens:", error));
    };

    fetchData();
    // อัปเดตข้อมูลอัตโนมัติทุกๆ 5 วินาที
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-root">
      <Navbar />
      
      {/* ใช้โทนสีและการจัดวางแบบเดียวกับหน้าอื่นๆ */}
      <main className="page-section page-section--tone2">
        <div className="page-section-inner" style={{ textAlign: "center", padding: "60px 20px" }}>
          
          <div className="section-header">
            <h2>Total Tokens</h2>
            <p>ยอดรวม Tokens จากโปรโมชั่นทั้งหมด</p>
          </div>

          <div style={{
            background: "#ffffff",
            borderRadius: "24px",
            padding: "40px",
            maxWidth: "400px",
            margin: "30px auto",
            boxShadow: "0 12px 26px rgba(150, 125, 215, 0.2)",
            border: "1px solid rgba(197, 116, 255, 0.22)"
          }}>
            <h2 style={{ 
              fontSize: "82px", 
              margin: 0, 
              background: "linear-gradient(135deg, var(--accent), var(--accent-mint))",
              WebkitBackgroundClip: "text",
              color: "transparent"
            }}>
              {/* ใส่ toLocaleString() เพื่อให้มีลูกน้ำคั่นหลักพัน */}
              {totalTokens.toLocaleString()}
            </h2>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p className="footer-line1">-`♡´- Fansite Project made by RollzyBunny</p>
        <p className="footer-line2">Original Content & Artist © by Independent Artist Management (iAM).</p>
      </footer>
    </div>
  );
}

export default TokenPage;