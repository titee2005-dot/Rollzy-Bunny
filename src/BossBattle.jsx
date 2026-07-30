import React, { useState, useEffect, useRef, useCallback } from 'react';
import './BossBattle.css';

// ============================================================================
// 🎮 BOSS BATTLE CONFIG
// ============================================================================

const BOSS_STAGES = [
  { stage: 1, name: "งูยักษ์", emoji: "🐍", hp: 500, image: "/boss1.png", bg: "/boss_arena_bg.jpg" },
  { stage: 2, name: "หมาป่า", emoji: "🐺", hp: 800, image: "/boss2.png", bg: "/boss_bg_stage2.jpg" },
  { stage: 3, name: "มังกร", emoji: "🐉", hp: 1200, image: "/boss3.png", bg: "/boss_bg_stage3.jpg" },
  { stage: 4, name: "อสูร", emoji: "👹", hp: 1500, image: "/boss4.png", bg: "/boss_arena_bg.jpg" }, // Reuse Stage 1 BG until quota resets
  { stage: 5, name: "จอมมาร", emoji: "👿", hp: 2000, image: "/boss5.png", bg: "/boss_bg_stage2.jpg" }, // Reuse Stage 2 BG until quota resets
];

const WEAPONS = {
  punch: { name: "หมัด", emoji: "🥊", multiplier: 1.0, minAmount: 50 },
  sword: { name: "ดาบ", emoji: "🗡️", multiplier: 1.2, minAmount: 100 },
  gun:   { name: "ปืน", emoji: "🔫", multiplier: 1.35, minAmount: 200 },
  magic: { name: "เวทมนตร์", emoji: "🔮", multiplier: 1.5, minAmount: 300 },
};

const SHEET_URL = "https://opensheet.elk.sh/1PUd1SFU6QNbKW0a2C8pJ3urNQeVGGAva3hkOQpiFrFg/1";

// ============================================================================
// 🎮 HELPER FUNCTIONS
// ============================================================================

/** Auto-detect or resolve weapon from donation amount */
const resolveWeapon = (donation) => {
  const amount = Number(donation.Amount) || 0;
  
  const availableWeapons = Object.values(WEAPONS).sort((a, b) => b.minAmount - a.minAmount);
  const autoWeapon = availableWeapons.find(w => amount >= w.minAmount) || WEAPONS.punch;
  
  const providedKey = (donation.Weapon || "").toLowerCase().trim();
  const providedWeapon = WEAPONS[providedKey];
  
  if (providedWeapon && amount >= providedWeapon.minAmount) {
    return providedWeapon;
  }
  return autoWeapon;
};

/** Calculate damage for a single donation */
const calcDamage = (donation) => {
  const amount = Number(donation.Amount) || 0;
  const weapon = resolveWeapon(donation);
  return Math.floor(amount * weapon.multiplier);
};

/** Generate deterministic pseudo-random number from string */
const hashCode = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

/** Determine current stage and remaining HP from total damage */
const getStageInfo = (totalDamage) => {
  let cumulative = 0;
  for (let i = 0; i < BOSS_STAGES.length; i++) {
    cumulative += BOSS_STAGES[i].hp;
    if (totalDamage < cumulative) {
      const bossCurrentHP = cumulative - totalDamage;
      return {
        stageIndex: i,
        boss: BOSS_STAGES[i],
        currentHP: bossCurrentHP,
        maxHP: BOSS_STAGES[i].hp,
        allDefeated: false,
      };
    }
  }
  // All bosses defeated
  return {
    stageIndex: BOSS_STAGES.length - 1,
    boss: BOSS_STAGES[BOSS_STAGES.length - 1],
    currentHP: 0,
    maxHP: BOSS_STAGES[BOSS_STAGES.length - 1].hp,
    allDefeated: true,
  };
};

// ============================================================================
// 🎮 COMPONENT: BossBattle
// ============================================================================

