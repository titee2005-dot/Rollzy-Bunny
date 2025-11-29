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
                <li>Upcoming</li>
                <li>Upcoming</li>
                <li>Upcoming</li>
                <li>Upcoming</li>
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
      desc: "จิงโจ้",
      image: "/event1.jpg",
      link: "https://example.com/event1" // ← ลิงก์ของ event 1
    },
    {
      title: "Handshake Event",
      date: "27-28 ธันวาคม 2025",
      place: "MCC HALL 3F, The Mall Bangkapi",
      desc: "งานจับมือ",
      image: "/event2.jpg",
      link: "https://example.com/event2" // ← ลิงก์ของ event 2
    },
    {
      title: "Hi-Touch & Fansign",
      date: "1 กุมภาพันธ์ 2026",
      place: "TBA",
      desc: "กีฬาสี",
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
            <p>เลื่อนดูงานที่กำลังจะมาถึงของโรสแล้ววางแพลนไปเจอกันนน 💜</p>
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
                <span className="social-platform">Instagram</span>
                <span className="social-handle">@rose.bnk48office</span>
              </div>
              <span className="social-arrow">↗</span>
            </a>

          <div className="social-embed social-embed--ig">
            
  <blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/p/DQjrkUllX58/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:16px;"> <a href="https://www.instagram.com/p/DQjrkUllX58/?utm_source=ig_embed&amp;utm_campaign=loading" style=" background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank"> <div style=" display: flex; flex-direction: row; align-items: center;"> <div style="background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 40px; margin-right: 14px; width: 40px;"></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 100px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 60px;"></div></div></div><div style="padding: 19% 0;"></div> <div style="display:block; height:50px; margin:0 auto 12px; width:50px;"><svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-511.000000, -20.000000)" fill="#000000"><g><path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path></g></g></g></svg></div><div style="padding-top: 8px;"> <div style=" color:#3897f0; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:550; line-height:18px;">ดูโพสต์นี้บน Instagram</div></div><div style="padding: 12.5% 0;"></div> <div style="display: flex; flex-direction: row; margin-bottom: 14px; align-items: center;"><div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(0px) translateY(7px);"></div> <div style="background-color: #F4F4F4; height: 12.5px; transform: rotate(-45deg) translateX(3px) translateY(1px); width: 12.5px; flex-grow: 0; margin-right: 14px; margin-left: 2px;"></div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(9px) translateY(-18px);"></div></div><div style="margin-left: 8px;"> <div style=" background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 20px; width: 20px;"></div> <div style=" width: 0; height: 0; border-top: 2px solid transparent; border-left: 6px solid #f4f4f4; border-bottom: 2px solid transparent; transform: translateX(16px) translateY(-4px) rotate(30deg)"></div></div><div style="margin-left: auto;"> <div style=" width: 0px; border-top: 8px solid #F4F4F4; border-right: 8px solid transparent; transform: translateY(16px);"></div> <div style=" background-color: #F4F4F4; flex-grow: 0; height: 12px; width: 16px; transform: translateY(-4px);"></div> <div style=" width: 0; height: 0; border-top: 8px solid #F4F4F4; border-left: 8px solid transparent; transform: translateY(-4px) translateX(8px);"></div></div></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center; margin-bottom: 24px;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 224px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 144px;"></div></div></a><p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;"><a href="https://www.instagram.com/p/DQjrkUllX58/?utm_source=ig_embed&amp;utm_campaign=loading" style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none;" target="_blank">โพสต์ที่แชร์โดย BNK48 (@bnk48)</a></p></div></blockquote>
<script async src="//www.instagram.com/embed.js"></script>
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
                <span className="social-handle">@rose.bnk48official</span>
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
            ???
          </p>
          <p className="rollzy-subtitle">
            ???
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
              สามารถติดตามแฟนด้อมได้จากด้านล่างนี้
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


