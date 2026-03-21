import { useState, useMemo, useRef, useEffect } from "react";

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&family=Rajdhani:wght@400;500;600;700&family=Saira:wght@800;900&family=Saira+Condensed:wght@800;900&display=swap');


  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #050510;
    --card-bg: #080818;
    --cyan: #00e5ff;
    --yellow: #ffe600;
    --red: #ff2d55;
    --green: #39ff14;
    --orange: #ff9500;
    --purple: #c77dff;
    --text: #dde3f0;
    --muted: #4a5060;
    --font-d: 'Orbitron', monospace;
    --font-m: 'Share Tech Mono', monospace;
    --font-b: 'Rajdhani', sans-serif;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--font-b); -webkit-font-smoothing: antialiased; overflow-x: hidden; }

  .app { max-width: 900px; margin: 0 auto; min-height: 100vh; display: flex; flex-direction: column; background: var(--bg); position: relative; width: 100%; box-sizing: border-box; overflow-x: hidden; }

  .app::after {
    content: '';
    position: fixed; inset: 0;
    background: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.018) 3px, rgba(0,0,0,0.018) 4px);
    pointer-events: none; z-index: 900;
  }

  /* ── PLAYERS VIEW ── */
  .players-view {
    flex: 1; display: flex; flex-direction: column; align-items: center;
    padding: 24px 20px 110px;
  }

  .date-badge {
    font-family: var(--font-d); font-size: 12px; font-weight: 700; letter-spacing: 2px;
    color: var(--text); border: 1.5px solid rgba(0,229,255,0.5); border-radius: 20px;
    padding: 6px 20px; margin-bottom: 18px;
    box-shadow: 0 0 12px rgba(0,229,255,0.15);
  }

  .main-title {
    font-family: 'OrbitronEmbed', var(--font-d); font-size: clamp(36px, 8vw, 72px); font-weight: 900;
    letter-spacing: 6px; color: var(--cyan);
    text-shadow: 0 0 20px rgba(0,229,255,0.9), 0 0 60px rgba(0,229,255,0.4), 0 0 120px rgba(0,229,255,0.15);
    margin-bottom: 16px; text-align: center; line-height: 1;
  }

  .countdown-wrap { display: flex; align-items: center; gap: 16px; margin-bottom: 6px; }
  .countdown-line { width: 60px; height: 2px; background: linear-gradient(90deg, transparent, #7ee8ff); }
  .countdown-line.r { background: linear-gradient(90deg, #7ee8ff, transparent); }
  .countdown {
    font-family: var(--font-m); font-size: clamp(28px, 6vw, 48px); font-weight: 400;
    color: #7ee8ff; letter-spacing: 4px; font-family: 'OrbitronEmbed', var(--font-m);
    text-shadow: 0 0 16px rgba(126,232,255,0.8), 0 0 40px rgba(126,232,255,0.3);
  }
  .countdown-label { font-family: var(--font-b); font-size: 12px; color: #7ee8ff; letter-spacing: 1px; text-align: center; margin-bottom: 32px; opacity: 0.8; }

  .player-grid {
    display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px;
    width: 100%; box-sizing: border-box; padding: 0 12px;
  }
  @media (max-width: 480px) {
    .player-grid { grid-template-columns: 1fr; gap: 12px; }
    .pc { min-height: 160px; padding: 20px 16px 18px; }
    .pc-name { font-size: clamp(28px, 8vw, 40px); letter-spacing: 5px; }
    .pc-sub { font-size: 15px; }
    .pc-bar-lbl { font-size: 15px; width: 80px; }
    .pc-bar-count { font-size: 13px; min-width: 52px; }
  }

  .pc {
    background: var(--card-bg);
    border: 2px solid var(--pc);
    border-radius: 14px;
    padding: 16px 12px 14px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: transform 0.18s ease, box-shadow 0.18s ease;
    box-shadow: 0 0 16px var(--pc-glow), inset 0 0 40px rgba(0,0,0,0.5);
    min-height: 180px;
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;
  }
  .pc::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at center top, var(--pc-dim) 0%, transparent 70%);
    pointer-events: none;
  }
  .pc:hover {
    transform: scale(1.03);
    box-shadow: 0 0 30px var(--pc-glow), 0 0 60px var(--pc-glow2), inset 0 0 40px rgba(0,0,0,0.3);
  }
  .pc:active { transform: scale(0.98); }
  .pc.all-done {
    border-width: 2.5px;
    animation: pc-pulse 3s ease-in-out infinite;
  }
  @keyframes pc-pulse {
    0%   { filter: brightness(1)   drop-shadow(0 0  4px var(--pc-glow)); }
    50%  { filter: brightness(1.3) drop-shadow(0 0 28px var(--pc-glow)) drop-shadow(0 0 55px var(--pc-glow)); }
    100% { filter: brightness(1)   drop-shadow(0 0  4px var(--pc-glow)); }
  }

  .pc-name {
    font-family: 'Orbitron', sans-serif !important;
    font-size: clamp(22px, 4.5vw, 36px);
    font-weight: 900 !important;
    letter-spacing: 4px;
    color: var(--pc);
    text-shadow: 0 0 20px var(--pc-glow), 0 0 40px var(--pc-glow2);
    position: relative;
    z-index: 1;
  }
  .pc-sub {
    font-family: var(--font-b); font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.85);
    letter-spacing: 0.5px; position: relative; z-index: 1; white-space: nowrap;
  }
  .pc-sub.has-progress { color: var(--pc); opacity: 0.9; }

  .pc-bars { width: 100%; display: flex; flex-direction: column; gap: 6px; position: relative; z-index: 1; margin-top: 4px; }
  .pc-bar-row { display: flex; align-items: center; gap: 8px; }
  .pc-bar-lbl { font-family: var(--font-b); font-size: 13px; font-weight: 700; color: var(--pc); width: 70px; flex-shrink: 0; letter-spacing: 0.5px; }
  .pc-bar-count { font-family: 'OrbitronEmbed', var(--font-d); font-size: 11px; font-weight: 700; color: var(--pc); text-shadow: 0 0 6px var(--pc-glow); white-space: nowrap; min-width: 44px; text-align: right; }
  .pc-bar-track { flex: 1; height: 3px; background: rgba(255,255,255,0.06); border-radius: 2px; overflow: hidden; }
  .pc-bar-fill { height: 100%; border-radius: 2px; background: var(--pc); box-shadow: 0 0 4px var(--pc-glow); transition: width 0.5s ease; }

  /* ── QUEST VIEW (new design) ── */
  .quests-view {
    flex: 1; padding: 20px 20px 110px; max-width: 680px; margin: 0 auto; width: 100%;
  }

  .quest-header { text-align: center; margin-bottom: 28px; }
  .quest-player-name {
    font-family: var(--font-d); font-size: clamp(24px, 6vw, 42px); font-weight: 900;
    letter-spacing: 3px; line-height: 1; margin-bottom: 4px;
  }
  .quest-subtitle { font-family: var(--font-d); font-size: 11px; color: var(--muted); letter-spacing: 4px; margin-bottom: 14px; }
  .back-btn {
    font-family: var(--font-d); font-size: 9px; font-weight: 700; letter-spacing: 2px;
    color: var(--muted); background: none; border: 1px solid rgba(255,255,255,0.08);
    border-radius: 6px; padding: 6px 14px; cursor: pointer; transition: all 0.2s; text-transform: uppercase;
  }
  .back-btn:hover { color: var(--text); border-color: rgba(255,255,255,0.2); }

  /* Exercise card */
  .ex-card {
    background: var(--card-bg);
    border: 2px solid var(--ac);
    border-radius: 14px;
    padding: 22px 20px 18px;
    margin-bottom: 16px;
    box-shadow: 0 0 14px var(--ac-glow);
  }
  .ex-card.done { border-color: #6bffb0; box-shadow: 0 0 14px rgba(107,255,176,0.3); }

  .ex-card-name {
    font-family: var(--font-b); font-size: 22px; font-weight: 700; color: #fff;
    margin-bottom: 14px; letter-spacing: 0.3px;
  }
  .ex-card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
  .ex-card-title { font-family: var(--font-b); font-size: 22px; font-weight: 700; color: #fff; letter-spacing: 0.3px; }
  .ex-done-label { font-family: var(--font-d); font-size: 13px; font-weight: 700; color: #6bffb0; text-shadow: 0 0 10px rgba(107,255,176,0.5); letter-spacing: 1px; }

  .ex-counter-row { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 12px; }
  .ex-counter-cur { font-family: 'OrbitronEmbed', var(--font-d); font-size: 56px; font-weight: 900; color: var(--ac); text-shadow: 0 0 14px var(--ac-glow); line-height: 1; letter-spacing: 2px; }
  .ex-counter-cur.done { font-family: 'OrbitronEmbed', var(--font-d); color: #6bffb0; text-shadow: 0 0 14px rgba(107,255,176,0.5); }
  .ex-counter-goal { font-family: 'OrbitronEmbed', var(--font-d); font-size: 18px; color: var(--muted); line-height: 1; }

  .ex-tracks { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
  .ex-track { height: 8px; background: rgba(255,255,255,0.05); border-radius: 4px; overflow: hidden; }
  .ex-track-fill { height: 100%; border-radius: 4px; background: var(--ac); box-shadow: 0 0 8px var(--ac-glow); transition: width 0.5s cubic-bezier(0.34,1.56,0.64,1); }
  .ex-track-fill.done { background: #6bffb0; box-shadow: 0 0 8px rgba(107,255,176,0.4); }
  .ex-track2 { height: 5px; }
  .ex-track2 .ex-track-fill { opacity: 0.4; }

  /* Sets list */
  .ex-sets-list { display: flex; flex-direction: column; gap: 3px; margin-bottom: 14px; padding: 10px 14px; background: rgba(255,255,255,0.03); border-radius: 8px; border: 1px solid rgba(255,255,255,0.06); }
  .ex-set-lbl { color: var(--muted); min-width: 52px; }
  .ex-set-val { color: var(--ac); font-weight: 700; font-size: 15px; }
  .ex-set-val.done-color { color: var(--green); }
  .ex-set-row { display: flex; align-items: center; gap: 8px; font-family: var(--font-m); font-size: 13px; }
  .ex-set-delete { margin-left: auto; padding: 3px 12px; border-radius: 5px; border: none; background: #9b1a2e; color: #fff; font-family: var(--font-d); font-size: 9px; font-weight: 700; letter-spacing: 1px; cursor: pointer; transition: all 0.15s; }
  .ex-set-delete:hover { background: #ff2d55; box-shadow: 0 0 8px rgba(255,45,85,0.5); }
  .ex-set-delete:active { transform: scale(0.93); }

  /* Quick-add grid */
  .quick-grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 6px;
    margin-bottom: 10px;
  }
  .quick-btn {
    padding: 8px 2px; border-radius: 7px;
    border: none; background: var(--ac);
    color: var(--bg); font-family: var(--font-b); font-size: 13px; font-weight: 700;
    cursor: pointer; transition: all 0.15s; letter-spacing: 0.3px;
    text-shadow: none;
  }
  .quick-btn:hover { filter: brightness(1.15); transform: scale(1.05); }
  .quick-btn:active { transform: scale(0.95); }

  /* Custom input row */
  .custom-row { display: flex; gap: 8px; }
  .custom-inp {
    flex: 1; background: rgba(255,255,255,0.07); border: 2px solid rgba(255,255,255,0.35);
    border-radius: 8px; padding: 11px 14px; color: #ffffff; font-family: var(--font-b);
    font-size: 16px; font-weight: 600; outline: none; transition: border-color 0.2s;
  }
  .custom-inp:focus { border-color: var(--ac); box-shadow: 0 0 0 2px rgba(255,255,255,0.08); }
  .custom-inp::placeholder { color: rgba(255,255,255,0.5); font-weight: 500; }
  .custom-add-btn {
    padding: 11px 22px; border-radius: 8px; border: none;
    background: var(--ac); color: var(--bg); font-family: var(--font-d);
    font-size: 11px; font-weight: 700; letter-spacing: 1px; cursor: pointer; transition: all 0.15s;
  }
  .custom-add-btn:hover { filter: brightness(1.15); }
  .custom-add-btn:active { transform: scale(0.95); }

  .qc-done-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 14px; border-radius: 20px;
    background: rgba(57,255,20,0.08); border: 1px solid rgba(57,255,20,0.3);
    color: var(--green); font-family: var(--font-d); font-size: 9px; font-weight: 700; letter-spacing: 2px;
    text-shadow: 0 0 8px rgba(57,255,20,0.5); margin-top: 10px;
  }

  /* ── LOG VIEW ── */
  .inner-view { flex: 1; padding: 20px 20px 110px; max-width: 520px; margin: 0 auto; width: 100%; }
  .view-title { font-family: var(--font-d); font-size: 11px; font-weight: 700; letter-spacing: 3px; color: var(--muted); text-transform: uppercase; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
  .view-title::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.06); }

  .form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
  .form-label { font-family: var(--font-d); font-size: 9px; font-weight: 700; color: var(--muted); letter-spacing: 2px; text-transform: uppercase; }
  .form-sel, .form-inp {
    background: var(--card-bg); border: 1px solid rgba(255,255,255,0.09); border-radius: 10px;
    padding: 13px 16px; color: var(--text); font-family: var(--font-b); font-size: 15px;
    font-weight: 500; outline: none; transition: border-color 0.2s; -webkit-appearance: none;
  }
  .form-sel { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%234a5060' d='M5 7L0 2h10z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 34px; }
  .form-sel:focus, .form-inp:focus { border-color: rgba(0,229,255,0.4); }
  .form-sel option { background: #0c0c1e; }
  .form-hint { font-family: var(--font-m); font-size: 10px; color: var(--muted); }

  .preview-box { background: var(--card-bg); border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 14px 16px; margin-bottom: 14px; }
  .preview-lbl { font-family: var(--font-m); font-size: 9px; color: var(--muted); letter-spacing: 1px; margin-bottom: 6px; }
  .preview-who { font-family: 'OrbitronEmbed', var(--font-d); font-size: 13px; font-weight: 900; letter-spacing: 1px; }
  .preview-total { font-family: 'OrbitronEmbed', var(--font-d); font-size: 26px; font-weight: 900; color: var(--cyan); text-shadow: 0 0 10px rgba(0,229,255,0.5); margin-top: 4px; line-height: 1; }
  .preview-time { font-family: var(--font-m); font-size: 10px; color: var(--muted); margin-top: 6px; }

  .save-btn { width: 100%; padding: 16px; border-radius: 12px; border: 1.5px solid var(--cyan); background: rgba(0,229,255,0.07); color: var(--cyan); font-family: var(--font-d); font-size: 11px; font-weight: 700; letter-spacing: 3px; cursor: pointer; transition: all 0.2s; }
  .save-btn:hover { background: rgba(0,229,255,0.14); box-shadow: 0 0 24px rgba(0,229,255,0.2); }
  .save-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .save-ok { text-align: center; padding: 40px 20px; border-radius: 14px; background: rgba(57,255,20,0.04); border: 1px solid rgba(57,255,20,0.2); animation: fadeUp 0.35s ease; }
  .save-ok-icon { font-size: 44px; margin-bottom: 12px; }
  .save-ok-title { font-family: var(--font-d); font-size: 14px; font-weight: 700; color: var(--green); letter-spacing: 2px; text-shadow: 0 0 14px rgba(57,255,20,0.5); }
  .save-ok-sub { font-family: var(--font-m); font-size: 11px; color: var(--muted); margin-top: 8px; }

  /* ── TOTALS ── */
  .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; }
  .stat-tile { background: var(--card-bg); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 14px; }
  .stat-tile.wide { grid-column: 1/-1; }
  .stat-lbl { font-family: var(--font-d); font-size: 8px; font-weight: 700; color: var(--muted); letter-spacing: 2px; margin-bottom: 6px; text-transform: uppercase; }
  .stat-val { font-family: 'OrbitronEmbed', var(--font-d); font-size: 26px; font-weight: 900; line-height: 1; }
  .stat-sub { font-family: var(--font-m); font-size: 10px; color: var(--muted); margin-top: 4px; }
  .toggle-row { display: flex; gap: 8px; margin-bottom: 16px; }
  .toggle-btn { flex: 1; padding: 8px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); background: var(--card-bg); color: var(--muted); font-family: var(--font-d); font-size: 9px; font-weight: 700; letter-spacing: 2px; cursor: pointer; transition: all 0.2s; text-transform: uppercase; }
  .toggle-btn.on { border-color: var(--cyan); color: var(--cyan); background: rgba(0,229,255,0.07); }
  .ex-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.04); gap: 4px; }
  .ex-row:last-child { border-bottom: none; }
  .ex-row-name { font-family: var(--font-b); font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 6px; white-space: nowrap; }
  .ex-row-val { font-family: var(--font-d); font-size: 13px; font-weight: 700; color: var(--cyan); white-space: nowrap; }
  .ex-row-sub { font-family: var(--font-m); font-size: 10px; color: var(--muted); text-align: right; margin-top: 2px; }

  /* ── BOARD ── */
  .lb-row { display: flex; align-items: center; gap: 14px; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
  .lb-row:last-child { border-bottom: none; }
  .lb-rank { font-family: var(--font-d); font-size: 18px; font-weight: 900; width: 28px; color: var(--muted); }
  .lb-rank.g { color: #ffd700; text-shadow: 0 0 8px rgba(255,215,0,0.6); }
  .lb-rank.s { color: #c0c8d8; }
  .lb-rank.b { color: #cd7f32; }
  .lb-info { flex: 1; }
  .lb-name { font-family: 'OrbitronEmbed', var(--font-d); font-size: 15px; font-weight: 900; letter-spacing: 1px; }
  .lb-sub { font-family: var(--font-m); font-size: 10px; color: var(--muted); }
  .lb-score { font-family: 'OrbitronEmbed', var(--font-d); font-size: 22px; font-weight: 900; color: var(--green); text-shadow: 0 0 10px rgba(57,255,20,0.5); }

  /* ── SETS (history) ── */
  .filter-row { display: flex; gap: 8px; margin-bottom: 16px; }
  .filter-sel { flex: 1; background: var(--card-bg); border: 1px solid rgba(255,255,255,0.07); border-radius: 8px; padding: 9px 12px; color: var(--text); font-family: var(--font-b); font-size: 13px; outline: none; -webkit-appearance: none; cursor: pointer; }
  .filter-sel option { background: #0c0c1e; }
  .hist-item { background: var(--card-bg); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 14px 16px; margin-bottom: 10px; transition: border-color 0.2s; }
  .hist-item:hover { border-color: rgba(255,255,255,0.13); }
  .hist-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px; }
  .hist-player { font-family: 'OrbitronEmbed', var(--font-d); font-size: 14px; font-weight: 900; letter-spacing: 1px; }
  .hist-ex { font-family: var(--font-b); font-size: 13px; color: var(--muted); margin-top: 1px; }
  .hist-total { font-family: 'OrbitronEmbed', var(--font-d); font-size: 20px; font-weight: 900; line-height: 1; }
  .hist-bottom { display: flex; justify-content: space-between; align-items: center; }
  .hist-chips { display: flex; gap: 4px; flex-wrap: wrap; }
  .hist-chip { font-family: var(--font-m); font-size: 10px; padding: 2px 6px; border-radius: 3px; background: rgba(255,255,255,0.04); color: var(--muted); }
  .hist-time { font-family: var(--font-m); font-size: 10px; color: var(--muted); text-align: right; line-height: 1.5; }

  /* ── TAB BAR ── */
  .tab-bar {
    position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
    width: 100%; max-width: 900px;
    display: grid; grid-template-columns: repeat(6, 1fr);
    background: rgba(5,5,16,0.97); border-top: 1px solid rgba(0,229,255,0.15);
    backdrop-filter: blur(20px); z-index: 50;
  }
  .tab-btn {
    padding: 14px 4px 18px; display: flex; flex-direction: column; align-items: center; justify-content: center;
    cursor: pointer; background: none; border: none; border-right: 1px solid rgba(0,229,255,0.08);
    color: var(--muted); transition: all 0.2s;
  }
  .tab-btn:last-child { border-right: none; }
  .tab-btn.active { color: var(--cyan); background: rgba(0,229,255,0.06); }
  .tab-btn.active .tab-lbl { color: var(--cyan); text-shadow: 0 0 10px rgba(0,229,255,0.8); }
  .tab-lbl-wrap { border-radius: 8px; padding: 4px 8px; }
  .tab-btn.active .tab-lbl-wrap { border: 1.5px solid rgba(0,229,255,0.6); box-shadow: 0 0 10px rgba(0,229,255,0.25), inset 0 0 6px rgba(0,229,255,0.05); }
  .tab-lbl { font-family: var(--font-d); font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: rgba(255,255,255,0.85); }

  /* ── SETTINGS ── */
  .settings-tile { background: var(--card-bg); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 4px 16px; margin-bottom: 16px; }
  .settings-row { display: flex; align-items: center; justify-content: space-between; padding: 13px 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
  .settings-row:last-child { border-bottom: none; }
  .s-lbl { font-family: var(--font-b); font-size: 15px; font-weight: 600; }
  .s-sub { font-family: var(--font-m); font-size: 10px; color: var(--muted); margin-top: 2px; }
  .goal-inp { width: 70px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 7px 10px; color: var(--cyan); font-family: var(--font-d); font-size: 14px; font-weight: 700; text-align: center; outline: none; }
  .goal-inp:focus { border-color: var(--cyan); }
  .ptags { display: flex; gap: 8px; flex-wrap: wrap; padding: 10px 0; }
  .ptag { font-family: var(--font-b); font-size: 13px; font-weight: 600; padding: 5px 14px; border-radius: 20px; border: 1px solid; }
  .add-p-row { display: flex; gap: 8px; padding: 6px 0 12px; }
  .add-p-inp { flex: 1; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 9px 12px; color: var(--text); font-family: var(--font-b); font-size: 14px; outline: none; }
  .add-p-inp:focus { border-color: rgba(0,229,255,0.3); }
  .small-btn { padding: 9px 16px; border-radius: 8px; border: 1px solid rgba(0,229,255,0.3); background: transparent; color: var(--cyan); font-family: var(--font-b); font-size: 13px; font-weight: 700; cursor: pointer; }
  .small-btn:hover { background: rgba(0,229,255,0.07); }


  /* ── CALENDAR ── */
  .cal-view { width:100%; padding: 12px 8px 110px; box-sizing: border-box; }
  .cal-nav { display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; }
  .cal-nav-btn { font-family:'OrbitronEmbed',var(--font-d); font-size:9px; font-weight:700; letter-spacing:1px;
    color:var(--cyan); background:rgba(0,229,255,0.06); border:1.5px solid rgba(0,229,255,0.3);
    border-radius:8px; padding:8px 12px; cursor:pointer; }
  .cal-nav-btn:hover { background:rgba(0,229,255,0.15); }
  .cal-month { font-family:'OrbitronEmbed',var(--font-d); font-size:clamp(13px,3.5vw,20px); font-weight:900; color:#fff; letter-spacing:2px; }
  .cal-weekdays { display:grid; grid-template-columns:repeat(7,1fr); gap:3px; margin-bottom:3px; }
  .cal-wd { font-family:var(--font-d); font-size:8px; font-weight:700; color:rgba(255,255,255,0.75); text-align:center; padding:3px 0; letter-spacing:1px; }
  .cal-wd.sun { color:#ffe600; }
  .cal-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:3px; }
  .cal-cell {
    background:rgba(8,8,24,0.9); border:1.5px solid rgba(0,229,255,0.4);
    border-radius:8px; min-height:60px; padding:5px 3px 4px;
    display:flex; flex-direction:column; align-items:center;
    box-sizing:border-box; box-shadow: 0 0 6px rgba(0,229,255,0.08);
  }
  .cal-cell.empty { background:transparent; border-color:transparent; }
  .cal-cell.sun { border-color:rgba(255,230,0,0.5); background:rgba(255,230,0,0.04); }
  .cal-cell.today { border-color:#39ffb0; border-width:2px; box-shadow:0 0 8px rgba(57,255,176,0.5); }
  .cal-day { font-family:'OrbitronEmbed',var(--font-d); font-size:10px; font-weight:900; color:#ccc; margin-bottom:4px; }
  .cal-cell.sun .cal-day { color:#ffe600; }
  .cal-cell.today .cal-day { color:#39ffb0; }
  .cal-checks { display:flex; flex-direction:column; gap:2px; width:100%; align-items:center; }
  .cal-check-row { display:flex; flex-wrap:wrap; gap:0px; justify-content:center; line-height:1; }
  .cal-check { font-size:8px; line-height:1.1; font-weight:900; }
  .cal-check.double { animation: check-pulse 2s ease-in-out infinite; }
  @keyframes check-pulse {
    0%   { opacity: 0.7; transform: scale(1);    text-shadow: none; }
    50%  { opacity: 1;   transform: scale(1.4);  text-shadow: 0 0 6px currentColor, 0 0 12px currentColor; }
    100% { opacity: 0.7; transform: scale(1);    text-shadow: none; }
  }


  /* ── CAL MODAL ── */
  .cal-modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.7); z-index:200; display:flex; align-items:flex-end; justify-content:center; padding-bottom:80px; }
  .cal-modal { background:#0d0d1a; border:1.5px solid rgba(0,229,255,0.3); border-radius:20px 20px 20px 20px; width:calc(100% - 24px); max-width:480px; padding:24px 20px 20px; box-shadow:0 0 40px rgba(0,229,255,0.15); max-height:75vh; overflow-y:auto; }
  .cal-modal-date { font-family:'OrbitronEmbed',var(--font-d); font-size:15px; font-weight:900; color:var(--cyan); text-align:center; margin-bottom:20px; letter-spacing:1px; }
  .cal-modal-players { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px; }
  .cal-modal-player-btn { border-radius:12px; padding:16px 10px; border:2px solid; background:rgba(0,0,0,0.3); cursor:pointer; text-align:center; }
  .cal-modal-player-btn:hover { background:rgba(255,255,255,0.05); }
  .cal-modal-player-name { font-family:'OrbitronEmbed',var(--font-d); font-size:16px; font-weight:900; margin-bottom:4px; }
  .cal-modal-player-sub { font-size:10px; color:rgba(255,255,255,0.4); letter-spacing:1px; }
  .cal-modal-back { font-family:'OrbitronEmbed',var(--font-d); font-size:10px; color:var(--muted); background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:7px 14px; cursor:pointer; letter-spacing:1px; }
  .cal-modal-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
  .cal-modal-player-title { font-family:'OrbitronEmbed',var(--font-d); font-size:16px; font-weight:900; }
  .cal-modal-exercises { display:flex; flex-direction:column; gap:10px; }
  .cal-modal-ex { background:rgba(255,255,255,0.04); border:1.5px solid rgba(255,255,255,0.1); border-radius:12px; padding:14px; }
  .cal-modal-ex-name { font-size:15px; font-weight:700; margin-bottom:8px; }
  .cal-modal-ex-total { font-family:'OrbitronEmbed',var(--font-d); font-size:20px; font-weight:900; text-align:center; margin-bottom:6px; }
  .cal-modal-ex-bar { height:4px; border-radius:2px; background:rgba(255,255,255,0.1); margin-bottom:10px; }
  .cal-modal-ex-fill { height:100%; border-radius:2px; }
  .cal-modal-quick { display:flex; flex-wrap:wrap; gap:6px; }
  .cal-modal-qbtn { border-radius:8px; padding:8px 0; font-family:'OrbitronEmbed',var(--font-d); font-size:11px; font-weight:900; cursor:pointer; border:none; flex:1; min-width:50px; }
  .cal-modal-save { width:100%; margin-top:16px; padding:14px; border-radius:12px; font-family:'OrbitronEmbed',var(--font-d); font-size:13px; font-weight:900; letter-spacing:2px; border:none; cursor:pointer; background:rgba(0,229,255,0.15); color:var(--cyan); border:1.5px solid rgba(0,229,255,0.4); }
  .cal-modal-custom { display:flex; gap:6px; margin-top:8px; }
  .cal-modal-custom-inp { flex:1; background:rgba(255,255,255,0.06); border:1.5px solid rgba(255,255,255,0.2); border-radius:8px; color:#fff; font-family:'OrbitronEmbed',var(--font-d); font-size:13px; font-weight:700; padding:8px 10px; outline:none; }
  .cal-modal-custom-btn { border-radius:8px; padding:8px 14px; font-family:'OrbitronEmbed',var(--font-d); font-size:12px; font-weight:900; cursor:pointer; border:none; }

  /* ── SUNDAY ── */
  .sunday-view { display:flex; flex-direction:column; align-items:center; justify-content:center; flex:1; padding:40px 24px; text-align:center; gap:24px; }
  .sunday-icon { font-size:64px; animation: sun-float 3s ease-in-out infinite; }
  @keyframes sun-float { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-12px);} }
  .sunday-title { font-family:'OrbitronEmbed',var(--font-d); font-size:clamp(22px,5vw,32px); font-weight:900; color:#ffe600; text-shadow:0 0 20px rgba(255,230,0,0.6); letter-spacing:3px; }
  .sunday-sub { font-family:var(--font-b); font-size:16px; color:rgba(255,255,255,0.6); line-height:1.6; max-width:280px; }
  .pc.pc-disabled { opacity:0.35; cursor:default; filter:grayscale(0.4); }

  /* ── TOTALS PAGE ── */
  .totals-view { width:100%; padding:16px 12px 110px; box-sizing:border-box; }
  .totals-title { font-family:'OrbitronEmbed',var(--font-d); font-size:clamp(18px,4vw,26px); font-weight:900; color:#ffffff; text-align:center; letter-spacing:4px; margin-bottom:20px; text-shadow:0 0 20px rgba(255,255,255,0.3); }
  .totals-ex-block { background:rgba(0,229,255,0.04); border:2px solid rgba(0,229,255,0.6); border-radius:14px; padding:16px 14px; margin-bottom:16px; box-shadow:0 0 14px rgba(0,229,255,0.15); }
  .totals-ex-name { font-family:'OrbitronEmbed',var(--font-d); font-size:16px; font-weight:900; color:var(--cyan); text-align:center; margin-bottom:12px; letter-spacing:2px; }
  .totals-player-card { border:1.5px solid; border-radius:10px; padding:14px 14px 12px; margin-bottom:10px; }
  .totals-player-name { font-family:'OrbitronEmbed',var(--font-d); font-size:15px; font-weight:900; text-align:center; margin-bottom:12px; letter-spacing:2px; }
  .totals-stats-row { display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; }
  .totals-stats-row.has-everest { grid-template-columns:1fr 1fr 1fr 1fr; }
  .totals-stat { display:flex; flex-direction:column; align-items:center; gap:0; }
  .totals-stat-lbl { font-family:var(--font-d); font-size:9px; font-weight:700; color:rgba(255,255,255,0.85); letter-spacing:1px; text-align:center; text-transform:uppercase; min-height:28px; display:flex; align-items:center; justify-content:center; }

  .totals-stat-val { font-family:'OrbitronEmbed',var(--font-d); font-size:22px; font-weight:900; line-height:1; }
  .totals-stat-date { font-family:var(--font-b); font-size:10px; color:rgba(255,255,255,0.4); margin-top:1px; }


  /* ── BOARD PAGE ── */
  .board-view { width:100%; padding:12px 12px 110px; box-sizing:border-box; }
  .board-title { font-family:'OrbitronEmbed',var(--font-d); font-size:clamp(14px,3.5vw,20px); font-weight:900; color:#ffffff; text-align:center; letter-spacing:3px; margin-bottom:14px; text-shadow:0 0 20px rgba(255,255,255,0.3); }
  .board-nav { display:flex; align-items:center; justify-content:space-between; margin-bottom:18px; }
  .board-nav-btn { font-family:'OrbitronEmbed',var(--font-d); font-size:9px; font-weight:700; letter-spacing:1px; color:var(--cyan); background:rgba(0,229,255,0.06); border:1.5px solid rgba(0,229,255,0.3); border-radius:8px; padding:8px 12px; cursor:pointer; }
  .board-month { font-family:'OrbitronEmbed',var(--font-d); font-size:13px; font-weight:700; color:rgba(255,255,255,0.7); letter-spacing:1px; }
  .board-ex-block { background:rgba(8,8,24,0.8); border:2px solid rgba(0,229,255,0.6); border-radius:14px; padding:14px 14px; margin-bottom:14px; box-shadow:0 0 16px rgba(0,229,255,0.2); }
  .board-ex-name { font-family:'OrbitronEmbed',var(--font-d); font-size:17px; font-weight:900; color:#fff; text-align:center; margin-bottom:14px; letter-spacing:2px; }
  .board-category { background:rgba(0,229,255,0.06); border:1.5px solid rgba(0,229,255,0.2); border-radius:10px; padding:12px 14px; margin-bottom:10px; }
  .board-cat-title { font-family:'OrbitronEmbed',var(--font-d); font-size:11px; font-weight:900; color:var(--cyan); text-align:center; letter-spacing:2px; margin-bottom:12px; }
  .board-row { display:flex; align-items:center; justify-content:space-between; padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.06); }
  .board-row:last-child { border-bottom:none; }
  .board-row-name { font-family:'OrbitronEmbed',var(--font-d); font-size:22px; font-weight:900; }
  .board-row-val { font-family:'OrbitronEmbed',var(--font-d); font-size:22px; font-weight:900; color:rgba(255,255,255,0.9); }
  .board-row-empty { color:rgba(255,255,255,0.25); font-size:14px; }
  .board-info-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.75); z-index:200; display:flex; align-items:center; justify-content:center; padding:20px; }
  .board-info-modal { background:#0c0c1e; border:1.5px solid rgba(0,229,255,0.4); border-radius:16px; padding:24px 20px; max-width:320px; width:100%; }
  .board-info-title { font-family:'OrbitronEmbed',var(--font-d); font-size:12px; font-weight:900; color:var(--cyan); letter-spacing:2px; margin-bottom:16px; text-align:center; }
  .board-info-text { font-family:var(--font-b); font-size:13px; color:rgba(255,255,255,0.8); line-height:1.6; margin-bottom:16px; }
  .board-info-close { width:100%; padding:12px; border-radius:10px; border:1.5px solid rgba(0,229,255,0.4); background:rgba(0,229,255,0.07); color:var(--cyan); font-family:var(--font-d); font-size:10px; font-weight:700; letter-spacing:2px; cursor:pointer; }
  .trend-up { color:#39ff14; font-family:'OrbitronEmbed',var(--font-d); font-size:10px; font-weight:900; letter-spacing:0.5px; }
  .trend-down { color:#ff2d55; font-family:'OrbitronEmbed',var(--font-d); font-size:10px; font-weight:900; letter-spacing:0.5px; }
  .trend-same { color:rgba(255,255,255,0.3); font-family:'OrbitronEmbed',var(--font-d); font-size:10px; font-weight:700; }
  @media (max-width: 480px) {
    .board-ex-name { font-size:20px; }
    .board-cat-title { font-size:13px; letter-spacing:1.5px; }
    .board-row-name { font-size:26px; }
    .board-row-val { font-size:26px; }
    .trend-up, .trend-down, .trend-same { font-size:12px; }
  }


  /* ── SETS PAGE ── */
  .sets-view { width:100%; padding:12px 12px 110px; box-sizing:border-box; }
  .sets-title { font-family:'OrbitronEmbed',var(--font-d); font-size:clamp(18px,4vw,24px); font-weight:900; color:#ffffff; letter-spacing:4px; margin-bottom:18px; text-shadow:0 0 16px rgba(255,255,255,0.3); text-align:center; }
  .sets-filters-row { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:16px; }
  .sets-filter-section { display:flex; flex-direction:column; gap:6px; }
  .sets-filter-label { font-family:'OrbitronEmbed',var(--font-d); font-size:9px; font-weight:700; color:rgba(255,255,255,0.5); letter-spacing:2px; margin-bottom:2px; }
  .sets-filter-btns { display:flex; flex-direction:column; gap:5px; }
  .sets-filter-btn { background:rgba(255,255,255,0.04); border:1.5px solid rgba(255,255,255,0.12); border-radius:8px; padding:9px 8px; font-family:var(--font-b); font-size:13px; font-weight:600; color:rgba(255,255,255,0.75); cursor:pointer; text-align:center; transition:all 0.15s; }
  .sets-filter-btn.active { border-color:var(--cyan); color:var(--cyan); background:rgba(0,229,255,0.08); box-shadow:0 0 8px rgba(0,229,255,0.15); }
  .sets-filter-btn:hover { background:rgba(255,255,255,0.07); }
  .sets-history-label { font-family:var(--font-b); font-size:12px; color:rgba(255,255,255,0.3); margin-bottom:14px; }
  .sets-table-header { display:grid; grid-template-columns:70px 80px 1fr 80px; gap:4px; padding:0 4px 8px; border-bottom:1.5px solid var(--cyan); margin-bottom:4px; }
  .sets-th { font-family:'OrbitronEmbed',var(--font-d); font-size:9px; font-weight:900; color:var(--cyan); letter-spacing:1px; }
  .sets-row { display:grid; grid-template-columns:70px 80px 1fr 80px; gap:4px; align-items:center; padding:12px 4px; border-bottom:1px solid rgba(255,255,255,0.06); }
  .sets-row-player { font-family:'OrbitronEmbed',var(--font-d); font-size:11px; font-weight:900; }
  .sets-row-ex { font-family:var(--font-b); font-size:12px; color:rgba(255,255,255,0.6); }
  .sets-row-sets { font-family:'OrbitronEmbed',var(--font-d); font-size:13px; font-weight:900; color:#fff; }
  .sets-row-total { font-family:var(--font-b); font-size:10px; color:rgba(255,255,255,0.4); margin-top:2px; }
  .sets-row-date { font-family:var(--font-b); font-size:11px; color:rgba(255,255,255,0.5); }
  .sets-row-time { font-family:'OrbitronEmbed',var(--font-d); font-size:11px; font-weight:700; color:rgba(255,255,255,0.7); }


  /* ── ADMIN MODAL ── */
  .admin-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.75); z-index:300; display:flex; align-items:center; justify-content:center; padding:20px; }
  .admin-modal { background:#0d0d1a; border:1.5px solid rgba(0,229,255,0.35); border-radius:20px; width:100%; max-width:380px; padding:28px 22px 22px; box-shadow:0 0 40px rgba(0,229,255,0.15); }
  .admin-title { font-family:'OrbitronEmbed',var(--font-d); font-size:16px; font-weight:900; color:var(--cyan); text-align:center; letter-spacing:2px; margin-bottom:20px; }
  .admin-pin-row { display:flex; gap:8px; margin-bottom:10px; }
  .admin-pin-inp { flex:1; background:rgba(255,255,255,0.06); border:1.5px solid rgba(0,229,255,0.3); border-radius:10px; color:#fff; font-family:'OrbitronEmbed',var(--font-d); font-size:20px; font-weight:900; padding:12px 14px; outline:none; letter-spacing:6px; text-align:center; }
  .admin-pin-inp.error { border-color:#ff2d55; }
  .admin-pin-submit { background:rgba(0,229,255,0.12); border:1.5px solid rgba(0,229,255,0.4); border-radius:10px; color:var(--cyan); font-family:'OrbitronEmbed',var(--font-d); font-size:11px; font-weight:900; padding:12px 16px; cursor:pointer; letter-spacing:1px; }
  .admin-error { color:#ff2d55; font-size:11px; text-align:center; margin-bottom:10px; font-family:var(--font-b); }
  .admin-cancel { width:100%; margin-top:12px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.1); border-radius:10px; color:rgba(255,255,255,0.4); font-family:'OrbitronEmbed',var(--font-d); font-size:10px; font-weight:700; padding:10px; cursor:pointer; letter-spacing:1px; }
  .admin-player-list { display:flex; flex-direction:column; gap:8px; margin-bottom:16px; }
  .admin-player-row { display:flex; align-items:center; justify-content:space-between; background:rgba(255,255,255,0.04); border-radius:10px; padding:10px 14px; border:1px solid rgba(255,255,255,0.08); }
  .admin-player-name { font-family:'OrbitronEmbed',var(--font-d); font-size:13px; font-weight:900; }
  .admin-del-btn { background:rgba(255,45,85,0.15); border:1px solid rgba(255,45,85,0.4); border-radius:7px; color:#ff2d55; font-size:11px; font-weight:700; padding:6px 12px; cursor:pointer; font-family:var(--font-d); }
  .admin-add-section { border-top:1px solid rgba(255,255,255,0.08); padding-top:16px; }
  .admin-add-title { font-family:'OrbitronEmbed',var(--font-d); font-size:10px; color:rgba(255,255,255,0.4); letter-spacing:2px; margin-bottom:10px; }
  .admin-inp { width:100%; background:rgba(255,255,255,0.06); border:1.5px solid rgba(255,255,255,0.15); border-radius:10px; color:#fff; font-family:var(--font-b); font-size:15px; padding:11px 14px; outline:none; box-sizing:border-box; margin-bottom:10px; }
  .admin-color-label { font-family:'OrbitronEmbed',var(--font-d); font-size:9px; color:rgba(255,255,255,0.5); letter-spacing:2px; margin-bottom:8px; }
  .admin-color-presets { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:12px; }
  .admin-color-dot { width:36px; height:36px; border-radius:10px; cursor:pointer; border:2.5px solid transparent; transition:all 0.15s; }
  .admin-color-dot.sel { border-color:#fff; transform:scale(1.12); box-shadow:0 0 10px currentColor; }
  .admin-color-custom { display:flex; align-items:center; gap:10px; background:rgba(255,255,255,0.05); border:1.5px solid rgba(255,255,255,0.12); border-radius:10px; padding:10px 14px; }
  .admin-color-inp { width:44px; height:36px; border:none; border-radius:8px; cursor:pointer; background:none; padding:0; }
  .admin-color-custom-label { font-family:var(--font-b); font-size:13px; color:rgba(255,255,255,0.5); }
  .admin-color-preview { width:36px; height:36px; border-radius:8px; border:2px solid rgba(255,255,255,0.2); }
  .admin-add-btn { width:100%; padding:13px; border-radius:10px; font-family:'OrbitronEmbed',var(--font-d); font-size:12px; font-weight:900; letter-spacing:2px; border:1.5px solid rgba(0,229,255,0.4); background:rgba(0,229,255,0.1); color:var(--cyan); cursor:pointer; }



  /* ── EVEREST WIDGET ── */

  .everest-title { font-family:'OrbitronEmbed',var(--font-d); font-size:10px; font-weight:900; color:rgba(255,255,255,0.5); letter-spacing:2px; text-align:center; margin-bottom:10px; }
  .everest-mountain-wrap { position:relative; width:100%; height:120px; margin-bottom:10px; }
  .everest-svg { width:100%; height:100%; }
  .everest-fill { transition: clip-path 1.2s cubic-bezier(0.4,0,0.2,1); }
  .everest-bar-wrap { margin-bottom:10px; }
  .everest-bar-track { height:6px; background:rgba(255,255,255,0.08); border-radius:3px; overflow:hidden; }
  .everest-bar-fill { height:100%; border-radius:3px; background:linear-gradient(90deg,#00b4d8,#90e0ef); transition:width 1.2s cubic-bezier(0.4,0,0.2,1); }
  .everest-bar-labels { display:flex; justify-content:space-between; margin-top:4px; }
  .everest-bar-pct { font-family:'OrbitronEmbed',var(--font-d); font-size:10px; font-weight:900; color:#90e0ef; }
  .everest-bar-alt { font-family:var(--font-b); font-size:10px; color:rgba(255,255,255,0.4); }
  .everest-stats { display:grid; grid-template-columns:1fr 1fr 1fr; gap:6px; margin-bottom:8px; }
  .everest-stat { text-align:center; }
  .everest-stat-lbl { font-family:var(--font-d); font-size:7px; font-weight:700; color:rgba(255,255,255,0.35); letter-spacing:1px; text-transform:uppercase; margin-bottom:2px; }
  .everest-stat-val { font-family:'OrbitronEmbed',var(--font-d); font-size:13px; font-weight:900; color:#90e0ef; }
  .everest-microcopy { font-family:var(--font-b); font-size:10px; color:rgba(255,255,255,0.3); text-align:center; font-style:italic; }
  .everest-summit { text-align:center; padding:8px 0 4px; }
  .everest-summit-badge { font-family:'OrbitronEmbed',var(--font-d); font-size:13px; font-weight:900; color:#ffe600; text-shadow:0 0 16px rgba(255,230,0,0.8); letter-spacing:2px; animation:pc-pulse 2s ease-in-out infinite; }

  @keyframes spin { to { transform: rotate(360deg); } }
  /* ── CONFETTI ── */
  .conf-wrap { position: fixed; top: 40%; left: 50%; transform: translate(-50%,-50%); pointer-events: none; z-index: 950; }
  .conf-p { position: absolute; width: 8px; height: 8px; border-radius: 2px; animation: cfall 1.4s ease forwards; }
  @keyframes cfall { 0% { opacity: 1; transform: translate(0,0) rotate(0); } 100% { opacity: 0; transform: translate(var(--dx), var(--dy)) rotate(540deg); } }

  @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
  .fade-up { animation: fadeUp 0.3s ease; }
  .empty-state { text-align: center; padding: 48px 20px; color: var(--muted); font-family: var(--font-m); font-size: 12px; }
  .empty-icon { font-size: 36px; margin-bottom: 12px; }
`;

const EXERCISES = [
  { name: "Push-ups", icon: "💪", goal: 100 },
  { name: "Squats",   icon: "🏋️", goal: 100 },
  { name: "Sit-ups",  icon: "🔥", goal: 100 },
  { name: "Pull-ups", icon: "⚡", goal: 25  },
];

const QUICK_ADDS = [5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80];

const DEFAULT_PLAYERS = [
  { name: "Rupe",  color: "#ffe600", dim: "rgba(255,230,0,0.08)",  glow: "rgba(255,230,0,0.5)",  glow2: "rgba(255,230,0,0.15)", border: "rgba(255,230,0,0.3)" },
  { name: "Ripa",  color: "#ff2d55", dim: "rgba(255,45,85,0.08)",  glow: "rgba(255,45,85,0.5)",  glow2: "rgba(255,45,85,0.15)", border: "rgba(255,45,85,0.3)" },
  { name: "Maana", color: "#ff9500", dim: "rgba(255,149,0,0.08)",  glow: "rgba(255,149,0,0.5)",  glow2: "rgba(255,149,0,0.15)", border: "rgba(255,149,0,0.3)" },
  { name: "Henkka", color: "#4dff91", dim: "rgba(77,255,145,0.08)", glow: "rgba(77,255,145,0.5)", glow2: "rgba(77,255,145,0.15)", border: "rgba(77,255,145,0.3)" },
  { name: "Johan", color: "#00e5ff", dim: "rgba(0,229,255,0.08)",  glow: "rgba(0,229,255,0.5)",  glow2: "rgba(0,229,255,0.15)", border: "rgba(0,229,255,0.3)" },
  { name: "Osku",  color: "#c77dff", dim: "rgba(199,125,255,0.08)", glow: "rgba(199,125,255,0.5)", glow2: "rgba(199,125,255,0.15)", border: "rgba(199,125,255,0.3)" },
];

function parseSet(raw) {
  if (!raw?.trim()) return [];
  return (raw.match(/\d+/g) || []).map(Number).filter(n => n > 0);
}
function fmtDate(d) {
  return d.toLocaleDateString("en-GB", { weekday:"long", day:"numeric", month:"long", year:"numeric" });
}
function fmtDateShort(d) { return d.toLocaleDateString("fi-FI", { day:"2-digit", month:"2-digit", year:"numeric" }); }
function fmtTime(d) { return d.toLocaleTimeString("fi-FI", { hour:"2-digit", minute:"2-digit" }); }
function sameDay(a,b) { return a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate(); }

function seedData() {
  const raw = [
    ["seed_1","Ripa","Push-ups",[30,30,40],100,"2026-03-04T20:23:00"],
    ["seed_2","Rupe","Push-ups",[35,40,32],107,"2026-03-04T20:39:00"],
    ["seed_3","Ripa","Push-ups",[30,45,30,30],135,"2026-03-03T12:33:00"],
    ["seed_4","Rupe","Push-ups",[60,42],102,"2026-03-03T21:41:00"],
    ["seed_5","Ripa","Push-ups",[30,40,30],100,"2026-03-02T13:06:00"],
    ["seed_6","Rupe","Push-ups",[40,35,41],116,"2026-03-02T21:27:00"],
    ["seed_7","Maana","Squats",[20,20,20],60,"2026-03-02T08:33:00"],
    ["seed_8","Rupe","Push-ups",[45,41,37],123,"2026-02-28T23:07:00"],
    ["seed_9","Ripa","Squats",[50],50,"2026-02-28T18:12:00"],
    ["seed_10","Ripa","Push-ups",[30,40,30],100,"2026-02-28T16:00:00"],
    ["seed_11","Ripa","Push-ups",[30,30,40],100,"2026-02-27T14:54:00"],
    ["seed_12","Ripa","Sit-ups",[40,40,20],100,"2026-02-27T16:48:00"],
    ["seed_13","Rupe","Push-ups",[45,56],101,"2026-02-27T21:05:00"],
    ["seed_14","Ripa","Squats",[50,50],100,"2026-02-26T00:02:00"],
    ["seed_15","Ripa","Push-ups",[30,40,40],110,"2026-02-26T11:41:00"],
    ["seed_16","Ripa","Sit-ups",[20,30,30,20],100,"2026-02-26T15:21:00"],
    ["seed_17","Ripa","Pull-ups",[5,5,8,7],25,"2026-02-26T16:17:00"],
    ["seed_18","Rupe","Push-ups",[40,35,32],107,"2026-02-26T20:19:00"],
    ["seed_19","Ripa","Push-ups",[30,40,30],100,"2026-02-25T11:26:00"],
    ["seed_20","Rupe","Push-ups",[32,31,10,40],113,"2026-02-25T19:18:00"],
    ["seed_21","Ripa","Pull-ups",[7,5,5,7,4],28,"2026-02-24T16:57:00"],
    ["seed_22","Ripa","Push-ups",[40,30,40],110,"2026-02-24T15:34:00"],
    ["seed_23","Rupe","Push-ups",[30,40,40],110,"2026-02-24T19:27:00"],
    ["seed_24","Ripa","Push-ups",[45,50,30],125,"2026-02-23T13:41:00"],
    ["seed_25","Ripa","Pull-ups",[7,8,7,6],28,"2026-02-23T14:58:00"],
    ["seed_26","Rupe","Push-ups",[35,30,35],100,"2026-02-23T18:59:00"],
    ["seed_27","Maana","Squats",[20,20,20,40],100,"2026-02-23T09:32:00"],
    ["seed_28","Ripa","Push-ups",[40,40,35],115,"2026-02-21T12:10:00"],
    ["seed_29","Rupe","Push-ups",[30,31,41],102,"2026-02-21T21:37:00"],
    ["seed_30","Ripa","Push-ups",[30,30,40],100,"2026-02-20T11:03:00"],
    ["seed_31","Rupe","Push-ups",[40,40,31],111,"2026-02-20T21:52:00"],
    ["seed_32","Maana","Squats",[30],30,"2026-02-20T15:33:00"],
    ["seed_33","Ripa","Push-ups",[40,40,20,30],130,"2026-02-19T11:37:00"],
    ["seed_34","Rupe","Push-ups",[40,40,30],110,"2026-02-19T22:23:00"],
    ["seed_35","Ripa","Push-ups",[40,40,20],100,"2026-02-18T11:42:00"],
    ["seed_36","Rupe","Push-ups",[40,44,35],119,"2026-02-18T19:09:00"],
    ["seed_37","Ripa","Pull-ups",[7,6,8,5],26,"2026-02-17T16:23:00"],
    ["seed_38","Ripa","Push-ups",[30,45,30],105,"2026-02-17T15:01:00"],
    ["seed_39","Rupe","Push-ups",[50,40,31],121,"2026-02-17T19:25:00"],
    ["seed_40","Ripa","Push-ups",[45,30,40],115,"2026-02-16T14:48:00"],
    ["seed_41","Rupe","Push-ups",[40,35,35],110,"2026-02-16T18:37:00"],
    ["seed_42","Ripa","Pull-ups",[5],5,"2026-02-16T16:43:00"],
    ["seed_43","Ripa","Sit-ups",[20],20,"2026-02-16T16:42:00"],
    ["seed_44","Ripa","Squats",[30],30,"2026-02-16T14:54:00"],
    ["seed_45","Maana","Squats",[20,20,20,20],80,"2026-02-16T08:21:00"],
    ["seed_46","Rupe","Push-ups",[40,35,25],100,"2026-02-14T17:57:00"],
    ["seed_47","Ripa","Push-ups",[45,30,25],100,"2026-02-14T16:00:00"],
    ["seed_48","Maana","Squats",[20],20,"2026-02-14T15:09:00"],
    ["seed_49","Rupe","Squats",[20],20,"2026-02-14T15:09:00"],
    ["seed_50","Ripa","Push-ups",[30,40,30],100,"2026-02-13T15:30:00"],
    ["seed_51","Rupe","Push-ups",[41,40,30],111,"2026-02-13T19:27:00"],
    ["seed_52","Ripa","Squats",[50,50],100,"2026-02-12T23:55:00"],
    ["seed_53","Rupe","Push-ups",[30,35,37],102,"2026-02-12T23:39:00"],
    ["seed_54","Ripa","Push-ups",[33,37,35],105,"2026-02-12T20:59:00"],
    ["seed_55","Ripa","Push-ups",[30,40,30],100,"2026-02-11T15:28:00"],
    ["seed_56","Rupe","Push-ups",[30,35,35],100,"2026-02-11T19:43:00"],
    ["seed_57","Ripa","Push-ups",[56,44],100,"2026-02-10T19:42:00"],
    ["seed_58","Rupe","Push-ups",[36,30,34],100,"2026-02-10T18:36:00"],
    ["seed_59","Ripa","Push-ups",[30,40,30],100,"2026-02-09T12:25:00"],
    ["seed_60","Rupe","Push-ups",[41,35,27],103,"2026-02-09T19:04:00"],
    ["seed_61","Rupe","Push-ups",[52,35,20],107,"2026-02-07T20:16:00"],
    ["seed_62","Ripa","Sit-ups",[25],25,"2026-02-07T19:46:00"],
    ["seed_63","Ripa","Push-ups",[20,30,30,20],100,"2026-02-07T13:08:00"],
    ["seed_64","Ripa","Squats",[50,50],100,"2026-02-07T17:11:00"],
    ["seed_65","Ripa","Squats",[50,50],100,"2026-02-06T21:09:00"],
    ["seed_66","Ripa","Sit-ups",[50,30,20],100,"2026-02-06T20:54:00"],
    ["seed_67","Ripa","Pull-ups",[5,5,8,4,5],27,"2026-02-06T20:48:00"],
    ["seed_68","Rupe","Push-ups",[51,30,32],113,"2026-02-06T21:49:00"],
    ["seed_69","Maana","Squats",[20,20],40,"2026-02-06T21:44:00"],
    ["seed_70","Ripa","Push-ups",[30,50,30],110,"2026-02-06T13:27:00"],
    ["seed_71","Ripa","Squats",[50,50],100,"2026-02-05T22:20:00"],
    ["seed_72","Ripa","Push-ups",[30,40,40,20],130,"2026-02-05T14:21:00"],
    ["seed_73","Rupe","Push-ups",[40,40,30],110,"2026-02-05T20:23:00"],
    ["seed_74","Ripa","Pull-ups",[5],5,"2026-02-04T23:06:00"],
    ["seed_75","Ripa","Sit-ups",[20],20,"2026-02-04T23:04:00"],
    ["seed_76","Ripa","Squats",[50],50,"2026-02-04T23:04:00"],
    ["seed_77","Ripa","Push-ups",[30,30,40,20],120,"2026-02-04T15:24:00"],
    ["seed_78","Rupe","Push-ups",[35,30,35],100,"2026-02-04T21:36:00"],
    ["seed_79","Ripa","Push-ups",[30,30,20,20],100,"2026-02-03T23:49:00"],
    ["seed_80","Rupe","Push-ups",[30,30,30,10],100,"2026-02-03T19:23:00"],
    ["seed_81","Ripa","Push-ups",[45,55],100,"2026-02-02T16:00:00"],
    ["seed_82","Maana","Squats",[20,20],40,"2026-02-02T16:00:00"],
    ["seed_83","Rupe","Push-ups",[35,35,36],106,"2026-02-02T16:00:00"],
    ["seed_84","Rupe","Squats",[20,20,20,20,20],100,"2026-01-31T16:00:00"],
    ["seed_85","Rupe","Push-ups",[30,30,20,30],110,"2026-01-31T16:00:00"],
    ["seed_86","Ripa","Squats",[30,50],80,"2026-01-31T16:00:00"],
    ["seed_87","Ripa","Push-ups",[40,30],70,"2026-01-31T16:00:00"],
    ["seed_88","Rupe","Push-ups",[45,35,30],110,"2026-01-30T16:00:00"],
    ["seed_89","Ripa","Squats",[50,30,20],100,"2026-01-30T16:00:00"],
    ["seed_90","Ripa","Push-ups",[45,35,40],120,"2026-01-30T16:00:00"],
    ["seed_91","Ripa","Pull-ups",[7,5,5,4,5],26,"2026-01-30T16:00:00"],
    ["seed_92","Ripa","Sit-ups",[20],20,"2026-01-30T16:00:00"],
    ["seed_93","Rupe","Squats",[1,30,25,10],66,"2026-01-29T16:00:00"],
    ["seed_94","Rupe","Push-ups",[43,30,30],103,"2026-01-29T16:00:00"],
    ["seed_95","Ripa","Squats",[10],10,"2026-01-29T16:00:00"],
    ["seed_96","Ripa","Push-ups",[20,30,30,20],100,"2026-01-29T16:00:00"],
    ["seed_97","Rupe","Push-ups",[37,25,21,30],113,"2026-01-28T16:00:00"],
    ["seed_98","Ripa","Push-ups",[40,20,20,20],100,"2026-01-28T16:00:00"],
    ["seed_99","Rupe","Push-ups",[41,25,21,20],107,"2026-01-27T16:00:00"],
    ["seed_100","Rupe","Push-ups",[35,30,25,20],110,"2026-01-26T16:00:00"],
    ["seed_101","Rupe","Push-ups",[35,30,27,9],101,"2026-01-24T16:00:00"],
    ["seed_102","Rupe","Push-ups",[35,25,20,20],100,"2026-01-23T16:00:00"],
    ["seed_103","Rupe","Push-ups",[40,20,15,15,10],100,"2026-01-22T16:00:00"],
    ["seed_104","Rupe","Push-ups",[40,20,20,20],100,"2026-01-21T16:00:00"],
    ["seed_105","Rupe","Push-ups",[35,25,15,15,10],100,"2026-01-20T16:00:00"],
    ["seed_106","Rupe","Push-ups",[35,25,20,20],100,"2026-01-19T16:00:00"],
    ["seed_107","Rupe","Push-ups",[35,20,12,15,18],100,"2026-01-17T16:00:00"],
    ["seed_108","Rupe","Push-ups",[30,20,15,15,20],100,"2026-01-16T16:00:00"],
    ["seed_109","Rupe","Push-ups",[40,20,15,15,10],100,"2026-01-15T16:00:00"],
    ["seed_110","Rupe","Push-ups",[30,25,15,15,15],100,"2026-01-14T16:00:00"],
    ["seed_111","Rupe","Push-ups",[30,25,15,15,9,6],100,"2026-01-13T16:00:00"],
  ];
  return raw.map(([id,player,exercise,sets,total,date])=>({
    id, player, exercise, sets, total,
    date: new Date(date),
    ts: new Date(date).getTime(),
  })).sort((a,b)=>b.ts-a.ts);
}

function Confetti({ onDone }) {
  const cols = ["#ffe600","#ff2d55","#ff9500","#39ff14","#00e5ff","#c77dff"];
  const pts = Array.from({length:28},(_,i)=>{
    const a=(i/28)*360, r=80+Math.random()*80;
    return { dx:`${Math.cos(a*Math.PI/180)*r}px`, dy:`${Math.sin(a*Math.PI/180)*r-40}px`, c:cols[i%cols.length] };
  });
  useEffect(()=>{ const t=setTimeout(onDone,1500); return ()=>clearTimeout(t); },[]);
  return <div className="conf-wrap">{pts.map((p,i)=><div key={i} className="conf-p" style={{background:p.c,"--dx":p.dx,"--dy":p.dy,animationDelay:`${i*0.02}s`}}/>)}</div>;
}

function useCountdown() {
  const [time, setTime] = useState("");
  useEffect(()=>{
    function tick() {
      const now = new Date();
      const midnight = new Date(now); midnight.setHours(24,0,0,0);
      const diff = midnight - now;
      const h = String(Math.floor(diff/3600000)).padStart(2,"0");
      const m = String(Math.floor((diff%3600000)/60000)).padStart(2,"0");
      const s = String(Math.floor((diff%60000)/1000)).padStart(2,"0");
      setTime(`${h}:${m}:${s}`);
    }
    tick();
    const t = setInterval(tick,1000);
    return ()=>clearInterval(t);
  },[]);
  return time;
}

const ORBITRON_B64 = `AAEAAAASAQAABAAgRFNJRwAAAAEAAIl0AAAACEZGVE1YX9RGAACStAAAABxHREVGASkAJAAAiXwAAAAoR1BPUzy+bhYAAIxYAAAGWkdTVUIFY9IeAACJpAAAArJPUy8yh8XtpAAAAagAAABgY21hcIDrMvcAAAXwAAACSmdhc3D//wADAACJbAAAAAhnbHlmQHTwHQAACjwAADvkaGVhZPWwGSgAAAEsAAAANmhoZWEHOQTnAAABZAAAACRobXR4hSgpvgAAAggAAAPoa2VybltbXpIAAEYgAAAHtmxvY2FI8TmsAAAIRAAAAfZtYXhwAUEANQAAAYgAAAAgbmFtZWkjM0gAAE3YAAA4AXBvc3R+Fa75AACF3AAAA45wcmVwaAaMhQAACDwAAAAHAAEAAAABAABKcthIXw889QALA+gAAAAAySPqrgAAAADJI+qu/0X/GgUDA80AAQAIAAIAAAAAAAAAAQAAAu7/BgAABV//Rf+HBQMAAQAAAAAAAAAAAAAAAAAAAPoAAQAAAPoAMgAFAAAAAAACAAAAAQABAAAAQAAAAAAAAAACAjcDhAAFAAQCvAKKAAAAjAK8AooAAAHdADIA+gAAAgAAAAAAAAAAAIAAACcQAABCAAAAAAAAAABweXJzACAAIOAMAu7/BgAAA80A5gAAAAEAAAAAAkQC0QAAACAAAgAAAAAAAAAAAU0AAAFCAAAA3AA6AYwAJAMdACADFAAiA8YAMAOqADUA+wA7ASYANAEpADgCBAAZAccAEQDzADYCBQA7AOkANgIJAAYDQgA5AYcAAQM+ADkDOgA1AtoABgM+ADkDNAA5ApQAAwNCADkDPAAzAPcANgEKADMB2QAFAn4AOwHbADsCpgAfAz8AOQNEADoDQAA7AzYAOANCADoC/gA6AtMAOgM+ADgDUwA5ANwAOQMMAAQDHQA5AwsAOQOgADgDQAA4AzwANgMXADgDdAA2AzkANwM2ADMC9wAUAzwANgPrACMEmwAjAywALgMmABEDNQAzARMANgIIAAUBFAAzAzwANgEQACACtgA0ApsANgK3ADMCmwAXArQAMwG4ADUCqwApApwANgDlADQA7/9FAoYANgFRADQD0gA2ArgANgK0ADMCmAA2ApgAFAIOADQCrgAwAcMANQK3ADUDFgAVBB0AIwK0AC4CrQAqAroANgEhABcA1gA2ASEAMwGUABgA0gA1AnwAIQLeACcBgQA2AbcALQDVACEDQQA4ANUAIQKjABMDRAA6A0QAOgNEADoDRAA6A0QAOgNEADoFXwA2AzYAOAL+ADoC/gA6Av4AOgL+ADoA3AAkANwAJADc//QA3P/jA0AAOAM8ADYDPAA2AzwANgM8ADYDPAA2AiIANQM8ADYDPAA2AzwANgM8ADYDJgARA0EAOQLVADQC1QA0AtUANALVADQC1QA0AtUANASaADUCtQAzAn4AMwJ+ADMCfgAzAn4AMwDWABAA1gAxANb/8QDW/+ACxAA2ArQAMwK0ADMCtAAzArQAMwK0ADMCBwAHArcANQK3ADUCtwA1ArcANQKwACoCsAAqANYANAVeADUEmQA0AzYAMwKvADADJgARAzUAMwK6ADYBLAAcASkAGwEfACgA6QAtAOkACQGTABcCxAA2AzYANgDwACIA7gA2AdIALQHSADYBcwBsAj4ANgMfACMCBQA7AAAAAAMDAC4DEAAMAy8AMQKbABsC0wAJAwYANgMGAAADBgA2AZEAAAM7/+QDNgA0AzIAMQKFAAMDPQA2BIMANgM7ADYDOAA0A2QANgM6ADYDLAAuAwYAAAM7ADUEfQBQBGv//wQEADYEgwA1Az0ANgM4ADMDMgAxArUAMwLVADUCvAA2ArUAMwLBADYCfgA2Ak8ANgKyADMCywA2ANYANgKRAAUCnQA2AqoANgKTADYDOAA2AsQANgK0ADMClAA2AwIANAK8ADYCrwAxAoQAFgK3ADUCuQA1AyEAFQPSADUENgAiAroANgK0AC4CsAASArQAMwK6ADYAAAADAAAAAwAAABwAAQAAAAABRAADAAEAAAAcAAQBKAAAAEYAQAAFAAYAXQB+AKMAqACwALQAtgC4AM8A1wDdAO8A9wD9AP8BMQFTAWEBeAF+AscC2gLcIBQgGSAdICIgJiCsIhLgAOAD4AfgDP//AAAAIABfAKEAqACwALQAtgC4AL8A0QDZAN8A8QD5AP8BMQFSAWABeAF9AsYC2ALcIBMgGCAcICIgJiCsIhLgAOAC4AXgCv///+P/4v/A/7z/tf+y/7H/sP+q/6n/qP+n/6b/pf+k/3P/U/9H/zH/Lf3m/db91eCf4JzgmuCW4JPgDt6pILwguyC6ILgAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEGAAABAAAAAAAAAAECAAAAAgAAAAAAAAAAAAAAAAAAAAEAAAMEBQYHCAkKCwwNDg8QERITFBUWFxgZGhscHR4fICEiIyQlJicoKSorLC0uLzAxMjM0NTY3ODk6Ozw9Pj9AAEFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaW1xdXl9gAG5vcXN6f4SIh4mLioyOkI+RkpSTlZaXmZianJufnqChAGViYwC4Z4YAAABmZABwAAAAAAAAAAAAAAAAAAAAjQBpYQAAAAAAAAC5AGptfqWmsrO2t7S1nQCjqQC6AAAAAAAAAAAAbHRrdXJ3eHl2fH0Ae4KDgaSssQCur7BoAACtAAC4Af+FsASNAAAAAAAAAAAAAAAAEgAkAFwAngDkAR4BKgFEAVwBfAGQAaABrgG6AcwB9AIIAjACYAJ8AqICygLeAxQDQANSA2gDegOOA6QDyAP+BB4ESARkBIAEmASuBNgE8AT8BRYFNgVGBWAFdgWaBbwF4AYIBjoGTgZoBnwGngbCBtoG8gcCBxQHJgc0B0IHZAeCB54HvgfiB/oIIgg8CE4IZgiACJIIrgjGCOoJCAkmCToJbAmECZ4JsgnUCfIKEgoqClIKYAqACpwKsArYCv4LEAswCz4LZAtyC5YLvgvmDBAMRgxyDKwM0gzyDRINMA1SDXYNig2eDbYNzg36DiQOTg58DrQO4g8CDyQPRg9sD5IPsg/eEAYQLhBaEJAQvBD2ESIRRhFyEZwRyhH6Eg4SIhI6ElISfhKoEtITABM4E2YTgBOiE8QT6hQQFDYUYBRsFJIUvhT6FTYVWhV8FZ4VsBXCFdoV9BYUFjAWPhZMFlwWbBaEFp4WshbKFvYXBBcEFxgXOhdiF4wXqBe8F9QX7BfsGAYYLBhEGFYYdhiSGKgY0hj6GR4ZRBlYGXAZkhmyGc4Z6hoQGjAaVhp2GpYawBrcGvgbEBskG0wbZBtwG4obrBvGG9Yb8BwGHCocTBxwHJQcxhzYHPIdCh0eHTgdVh2AHZ4dtB3aHfIAAAACADoAAADTAtAAAwAHAAAzIzUzJxEzEdOZmZmZmTACB/35AAACACQB+QFxAsIAAwAHAAATFSM1IRUjNbyYAU2YAsLJycnJAAACACAAAALuAtAAIAAkAAABFSMHMxUjDgEHIzcjDgEHIzcjNTM3IzUzNjczBzM3MwcBMzcjAu5zInmrBx4ImzCMCB8Fmy9LeSJ/sA0jnjOKMJ0z/oqIIogCOplqmRhuGJ4bcBOemWqZJHKWlpb+/WoAAwAi/54C5AMyACkALQAxAAABFSM1IxUzMhYdARQGKwEVIzUjIiY9ATMVMzUjIiY9ATQ2OwE1MxUzMhYFNSMVBRUzNQLkmXuDPFVVPIOagzxVmXuDPFVVPIOagzxV/lJ7ARV7Aj9COoZWPI47VmJiVjtCOn9VPJY8VWJiVcqGhpl/fwAABQAwAAADjQLPAAUAFQAlACkALQAAATMVASM1EzMyFh0BFAYrASImPQE0NgEzMhYdARQGKwEiJj0BNDYXFTM1ARUzNQMWM/1wMzJRPExMPFE8TEwCOFE8TEw8UTtMTDFm/Z1mAs+c/c2dAitLPEg8TEw8SDxL/phLPEg8TEw8SDxLfV1dAWhcXAAAAAACADX/7gNqAs8AHwAlAAAlFxUnBiMhIiY9ATQ2NyY9ATQ2MyEyFhcVIzUhFQU1MwUnFSEuAQL3c4wtS/5gPFUWFQdWOwFhNVMJmf6vAWyZ/rniAUoPRtBEnlA+Vju5FjAOESRrPFVEM1g1bLdfpHKmCCIAAAEAOwH4ANQCwgADAAATFSM11JkCwsrKAAEANAAAAQcC0AANAAABIxEzFSMiJjURNDY7AQEHOjpCPFVVPEICN/5imVY7Aa48VQAAAAABADgAAAEMAtAADQAAMzUzESM1MzIWFREUBiM4OjpDO1ZWO5kBnplVPP5SO1YAAAABABkBBQHsAsIADwAAARcHFwcnByc3JzcXNTMVNgG9L25Fe0dCfUVuL22aCgJzlCNdWl1dWl0jlCV0dAMAAAAAAQARAFYBsgH3AAsAABMzFTMVIxUjNSM1M5OZhoaZgoIB94OZhYWZAAEANv97AM8AjgAFAAA3MxUUBgc2mVdCjn42VAsAAAAAAQA7ANsB3AF0AAMAAAEVITUB3P5fAXSZmQAAAAEANgAAAM8AmQADAAA3FSM1z5mZmZkAAAEABgAAAgoC0AAFAAA3ATMVASMGAc03/jM3mwI1mv3KAAAAAAMAOQAAAvwC0AAPABIAFQAAEyEyFhURFAYjISImNRE0NhMhESchEcsBnzxWVzv+YTtXVpUBP1L+wQLQWTz+YDxfXzwBoDxZ/dMBDIT+9AAAAQABAAABhgLQAAgAABsBMxEjEQczBwHmn5kCASABvgES/TAB5wInAAEAOQAAAvwC0AAZAAATITIWHQEUBiMhFSEVIRE0NjMhNSEVIzU0NssBnzxWVjz+aAIq/T1WPAGY/m+ZVgLQVTyfPFZ1mQEXPFWPOkI8VQAAAQA1AAAC+ALQACAAAAEVFAcWHQEUBiMhIiY9ATMVITUhNSE1IRUjNTQ2MyEyFgLdBiFVPP5gPFaZAZH+TAGZ/oqZVjwBhTxVAj+QGRUoM5U7VlY7ODCFmYA4QDxVVQAAAgAGAAACrgLQAAoADQAAATMVIxUjNSE1ATMPATMCTmBgmf5RAb+Jmba2AU2as7OJAZTvlAAAAAABADkAAAL8AtAAFgAAASEVITIWHQEUBiMhIiY9ATMVITUhESEC/P3WAZg8VlY8/mE8VpkBkf3WAsMCN31VPJg7VlY7ODCHAbAAAAAAAgA5AAAC/ALQABMAFwAAASEVITIWHQEUBiMhIiY1ETQ2MyEBFSE1Ao/+QwGYPFZWPP5hPFZWPAHE/kMBkQI3fVU8mDtWVjsBrjxV/lCHhwABAAMAAAJZAtEACAAAEyEyFhURIxEhAwHFPFWZ/kMC0VU8/cACOAAAAwA5AAAC/ALQABkAHQAhAAABFRQHFh0BFAYjISImPQE0NyY9ATQ2MyEyFgEVITUBFSE1AvwREVY8/mE8VhERVjwBnzZT/d8Bkf5vAZECWaclIB8lmDtWVjuYICQkIY08VUT+lIeHARaGhgAAAgAzAAAC+QLQABUAGQAAKQEiJichNSEiJj0BNDYzITIWFREUBgEhNSECaP5gNVULAi3+aDxWVjwBoDxVVf4sAZD+cFhBgFY8lDxVVTz+UjtWAbOEAAAAAAIANgAAAM8CRAADAAcAADczFSMTFSM1NpmZmZmZmQJEmpoAAAIAM/97AM0CRAADAAkAABMVIzUTMxUUBgfNmgGZV0ICRJqa/kp+NlQLAAAAAQAF/+8BsAJfAAYAABMXFSU1JRXG6v5VAasBKIix+ID4sAAAAgA7AIECSQHkAAMABwAAARUhNSUVITUCSf3yAg798gEamZnKmZkAAAEAO//tAecCXQAJAAAXNTcnLgEnNQUVO+mAD0kRAawTsodICC0JsfeBAAAAAgAfAAACjQLQABIAFgAAEyEyFh0BFAYrARUjNTQ2OwE1IRMjNTMfAdw9VVU94ZpVPOP+K/uamgLQVTymPFZFTjxVlv3JmQAAAgA5AAAC/ALQAB8AIwAAATMyFh0BMzUhESEVISImNRE0NjMhMhYVESEiJj0BNDYXMzUjAXw+PEEs/m8CKv3PPFZWPAGfPFb+gDxCQihlZQIHQTw/7P5imVY7Aa48VVU8/plBPDU8QbxSAAAAAgA6AAADCgLQAA0AEQAAEyEyFhURIzUhFSMRNDYTITUhzgGnPled/mibVkUBmP5oAtBXPf3E6OgCPD5W/rSwAAMAOwAAAwsC0AAOABIAFgAAARUUBxYdARQGIyERITIWARUhNQEVITUC7wcjVz79xQIgPVf95wGY/mgBfAI8hxwSLDKVPVcC0Ff+p4SEARR4eAAAAAEAOAAAAwYC0AANAAABIREhFSEiJjURNDYzIQMG/c0CM/3GPlZWPgI6AjT+aJxWPgGoPlYAAAAAAgA6AAADCgLQAAkADQAAEyEyFhURFAYjIRMRIRE6Ajs+V1c+/cWbAZgC0Fc9/lg9VwI0/mgBmAABADoAAALTAtAACwAAARUhFSEVIRUhFSERAtP+BAGZ/mcB/P1nAtCcfpx+nALQAAABADoAAALTAtAACQAAEyEVIRUhFSERIzoCmf4EAZn+Z50C0Jx+nP7mAAAAAAEAOAAAAwgC0AAZAAABFSM1IREhNSM1IREUBiMhIiY1ETQ2MyEyFgMInf5oAZicATlXPv5ZPlZWPgGnPlcCPEQ8/mhsnP7wPVdWPgGoPlZXAAAAAAEAOQAAAxgC0AALAAABMxEjESERIxEzESECfZub/lebmwGpAtD9MAEa/uYC0P7mAAEAOQAAANUC0AADAAAzETMROZwC0P0wAAEABAAAAtQC0AANAAA3FSERMxEUBiMhIiY9AZ8BmJ1XPf5YPlbxVQI0/cQ9V1Y+XQAAAAABADkAAALwAtAADwAAATMVCQEVIwMjESMRMxEzNwJOov7/AQGi7I2cnI1aAtA2/s7+zjYBGv7mAtD+5msAAAAAAQA5AAADCQLRAAUAADMRMxEhFTmbAjUC0f3LnAAAAAABADgAAANgAtAACwAAARMzESMRCwERIxEzAczzoZz4+ZugAa0BI/0wAeP+2AEn/h4C0AAAAQA4AAADCALQAAkAACURMxEjAREjETMCa52g/muboPAB4P0wAeL+HgLQAAACADYAAAMGAtAADwATAAATITIWFREUBiMhIiY1ETQ2FxEhEcoBqD1XVz3+WD5WVkUBmALQVz3+WD1XVj4BqD5WnP5oAZgAAAACADgAAAMIAs8ADwATAAATITIWHQEUBiMFMhUiJxUjExUhNTgCOz1YWD3+YAMCAZubAZgCz1c9uj1XAQYB5wI0q6sAAAIANgAAA1gC0AAOABIAAAERMxUhIiY1ETQ2MyEyFgURIREDBlL9cj5WVj4Bpz5X/csBmAI8/mCcVj4BqD5WV0X+aAGYAAAAAAIANwAAAwcCzwAUABgAAAEVFAYrARcVIycHMhUiJxUjESEyFgUVITUDB1g9B5ygx84DAgGbAjs9WP3LAZgCO7o9V7g17QEGAecCz1dEq6sAAQAzAAADAwLQACEAAAEVIzUhFSEyFh0BFAYjISImPQEzFSE1ISImPQE0NjMhMhYDA53+aAGhPVdXPf5YPVebAZj+YT1XVz0BqD1XAjxDO35XPY49V1Y+Qzt+Vj6OPlZXAAAAAAEAFAAAAuQC0AAHAAATIRUhESMRIRQC0P7mnP7mAtCc/cwCNAAAAAABADYAAAMGAtAADQAAExEhETMRFAYjISImNRHRAZidVz3+WD5WAtD9zAI0/cQ9V1Y+AjwAAQAjAAAD5gLQAAYAACUBMwEjATMCBQEus/5fgf5ftMUCC/0wAtAAAAEAIwAABHAC0AAPAAABMwEjAwcDIwEzEzcTMxM3A8yk/vp3qkBpd/76pZ0ZhI+eGQLQ/TABz7D+4QLQ/lNDAWr+U0MAAQAuAAAC/gLQABEAAAEzFQkBFSMnByM1CQE1Mxc+AQJdof7+AQKhyMahAQH+/6HIHY4C0DX+zf7ONuzsNQEzATM17SWnAAAAAQARAAADSALQAAkAAAEzAREjEScDMxMCjbv+spyDyrniAtD+PP70AQ2wARP+5AAAAQAzAAADAwLQAAkAABM1IRUBIRUhNQEzAtD+HgHi/TAB4gI0nJ/+a5yfAZUAAAAAAQA2AAABCQLQAAcAADMRMxUjETMVNtM6OgLQmf5imQABAAUAAAIJAtAABQAAEzMBFSMBBTcBzTf+MwLQ/cqaAjYAAAABADMAAAEGAtAABwAAEzUzESM1MxEz09M5AjeZ/TCZAZ4AAAABADb/ZQL5//4AAwAABRUhNQL5/T0CmZkAAAAAAQAgAusA8AO2AAMAABMXIye9M50zA7bLywAAAAIANAAAAoACRAANABEAAAEyFhURISImPQEhNSE1ATUhFQHvPFX+RTxVAbP+TQGz/uYCRFY7/k1WO948mf5VUFAAAAAAAgA2AAACggMCAAsADwAAATIWFREUBiMhETMdAREhEQHxPFVVPP5FmQEaAkRWO/7eO1YDAr6Z/u4BEgAAAQAzAAACfwJEAA0AAAEhESEVISImNRE0NjMhAn7+TgGz/kU7VlY7AboBq/7umVY7ASI7VgAAAAACABcAAAJkAwIACwAPAAABMxEhIiY1ETQ2MyEFESERAcuZ/kQ8VVU8ASP+5gEaAwL8/lY7ASI7Vpn+7gESAAAAAgAzAAACfwJEABAAFAAAATIWHQEhFSEVISImNRE0NjMXITUhAe48Vf5NAbP+RTtWVjsIARr+5gJEVjvePJlWOwEiO1bpUAAAAQA1AAABpQMCAAwAAAEjFTMVIxEjETQ2OwEBpdfX15lVPd4CaCSZ/lUCcTtWAAAAAgAp/xsCdgJEABMAFwAABRQGIyE1ITUhIiY1ETQ2MyEyFhUFESERAnZVPP6gAVj+3jxWVjwBKjxV/kwBG1Q8VZpLVjsBIjtWVjsI/u4BEgABADYAAAKCAwIADAAAATIWFREjESERIxEzFQHxO1aZ/uaZmQJEVjv+TQGr/lUDAr4AAAAAAgA0AAAAzQMCAAMABwAAMxEzEQMzFSM0mZmZmQJE/bwDApoAAv9F/zAA0wMCAAMADAAAEzMVIxcRFAYrATUzETqZmZlWPPz1AwKaJP19PFWaAnoAAQA2AAACfAMCAA4AAAEzFQcXFSMnIxUjETMRMwHimtjYmsVOmZlOAkQ07u401dUDAv5tAAEANAAAAUMDAwAIAAATMxEzFSMiJjU0mnV+O1YDA/2WmVY7AAEANgAAA4ECRAAOAAABMhYVESMRIxEjESMRIxEC8DxVmMCawJkCRFY7/k0Bq/5VAav+VQJEAAAAAQA2AAACggJEAAoAAAEyFhURIxEhESMRAfE8VZn+5pkCRFY7/k0Bq/5VAkQAAAAAAgAzAAACfwJEAA8AEwAAEyEyFhURFAYjISImNRE0NhcRIRHEASo8VVU8/tY7VlZDARoCRFY7/t47VlY7ASI7Vpn+7gESAAAAAgA2/xoCggJEAAsADwAAATIWFREUBiMhFSMRFxEhEQHxPFVVPP7emZkBGgJEVjv+3jtW5gMqmf7uARIAAgAU/xoCYQJEAAsADwAAEzQ2MyERIzUhIiY1ExEhERRVPAG8mf7dPFWaARoBsztW/NbmVjsBGv7uARIAAQA0AAACBgJEAAgAABMhFSERIxE0NsYBQP7HmVYCRJn+VQGzO1YAAAEAMAAAAn0CRAAhAAABFSM1IRUhMhYdARQGIyEiJj0BMxUhNSEiJj0BNDYzITIWAn2a/uYBIj1VVT3+1jtWmQEa/t47VlY7ASo9VQGzHRU8VTxNO1ZWOx0VPFY7TTtWVgAAAAABADUAAAGlAvAADAAAASMRMxUjIiY1ETMVMwGl19fePVWZ1wGr/u6ZVjsCX6wAAAABADUAAAKBAkQADQAAATMRFAYjISImNREzESEB6JlVPP7WPFWZARoCRP5NO1ZWOwGz/lUAAQAVAAADFwJEAAYAAAEzASMBMxMCZ7D+wIP+wbDRAkT9vAJE/n8AAAEAIwAAA/sCRAAPAAABMwMjCwEjAzMTNz4BNzMTA1mi2nSdlnPkon0rCj8PlIwCRP28AVr+pgJE/tNkF44k/s8AAAAAAQAuAAAChAJEABAAAAEzFQcfARUjJwcjNTcnNTMXAeaeyG5anY6OncjInY4CRDLrhm8yrq4y9esyqAAAAQAq/zACdwJCABEAAAUUBiMhNSE1ISImNREzESERMwJ3VTz+oAFY/t48VpkBG5k/PFWaNlY7AbH+VwGpAAAAAAEANgAAAoICRAAJAAATNSEVASEVITUBNgJM/qMBXf20AV0Bq5md/vKZnQEOAAAAAAEAFwAAARIC0AAaAAATFTMVIyImPQEnMy4BJzU3NTQ2OwEVIxUHFzXYOkE9VRABAxMDKFU9QTotFwFLsplWO4cKAQsBgxZ3PFWZoSYUAQAAAQA2/50AzwMkAAMAABcRMxE2mWMDh/x5AAAAAAEAMwAAAS4C0AAUAAAzNTM1Nyc1IzUzMhYdARcVBxUUBiMzOi0tOkE8VigoVjyZsSYmoZlVPHYYgBmHO1YAAAABABgA0gGPAYMADwAAATI3FQYjIiYjIgc1NjMyFgEvKDg8JyR1IiYzNSomdQFFJH4ZPSeEFzkAAAIANQAAAM4CwgADAAcAABMVIzUTIxEzzpmZmZkCwpmZ/T4CDgAAAAACACH/nQJtAsEAFQAZAAABIxEzFSMVIzUjIiY1ETQ2OwE1MxUzAREjEQJtsLCwmnA8VlY8cJqw/rZpAbP+5pljY1Y7ASs8VnNz/ksBGv7mAAEAJwAAAqgC0AAZAAABIzUjFSEVIRUhFSE1MzUjNTM1NDYzITIWFQKomvQBLv7SAY79f1paWlY7AQU8VQIHMImZfJmZfJmRPFVVPAACADYC6wGlA4UAAwAHAAABFSM1IxUjNQGlmjyZA4WampqaAAACAC0BVwGhAsIADwATAAATMzIWHQEUBisBIiY9ATQ2FxUzNb9RO1ZWO1E8VlYxZgLCVTxIPFZWPEg8VYdcXAAAAQAhAusA8QO2AAMAABM3MwchM50zAuvLywAAAAMAOAAAAw8CwgAPABMAFwAAEzQ2MyERIzUjFSM1IyImNSUjFTM3FTM1OFY8AkWZQprQPFYBYsnJmkICMDtX/T7o6OhWO6+mpqamAAABACH/bgDxADgAAwAAFzczByEznTOSysoAAAAAAgATAAACggLCABIAFgAAKQEiJj0BNDY7ATUzFRQGKwEVIQMVIzUCgv4jPFZWPOKZVjziAdZimVY7pzxVS1M8VpYCKZmZAAAAAwA6AAADCgPNAA0AEQAVAAATITIWFREjNSEVIxE0NhMhNSETFyMnzgGnPled/mibVkUBmP5o7jOdMwLQVz39xOjoAjw+Vv60sAGZy8sAAAADADoAAAMKA8wADQARABUAABMhMhYVESM1IRUjETQ2EyE1IT8BMwfOAac+V53+aJtWRQGY/mh5M50zAtBXPf3E6OgCPD5W/rSwzcvLAAAAAAMAOgAAAwoDuQANABEAGAAAEyEyFhURIzUhFSMRNDYTITUhNyM3MxcjJ84Bpz5Xnf5om1ZFAZj+aLqFbmRuhhwC0Fc9/cTo6AI8Plb+tLDNuLgsAAMAOgAAAwoDtwANABEAIQAAEyEyFhURIzUhFSMRNDYTITUhATI3FQYiJisBIgc1NjMyFs4Bpz5Xnf5om1ZFAZj+aAEMJzk+SnMdCyoqRBsldALQVz39xOjoAjw+Vv60sAFFJX4aPiR8GzoAAAQAOgAAAwoDnAANABEAFQAZAAATITIWFREjNSEVIxE0NhMhNSEBFSM1IxUjNc4Bpz5Xnf5om1ZFAZj+aAGJmjyZAtBXPf3E6OgCPD5W/rSwAWiampqaAAAEADoAAAMKA8wADQARACEAJQAAEyEyFhURIzUhFSMRNDYTITUhEzMyFh0BFAYrASImPQE0NhcVMzXOAac+V53+aJtWRQGY/mikMx8tLR8zHy4uHzMC0Fc9/cTo6AI8Plb+tLABmC0fMR8tLR8xHy1ONjYAAAIANgAABQMC0AASABYAAAEVIRUhFSEVITUhFSMRNDYzIRUFNSEVAwYBmf5nAf39aP5onVc9BDn9aP5oAjR+nH6c6OgCPD1XnLCwsAABADj/ZAMGAtAAEQAAASERIRUjByM3IyImNRE0NjMhAwb9zQIz8y+dL6o+VlY+AjoCNP5onJycVj4BqD5WAAAAAgA6AAAC0wPNAAsADwAAARUhFSEVIRUhFSERJRcjJwLT/gQBmf5nAfz9ZwF6M50zAtCcfpx+nALQ/cvLAAAAAAIAOgAAAtMDzQALAA8AAAEVIRUhFSEVIRUhET8BMwcC0/4EAZn+ZwH8/Wf7M50zAtCcfpx+nALQMsvLAAIAOgAAAtMDuQALABIAAAEVIRUhFSEVIRUhESUjNzMXIycC0/4EAZn+ZwH8/WcBMoVuZG6GHALQnH6cfpwC0DG4uCwAAwA6AAAC0wOcAAsADwATAAABFSEVIRUhFSEVIRElFSM1IxUjNQLT/gQBmf5nAfz9ZwILmjyZAtCcfpx+nALQzJqampoAAAAAAgAkAAAA+wPNAAMABwAAMxEzEQMXIydfnDoznTMC0P0wA83LywAAAAIAJAAAAPQDzQADAAcAADMRMxEDNzMHKpyiM50zAtD9MAMCy8sAAAAC//QAAAE0A7kAAwAKAAAzETMRAyM3MxcjJz6cYYVuZG6GHALQ/TADAbi4LAAAAAAD/+MAAAFSA5wAAwAHAAsAADMRMxETFSM1IxUjNUqcbJo8mQLQ/TADnJqampoAAAACADgAAAMIA7cACQAZAAAlETMRIwERIxEzJTI3FQYiJisBIgc1NjMyFgJrnaD+a5ugARsnOT5Kcx0LKipEGyV08AHg/TAB4v4eAtCpJX4aPiR8GzoAAAAAAwA2AAADBgPNAA8AEwAXAAATITIWFREUBiMhIiY1ETQ2FxEhEQMXIyfKAag9V1c9/lg+VlZFAZigM50zAtBXPf5YPVdWPgGoPlac/mgBmAGZy8sAAwA2AAADBgPNAA8AEwAXAAATITIWFREUBiMhIiY1ETQ2FxEhESU3MwfKAag9V1c9/lg+VlZFAZj+6zOdMwLQVz3+WD1XVj4BqD5WnP5oAZjOy8sAAwA2AAADBgO5AA8AEwAaAAATITIWFREUBiMhIiY1ETQ2FxEhEScjNzMXIyfKAag9V1c9/lg+VlZFAZjehW5kboYcAtBXPf5YPVdWPgGoPlac/mgBmM24uCwAAAADADYAAAMGA7cADwATACMAABMhMhYVERQGIyEiJjURNDYXESERAzI3FQYiJisBIgc1NjMyFsoBqD1XVz3+WD5WVkUBmIInOT5Kcx0LKipEGyV0AtBXPf5YPVdWPgGoPlac/mgBmAFFJX4aPiR8GzoABAA2AAADBgOcAA8AEwAXABsAABMhMhYVERQGIyEiJjURNDYXESERAxUjNSMVIzXKAag9V1c9/lg+VlZFAZgPmjyZAtBXPf5YPVdWPgGoPlac/mgBmAFompqamgABADUAUgH7AgQAEQAAARUHFxUjJw4BByM1Nyc1Mxc3AfuCgp9FCjIJnYGBnkRFAgQypqgyXRA/DjKopjJeXgAAAgA2AAADBgPNAA0AEQAAExEhETMRFAYjISImNRElFyMn0QGYnVc9/lg+VgGTM50zAtD9zAI0/cQ9V1Y+Ajz9y8sAAAACADYAAAMGA80ADQARAAATESERMxEUBiMhIiY1ESU3MwfRAZidVz3+WD5WAQoznTMC0P3MAjT9xD1XVj4CPDLLywAAAAIANgAAAwYDuQANABQAABMRIREzERQGIyEiJjURJSM3MxcjJ9EBmJ1XPf5YPlYBVYVuZG6GHALQ/cwCNP3EPVdWPgI8Mbi4LAAAAAADADYAAAMGA5wADQARABUAABMRIREzERQGIyEiJjURJRUjNSMVIzXRAZidVz3+WD5WAiSaPJkC0P3MAjT9xD1XVj4CPMyampqaAAAAAgARAAADSAPNAAkADQAAATMBESMRJwMzEwM3MwcCjbv+spyDyrniYzOdMwLQ/jz+9AENsAET/uQBTsvLAAAAAAEAOQAAAvwCwgAbAAABFRQHFh0BFAYjITUhNSE1ITUhESMRNDYzITIWAvwREVY8/qcBUv6uAVL+b5lWPAGfNlMCS5wlIB8llTtWmYSQe/3YAjE8VUQAAAADADQAAAKAA0kADQARABUAAAEyFhURISImPQEhNSE1ATUhFRMXIycB7zxV/kU8VQGz/k0Bs/7m0jOdMwJEVjv+TVY73jyZ/lVQUAKwy8sAAAMANAAAAoADSQANABEAFQAAATIWFREhIiY9ASE1ITUBNSEVEzczBwHvPFX+RTxVAbP+TQGz/uZJM50zAkRWO/5NVjvePJn+VVBQAeXLywAAAwA0AAACgAM2AA0AEQAYAAABMhYVESEiJj0BITUhNQE1IRUTIzczFyMnAe88Vf5FPFUBs/5NAbP+5oqFbmRuhhwCRFY7/k1WO948mf5VUFAB5bi4LAAAAAMANAAAAoADMgANABEAIQAAATIWFREhIiY9ASE1ITUBNSEVEzI3FQYiJisBIgc1NjMyFgHvPFX+RTxVAbP+TQGz/ubSJzk+SnMdCyoqRBsldAJEVjv+TVY73jyZ/lVQUAJbJX4aPiR8GzoAAAQANAAAAoADGAANABEAFQAZAAABMhYVESEiJj0BITUhNQE1IRUBFSM1IxUjNQHvPFX+RTxVAbP+TQGz/uYBT5o8mQJEVjv+TVY73jyZ/lVQUAJ/mpqamgAEADQAAAKAA0cADQARACEAJQAAATIWFREhIiY9ASE1ITUBNSEVEzMyFh0BFAYrASImPQE0NhcVMzUB7zxV/kU8VQGz/k0Bs/7mTDMfLS0fMx8uLh8zAkRWO/5NVjvePJn+VVBQAq4tHzEfLS0fMR8tTjY2AAMANQAABDUCRAARABUAGQAAATIWHQEhFSEVISImPQEhNSE1ATUhFSUhNSEDpTxU/k0Bs/yRPFUBtP5MAbT+5QG0ARr+5gJEVTzePJlWO948mf5VUFDCUAABADP/gAJ/AkQAFQAANyEVIw4BByM+ATcjIiY1ETQ2MyEVIcwBs+UFHQVhBR0FdTtWVjsBuv5OmZkYVBQYVBRWOwEiO1aZAAADADMAAAJ/A0kAEAAUABgAAAEyFh0BIRUhFSEiJjURNDYzFyE1IRMXIycB7jxV/k0Bs/5FO1ZWOwgBGv7mxjOdMwJEVjvePJlWOwEiO1bpUAGey8sAAAAAAwAzAAACfwNKABAAFAAYAAABMhYdASEVIRUhIiY1ETQ2MxchNSE/ATMHAe48Vf5NAbP+RTtWVjsIARr+5j0znTMCRFY73jyZVjsBIjtW6VDUy8sAAwAzAAACfwM2ABAAFAAbAAABMhYdASEVIRUhIiY1ETQ2MxchNSE3IzczFyMnAe48Vf5NAbP+RTtWVjsIARr+5n6FbmRuhhwCRFY73jyZVjsBIjtW6VDTuLgsAAAEADMAAAJ/AxgAEAAUABgAHAAAATIWHQEhFSEVISImNRE0NjMXITUhARUjNSMVIzUB7jxV/k0Bs/5FO1ZWOwgBGv7mAVeaPJkCRFY73jyZVjsBIjtW6VABbZqampoAAAACABAAAADgA0oAAwAHAAAzETMRAxcjJziZJDOdMwJE/bwDSsvLAAAAAgAxAAABAQNJAAMABwAAMxEzEQM3MwczmZsznTMCRP28An7LywAAAAL/8QAAATEDNgADAAoAADMRMxEDIzczFyMnM5lWhW5kboYcAkT9vAJ+uLgsAAAAAAP/4AAAAU8DGgADAAcACwAAMxEzERMVIzUjFSM1N5l/mjyZAkT9vAMampqamgAAAAIANgAAAoIDMQAKABoAAAEyFhURIxEhESMRJTI3FQYiJisBIgc1NjMyFgHxPFWZ/uaZAWsnOT5Kcx0LKipEGyV0AkRWO/5NAav+VQJEryV+Gj4kfBs6AAADADMAAAJ/A0oADwATABcAABMhMhYVERQGIyEiJjURNDYXESERAxcjJ8QBKjxVVTz+1jtWVkMBGlcznTMCRFY7/t47VlY7ASI7Vpn+7gESAZ/LywADADMAAAJ/A0oADwATABcAABMhMhYVERQGIyEiJjURNDYXESERJzczB8QBKjxVVTz+1jtWVkMBGuAznTMCRFY7/t47VlY7ASI7Vpn+7gES1MvLAAADADMAAAJ/AzYADwATABoAABMhMhYVERQGIyEiJjURNDYXESERJyM3MxcjJ8QBKjxVVTz+1jtWVkMBGp+FbmRuhhwCRFY7/t47VlY7ASI7Vpn+7gES07i4LAAAAAMAMwAAAn8DMQAPABMAIwAAEyEyFhURFAYjISImNRE0NhcRIREDMjcVBiImKwEiBzU2MzIWxAEqPFVVPP7WO1ZWQwEaQyc5PkpzHQsqKkQbJXQCRFY7/t47VlY7ASI7Vpn+7gESAUglfho+JHwbOgAEADMAAAJ/AxoADwATABcAGwAAEyEyFhURFAYjISImNRE0NhcRIRETFSM1IxUjNcQBKjxVVTz+1jtWVkMBGjCaPJkCRFY7/t47VlY7ASI7Vpn+7gESAW+ampqaAAMABwAAAfECaAADAAcACwAAARUhNRczFSMTFSM1AfH+FrCZmZmZAYmZmfCZAmiamgAAAAACADUAAAKBA0oADQARAAABMxEUBiMhIiY1ETMRIQMXIycB6JlVPP7WPFWZARpiM50zAkT+TTtWVjsBs/5VArHLywAAAAIANQAAAoEDSgANABEAAAEzERQGIyEiJjURMxEhAzczBwHomVU8/tY8VZkBGtcznTMCRP5NO1ZWOwGz/lUB5svLAAAAAgA1AAACgQM3AA0AFAAAATMRFAYjISImNREzESEDIzczFyMnAeiZVTz+1jxVmQEaqoVuZG6GHAJE/k07VlY7AbP+VQHmuLgsAAAAAAMANQAAAoEDGAANABEAFQAAATMRFAYjISImNREzESETFSM1IxUjNQHomVU8/tY8VZkBGjmaPJkCRP5NO1ZWOwGz/lUCf5qampoAAAACACr/MAJ3A0oAEQAVAAAFFAYjITUhNSEiJjURMxEhETMlNzMHAndVPP6gAVj+3jxWmQEbmf6XM50zPzxVmjZWOwGx/lcBqT3LywAAAwAq/zACdwMaABEAFQAZAAAFFAYjITUhNSEiJjURMxEhETMnFSM1IxUjNQJ3VTz+oAFY/t48VpkBG5lZmjyZPzxVmjZWOwGx/lcBqdiampqaAAAAAQA0AAAAzQJEAAMAADMRMxE0mQJE/bwAAgA1AAAFAgLQABEAFQAAARUhFSEVIRUhIiY1ETQ2MyEVIREhEQMFAZn+ZwH9+8c9V1c9BDn70AGYAjR+nH6cVz0BqD1XnP5oAZgAAAMANAAABDQCRAAQABQAGAAAJSEVIRUhIiY1ETQ2MyEyFhUFITUpAREhEQQ0/k0Bs/ySPFZWPALePFT+TQEa/ub+TAEb1TyZVjsBIjtWVTxYUP7uARIAAAACADMAAAMDA7kAIQAoAAABFSM1IRUhMhYdARQGIyEiJj0BMxUhNSEiJj0BNDYzITIWATMXNzMHIwMDnf5oAaE9V1c9/lg9V5sBmP5hPVdXPQGoPVf+AIMbG4duZAI8Qzt+Vz2OPVdWPkM7flY+jj5WVwFALCy4AAACADAAAAJ9AzYAIQAoAAABFSM1IRUhMhYdARQGIyEiJj0BMxUhNSEiJj0BNDYzITIWATMXNzMHIwJ9mv7mASI9VVU9/tY7VpkBGv7eO1ZWOwEqPVX+QoMbG4duZAGzHRU8VTxNO1ZWOx0VPFY7TTtWVgFILCy4AAADABEAAANIA5wACQANABEAAAEzAREjEScDMxsBFSM1IxUjNQKNu/6ynIPKueK3mjyZAtD+PP70AQ2wARP+5AHompqamgAAAAACADMAAAMDA7kACQAQAAATNSEVASEVITUJATMXNzMHIzMC0P4eAeL9MAHi/u2DGxuHbmQCNJyf/mucnwGVAYUsLLgAAAIANgAAAoIDQwAJABAAABM1IRUBIRUhNQEDMxc3MwcjNgJM/qMBXf20AV3Ogxsbh25kAauZnf7ymZ0BDgGYLCy4AAAAAQAcAuoBXAOiAAYAABMjNzMXIyehhW5kboYcAuq4uCwAAAAAAQAbAuoBWwOiAAYAABMzFzczByMbgxsbh25kA6IsLLgAAAAAAQAoAusBGgNwAA0AABMzFRQGKwEiJj0BMxUztWU4Ki4qOGYnA3AjKDo6KCMeAAAAAQAtAuwA5wOjAA8AABMzMhYdARQGKwEiJj0BNDZ6IB8uLh8gHy4uA6MtHx8fLS0fHx8tAAIACQLsANUDtQAPABMAABMzMhYdARQGKwEiJj0BNDYXFTM1VjMfLS0fMx8uLh8zA7UtHzEfLS0fMR8tTjY2AAABABcC7wGOA6AADwAAATI3FQYiJisBIgc1NjMyFgEuJzk+SnMdCyoqQxwmcwNiJX4aPiR8GzoAAAEANgDaAowBcwADAAABFSE1Aoz9qgFzmZkAAAABADYA2gL0AXMAAwAAARUhNQL0/UIBc5mZAAAAAQAiAbUAuwLIAAUAABMjNTQ2N7uZV0IBtX43UwsAAAABADYBsADPAsIABQAAEzMVFAYHNplXQgLCfTZUCwAAAAIALQG1AZ0CyQAFAAsAABMjNTQ2NxMjNTQ2N8aZWEHXmVdCAbV+N1ML/u5+N1MLAAIANgGwAaYCwgAFAAsAAAEzFRQGBwMzFRQGBwEMmlhC1plXQgLCfTZUCwESfTZUCwAAAAABAGwBFwEGAawACwAAEzMyHQEUKwEiPQE0rhVDQxVCAaxCEkFBEkIAAwA2AAACTwCZAAMABwALAAAlFSM1IRUjNSMVIzUBkJoBWZnmmpmZmZmZmZkAAAAAAQAjAAAC4wLQAB0AACUVIRUhIiY9ASM1MzUjNTM1NDYzIRUhFSEVIRUhFQEWAc3+KzxVWlpaWlU8AdX+MwFr/pUBa7simVY7KpkjmS88VZknmSOZAAAAAAEAOwDbAdwBdAADAAABFSE1Adz+XwF0mZkAAAABAC4AAALxAtAABwAAEyEVASM1ASEuAsP92ZwBpv5aAtAy/WIzAgQAAgAMAAACzwLPAA4AEgAAEyEyFhURIxEhIiY9ATQ2ATUhFZ4BoDxVmf5oPFZWAdT+cALPVjz9wwEYVTyUPFb+4oSEAAABADEAAALzAs8AFgAAAQcFIRUhIiYvAQE1IRUjNTQ2MyEyFhcC83H+SQIo/c4zUAwBAij+cppWPAGgNlEJAcU68plAMYYBKxRFTTxVRDMAAAIAGwAAAoEC0AAXABsAABMhMhYdARQGKwEVIzU0NjsBNSEVIzU+ARMjNTOqAUY7VlY7pJpWO6X+zJkIUdiamgLQVTymPFZJUjxVlmKCM0b9MJkAAAEACQAAArECzgAPAAABMxUjFSM1ITUBMxUBMzUzAlFgYJn+UQFaiv7s35kBS5qxsYcBllP+0IcAAQA2AAAC+QLQAAcAABMzEQEzFQEjNpkBjpz92p0C0P4aAeZA/XAAAAIAAAAAAsIC0AAIAAsAADE1ATMRIzUjBwEHMwIlnZr6kgGMenoyAp79MK6uAdeQAAIANgAAAvkC0AAIAAsAABMzARUjJyMVIxMVMzadAiadk/qZmXoC0P1iMq6uAdeQAAL/5AAAA2wC0AAHAAsAACEjJyEHIwEzDwEzJgNsslz+ll6yAYKFQ169UKGhAtDQw6IAAAABADQAAAMFAtAAFwAAARUjNSERITUzFQ4BIyEiJjURNDYzITIWAwWd/mcBmZoJUzb+WD5WVj4BqDVTAleGY/5oY4U0RlY+Aag+VkUAAQAxAAADAQLQAAsAAAEVIREhFSE1IREhNQMB/uYBGv0wARr+5gLQnP5onJwBmJwAAQADAAACXALQAAgAADM1IREzERQGIwMBvJ1YPZwCNP3EPVcAAQA2AAADBwLQABEAABMRIREzERQGBxYVESMRIREjEdEBmZ0fGzmd/mibAtD+4wEd/u0YMBAiNv7zARf+6QLQAAEANgAABDQC0AAOAAABMhYVESMRIREjESERIxEDoTxXnP7gnP71mwLQVz39xAI0/cwCNP3MAtAAAQA2AAADBgLQAAoAADMjESEyFhURIxEh0ZsCPD1Xnf5oAtBXPf3EAjQAAAADADQAAAMEAtAADwATABcAABMhMhYVERQGIyEiJjURNDYXESERAyM1M8gBqD1XVz3+WD5WVkUBmH2cnALQVz3+WD1XVj4BqD5WnP5oAZj+5pwAAAACADb/iAMGAtAAEwAXAAABMhYVERQGKwEVIzUjIiY1ETQ2MxcRIRECcj1XVz2GnYU+VlY+BwGYAtBXPf5YPVd4eFY+Aag+Vpz+aAGYAAAAAAIANgAAAwYC0QAPABMAAAEVFAcWHQEjNSEVIxEFMhYFFSE1AwYiIp3+aJsCPD1X/csBmAI7ui0ZGC717e0C0QFYRKurAAAAAAEALgAAAv4C0AAXAAABIRUhMhYdARQGIyE1ITUhIiY9ATQ2MyEC/v3MAaA9V1c9/cQCNP5gPlZWPgI8AjR+Vz2OPVecflY+jj5WAAABAAAAAALQAtAABwAAJREzESMBNTMCM52f/c+g8AHg/TACnDQAAAAAAQA1AAADBQLQAAoAAAEzESEiJjURMxEhAmid/cQ9V5sBmALQ/TBWPgI8/cwAAAAAAQBQAAAEfQLQABIAAAEzFQEjNQcjETMRNyMBMxUHFTcD3KH9z5+9oJyGAQEPoNdmAtA0/WTh4QLQ/h2gAUM1/rB6AAAB//8AAAQsAtAADwAAEwE1JzUzAREzESMnFSMBNZ8BlNefAZWcn76f/c8C0P4grf41/h4B4v0w4eECnDQAAAAAAQA2AAADvgLQAAsAAAkBIxEzEQkBETMRIwH6/tufmwEqASecnwFd/qMC0P4fAWD+oQHg/TAAAAABADUAAAQzAtAADgAAMyImNREzESERMxEhETMRyT1XmwEhnAEKnFY+Ajz9zAI0/cwCNP0wAAAAAAEANgAAAwcC0AAVAAABMxEUBxYVESMRIREjETQ3JjURMxEhAmqdODed/mmbNjebAZkC0P7tNyEfOf7zARf+6QENNiImMgET/uMAAAABADMAAAMDAtAAEQAAATMRFAYjITUhNSEiJjURMxEhAmadVz39xAIz/mE9V5sBmALQ/cQ9V5x+Vj4BIv7mAAAAAQAxAAADAQLQABcAABMhNSE1ITIWHQEUBiMhFSEVISImPQE0NsUBn/3NAjw9V1c9/l8CNf3EPVdXAbZ+nFc9jj1XfpxWPo4+VgAAAAIAMwAAAn8CRAAMABAAAAEyFhURISImNRE0NjMTIREhAe48Vf5FO1ZWOwgBGv7mAkRWO/5NVjsBIjtW/lUBEgACADUAAAKdAkQADQARAAATITIWFREjNSEVIxE0NhMhNSHHAUU8VZn+yplWQwE2/soCRFY7/k2KigGzO1b+34gAAwA2AAACjAJFAA4AEgAWAAABFRQHFh0BFAYjIREhMhYBFSE1JRUhNQJwBSFWO/47Aak8Vf5fAST+3AEIAbNPHBEnNUo7VgJFVv7uRETZSkoAAAAAAQAzAAACfgJFAA0AAAEhESEVISImNRE0NjMhAn7+TgGy/kY8VVU8AboBrP7tmVY7ASI8VgAAAAACADYAAAKMAkUACQANAAATITIWFREUBiMhExEhETYBxTtWVjv+O5kBJAJFVjz+3jtWAaz+7QETAAEANgAAAk0CRQALAAABFSEVIRUhFSEVIRECTf6CAR3+4wF+/ekCRZk9mjyZAkUAAAEANgAAAk0CRQAJAAATIRUhFSEVIRUjNgIX/oIBHf7jmQJFmT2a1QABADMAAAJ/AkUAGQAAARUjNSERITUjNSEVFAYjISImNRE0NjMhMhYCf5n+5gEakAEpVTz+1jtWVjsBKjxVAbMhGv7tK4/CO1ZWOwEiPFZWAAEANgAAApMCRAALAAABMxEjNSEVIxEzFSEB+Zqa/taZmQEqAkT9vNXVAkTVAAAAAAEANgAAAM8CRAADAAAzETMRNpkCRP28AAEABQAAAlsCRAANAAA3FSERMxEUBiMhIiY9AZ4BJJlVPP7NPFbjSgGr/k07VlY7UgAAAAABADYAAAKCAvAAEwAAARUUDgIHFh0BIzUhFSMRMxEhNQKCBgUPARuZ/uaZmQEaAkTeCBUKGwI0EN7V1QLw/n/VAAAAAAEANgAAAnwCRAAOAAABMxUHFxUjJyMVIxEzFTMB4prY2JrFTpmZTgJENO7uNNXVAkTVAAABADYAAAKMAkQABQAAMxEzESEVNpkBvQJE/lWZAAAAAAEANgAAAvYCRQALAAABEzMRIxELAREjETMBlsCgmsbHmZ8BMAEV/bsBVf7nARn+qwJFAAABADYAAAKMAkQACQAAJREzESMBESMRMwHzmZ/+4pme7gFW/bwBWP6oAkQAAAIAMwAAAn8CRAAPABMAABMhMhYVERQGIyEiJjURNDYXESERxAEqPFVVPP7WO1ZWQwEaAkRWO/7eO1ZWOwEiO1aZ/u4BEgAAAAIANgAAAoICRAAPABMAABMhMhYdARQGIwUyFSInFSMTFSE1NgG7PFVVPP7eAwIBmZkBGgJEVjtwO1YBBgGsAatfXwAAAgA0AAAC0gJEAA4AEgAAAREzFSEiJjURNDYzITIWBREhEQKAUv3zO1ZWOwEqPFX+TQEaAbP+5plWOwEiO1ZVRP7uARIAAAAAAgA2AAACjAJEAA8AEwAAARUUBgcXFSMnIxUjESEyFgUVITUCg003jZvDX5kBuzxW/kwBGgGzcDhUBXw2srICRFZDX18AAAAAAQAxAAACfgJEACEAAAEVIzUhFSEyFh0BFAYjISImPQEzFSE1ISImPQE0NjMhMhYCfpr+5gEiPFZWPP7WO1aZARr+3jtWVjsBKjxWAbMcFDxWO007VlY7HBQ8VjtNO1ZWAAAAAAEAFgAAAmwCRAAHAAATIRUjESMRIxYCVt+a3QJEmf5VAasAAAEANQAAAoECRAANAAATESERMxEUBiMhIiY1Ec4BGplVPP7WPFUCRP5VAav+TTtWVjsBswABADUAAAKBAkQACgAAATMRISImNREzESEB6Jn+RTxVmQEaAkT9vFY7AbP+VQAAAAABABUAAAMfAkQABgAAJRMzASMBMwGa1q/+vYP+vK/CAYL9vAJEAAAAAQA1AAADgAJEAA4AADMiJjURMxEzETMRMxEzEcc8VpjAmsCZVjsBs/5VAav+VQGr/bwAAAEAIgAABAMCRAANAAABMwMjAw8BIwMzGwEzEwNgo990nUNTc+iigYeMkAJE/bwBU5e8AkT+0AEw/s8AAAEANgAAAoICRAAbAAABFRQOAgcWHQEjNSEVIzU0Ny4DPQEzFSE1AoIGBQ8BG5n+5pkbAQ8FBpkBGgJE3ggVChsCNBDe1dXeEDQCGwoVCN7V1QAAAAEALgAAAoQCRAAQAAABMxUHFxUjJwcjNTcvATUzFwHnncjInY6OncaOOJ2OAkQy6vYyr68y9qZEMqgAAAEAEgAAAssCRAAIAAABMwEVIzUBMxcCFLf+8Jn+8LWoAkT+hMjIAXzYAAAAAQAzAAACfwJEABcAACUhFSEVISImPQE0NjMhNSE1ITIWHQEUBgHu/t4Bs/5FO1ZWOwEi/k0BuzxVVdU8mVY7TTtWPJlWO007VgAAAAEANgAAAoICRAAJAAATNSEVASEVITUBNgJM/qMBXf20AV0Bq5md/vKZnQEOAAAAAAAAAQAAB7IAAQFGBgAACAGkAAsANwAKACQAOv/ZACQAPP/rACUAOf/FACUAPP/XACUASv/2ACYAR//2ACcAMP/sACcAOf/bACcAOv/iACcAPf/lACcAS//2ACgAMP/tACgAMv/vACkALf9CACkANwAKACoAOv/dACoAPP/vACoARgAKACwALQAeACwALgAKACwANwAUACwAQwAUACwARAAKACwAUAAUACwAUQAKACwAUgAUACwAUwAUACwAVAAKACwAVQAKACwAWAAsACwAWQAKACwAWgAUAC0AR//2AC4AJP/pAC4AK//rAC4AQ//2AC4AUf/iAC4AW//2AC8AOf83AC8AOv+RAC8APP9bAC8ATgAKADAAQ//2ADAARf/sADEAR//2ADIAOf/dADIAOv/dADIAO//hADIARf/sADIASf/2ADIAXP/sADMALf/jADUAOf/fADUAOv/fADYAMf/jADYAOv/fADYAWf/iADcAUf/pADcAVf/rADgAVf/2ADgAWP/sADgAWf/2ADgAWv/2ADkAJP/1ADkAR//OADkASwAKADkAUf/OADkAVf/IADoAJP/PADoAMv/TADoAQ//EADoAR/+wADoASv/iADoAS//YADoAUf+/ADoAV//EADoAW//rADsAJf/nADsAQ//sADsAR//sADwAQ//vADwAR//NADwAUf/NADwAUv/tADwAVf/RADwAV//vAD0AR//iAEMARP/jAEMARf/dAEMASf/2AEMASv/2AEMATf/2AEMATv/lAEMAT//jAEMAUP/3AEMAVP/lAEMAVf/pAEMAWP/ZAEMAWf/VAEMAWv/rAEMAXP/jAEQAQ//2AEQAV//2AEQAWP/1AEQAWf/pAEQAtQAKAEUALP/sAEUAQ//2AEUARP/2AEUARf/2AEUAR//nAEUASv/jAEUATf/jAEUAUf/2AEUAVP/2AEUAVv/lAEUAV//lAEUAXP/jAEYAR//pAEYAUf/pAEYAVP/2AEYAV//nAEYAWf/2AEYAW//sAEcARf/nAEcAR//nAEcASf/2AEcASv/2AEcATAAKAEcATv/mAEcAUf/sAEcAVP/5AEcAVf/2AEcAWP/HAEcAWf/XAEcAWv/rAEcAW//2AEgAD/+dAEgAQwAKAEgARgAKAEgASgAKAEgATAAUAEgATgAUAEgAUAAUAEgAUQAKAEgAVgAeAEgAVwAKAEkAQ//nAEkARf/pAEkAR//pAEkASP/2AEkASf/sAEkAT//2AEkAUf/pAEkAVP/nAEkAVf/rAEkAV//nAEkAWf/XAEkAW//sAEkAXP/2AEoAR///AEsAQwABAEsARQAKAEsARgAUAEsARwAKAEsASAAUAEsASQAKAEsASgAUAEsATQAKAEsATgAeAEsAUAAoAEsAUgAUAEsAUwAyAEsAVAAeAEsAVQAoAEsAVgAUAEsAWAAKAEsAWQAUAEsAWgAUAEsAXAAKAEwAQwAKAEwATAAoAEwAVwAKAE0ASwAKAE4AQwALAE4ARAADAE4ARgAeAE4ARwAKAE4ASAAKAE4ASwAeAE4ATgAKAE4AUAAKAE4AUQAKAE4AVwALAE4AWwAUAE4AXAAKAE8AQ//hAE8ARP/iAE8ARf/YAE8AR//YAE8ASf/VAE8ATf/HAE8AT//HAE8AUP/2AE8AUv/HAE8AWf+7AFAARP/jAFAARf/nAFAAR//iAFAASf/2AFAAUf/nAFAAUv/jAFAAVf/sAFAAWv/rAFEAQ//lAFEARP/2AFEATv/lAFEAUP/jAFEAUf/nAFEAVP/lAFEAVf/pAFEAVv/vAFEAV//lAFEAWP/lAFEAWf+5AFEAWv/lAFIATAAKAFMAV//vAFQAD/9jAFQAQwAUAFQARAAKAFQARgAfAFQARwAKAFQASAAUAFQASQAKAFQASgAKAFQASwAUAFQATgAKAFQAUAAUAFQAUQAFAFQAVQAUAFQAVwAUAFQAWAAKAFQAXAAKAFUARf/rAFUAR//rAFUASf/1AFUATf/nAFUAUP/nAFUAUf/sAFUAV//fAFUAWP/VAFUAWf/iAFUAWv/pAFUAXP/nAFYAEQAKAFYAQwAeAFYARAAKAFYARgAyAFYASgAUAFYATwAeAFYAVAAKAFYAVQAKAFYAVgAKAFYAWAAFAFYAWwAKAFYAXAAUAFcARP/lAFcARf/nAFcAR//nAFcASP/nAFcASf/2AFcATf/2AFcAT//lAFcAUf/2AFcAUv/lAFcAVf/pAFcAVv/nAFcAWf/2AFcAWv/tAFcAXP/lAFcAtf/sAFgAR//iAFgASwAKAFgAUf/2AFgAWAAKAFkAQ//iAFkARf/iAFkAR//HAFkASf/PAFkASv/sAFkAS//sAFkATv/2AFkAUP/lAFkAUf/EAFkAVP/FAFkAVf/JAFkAVv/6AFkAV//sAFkAW//nAFoAR//pAFoAV//sAFsAQ//nAFsARf/nAFsAR//nAFsATf/sAFsATv/2AFsAUP/lAFsAUf/nAFsAUv/2AFsAVP/sAFsAVf/2AFsAWf/2AFwAQ//lAFwAR//nAFwASv/2AFwATv/lAFwAVv/lAFwAXP/jALUATgAUALUAVgAUALUAWAAoAMIAw/7dAMQA0f7XAMQA1P7dAAAAAAAcAVYAAQAAAAAAAAA5AHQAAQAAAAAAAQAIAMAAAQAAAAAAAgAFANUAAQAAAAAAAwAjASMAAQAAAAAABAAOAWUAAQAAAAAABQAFAYAAAQAAAAAABgAOAaQAAQAAAAAACAAOAdEAAQAAAAAACQAOAf4AAQAAAAAACwAiAlMAAQAAAAAADAAWAqQAAQAAAAAADRErJRMAAQAAAAAADgAaNnUAAQAAAAAAEgAINqIAAwABBAkAAAByAAAAAwABBAkAAQAQAK4AAwABBAkAAgAKAMkAAwABBAkAAwBGANsAAwABBAkABAAcAUcAAwABBAkABQAKAXQAAwABBAkABgAcAYYAAwABBAkACAAcAbMAAwABBAkACQAcAeAAAwABBAkACwBEAg0AAwABBAkADAAsAnYAAwABBAkADSJWArsAAwABBAkADgA0Nj8AAwABBAkAEgAQNpAAQwBvAHAAeQByAGkAZwBoAHQAIAAoAGMAKQAgADIAMAAwADkALAAgAE0AYQB0AHQAIABNAGMASQBuAGUAcgBuAGUAeQAgADwAbQBhAHQAdABAAHAAaQB4AGUAbABzAHAAcgBlAGEAZAAuAGMAbwBtAD4AAENvcHlyaWdodCAoYykgMjAwOSwgTWF0dCBNY0luZXJuZXkgPG1hdHRAcGl4ZWxzcHJlYWQuY29tPgAATwByAGIAaQB0AHIAbwBuAABPcmJpdHJvbgAAQgBsAGEAYwBrAABCbGFjawAATQBhAHQAdABNAGMASQBuAGUAcgBuAGUAeQA6ACAATwByAGIAaQB0AHIAbwBuACAAQgBsAGEAYwBrADoAIAAyADAAMAA5AABNYXR0TWNJbmVybmV5OiBPcmJpdHJvbiBCbGFjazogMjAwOQAATwByAGIAaQB0AHIAbwBuAC0AQgBsAGEAYwBrAABPcmJpdHJvbi1CbGFjawAAMQAuADAAMAAwAAAxLjAwMAAATwByAGIAaQB0AHIAbwBuAC0AQgBsAGEAYwBrAABPcmJpdHJvbi1CbGFjawAATQBhAHQAdAAgAE0AYwBJAG4AZQByAG4AZQB5AABNYXR0IE1jSW5lcm5leQAATQBhAHQAdAAgAE0AYwBJAG4AZQByAG4AZQB5AABNYXR0IE1jSW5lcm5leQAAaAB0AHQAcAA6AC8ALwB0AGgAZQBsAGUAYQBnAHUAZQBvAGYAbQBvAHYAZQBhAGIAbABlAHQAeQBwAGUALgBjAG8AbQAAaHR0cDovL3RoZWxlYWd1ZW9mbW92ZWFibGV0eXBlLmNvbQAAaAB0AHQAcAA6AC8ALwBwAGkAeABlAGwAcwBwAHIAZQBhAGQALgBjAG8AbQAAaHR0cDovL3BpeGVsc3ByZWFkLmNvbQAAQwBvAHAAeQByAGkAZwBoAHQAIAAoAGMAKQAgADIAMAAwADkALAAgAE0AYQB0AHQAIABNAGMASQBuAGUAcgBuAGUAeQAgADwAbQBhAHQAdABAAHAAaQB4AGUAbABzAHAAcgBlAGEAZAAuAGMAbwBtAD4ALAAKAHcAaQB0AGgAIABSAGUAcwBlAHIAdgBlAGQAIABGAG8AbgB0ACAATgBhAG0AZQAgAE8AcgBiAGkAdAByAG8AbgAuAAoACgBUAGgAaQBzACAARgBvAG4AdAAgAFMAbwBmAHQAdwBhAHIAZQAgAGkAcwAgAGwAaQBjAGUAbgBzAGUAZAAgAHUAbgBkAGUAcgAgAHQAaABlACAAUwBJAEwAIABPAHAAZQBuACAARgBvAG4AdAAgAEwAaQBjAGUAbgBzAGUALAAgAFYAZQByAHMAaQBvAG4AIAAxAC4AMQAuAAoAVABoAGkAcwAgAGwAaQBjAGUAbgBzAGUAIABpAHMAIABjAG8AcABpAGUAZAAgAGIAZQBsAG8AdwAsACAAYQBuAGQAIABpAHMAIABhAGwAcwBvACAAYQB2AGEAaQBsAGEAYgBsAGUAIAB3AGkAdABoACAAYQAgAEYAQQBRACAAYQB0ADoACgBoAHQAdABwADoALwAvAHMAYwByAGkAcAB0AHMALgBzAGkAbAAuAG8AcgBnAC8ATwBGAEwACgAKAAoALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAAoAUwBJAEwAIABPAFAARQBOACAARgBPAE4AVAAgAEwASQBDAEUATgBTAEUAIABWAGUAcgBzAGkAbwBuACAAMQAuADEAIAAtACAAMgA2ACAARgBlAGIAcgB1AGEAcgB5ACAAMgAwADAANwAKAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAtAC0ALQAKAAoAUABSAEUAQQBNAEIATABFAAoAVABoAGUAIABnAG8AYQBsAHMAIABvAGYAIAB0AGgAZQAgAE8AcABlAG4AIABGAG8AbgB0ACAATABpAGMAZQBuAHMAZQAgACgATwBGAEwAKQAgAGEAcgBlACAAdABvACAAcwB0AGkAbQB1AGwAYQB0AGUAIAB3AG8AcgBsAGQAdwBpAGQAZQAKAGQAZQB2AGUAbABvAHAAbQBlAG4AdAAgAG8AZgAgAGMAbwBsAGwAYQBiAG8AcgBhAHQAaQB2AGUAIABmAG8AbgB0ACAAcAByAG8AagBlAGMAdABzACwAIAB0AG8AIABzAHUAcABwAG8AcgB0ACAAdABoAGUAIABmAG8AbgB0ACAAYwByAGUAYQB0AGkAbwBuAAoAZQBmAGYAbwByAHQAcwAgAG8AZgAgAGEAYwBhAGQAZQBtAGkAYwAgAGEAbgBkACAAbABpAG4AZwB1AGkAcwB0AGkAYwAgAGMAbwBtAG0AdQBuAGkAdABpAGUAcwAsACAAYQBuAGQAIAB0AG8AIABwAHIAbwB2AGkAZABlACAAYQAgAGYAcgBlAGUAIABhAG4AZAAKAG8AcABlAG4AIABmAHIAYQBtAGUAdwBvAHIAawAgAGkAbgAgAHcAaABpAGMAaAAgAGYAbwBuAHQAcwAgAG0AYQB5ACAAYgBlACAAcwBoAGEAcgBlAGQAIABhAG4AZAAgAGkAbQBwAHIAbwB2AGUAZAAgAGkAbgAgAHAAYQByAHQAbgBlAHIAcwBoAGkAcAAKAHcAaQB0AGgAIABvAHQAaABlAHIAcwAuAAoACgBUAGgAZQAgAE8ARgBMACAAYQBsAGwAbwB3AHMAIAB0AGgAZQAgAGwAaQBjAGUAbgBzAGUAZAAgAGYAbwBuAHQAcwAgAHQAbwAgAGIAZQAgAHUAcwBlAGQALAAgAHMAdAB1AGQAaQBlAGQALAAgAG0AbwBkAGkAZgBpAGUAZAAgAGEAbgBkAAoAcgBlAGQAaQBzAHQAcgBpAGIAdQB0AGUAZAAgAGYAcgBlAGUAbAB5ACAAYQBzACAAbABvAG4AZwAgAGEAcwAgAHQAaABlAHkAIABhAHIAZQAgAG4AbwB0ACAAcwBvAGwAZAAgAGIAeQAgAHQAaABlAG0AcwBlAGwAdgBlAHMALgAgAFQAaABlAAoAZgBvAG4AdABzACwAIABpAG4AYwBsAHUAZABpAG4AZwAgAGEAbgB5ACAAZABlAHIAaQB2AGEAdABpAHYAZQAgAHcAbwByAGsAcwAsACAAYwBhAG4AIABiAGUAIABiAHUAbgBkAGwAZQBkACwAIABlAG0AYgBlAGQAZABlAGQALAAgAAoAcgBlAGQAaQBzAHQAcgBpAGIAdQB0AGUAZAAgAGEAbgBkAC8AbwByACAAcwBvAGwAZAAgAHcAaQB0AGgAIABhAG4AeQAgAHMAbwBmAHQAdwBhAHIAZQAgAHAAcgBvAHYAaQBkAGUAZAAgAHQAaABhAHQAIABhAG4AeQAgAHIAZQBzAGUAcgB2AGUAZAAKAG4AYQBtAGUAcwAgAGEAcgBlACAAbgBvAHQAIAB1AHMAZQBkACAAYgB5ACAAZABlAHIAaQB2AGEAdABpAHYAZQAgAHcAbwByAGsAcwAuACAAVABoAGUAIABmAG8AbgB0AHMAIABhAG4AZAAgAGQAZQByAGkAdgBhAHQAaQB2AGUAcwAsAAoAaABvAHcAZQB2AGUAcgAsACAAYwBhAG4AbgBvAHQAIABiAGUAIAByAGUAbABlAGEAcwBlAGQAIAB1AG4AZABlAHIAIABhAG4AeQAgAG8AdABoAGUAcgAgAHQAeQBwAGUAIABvAGYAIABsAGkAYwBlAG4AcwBlAC4AIABUAGgAZQAKAHIAZQBxAHUAaQByAGUAbQBlAG4AdAAgAGYAbwByACAAZgBvAG4AdABzACAAdABvACAAcgBlAG0AYQBpAG4AIAB1AG4AZABlAHIAIAB0AGgAaQBzACAAbABpAGMAZQBuAHMAZQAgAGQAbwBlAHMAIABuAG8AdAAgAGEAcABwAGwAeQAKAHQAbwAgAGEAbgB5ACAAZABvAGMAdQBtAGUAbgB0ACAAYwByAGUAYQB0AGUAZAAgAHUAcwBpAG4AZwAgAHQAaABlACAAZgBvAG4AdABzACAAbwByACAAdABoAGUAaQByACAAZABlAHIAaQB2AGEAdABpAHYAZQBzAC4ACgAKAEQARQBGAEkATgBJAFQASQBPAE4AUwAKACIARgBvAG4AdAAgAFMAbwBmAHQAdwBhAHIAZQAiACAAcgBlAGYAZQByAHMAIAB0AG8AIAB0AGgAZQAgAHMAZQB0ACAAbwBmACAAZgBpAGwAZQBzACAAcgBlAGwAZQBhAHMAZQBkACAAYgB5ACAAdABoAGUAIABDAG8AcAB5AHIAaQBnAGgAdAAKAEgAbwBsAGQAZQByACgAcwApACAAdQBuAGQAZQByACAAdABoAGkAcwAgAGwAaQBjAGUAbgBzAGUAIABhAG4AZAAgAGMAbABlAGEAcgBsAHkAIABtAGEAcgBrAGUAZAAgAGEAcwAgAHMAdQBjAGgALgAgAFQAaABpAHMAIABtAGEAeQAKAGkAbgBjAGwAdQBkAGUAIABzAG8AdQByAGMAZQAgAGYAaQBsAGUAcwAsACAAYgB1AGkAbABkACAAcwBjAHIAaQBwAHQAcwAgAGEAbgBkACAAZABvAGMAdQBtAGUAbgB0AGEAdABpAG8AbgAuAAoACgAiAFIAZQBzAGUAcgB2AGUAZAAgAEYAbwBuAHQAIABOAGEAbQBlACIAIAByAGUAZgBlAHIAcwAgAHQAbwAgAGEAbgB5ACAAbgBhAG0AZQBzACAAcwBwAGUAYwBpAGYAaQBlAGQAIABhAHMAIABzAHUAYwBoACAAYQBmAHQAZQByACAAdABoAGUACgBjAG8AcAB5AHIAaQBnAGgAdAAgAHMAdABhAHQAZQBtAGUAbgB0ACgAcwApAC4ACgAKACIATwByAGkAZwBpAG4AYQBsACAAVgBlAHIAcwBpAG8AbgAiACAAcgBlAGYAZQByAHMAIAB0AG8AIAB0AGgAZQAgAGMAbwBsAGwAZQBjAHQAaQBvAG4AIABvAGYAIABGAG8AbgB0ACAAUwBvAGYAdAB3AGEAcgBlACAAYwBvAG0AcABvAG4AZQBuAHQAcwAgAGEAcwAKAGQAaQBzAHQAcgBpAGIAdQB0AGUAZAAgAGIAeQAgAHQAaABlACAAQwBvAHAAeQByAGkAZwBoAHQAIABIAG8AbABkAGUAcgAoAHMAKQAuAAoACgAiAE0AbwBkAGkAZgBpAGUAZAAgAFYAZQByAHMAaQBvAG4AIgAgAHIAZQBmAGUAcgBzACAAdABvACAAYQBuAHkAIABkAGUAcgBpAHYAYQB0AGkAdgBlACAAbQBhAGQAZQAgAGIAeQAgAGEAZABkAGkAbgBnACAAdABvACwAIABkAGUAbABlAHQAaQBuAGcALAAKAG8AcgAgAHMAdQBiAHMAdABpAHQAdQB0AGkAbgBnACAALQAtACAAaQBuACAAcABhAHIAdAAgAG8AcgAgAGkAbgAgAHcAaABvAGwAZQAgAC0ALQAgAGEAbgB5ACAAbwBmACAAdABoAGUAIABjAG8AbQBwAG8AbgBlAG4AdABzACAAbwBmACAAdABoAGUACgBPAHIAaQBnAGkAbgBhAGwAIABWAGUAcgBzAGkAbwBuACwAIABiAHkAIABjAGgAYQBuAGcAaQBuAGcAIABmAG8AcgBtAGEAdABzACAAbwByACAAYgB5ACAAcABvAHIAdABpAG4AZwAgAHQAaABlACAARgBvAG4AdAAgAFMAbwBmAHQAdwBhAHIAZQAgAHQAbwAgAGEACgBuAGUAdwAgAGUAbgB2AGkAcgBvAG4AbQBlAG4AdAAuAAoACgAiAEEAdQB0AGgAbwByACIAIAByAGUAZgBlAHIAcwAgAHQAbwAgAGEAbgB5ACAAZABlAHMAaQBnAG4AZQByACwAIABlAG4AZwBpAG4AZQBlAHIALAAgAHAAcgBvAGcAcgBhAG0AbQBlAHIALAAgAHQAZQBjAGgAbgBpAGMAYQBsAAoAdwByAGkAdABlAHIAIABvAHIAIABvAHQAaABlAHIAIABwAGUAcgBzAG8AbgAgAHcAaABvACAAYwBvAG4AdAByAGkAYgB1AHQAZQBkACAAdABvACAAdABoAGUAIABGAG8AbgB0ACAAUwBvAGYAdAB3AGEAcgBlAC4ACgAKAFAARQBSAE0ASQBTAFMASQBPAE4AIAAmACAAQwBPAE4ARABJAFQASQBPAE4AUwAKAFAAZQByAG0AaQBzAHMAaQBvAG4AIABpAHMAIABoAGUAcgBlAGIAeQAgAGcAcgBhAG4AdABlAGQALAAgAGYAcgBlAGUAIABvAGYAIABjAGgAYQByAGcAZQAsACAAdABvACAAYQBuAHkAIABwAGUAcgBzAG8AbgAgAG8AYgB0AGEAaQBuAGkAbgBnAAoAYQAgAGMAbwBwAHkAIABvAGYAIAB0AGgAZQAgAEYAbwBuAHQAIABTAG8AZgB0AHcAYQByAGUALAAgAHQAbwAgAHUAcwBlACwAIABzAHQAdQBkAHkALAAgAGMAbwBwAHkALAAgAG0AZQByAGcAZQAsACAAZQBtAGIAZQBkACwAIABtAG8AZABpAGYAeQAsAAoAcgBlAGQAaQBzAHQAcgBpAGIAdQB0AGUALAAgAGEAbgBkACAAcwBlAGwAbAAgAG0AbwBkAGkAZgBpAGUAZAAgAGEAbgBkACAAdQBuAG0AbwBkAGkAZgBpAGUAZAAgAGMAbwBwAGkAZQBzACAAbwBmACAAdABoAGUAIABGAG8AbgB0AAoAUwBvAGYAdAB3AGEAcgBlACwAIABzAHUAYgBqAGUAYwB0ACAAdABvACAAdABoAGUAIABmAG8AbABsAG8AdwBpAG4AZwAgAGMAbwBuAGQAaQB0AGkAbwBuAHMAOgAKAAoAMQApACAATgBlAGkAdABoAGUAcgAgAHQAaABlACAARgBvAG4AdAAgAFMAbwBmAHQAdwBhAHIAZQAgAG4AbwByACAAYQBuAHkAIABvAGYAIABpAHQAcwAgAGkAbgBkAGkAdgBpAGQAdQBhAGwAIABjAG8AbQBwAG8AbgBlAG4AdABzACwACgBpAG4AIABPAHIAaQBnAGkAbgBhAGwAIABvAHIAIABNAG8AZABpAGYAaQBlAGQAIABWAGUAcgBzAGkAbwBuAHMALAAgAG0AYQB5ACAAYgBlACAAcwBvAGwAZAAgAGIAeQAgAGkAdABzAGUAbABmAC4ACgAKADIAKQAgAE8AcgBpAGcAaQBuAGEAbAAgAG8AcgAgAE0AbwBkAGkAZgBpAGUAZAAgAFYAZQByAHMAaQBvAG4AcwAgAG8AZgAgAHQAaABlACAARgBvAG4AdAAgAFMAbwBmAHQAdwBhAHIAZQAgAG0AYQB5ACAAYgBlACAAYgB1AG4AZABsAGUAZAAsAAoAcgBlAGQAaQBzAHQAcgBpAGIAdQB0AGUAZAAgAGEAbgBkAC8AbwByACAAcwBvAGwAZAAgAHcAaQB0AGgAIABhAG4AeQAgAHMAbwBmAHQAdwBhAHIAZQAsACAAcAByAG8AdgBpAGQAZQBkACAAdABoAGEAdAAgAGUAYQBjAGgAIABjAG8AcAB5AAoAYwBvAG4AdABhAGkAbgBzACAAdABoAGUAIABhAGIAbwB2AGUAIABjAG8AcAB5AHIAaQBnAGgAdAAgAG4AbwB0AGkAYwBlACAAYQBuAGQAIAB0AGgAaQBzACAAbABpAGMAZQBuAHMAZQAuACAAVABoAGUAcwBlACAAYwBhAG4AIABiAGUACgBpAG4AYwBsAHUAZABlAGQAIABlAGkAdABoAGUAcgAgAGEAcwAgAHMAdABhAG4AZAAtAGEAbABvAG4AZQAgAHQAZQB4AHQAIABmAGkAbABlAHMALAAgAGgAdQBtAGEAbgAtAHIAZQBhAGQAYQBiAGwAZQAgAGgAZQBhAGQAZQByAHMAIABvAHIACgBpAG4AIAB0AGgAZQAgAGEAcABwAHIAbwBwAHIAaQBhAHQAZQAgAG0AYQBjAGgAaQBuAGUALQByAGUAYQBkAGEAYgBsAGUAIABtAGUAdABhAGQAYQB0AGEAIABmAGkAZQBsAGQAcwAgAHcAaQB0AGgAaQBuACAAdABlAHgAdAAgAG8AcgAKAGIAaQBuAGEAcgB5ACAAZgBpAGwAZQBzACAAYQBzACAAbABvAG4AZwAgAGEAcwAgAHQAaABvAHMAZQAgAGYAaQBlAGwAZABzACAAYwBhAG4AIABiAGUAIABlAGEAcwBpAGwAeQAgAHYAaQBlAHcAZQBkACAAYgB5ACAAdABoAGUAIAB1AHMAZQByAC4ACgAKADMAKQAgAE4AbwAgAE0AbwBkAGkAZgBpAGUAZAAgAFYAZQByAHMAaQBvAG4AIABvAGYAIAB0AGgAZQAgAEYAbwBuAHQAIABTAG8AZgB0AHcAYQByAGUAIABtAGEAeQAgAHUAcwBlACAAdABoAGUAIABSAGUAcwBlAHIAdgBlAGQAIABGAG8AbgB0AAoATgBhAG0AZQAoAHMAKQAgAHUAbgBsAGUAcwBzACAAZQB4AHAAbABpAGMAaQB0ACAAdwByAGkAdAB0AGUAbgAgAHAAZQByAG0AaQBzAHMAaQBvAG4AIABpAHMAIABnAHIAYQBuAHQAZQBkACAAYgB5ACAAdABoAGUAIABjAG8AcgByAGUAcwBwAG8AbgBkAGkAbgBnAAoAQwBvAHAAeQByAGkAZwBoAHQAIABIAG8AbABkAGUAcgAuACAAVABoAGkAcwAgAHIAZQBzAHQAcgBpAGMAdABpAG8AbgAgAG8AbgBsAHkAIABhAHAAcABsAGkAZQBzACAAdABvACAAdABoAGUAIABwAHIAaQBtAGEAcgB5ACAAZgBvAG4AdAAgAG4AYQBtAGUAIABhAHMACgBwAHIAZQBzAGUAbgB0AGUAZAAgAHQAbwAgAHQAaABlACAAdQBzAGUAcgBzAC4ACgAKADQAKQAgAFQAaABlACAAbgBhAG0AZQAoAHMAKQAgAG8AZgAgAHQAaABlACAAQwBvAHAAeQByAGkAZwBoAHQAIABIAG8AbABkAGUAcgAoAHMAKQAgAG8AcgAgAHQAaABlACAAQQB1AHQAaABvAHIAKABzACkAIABvAGYAIAB0AGgAZQAgAEYAbwBuAHQACgBTAG8AZgB0AHcAYQByAGUAIABzAGgAYQBsAGwAIABuAG8AdAAgAGIAZQAgAHUAcwBlAGQAIAB0AG8AIABwAHIAbwBtAG8AdABlACwAIABlAG4AZABvAHIAcwBlACAAbwByACAAYQBkAHYAZQByAHQAaQBzAGUAIABhAG4AeQAKAE0AbwBkAGkAZgBpAGUAZAAgAFYAZQByAHMAaQBvAG4ALAAgAGUAeABjAGUAcAB0ACAAdABvACAAYQBjAGsAbgBvAHcAbABlAGQAZwBlACAAdABoAGUAIABjAG8AbgB0AHIAaQBiAHUAdABpAG8AbgAoAHMAKQAgAG8AZgAgAHQAaABlAAoAQwBvAHAAeQByAGkAZwBoAHQAIABIAG8AbABkAGUAcgAoAHMAKQAgAGEAbgBkACAAdABoAGUAIABBAHUAdABoAG8AcgAoAHMAKQAgAG8AcgAgAHcAaQB0AGgAIAB0AGgAZQBpAHIAIABlAHgAcABsAGkAYwBpAHQAIAB3AHIAaQB0AHQAZQBuAAoAcABlAHIAbQBpAHMAcwBpAG8AbgAuAAoACgA1ACkAIABUAGgAZQAgAEYAbwBuAHQAIABTAG8AZgB0AHcAYQByAGUALAAgAG0AbwBkAGkAZgBpAGUAZAAgAG8AcgAgAHUAbgBtAG8AZABpAGYAaQBlAGQALAAgAGkAbgAgAHAAYQByAHQAIABvAHIAIABpAG4AIAB3AGgAbwBsAGUALAAKAG0AdQBzAHQAIABiAGUAIABkAGkAcwB0AHIAaQBiAHUAdABlAGQAIABlAG4AdABpAHIAZQBsAHkAIAB1AG4AZABlAHIAIAB0AGgAaQBzACAAbABpAGMAZQBuAHMAZQAsACAAYQBuAGQAIABtAHUAcwB0ACAAbgBvAHQAIABiAGUACgBkAGkAcwB0AHIAaQBiAHUAdABlAGQAIAB1AG4AZABlAHIAIABhAG4AeQAgAG8AdABoAGUAcgAgAGwAaQBjAGUAbgBzAGUALgAgAFQAaABlACAAcgBlAHEAdQBpAHIAZQBtAGUAbgB0ACAAZgBvAHIAIABmAG8AbgB0AHMAIAB0AG8ACgByAGUAbQBhAGkAbgAgAHUAbgBkAGUAcgAgAHQAaABpAHMAIABsAGkAYwBlAG4AcwBlACAAZABvAGUAcwAgAG4AbwB0ACAAYQBwAHAAbAB5ACAAdABvACAAYQBuAHkAIABkAG8AYwB1AG0AZQBuAHQAIABjAHIAZQBhAHQAZQBkAAoAdQBzAGkAbgBnACAAdABoAGUAIABGAG8AbgB0ACAAUwBvAGYAdAB3AGEAcgBlAC4ACgAKAFQARQBSAE0ASQBOAEEAVABJAE8ATgAKAFQAaABpAHMAIABsAGkAYwBlAG4AcwBlACAAYgBlAGMAbwBtAGUAcwAgAG4AdQBsAGwAIABhAG4AZAAgAHYAbwBpAGQAIABpAGYAIABhAG4AeQAgAG8AZgAgAHQAaABlACAAYQBiAG8AdgBlACAAYwBvAG4AZABpAHQAaQBvAG4AcwAgAGEAcgBlAAoAbgBvAHQAIABtAGUAdAAuAAoACgBEAEkAUwBDAEwAQQBJAE0ARQBSAAoAVABIAEUAIABGAE8ATgBUACAAUwBPAEYAVABXAEEAUgBFACAASQBTACAAUABSAE8AVgBJAEQARQBEACAAIgBBAFMAIABJAFMAIgAsACAAVwBJAFQASABPAFUAVAAgAFcAQQBSAFIAQQBOAFQAWQAgAE8ARgAgAEEATgBZACAASwBJAE4ARAAsAAoARQBYAFAAUgBFAFMAUwAgAE8AUgAgAEkATQBQAEwASQBFAEQALAAgAEkATgBDAEwAVQBEAEkATgBHACAAQgBVAFQAIABOAE8AVAAgAEwASQBNAEkAVABFAEQAIABUAE8AIABBAE4AWQAgAFcAQQBSAFIAQQBOAFQASQBFAFMAIABPAEYACgBNAEUAUgBDAEgAQQBOAFQAQQBCAEkATABJAFQAWQAsACAARgBJAFQATgBFAFMAUwAgAEYATwBSACAAQQAgAFAAQQBSAFQASQBDAFUATABBAFIAIABQAFUAUgBQAE8AUwBFACAAQQBOAEQAIABOAE8ATgBJAE4ARgBSAEkATgBHAEUATQBFAE4AVAAKAE8ARgAgAEMATwBQAFkAUgBJAEcASABUACwAIABQAEEAVABFAE4AVAAsACAAVABSAEEARABFAE0AQQBSAEsALAAgAE8AUgAgAE8AVABIAEUAUgAgAFIASQBHAEgAVAAuACAASQBOACAATgBPACAARQBWAEUATgBUACAAUwBIAEEATABMACAAVABIAEUACgBDAE8AUABZAFIASQBHAEgAVAAgAEgATwBMAEQARQBSACAAQgBFACAATABJAEEAQgBMAEUAIABGAE8AUgAgAEEATgBZACAAQwBMAEEASQBNACwAIABEAEEATQBBAEcARQBTACAATwBSACAATwBUAEgARQBSACAATABJAEEAQgBJAEwASQBUAFkALAAKAEkATgBDAEwAVQBEAEkATgBHACAAQQBOAFkAIABHAEUATgBFAFIAQQBMACwAIABTAFAARQBDAEkAQQBMACwAIABJAE4ARABJAFIARQBDAFQALAAgAEkATgBDAEkARABFAE4AVABBAEwALAAgAE8AUgAgAEMATwBOAFMARQBRAFUARQBOAFQASQBBAEwACgBEAEEATQBBAEcARQBTACwAIABXAEgARQBUAEgARQBSACAASQBOACAAQQBOACAAQQBDAFQASQBPAE4AIABPAEYAIABDAE8ATgBUAFIAQQBDAFQALAAgAFQATwBSAFQAIABPAFIAIABPAFQASABFAFIAVwBJAFMARQAsACAAQQBSAEkAUwBJAE4ARwAKAEYAUgBPAE0ALAAgAE8AVQBUACAATwBGACAAVABIAEUAIABVAFMARQAgAE8AUgAgAEkATgBBAEIASQBMAEkAVABZACAAVABPACAAVQBTAEUAIABUAEgARQAgAEYATwBOAFQAIABTAE8ARgBUAFcAQQBSAEUAIABPAFIAIABGAFIATwBNAAoATwBUAEgARQBSACAARABFAEEATABJAE4ARwBTACAASQBOACAAVABIAEUAIABGAE8ATgBUACAAUwBPAEYAVABXAEEAUgBFAC4AAENvcHlyaWdodCAoYykgMjAwOSwgTWF0dCBNY0luZXJuZXkgPG1hdHRAcGl4ZWxzcHJlYWQuY29tPiwKd2l0aCBSZXNlcnZlZCBGb250IE5hbWUgT3JiaXRyb24uCgpUaGlzIEZvbnQgU29mdHdhcmUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIFNJTCBPcGVuIEZvbnQgTGljZW5zZSwgVmVyc2lvbiAxLjEuClRoaXMgbGljZW5zZSBpcyBjb3BpZWQgYmVsb3csIGFuZCBpcyBhbHNvIGF2YWlsYWJsZSB3aXRoIGEgRkFRIGF0OgpodHRwOi8vc2NyaXB0cy5zaWwub3JnL09GTAoKCi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tClNJTCBPUEVOIEZPTlQgTElDRU5TRSBWZXJzaW9uIDEuMSAtIDI2IEZlYnJ1YXJ5IDIwMDcKLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0KClBSRUFNQkxFClRoZSBnb2FscyBvZiB0aGUgT3BlbiBGb250IExpY2Vuc2UgKE9GTCkgYXJlIHRvIHN0aW11bGF0ZSB3b3JsZHdpZGUKZGV2ZWxvcG1lbnQgb2YgY29sbGFib3JhdGl2ZSBmb250IHByb2plY3RzLCB0byBzdXBwb3J0IHRoZSBmb250IGNyZWF0aW9uCmVmZm9ydHMgb2YgYWNhZGVtaWMgYW5kIGxpbmd1aXN0aWMgY29tbXVuaXRpZXMsIGFuZCB0byBwcm92aWRlIGEgZnJlZSBhbmQKb3BlbiBmcmFtZXdvcmsgaW4gd2hpY2ggZm9udHMgbWF5IGJlIHNoYXJlZCBhbmQgaW1wcm92ZWQgaW4gcGFydG5lcnNoaXAKd2l0aCBvdGhlcnMuCgpUaGUgT0ZMIGFsbG93cyB0aGUgbGljZW5zZWQgZm9udHMgdG8gYmUgdXNlZCwgc3R1ZGllZCwgbW9kaWZpZWQgYW5kCnJlZGlzdHJpYnV0ZWQgZnJlZWx5IGFzIGxvbmcgYXMgdGhleSBhcmUgbm90IHNvbGQgYnkgdGhlbXNlbHZlcy4gVGhlCmZvbnRzLCBpbmNsdWRpbmcgYW55IGRlcml2YXRpdmUgd29ya3MsIGNhbiBiZSBidW5kbGVkLCBlbWJlZGRlZCwgCnJlZGlzdHJpYnV0ZWQgYW5kL29yIHNvbGQgd2l0aCBhbnkgc29mdHdhcmUgcHJvdmlkZWQgdGhhdCBhbnkgcmVzZXJ2ZWQKbmFtZXMgYXJlIG5vdCB1c2VkIGJ5IGRlcml2YXRpdmUgd29ya3MuIFRoZSBmb250cyBhbmQgZGVyaXZhdGl2ZXMsCmhvd2V2ZXIsIGNhbm5vdCBiZSByZWxlYXNlZCB1bmRlciBhbnkgb3RoZXIgdHlwZSBvZiBsaWNlbnNlLiBUaGUKcmVxdWlyZW1lbnQgZm9yIGZvbnRzIHRvIHJlbWFpbiB1bmRlciB0aGlzIGxpY2Vuc2UgZG9lcyBub3QgYXBwbHkKdG8gYW55IGRvY3VtZW50IGNyZWF0ZWQgdXNpbmcgdGhlIGZvbnRzIG9yIHRoZWlyIGRlcml2YXRpdmVzLgoKREVGSU5JVElPTlMKIkZvbnQgU29mdHdhcmUiIHJlZmVycyB0byB0aGUgc2V0IG9mIGZpbGVzIHJlbGVhc2VkIGJ5IHRoZSBDb3B5cmlnaHQKSG9sZGVyKHMpIHVuZGVyIHRoaXMgbGljZW5zZSBhbmQgY2xlYXJseSBtYXJrZWQgYXMgc3VjaC4gVGhpcyBtYXkKaW5jbHVkZSBzb3VyY2UgZmlsZXMsIGJ1aWxkIHNjcmlwdHMgYW5kIGRvY3VtZW50YXRpb24uCgoiUmVzZXJ2ZWQgRm9udCBOYW1lIiByZWZlcnMgdG8gYW55IG5hbWVzIHNwZWNpZmllZCBhcyBzdWNoIGFmdGVyIHRoZQpjb3B5cmlnaHQgc3RhdGVtZW50KHMpLgoKIk9yaWdpbmFsIFZlcnNpb24iIHJlZmVycyB0byB0aGUgY29sbGVjdGlvbiBvZiBGb250IFNvZnR3YXJlIGNvbXBvbmVudHMgYXMKZGlzdHJpYnV0ZWQgYnkgdGhlIENvcHlyaWdodCBIb2xkZXIocykuCgoiTW9kaWZpZWQgVmVyc2lvbiIgcmVmZXJzIHRvIGFueSBkZXJpdmF0aXZlIG1hZGUgYnkgYWRkaW5nIHRvLCBkZWxldGluZywKb3Igc3Vic3RpdHV0aW5nIC0tIGluIHBhcnQgb3IgaW4gd2hvbGUgLS0gYW55IG9mIHRoZSBjb21wb25lbnRzIG9mIHRoZQpPcmlnaW5hbCBWZXJzaW9uLCBieSBjaGFuZ2luZyBmb3JtYXRzIG9yIGJ5IHBvcnRpbmcgdGhlIEZvbnQgU29mdHdhcmUgdG8gYQpuZXcgZW52aXJvbm1lbnQuCgoiQXV0aG9yIiByZWZlcnMgdG8gYW55IGRlc2lnbmVyLCBlbmdpbmVlciwgcHJvZ3JhbW1lciwgdGVjaG5pY2FsCndyaXRlciBvciBvdGhlciBwZXJzb24gd2hvIGNvbnRyaWJ1dGVkIHRvIHRoZSBGb250IFNvZnR3YXJlLgoKUEVSTUlTU0lPTiAmIENPTkRJVElPTlMKUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nCmEgY29weSBvZiB0aGUgRm9udCBTb2Z0d2FyZSwgdG8gdXNlLCBzdHVkeSwgY29weSwgbWVyZ2UsIGVtYmVkLCBtb2RpZnksCnJlZGlzdHJpYnV0ZSwgYW5kIHNlbGwgbW9kaWZpZWQgYW5kIHVubW9kaWZpZWQgY29waWVzIG9mIHRoZSBGb250ClNvZnR3YXJlLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczoKCjEpIE5laXRoZXIgdGhlIEZvbnQgU29mdHdhcmUgbm9yIGFueSBvZiBpdHMgaW5kaXZpZHVhbCBjb21wb25lbnRzLAppbiBPcmlnaW5hbCBvciBNb2RpZmllZCBWZXJzaW9ucywgbWF5IGJlIHNvbGQgYnkgaXRzZWxmLgoKMikgT3JpZ2luYWwgb3IgTW9kaWZpZWQgVmVyc2lvbnMgb2YgdGhlIEZvbnQgU29mdHdhcmUgbWF5IGJlIGJ1bmRsZWQsCnJlZGlzdHJpYnV0ZWQgYW5kL29yIHNvbGQgd2l0aCBhbnkgc29mdHdhcmUsIHByb3ZpZGVkIHRoYXQgZWFjaCBjb3B5CmNvbnRhaW5zIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIGxpY2Vuc2UuIFRoZXNlIGNhbiBiZQppbmNsdWRlZCBlaXRoZXIgYXMgc3RhbmQtYWxvbmUgdGV4dCBmaWxlcywgaHVtYW4tcmVhZGFibGUgaGVhZGVycyBvcgppbiB0aGUgYXBwcm9wcmlhdGUgbWFjaGluZS1yZWFkYWJsZSBtZXRhZGF0YSBmaWVsZHMgd2l0aGluIHRleHQgb3IKYmluYXJ5IGZpbGVzIGFzIGxvbmcgYXMgdGhvc2UgZmllbGRzIGNhbiBiZSBlYXNpbHkgdmlld2VkIGJ5IHRoZSB1c2VyLgoKMykgTm8gTW9kaWZpZWQgVmVyc2lvbiBvZiB0aGUgRm9udCBTb2Z0d2FyZSBtYXkgdXNlIHRoZSBSZXNlcnZlZCBGb250Ck5hbWUocykgdW5sZXNzIGV4cGxpY2l0IHdyaXR0ZW4gcGVybWlzc2lvbiBpcyBncmFudGVkIGJ5IHRoZSBjb3JyZXNwb25kaW5nCkNvcHlyaWdodCBIb2xkZXIuIFRoaXMgcmVzdHJpY3Rpb24gb25seSBhcHBsaWVzIHRvIHRoZSBwcmltYXJ5IGZvbnQgbmFtZSBhcwpwcmVzZW50ZWQgdG8gdGhlIHVzZXJzLgoKNCkgVGhlIG5hbWUocykgb2YgdGhlIENvcHlyaWdodCBIb2xkZXIocykgb3IgdGhlIEF1dGhvcihzKSBvZiB0aGUgRm9udApTb2Z0d2FyZSBzaGFsbCBub3QgYmUgdXNlZCB0byBwcm9tb3RlLCBlbmRvcnNlIG9yIGFkdmVydGlzZSBhbnkKTW9kaWZpZWQgVmVyc2lvbiwgZXhjZXB0IHRvIGFja25vd2xlZGdlIHRoZSBjb250cmlidXRpb24ocykgb2YgdGhlCkNvcHlyaWdodCBIb2xkZXIocykgYW5kIHRoZSBBdXRob3Iocykgb3Igd2l0aCB0aGVpciBleHBsaWNpdCB3cml0dGVuCnBlcm1pc3Npb24uCgo1KSBUaGUgRm9udCBTb2Z0d2FyZSwgbW9kaWZpZWQgb3IgdW5tb2RpZmllZCwgaW4gcGFydCBvciBpbiB3aG9sZSwKbXVzdCBiZSBkaXN0cmlidXRlZCBlbnRpcmVseSB1bmRlciB0aGlzIGxpY2Vuc2UsIGFuZCBtdXN0IG5vdCBiZQpkaXN0cmlidXRlZCB1bmRlciBhbnkgb3RoZXIgbGljZW5zZS4gVGhlIHJlcXVpcmVtZW50IGZvciBmb250cyB0bwpyZW1haW4gdW5kZXIgdGhpcyBsaWNlbnNlIGRvZXMgbm90IGFwcGx5IHRvIGFueSBkb2N1bWVudCBjcmVhdGVkCnVzaW5nIHRoZSBGb250IFNvZnR3YXJlLgoKVEVSTUlOQVRJT04KVGhpcyBsaWNlbnNlIGJlY29tZXMgbnVsbCBhbmQgdm9pZCBpZiBhbnkgb2YgdGhlIGFib3ZlIGNvbmRpdGlvbnMgYXJlCm5vdCBtZXQuCgpESVNDTEFJTUVSClRIRSBGT05UIFNPRlRXQVJFIElTIFBST1ZJREVEICJBUyBJUyIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsCkVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBBTlkgV0FSUkFOVElFUyBPRgpNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQKT0YgQ09QWVJJR0hULCBQQVRFTlQsIFRSQURFTUFSSywgT1IgT1RIRVIgUklHSFQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRQpDT1BZUklHSFQgSE9MREVSIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwKSU5DTFVESU5HIEFOWSBHRU5FUkFMLCBTUEVDSUFMLCBJTkRJUkVDVCwgSU5DSURFTlRBTCwgT1IgQ09OU0VRVUVOVElBTApEQU1BR0VTLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcKRlJPTSwgT1VUIE9GIFRIRSBVU0UgT1IgSU5BQklMSVRZIFRPIFVTRSBUSEUgRk9OVCBTT0ZUV0FSRSBPUiBGUk9NCk9USEVSIERFQUxJTkdTIElOIFRIRSBGT05UIFNPRlRXQVJFLgAAaAB0AHQAcAA6AC8ALwBzAGMAcgBpAHAAdABzAC4AcwBpAGwALgBvAHIA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AAoADABDAAsARAADAEYAHgBHAAoASAAKAEsAHgBOAAoAUAAKAFEACgBXAAsAWwAUAFwACgAKAEP/4QBE/+IARf/YAEf/2ABJ/9UATf/HAE//xwBQ//YAUv/HAFn/uwAIAET/4wBF/+cAR//iAEn/9gBR/+cAUv/jAFX/7ABa/+sADABD/+UARP/2AE7/5QBQ/+MAUf/nAFT/5QBV/+kAVv/vAFf/5QBY/+UAWf+5AFr/5QABAEwACgABAFf/7wAQAA//YwBDABQARAAKAEYAHwBHAAoASAAUAEkACgBKAAoASwAUAE4ACgBQABQAUQAFAFUAFABXABQAWAAKAFwACgALAEX/6wBH/+sASf/1AE3/5wBQ/+cAUf/sAFf/3wBY/9UAWf/iAFr/6QBc/+cADAARAAoAQwAeAEQACgBGADIASgAUAE8AHgBUAAoAVQAKAFYACgBYAAUAWwAKAFwAFAAPAET/5QBF/+cAR//nAEj/5wBJ//YATf/2AE//5QBR//YAUv/lAFX/6QBW/+cAWf/2AFr/7QBc/+UAtf/sAAQAR//iAEsACgBR//YAWAAKAA4AQ//iAEX/4gBH/8cASf/PAEr/7ABL/+wATv/2AFD/5QBR/8QAVP/FAFX/yQBW//oAV//sAFv/5wACAEf/6QBX/+wACwBD/+cARf/nAEf/5wBN/+wATv/2AFD/5QBR/+cAUv/2AFT/7ABV//YAWf/2AAYAQ//lAEf/5wBK//YATv/lAFb/5QBc/+MAAwBOABQAVgAUAFgAKAABAMP+3QACANH+1wDU/t0AAgAIAAsACwAAACQAKgABACwAMwAIADUAPQAQAEMAXAAZALUAtQAzAMIAwgA0AMQAxAA1AAAAAAABAAAAAMf+sN8AAAAAxz08fgAAAADJI+bo`;

const FONT_STYLE = `
  @font-face {
    font-family: 'OrbitronEmbed';
    src: url('data:font/truetype;base64,${ORBITRON_B64}') format('truetype');
    font-weight: 900;
    font-style: normal;
  }
  .pc-name {
    font-family: 'OrbitronEmbed' !important;
    font-weight: 900 !important;
    font-size: clamp(22px, 4.5vw, 36px) !important;
    letter-spacing: 4px;
    position: relative;
    z-index: 1;
  }
`;

export default function DailyQuest() {
  const [tab, setTab]                   = useState("players");
  const [activePlayer, setActivePlayer] = useState(null);
  const [myPlayer, setMyPlayer] = useState(()=>{ try { return localStorage.getItem("dq_myplayer")||null; } catch(e){ return null; } });
  const [playerOrder, setPlayerOrder] = useState(()=>{
    try {
      const saved = localStorage.getItem("dq_player_order");
      return saved ? JSON.parse(saved) : null;
    } catch(e){ return null; }
  });
  const [dragIdx, setDragIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);
  const longPressTimer = useRef(null);
  const [draggingEnabled, setDraggingEnabled] = useState(false);

  function setMyPlayerAndSave(name) {
    if(myPlayer===name) {
      // Toggle off
      setMyPlayer(null);
      try { localStorage.removeItem("dq_myplayer"); } catch(e){}
    } else {
      setMyPlayer(name);
      try { localStorage.setItem("dq_myplayer", name); } catch(e){}
    }
  }
  const [logs, setLogs]                 = useState(()=>seedData());
  const [loading, setLoading]           = useState(false); // background only
  const [goals, setGoals]               = useState(Object.fromEntries(EXERCISES.map(e=>[e.name,e.goal])));
  const [questInputs, setQuestInputs]   = useState({});
  const [confetti, setConfetti]         = useState(false);
  const [logPlayer, setLogPlayer]       = useState("Rupe");
  const [logEx, setLogEx]               = useState("Push-ups");
  const [logSets, setLogSets]           = useState("");
  const [saveOk, setSaveOk]             = useState(null);
  const today = new Date();
  const isSunday = today.getDay() === 0;
  const [calViewYear, setCalViewYear]   = useState(today.getFullYear());
  const [calViewMonth, setCalViewMonth] = useState(today.getMonth());
  const [boardYear, setBoardYear]       = useState(today.getFullYear());
  const [boardInfo, setBoardInfo]       = useState(null); // {player, exercise, category, curVal, prevVal, cutoffDay, curMonth, prevMonth}
  const [boardMonth, setBoardMonth]     = useState(today.getMonth());
  const [calModal, setCalModal]         = useState(null);
  const [adminModal, setAdminModal]     = useState(null); // null | 'pin' | 'manage'
  const [pinInput, setPinInput]         = useState("");
  const [pinError, setPinError]         = useState(false);
  const [newName, setNewName]           = useState("");
  const [newColor, setNewColor]         = useState("#00e5ff");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [expandedReps, setExpandedReps]   = useState({}); // key: pl.name+ex.name // player name
  const [deleteStep, setDeleteStep]     = useState(0); // 0=off,1=confirm1,2=confirm2,3=pin
  const [deletePinInput, setDeletePinInput] = useState("");
  const [deletePinError, setDeletePinError] = useState(false);
  const ADMIN_PIN = "1996";
  const SHEETS_URL = "https://script.google.com/macros/s/AKfycbw1-Kh3fELae03Y1tPJeWo5g25Dswr18RGsZ05ZSzoOxoZQ0O5V19xb6kdpQmkvoKKpMg/exec";
  const [syncing, setSyncing]           = useState(false);
  const [syncStatus, setSyncStatus]     = useState(null); // null | 'ok' | 'err'
  const sheetLoadedRef = useRef(false);
  const pendingIdsRef = useRef(new Set()); // IDs of logs added locally but not yet confirmed by Sheets
  const [calCustom, setCalCustom]       = useState({}); // {date, player, exercise} or {date} or {date, player}
  const [histFilter, setHistFilter]     = useState({player:"All",exercise:"All"});
  const [statsMode, setStatsMode]       = useState("week");
  const [players, setPlayers]           = useState(DEFAULT_PLAYERS);
  const [newPlayer, setNewPlayer]       = useState("");
  const nextId = useRef(Date.now());
  const countdown = useCountdown();

  // ── Auto-select myPlayer on startup ──
  useEffect(()=>{
    if(myPlayer && !activePlayer) {
      setActivePlayer(myPlayer);
    }
  }, [myPlayer]);

  // ── Load: localStorage first (instant), then sync from Sheets ──
  useEffect(()=>{
    if(sheetLoadedRef.current) return;
    sheetLoadedRef.current = true;

    const parseSheetLogs = (data) => {
      return (data.logs||[]).map(l=>({
        ...l,
        id: l.id,
        sets: (()=>{
          const raw = Array.isArray(l.sets) ? l.sets.join(",") : String(l.sets);
          return raw.split(",").map(s=>Math.round(parseFloat(s.trim().replace(",",".")))).filter(n=>!isNaN(n)&&n>0);
        })(),
        total: Number(l.total),
        date: new Date(l.date),
        ts: new Date(l.date).getTime(),
      })).filter(l=>l.player&&l.exercise);
    };

    const applyLogs = (parsed) => {
      // Merge: keep any locally-added logs that Sheets hasn't confirmed yet
      setLogs(prevLogs => {
        const sheetIds = new Set(parsed.map(l => l.id));
        // Remove from pending once Sheets has them
        for (const id of [...pendingIdsRef.current]) {
          if (sheetIds.has(id)) pendingIdsRef.current.delete(id);
        }
        // Pending = local logs not yet in Sheets response
        const pendingLogs = prevLogs.filter(l => pendingIdsRef.current.has(l.id));
        const merged = [...pendingLogs, ...parsed].sort((a,b)=>b.ts-a.ts);
        try { localStorage.setItem("dq_logs", JSON.stringify(merged.map(l=>({...l, date:l.date.toISOString()})))); } catch(e){}
        return merged;
      });
    };

    // 1. Show localStorage cache instantly
    let hasCached = false;
    try {
      const cached = localStorage.getItem("dq_logs");
      if(cached) {
        const parsed = JSON.parse(cached).map(l=>({...l, date:new Date(l.date), ts:new Date(l.date).getTime()}));
        setLogs(parsed.sort((a,b)=>b.ts-a.ts));
        hasCached = true;
      }
    } catch(e){}

    // 2. Wake up Apps Script immediately with a throwaway prefetch
    //    This starts the cold-start clock before the real fetch below
    fetch(SHEETS_URL, { method:"GET", redirect:"follow" }).catch(()=>{});

    // 3. Real fetch — try fast first (5s timeout), then retry once
    const fetchWithTimeout = (timeout) => {
      const ctrl = new AbortController();
      const tid = setTimeout(()=>ctrl.abort(), timeout);
      return fetch(SHEETS_URL, { redirect:"follow", signal:ctrl.signal })
        .then(r=>{ clearTimeout(tid); if(!r.ok) throw new Error(r.status); return r.json(); });
    };

    fetchWithTimeout(6000)
      .catch(()=> fetchWithTimeout(10000)) // retry once with longer timeout
      .then(data=>{
        applyLogs(parseSheetLogs(data));
        setSyncStatus('ok');
        setTimeout(()=>setSyncStatus(null),2000);
      })
      .catch(err=>{ console.error("Sheets load failed:",err); setSyncStatus('err'); });
  },[]);

  // ── Save logs to localStorage on every change ───────────
  useEffect(()=>{
    if(!logs.length) return;
    try { localStorage.setItem("dq_logs", JSON.stringify(logs.map(l=>({...l, date: l.date instanceof Date ? l.date.toISOString() : l.date})))); } catch(e){}
  },[logs]);

  // ── Push new log to Sheets ─────────────────────────────
  function pushLog(log){
    pendingIdsRef.current.add(log.id);
    fetch(SHEETS_URL, {
      method:"POST", redirect:"follow",
      body: JSON.stringify({ action:"add", log:{
        id: String(log.id),
        player: log.player,
        exercise: log.exercise,
        sets: log.sets,
        total: log.total,
        date: log.date instanceof Date ? log.date.toISOString() : new Date(log.date).toISOString(),
      }})
    }).catch(()=>{});
  }

  // ── Delete log from Sheets ────────────────────────────
  function deleteSheetLog(id){
    fetch(SHEETS_URL, {
      method:"POST", redirect:"follow",
      body: JSON.stringify({ action:"delete", id: String(id) })
    }).catch(()=>{});
  }

  const streaks = useMemo(()=>{
    const res={};
    for(const{name}of players){
      let s=0,d=new Date(today);
      while(logs.some(l=>l.player===name&&sameDay(l.date,d))){s++;d.setDate(d.getDate()-1);}
      res[name]=s;
    }
    return res;
  },[logs,players]);

  function dateTotals(player, date){
    const res={};
    logs.filter(l=>l.player===player&&sameDay(new Date(l.date),date)).forEach(l=>{res[l.exercise]=(res[l.exercise]||0)+l.total;});
    return res;
  }
  function addRepsForDate(player, exercise, reps, date){
    const now = Date.now();
    // Use actual current time for ts so sets are ordered correctly, but keep the date as selected day
    const logDate = new Date(date);
    logDate.setHours(new Date().getHours(), new Date().getMinutes(), new Date().getSeconds());
    const newLog = {id:`log_${nextId.current++}`,player,exercise,sets:[reps],total:reps,date:logDate,ts:now};
    setLogs(p=>[newLog,...p]);
    pushLog(newLog);
  }

  function todayTotals(player){
    const res={};
    logs.filter(l=>l.player===player&&sameDay(l.date,today)).forEach(l=>{res[l.exercise]=(res[l.exercise]||0)+l.total;});
    return res;
  }
  function weekTotal(player){
    const ws=new Date(today);ws.setDate(today.getDate()-6);ws.setHours(0,0,0,0);
    return logs.filter(l=>l.player===player&&l.date>=ws).reduce((s,l)=>s+l.total,0);
  }

  // Get today's sets with log refs for deletion
  function todaySetsList(player, exercise){
    return [...logs]
      .filter(l=>l.player===player&&l.exercise===exercise&&sameDay(l.date,today))
      .sort((a,b)=>(a.ts||0)-(b.ts||0))  // oldest first so set 1 = first logged
      .flatMap(l=>l.sets.map((s,i)=>({value:s,logId:l.id,setIndex:i})));
  }

  function deleteSet(logId, setIndex){
    pendingIdsRef.current.delete(logId);
    setLogs(prev=>prev.flatMap(l=>{
      if(l.id!==logId) return [l];
      const newSets = l.sets.filter((_,i)=>i!==setIndex);
      if(newSets.length===0){ deleteSheetLog(logId); return []; }
      return [{...l, sets:newSets, total:newSets.reduce((a,b)=>a+b,0)}];
    }));
  }

  function addReps(exercise, reps){
    const cur = todaySetsList(activePlayer, exercise).reduce((a,b)=>a+b.value,0);
    const goal = goals[exercise]||100;
    const wasDone = cur >= goal;
    const newLog={id:`log_${nextId.current++}`,player:activePlayer,exercise,sets:[reps],total:reps,date:new Date(),ts:Date.now()};
    setLogs(p=>[newLog,...p]);
    pushLog(newLog);
    if(!wasDone&&(cur+reps)>=goal) setConfetti(true);
  }

  function customAdd(exercise){
    const sets = parseSet(questInputs[exercise]||"");
    if(!sets.length) return;
    const total = sets.reduce((a,b)=>a+b,0);
    const cur = todaySetsList(activePlayer, exercise).reduce((a,b)=>a+b.value,0);
    const goal = goals[exercise]||100;
    const wasDone = cur >= goal;
    const newLog={id:`log_${nextId.current++}`,player:activePlayer,exercise,sets,total,date:new Date(),ts:Date.now()};
    setLogs(p=>[newLog,...p]);
    pushLog(newLog);
    setQuestInputs(p=>({...p,[exercise]:""}));
    if(!wasDone&&(cur+total)>=goal) setConfetti(true);
  }

  function saveLog(){
    const sets=parseSet(logSets);
    if(!sets.length)return;
    const total=sets.reduce((a,b)=>a+b,0);
    const newLog={id:`log_${nextId.current++}`,player:logPlayer,exercise:logEx,sets,total,date:new Date(),ts:Date.now()};
    setLogs(p=>[newLog,...p]);
    pushLog(newLog);
    setSaveOk({total,exercise:logEx});
    setLogSets("");
    setTimeout(()=>setSaveOk(null),2600);
  }

  const allExercises = useMemo(()=>[...new Set([...EXERCISES.map(e=>e.name),...logs.map(l=>l.exercise)])],[logs]);
  const filteredLogs = useMemo(()=>logs.filter(l=>{
    if(histFilter.player!=="All"&&l.player!==histFilter.player)return false;
    if(histFilter.exercise!=="All"&&l.exercise!==histFilter.exercise)return false;
    return true;
  }),[logs,histFilter]);

  const weekStart  = useMemo(()=>{const d=new Date(today);d.setDate(d.getDate()-6);d.setHours(0,0,0,0);return d;},[]);
  const monthStart = useMemo(()=>new Date(today.getFullYear(),today.getMonth(),1),[]);

  const exStats = useMemo(()=>{
    const bound=statsMode==="week"?weekStart:monthStart;
    const res={};
    for(const ex of allExercises){
      res[ex]={};
      for(const{name}of players) res[ex][name]=logs.filter(l=>l.exercise===ex&&l.player===name&&l.date>=bound).reduce((s,l)=>s+l.total,0);
    }
    return res;
  },[logs,allExercises,players,statsMode,weekStart,monthStart]);

  const leaderboard = useMemo(()=>[...players].map(p=>({...p,wt:weekTotal(p.name)})).sort((a,b)=>b.wt-a.wt),[logs,players]);
  const acPlayer = activePlayer ? players.find(p=>p.name===activePlayer) : null;

  function goQuests(playerName){
    setActivePlayer(playerName);
    setTab("quests");
  }

  return (
    <>
      <style>{STYLE}</style>
      <style>{FONT_STYLE}</style>
      {confetti && <Confetti onDone={()=>setConfetti(false)}/>}
      <div className="app">

        {/* ── PLAYERS ── */}
        {tab==="players" && (
          <div className="players-view fade-up">
            <div className="date-badge">{fmtDate(today)}</div>
            <div className="main-title">DAILY QUEST</div>

            {isSunday ? (
              <div className="sunday-view">
                <div className="sunday-icon">🌟</div>
                <div className="sunday-title">YOU MADE IT!</div>
                <div className="sunday-sub">Congratulations — you survived the week. Today is your well-deserved rest day. No quests today. Enjoy it.</div>
              </div>
            ) : (<>
            <div className="countdown-wrap">
              <div className="countdown-line"/>
              <div className="countdown">{countdown}</div>
              <div className="countdown-line r"/>
            </div>
            <div className="countdown-label">Time remaining to complete the quests</div>
            <button style={{
              marginBottom:16, background:"rgba(0,229,255,0.08)", border:"1.5px solid rgba(0,229,255,0.35)",
              borderRadius:10, color:"var(--cyan)", fontFamily:"'OrbitronEmbed',var(--font-d)", fontSize:11,
              fontWeight:900, letterSpacing:2, padding:"9px 20px", cursor:"pointer"
            }} onClick={()=>{setPinInput("");setPinError(false);setAdminModal("pin");}}>+ MANAGE PLAYERS</button>

            <div className="player-grid">
              {(()=>{
                // Apply saved order
                const orderedNames = playerOrder || players.map(p=>p.name);
                const orderedPlayers = orderedNames
                  .map(n=>players.find(p=>p.name===n))
                  .filter(Boolean);
                // Add any new players not in order
                players.forEach(p=>{ if(!orderedPlayers.find(op=>op.name===p.name)) orderedPlayers.push(p); });
                return orderedPlayers;
              })().map((pl, idx)=>{
                const tt=todayTotals(pl.name);
                const questsDone=EXERCISES.filter(ex=>(tt[ex.name]||0)>=(goals[ex.name]||ex.goal)).length;
                return (
                  <div key={pl.name}
                    className={`pc${questsDone===EXERCISES.length?" all-done":""}${dragIdx===idx?" dragging":""}${dragOverIdx===idx?" drag-over":""}`}
                    style={{"--pc":pl.color,"--pc-dim":pl.dim,"--pc-glow":pl.glow,"--pc-glow2":pl.glow2,
                      opacity: dragIdx===idx ? 0.4 : 1,
                      transition: "opacity 0.15s, transform 0.15s",
                      transform: dragOverIdx===idx && dragIdx!==idx ? "scale(1.03)" : "scale(1)",
                      cursor: dragIdx!==null ? "grabbing" : "pointer"
                    }}
                    draggable={true}
                    onDragStart={()=>setDragIdx(idx)}
                    onDragEnter={()=>setDragOverIdx(idx)}
                    onDragOver={e=>e.preventDefault()}
                    onDragEnd={()=>{
                      if(dragIdx!==null && dragOverIdx!==null && dragIdx!==dragOverIdx){
                        const orderedNames = playerOrder || players.map(p=>p.name);
                        const orderedPlayers = orderedNames.map(n=>players.find(p=>p.name===n)).filter(Boolean);
                        players.forEach(p=>{ if(!orderedPlayers.find(op=>op.name===p.name)) orderedPlayers.push(p); });
                        const newOrder = [...orderedPlayers];
                        const [moved] = newOrder.splice(dragIdx, 1);
                        newOrder.splice(dragOverIdx, 0, moved);
                        const newOrderNames = newOrder.map(p=>p.name);
                        setPlayerOrder(newOrderNames);
                        try { localStorage.setItem("dq_player_order", JSON.stringify(newOrderNames)); } catch(e){}
                      }
                      setDragIdx(null);
                      setDragOverIdx(null);
                    }}
                    onClick={()=>{ if(dragIdx===null && !isSunday) goQuests(pl.name); }}>
                    <div className="pc-name" style={{textAlign:"center"}}>{pl.name}</div>
                    <div className={`pc-sub${questsDone>0?" has-progress":""}`}>
                      {questsDone}/{EXERCISES.length} quests completed
                    </div>
                    <div className="pc-bars">
                      {EXERCISES.map(ex=>{
                        const cur=tt[ex.name]||0;
                        const goal=goals[ex.name]||ex.goal;
                        const pct=Math.min(100,(cur/goal)*100);
                        return (
                          <div key={ex.name} className="pc-bar-row">
                            <div className="pc-bar-lbl">{ex.name.toUpperCase()}</div>
                            <div className="pc-bar-track"><div className="pc-bar-fill" style={{width:`${pct}%`}}/></div>
                            <div className="pc-bar-count">{cur}/{goal}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            </>)}
          </div>
        )}

        {/* ── ADMIN MODAL ── */}
        {adminModal==="pin" && (
          <div className="admin-overlay" onClick={()=>setAdminModal(null)}>
            <div className="admin-modal" onClick={e=>e.stopPropagation()}>
              <div className="admin-title">ADMIN ACCESS</div>
              <div className="admin-pin-row">
                <input className={`admin-pin-inp${pinError?" error":""}`} type="password"
                  placeholder="····" maxLength={6} value={pinInput}
                  onChange={e=>{setPinInput(e.target.value);setPinError(false);}}
                  onKeyDown={e=>{ if(e.key==="Enter"){ if(pinInput===ADMIN_PIN){setAdminModal("manage");setPinError(false);}else setPinError(true); }}}/>
                <button className="admin-pin-submit" onClick={()=>{ if(pinInput===ADMIN_PIN){setAdminModal("manage");setPinError(false);}else setPinError(true); }}>OK</button>
              </div>
              {pinError && <div className="admin-error">Wrong PIN</div>}
              <button className="admin-cancel" onClick={()=>setAdminModal(null)}>CANCEL</button>
            </div>
          </div>
        )}

        {adminModal==="manage" && (()=>{
          const PRESETS=["#ffe600","#ff2d55","#ff9500","#4dff91","#00e5ff","#c77dff","#ff6b6b","#00b4d8","#f72585","#ffffff"];
          return (
            <div className="admin-overlay" onClick={()=>setAdminModal(null)}>
              <div className="admin-modal" onClick={e=>e.stopPropagation()} style={{maxHeight:"80vh",overflowY:"auto"}}>
                <div className="admin-title">MANAGE PLAYERS</div>
                <div className="admin-player-list">
                  {players.map(pl=>(
                    <div key={pl.name} className="admin-player-row">
                      <div className="admin-player-name" style={{color:pl.color}}>{pl.name}</div>
                      <button className="admin-del-btn" onClick={()=>{
                          const hasData = logs.some(l=>l.player===pl.name);
                          setDeleteTarget(pl.name);
                          setDeleteStep(hasData ? 1 : 1); // always confirm step 1
                        }}>Remove</button>
                    </div>
                  ))}
                </div>
                <div className="admin-add-section">
                  <div className="admin-add-title">ADD NEW PLAYER</div>
                  <input className="admin-inp" placeholder="Player name" value={newName} onChange={e=>setNewName(e.target.value)}/>
                  <div className="admin-color-label">CHOOSE COLOR</div>
                  <div className="admin-color-presets">
                    {PRESETS.map(c=>(
                      <div key={c} className={`admin-color-dot${newColor===c?" sel":""}`}
                        style={{background:c}} onClick={()=>setNewColor(c)}/>
                    ))}
                  </div>
                  <div className="admin-color-custom">
                    <div className="admin-color-custom-label">Custom:</div>
                    <input type="color" className="admin-color-inp" value={newColor} onChange={e=>setNewColor(e.target.value)}/>
                    <div className="admin-color-preview" style={{background:newColor}}/>
                    <div style={{fontFamily:"'OrbitronEmbed',var(--font-d)",fontSize:11,color:"rgba(255,255,255,0.6)",letterSpacing:1}}>{newColor.toUpperCase()}</div>
                  </div>
                  <button className="admin-add-btn" onClick={()=>{
                    const name=newName.trim();
                    if(!name||players.find(p=>p.name===name)) return;
                    const hex=newColor;
                    const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
                    setPlayers(p=>[...p,{name,color:hex,dim:`rgba(${r},${g},${b},0.08)`,glow:`rgba(${r},${g},${b},0.5)`,glow2:`rgba(${r},${g},${b},0.15)`,border:`rgba(${r},${g},${b},0.3)`}]);
                    setNewName("");
                  }}>+ ADD PLAYER</button>
                </div>
                <button className="admin-cancel" onClick={()=>setAdminModal(null)}>CLOSE</button>

              {/* DELETE STEP 1 — first confirm */}
              {deleteStep===1 && deleteTarget && (
                <div className="admin-overlay" style={{zIndex:400}} onClick={()=>setDeleteStep(0)}>
                  <div className="admin-modal" onClick={e=>e.stopPropagation()}>
                    <div className="admin-title" style={{color:"#ff2d55"}}>REMOVE PLAYER?</div>
                    <div style={{textAlign:"center",color:"rgba(255,255,255,0.7)",fontFamily:"var(--font-b)",fontSize:14,marginBottom:20}}>
                      Do you want to remove <span style={{color:"#ff2d55",fontWeight:700}}>{deleteTarget}</span>?
                      {logs.some(l=>l.player===deleteTarget) && <div style={{marginTop:8,fontSize:12,color:"rgba(255,100,100,0.7)"}}>This player has recorded data.</div>}
                    </div>
                    <div style={{display:"flex",gap:10}}>
                      <button className="admin-cancel" style={{flex:1,marginTop:0}} onClick={()=>setDeleteStep(0)}>NO, CANCEL</button>
                      <button className="admin-add-btn" style={{flex:1,background:"rgba(255,45,85,0.12)",borderColor:"rgba(255,45,85,0.5)",color:"#ff2d55"}}
                        onClick={()=>{ const hasData=logs.some(l=>l.player===deleteTarget); setDeleteStep(hasData?2:4); }}>YES, REMOVE</button>
                    </div>
                  </div>
                </div>
              )}

              {/* DELETE STEP 2 — second confirm (only if has data) */}
              {deleteStep===2 && deleteTarget && (
                <div className="admin-overlay" style={{zIndex:400}} onClick={()=>setDeleteStep(0)}>
                  <div className="admin-modal" onClick={e=>e.stopPropagation()}>
                    <div className="admin-title" style={{color:"#ff2d55"}}>ARE YOU SURE?</div>
                    <div style={{textAlign:"center",color:"rgba(255,255,255,0.7)",fontFamily:"var(--font-b)",fontSize:14,marginBottom:20}}>
                      All data for <span style={{color:"#ff2d55",fontWeight:700}}>{deleteTarget}</span> will be permanently deleted. This cannot be undone.
                    </div>
                    <div style={{display:"flex",gap:10}}>
                      <button className="admin-cancel" style={{flex:1,marginTop:0}} onClick={()=>setDeleteStep(0)}>NO, CANCEL</button>
                      <button className="admin-add-btn" style={{flex:1,background:"rgba(255,45,85,0.12)",borderColor:"rgba(255,45,85,0.5)",color:"#ff2d55"}}
                        onClick={()=>{ setDeletePinInput(""); setDeletePinError(false); setDeleteStep(3); }}>YES, CONTINUE</button>
                    </div>
                  </div>
                </div>
              )}

              {/* DELETE STEP 3 — PIN confirm (only if has data) */}
              {deleteStep===3 && deleteTarget && (
                <div className="admin-overlay" style={{zIndex:400}} onClick={()=>setDeleteStep(0)}>
                  <div className="admin-modal" onClick={e=>e.stopPropagation()}>
                    <div className="admin-title" style={{color:"#ff2d55"}}>CONFIRM PIN</div>
                    <div style={{textAlign:"center",color:"rgba(255,255,255,0.5)",fontFamily:"var(--font-b)",fontSize:13,marginBottom:14}}>Enter admin PIN to delete {deleteTarget}</div>
                    <div className="admin-pin-row">
                      <input className={`admin-pin-inp${deletePinError?" error":""}`} type="password"
                        placeholder="····" maxLength={6} value={deletePinInput}
                        onChange={e=>{setDeletePinInput(e.target.value);setDeletePinError(false);}}
                        onKeyDown={e=>{ if(e.key==="Enter"){ if(deletePinInput===ADMIN_PIN){setPlayers(p=>p.filter(x=>x.name!==deleteTarget));setDeleteStep(0);setDeleteTarget(null);}else setDeletePinError(true); }}}/>
                      <button className="admin-pin-submit" style={{background:"rgba(255,45,85,0.12)",borderColor:"rgba(255,45,85,0.4)",color:"#ff2d55"}}
                        onClick={()=>{ if(deletePinInput===ADMIN_PIN){setPlayers(p=>p.filter(x=>x.name!==deleteTarget));setDeleteStep(0);setDeleteTarget(null);}else setDeletePinError(true); }}>OK</button>
                    </div>
                    {deletePinError && <div className="admin-error">Wrong PIN</div>}
                    <button className="admin-cancel" onClick={()=>setDeleteStep(0)}>CANCEL</button>
                  </div>
                </div>
              )}

              {/* DELETE STEP 4 — simple confirm (no data) */}
              {deleteStep===4 && deleteTarget && (
                <div className="admin-overlay" style={{zIndex:400}} onClick={()=>setDeleteStep(0)}>
                  <div className="admin-modal" onClick={e=>e.stopPropagation()}>
                    <div className="admin-title" style={{color:"#ff2d55"}}>REMOVE PLAYER</div>
                    <div style={{textAlign:"center",color:"rgba(255,255,255,0.7)",fontFamily:"var(--font-b)",fontSize:14,marginBottom:20}}>
                      Remove <span style={{color:"#ff2d55",fontWeight:700}}>{deleteTarget}</span>?
                    </div>
                    <div style={{display:"flex",gap:10}}>
                      <button className="admin-cancel" style={{flex:1,marginTop:0}} onClick={()=>setDeleteStep(0)}>NO</button>
                      <button className="admin-add-btn" style={{flex:1,background:"rgba(255,45,85,0.12)",borderColor:"rgba(255,45,85,0.5)",color:"#ff2d55"}}
                        onClick={()=>{setPlayers(p=>p.filter(x=>x.name!==deleteTarget));setDeleteStep(0);setDeleteTarget(null);}}>YES, REMOVE</button>
                    </div>
                  </div>
                </div>
              )}
              </div>
            </div>
          );
        })()}

        {/* ── QUESTS ── */}
        {tab==="quests" && (
          <div className="quests-view fade-up">
            {!activePlayer ? (
              <div style={{textAlign:"center",paddingTop:40}}>
                <div style={{fontFamily:"var(--font-d)",fontSize:13,color:"var(--muted)",letterSpacing:3,marginBottom:20}}>SELECT PLAYER</div>
                <div style={{display:"flex",gap:12,flexWrap:"wrap",justifyContent:"center"}}>
                  {players.map(pl=>(
                    <button key={pl.name} onClick={()=>setActivePlayer(pl.name)}
                      style={{padding:"14px 28px",borderRadius:12,border:`2px solid ${pl.color}`,background:"transparent",color:pl.color,fontFamily:"var(--font-d)",fontSize:14,fontWeight:700,letterSpacing:2,cursor:"pointer",boxShadow:`0 0 16px ${pl.glow}`}}>
                      {pl.name.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            ) : acPlayer && (
              <>
                {/* Player header */}
                <div style={{textAlign:"center",marginBottom:28}}>
                  <div style={{fontFamily:"'OrbitronEmbed', var(--font-d)",fontSize:'clamp(24px,6vw,42px)',fontWeight:900,color:acPlayer.color,textShadow:`0 0 24px ${acPlayer.glow}`,letterSpacing:3,marginBottom:4}}>
                    {activePlayer}
                  </div>
                  <div style={{fontFamily:"var(--font-d)",fontSize:11,color:"var(--muted)",letterSpacing:4,marginBottom:14}}>QUESTS</div>
                  <button className="back-btn" onClick={()=>setTab("players")}>‹ Back to Players</button>
                </div>

                {EXERCISES.map(ex=>{
                  const setsList = todaySetsList(activePlayer, ex.name);
                  const cur = setsList.reduce((a,b)=>a+b.value,0);
                  const goal = goals[ex.name]||ex.goal;
                  const done = cur >= goal;
                  const pct = Math.min(100,(cur/goal)*100);

                  return (
                    <div key={ex.name} className={`ex-card${done?" done":""}`}
                      style={{"--ac":acPlayer.color,"--ac-glow":acPlayer.glow}}>

                      <div className="ex-card-top"><div className="ex-card-title">{ex.name}</div>{done && <div className="ex-done-label">✓ DONE</div>}</div>

                      {/* Counter */}
                      <div className="ex-counter-row">
                        <div className={`ex-counter-cur${done?" done":""}`}>{cur}</div>
                        <div className="ex-counter-goal">/{goal}</div>
                      </div>

                      {/* Progress tracks */}
                      <div className="ex-tracks">
                        <div className="ex-track"><div className={`ex-track-fill${done?" done":""}`} style={{width:`${pct}%`}}/></div>
                        <div className="ex-track ex-track2"><div className={`ex-track-fill${done?" done":""}`} style={{width:`${pct}%`}}/></div>
                      </div>

                      {/* Sets list */}
                      {setsList.length > 0 && (
                        <div className="ex-sets-list">
                          {setsList.map((s,i)=>(
                            <div key={i} className="ex-set-row">
                              <span className="ex-set-lbl">{i+1} set:</span>
                              <span className={`ex-set-val${done?" done-color":""}`}>{s.value}</span>
                              <button className="ex-set-delete" onClick={()=>deleteSet(s.logId,s.setIndex)}>Delete</button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Quick-add buttons */}
                      <div className="quick-grid">
                        {QUICK_ADDS.map(n=>(
                          <button key={n} className="quick-btn" onClick={()=>addReps(ex.name,n)}>+{n}</button>
                        ))}
                      </div>

                      {/* Custom */}
                      <div className="custom-row">
                        <input className="custom-inp" placeholder="Custom"
                          type="number"
                          value={questInputs[ex.name]||""}
                          onChange={e=>setQuestInputs(p=>({...p,[ex.name]:e.target.value}))}
                          onKeyDown={e=>e.key==="Enter"&&customAdd(ex.name)}/>
                        <button className="custom-add-btn" onClick={()=>customAdd(ex.name)}>Add</button>
                      </div>

                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}

        {/* ── LOG ── */}
        {tab==="log" && (() => {
          const yr = calViewYear, mo = calViewMonth;
          const monthLabel = new Date(yr, mo, 1).toLocaleDateString("en-US",{month:"long",year:"numeric"});
          const firstDow = new Date(yr, mo, 1).getDay();
          const offset = firstDow === 0 ? 6 : firstDow - 1;
          const dim = new Date(yr, mo+1, 0).getDate();
          const cells = [...Array(offset).fill(null), ...Array.from({length:dim},(_,i)=>i+1)];
          const WDS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
          const openDay = (d) => setCalModal({date: new Date(yr, mo, d)});

          return (
            <div className="cal-view fade-up">
              <div className="cal-nav">
                <button className="cal-nav-btn" onClick={()=>{
                  if(mo===0){setCalViewMonth(11);setCalViewYear(yr-1);}
                  else setCalViewMonth(mo-1);
                }}>← PREV</button>
                <div className="cal-month">{monthLabel}</div>
                <button className="cal-nav-btn" onClick={()=>{
                  if(mo===11){setCalViewMonth(0);setCalViewYear(yr+1);}
                  else setCalViewMonth(mo+1);
                }}>NEXT →</button>
              </div>

              <div className="cal-weekdays">
                {WDS.map(w=><div key={w} className={`cal-wd${w==="Sun"?" sun":""}`}>{w}</div>)}
              </div>

              <div className="cal-grid">
                {cells.map((day,i)=>{
                  if(!day) return <div key={"e"+i} className="cal-cell empty"/>;
                  const cd = new Date(yr, mo, day);
                  const isSun = cd.getDay()===0;
                  const isTod = sameDay(cd, today);

                  // For each player, count exercises where goal is met, and if 2x goal
                  const playerChecks = players.map(pl=>{
                    const dayLogs = logs.filter(l=>l.player===pl.name && sameDay(new Date(l.date), cd));
                    const checks = EXERCISES.map(ex=>{
                      const total = dayLogs.filter(l=>l.exercise===ex.name).reduce((s,l)=>s+l.total,0);
                      const goal = goals[ex.name]||ex.goal;
                      if(total < goal) return null;
                      return { double: total >= goal*2 };
                    }).filter(Boolean);
                    return {pl, checks};
                  }).filter(x=>x.checks.length>0);

                  return (
                    <div key={day} className={`cal-cell${isSun?" sun":""}${isTod?" today":""}`} style={{cursor:isSun?"default":"pointer"}} onClick={()=>{ if(!isSun) openDay(day); }}>
                      <div className="cal-day">{day}</div>
                      {playerChecks.length>0 && (
                        <div className="cal-checks">
                          {playerChecks.map(({pl,checks})=>(
                            <div key={pl.name} className="cal-check-row">
                              {checks.map((c,ci)=>(
                                <span key={ci} className={`cal-check${c.double?" double":""}`} style={{color:pl.color}}>✓</span>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* ── TOTALS ── */}
        {tab==="totals" && (
          <div className="totals-view fade-up">
            <div className="totals-title">TOTALS</div>
            {EXERCISES.map(ex=>{
              // Calories per rep (average 75kg person)
              const KCAL_PER_REP = {
                "Push-ups": 0.32,  // ~0.32 kcal per rep
                "Squats":   0.32,  // ~0.32 kcal per rep
                "Pull-ups": 0.90,  // ~0.90 kcal per rep
                "Sit-ups":  0.15,  // ~0.15 kcal per rep
              }[ex.name] || 0.30;

              return (
                <div key={ex.name} className="totals-ex-block">
                  <div className="totals-ex-name">{ex.name}</div>
                  {players.map(pl=>{
                    const plLogs = logs.filter(l=>l.player===pl.name && l.exercise===ex.name);
                    const totalReps = plLogs.reduce((s,l)=>s+l.total,0);
                    const daysDone = new Set(plLogs.map(l=>new Date(l.date).toDateString())).size;
                    let bestSet = 0, bestSetDate = null;
                    plLogs.forEach(l=>{ l.sets.forEach(s=>{ if(s>bestSet){bestSet=s;bestSetDate=new Date(l.date);} }); });
                    const bestDateStr = bestSetDate ? bestSetDate.toLocaleDateString("en-US",{month:"short",day:"numeric"}) : null;
                    const totalKcal = Math.round(totalReps * KCAL_PER_REP);
                    const kcalDisplay = totalKcal >= 1000 ? `${(totalKcal/1000).toFixed(1)}k` : totalKcal;
                    return (
                      <div key={pl.name} className="totals-player-card" style={{borderColor:pl.color,background:`${pl.color}08`}}>
                        <div className="totals-player-name" style={{color:pl.color,textShadow:`0 0 12px ${pl.glow}`}}>{pl.name}</div>
                        <div className="totals-stats-row has-everest">
                          <div className="totals-stat">
                            <div className="totals-stat-lbl">Total Reps</div>
                            {(()=>{
                              const key = pl.name+ex.name;
                              const expanded = expandedReps[key];
                              const display = (!expanded && totalReps>=100000)
                                ? (totalReps>=1000000
                                    ? `${(totalReps/1000000).toFixed(1)}M`
                                    : `${(totalReps/1000).toFixed(0)}k`)
                                : (totalReps||0).toLocaleString();
                              return (
                                <div className="totals-stat-val"
                                  style={{color:pl.color,textShadow:`0 0 10px ${pl.glow}`,cursor:totalReps>=100000?"pointer":"default"}}
                                  onClick={()=>{ if(totalReps>=100000) setExpandedReps(p=>({...p,[key]:!p[key]})); }}>
                                  {display}
                                </div>
                              );
                            })()}
                          </div>
                          <div className="totals-stat">
                            <div className="totals-stat-lbl">Days Done</div>
                            <div className="totals-stat-val" style={{color:pl.color,textShadow:`0 0 10px ${pl.glow}`}}>{daysDone}</div>
                          </div>
                          <div className="totals-stat">
                            <div className="totals-stat-lbl">Best Set</div>
                            <div className="totals-stat-val" style={{color:pl.color,textShadow:`0 0 10px ${pl.glow}`}}>{Math.round(bestSet)||0}</div>
                            {bestDateStr && <div className="totals-stat-date">{bestDateStr}</div>}
                          </div>
                          <div className="totals-stat">
                            <div className="totals-stat-lbl">🔥 Kcal</div>
                            <div className="totals-stat-val" style={{color:pl.color,textShadow:`0 0 10px ${pl.glow}`}}>{kcalDisplay||0}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}


                </div>
              );
            })}
          </div>
        )}

        {/* ── BOARD ── */}
        {tab==="board" && (()=>{
          const yr = boardYear, mo = boardMonth;
          const monthLabel = new Date(yr, mo, 1).toLocaleDateString("en-US",{month:"long",year:"numeric"});
          const msStart = new Date(yr, mo, 1).getTime();
          const msEnd   = new Date(yr, mo+1, 0, 23, 59, 59).getTime();
          const monthLogs = logs.filter(l=>{ const t=new Date(l.date).getTime(); return t>=msStart&&t<=msEnd; });

          // Previous month data — only up to same day-of-month as today (fair comparison)
          const isCurrentMonth = yr===today.getFullYear() && mo===today.getMonth();
          const cutoffDay = isCurrentMonth ? today.getDate() : new Date(yr, mo+1, 0).getDate(); // if viewing past month, use full month
          const prevMo = mo===0 ? 11 : mo-1;
          const prevYr = mo===0 ? yr-1 : yr;
          const prevStart = new Date(prevYr, prevMo, 1).getTime();
          const prevCutoff = new Date(prevYr, prevMo, cutoffDay, 23, 59, 59).getTime();
          const prevLogs  = logs.filter(l=>{ const t=new Date(l.date).getTime(); return t>=prevStart&&t<=prevCutoff; });

          // Also limit current month to same cutoff day
          const curCutoff = new Date(yr, mo, cutoffDay, 23, 59, 59).getTime();
          const curMonthLogs = monthLogs.filter(l=>new Date(l.date).getTime()<=curCutoff);

          const compLabel = isCurrentMonth
            ? `vs prev month day 1–${cutoffDay}`
            : `full month comparison`;

          function getTrend(curVal, prevVal) {
            if(prevVal===0 && curVal===0) return null;
            const diff = Math.round((curVal - prevVal)*10)/10;
            if(diff===0) return { arrow:"→", label:"=", cls:"trend-same" };
            const label = Number.isInteger(diff) ? (diff>0?`+${diff}`:`${diff}`) : (diff>0?`+${diff.toFixed(1)}`:`${diff.toFixed(1)}`);
            if(diff>0)   return { arrow:"↑", label, cls:"trend-up" };
            return       { arrow:"↓", label, cls:"trend-down" };
          }

          // Sort players: by total desc, ties broken by who led first historically
          function rankPlayers(metric) {
            return [...players].map(pl=>({ pl, val: metric(pl.name, monthLogs) }))
              .sort((a,b)=>{
                if(b.val !== a.val) return b.val - a.val;
                // Tiebreak: who accumulated the score first
                const aFirst = monthLogs.filter(l=>l.player===a.pl.name).sort((x,y)=>new Date(x.date)-new Date(y.date))[0];
                const bFirst = monthLogs.filter(l=>l.player===b.pl.name).sort((x,y)=>new Date(x.date)-new Date(y.date))[0];
                if(!aFirst && !bFirst) return 0;
                if(!aFirst) return 1;
                if(!bFirst) return -1;
                return new Date(aFirst.date) - new Date(bFirst.date);
              });
          }

          const categories = [
            { key:"totalReps",    label:"TOTAL REPS",       metric:(name,ml)=>ml.filter(l=>l.player===name).reduce((s,l)=>s+l.total,0) },
            { key:"daysCompleted",label:"DAYS COMPLETED",   metric:(name,ml)=>{
              const exGoals = EXERCISES.map(ex=>({name:ex.name,goal:goals[ex.name]||ex.goal}));
              const days = new Set(ml.filter(l=>l.player===name).map(l=>new Date(l.date).toDateString()));
              let count=0;
              days.forEach(ds=>{
                const dayLogs=ml.filter(l=>l.player===name&&new Date(l.date).toDateString()===ds);
                const allDone=exGoals.every(ex=>dayLogs.filter(l=>l.exercise===ex.name).reduce((s,l)=>s+l.total,0)>=ex.goal);
                if(allDone) count++;
              });
              return count;
            }},

          ];

          return (
            <div className="board-view fade-up">
              <div className="board-title">MONTHLY LEADERBOARDS</div>
              <div className="board-nav">
                <button className="board-nav-btn" onClick={()=>{ if(mo===0){setBoardMonth(11);setBoardYear(yr-1);}else setBoardMonth(mo-1); }}>← PREV</button>
                <div className="board-month">{monthLabel}</div>
                <button className="board-nav-btn" onClick={()=>{ if(mo===11){setBoardMonth(0);setBoardYear(yr+1);}else setBoardMonth(mo+1); }}>NEXT →</button>
              </div>

              {EXERCISES.map(ex=>(
                <div key={ex.name} className="board-ex-block">
                  <div className="board-ex-name">{ex.name}</div>
                  {categories.map(cat=>{
                    const ranked = rankPlayers((name,ml)=>{
                      if(cat.key==="totalReps") return ml.filter(l=>l.player===name&&l.exercise===ex.name).reduce((s,l)=>s+l.total,0);
                      // daysCompleted: days where this exercise met goal
                      const goal = goals[ex.name]||ex.goal;
                      const days = new Set(ml.filter(l=>l.player===name&&l.exercise===ex.name).map(l=>new Date(l.date).toDateString()));
                      let count=0;
                      days.forEach(ds=>{
                        const tot=ml.filter(l=>l.player===name&&l.exercise===ex.name&&new Date(l.date).toDateString()===ds).reduce((s,l)=>s+l.total,0);
                        if(tot>=goal) count++;
                      });
                      return count;
                    });
                    return (
                      <div key={cat.key} className="board-category">
                        <div className="board-cat-title">{cat.label}</div>
                        {ranked.map(({pl,val},ri)=>{
                          // Get prev month value for same metric
                          // Use cutoff-limited logs for fair comparison
                          const logsForTrend = isCurrentMonth ? curMonthLogs : monthLogs;
                          function calcMetric(logs2, key) {
                            if(key==="totalReps") return logs2.filter(l=>l.player===pl.name&&l.exercise===ex.name).reduce((s,l)=>s+l.total,0);
                            if(key==="avgSet") {
                              const allSets=logs2.filter(l=>l.player===pl.name&&l.exercise===ex.name).flatMap(l=>l.sets).filter(s=>s>0);
                              if(!allSets.length) return 0;
                              return Math.round((allSets.reduce((a,b)=>a+b,0)/allSets.length)*10)/10;
                            }
                            const goal=goals[ex.name]||ex.goal;
                            const days=new Set(logs2.filter(l=>l.player===pl.name&&l.exercise===ex.name).map(l=>new Date(l.date).toDateString()));
                            let c=0;
                            days.forEach(ds=>{
                              const tot=logs2.filter(l=>l.player===pl.name&&l.exercise===ex.name&&new Date(l.date).toDateString()===ds).reduce((s,l)=>s+l.total,0);
                              if(tot>=goal) c++;
                            });
                            return c;
                          }
                          const curVal2 = calcMetric(logsForTrend, cat.key);
                          const prevVal = calcMetric(prevLogs, cat.key);
                          const trend = getTrend(curVal2, prevVal);
                          // Avg set for this player/exercise
                          const avgSets = logsForTrend.filter(l=>l.player===pl.name&&l.exercise===ex.name).flatMap(l=>l.sets).filter(s=>s>0);
                          const avgSet = avgSets.length ? Math.round((avgSets.reduce((a,b)=>a+b,0)/avgSets.length)*10)/10 : 0;
                          const prevAvgSets = prevLogs.filter(l=>l.player===pl.name&&l.exercise===ex.name).flatMap(l=>l.sets).filter(s=>s>0);
                          const prevAvgSet = prevAvgSets.length ? Math.round((prevAvgSets.reduce((a,b)=>a+b,0)/prevAvgSets.length)*10)/10 : 0;
                          const avgTrend = getTrend(avgSet, prevAvgSet);
                          return (
                            <div key={pl.name} className="board-row" style={{display:"flex",alignItems:"flex-start",gap:0,padding:"10px 0"}}>
                              {/* Left: rank + name — aligned to top of numbers */}
                              <div style={{display:"flex",alignItems:"center",gap:6,flex:"0 0 38%",minWidth:0,paddingTop:2}}>
                                <span style={{fontFamily:"'OrbitronEmbed',var(--font-d)",fontSize:12,fontWeight:900,color:"rgba(255,255,255,0.85)",flexShrink:0}}>{ri+1}.</span>
                                <div className="board-row-name" style={{color:pl.color,textShadow:`0 0 8px ${pl.glow}`,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",lineHeight:1}}>{pl.name}</div>
                              </div>
                              {/* Center: total reps + trend — fixed width, centered */}
                              <div style={{flex:"0 0 31%",display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                                {val>0
                                  ? <div className="board-row-val"
                                      style={{color:pl.color,textShadow:`0 0 8px ${pl.glow}`,cursor:"pointer",transition:"all 0.15s",lineHeight:1}}
                                      onMouseEnter={e=>{ e.currentTarget.style.textShadow=`0 0 20px ${pl.color}`; e.currentTarget.style.transform="scale(1.15)"; e.currentTarget.style.display="inline-block"; }}
                                      onMouseLeave={e=>{ e.currentTarget.style.textShadow=`0 0 8px ${pl.glow}`; e.currentTarget.style.transform="scale(1)"; }}
                                      onClick={()=>setBoardInfo({player:pl, exercise:ex.name, category:cat.label, curVal:val, prevVal, cutoffDay, curMonth:mo, curYear:yr, prevMonth:prevMo, prevYear:prevYr})}>
                                      {val.toLocaleString()}
                                    </div>
                                  : <div className="board-row-empty">—</div>}
                                {trend && val>0 && <div className={trend.cls} style={{fontSize:10,lineHeight:1}}>{trend.arrow} {trend.label}</div>}
                              </div>
                              {/* Right: avg set + trend — fixed width, right-aligned */}
                              {cat.key==="totalReps" ? (
                                <div style={{flex:"0 0 31%",display:"flex",flexDirection:"column",alignItems:"flex-end",gap:2}}>
                                  {avgSet>0 ? <>
                                    <div
                                      style={{fontFamily:"'OrbitronEmbed',var(--font-d)",fontSize:22,fontWeight:900,color:pl.color,textShadow:`0 0 8px ${pl.glow}`,cursor:"pointer",transition:"all 0.15s",lineHeight:1}}
                                      onMouseEnter={e=>{ e.currentTarget.style.textShadow=`0 0 20px ${pl.color}`; e.currentTarget.style.transform="scale(1.15)"; e.currentTarget.style.display="inline-block"; }}
                                      onMouseLeave={e=>{ e.currentTarget.style.textShadow=`0 0 8px ${pl.glow}`; e.currentTarget.style.transform="scale(1)"; }}
                                      onClick={()=>setBoardInfo({player:pl, exercise:ex.name, category:"AVG SET SIZE", curVal:avgSet, prevVal:prevAvgSet, cutoffDay, curMonth:mo, curYear:yr, prevMonth:prevMo, prevYear:prevYr, isAvg:true})}>
                                      ∅{avgSet}
                                    </div>
                                    {avgTrend && <div className={avgTrend.cls} style={{fontSize:10,lineHeight:1}}>{avgTrend.arrow} {avgTrend.label}</div>}
                                  </> : <div className="board-row-empty">—</div>}
                                </div>
                              ) : <div style={{flex:"0 0 31%"}}/>}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          );
        })()}

        {/* ── SETS (history) ── */}
        {tab==="sets" && (()=>{
          const fp = histFilter.player;
          const fe = histFilter.exercise;
          const filtered = logs.filter(l=>
            (fp==="All"||l.player===fp) &&
            (fe==="All"||l.exercise===fe)
          );

          // Group by player + exercise + day → one row per combo
          const groupMap = new Map();
          filtered.forEach(l=>{
            const d = new Date(l.date);
            const dayKey = `${l.player}|${l.exercise}|${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
            if(!groupMap.has(dayKey)){
              groupMap.set(dayKey, {player:l.player, exercise:l.exercise, date:l.date, sets:[], total:0});
            }
            const g = groupMap.get(dayKey);
            g.sets = [...g.sets, ...l.sets];
            g.total += l.total;
            // keep earliest timestamp for time display
            if(new Date(l.date) < new Date(g.date)) g.date = l.date;
          });
          const grouped = [...groupMap.values()].sort((a,b)=>new Date(b.date)-new Date(a.date));
          return (
            <div className="sets-view fade-up">
              <div className="sets-title">ALL SETS</div>

              <div className="sets-filters-row">
                <div className="sets-filter-section">
                  <div className="sets-filter-label">PLAYERS</div>
                  <div className="sets-filter-btns">
                    {["All", ...players.map(p=>p.name)].map(name=>{
                      const pl = players.find(p=>p.name===name);
                      const isActive = fp===(name==="All"?"All":name);
                      return (
                        <div key={name}
                          className={`sets-filter-btn${isActive?" active":""}`}
                          style={isActive&&pl?{borderColor:pl.color,color:pl.color,background:`${pl.color}12`,boxShadow:`0 0 8px ${pl.glow}`}:{}}
                          onClick={()=>setHistFilter(p=>({...p,player:name==="All"?"All":name}))}>
                          {name==="All"?"All Players":name}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="sets-filter-section">
                  <div className="sets-filter-label">EXERCISES</div>
                  <div className="sets-filter-btns">
                    {["All", ...EXERCISES.map(e=>e.name)].map(name=>{
                      const isActive = fe===(name==="All"?"All":name);
                      return (
                        <div key={name}
                          className={`sets-filter-btn${isActive?" active":""}`}
                          onClick={()=>setHistFilter(p=>({...p,exercise:name==="All"?"All":name}))}>
                          {name==="All"?"All Exercises":name}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="sets-history-label">Complete history of all recorded sets</div>

              <div className="sets-table-header">
                <div className="sets-th">Player</div>
                <div className="sets-th">Exercise</div>
                <div className="sets-th">Sets</div>
                <div className="sets-th">Date</div>

              </div>

              {grouped.length===0
                ? <div className="empty-state"><div className="empty-icon">📋</div>No entries found</div>
                : grouped.map((g,i)=>{
                    const pc = players.find(p=>p.name===g.player)||{color:"var(--cyan)",glow:"transparent"};
                    const d = new Date(g.date);
                    const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
                    return (
                      <div key={i} className="sets-row">
                        <div className="sets-row-player" style={{color:pc.color,textShadow:`0 0 8px ${pc.glow}`}}>{g.player}</div>
                        <div className="sets-row-ex">{g.exercise}</div>
                        <div>
                          <div className="sets-row-sets">{g.sets.join(", ")}</div>
                          <div className="sets-row-total">Total: {g.total}</div>
                        </div>
                        <div className="sets-row-date">{dateStr}</div>
<div/>
                      </div>
                    );
                  })
              }
            </div>
          );
        })()}

        {/* ── TAB BAR ── */}
        {/* ── CAL DAY MODAL ── */}
        {calModal && (() => {
          const modalDate = calModal.date;
          const modalPlayer = calModal.player ? players.find(p=>p.name===calModal.player) : null;
          const dateLabel = modalDate.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"});

          if (!modalPlayer) {
            return (
              <div className="cal-modal-overlay" onClick={()=>setCalModal(null)}>
                <div className="cal-modal" onClick={e=>e.stopPropagation()}>
                  <div className="cal-modal-date">{dateLabel}</div>
                  <div className="cal-modal-players">
                    {players.map(pl=>{
                      const done = new Set(logs.filter(l=>l.player===pl.name&&sameDay(new Date(l.date),modalDate)).map(l=>l.exercise));
                      return (
                        <div key={pl.name} className="cal-modal-player-btn"
                          style={{borderColor:pl.color,color:pl.color}}
                          onClick={()=>setCalModal({date:modalDate,player:pl.name})}>
                          <div className="cal-modal-player-name">{pl.name}</div>
                          <div className="cal-modal-player-sub">{done.size>0?`${done.size} quest${done.size>1?"s":""} done`:"Tap to log"}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          }

          const pl = modalPlayer;
          return (
            <div className="cal-modal-overlay" onClick={()=>setCalModal(null)}>
              <div className="cal-modal" onClick={e=>e.stopPropagation()}>
                <div className="cal-modal-date">{dateLabel}</div>
                <div className="cal-modal-header">
                  <div className="cal-modal-player-title" style={{color:pl.color}}>{pl.name}</div>
                  <button className="cal-modal-back" onClick={()=>setCalModal({date:modalDate})}>← BACK</button>
                </div>
                <div className="cal-modal-exercises">
                  {EXERCISES.map(ex=>{
                    const exLogs = [...logs.filter(l=>l.player===pl.name&&l.exercise===ex.name&&sameDay(new Date(l.date),modalDate))].sort((a,b)=>(a.ts||0)-(b.ts||0));
                    const setsList = exLogs.flatMap(l=>l.sets.map((s,i)=>({value:s,logId:l.id,setIndex:i})));
                    const cur = setsList.reduce((a,b)=>a+b.value,0);
                    const goal = goals[ex.name]||ex.goal;
                    const pct = Math.min(100,Math.round(cur/goal*100));
                    const done = cur>=goal;
                    return (
                      <div key={ex.name} className="cal-modal-ex" style={{borderColor:done?"#6bffb0":`${pl.color}44`}}>
                        <div className="cal-modal-ex-name" style={{color:done?"#6bffb0":pl.color}}>{ex.name}{done?" ✓":""}</div>
                        <div className="cal-modal-ex-total" style={{color:pl.color}}>{cur}<span style={{fontSize:13,color:"rgba(255,255,255,0.4)"}}>/{goal}</span></div>
                        <div className="cal-modal-ex-bar"><div className="cal-modal-ex-fill" style={{width:pct+"%",background:done?"#6bffb0":pl.color}}/></div>

                        {/* Sets list with delete */}
                        {setsList.length>0 && (
                          <div className="ex-sets-list" style={{marginBottom:8}}>
                            {setsList.map((s,i)=>(
                              <div key={i} className="ex-set-row">
                                <span className="ex-set-lbl">{i+1} set:</span>
                                <span className="ex-set-val" style={{color:pl.color}}>{s.value}</span>
                                <button className="ex-set-delete" onClick={()=>deleteSet(s.logId,s.setIndex)}>✕ Delete</button>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="cal-modal-quick">
                          {[5,10,15,20,25,30,40,50].map(r=>(
                            <button key={r} className="cal-modal-qbtn"
                              style={{background:`${pl.color}22`,color:pl.color,border:`1.5px solid ${pl.color}66`}}
                              onClick={()=>addRepsForDate(pl.name,ex.name,r,modalDate)}>+{r}</button>
                          ))}
                        </div>
                        <div className="cal-modal-custom">
                          <input className="cal-modal-custom-inp"
                            type="number" placeholder="Custom"
                            value={calCustom[ex.name]||""}
                            onChange={e=>setCalCustom(p=>({...p,[ex.name]:e.target.value}))}
                            onKeyDown={e=>{
                              if(e.key==="Enter"){
                                const v=parseInt(calCustom[ex.name]);
                                if(v>0){addRepsForDate(pl.name,ex.name,v,modalDate);setCalCustom(p=>({...p,[ex.name]:""}));}
                              }
                            }}
                            style={{borderColor:`${pl.color}66`}}/>
                          <button className="cal-modal-custom-btn"
                            style={{background:`${pl.color}22`,color:pl.color,border:`1.5px solid ${pl.color}66`}}
                            onClick={()=>{
                              const v=parseInt(calCustom[ex.name]);
                              if(v>0){addRepsForDate(pl.name,ex.name,v,modalDate);setCalCustom(p=>({...p,[ex.name]:""}));}
                            }}>Add</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button className="cal-modal-save" onClick={()=>setCalModal(null)}>DONE</button>
              </div>
            </div>
          );
        })()}

        {/* ── BOARD INFO MODAL ── */}
        {boardInfo && (()=>{
          const {player:pl, exercise, category, curVal, prevVal, cutoffDay, curMonth, curYear, prevMonth, prevYear} = boardInfo;
          const curMonthName = new Date(curYear, curMonth, 1).toLocaleDateString("en-US",{month:"long"});
          const prevMonthName = new Date(prevYear, prevMonth, 1).toLocaleDateString("en-US",{month:"long"});
          const diff = curVal - prevVal;
          const pct = prevVal>0 ? Math.round((diff/prevVal)*100) : null;
          const better = diff > 0;
          const same = diff === 0;
          return (
            <div className="board-info-overlay" onClick={()=>setBoardInfo(null)}>
              <div className="board-info-modal" onClick={e=>e.stopPropagation()}>
                <div className="board-info-title">ℹ️ {boardInfo.isAvg ? "AVG REP COUNT PER SET" : category}</div>
                <div className="board-info-text">
                  <strong style={{color:pl.color}}>{pl.name}</strong> — <strong>{exercise}</strong>
                  <br/><br/>
                  Showing where you stand <strong>right now in {curMonthName}</strong> vs the <strong>exact same point in {prevMonthName}</strong>.
                  <br/><br/>
                  <span style={{color:"rgba(255,255,255,0.5)",fontSize:11}}>First {cutoffDay} days of each month:</span>
                  <br/>
                  <span style={{color:"rgba(255,255,255,0.45)"}}>{prevMonthName}:</span> <strong>{boardInfo.isAvg ? prevVal.toFixed(1) : prevVal.toLocaleString()}</strong>
                  <br/>
                  <span style={{color:pl.color}}>{curMonthName}:</span> <strong style={{color:pl.color}}>{boardInfo.isAvg ? curVal.toFixed(1) : curVal.toLocaleString()}</strong>
                  <br/><br/>
                  {same
                    ? <span style={{color:"rgba(255,255,255,0.5)"}}>→ Same pace as last month.</span>
                    : better
                      ? <span style={{color:"#39ff14"}}>↑ {boardInfo.isAvg ? Math.abs(diff).toFixed(1) : diff.toLocaleString()} ahead of last month's pace{pct!==null?` (+${pct}%)`:""}</span>
                      : <span style={{color:"#ff2d55"}}>↓ {boardInfo.isAvg ? Math.abs(diff).toFixed(1) : Math.abs(diff).toLocaleString()} behind last month's pace{pct!==null?` (${pct}%)`:""}</span>
                  }
                </div>
                <button className="board-info-close" onClick={()=>setBoardInfo(null)}>CLOSE</button>
              </div>
            </div>
          );
        })()}

        <div className="tab-bar">
          {[
            {id:"players", lbl:"Players"},
            {id:"quests",  lbl:"Quests"},
            {id:"log",     lbl:"Log"},
            {id:"totals",  lbl:"Totals"},
            {id:"board",   lbl:"Board"},
            {id:"sets",    lbl:"Sets"},
          ].map(t=>(
            <button key={t.id} className={`tab-btn${tab===t.id?" active":""}`} onClick={()=>{ if(t.id==="quests"&&!activePlayer){setTab("players");}else{setTab(t.id);} }}>
              <span className="tab-lbl-wrap"><span className="tab-lbl">{t.lbl}</span></span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
