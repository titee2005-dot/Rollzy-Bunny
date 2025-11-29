function AllSchedule() {
  const events = [
    {
      title: "Kangaroo Village Christmas Festival",
      date: "19 – 21 ธันวาคม 2025",
      place: "MCC HALL 3F, The Mall Bangkae",
      desc: "บรรยากาศคริสต์มาสสดใสน่ารัก พร้อมไฟและฉากเทศกาล",
      image: "/event1.jpg",
    },
    {
      title: "Rose Special Stage",
      date: "27–28 ธันวาคม 2025",
      place: "Bangkok, Thailand",
      desc: "สเตจพิเศษรวมเพลงของ Rose แบบจัดเต็ม",
      image: "/event2.jpg",
    },
    {
      title: "Hi-Touch & Fansign",
      date: "1 กุมภาพันธ์ 2026",
      place: "ประกาศสถานที่ภายหลัง",
      desc: "โอกาสเจอ Rose ใกล้ ๆ และทักทายกันแบบอบอุ่น",
      image: "/event3.jpg",
    },
  ];

  return (
    <section className="page-section page-section--tone1">
      <div className="page-section-inner">
        <h2 className="section-title">All Schedule</h2>

        <div className="all-schedule-grid">
          {events.map((ev, i) => (
            <article key={i} className="event-card">
              <img src={ev.image} alt={ev.title} className="event-card-img" />

              <div className="event-card-body">
                <span className="event-date">{ev.date}</span>
                <h3 className="event-title">{ev.title}</h3>
                <p className="event-place">{ev.place}</p>
                <p className="event-desc">{ev.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AllSchedule;
