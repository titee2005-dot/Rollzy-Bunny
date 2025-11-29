// src/AllSchedulePage.jsx
import Navbar from "./Navbar.jsx";
import Eventslist from "./Eventslist.jsx";

function AllSchedulePage() {
  return (
    <div className="app-root">
      <Navbar />
      <main className="page-section page-section--tone2">
        <div className="page-section-inner">
          <h1 style={{ marginBottom: "16px" }}>All Schedule</h1>
          <Eventslist />
        </div>
      </main>
    </div>
  );
}

export default AllSchedulePage;
