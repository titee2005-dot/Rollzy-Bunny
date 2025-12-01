// src/AllGalleryPage.jsx
import { useEffect, useState } from "react";
import Navbar from "./Navbar.jsx";

const GALLERY_TABS = [
  { id: "all", label: "All" },
  { id: "meme", label: "Meme" },
  { id: "stage", label: "Stage" },
  { id: "event", label: "Event" },
  { id: "fanart", label: "Fanart" },
  { id: "behind", label: "Behind the scene" },
];

const GALLERY_ITEMS = [
  {
    id: 1,
    src: "/gallery-1.jpg",
    label: "Cute meme 1",
    category: "meme",
  },
  {
    id: 2,
    src: "/gallery-2.jpg",
    label: "Cute meme 2",
    category: "meme",
  },
  {
    id: 3,
    src: "/gallery-3.jpg",
    label: "Stage performance",
    category: "stage",
  },
  {
    id: 4,
    src: "/gallery-4.jpg",
    label: "Handshake event",
    category: "event",
  },
  {
    id: 5,
    src: "/gallery-5.jpg",
    label: "Fanart",
    category: "fanart",
  },
  {
    id: 6,
    src: "/gallery-6.jpg",
    label: "Backstage",
    category: "behind",
  },
  {
    id: 7,
    src: "/gallery-7.jpg",
    label: "Event highlight",
    category: "event",
  },
  {
    id: 8,
    src: "/gallery-8.jpg",
    label: "Stage close-up",
    category: "stage",
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
            <p>รวมภาพของ Rose ทั้งภาพงาน, meme, fanart และเบื้องหลัง 💜</p>
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
                <div className="gallery-card-thumb">
                  <img src={item.src} alt={item.label} />
                </div>
                <figcaption className="gallery-card-caption">
                  {item.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AllGalleryPage;
