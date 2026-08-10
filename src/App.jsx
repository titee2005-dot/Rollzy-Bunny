// src/App.jsx
import "./App.css";
import Navbar from "./Navbar.jsx";
import EventsSection from "./EventsSection.jsx";
import { useState, useEffect, useRef } from "react"; // เพิ่ม useRef ตรงนี้
import FouitaInstagramFeed from "./FouitaInstagramFeed.jsx";

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
        style={{ backgroundImage: "url('/rose-cover1.JPG')" }}
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
          <img src="/rose-about2.jpg" alt="Rose BNK48" />
        </div>
      </aside>

      {/* เนื้อหา */}
      <div className="about-text">
        {/* หัวข้อ */}
        <div className="about-header">
          <h2>Rose - Panisara Buranapha</h2>
        </div>

        {/* Chip */}
        <div className="about-chip-row">
          <span className="about-chip-box">
             <span className="about-chip-text">BNK48 6th Generation</span>
          </span>
        </div>

        {/* เนื้อหาปกติ */}
        <div className="about-body">
          <p>
            "หนูมีความฝันอยากเป็นศิลปิน อยากเป็นนักร้องมาตั้งแต่เด็กๆ แต่หลังจากได้รู้จัก BNK48 ช่วงคุกกี้เสี่ยงทายก็ทำให้มีความรู้สึกอยากเป็นไอดอลมาตั้งแต่ตอนนั้น ในอีก 10 ปีข้างหน้า หนูอยากเห็นตัวเองที่ยังเป็นไอดอลอยู่ ยังมี Passion ยังไม่หมดไฟ และยังตั้งใจทำตามความฝันต่อไป" - Rose BNK48
          </p>

          {/* ========== เนื้อหาแบบซ่อน ========== */}
          {showMore && (
            <div className="about-more">
              <p>ข้อมูลทั่วไป</p>
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
            {showMore ? "ซ่อนเนื้อหา" : "ข้อมูลทั่วไป"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------- แก้ไข DiscographySection: ดูบนเว็บได้ + กดการ์ดเด้งไป YouTube ----------------
function DiscographySection() {
  const releases = [
    {
      id: 1,
      title: "【MV full】แค่เพียงมีเธอ (Kimi-iru)",
      type: "Music Video",
      date: "Mar 27, 2026",
      desc: "BNK48 with Tatuya Ishii & Lamyai Haithongkham",
      videoId: "GZDde4_izAw", 
      featured: true,
      badge: "First Time Center"
    },
    {
      id: 2,
      title: "【MV full】Doushitemo Kimi ga Suki da",
      type: "Music Video • Debut Song",
      date: "Oct 11, 2025",
      videoId: "jRVOQHriw2w"
    },
    {
      id: 3,
      title: "รำวง Matsuri",
      type: "Fancam",
      date: "By Rollzy Bunny",
      videoId: "86HOIKF-T44"
    },
    {
      id: 4,
      title: "Coming Soon",
      type: "Fancam",
      date: "By...",
      videoId: "" 
    }
  ];

  const featured = releases.find(r => r.featured);
  const others = releases.filter(r => !r.featured);

  return (
    <div className="discography-container">
      <div className="pink-section-header">
        <h2>Discography</h2>
        <div className="pink-line"></div>
      </div>

      {/* 🌟 การ์ดเด่นด้านบน */}
      {/* ห่อการ์ดด้วย <a> เพื่อให้กดพื้นที่ว่าง/ข้อความแล้วไป YouTube ได้ */}
      <a 
        href={featured.videoId ? `https://www.youtube.com/watch?v=${featured.videoId}` : "#"} 
        target="_blank" 
        rel="noreferrer" 
        className="disco-featured-card"
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <div className="disco-featured-img">
          {/* ฝัง iframe เพื่อให้กด Play ดูบนเว็บได้เลย */}
          {featured.videoId ? (
            <iframe 
              src={`https://www.youtube.com/embed/${featured.videoId}`} 
              title={featured.title}
              allowFullScreen>
            </iframe>
          ) : (
            <div style={{width: '100%', height: '100%', background: '#f5f5f5'}}></div>
          )}
        </div>
        <div className="disco-featured-info">
          <span className="disco-badge">{featured.badge}</span>
          <h3 className="disco-title-lg">{featured.title}</h3>
          <p className="disco-meta-lg">{featured.type} • {featured.date}</p>
          <p className="disco-desc-lg">{featured.desc}</p>
        </div>
      </a>

      {/* 📱 การ์ดรอง 3 คลิปด้านล่าง */}
      <div className="disco-grid">
        {others.map((item) => (
          <a 
            key={item.id} 
            href={item.videoId ? `https://www.youtube.com/watch?v=${item.videoId}` : "#"} 
            target="_blank" 
            rel="noreferrer" 
            className="disco-mini-card"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className="disco-mini-img">
              {item.videoId ? (
                <iframe 
                  src={`https://www.youtube.com/embed/${item.videoId}`} 
                  title={item.title}
                  allowFullScreen>
                </iframe>
              ) : (
                <div style={{width: '100%', height: '100%', background: '#fcfcfc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc'}}>No Video</div>
              )}
            </div>
            <div className="disco-mini-body">
              <span className="disco-mini-tag">{item.type}</span>
              <h4 className="disco-mini-title">{item.title}</h4>
              <p className="disco-mini-date">{item.date}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

// ---------------- เพิ่ม HighlightSection ใหม่ ----------------
function HighlightSection() {
  const [isPlaying, setIsPlaying] = useState(true);
  const iframeRef = useRef(null);

  // ฟังก์ชันหยุด/เล่นวิดีโอ (ทำงานเฉพาะเมื่อกดปุ่มควบคุมเท่านั้น)
  const togglePlay = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const command = isPlaying ? 'pauseVideo' : 'playVideo';
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: command, args: '' }),
        '*'
      );
      setIsPlaying(!isPlaying);
    }
  };

  const handleShieldClick = (e) => {
    if (window.innerWidth <= 767) {
      togglePlay(e);
    }
  };

  const mainVideoId = "RkNQhwe1jFw";
  // เปิด controls=1 เพื่อให้ UI ยูทูปขึ้นตอนโหลด แต่จะหายไปเองเพราะมี shield บังเมาส์ไว้
  const mainVideoUrl = `https://www.youtube.com/embed/${mainVideoId}?autoplay=1&mute=1&loop=1&playlist=${mainVideoId}&controls=1&enablejsapi=1&modestbranding=1&rel=0`;

  return (
    <div className="hl-final-wrapper">
      <div className="pink-section-header">
        <h2>HIGHLIGHT</h2>
        <div className="pink-line"></div>
      </div>

      {/* 🌟 วิดีโอหลัก (กรอบขาว + ไร้ขอบดำ) */}
      <div className="hl-final-main-card">
        <div className="hl-video-container">
          <iframe
            ref={iframeRef}
            src={mainVideoUrl}
            title="Main Highlight"
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
          ></iframe>
          
          {/* กระจกใส (Shield): ทำให้ UI YouTube หายไปเองเพราะไม่รู้ว่ามีเมาส์ชี้ และกันการกดหยุดตรงกลางจอ */}
          <div className="hl-final-shield" onClick={handleShieldClick}></div>

          {/* ปุ่มหยุด/เล่น (จุดเดียวที่กดหยุดได้) */}
          <button onClick={togglePlay} className="hl-final-play-btn">
            {isPlaying ? "⏸" : "▶"}
          </button>

          {/* แถบรายละเอียดดีไซน์ใหม่ (ชิดขอบล่าง ไม่บังคน) */}
          <div className="hl-final-info-bar">
            <div className="hl-final-text">
              <span className="hl-final-tag">★ NEW RELEASE</span>
              <h3 className="hl-final-title">ความสวยไม่ลับของ Rose</h3>
              <p className="hl-final-sub">Vlog</p>
            </div>
            <a href={`https://www.youtube.com/watch?v=${mainVideoId}`} target="_blank" rel="noreferrer" className="hl-final-link-btn">
              View Full Video ↗
            </a>
          </div>
        </div>
      </div>

      {/* 📱 วิดีโอรอง (รูป Thumbnail กดแล้วไป YouTube) */}
      <div className="hl-final-sub-grid">
        {/* คลิปเล็ก 1 */}
        <a href="https://youtu.be/_54MEK1_NUU" target="_blank" rel="noreferrer" className="hl-final-sub-card">
          <div className="hl-sub-img-wrapper">
            <img src="https://img.youtube.com/vi/_54MEK1_NUU/maxresdefault.jpg" alt="THEN & NOW" />
          </div>
          <div className="hl-final-sub-label">THEN & NOW</div>
        </a>
        
        {/* คลิปเล็ก 2 */}
        <a href="https://youtu.be/PJQLaefq-R0" target="_blank" rel="noreferrer" className="hl-final-sub-card">
          <div className="hl-sub-img-wrapper">
            <img src="https://img.youtube.com/vi/PJQLaefq-R0/maxresdefault.jpg" alt="Fancam Mix" />
          </div>
          <div className="hl-final-sub-label">STAY HI STAY NICE EP.1</div>
        </a>
      </div>
    </div>
  );
}

function SocialSection() {
  return (
    <section id="social" className="page-section page-section--tone2">
      <div className="page-section-inner">
        <div className="section-header social-header">
          <h2>SOCIAL MEDIA</h2>
          <p></p>
          <div className="pink-line"></div>
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
              <FouitaInstagramFeed />
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
            </div>
          </article>
        </div>

        {/* แถวล่าง: Facebook + iAM48 แบบแบนเนอร์เต็มๆ */}
        <div className="social-extra-row">
          <a
            href="https://www.facebook.com/rose.bnk48official"
            target="_blank"
            rel="noopener noreferrer"
            className="social-chip social-chip--fb"
          >
            <div className="social-chip-left">
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
    { id: 1, src: "/hachicha2.JPG", big: true,label: "Hachicha", credit: "Rollzy_Bunny"},
    { id: 2, src: "/jx1.JPG", label: "JapanExpo", credit: "Rollzy_Bunny" },
    { id: 3, src: "/bdpic1.JPG", label: "Halloween", credit: "Rollzy_Bunny" },
    { id: 4, src: "/hwpic2.JPG", label: "Halloween", credit: "Rollzy_Bunny" },
    { id: 5, src: "/memepic2.JPG", label: "Meme", credit: "Rollzy_Bunny" },
    { id: 6, src: "/hachicha1.JPG", label: "Hachicha", credit: "Rollzy_Bunny", },
    { id: 7, src: "/hwpic5.JPG", mobileOnly: true, label: "Halloween", credit: "BNK_Story" },
  ];

  return (
    <section id="gallery" className="page-section page-section--tone1">
      <div className="page-section-inner">
        <div className="gallery-header">
          <div className="section-header">
            <h2>GALLERY</h2>
            <p></p>
            <div className="pink-line"></div>
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
                <div className="home-gallery-overlay">
                  <h3>{item.label || "Coming Soon"}</h3>
                  <p>By {item.credit || "ระบุชื่อเจ้าของภาพ"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal แบบเดียวกับหน้า All Gallery ถ้ามี Component GalleryModal */}
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

function RollzyBunnySection() {
  const [open, setOpen] = useState(false);

  return (
    <section id="rollzy" className="page-section page-section--tone1">
      <div className="page-section-inner rollzy-layout">
        <div className="rollzy-left">
          <img src="rollzy-title.png" alt="Rollzy Bunny" className="title-image" />
          <p className="rollzy-lead">Rose BNK48 Supporters 𐔌՞. .՞𐦯</p>
          <p className="rollzy-subtitle">มาร่วมเป็นชาว Rose's Garden ไปด้วยกัน～</p>

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

            <div className="rollzy-mobile-preview">
              <div className="rollzy-preview-card">
                <div className="rollzy-preview-grid">
                  <img src="/sns.jpeg" alt="Rollzy Bunny SNS" />
                </div>
              </div>
            </div>
          </div>
        </div>

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
        <div className="rollzy-modal-backdrop" onClick={() => setOpen(false)}>
          <div className="rollzy-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="rollzy-modal-title">ช่องทางติดตามแฟนด้อม</h3>
          {/*}  <p className="rollzy-modal-text">สามารถติดตามแฟนด้อมได้จากด้านล่างนี้</p> */}

            <div className="rollzy-channel-list">
              <a href="https://www.facebook.com/ROLLZYBUNNY" target="_blank" rel="noopener noreferrer" className="rollzy-channel rollzy-channel--fb">
                <span className="rollzy-channel-left">
                  <img src="/fblogo2.png" alt="Facebook" className="rollzy-channel-logo-fb" />
                  <span className="rollzy-channel-name">Rollzy Bunny - Rose BNK48 Supporters </span>
                </span>
                <span className="rollzy-channel-arrow">↗</span>
              </a>
              <a href="https://www.instagram.com/rollzybunny?igsh=MTVremY3NTltb29zZw==" target="_blank" rel="noopener noreferrer" className="rollzy-channel rollzy-channel--ig">
                <span className="rollzy-channel-left">
                  <img src="/igicon3.png" alt="Instagram" className="rollzy-channel-logo-ig" />
                  <span className="rollzy-channel-name">rollzybunny</span>
                </span>
                <span className="rollzy-channel-arrow">↗</span>
              </a>
              <a href="https://x.com/rollzybunny?s=21" target="_blank" rel="noopener noreferrer" className="rollzy-channel rollzy-channel--x">
                <span className="rollzy-channel-left">
                  <img src="/xicon.png" alt="X" className="rollzy-channel-logo-x" />
                  <span className="rollzy-channel-name">ROLLZYBUNNY</span>
                </span>
                <span className="rollzy-channel-arrow">↗</span>
              </a>
              <a href="https://line.me/ti/g2/Unlc6VfjqNXos90q-mWUW80tatHddPT-11-3Gg?utm_source=invitation&utm_medium=link_copy&utm_campaign=default/" target="_blank" rel="noopener noreferrer" className="rollzy-channel rollzy-channel--line">
                <span className="rollzy-channel-left">
                  <img src="/opcicon.png" alt="Line OpenChat" className="rollzy-channel-logo-opc" />
                  <span className="rollzy-channel-name">Rollzy Bunny - Rose BNK48 Supporters </span>
                </span>
                <span className="rollzy-channel-arrow">↗</span>
              </a>
            </div>

            <button className="rollzy-modal-close" onClick={() => setOpen(false)}>
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
      <footer className="footer">
        <p className="footer-line1">-`♡´- Fansite Project made by RollzyBunny (inspired by Niya - Fan Website)</p>
        <p className="footer-line2">Original Content & Artist © by Independent Artist Management (iAM).</p>
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
            entry.target.classList.add("visible");
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

         {/* เรียกใช้ DiscographySection ที่นี่ */}
      <PageSection id="discography" tone="light">
        <DiscographySection />
      </PageSection>

      {/* เรียกใช้ HighlightSection ที่นี่ */}
      <PageSection id="highlight" tone="purple">
        <HighlightSection />
      </PageSection>

      <PageSection id="social" tone="light">
        <SocialSection />
      </PageSection>

      <PageSection id="gallery" tone="purple">
        <GallerySection />
      </PageSection>

      <PageSection id="rollzy" tone="light">
        <RollzyBunnySection />
      </PageSection>

      <Footer />
    </div>
  );
}

/* ของ Navbar */
window.addEventListener("load", () => {
  const { hash } = window.location;
  if (hash) {
    const el = document.querySelector(hash);
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }
});

export default App;
