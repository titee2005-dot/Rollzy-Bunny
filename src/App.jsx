import "./App.css";
import Navbar from "./Navbar.jsx";
import EventsSection from "./EventsSection.jsx";
import { useState, useEffect } from "react";


/* ตัวช่วยห่อแต่ละ section ให้พื้นหลังเต็มจอ แต่เนื้อหาอยู่กลาง */
function PageSection({ id, tone, children }) {
  return (
    <section id={id} className={`page-section page-section--${tone}`}>
      <div className="page-section-inner section-reveal">
        {children}
      </div>
    </section>
  );
}

function Hero() {
  return (
    <section className="hero-image-section" id="home">

      {/* รูปพื้นหลังเต็มจอ */}
      <div
        className="hero-image-bg"
        style={{ backgroundImage: "url('/rose-hero.jpg')" }}
      />

      {/* ชั้นทับมืดบาง ๆ */}
      <div className="hero-image-overlay" />

      {/* ข้อความกลางจอแบบสวย ๆ */}
      <div className="hero-image-content">
        <h1 className="hero-name-main fade-in-main">Rose BNK48</h1>
        <h2 className="hero-name-sub fade-in-sub">Panisara Buranapha</h2>
      </div>
    </section>
  );
}

function AboutSection() {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="about-layout">
      {/* รูป */}
      <aside className="about-photo-card">
        <div className="about-photo-frame">
          <img src="/rose-about.jpg" alt="Rose BNK48" />
        </div>
        {/* <p className="about-photo-caption">
        
        </p> */}
      </aside>

      {/* เนื้อหา */}
      <div className="about-text">

        {/* หัวข้อ */}
        <div className="about-header">
          <h2>Rose - Panisara Buranapha</h2> {/*
          <p>
            มุมเล็ก ๆ สำหรับแฟนคลับที่อยากรู้จัก Rose... 🌟
          </p> */}
        </div>

        {/* Chip */}
        <div className="about-chip-row">
          <span className="about-chip">BNK48 6th Generation</span>
      {/*    <span className="about-chip">Panisara Buranapha</span>
          <span className="about-chip">Nickname · Rose</span> */}
        </div>

        {/* เนื้อหาปกติ */}
        <div className="about-body">
          <p>
            "หนูมีความฝันอยากเป็นศิลปิน อยากเป็นนักร้องมาตั้งแต่เด็กๆ แต่หลังจากได้รู้จัก BNK48 ช่วงคุกกี้เสี่ยงทายก็ทำให้มีความรู้สึกอยากเป็นไอดอลมาตั้งแต่ตอนนั้น ในอีก 10 ปีข้างหน้า หนูอยากเห็นตัวเองที่ยังเป็นไอดอลอยู่ ยังมี Passion ยังไม่หมดไฟ และยังตั้งใจทำตามความฝันต่อไป" - Rose BNK48
            {/*<br/>
            ปาณิสรา บูรณาภา 💕*/}
          </p>

          {/* ========== เนื้อหาแบบซ่อน ========== */}
          {showMore && (
            <div className="about-more">
              <p>
                ข้อมูลทั่วไป
              </p>
              {/*<p>
                รออัปเดต
              </p> */}
              <ul className="about-list">
                <li>Date of birth : 1 November 2007</li>
                <li>Height : 167 cm</li>
                <li>Province : นครปฐม</li>
                <li>Like : แมว / สุนัข / กระต่าย / อาหารญี่ปุ่น / ปิ้งย่าง / ส้มตำ</li>
                <li>Blood Group : B</li>
                <li>Hobby : ดูซีรีส์ / เล่นเกม / ช็อปปิ้ง / แต่งนิยาย</li>
              </ul>
            </div>
          )}

          {/* ปุ่มแสดงเพิ่มเติม */}
          <button
            className="about-more-btn"
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? "ซ่อนเนื้อหา" : "อ่านเพิ่มเติม"}
          </button>
        </div>
      </div>
    </div>
  );
}


