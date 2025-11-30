import './App.css';
import Navbar from "./Navbar.jsx";
import EventsSection from "./EventsSection.jsx";
import { useState } from "react";

/* ตัวช่วยห่อแต่ละ section ให้พื้นหลังเต็มจอ แต่เนื้อหาอยู่กลาง */
function PageSection({ id, tone, children }) {
  return (
    <section id={id} className={`page-section page-section--${tone}`}>
      <div className="page-section-inner">{children}</div>
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
          <h2>รู้จัก Rose ให้มากขึ้น</h2>
          <p>
            มุมเล็ก ๆ สำหรับแฟนคลับที่อยากรู้จัก Rose... 🌟
          </p>
        </div>

        {/* Chip */}
        <div className="about-chip-row">
          <span className="about-chip">BNK48 6th Generation</span>
          <span className="about-chip">Nickname · Rose</span>
          <span className="about-chip">Panisara Buranapha</span>
        </div>

        {/* เนื้อหาปกติ */}
        <div className="about-body">
          <p>
            Rose ... 💕
          </p>

          {/* ========== เนื้อหาแบบซ่อน ========== */}
          {showMore && (
            <div className="about-more">
              <p>
                รออัปเดต
              </p>
              <p>
                รออัปเดต
              </p>
              <ul className="about-list">
                <li>Coming Soon</li>
                <li>Coming Soon</li>
                <li>Coming Soon</li>
                <li>Coming Soon</li>
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
            <span className="highlight-tag">MV</span>
            <h3 className="highlight-title">
              【MV full】Doushitemo Kimi ga Suki da – จะยังไงก็รักเธอ / BNK48
            </h3>
            <p className="highlight-desc">
              Debut Song
            </p>
          </div>
        </article>

        {/* การ์ดไฮไลต์อื่น ๆ */}
        <article className="highlight-card">
          <div className="highlight-thumb small">
            <iframe width="560" height="315" src="https://www.youtube.com/embed/jRVOQHriw2w?si=JrkTROA3HZVPAFqL" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
          </div>

          <div className="highlight-body">
            <span className="highlight-tag">Then & Now</span>
            <h3 className="highlight-title">Then & Now</h3>
            <p className="highlight-desc">
              Upcoming
            </p>
          </div>
        </article>

        <article className="highlight-card">
          <div className="highlight-thumb small">
            <iframe
              src="https://www.youtube.com/embed/abc123XYZ"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
          <div className="highlight-body">
            <span className="highlight-tag">TBA</span>
            <h3 className="highlight-title">Coming Soon</h3>
            <p className="highlight-desc">
              Coming Soon
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
            รวม Social Media 💜
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
                <span>Instagram</span>
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

function RollzyBunnySection() {
  const [open, setOpen] = useState(false);

  return (
    <section id="rollzy" className="page-section page-section--tone1">
      <div className="page-section-inner rollzy-layout">
        {/* ฝั่งซ้าย: ข้อความ + ปุ่ม */}
        <div className="rollzy-left">
          <img src="rollzy-title.png" alt="Rollzy Bunny" className="title-image" />
          <p className="rollzy-lead">
            แฟนด้อม
          </p>
          <p className="rollzy-subtitle">
            Coming Soon
          </p>

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
        </div>

        {/* ฝั่งขวา: รูป preview (เช่น รูปหน้าเพจ FB / layout สวย ๆ ) */}
        <div className="rollzy-right">
  <div className="rollzy-preview-card">
    <div className="rollzy-preview-grid">
      <img src="/rollzy-1.png" alt="Rollzy photo 1" />
      <img src="/rollzy-2.png" alt="Rollzy photo 2" />
      <img src="/rollzy-3.png" alt="Rollzy photo 3" />
      <img src="/rollzy-4.png" alt="Rollzy photo 4" />
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
            <h3 className="rollzy-modal-title">ช่องทางติดตามข่าวสาร</h3>
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
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <p>
        Fan-made site
        <br />
        Original Content & Artist © by Independent Artist Management (iAM).
      </p>
    </footer>
  );
}

function App() {
  return (
    <div className="app-root">
      <Navbar />
      
      {/* HERO วิดีโอเต็มจอ */}
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

      <PageSection id="rollzy" tone="light">
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


