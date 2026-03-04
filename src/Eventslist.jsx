function Eventslist() {
  const events = [
    /* {
      title: "None",
      date: "TBA",
      place: "📍TBA",
     /* desc: "จิงโจ้", */
     /* image: "/event1.jpg", */
     /* link: "",*/
/*    },  */
    {
      title: "BNK48 & CGM48 Siam-Nippon Summer Fest 2026",
      date: "27-29 มีนาคม 2026",
      place: "📍 JJ Hall @JJ Mall, Bangkok",
     /* desc: "จิงโจ้", */
      image: "/SummerFest.jpg",
      link: "https://www.facebook.com/share/p/17EoFap8zr/",
    }, 
   /* {
      title: "Handshake Event",
      date: "27-28 ธันวาคม 2025",
      place: "📍 MCC HALL 3F, The Mall Bangkapi",
     /* desc: "งานจับมือ", 
      image: "/event2.jpg",
      link: "https://www.facebook.com/share/p/1FhYtAqPCE/",
    }, 
    {
      title: "War of Goddess",
      date: "1 กุมภาพันธ์ 2026",
      place: "📍 TBA",
      /*desc: "กีฬาสี",
      image: "/event3.jpg",
      link: "https://www.facebook.com/share/p/16yQFhDc2G/",
    }, */
  ]; 

  // 👇 ตัด page-section / page-section-inner ออก เหลือแค่ content
  return (
    <section id="schedule">
      <div className="events-header">
        <div className="section-header">
          <h2>ROSE UPCOMING EVENTS</h2>
          <p>งานที่กำลังจะมาถึง</p>
        </div>

        <a href="/" className="all-schedule-btn">
          Back
        </a>
      </div>

      <div className="card-row">
        {events.map((ev, index) => (
          <a
            key={index}
            href={ev.link}
            target="_blank"
            rel="noopener noreferrer"
            className="event-card"
          >
            <div
        className={
          "event-thumb " + 
          (index === 0 ? "event-thumb--e1" : "") +
          (index === 1 ? "event-thumb--e2" : "") +
          (index === 2 ? "event-thumb--e3 " : "")
        }
      >
        
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
    </section>
  );
}

export default Eventslist;