function DiscographySection() {
  const items = [
    {
      name: 'Hokori no Oka – เนินเขาแห่งความฝัน',
      role: 'เพลงหลัก · CGM48 3rd Album',
      note: 'หนึ่งในผลงานที่หลายคนเริ่มสังเกตเอมม่าได้ชัดขึ้น',
      thumb: 'https://via.placeholder.com/360x220.png?text=Hokori+no+Oka',
    },
    {
      name: 'Yume wa Nigenai – จะไม่หนีจากความฝัน',
      role: 'เดบิวต์รุ่นที่ 2 ของ CGM48',
      note: 'เพลงโทนอุ่น ๆ เหมาะเปิดตอนคิดถึงความฝันของตัวเอง',
      thumb: 'https://via.placeholder.com/360x220.png?text=Yume+wa+Nigenai',
    },
    {
      name: 'Heart no Dasshutsu Game – ปริศนาห้องหัวใจ',
      role: 'Coupling song · 9th Single',
      note: 'เพลงสนุก ๆ สไตล์เกมปริศนา ฟังแล้วอารมณ์ดี',
      thumb:
        'https://via.placeholder.com/360x220.png?text=Heart+no+Dasshutsu+Game',
    },
  ];

 return (
  <section id="highlight" className="page-section page-section--tone1">
    <div className="page-section-inner">
      <div className="section-header highlight-header">
        <h2>Highlight</h2>
        <p>
          รวม Highlight ของโรส 💜
        </p>
      </div>

      <div className="highlight-grid">
        {/* การ์ดไฮไลต์หลัก */}
        <article className="highlight-card highlight-card--main">
          <div className="highlight-thumb">
              <iframe width="560" height="315" src="https://www.youtube.com/embed/jRVOQHriw2w?si=JrkTROA3HZVPAFqL" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
          </div>
          <div className="highlight-body">
            <span className="highlight-tag">Music Video</span>
            <h3 className="highlight-title">
            【MV full】Doushitemo Kimi ga Suki da – จะยังไงก็รักเธอ / BNK48
            </h3>
            <p class="highlight-desc"> 
              <span class="d2"><strong>Premiered Oct 11, 2025</strong></span><br />
              <span class="d2">BNK48 20th Single Coupling Song</span><br />
              <span class="d2">BNK48 6th Generation Debut Song</span><br />
              <span class="d3">「Doushitemo Kimi ga Suki da – จะยังไงก็รักเธอ」</span>
            </p>
          </div>
        </article>

        {/* การ์ดไฮไลต์อื่น ๆ */}
        <article className="highlight-card">
          <div className="highlight-thumb small">
            <iframe width="560" height="315" src="" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
          </div>

          <div className="highlight-body">
            <span className="highlight-tag">About Rose</span>
            <h3 className="highlight-title">THEN & NOW</h3>
            <p className="highlight-desc">
              Self-Reflection of [ #RoseBNK48 ]
            </p>
          </div>
        </article>

        <article className="highlight-card">
          <div className="highlight-thumb small">
           <iframe width="560" height="315" src="https://www.youtube.com/embed/HiIjepatb2A?si=cHnXtO9jMIp10wmq" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
          </div>
          <div className="highlight-body">
            <span className="highlight-tag">Stage Performance</span>
            <h3 className="highlight-title">MIX- Special Olympic Charity Concert Pink Panther</h3>
            <p className="highlight-desc">
              [Rose BNK48] Fancam <span className="credit-strong">by Phoenixcz Room</span>
            </p>
          </div>
        </article>

      </div>
    </div>
  </section>
);

}

function SocialSection() {
  return (
    <section id="social" className="page-section page-section--tone2">
      <div className="page-section-inner">
        <div className="section-header social-header">
          <h2>SOCIAL MEDIA</h2>
          <p>
            รวม Social Media 
          </p>
        </div>

        {/* บนสุด: IG + TikTok */}
        <div className="social-main-grid">
          {/* Instagram */}
          <article className="social-card">
            <a
              href="https://www.instagram.com/rose.bnk48office/#"
              target="_blank"
              rel="noopener noreferrer"
              className="social-banner social-banner--ig"
            >
              <div className="social-banner-left">
                <span className="social-platform">
                <img src="/igicon.png" alt="IG" className="social-icon" />
                <span>Instagram (กำลังแก้)</span>
                </span>
          
                <span className="social-handle">@rose.bnk48office</span>
              </div>
              <span className="social-arrow">↗</span>
            </a>

          <div className="social-embed social-embed--ig">
  <iframe
    src="https://e556eb91e82148e19eac24d4dbdc6adf.elf.site"
    className="insta-widget"
    scrolling="no"
    allowTransparency="true"
    frameBorder="0"
    style={{ width: "100%", border: 0, overflow: "hidden" }}
  ></iframe>
</div>
          </article>

          {/* TikTok */}
          <article className="social-card">
  <a
    href="https://www.tiktok.com/@rose.bnk48official"
    target="_blank"
    rel="noopener noreferrer"
    className="social-banner social-banner--tt"
  >
    <div className="social-banner-left">
      <span className="social-platform">
      <img src="/tiktokicon.png" alt="TikTok" className="social-icon" />
      <span>TikTok</span>
      </span>
      <span className="social-handle">@rose.bnk48official</span>
    </div>
    <span className="social-arrow">↗</span>
  </a>

  <div className="social-embed social-embed--tt">
    <blockquote
      className="tiktok-embed"
      cite="https://www.tiktok.com/@rose.bnk48official"
      data-unique-id="rose.bnk48official"
      data-embed-type="creator"
      style={{ maxWidth: "780px", minWidth: "288px" }}
    >
      <section>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.tiktok.com/@rose.bnk48official?refer=creator_embed"
        >
          @rose.bnk48official
        </a>
      </section>
    </blockquote>
    {/* ไม่ต้องใส่ <script> ตรงนี้แล้ว เพราะเราไปใส่ใน index.html แล้ว */}
  </div>
</article>
        </div>

        {/* แถวล่าง: ปุ่มไป Facebook / iAM48 */}
       {/* แถวล่าง: Facebook + iAM48 แบบแบนเนอร์เต็มๆ */}
<div className="social-extra-row">
  <a
    href="https://www.facebook.com/rose.bnk48official"
    target="_blank"
    rel="noopener noreferrer"
    className="social-chip social-chip--fb"
  >
    <div className="social-chip-left">
      {/* โลโก้ Facebook (ใส่ไฟล์ใน public เช่น /icon-fb.png) */}
      <img src="/fblogo2.png" alt="Facebook" className="social-chip-logo-fb" />
      <div className="social-chip-text">
        <span className="social-chip-label">Facebook</span>
        <span className="social-chip-handle">Rose BNK48 Official</span>
      </div>
    </div>
    <span className="social-chip-arrow">↗</span>
  </a>

  <a
    href="https://app.bnk48.com/member-profile/157"
    target="_blank"
    rel="noopener noreferrer"
    className="social-chip social-chip--iam"
  >
    <div className="social-chip-left">
      {/* โลโก้ iAM48 (ใส่ไฟล์ใน public เช่น /icon-iam48.png) */}
      <img src="/iamlogo.png" alt="iAM48" className="social-chip-logo-iam" />
      <div className="social-chip-text">
        <span className="social-chip-label">iAM48</span>
        <span className="social-chip-handle">Rose</span>
      </div>
    </div>
    <span className="social-chip-arrow">↗</span>
  </a>
</div>
      </div>
    </section>
  );
}

function GallerySection() {
  const [selectedItem, setSelectedItem] = useState(null);
  
  const items = [
    { id: 1, src: "/memepic1.JPG", big: true,label: "Meme", credit: "BNK_Story"}, // รูปใหญ่ 4x4
    { id: 2, src: "/hwpic1.JPG", label: "Halloween", credit: "Rollzy_Bunny" },
    { id: 3, src: "/bdpic1.JPG", label: "Halloween", credit: "Rollzy_Bunny" },
    { id: 4, src: "/hwpic2.JPG", label: "Halloween", credit: "Rollzy_Bunny" },
    { id: 5, src: "/hwpic3.JPG", label: "Halloween", credit: "Rollzy_Bunny" },
    { id: 6, src: "/hwpic4.JPG", label: "Halloween", credit: "Rollzy_Bunny" },
    { id: 7, src: "/hwpic5.JPG", mobileOnly: true, label: "Halloween", credit: "BNK_Story" }, // รูปเฉพาะมือถือ
  ];

  return (
    <section id="gallery" className="page-section page-section--tone1">
      <div className="page-section-inner">
        <div className="gallery-header">
          <div className="section-header">
            <h2>Gallery</h2>
            <p>รวมโมเมนต์น่ารัก ๆ ของน้อง</p>
          </div>
        </div>

        <div className="gallery-home-grid">
          {items.map((item) => (
            <div
              key={item.id}
              className={
                "gallery-home-cell" +
                (item.big ? " gallery-home-cell--big" : "") +
                (item.mobileOnly ? " gallery-home-cell--mobile" : "")
              }
            >
              <div className="home-gallery-wrapper">
    <img
      src={item.src}
      alt=""
      className="home-gallery-img"
      onClick={() => setSelectedItem(item)}
      
    />

    {/* overlay ที่จะขึ้นตอน hover */}
    <div className="home-gallery-overlay">
      <h3>{item.label || "Coming Soon"}</h3>
      <p>By {item.credit || "ระบุชื่อเจ้าของภาพ"}</p>
    </div>
  </div>
</div>
        ))}
      </div>

      {/* Modal แบบเดียวกับหน้า All Gallery */}
      {selectedItem && (
        <GalleryModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
         <div className="gallery-all-wrapper">
          <a href="/gallery" className="gallery-all-btn">
            All
          </a>
        </div>
      </div>
    </section>
  );
}


/*Rollzy Bunny*/

function RollzyBunnySection() {
  const [open, setOpen] = useState(false);

  return (
    <section id="rollzy" className="page-section page-section--tone1">
      <div className="page-section-inner rollzy-layout">
        {/* ฝั่งซ้าย: ข้อความ + ปุ่ม */}
        <div className="rollzy-left">
          <img src="rollzy-title.png" alt="Rollzy Bunny" className="title-image" />
          <p className="rollzy-lead">
            Rose BNK48 Supporters 𐔌՞. .՞𐦯
          </p>
          <p className="rollzy-subtitle">
            มาร่วมเป็นชาว Rose's Garden ไปด้วยกัน～
          </p>

        <div className="rollzy-actions-row">
            <div className="rollzy-actions">
              <a
                href="https://line.me/ti/g2/Unlc6VfjqNXos90q-mWUW80tatHddPT-11-3Gg?utm_source=invitation&utm_medium=link_copy&utm_campaign=default"
                target="_blank"
                rel="noopener noreferrer"
                className="rollzy-btn rollzy-btn--primary"
              >
                เข้าร่วม OpenChat
              </a>

              <button
                type="button"
                className="rollzy-btn rollzy-btn--ghost"
                onClick={() => setOpen(true)}
              >
                ช่องทางแฟนด้อมทั้งหมด
              </button>
            </div>

            {/* รูปเล็กสำหรับมือถือ อยู่ขวาของปุ่ม */}
            <div className="rollzy-mobile-preview">
              <div className="rollzy-preview-card">
                <div className="rollzy-preview-grid">
                  <img src="/sns.jpeg" alt="Rollzy Bunny SNS" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ฝั่งขวา: รูป preview (เช่น รูปหน้าเพจ FB / layout สวย ๆ ) */}
        <div className="rollzy-right">
  <div className="rollzy-preview-card">
    <div className="rollzy-preview-grid">
      <img src="/sns.jpeg" alt="Rollzy photo 1" />
      <img src="/sns3.jpeg" alt="Rollzy photo 2" />
    </div>
  </div>
</div>
      </div>

      {/* Modal / Popup */}
      {open && (
        <div
          className="rollzy-modal-backdrop"
          onClick={() => setOpen(false)}
        >
          <div
            className="rollzy-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="rollzy-modal-title">ช่องทางติดตามแฟนด้อม</h3>
            <p className="rollzy-modal-text">
              สามารถติดตามแฟนด้อมได้จากด้านล่างนี้
            </p>

            <div className="rollzy-channel-list">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/ROLLZYBUNNY"
                target="_blank"
                rel="noopener noreferrer"
                className="rollzy-channel rollzy-channel--fb"
              >
                <span className="rollzy-channel-left">
                  <img
                    src="/fblogo2.png"
                    alt="Facebook"
                    className="rollzy-channel-logo-fb"
                  />
                  <span className="rollzy-channel-name">Rollzy Bunny - Rose BNK48 Supporters </span>
                </span>
                <span className="rollzy-channel-arrow">↗</span>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/rollzybunny?igsh=MTVremY3NTltb29zZw=="
                target="_blank"
                rel="noopener noreferrer"
                className="rollzy-channel rollzy-channel--ig"
              >
                <span className="rollzy-channel-left">
                  <img
                    src="/igicon3.png"
                    alt="Instagram"
                    className="rollzy-channel-logo-ig"
                  />
                  <span className="rollzy-channel-name">rollzybunny</span>
                </span>
                <span className="rollzy-channel-arrow">↗</span>
              </a>

              {/* X */}
              <a
                href="https://x.com/rollzybunny?s=21"
                target="_blank"
                rel="noopener noreferrer"
                className="rollzy-channel rollzy-channel--x"
              >
                <span className="rollzy-channel-left">
                  <img
                    src="/xicon.png"
                    alt="X"
                    className="rollzy-channel-logo-x"
                  />
                  <span className="rollzy-channel-name">ROLLZYBUNNY</span>
                </span>
                <span className="rollzy-channel-arrow">↗</span>
              </a>

              {/* Line OpenChat */}
              <a
                href="https://line.me/ti/g2/Unlc6VfjqNXos90q-mWUW80tatHddPT-11-3Gg?utm_source=invitation&utm_medium=link_copy&utm_campaign=default/"
                target="_blank"
                rel="noopener noreferrer"
                className="rollzy-channel rollzy-channel--line"
              >
                <span className="rollzy-channel-left">
                  <img
                    src="/opcicon.png"
                    alt="Line OpenChat"
                    className="rollzy-channel-logo-opc"
                  />
                  <span className="rollzy-channel-name">Rollzy Bunny - Rose BNK48 Supporters </span>
                </span>
                <span className="rollzy-channel-arrow">↗</span>
              </a>
            </div>

            <button
              className="rollzy-modal-close"
              onClick={() => setOpen(false)}
            >
              <strong>ปิดหน้าต่าง</strong>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function Footer() {
  return (
    <>
    {/*  <footer className="footer-top">
        <p>Fansite Project made by RollzyBunny</p>
      </footer> */}

      <footer className="footer">
        <p2>-`♡´- Fansite Project made by RollzyBunny</p2>
        <p>Original Content & Artist © by Independent Artist Management (iAM).</p>
      </footer>
    </>
  );
}

function App() {
  // เลื่อนขึ้นบนสุดตอนเข้าเพจ
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // เอฟเฟกต์เลื่อนแล้วค่อยโผล่
  useEffect(() => {
  const elements = document.querySelectorAll(".section-reveal");

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // ใส่คลาส visible → เล่นเอฟเฟกต์ครั้งเดียว
          entry.target.classList.add("visible");

          // เลิกสังเกต element นี้เพื่อไม่ให้เล่นซ้ำ
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.04 }
  );

  elements.forEach((el) => observer.observe(el));

  return () => observer.disconnect();
}, []);

  return (
    <div className="app-root">
      <Navbar />
      <Hero />

      <PageSection id="about" tone="light">
        <AboutSection />
      </PageSection>

      <PageSection id="schedule" tone="purple">
        <EventsSection />
      </PageSection>

      <PageSection id="discography" tone="light">
        <DiscographySection />
      </PageSection>

      <PageSection id="social" tone="purple">
        <SocialSection />
      </PageSection>

      <PageSection id="gallery" tone="light">
        <GallerySection />
      </PageSection>

      <PageSection id="rollzy" tone="purple">
        <RollzyBunnySection />
      </PageSection>

      <Footer />
    </div>
  );
}

/*ของ Navbar */
window.addEventListener("load", () => {
  const { hash } = window.location;
  if (hash) {
    const el = document.querySelector(hash);
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth" });
      }, 100); // ดีเลย์เล็กน้อยให้ DOM โหลดให้ครบ
    }
  }
});

export default App;


