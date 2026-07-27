import React, { useState, useMemo, useEffect } from "react";
import Papa from "papaparse";
import {
  Users,
  CalendarDays,
  ClipboardList,
  Check,
  X,
  Sparkles,
  Heart,
  Radio,
  Activity,
  RefreshCw,
  Image as ImageIcon,
  HeartPulse,
  Target,
  UserSquare,
} from "lucide-react";
import { Ranker } from "./Ranker.jsx";
import { DATES, TIMESLOTS } from "./data.js";
import { generatePlan } from "./utils.js";

// ID ของ Google Sheets ที่คุณใช้งาน
const SHEET_ID = "1FJzHU6kpI14imz72Mw7JuTUWvIOcYhl7fZ0evE8Yy6g";

export default function App() {
  const [activeTab, setActiveTab] = useState("now");
  const [budget, setBudget] = useState("");
  const [selectedDates, setSelectedDates] = useState([]);
  const [rankedMembers, setRankedMembers] = useState([]);
  const [orderedMemberIds, setOrderedMemberIds] = useState([]);
  const [rankedGames, setRankedGames] = useState([]);
  const [selectedPlannerDate, setSelectedPlannerDate] = useState(DATES[0]);
  const [selectedPlannerGame, setSelectedPlannerGame] = useState("");

  const [currentTime, setCurrentTime] = useState(new Date());

  // States สำหรับเก็บข้อมูลที่ดึงจาก Google Sheets
  const [ALL_MEMBERS, setAllMembers] = useState([]);
  const [ALL_GAMES, setAllGames] = useState([]);
  const [ALL_SCHEDULE, setAllSchedule] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // ดึงข้อมูลจาก Google Sheets
  useEffect(() => {
    const fetchSheet = (sheetName) => {
      return new Promise((resolve, reject) => {
        const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;
        Papa.parse(url, {
          download: true,
          header: true,
          complete: (results) => resolve(results.data),
          error: (error) => reject(error),
        });
      });
    };

    Promise.all([
      fetchSheet("Members"),
      fetchSheet("Games"),
      fetchSheet("Schedule"),
    ]).then(([membersData, gamesData, scheduleData]) => {
      // 1. Members
       const validMembers = membersData.filter(m => m.id && m.id.trim() !== "").map(m => ({
        ...m,
        // ถ้าเป็นลิงก์ http ให้ใช้เลย แต่ถ้าเป็นชื่อไฟล์ธรรมดา ให้ชี้ไปที่โฟลเดอร์ /members/
        image: m.image && m.image.startsWith('http') ? m.image : `/members/${m.image}`
      }));
      setAllMembers(validMembers);

      // 2. Games
      const validGames = gamesData.filter(g => g.id && g.id.trim() !== "").map(g => ({
        id: g.id.trim(),
        name: g.name.trim(),
        cost: Number(g.cost) || 0
      }));
      setAllGames(validGames);
      if (validGames.length > 0) setSelectedPlannerGame(validGames[0].id);

      // 3. Schedule (แปลงชื่อเมมเบอร์กลับเป็น ID อัตโนมัติ)
      const nameToId = {};
      validMembers.forEach(m => {
        if (m.name) nameToId[m.name.trim().toLowerCase()] = m.id;
      });

      const formattedSchedule = [];
      const gameGroups = {};

      scheduleData.forEach(row => {
        const gId = row['Game ID']?.trim();
        if (!gId) return;

        if (!gameGroups[gId]) {
          gameGroups[gId] = { gameId: gId, slots: [] };
          formattedSchedule.push(gameGroups[gId]);
        }

        const lanes = [];
        const getMemberId = (name) => {
          if (!name || name.trim() === '-' || name.trim() === '') return null;
          return nameToId[name.trim().toLowerCase()];
        };

        const m1 = getMemberId(row['Lane 1']);
        const m2 = getMemberId(row['Lane 2']);
        const m3 = getMemberId(row['Lane 3']);

        if (m1) lanes.push({ laneId: "1", memberId: m1 });
        if (m2) lanes.push({ laneId: "2", memberId: m2 });
        if (m3) lanes.push({ laneId: "3", memberId: m3 });

        gameGroups[gId].slots.push({
          date: row['Date']?.trim(),
          time: row['Time']?.trim(),
          lanes: lanes
        });
      });

      setAllSchedule(formattedSchedule);
      setIsDataLoaded(true);
    }).catch(err => console.error("Error loading sheets:", err));
  }, []);

  useEffect(() => {
    if (activeTab === "now" && isDataLoaded) {
      const timer = setInterval(() => setCurrentTime(new Date()), 1000);
      return () => clearInterval(timer);
    }
  }, [activeTab, isDataLoaded]);

  const [filterGroup, setFilterGroup] = useState("All");
  const [filterGen, setFilterGen] = useState("All Gen");
  const [filterTeam, setFilterTeam] = useState("All Team");

  const filteredMembers = useMemo(() => {
    return ALL_MEMBERS.filter((m) => {
      if (filterGroup !== "All" && m.group !== filterGroup) return false;
      if (filterGen !== "All Gen" && m.gen !== filterGen) return false;
      if (filterTeam !== "All Team" && m.team !== filterTeam) return false;
      return true;
    });
  }, [filterGroup, filterGen, filterTeam, ALL_MEMBERS]);

  const toggleMember = (member) => {
    setRankedMembers((prev) => {
      if (prev.some((m) => m.id === member.id)) {
        setOrderedMemberIds((prevOrder) =>
          prevOrder.filter((id) => id !== member.id),
        );
        return prev.filter((m) => m.id !== member.id);
      }
      return [...prev, member];
    });
  };

  const toggleMemberOrder = (memberId) => {
    setOrderedMemberIds((prev) => {
      if (prev.includes(memberId)) {
        return prev.filter((id) => id !== memberId);
      }
      return [...prev, memberId];
    });
  };

  const effectiveRankedMembers = useMemo(() => {
    return [...rankedMembers].sort((a, b) => {
      const idxA = orderedMemberIds.indexOf(a.id);
      const idxB = orderedMemberIds.indexOf(b.id);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return 0;
    });
  }, [rankedMembers, orderedMemberIds]);

  const plan = useMemo(() => {
    return generatePlan(
      budget,
      effectiveRankedMembers,
      rankedGames,
      selectedDates,
      orderedMemberIds,
      ALL_GAMES,
      ALL_MEMBERS,
      ALL_SCHEDULE
    );
  }, [budget, effectiveRankedMembers, rankedGames, selectedDates, orderedMemberIds, ALL_GAMES, ALL_MEMBERS, ALL_SCHEDULE]);

  const totalSpent = plan
    .filter((item) => !item.isOutOfBudget)
    .reduce((sum, item) => sum + item.cost, 0);
  const remainingCost = (budget || 0) - totalSpent;

  // หน้าโหลดข้อมูล
  if (!isDataLoaded) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] flex flex-col items-center justify-center text-[#E9768B]">
        <RefreshCw size={48} className="animate-spin mb-4" />
        <h2 className="font-display text-2xl font-bold animate-pulse">กำลังซิงค์ข้อมูลจาก Server...</h2>
        <p className="text-neutral-400 text-sm mt-2 font-medium">รอสักครู่นะครับ</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-neutral-800 font-sans selection:bg-[#F1889B] selection:text-white pb-20">
      {/* Header */}
      <header className="bg-gradient-to-br from-[#F1889B] via-[#E9768B] to-[#F1889B] text-white pt-16 pb-20 relative overflow-hidden flex flex-col items-center justify-center text-center shadow-sm">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30">
          <div className="absolute top-[-50px] left-[-50px] w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-100px] right-[-50px] w-80 h-80 bg-[#FFFDF9] rounded-full blur-3xl"></div>
        </div>
        <div className="absolute top-6 left-10 text-white/20 animate-pulse">
          <Sparkles size={40} />
        </div>
        <div className="absolute bottom-6 right-12 text-white/20 animate-pulse delay-150">
          <Heart size={48} />
        </div>
        <div className="absolute top-1/2 right-[20%] text-white/10 -translate-y-1/2 rotate-12">
          <CalendarDays size={80} />
        </div>

        <div className="relative z-10 max-w-4xl px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-sm font-bold tracking-widest uppercase mb-4 shadow-sm border border-white/30">
            <Sparkles size={14} className="text-white" /> BNK48 & CGM48
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold drop-shadow-md tracking-wide">
            On Cloud 9 Festival
          </h1>
          <p className="mt-4 text-[#FFF0F2] text-xl font-bold drop-shadow-sm">
            — 9th Anniversary — Planner
          </p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="sticky top-4 z-50 px-4 mt-4 sm:mt-6 mb-8">
        <div className="max-w-lg mx-auto bg-white/80 backdrop-blur-md border border-[#F1889B]/20 rounded-full shadow-sm p-1.5 flex justify-between relative">
          <button
            onClick={() => setActiveTab("now")}
            className={`flex-1 py-3 px-2 font-bold text-sm flex justify-center items-center gap-2 rounded-full transition-all duration-300 ${
              activeTab === "now"
                ? "bg-[#E9666E] text-white shadow-md shadow-red-200"
                : "text-neutral-500 hover:text-[#E9666E] hover:bg-neutral-100/50"
            }`}
          >
            <Radio
              size={16}
              strokeWidth={2.5}
              className={activeTab === "now" ? "animate-pulse" : ""}
            />{" "}
            <span className="hidden sm:inline">Now</span>
          </button>

          <button
            onClick={() => setActiveTab("members")}
            className={`flex-1 py-3 px-2 font-bold text-sm flex justify-center items-center gap-2 rounded-full transition-all duration-300 ${
              activeTab === "members"
                ? "bg-[#F1889B] text-white shadow-md shadow-pink-200"
                : "text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100/50"
            }`}
          >
            <Users size={16} strokeWidth={2.5} />{" "}
            <span className="hidden sm:inline">Member / Filter</span>
          </button>

          <button
            onClick={() => setActiveTab("planner")}
            className={`flex-1 py-3 px-2 font-bold text-sm flex justify-center items-center gap-2 rounded-full transition-all duration-300 ${
              activeTab === "planner"
                ? "bg-[#F1889B] text-white shadow-md shadow-pink-200"
                : "text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100/50"
            }`}
          >
            <CalendarDays size={16} strokeWidth={2.5} />{" "}
            <span className="hidden sm:inline">Planner</span>
          </button>

          <button
            onClick={() => setActiveTab("summary")}
            className={`flex-1 py-3 px-2 font-bold text-sm flex justify-center items-center gap-2 rounded-full transition-all duration-300 ${
              activeTab === "summary"
                ? "bg-[#F1889B] text-white shadow-md shadow-pink-200"
                : "text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100/50"
            }`}
          >
            <ClipboardList size={16} strokeWidth={2.5} />{" "}
            <span className="hidden sm:inline">My Plan</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 pb-20">
        {/* NOW TAB */}
        {activeTab === "now" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10">
              <h2 className="font-display font-bold text-4xl text-[#E9666E] mb-2 flex items-center justify-center gap-3">
                <span className="w-4 h-4 bg-[#E9666E] rounded-full animate-pulse shadow-[0_0_10px_rgba(233,102,110,0.8)]"></span>
                Happening Now
              </h2>
              <p className="text-[#E9666E] font-medium text-sm mb-4">
                *โปรดตรวจสอบรอบกิจกรรมและเมมเบอร์ที่หน้างานอีกครั้ง*
              </p>
              <div className="inline-flex items-center gap-2 text-sm text-[#3CB4E5]">
                อัปเดตล่าสุด: {currentTime.toLocaleString("th-TH")}{" "}
                <RefreshCw
                  size={14}
                  className={
                    currentTime.getSeconds() % 10 === 0 ? "animate-spin" : ""
                  }
                />
              </div>
            </div>

            <div className="space-y-10">
              {(() => {
                const currentMins =
                  currentTime.getHours() * 60 + currentTime.getMinutes();
                let currentSlot = null;
                let nextSlot = null;

                for (let i = 0; i < TIMESLOTS.length; i++) {
                  const slot = TIMESLOTS[i];
                  const [startStr, endStr] = slot.split("-");
                  const [sh, sm] = startStr.split(":").map(Number);
                  const [eh, em] = endStr.split(":").map(Number);

                  const startMins = sh * 60 + sm;
                  const endMins = eh * 60 + em;

                  if (currentMins >= startMins && currentMins <= endMins) {
                    currentSlot = slot;
                    nextSlot =
                      i + 1 < TIMESLOTS.length ? TIMESLOTS[i + 1] : null;
                    break;
                  } else if (currentMins < startMins && !currentSlot) {
                    nextSlot = slot;
                    break;
                  }
                }

                const dateStr = `${currentTime.getDate()} ${currentTime.toLocaleString("en-US", { month: "short" }).toUpperCase()} ${currentTime.getFullYear()}`;
                const festivalDateIndex = DATES.findIndex((d) =>
                  d.includes(dateStr),
                );
                const todayStr =
                  festivalDateIndex !== -1
                    ? DATES[festivalDateIndex]
                    : DATES[0];

                return ALL_GAMES.map((game) => {
                  const gameSchedule = ALL_SCHEDULE.find(
                    (s) => s.gameId === game.id,
                  );
                  const todaySlots =
                    gameSchedule?.slots.filter((s) => s.date === todayStr) ||
                    [];

                  const nowData = todaySlots.find(
                    (s) => s.time === currentSlot,
                  );
                  const nextData = todaySlots.find((s) => s.time === nextSlot);

                  return (
                    <div key={game.id} className="mb-8">
                      <h3 className="font-display font-bold text-2xl text-[#3CB4E5] mb-4 flex items-center gap-2">
                        {game.name === "ข้ามไป ข้ามให้ได้" && "⛩️"}
                        {game.name === "Cha Ba Cha" && "🍵"}
                        {game.name === "จ้องตาจ๋าจงตอบ" && "👀"}
                        {game.name === "โยนห่วง ปวงใจ" && "⭕"}
                        {game.name === "ปาก้อน ปาใจ" && "🎯"}
                        {game.name}
                      </h3>

                      <div className="bg-[#FFFDF9] rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
                        <table className="w-full text-center text-sm border-collapse">
                          <thead>
                            <tr className="bg-[#EADDC2] text-neutral-800">
                              <th className="py-3 px-4 font-bold border-r border-black/10 w-24">
                                Time
                              </th>
                              <th className="py-3 px-4 font-bold border-r border-black/10 w-[28%]">
                                #1
                              </th>
                              <th className="py-3 px-4 font-bold border-r border-black/10 w-[28%]">
                                #2
                              </th>
                              <th className="py-3 px-4 font-bold w-[28%]">
                                #3
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-200">
                            {/* NOW Row */}
                            <tr className="bg-[#FCF9F2]">
                              <td className="py-4 px-4 font-bold text-[#3CB4E5] border-r border-neutral-200">
                                NOW
                              </td>
                              {[1, 2, 3].map((lane) => {
                                const lData = nowData?.lanes.find(
                                  (l) => l.laneId === lane.toString(),
                                );
                                const mem = lData
                                  ? ALL_MEMBERS.find((m) => m.id === lData.memberId)
                                  : null;
                                return (
                                  <td
                                    key={`now-${lane}`}
                                    className="py-3 px-2 border-r border-neutral-200 last:border-0 align-middle"
                                  >
                                    {mem ? (
                                      <div className="flex flex-col items-center justify-center">
                                        <img
                                          src={mem.image}
                                          alt={mem.name}
                                          className="w-10 h-10 rounded-full object-cover mb-1 border-2 border-white shadow-sm"
                                        />
                                        <span className="font-bold text-xs text-neutral-700 leading-tight">
                                          {mem.name}
                                        </span>
                                      </div>
                                    ) : (
                                      <span className="text-neutral-400 text-xs text-center block w-full">
                                        ไม่มีกิจกรรมตามตารางในเวลานี้
                                      </span>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                            {/* NEXT Row */}
                            <tr className="bg-[#F6EFE0]/40">
                              <td className="py-4 px-4 font-medium text-neutral-600 border-r border-neutral-200 whitespace-nowrap">
                                Next: {nextSlot ? nextSlot.split("-")[0] : "-"}
                              </td>
                              {[1, 2, 3].map((lane) => {
                                const lData = nextData?.lanes.find(
                                  (l) => l.laneId === lane.toString(),
                                );
                                const mem = lData
                                  ? ALL_MEMBERS.find((m) => m.id === lData.memberId)
                                  : null;
                                return (
                                  <td
                                    key={`next-${lane}`}
                                    className="py-3 px-2 border-r border-neutral-200 last:border-0 align-middle"
                                  >
                                    {mem ? (
                                      <div className="flex flex-col items-center justify-center opacity-80">
                                        <img
                                          src={mem.image}
                                          alt={mem.name}
                                          className="w-8 h-8 rounded-full object-cover mb-1 border-2 border-white shadow-sm"
                                        />
                                        <span className="font-bold text-[10px] text-neutral-600 leading-tight">
                                          {mem.name}
                                        </span>
                                      </div>
                                    ) : (
                                      <span className="text-neutral-400 text-[10px] text-center block w-full opacity-60">
                                        ไม่มีกิจกรรมถัดไปในวันนี้
                                      </span>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        )}

        {/* MEMBERS TAB */}
        {activeTab === "members" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Members Selection Area */}
            <div className="bg-white p-5 md:p-8 rounded-3xl shadow-sm border border-[#F1889B]/20 mb-8">
              <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-4 mb-6">
                <div>
                  <h3 className="text-2xl font-display font-bold text-[#E9768B] flex items-center gap-2">
                    1. เลือกเมมเบอร์
                  </h3>
                  <p className="text-sm text-neutral-500 mt-1 font-medium">
                    แตะเพื่อเลือกเมมเบอร์ เลื่อนลงเพื่อดูเพิ่มเติม
                  </p>
                </div>
                {rankedMembers.length > 0 && (
                  <div className="inline-flex items-center justify-center text-sm font-bold text-[#F1889B] bg-[#FFF4F6] px-4 py-2 rounded-full border border-[#F1889B]/20 shrink-0">
                    เลือกแล้ว {rankedMembers.length} คน
                  </div>
                )}
              </div>

              {/* Filter Section */}
              <div className="bg-[#FCF9F2] p-4 rounded-2xl mb-6">
                <div className="flex bg-white border border-neutral-100 p-1 rounded-full w-full max-w-md mx-auto mb-4 relative shadow-sm">
                  {["All", "BNK48", "CGM48"].map((group) => (
                    <button
                      key={group}
                      onClick={() => setFilterGroup(group)}
                      className={`flex-1 py-2 text-sm font-bold rounded-full transition-colors z-10 ${
                        filterGroup === group
                          ? "bg-[#E9768B] text-white shadow-sm"
                          : "text-neutral-500 hover:text-neutral-800"
                      }`}
                    >
                      {group}
                    </button>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <div className="relative">
                    <select
                      value={filterGen}
                      onChange={(e) => setFilterGen(e.target.value)}
                      className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-2.5 font-bold text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#F1889B] appearance-none"
                    >
                      <option value="All Gen">All Gen</option>
                      <option value="Gen 1">Gen 1</option>
                      <option value="Gen 2">Gen 2</option>
                      <option value="Gen 3">Gen 3</option>
                      <option value="Gen 4">Gen 4</option>
                      <option value="Gen 5">Gen 5</option>
                      <option value="Gen 6">Gen 6</option>
                    </select>
                    {filterGen !== "All Gen" && (
                      <button
                        onClick={() => setFilterGen("All Gen")}
                        className="absolute right-10 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-[#E9768B] transition-colors"
                      >
                        <X size={14} strokeWidth={3} />
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <select
                      value={filterTeam}
                      onChange={(e) => setFilterTeam(e.target.value)}
                      className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-2.5 font-bold text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#F1889B] appearance-none"
                    >
                      <option value="All Team">All Team</option>
                      <option value="BIII">Team BIII</option>
                      <option value="NV">Team NV</option>
                      <option value="C">Team C</option>
                      <option value="Trainee">Trainee</option>
                    </select>
                    {filterTeam !== "All Team" && (
                      <button
                        onClick={() => setFilterTeam("All Team")}
                        className="absolute right-10 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-[#E9768B] transition-colors"
                      >
                        <X size={14} strokeWidth={3} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Members Grid Container */}
              <div className="relative">
                <div className="max-h-[480px] overflow-y-auto pr-2 pb-4 custom-scrollbar mb-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {filteredMembers.map((m) => {
                      const isSelected = rankedMembers.some(
                        (selected) => selected.id === m.id,
                      );
                      return (
                        <div
                          key={m.id}
                          onClick={() => toggleMember(m)}
                          className={`cursor-pointer rounded-2xl overflow-hidden border-2 transition-all group ${
                            isSelected
                              ? "border-[#F1889B] shadow-md ring-2 ring-[#F1889B]/20 relative bg-white"
                              : "border-transparent bg-white shadow-sm hover:border-[#F1889B]/40"
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-2 right-2 bg-[#F1889B] text-white rounded-full p-1 z-10 shadow-sm">
                              <Check size={14} strokeWidth={4} />
                            </div>
                          )}
                          <div className="overflow-hidden bg-[#FCF9F2]">
                            <img
                              src={m.image}
                              alt={m.name}
                              className={`w-full aspect-square object-cover transition-transform duration-500 ${
                                isSelected
                                  ? "scale-105"
                                  : "group-hover:scale-105"
                              }`}
                            />
                          </div>
                          <div
                            className={`p-2.5 border-t-[3px] bg-white ${m.group === "BNK48" ? "border-t-[#E2A6C4]" : "border-t-[#96D1C1]"}`}
                          >
                            <div className="font-bold text-base text-neutral-800 leading-tight truncate">
                              {m.name}
                            </div>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span
                                className={`text-[9px] font-bold px-1.5 py-[2px] rounded-sm ${
                                  m.group === "BNK48"
                                    ? "bg-[#F9EEF5] text-[#DCA2C8]"
                                    : "bg-[#EAF5F2] text-[#96D1C1]"
                                }`}
                              >
                                {m.group}
                              </span>
                              <span className="text-[10px] font-bold text-neutral-400 truncate">
                                {m.team} • {m.gen}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {filteredMembers.length === 0 && (
                      <div className="col-span-full py-12 text-center border-2 border-dashed border-neutral-200 rounded-2xl text-neutral-400 font-medium">
                        ไม่พบเมมเบอร์ที่ตรงกับเงื่อนไข
                      </div>
                    )}
                  </div>
                </div>
                {/* Fade at bottom to indicate scrollable content */}
                <div className="absolute bottom-0 left-0 right-2 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none rounded-b-2xl"></div>
              </div>

              <div className="text-center">
                <div className="inline-block px-4 py-1.5 bg-neutral-100 rounded-full text-xs font-bold text-neutral-400">
                  Total available: {filteredMembers.length}
                </div>
              </div>
            </div>

            {/* Chosen Members Display */}
            {rankedMembers.length > 0 && (
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-neutral-100 mb-12">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <div className="bg-neutral-800 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                      {rankedMembers.length}
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral-800 text-xl">
                        รายการเมมเบอร์ที่คุณเลือก
                      </h3>
                      <p className="text-xs text-neutral-500 font-medium">
                        คลิกที่รูปเพื่อเรียงลำดับความสำคัญ 1 2 3... (ไม่บังคับ)
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setRankedMembers([]);
                      setOrderedMemberIds([]);
                    }}
                    className="text-xs font-bold text-neutral-400 hover:text-[#E9768B] flex items-center gap-1 transition-colors"
                  >
                    <X size={14} /> Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-3 mt-4">
                  {effectiveRankedMembers.map((m) => {
                    const orderIndex = orderedMemberIds.indexOf(m.id);
                    const isOrdered = orderIndex !== -1;

                    return (
                      <div
                        key={m.id}
                        className={`flex items-center gap-2 p-2 pr-4 rounded-full border transition-all cursor-pointer ${
                          isOrdered
                            ? "border-[#F1889B] shadow-sm bg-white"
                            : "border-neutral-200 bg-white hover:border-neutral-300"
                        }`}
                        onClick={() => toggleMemberOrder(m.id)}
                      >
                        <div className="relative">
                          <img
                            src={m.image}
                            alt={m.name}
                            className="w-8 h-8 rounded-full object-cover bg-neutral-100"
                          />
                          {isOrdered && (
                            <div className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-[#F1889B] text-white text-[10px] font-bold shadow-sm">
                              {orderIndex + 1}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-neutral-800 leading-tight">
                            {m.name}
                          </span>
                          <span className="text-[10px] font-bold text-neutral-400 leading-tight">
                            {m.group}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMember(m);
                          }}
                          className="ml-1 p-1 text-neutral-400 hover:text-[#E9666E] transition-colors rounded-full hover:bg-neutral-100"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Optional Filters Section */}
            <div className="border-t border-dashed border-neutral-300 pt-10 mt-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold font-display text-[#E9768B] mb-2 flex items-center gap-2">
                  2. Optional Filters
                </h2>
                <p className="text-sm font-medium text-neutral-500">
                  ตัวเลือกเพิ่มเติมเพื่อช่วยคัดกรองตารางให้ตรงใจคุณมากขึ้น
                  (ไม่บังคับ)
                </p>
              </div>

              <div className="space-y-6 mb-8">
                {/* 1. Dates */}
                <div className="bg-white p-5 md:p-6 rounded-3xl border border-neutral-100 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-base font-bold text-neutral-800">
                      เลือกวันที่เข้าร่วม (Dates)
                    </label>
                    {selectedDates.length > 0 && (
                      <button
                        onClick={() => setSelectedDates([])}
                        className="text-xs font-bold text-neutral-400 hover:text-[#E9768B] flex items-center gap-1 transition-colors"
                      >
                        <X size={14} /> Clear
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {DATES.map((date) => {
                      const isSelected = selectedDates.includes(date);
                      return (
                        <button
                          key={date}
                          onClick={() => {
                            setSelectedDates((prev) =>
                              prev.includes(date)
                                ? prev.filter((d) => d !== date)
                                : [...prev, date],
                            );
                          }}
                          className={`w-full sm:flex-1 py-3 px-4 rounded-xl text-sm font-bold border-2 transition-all ${
                            isSelected
                              ? "bg-[#FFF4F6] border-[#F1889B] text-[#E9768B]"
                              : "bg-[#FCF9F2] border-transparent text-neutral-500 hover:border-[#F1889B]/30"
                          }`}
                        >
                          {date}
                        </button>
                      );
                    })}
                  </div>
                  {selectedDates.length === 0 && (
                    <p className="text-xs text-neutral-400 mt-3 font-medium">
                      หากไม่เลือก ระบบจะประมวลผลตารางจากทุกวันที่มี
                    </p>
                  )}
                </div>

                {/* 2. Budget */}
                <div className="bg-white p-5 md:p-6 rounded-3xl border border-neutral-100 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-base font-bold text-neutral-800">
                      กำหนดงบประมาณ (Budget)
                    </label>
                    {budget !== "" && (
                      <button
                        onClick={() => setBudget("")}
                        className="text-xs font-bold text-neutral-400 hover:text-[#E9768B] flex items-center gap-1 transition-colors"
                      >
                        <X size={14} /> Clear
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 font-bold">
                      ฿
                    </span>
                    <input
                      type="number"
                      value={budget}
                      onChange={(e) =>
                        setBudget(
                          e.target.value === "" ? "" : Number(e.target.value),
                        )
                      }
                      placeholder="เช่น 5,000"
                      className="w-full bg-[#FCF9F2] border border-transparent rounded-xl pl-10 pr-4 py-3.5 font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#F1889B] focus:bg-white transition-all shadow-inner"
                    />
                  </div>
                  {!budget && (
                    <p className="text-xs text-neutral-400 mt-3 font-medium">
                      หากไม่ระบุ ระบบจะจัดตารางแบบไม่จำกัดงบประมาณ
                    </p>
                  )}
                </div>

                {/* 3. Activities / Games */}
                <div className="bg-white p-5 md:p-6 rounded-3xl border border-neutral-100 shadow-sm">
                  <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <label className="block text-base font-bold text-neutral-800 mb-1">
                        เลือกกิจกรรม (Activities)
                      </label>
                      <p className="text-xs font-medium text-neutral-500">
                        เลือกเกมที่อยากเล่น หากไม่เลือกจะคำนวณจากทุกเกมอัตโนมัติ
                      </p>
                    </div>
                    {rankedGames.length > 0 && (
                      <button
                        onClick={() => setRankedGames([])}
                        className="text-xs font-bold text-neutral-400 hover:text-[#E9768B] flex items-center gap-1 transition-colors whitespace-nowrap"
                      >
                        <X size={14} /> Clear
                      </button>
                    )}
                  </div>
                  <div className="bg-[#FCF9F2] p-4 md:p-5 rounded-2xl border border-neutral-100">
                    <Ranker
                      items={ALL_GAMES}
                      selectedItems={rankedGames}
                      onChange={setRankedGames}
                      itemKey={(g) => g.id}
                      renderItem={(g) => (
                        <div className="flex items-center justify-between w-full">
                          <div className="font-bold text-neutral-800">
                            {g.name}
                          </div>
                          <div className="text-xs font-bold text-[#F1889B] bg-[#FFF4F6] px-2 py-1 flex items-center justify-center rounded-full whitespace-nowrap shadow-sm border border-[#F1889B]/10">
                            {g.cost} ฿
                          </div>
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PLANNER TAB */}
        {activeTab === "planner" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-[#F1889B]/20 mb-6">
              <div className="text-center mb-8 relative">
                <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#F1889B]/20 to-transparent"></div>
                <span className="relative z-10 bg-white px-4">
                  <h2 className="font-display font-bold text-2xl inline-block text-[#E9768B]">
                    ตารางกิจกรรมประจำตู้วันนี้
                  </h2>
                </span>
                <p className="text-neutral-400 text-sm mt-3">
                  สามารถดูรอบกิจกรรมของทุกเกมได้ที่นี่
                </p>
              </div>

              {/* Game Tabs */}
              <div className="flex flex-wrap gap-3 justify-center mb-10 bg-[#FCF9F2] p-2 rounded-[2rem] max-w-2xl mx-auto shadow-inner border border-neutral-100">
                {ALL_GAMES.map((game) => (
                  <button
                    key={game.id}
                    onClick={() => setSelectedPlannerGame(game.id)}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                      selectedPlannerGame === game.id
                        ? "bg-[#E9768B] text-white shadow-md shadow-pink-200"
                        : "bg-transparent text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200/50"
                    }`}
                  >
                    {game.name}
                  </button>
                ))}
              </div>

              <div className="text-center mb-8">
                <h3 className="text-3xl font-display font-bold text-[#3CB4E5]">
                  {ALL_GAMES.find((g) => g.id === selectedPlannerGame)?.name}
                </h3>
                <div className="inline-block mt-3 px-4 py-1.5 bg-[#EAF7FD] text-[#3CB4E5] font-bold rounded-full text-sm border border-[#3CB4E5]/20">
                  {ALL_GAMES.find((g) => g.id === selectedPlannerGame)?.cost} ฿ /
                  รอบ
                </div>
              </div>

              {/* Display Schedule Table */}
              <div className="space-y-12">
                {DATES.map((date) => {
                  const gameSchedule = ALL_SCHEDULE.find(
                    (s) => s.gameId === selectedPlannerGame,
                  );
                  const slots =
                    gameSchedule?.slots.filter((s) => s.date === date) || [];
                  const isDay1 = date.includes("SAT");
                  const headerBg = isDay1 ? "bg-[#A488EB]" : "bg-[#E9666E]";
                  const headerBgLight = isDay1
                    ? "bg-[#F2EDFB]"
                    : "bg-[#FDF0F1]";
                  const headerText = isDay1
                    ? "text-[#8561DA]"
                    : "text-[#DF424E]";

                  return (
                    <div
                      key={date}
                      className="overflow-hidden rounded-3xl border border-neutral-100 shadow-sm transition-all hover:shadow-md"
                    >
                      <div
                        className={`${headerBg} text-white font-bold py-4 text-center tracking-widest text-lg flex items-center justify-center gap-2`}
                      >
                        <CalendarDays size={20} />
                        {date}
                      </div>
                      <div className="bg-white overflow-x-auto">
                        <table className="w-full text-sm text-center border-collapse">
                          <thead>
                            <tr className={`${headerBgLight} ${headerText}`}>
                              <th className="py-4 px-4 w-28 font-bold border-r border-white/50">
                                TIME
                              </th>
                              <th className="py-4 px-4 font-bold border-r border-white/50 w-[30%]">
                                Lane #1
                              </th>
                              <th className="py-4 px-4 font-bold border-r border-white/50 w-[30%]">
                                Lane #2
                              </th>
                              <th className="py-4 px-4 font-bold w-[30%]">
                                Lane #3
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-100">
                            {slots.map((slot, idx) => (
                              <tr
                                key={idx}
                                className="hover:bg-neutral-50/80 transition-colors"
                              >
                                <td className="py-6 px-4 font-bold text-[#E9768B] border-r border-neutral-100 align-middle bg-[#FFFDF9]">
                                  {slot.time}
                                </td>
                                {slot.lanes.map((lane) => {
                                  const member = ALL_MEMBERS.find(
                                    (m) => m.id === lane.memberId,
                                  );
                                  return (
                                    <td
                                      key={lane.laneId}
                                      className="p-4 border-r border-neutral-100 last:border-0 align-middle relative group"
                                    >
                                      {member ? (
                                        <div className="flex flex-col items-center gap-2 transition-transform group-hover:scale-105">
                                          <div
                                            className={`p-1 rounded-full ${member.group === "BNK48" ? "bg-[#F9DCE2]" : "bg-[#D2EDE6]"}`}
                                          >
                                            <img
                                              src={member.image}
                                              alt={member.name}
                                              className="w-14 h-14 rounded-full object-cover shadow-sm ring-4 ring-white"
                                            />
                                          </div>
                                          <span className="font-bold text-neutral-800 text-base">
                                            {member.name}
                                          </span>
                                        </div>
                                      ) : (
                                        <span className="text-neutral-300">
                                          -
                                        </span>
                                      )}
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* SUMMARY TAB */}
        {activeTab === "summary" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10">
              <h2 className="font-display font-bold text-4xl text-[#E9768B] mb-3">
                My Plan
              </h2>
              <p className="text-neutral-500 text-sm max-w-md mx-auto font-medium">
                แผนสรุปกิจกรรมของคุณที่วางไว้
                เซฟหรือแคปหน้าจอนี้เก็บไว้ดูหน้างานได้เลย!
              </p>
            </div>

            {plan.length > 0 ? (
              <div className="space-y-8 max-w-3xl mx-auto">
                {/* Organize plan by date */}
                <div className="space-y-6">
                  {DATES.map((date) => {
                    const dayPlan = plan.filter((p) => p.date === date);

                    // Group activities by timeslot
                    const planByTime = {};
                    if (dayPlan.length > 0) {
                      dayPlan.forEach((item) => {
                        if (!planByTime[item.time]) planByTime[item.time] = [];
                        planByTime[item.time].push(item);
                      });
                    }
                    const sortedTimes = Object.keys(planByTime).sort((a, b) =>
                      a.localeCompare(b),
                    );

                    let headerBg = "from-[#E9768B] to-[#F1889B]"; // SAT
                    if (date.includes("SUN"))
                      headerBg = "from-[#F87171] to-[#FCA5A5]";
                    if (date.includes("MON"))
                      headerBg = "from-[#FB923C] to-[#FDBA74]";

                    return (
                      <div
                        key={date}
                        className="bg-white rounded-3xl overflow-hidden shadow-sm border border-neutral-100"
                      >
                        <div
                          className={`bg-gradient-to-r ${headerBg} px-6 py-4 flex items-center justify-between`}
                        >
                          <h3 className="font-display font-bold text-white text-xl tracking-wide">
                            {date}
                          </h3>
                          <div className="text-white/90 text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                            {dayPlan.length} กิจกรรม
                          </div>
                        </div>

                        <div className="p-2 sm:p-4">
                          {dayPlan.length === 0 ? (
                            <div className="text-center text-neutral-400 py-8 font-medium">
                              คุณยังไม่ได้วางแผนกิจกรรมสำหรับวันนี้
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {sortedTimes.map((time) => (
                                <div
                                  key={time}
                                  className="flex flex-col md:flex-row md:items-start gap-4 p-4 rounded-2xl hover:bg-neutral-50 transition-colors"
                                >
                                  <div className="w-28 shrink-0">
                                    <div className="font-bold text-neutral-700 text-lg sticky top-24">
                                      {time}
                                    </div>
                                  </div>

                                  <div className="flex-1 grid grid-cols-1 gap-3">
                                    {planByTime[time].map((item) => {
                                      // Icons
                                      let gColor = "text-[#E9768B]";
                                      let bgIconColor = "bg-[#FDF0F2]";
                                      let gIcon = <UserSquare size={18} />;
                                      const gName = item.game.name || "";

                                      if (gName.includes("Lip")) {
                                        gColor = "text-[#F1889B]";
                                        bgIconColor = "bg-[#FDF0F2]";
                                      } else if (gName.includes("SNS")) {
                                        gColor = "text-[#8561DA]";
                                        bgIconColor = "bg-[#F4F0FD]";
                                        gIcon = <ImageIcon size={18} />;
                                      } else if (gName.includes("ใจมันสั่น")) {
                                        gColor = "text-[#26B18D]";
                                        bgIconColor = "bg-[#EAF6F3]";
                                        gIcon = <HeartPulse size={18} />;
                                      } else if (
                                        gName.includes("Ponytail") ||
                                        gName.includes("Cha")
                                      ) {
                                        gColor = "text-[#eb6db2]";
                                        bgIconColor = "bg-[#FCEEF6]";
                                        gIcon = <Target size={18} />;
                                      }

                                      return (
                                        <div
                                          key={item.id}
                                          className={`flex items-center gap-4 bg-white p-3 sm:p-4 rounded-2xl border transition-all ${item.isOutOfBudget ? "opacity-40 grayscale border-neutral-100 hover:opacity-100" : "border-neutral-100 shadow-sm hover:border-[#F1889B]/40"}`}
                                        >
                                          <div
                                            className={`p-2.5 rounded-xl ${bgIconColor} ${gColor}`}
                                          >
                                            {gIcon}
                                          </div>

                                          <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                            <div>
                                              <div className="font-bold text-neutral-800 flex items-center gap-2">
                                                <span
                                                  className={
                                                    item.isOutOfBudget
                                                      ? "line-through text-neutral-400"
                                                      : ""
                                                  }
                                                >
                                                  {gName}
                                                </span>
                                                <span className="text-neutral-400 font-normal text-sm">
                                                  กับ
                                                </span>
                                                <span
                                                  className={`${item.isOutOfBudget ? "text-neutral-400" : gColor}`}
                                                >
                                                  {item.member.name}
                                                </span>
                                                {item.isOutOfBudget && (
                                                  <span className="text-[10px] bg-red-100 text-red-500 px-1.5 py-0.5 rounded-md ml-2 not-italic no-underline">
                                                    เกินงบ
                                                  </span>
                                                )}
                                              </div>
                                            </div>

                                            <div className="text-sm font-bold text-neutral-400 bg-neutral-50 px-3 py-1 rounded-lg shrink-0 w-fit">
                                              {item.cost} ฿
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Summary Ticket */}
                <div className="mt-16 max-w-2xl mx-auto mb-8">
                  <h3 className="text-center font-display font-bold text-3xl text-[#E9768B] mb-6">
                    Summary Ticket
                  </h3>

                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm border-2 border-[#F9EEF5]">
                    <div className="grid grid-cols-2 bg-[#FDF0F2] font-bold py-4 px-6 text-center text-lg text-[#E9768B]">
                      <div>Date</div>
                      <div>On Cloud 9 Festival Ticket</div>
                    </div>

                    <div className="divide-y divide-[#F9EEF5]">
                      {DATES.map((date) => {
                        const dayPlan = plan.filter(
                          (p) => p.date === date && !p.isOutOfBudget,
                        );
                        const dayCost = dayPlan.reduce(
                          (sum, item) => sum + item.cost,
                          0,
                        );
                        const dayCount = dayPlan.length;
                        return (
                          <div
                            key={`summary-${date}`}
                            className="grid grid-cols-2 py-5 px-6 text-center items-center"
                          >
                            <div className="font-bold text-lg text-neutral-700">
                              {date}
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="font-bold text-xl text-neutral-800">
                                {dayCount}
                              </span>
                              <span className="text-[15px] font-medium text-neutral-500">
                                {dayCost > 0 ? dayCost.toLocaleString() : "0"}{" "}
                                THB
                              </span>
                            </div>
                          </div>
                        );
                      })}

                      <div className="grid grid-cols-2 bg-[#FDF0F2] font-bold py-5 px-6 text-center items-center text-[#E9768B]">
                        <div className="flex flex-col items-center">
                          <span className="text-lg">TOTAL</span>
                          <span className="text-sm font-normal opacity-80">
                            ({DATES.length} DAYS)
                          </span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-xl">
                            {plan.filter((p) => !p.isOutOfBudget).length}
                          </span>
                          <span className="text-[15px] font-medium">
                            {totalSpent > 0 ? totalSpent.toLocaleString() : "0"}{" "}
                            THB
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 flex justify-center pb-8">
                    <button
                      onClick={() => {
                        setBudget("");
                        setSelectedDates([]);
                        setRankedMembers([]);
                        setRankedGames([]);
                      }}
                      className="px-8 py-2.5 bg-transparent border-2 border-neutral-200 text-neutral-500 font-bold rounded-full hover:bg-neutral-50 hover:text-neutral-700 transition-colors"
                    >
                      Clear Plan
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-[2rem] p-16 text-center border-2 border-dashed border-[#F1889B]/20 max-w-2xl mx-auto shadow-sm">
                <div className="w-24 h-24 bg-[#FFF4F6] text-[#F1889B] rounded-full flex items-center justify-center mx-auto mb-6">
                  <ClipboardList size={40} strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-display font-bold text-neutral-800 mb-3">
                  ยังไม่มีแผนในขณะนี้
                </h3>
                <p className="text-neutral-500 max-w-sm mx-auto mb-8 font-medium">
                  ตั้งค่างบประมาณ, วันที่, และเลือกเมมเบอร์กับเกมส์ที่คุณสนใจ
                  ในหน้า Member / Filter เพื่อสร้างแผนอัตโนมัติ
                </p>
                <button
                  onClick={() => setActiveTab("members")}
                  className="px-8 py-4 bg-gradient-to-r from-[#F1889B] to-[#E9768B] text-white text-lg font-bold rounded-full hover:shadow-lg hover:scale-105 transition-all shadow-md shadow-pink-200"
                >
                  เริ่มจัดตารางเลย
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}