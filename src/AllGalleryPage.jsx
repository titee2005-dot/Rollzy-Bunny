// src/AllGalleryPage.jsx
import { useEffect, useState } from "react";
import Navbar from "./Navbar.jsx";
import "./App.css";

const GALLERY_TABS = [
  { id: "all", label: "All" },
  { id: "meme", label: "Meme" },
  { id: "stage", label: "Stage" },
  { id: "event", label: "Event" },
  { id: "fanart", label: "Fanart" },
  { id: "behind", label: "Other" },
];

const GALLERY_ITEMS = [
  {
    id: 1,
    src: "/rose-about.jpg",
    label: "Coming Soon",
    category: "stage",
    credit: "ระบุชื่อเจ้าของภาพ",
    link: "https://ลิงก์เพจเจ้าของภาพ-1"
  },
  {
    id: 2,
    src: "/rose-hero.jpg",
    label: "Cute meme 2",
    category: "meme",
    credit: "ระบุชื่อเจ้าของภาพ",
    link: "https://ลิงก์เพจเจ้าของภาพ-2"
  },
 {
    id: 3,
    src: "/gallery-2.jpg",
    label: "Cute meme 2",
    category: "meme",
    credit: "ระบุชื่อเจ้าของภาพ",
    link: "https://ลิงก์เพจเจ้าของภาพ-2"
  },
   {
    id: 4,
    src: "/gallery-1.jpg",
    label: "Coming Soon",
    category: "stage",
    credit: "หมีแมกกล้อง",
    link: "https://ลิงก์เพจเจ้าของภาพ-1"
  },
  {
    id: 5,
    src: "/gallery-2.jpg",
    label: "Cute meme 2",
    category: "meme",
    credit: "ระบุชื่อเจ้าของภาพ",
    link: "https://ลิงก์เพจเจ้าของภาพ-2"
  },
 {
    id: 6,
    src: "/gallery-2.jpg",
    label: "Cute meme 2",
    category: "meme",
    credit: "ระบุชื่อเจ้าของภาพ",
    link: "https://ลิงก์เพจเจ้าของภาพ-2"
  },
  {
    id: 7,
    src: "/gallery-7.jpg",
    label: "Event highlight",
    category: "event",
    credit: "ระบุชื่อเจ้าของภาพ",
    link: "https://ลิงก์เพจเจ้าของภาพ-2"
  },
  {
    id: 8,
    src: "/gallery-8.jpg",
    label: "Stage close-up",
    category: "stage",
    credit: "ระบุชื่อเจ้าของภาพ",
    link: "https://ลิงก์เพจเจ้าของภาพ-2"
  },
];

function AllGalleryPage() {
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredItems =
    activeTab === "all"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeTab);

  return (
    <div className="app-root">
      <Navbar />

      <main className="page-section page-section--tone2 gallery-page">
        <div className="page-section-inner">
          <header className="gallery-page-header">
            <h1>Gallery (Beta)</h1>
            <p>รวมภาพของ Rose ทั้งภาพงาน, meme, fanart และอื่นๆ 💜</p>
          </header>

          {/* Tabs */}
          <div className="gallery-tabs">
            {GALLERY_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={
                  "gallery-tab" +
                  (activeTab === tab.id ? " gallery-tab--active" : "")
                }
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="gallery-page-grid">
  {filteredItems.map((item) => (
    <figure key={item.id} className="gallery-card">
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="gallery-card-link"
      >
        <div className="gallery-card-thumb">
          <img src={item.src} alt={item.label} />
          <div className="gallery-card-overlay">
            <div className="gallery-card-text">
              <div className="gallery-card-title">{item.label}</div>
              {item.credit && (
                <div className="gallery-card-credit">By {item.credit}</div>
              )}
            </div>
          </div>
        </div>
      </a>
    </figure>
  ))}
</div>
        </div>
      </main>
    </div>
  );
}

export default AllGalleryPage;
