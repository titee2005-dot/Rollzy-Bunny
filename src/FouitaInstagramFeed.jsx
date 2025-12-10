// src/FouitaInstagramFeed.jsx
import { useEffect } from "react";

function FouitaInstagramFeed() {
  useEffect(() => {
    const container = document.getElementById("ft-insta-app");
    if (!container) return;

    // กันไม่ให้ init ซ้ำ (โดยเฉพาะตอน dev ที่ React strict mode เรียกสองรอบ)
    if (container.dataset.ftInstaLoaded === "1") return;
    container.dataset.ftInstaLoaded = "1";

    // ✅ เช็คว่าตอนนี้เป็น mobile ไหม (กว้างไม่เกิน 768px)
    const isMobile = window.innerWidth <= 768;

    // ค่าที่ใช้ร่วมกันทุก layout
    const baseSettings = {
      source: "insta",
      selected: "uname",
      header: true,
      autoplay: true,
      zigzag: false,
      bgColor: "",
      txtColor: "",
      ukey: "6b4e1928-8f46-4376-a4ac-13b20122ecc5", // ใช้ key เดิมของคุณ
    };

    // 🎯 layout สำหรับคอม / แท็บเล็ต
    const desktopSettings = {
      ...baseSettings,
      layout: "carousel",  // layout เดิมของคุณ
      cols: 3,
      cardHeight: 350,
      gap: 0,
      direction: "down",
      height: 420,         // ปรับให้ใกล้เคียงความสูง TikTok บนคอม
    };

    // 📱 layout สำหรับมือถือ (ใช้ layout อีกแบบของ Fouita)
    const mobileSettings = {
      ...baseSettings,
       "layout": "carousel",
  "autoplay": false,
  "cols": 4,
  "cardHeight": null,
  "height": 420,
  "ukey": "6b4e1928-8f46-4376-a4ac-13b20122ecc5"
    };

    // เลือก settings ตามอุปกรณ์
    const settings = isMobile ? mobileSettings : desktopSettings;

    const script = document.createElement("script");
    script.type = "module";
    script.innerHTML = `
      import App from "https://cdn.fouita.com/public/instagram-feed.js?11";

      const settings = ${JSON.stringify(settings)};

      new App({
        target: document.getElementById("ft-insta-app"),
        props: { settings }
      });
    `;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="ig-scroll-wrapper">
      <div id="ft-insta-app" />
      <div id="ft-insta-brd">
        <a
          href="https://fouita.com/website-widgets/instagram-feed"
          target="_blank"
          rel="noreferrer"
        >
          Embed Instagram Feed
        </a>
        <a href="https://fouita.com" target="_blank" rel="noreferrer">
          with Fouita
        </a>
      </div>
    </div>
  );
}

export default FouitaInstagramFeed;