function BossBattle() {
  const [donations, setDonations] = useState([]);
  const [prevCount, setPrevCount] = useState(0);
  const [shaking, setShaking] = useState(false);
  const [floatingDmgs, setFloatingDmgs] = useState([]);
  const [stageClear, setStageClear] = useState(null); // stage number that was cleared
  const [showAllLogs, setShowAllLogs] = useState(false);
  const [viewedStageIndex, setViewedStageIndex] = useState(null); // null means viewing the latest active stage
  const [showHeroesModal, setShowHeroesModal] = useState(false);
  const prevStageRef = useRef(0);

  // ─── Fetch donations ───
  const fetchDonations = useCallback(() => {
    fetch(SHEET_URL)
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) return;
        setDonations(data);
      })
      .catch(err => console.error("BossBattle fetch error:", err));
  }, []);

  useEffect(() => {
    fetchDonations();
    const interval = setInterval(fetchDonations, 5000);
    return () => clearInterval(interval);
  }, [fetchDonations]);

  const totalDamage = donations.reduce((sum, d) => sum + calcDamage(d), 0);
  const stageInfo = getStageInfo(totalDamage);
  const heroCount = new Set(donations.map(d => d.Name).filter(Boolean)).size;
  const recentAttacks = [...donations].reverse();
  const displayedAttacks = showAllLogs ? recentAttacks : recentAttacks.slice(0, 5);
  
  // ─── Calculate Stage Participants ───
  const stageParticipants = BOSS_STAGES.map(() => new Set());
  let currentStageIdx = 0;
  let currentStageDamageAccumulated = 0;

  donations.forEach(d => {
    if (currentStageIdx >= BOSS_STAGES.length) return;
    const name = d.Name || "???";
    let dmgLeft = calcDamage(d);

    while (dmgLeft > 0 && currentStageIdx < BOSS_STAGES.length) {
      stageParticipants[currentStageIdx].add(name);
      const stageMax = BOSS_STAGES[currentStageIdx].hp;
      const stageRemaining = stageMax - currentStageDamageAccumulated;

      if (dmgLeft >= stageRemaining) {
        dmgLeft -= stageRemaining;
        currentStageIdx++;
        currentStageDamageAccumulated = 0;
      } else {
        currentStageDamageAccumulated += dmgLeft;
        dmgLeft = 0;
      }
    }
  });

  // ─── Determine Which Stage to Display ───
  const activeStageIndex = stageInfo.stageIndex;
  const displayStageIndex = viewedStageIndex !== null ? viewedStageIndex : activeStageIndex;
  const isViewingPast = displayStageIndex < activeStageIndex;
  
  const displayHeroes = Array.from(stageParticipants[displayStageIndex] || new Set());
  const displayBoss = BOSS_STAGES[displayStageIndex] || BOSS_STAGES[0];
  const displayMaxHP = displayBoss.hp;
  const displayCurrentHP = isViewingPast ? 0 : stageInfo.currentHP;
  const displayHpPercent = isViewingPast ? 0 : stageInfo.allDefeated ? 0 : (stageInfo.currentHP / stageInfo.maxHP) * 100;

  const handlePrevStage = () => {
    if (displayStageIndex > 0) setViewedStageIndex(displayStageIndex - 1);
  };
  const handleNextStage = () => {
    if (displayStageIndex < activeStageIndex) {
      if (displayStageIndex + 1 === activeStageIndex) {
        setViewedStageIndex(null); // Back to active
      } else {
        setViewedStageIndex(displayStageIndex + 1);
      }
    }
  };

  // ─── Calculate Top 3 Heroes ───
  const heroTotals = {};
  donations.forEach(d => {
    const name = d.Name || "???";
    const dmg = calcDamage(d);
    heroTotals[name] = (heroTotals[name] || 0) + dmg;
  });

  const allHeroesRanked = Object.entries(heroTotals).sort((a, b) => b[1] - a[1]);

  const topHeroes = allHeroesRanked
    .slice(0, 3)
    .map(([name, dmg], i) => ({ rank: i + 1, name, dmg }));

  // ─── Attack animation when new donations arrive ───
  useEffect(() => {
    if (donations.length > prevCount && prevCount > 0) {
      const newOnes = donations.slice(prevCount);
      // Shake boss
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      // Floating damage numbers
      newOnes.forEach((d, i) => {
        const dmg = calcDamage(d);
        const id = Date.now() + i;
        const offsetX = Math.random() * 60 - 30;
        setTimeout(() => {
          setFloatingDmgs(prev => [...prev, { id, value: dmg, x: offsetX }]);
          setTimeout(() => {
            setFloatingDmgs(prev => prev.filter(f => f.id !== id));
          }, 1500);
        }, i * 300);
      });
    }
    setPrevCount(donations.length);
  }, [donations.length]);

  const initialLoadDone = useRef(false);

  // ─── Stage clear detection ───
  useEffect(() => {
    if (!initialLoadDone.current) {
      if (donations.length > 0) {
        initialLoadDone.current = true;
        prevStageRef.current = stageInfo.stageIndex + 1;
      }
      return;
    }

    if (prevStageRef.current > 0 && stageInfo.stageIndex > prevStageRef.current - 1 && !stageInfo.allDefeated) {
      setStageClear(prevStageRef.current);
      setTimeout(() => setStageClear(null), 3000);
    }
    prevStageRef.current = stageInfo.stageIndex + 1;
    setViewedStageIndex(null); // Reset view to latest when boss dies
  }, [stageInfo.stageIndex, stageInfo.allDefeated, donations.length]);

  // ─── HP bar color class ───
  let hpClass = "";
  if (displayHpPercent <= 20) hpClass = "critical";
  else if (displayHpPercent <= 50) hpClass = "low";
  if (isViewingPast) hpClass = "dead";

  // ─── Victory Screen ───
  if (stageInfo.allDefeated) {
    return (
      <section className="boss-battle-section">
        <div className="boss-battle-inner">
          <div className="boss-title">⚔️ BOSS BATTLE</div>
          <div className="boss-victory">
            <div className="boss-victory-text">🏆 VICTORY! 🏆</div>
            <div className="boss-victory-sub">
              ทุกด่านถูกพิชิตแล้ว! ขอบคุณฮีโร่ทุกคน!
            </div>

 {/* Top 3 Damage Leaderboard */}
            {topHeroes.length > 0 && (
              <div className="boss-leaderboard" style={{ marginTop: '24px' }}>
                <div className="boss-leaderboard-title">🏆 TOP 3 DAMAGE 🏆</div>
                <div className="boss-heroes">
                  {topHeroes.map((hero) => (
                    <div key={hero.rank} className={`boss-hero-card rank-${hero.rank}`}>
                      <div className="boss-hero-rank">
                        {hero.rank === 1 ? "🥇" : hero.rank === 2 ? "🥈" : "🥉"}
                      </div>
                      <div className="boss-hero-name">{hero.name}</div>
                      <div className="boss-hero-dmg">{hero.dmg.toLocaleString()} DMG</div>
                    </div>
                  ))}
                </div>
                
                <button 
                  className="boss-btn-more"
                  style={{ marginTop: '16px', display: 'block', margin: '16px auto 0' }}
                  onClick={() => setShowHeroesModal(true)}
                >
                  View All Heroes ({allHeroesRanked.length})
                </button>
              </div>
            )}

            <div style={{ marginTop: "24px" }}>
              <div className="boss-stats">
                <div className="boss-stat">
                  <div className="boss-stat-value">{totalDamage.toLocaleString()}</div>
                  <div className="boss-stat-label">Total DMG</div>
                </div>
                <div className="boss-stat">
                  <div className="boss-stat-value">{heroCount}</div>
                  <div className="boss-stat-label">Heroes</div>
                </div>
                <div className="boss-stat">
                  <div className="boss-stat-value">{donations.length}</div>
                  <div className="boss-stat-label">Attacks</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* All Heroes Modal */}
        {showHeroesModal && (
          <div className="heroes-modal-overlay" onClick={() => setShowHeroesModal(false)}>
            <div className="heroes-modal-content" onClick={e => e.stopPropagation()}>
              <button className="heroes-modal-close" onClick={() => setShowHeroesModal(false)}>✖</button>
              <div className="heroes-modal-title">⚔️ ALL HEROES ({allHeroesRanked.length}) ⚔️</div>
              <div className="heroes-modal-list">
                {allHeroesRanked.map(([name, dmg], i) => (
                  <div key={name} className="heroes-modal-item">
                    <span className="heroes-modal-rank">#{i + 1}</span>
                    <span className="heroes-modal-name">{name}</span>
                    <span className="heroes-modal-dmg">{dmg.toLocaleString()} DMG</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </section>
    );
  }

  // ─── Battle Screen ───
  return (
    <section className="boss-battle-section">
      <div className="boss-battle-inner">

        {/* Stage Clear Overlay */}
        {stageClear && (
          <div className="stage-clear-overlay">
            <div className="stage-clear-text">⚔️ STAGE {stageClear} CLEAR! ⚔️</div>
          </div>
        )}

        {/* Header with Navigation */}
        <div className="boss-title">⚔️ BOSS BATTLE</div>

        <div className="boss-stage-navigator">
          <button 
            className="boss-nav-btn" 
            onClick={handlePrevStage} 
            disabled={displayStageIndex === 0}
          >
            ◀
          </button>
          <div className="boss-stage-label">
            ━━ STAGE {displayStageIndex + 1}/5 ━━
            {isViewingPast && <span className="stage-status-badge">DEFEATED</span>}
          </div>
          <button 
            className="boss-nav-btn" 
            onClick={handleNextStage} 
            disabled={!isViewingPast}
          >
            ▶
          </button>
        </div>

        {/* Weapon Legend */}
        <div className="boss-weapon-legend">
          {Object.entries(WEAPONS).map(([key, w]) => (
            <div key={key} className="boss-weapon-item">
              <span className="weapon-emoji">{w.emoji}</span>
              <div className="weapon-info">
                <span className="weapon-name">{w.name}</span>
                <span className="weapon-detail">{w.minAmount}฿ | ดาเมจ x{w.multiplier}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Boss Arena */}
        <div className="boss-arena-container">
          <div className="boss-hp-section">
            <div className="boss-name">
              {displayBoss.emoji} {displayBoss.name}
            </div>
            {/* HP Bar */}
            <div className="boss-hp-container">
              <div className="boss-hp-bar-bg">
                <div
                  className={`boss-hp-bar-fill ${hpClass}`}
                  style={{ width: `${displayHpPercent}%` }}
                />
              </div>
              <div className="boss-hp-text">
                {displayCurrentHP.toLocaleString()} / {displayMaxHP.toLocaleString()} HP
              </div>
            </div>
          </div>

          <div className="boss-arena-stage" style={{ backgroundImage: `url(${displayBoss.bg})` }}>
            {/* Heroes (Left side) */}
            <div className="arena-heroes">
              {displayHeroes.length === 0 && !isViewingPast && (
                <div className="arena-empty-text">Awaiting Heroes...</div>
              )}
              {displayHeroes.map((heroName, i) => {
                // Generate a consistent pseudo-random position based on hero name
                const hash = hashCode(heroName + displayStageIndex); 
                const top = 30 + (hash % 50); // 30% to 80%
                const left = 15 + ((hash >> 4) % 40); // 15% to 55% left
                const zIndex = Math.floor(top);
                const hue = hash % 360;
                
                return (
                  <div key={heroName} className="arena-hero" style={{ top: `${top}%`, left: `${left}%`, zIndex }}>
                    <div className="arena-hero-name">{heroName}</div>
                    <img 
                      src="/pixel_hero.png" 
                      alt="Hero" 
                      className="arena-hero-img" 
                      style={{ 
                        filter: `hue-rotate(${hue}deg) drop-shadow(1px 0 0 white) drop-shadow(-1px 0 0 white) drop-shadow(0 1px 0 white) drop-shadow(0 -1px 0 white) drop-shadow(0 4px 6px rgba(0,0,0,0.8))`,
                        transform: 'scale(1.2)'
                      }}  
                    />
                  </div>
                );
              })}
            </div>

            {/* Boss Image (Right side) */}
            <div className={`boss-image-wrapper ${shaking && !isViewingPast ? "shake" : ""} ${isViewingPast ? "defeated" : ""}`}>
              <img
                src={displayBoss.image}
                alt={displayBoss.name}
                className="boss-image"
              />
              {/* Floating Damage Numbers (only on active boss) */}
              {!isViewingPast && floatingDmgs.map(f => (
                <div
                  key={f.id}
                  className="floating-dmg"
                  style={{ left: `calc(50% + ${f.x}px)` }}
                >
                  -{f.value.toLocaleString()}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top 3 Damage Leaderboard */}
        {topHeroes.length > 0 && (
          <div className="boss-leaderboard">
            <div className="boss-leaderboard-title">🏆 TOP 3 DAMAGE 🏆</div>
            <div className="boss-heroes">
              {topHeroes.map((hero) => (
                <div key={hero.rank} className={`boss-hero-card rank-${hero.rank}`}>
                  <div className="boss-hero-rank">
                    {hero.rank === 1 ? "🥇" : hero.rank === 2 ? "🥈" : "🥉"}
                  </div>
                  <div className="boss-hero-name">{hero.name}</div>
                  <div className="boss-hero-dmg">{hero.dmg.toLocaleString()} DMG</div>
                </div>
              ))}
            </div>
            
            <button 
              className="boss-btn-more"
              style={{ marginTop: '16px', display: 'block', margin: '16px auto 0' }}
              onClick={() => setShowHeroesModal(true)}
            >
              View All Heroes ({allHeroesRanked.length})
            </button>
          </div>
        )}

        {/* Attack Log */}
        {recentAttacks.length > 0 && (
          <div className="boss-log-container">
            <div className="boss-log">
              <div className="boss-log-title">📜 Attack Log</div>
              {displayedAttacks.map((d, i) => {
                const weapon = resolveWeapon(d);
                const dmg = calcDamage(d);
                return (
                  <div key={i} className="boss-log-entry">
                    <span className="log-weapon">{weapon.emoji}</span>
                    <span className="log-name">{d.Name || "???"}</span>
                    <span className="log-dmg">-{dmg.toLocaleString()} DMG</span>
                  </div>
                );
              })}
            </div>
            
            {recentAttacks.length > 5 && (
              <button 
                className="boss-btn-more"
                onClick={() => setShowAllLogs(!showAllLogs)}
              >
                {showAllLogs ? "Show Less" : "Show More"}
              </button>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="boss-stats">
          <div className="boss-stat">
            <div className="boss-stat-value">{totalDamage.toLocaleString()}</div>
            <div className="boss-stat-label">Total DMG</div>
          </div>
          <div className="boss-stat">
            <div className="boss-stat-value">{heroCount}</div>
            <div className="boss-stat-label">Heroes</div>
          </div>
          <div className="boss-stat">
            <div className="boss-stat-value">{donations.length}</div>
            <div className="boss-stat-label">Attacks</div>
          </div>
        </div>

        {/* All Heroes Modal */}
        {showHeroesModal && (
          <div className="heroes-modal-overlay" onClick={() => setShowHeroesModal(false)}>
            <div className="heroes-modal-content" onClick={e => e.stopPropagation()}>
              <button className="heroes-modal-close" onClick={() => setShowHeroesModal(false)}>✖</button>
              <div className="heroes-modal-title">⚔️ ALL HEROES ({allHeroesRanked.length}) ⚔️</div>
              <div className="heroes-modal-list">
                {allHeroesRanked.map(([name, dmg], i) => (
                  <div key={name} className="heroes-modal-item">
                    <span className="heroes-modal-rank">#{i + 1}</span>
                    <span className="heroes-modal-name">{name}</span>
                    <span className="heroes-modal-dmg">{dmg.toLocaleString()} DMG</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}


      </div>
    </section>
  );
}

export default BossBattle;
