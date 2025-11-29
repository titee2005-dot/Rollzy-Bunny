export default function AllScheduleList() {
  const schedule = [
    { date: "2025-01-10", event: "ROSE Garden Party", location: "Bangkok" },
    { date: "2025-01-20", event: "Music Live", location: "Seoul" },
    // เพิ่มข้อมูลได้เรื่อย ๆ
  ];

  return (
    <div className="all-schedule-wrapper">
      <h2>All Schedules</h2>

      <ul className="schedule-list">
        {schedule.map((item, idx) => (
          <li key={idx} className="schedule-item">
            <span>{item.date}</span>
            <strong>{item.event}</strong>
            <small>{item.location}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
