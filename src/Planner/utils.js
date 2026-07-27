import { TIMESLOTS, DATES } from "./data.js";

export function generatePlan(
  budget, 
  rankedMembers, 
  rankedGames, 
  dates, 
  orderedMemberIds,
  ALL_GAMES,
  ALL_MEMBERS,
  ALL_SCHEDULE
) {
  const hasBudget = budget !== "" && budget > 0;
  const effectiveBudget = hasBudget ? budget : Infinity;
  const effectiveDates = dates.length > 0 ? dates : DATES;
  const effectiveGames = rankedGames.length > 0 ? rankedGames : ALL_GAMES;
  const effectiveMembers = rankedMembers.length > 0 ? rankedMembers : ALL_MEMBERS;

  const hasGamesSelected = rankedGames.length > 0;
  const isRanked = orderedMemberIds && orderedMemberIds.length > 0;

  if (effectiveGames.length === 0 || effectiveMembers.length === 0) {
    return [];
  }

  const memberSet = new Set(effectiveMembers.map((m) => m.id));
  const gameSet = new Set(effectiveGames.map((g) => g.id));
  const dateSet = new Set(effectiveDates);

  const combinations = [];

  for (const gameSchedule of ALL_SCHEDULE) {
    if (!gameSet.has(gameSchedule.gameId)) continue;
    const gameInfo = ALL_GAMES.find((g) => g.id === gameSchedule.gameId);
    if (!gameInfo) continue;

    for (const slot of gameSchedule.slots) {
      if (!dateSet.has(slot.date)) continue;

      for (const lane of slot.lanes) {
        if (memberSet.has(lane.memberId)) {
          const memberInfo = ALL_MEMBERS.find((m) => m.id === lane.memberId);
          if (!memberInfo) continue;
          
          let memberRank = 999;
          let isMemberRanked = false;
          if (isRanked && orderedMemberIds.includes(lane.memberId)) {
            memberRank = orderedMemberIds.indexOf(lane.memberId);
            isMemberRanked = true;
          }

          const gameRank = hasGamesSelected ? effectiveGames.findIndex((g) => g.id === gameSchedule.gameId) : 999;

          let groupPriority = 3;
          if (isMemberRanked) {
             groupPriority = 1; // Group 1: เมมเบอร์ที่ถูกจัดอันดับ
          } else if (hasGamesSelected) {
             groupPriority = 2; // Group 2: ไม่ได้จัดอันดับเมม แต่เลือกกิจกรรม
          } else {
             groupPriority = 3; // Group 3: โหมดปกติ
          }

          combinations.push({
            member: memberInfo,
            game: gameInfo,
            date: slot.date,
            time: slot.time,
            cost: gameInfo.cost,
            memberRank,
            gameRank,
            groupPriority,
          });
        }
      }
    }
  }

  combinations.sort((a, b) => {
    // แยกตามกลุ่มก่อน
    if (a.groupPriority !== b.groupPriority) {
      return a.groupPriority - b.groupPriority;
    }

    const dDiff = DATES.indexOf(a.date) - DATES.indexOf(b.date);
    const tDiff = TIMESLOTS.indexOf(a.time) - TIMESLOTS.indexOf(b.time);

    if (a.groupPriority === 1) {
      // กลุ่ม 1: เรียงตาม memberRank > Date > Time > gameRank
      if (a.memberRank !== b.memberRank) return a.memberRank - b.memberRank;
      if (dDiff !== 0) return dDiff;
      if (tDiff !== 0) return tDiff;
      return a.gameRank - b.gameRank;
    } else if (a.groupPriority === 2) {
      // กลุ่ม 2: เรียงตาม gameRank > Date > Time
      if (a.gameRank !== b.gameRank) return a.gameRank - b.gameRank;
      if (dDiff !== 0) return dDiff;
      if (tDiff !== 0) return tDiff;
      return 0;
    } else {
      // กลุ่ม 3: เรียงตาม Date > Time
      if (dDiff !== 0) return dDiff;
      if (tDiff !== 0) return tDiff;
      return 0;
    }
  });

  const plan = [];
  let remainingBudget = effectiveBudget;

  for (const combo of combinations) {
    const cost = combo.cost;
    const isOutOfBudget = remainingBudget < cost;

    // กันคิวซ้ำ
    const isDuplicate = plan.some(p => p.date === combo.date && p.time === combo.time && p.member.id === combo.member.id);

    if (!isDuplicate) {
      plan.push({
        id: `item-${Date.now()}-${plan.length}`,
        member: combo.member,
        game: combo.game,
        date: combo.date,
        time: combo.time,
        cost: cost,
        isOutOfBudget: isOutOfBudget,
      });

      if (!isOutOfBudget) {
        remainingBudget -= cost;
      }
    }
  }

  return plan;
}