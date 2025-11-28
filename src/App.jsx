import './App.css';

function Navbar() {
  return (
    <header className="nav-wrapper">
      <nav className="nav">
        <div className="nav-logo">Rose's Garden</div>
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About Rose</a>
          <a href="#schedule">Schedule</a>
          <a href="#discography">Highlight</a>
          <a href="#social">Social Media</a>
          <a href="#fans">Rollzy Bunny</a>
        </div>
      </nav>
    </header>
  );
}

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



import { useState } from "react";

function AboutSection() {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="about-layout">
      {/* รูป */}
      <aside className="about-photo-card">
        <div className="about-photo-frame">
          <img src="/rose-about.jpg" alt="Rose BNK48" />
        </div>
        <p className="about-photo-caption">
         
        </p>
      </aside>

      {/* เนื้อหา */}
      <div className="about-text">

        {/* หัวข้อ */}
        <div className="about-header">
          <h2>รู้จัก Rose ให้มากขึ้น</h2>
          <p>
            มุมเล็ก ๆ สำหรับแฟน ๆ ที่อยากรู้จัก Rose... 🌟
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
            Rose เป็นเมมเบอร์ที่มีเสน่ห์ทั้งบนเวทีและเวลาพูดคุยนอกเวที
            ยิ่งดูแฟนแคมก็ยิ่งรู้สึกว่ามีเสน่ห์เฉพาะตัวแบบที่หยุดดูไม่ได้เลย 💕
          </p>

          {/* ========== เนื้อหาแบบซ่อน ========== */}
          {showMore && (
            <div className="about-more">
              <p>
                หนึ่งในสิ่งที่แฟน ๆ ชอบคือความเป็นธรรมชาติของ Rose
                ทั้งการพูดคุยแบบเป็นกันเองและความตั้งใจที่ใส่ลงไปในทุกสเตจ
                ทำให้ทุกการแสดงรู้สึกพิเศษและมีเสน่ห์ในแบบที่ไม่มีใครเหมือน
              </p>
              <p>
                ไม่ว่าจะเป็นเพลงเท่ เพลงหวาน หรือเพลงสนุก
                Rose จะมี mood และเสน่ห์ที่ต่างกันไปในแต่ละเพลง
                ซึ่งเป็นสิ่งที่ทำให้แฟน ๆ รอชมการแสดงใหม่ ๆ ของเธอเสมอ
              </p>
              <ul className="about-list">
                <li>Upcoming</li>
                <li>Upcoming</li>
                <li>??</li>
                <li>??</li>
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

function EventsSection() {
  const events = [
    {
      title: "Kangaroo Village Christmas Festival",
      date: "19 – 21 ธันวาคม 2025",
      place: "MCC HALL 3F, The Mall Bangkae",
      desc: "บรรยากาศคริสต์มาสสุดน่ารัก พร้อมไฟและฉากเทศกาล",
      image: "/event1.jpg",
      link: "https://example.com/event1" // ← ลิงก์ของ event 1
    },
    {
      title: "Rose Special Stage",
      date: "27-29 ธันวาคม 2025",
      place: "Bangkok, Thailand",
      desc: "สเตจพิเศษรวมเพลงของ Rose แบบจัดเต็ม",
      image: "/event2.jpg",
      link: "https://example.com/event2" // ← ลิงก์ของ event 2
    },
    {
      title: "Hi-Touch & Fansign",
      date: "2 กุมภาพันธ์ 2026",
      place: "ประกาศสถานที่ภายหลัง",
      desc: "โอกาสเจอ Rose ใกล้ ๆ และทักทายกันแบบอบอุ่น",
      image: "/event3.jpg",
      link: "https://example.com/event3" // ← ลิงก์ของ event 3
    },
  ];

  return (
    <section id="schedule" className="page-section page-section--tone2">
      <div className="page-section-inner">

        <div className="events-header">
          <div className="section-header">
            <h2>ROSE UPCOMING EVENTS</h2>
            <p>เลื่อนดูงานที่กำลังจะมาถึงของ Rose แล้ววางแพลนไปเจอกัน 💜</p>
          </div>

          {/* ปุ่มไปหน้ารวมกิจกรรมทั้งหมด */}
          <a 
            href="/all-schedule"   // ← หน้าใหม่
            className="all-schedule-btn"
          >
            All Schedule
          </a>
        </div>

        <div className="card-row">
          {events.map((ev, index) => (
            <a 
              key={index} 
              href={ev.link}         // ← ลิงก์ของกิจกรรม 
              target="_blank"
              className="event-card"
            >
              <div className="event-thumb">
                <img src={ev.image} alt={ev.title} />
              </div>

              <div className="event-body">
                <div className="event-meta-row">
                  <span className="event-pill">Upcoming</span>
                  <span className="event-date">{ev.date}</span>
                </div>

                <h3 className="event-title">{ev.title}</h3>
                <p className="event-place">{ev.place}</p>
                <p className="event-desc">{ev.desc}</p>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
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
          รวมโมเมนต์ที่แฟน ๆ พูดถึงบ่อยที่สุดของ Rose — ทั้งสเตจ, แฟนแคม และเหตุการณ์พิเศษที่ทำให้ตกหลุมรักซ้ำ ๆ 💜
        </p>
      </div>

      <div className="highlight-grid">
        {/* การ์ดไฮไลต์หลัก */}
        <article className="highlight-card highlight-card--main">
          <div className="highlight-thumb">
              <iframe
                src="https://youtu.be/embed/jRVOQHriw2w?si=prEuoDIeWFFpdtzc"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
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
            <iframe
              src="https://www.youtube.com/embed/abc123XYZ"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
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
            <span className="highlight-tag">MC / Talk</span>
            <h3 className="highlight-title">Upcoming</h3>
            <p className="highlight-desc">
              Upcoming
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
            รวมช่องทางหลักที่แฟน ๆ ใช้ตาม Rose — IG, TikTok, Facebook และ iAM48 💜
          </p>
        </div>

        {/* บนสุด: IG + TikTok */}
        <div className="social-main-grid">
          {/* Instagram */}
          <article className="social-card">
            <a
              href="https://www.instagram.com/yourinsta_here"
              target="_blank"
              rel="noopener noreferrer"
              className="social-banner social-banner--ig"
            >
              <div className="social-banner-left">
                <span className="social-platform">Instagram</span>
                <span className="social-handle">@yourinsta_here</span>
              </div>
              <span className="social-arrow">↗</span>
            </a>

            <div className="social-embed social-embed--ig">
              {/* เปลี่ยน src เป็น embed จริงของ IG */}
              <iframe
                src="https://www.instagram.com/p/xxxxxxxxx/embed"
                allowTransparency="true"
                frameBorder="0"
                scrolling="no"
              />
            </div>
          </article>

          {/* TikTok */}
          <article className="social-card">
            <a
              href="https://www.tiktok.com/@yourtiktok_here"
              target="_blank"
              rel="noopener noreferrer"
              className="social-banner social-banner--tt"
            >
              <div className="social-banner-left">
                <span className="social-platform">TikTok</span>
                <span className="social-handle">@yourtiktok_here</span>
              </div>
              <span className="social-arrow">↗</span>
            </a>

            <div className="social-embed social-embed--tt">
              {/* เปลี่ยน src เป็น embed จริงของ TikTok */}
              <iframe
                src="https://www.tiktok.com/embed/v2/xxxxxxxxx"
                frameBorder="0"
                scrolling="no"
                allow="encrypted-media;"
              />
            </div>
          </article>
        </div>

        {/* แถวล่าง: ปุ่มไป Facebook / iAM48 */}
       {/* แถวล่าง: Facebook + iAM48 แบบแบนเนอร์เต็มๆ */}
<div className="social-extra-row">
  <a
    href="https://www.facebook.com/yourfacebook_here"
    target="_blank"
    rel="noopener noreferrer"
    className="social-chip social-chip--fb"
  >
    <div className="social-chip-left">
      {/* โลโก้ Facebook (ใส่ไฟล์ใน public เช่น /icon-fb.png) */}
      <img src="/icon-fb.png" alt="Facebook" className="social-chip-logo" />
      <div className="social-chip-text">
        <span className="social-chip-label">Facebook</span>
        <span className="social-chip-handle">Rose BNK48 Official</span>
      </div>
    </div>
    <span className="social-chip-arrow">↗</span>
  </a>

  <a
    href="https://www.iam48.com/"
    target="_blank"
    rel="noopener noreferrer"
    className="social-chip social-chip--iam"
  >
    <div className="social-chip-left">
      {/* โลโก้ iAM48 (ใส่ไฟล์ใน public เช่น /icon-iam48.png) */}
      <img src="/icon-iam48.png" alt="iAM48" className="social-chip-logo" />
      <div className="social-chip-text">
        <span className="social-chip-label">iAM48</span>
        <span className="social-chip-handle">Profile & Schedule</span>
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
          <h2 className="rollzy-title">Rollzy Bunny</h2>
          <p className="rollzy-lead">
            แฟนด้อมที่มาไกลกว่าการติดตาม
          </p>
          <p className="rollzy-subtitle">
            รับชมผลงาน ติดตามข่าวสาร และพูดคุยกันยาว ๆ รู้จักมุมเบื้องหลัง
            และคอยส่งกำลังใจให้ Rollzy ไปด้วยกันในทุกสเตจ
          </p>

          <div className="rollzy-actions">
            <a
              href="https://facebook.com/"
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
              เลือกช่องทางที่สะดวกสำหรับติดตามประกาศ งาน และกิจกรรมของ Rollzy Bunny
              ได้จากด้านล่างนี้
            </p>

            <div className="rollzy-channel-list">
              {/* Facebook */}
              <a
                href="https://facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="rollzy-channel rollzy-channel--fb"
              >
                <span className="rollzy-channel-left">
                  <img
                    src="/icon-fb.png"
                    alt="Facebook"
                    className="rollzy-channel-logo"
                  />
                  <span className="rollzy-channel-name">Facebook Page</span>
                </span>
                <span className="rollzy-channel-arrow">↗</span>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="rollzy-channel rollzy-channel--ig"
              >
                <span className="rollzy-channel-left">
                  <img
                    src="/icon-ig.png"
                    alt="Instagram"
                    className="rollzy-channel-logo"
                  />
                  <span className="rollzy-channel-name">Instagram</span>
                </span>
                <span className="rollzy-channel-arrow">↗</span>
              </a>

              {/* X */}
              <a
                href="https://x.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="rollzy-channel rollzy-channel--x"
              >
                <span className="rollzy-channel-left">
                  <img
                    src="/icon-x.png"
                    alt="X"
                    className="rollzy-channel-logo"
                  />
                  <span className="rollzy-channel-name">X (Twitter)</span>
                </span>
                <span className="rollzy-channel-arrow">↗</span>
              </a>

              {/* Line OpenChat */}
              <a
                href="https://line.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="rollzy-channel rollzy-channel--line"
              >
                <span className="rollzy-channel-left">
                  <img
                    src="/icon-line.png"
                    alt="Line OpenChat"
                    className="rollzy-channel-logo"
                  />
                  <span className="rollzy-channel-name">Line OpenChat</span>
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

export default App;


