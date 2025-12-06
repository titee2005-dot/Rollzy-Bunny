function EventsSection() {
  const events = [
    {
      title: "Kangaroo Village Christmas Festival 2025",
      date: "19 – 21 ธันวาคม 2025",
      place: "📍 MCC HALL 3F, The Mall Bangkae",
   /* desc: "จิงโจ้",*/
      image: "/event1.jpg",
      link: "https://www.facebook.com/share/p/1RJ93hmiUz/" // ← ลิงก์ของ event 1
    },
    {
      title: "Masaka no Confession Handshake Event",
      date: "27-28 ธันวาคม 2025",
      place: "📍 MCC HALL 3F, The Mall Bangkapi",
     /* desc: "งานจับมือ",*/
      image: "/event2.jpg",
      link: "https://www.facebook.com/share/p/17vULEJkk5/" // ← ลิงก์ของ event 2
    },
    {
      title: "War of Goddess",
      date: "1 กุมภาพันธ์ 2026",
      place: "📍 TBA",
      /*desc: "กีฬาสี",*/
      image: "/event3.jpg",
      link: "https://www.facebook.com/share/p/16yQFhDc2G/" // ← ลิงก์ของ event 3
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

export default EventsSection;