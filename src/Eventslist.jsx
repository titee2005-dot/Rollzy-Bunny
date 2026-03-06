import { events } from "./events";
function Eventslist() {
  let activeEvents = events.filter(e => e.lastShowDate > new Date());
  if(activeEvents == null || activeEvents.length == 0) {
    activeEvents = [{
       title: "None",
       date: "TBA",
       place: "📍TBA",
    }];
  }

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
        {activeEvents.map((ev, index) => (
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
