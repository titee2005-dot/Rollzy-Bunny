import { events } from "./events";
function EventsSection() {
  let activeEvents = events.filter(e => e.lastShowDate > new Date());
  if(activeEvents == null || activeEvents.length == 0) {
    activeEvents = [{
       title: "None",
       date: "TBA",
       place: "📍TBA",
    }];
  }

  return (
    <section id="schedule" className="page-section page-section--tone2">
      <div className="page-section-inner">

        <div className="events-header">
          <div className="section-header">
            <h2>ROSE UPCOMING EVENTS</h2>
            <p>★ งานที่กำลังจะมาถึงของโรส แล้วไปเจอน้องกันนน～</p>
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
          {activeEvents.map((ev, index) => (
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