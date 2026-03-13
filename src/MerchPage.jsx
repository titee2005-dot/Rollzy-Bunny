import { useEffect, useState } from "react";
import Navbar from "./Navbar.jsx"; 

function MerchPage() {
  const [stock, setStock] = useState({ type1: 5, type2: 5, type3: 5 });
  const [loading, setLoading] = useState(true);

  // ตั้งค่าสต็อกสูงสุด
  const MAX_STOCK = 5;

  useEffect(() => {
    // ⚠️ ตรวจสอบชื่อแท็บ (Sheet Name) ด้านล่างของไฟล์ Google Sheet ให้ตรงเป๊ะๆ
    const SHEET_ID = "1gcPQi93xQ8IawQxGoUvj1uim0sex8vPBztv8JH9e2yY";
    const tab1 = "Form Responses 1";
    const tab2 = "Form Responses 2";
    const tab3 = "Form Responses 3";

    const fetchStock = async () => {
      try {
        // ดึงข้อมูลพร้อมกันทั้ง 3 แท็บ
        const [res1, res2, res3] = await Promise.all([
          fetch(`https://opensheet.elk.sh/${SHEET_ID}/${tab1}`).then(r => r.json()),
          fetch(`https://opensheet.elk.sh/${SHEET_ID}/${tab2}`).then(r => r.json()),
          fetch(`https://opensheet.elk.sh/${SHEET_ID}/${tab3}`).then(r => r.json())
        ]);

        // นับจำนวนแถวที่ได้มา (จำนวนคนสั่งซื้อ)
        const count1 = Array.isArray(res1) ? res1.length : 0;
        const count2 = Array.isArray(res2) ? res2.length : 0;
        const count3 = Array.isArray(res3) ? res3.length : 0;

        setStock({
          type1: Math.max(0, MAX_STOCK - count1),
          type2: Math.max(0, MAX_STOCK - count2),
          type3: Math.max(0, MAX_STOCK - count3)
        });
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching merch stock:", err);
        setLoading(false); 
      }
    };

    // 1. เรียกดึงข้อมูลครั้งแรกทันที
    fetchStock();

    // 2. ให้แอบดึงข้อมูลใหม่ทุกๆ 5 วินาที (5000ms) 
    // ⚠️ ไม่แนะนำให้ตั้งเป็น 0 เพราะจะทำให้ API บล็อกการเข้าถึงได้
    const interval = setInterval(() => {
      fetchStock();
    }, 0);

    // 3. ดึงข้อมูลทันทีเมื่อสลับแท็บกลับมาจากหน้าฟอร์ม
    const handleFocus = () => {
      fetchStock(); 
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };

  }, []);

  const items = [
    { 
      id: 'type1', 
      name: 'ป้ายไฟ แบบที่ 1', 
      remaining: stock.type1, 
      link: 'https://docs.google.com/forms/d/e/1FAIpQLSePw09CT2tCAq-VY1GcB-Nfrzqz57cv4wz5P61UTqUiTmpG2A/viewform?usp=pp_url&entry.123456=แบบที่+1', 
      img: '/sign1.jpg' 
    },
    { 
      id: 'type2', 
      name: 'ป้ายไฟ แบบที่ 2', 
      remaining: stock.type2, 
      link: 'https://docs.google.com/forms/d/e/1FAIpQLSfSDTMJXGohX2J4Z38XD67zDEDjGWgYpuvndA8YZWKJ42Oj8A/viewform?usp=pp_url&entry.123456=แบบที่+2', 
      img: '/sign2.jpg' 
    },
    { 
      id: 'type3', 
      name: 'ป้ายไฟ แบบที่ 3', 
      remaining: stock.type3, 
      link: 'https://docs.google.com/forms/d/e/1FAIpQLSe74kjgahgynXyfglkd1N2BOgMKXVwbLjezLFKGO1EQG8xQ1g/viewform?usp=pp_url&entry.123456=แบบที่+3', 
      img: '/sign3.jpg' 
    },
  ];

  return (
    <div className="app-root">
      <Navbar />

      <section className="page-section" style={{ background: "#fff9fc", padding: "80px 20px", minHeight: "calc(100vh - 70px)" }}>
        <div className="page-section-inner" style={{ textAlign: "center", width: "100%", maxWidth: "1000px", margin: "0 auto" }}>
          
          <div className="section-header" style={{ marginBottom: "40px" }}>
            <h2 style={{ fontSize: "42px", fontFamily: '"Bebas Neue", sans-serif', color: "#2c2537", marginBottom: "8px", letterSpacing: "0.04em" }}>SPECIAL MERCH</h2>
            <p style={{ fontSize: "18px", color: "#8a7b9e", fontFamily: '"Mitr", sans-serif', margin: 0 }}>✦ สั่งซื้อป้ายไฟ (Limited Edition ลายละ 5 ชิ้น) ✦</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            {items.map(item => {
              const isSoldOut = item.remaining === 0;

              return (
                <div key={item.id} style={{
                  background: "#ffffff",
                  borderRadius: "24px",
                  overflow: "hidden",
                  border: "1px solid rgba(197, 116, 255, 0.18)",
                  boxShadow: "0 10px 28px rgba(180, 140, 255, 0.08)",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  opacity: isSoldOut ? 0.7 : 1,
                  cursor: "default"
                }}
                onMouseEnter={(e) => { if(!isSoldOut && !loading) e.currentTarget.style.transform = "translateY(-6px)"; }}
                onMouseLeave={(e) => { if(!isSoldOut && !loading) e.currentTarget.style.transform = "none"; }}
                >
                  <div style={{ position: "relative", width: "100%", aspectRatio: "1/1", backgroundColor: "#f8f6ff" }}>
                    <img src={item.img} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    {isSoldOut && !loading && (
                      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "42px", fontFamily: '"Bebas Neue", sans-serif', letterSpacing: "0.05em" }}>
                        SOLD OUT
                      </div>
                    )}
                  </div>
                  
                  <div style={{ padding: "24px", display: "flex", flexDirection: "column", flex: 1, alignItems: "center" }}>
                    <h3 style={{ fontSize: "18px", fontWeight: "600", fontFamily: '"Mitr", sans-serif', color: "#2c2537", margin: "0 0 8px 0" }}>{item.name}</h3>
                    <p style={{ fontSize: "15px", color: "#6b50c5", fontWeight: "500", fontFamily: '"Mitr", sans-serif', margin: "0 0 24px 0" }}>
                      {loading ? "กำลังเช็คสต็อก..." : `เหลือ ${item.remaining} / ${MAX_STOCK} ชิ้น`}
                    </p>
                    
                    {loading ? (
                      <button disabled style={{ marginTop: "auto", width: "100%", padding: "12px", borderRadius: "999px", background: "#f1f5f9", color: "#94a3b8", border: "1px solid #e2e8f0", fontSize: "15px", fontWeight: "600", fontFamily: '"Mitr", sans-serif', cursor: "wait" }}>
                        รอสักครู่...
                      </button>
                    ) : isSoldOut ? (
                      <button disabled style={{ marginTop: "auto", width: "100%", padding: "12px", borderRadius: "999px", background: "#f1f5f9", color: "#94a3b8", border: "1px solid #e2e8f0", fontSize: "15px", fontWeight: "600", fontFamily: '"Mitr", sans-serif', cursor: "not-allowed" }}>
                        สินค้าหมด
                      </button>
                    ) : (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ marginTop: "auto", width: "100%", padding: "12px", borderRadius: "999px", background: "linear-gradient(135deg, #c574ff, #f8b6e8)", color: "#ffffff", border: "none", fontSize: "15px", fontWeight: "600", fontFamily: '"Mitr", sans-serif', textDecoration: "none", cursor: "pointer", display: "inline-block", textAlign: "center", boxShadow: "0 4px 16px rgba(197, 116, 255, 0.3)", transition: "opacity 0.2s ease" }}
                      onMouseEnter={(e) => e.target.style.opacity = "0.9"}
                      onMouseLeave={(e) => e.target.style.opacity = "1"}
                      >
                        สั่งซื้อลายนี้
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
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

export default MerchPage;