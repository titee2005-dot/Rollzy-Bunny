// src/FouitaInstagramFeed.jsx
import { useEffect } from "react";

function FouitaInstagramFeed() {
  useEffect(() => {
    const container = document.getElementById("ft-insta-app");
    if (!container) return;

    // กันไม่ให้ init ซ้ำ (โดยเฉพาะตอน dev ที่ React strict mode เรียกสองรอบ)
    if (container.dataset.ftInstaLoaded === "1") return;
    container.dataset.ftInstaLoaded = "1";

    const script = document.createElement("script");
    script.type = "module";
    script.innerHTML = `
      import App from "https://cdn.fouita.com/public/instagram-feed.js?11";
      new App({
        target: document.getElementById("ft-insta-app"),
        props: {
          settings: {
            layout: "masonry",
            source: "insta",
            selected: "uname",
            header: true,
            autoplay: true,
            zigzag: true,
            cols: 3,
            cardHeight: 300,
            gap: 1,
            direction: "down",
            height: 420,
            bgColor: "",
            txtColor: "",
            ukey: "6b4e1928-8f46-4376-a4ac-13b20122ecc5"
          }
        }
      });
    `;
    document.body.appendChild(script);

    // ถ้าจะ cleanup ตอน unmount ก็เขียนเพิ่มได้ แต่ส่วนใหญ่ไม่จำเป็น
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
