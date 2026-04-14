import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

  :root {
    --bark:      #2b2318;
    --bark-lt:   #4a3f33;
    --bronze:    #a0743c;
    --bronze-lt: #c49558;
    --fog:       #9c9188;
    --border:    rgba(43,35,24,0.08);
    --parch:     #f5f0e8;
    --white:     #ffffff;
    --green:     #27ae60;
    --amber:     #e67e22;
    --red:       #c0392b;
  }

  .db-root { font-family: 'Jost', sans-serif; color: var(--bark); }

  /* ── Page header ── */
  .db-header { margin-bottom: 2rem; }
  .db-greeting {
    font-size: 0.65rem; letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--bronze); margin-bottom: 0.4rem;
    display: flex; align-items: center; gap: 0.6rem;
  }
  .db-greeting::before { content: ''; width: 20px; height: 1px; background: var(--bronze); }
  .db-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.8rem, 3vw, 2.5rem);
    font-weight: 300; line-height: 1.05; letter-spacing: -0.02em;
  }
  .db-title em { font-style: italic; color: var(--bronze); }
  .db-date { font-size: 0.72rem; color: var(--fog); margin-top: 0.3rem; }

  /* ── Stats grid ── */
  .db-stats {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 1px; background: var(--border); border: 1px solid var(--border);
    margin-bottom: 1.5rem;
  }
  @media (max-width: 860px) { .db-stats { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 480px) { .db-stats { grid-template-columns: 1fr; } }

  .db-stat {
    background: var(--white); padding: 1.5rem;
    position: relative; overflow: hidden;
    transition: background 0.25s;
  }
  .db-stat:hover { background: #fdfaf6; }

  /* Subtle accent line */
  .db-stat::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0;
    height: 2px; background: var(--border);
    transition: background 0.3s;
  }
  .db-stat:hover::before { background: var(--bronze); }

  /* Ghost icon */
  .db-stat-ghost {
    position: absolute; top: 0.75rem; right: 1rem;
    color: rgba(43,35,24,0.04); transition: color 0.3s;
  }
  .db-stat:hover .db-stat-ghost { color: rgba(160,116,60,0.08); }

  .db-stat-label {
    font-size: 0.58rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--fog);
    margin-bottom: 0.5rem; display: block;
  }
  .db-stat-val {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.4rem; font-weight: 300; line-height: 1;
    letter-spacing: -0.03em; color: var(--bark);
    display: block; margin-bottom: 0.5rem;
  }
  .db-stat-val.bronze { color: var(--bronze); }
  .db-stat-val.green  { color: var(--green); }
  .db-stat-val.amber  { color: var(--amber); }

  .db-stat-delta {
    font-size: 0.62rem; letter-spacing: 0.06em;
    display: flex; align-items: center; gap: 0.35rem;
  }
  .db-delta-up   { color: var(--green); }
  .db-delta-down { color: var(--red); }
  .db-delta-neu  { color: var(--fog); }

  /* Sparkline */
  .db-sparkline {
    position: absolute; bottom: 0; left: 0; right: 0; height: 32px;
    opacity: 0.3;
  }
  .db-stat:hover .db-sparkline { opacity: 0.55; }

  /* ── Two-column lower section ── */
  .db-lower {
    display: grid; grid-template-columns: 1fr 320px;
    gap: 1.5rem;
  }
  @media (max-width: 1000px) { .db-lower { grid-template-columns: 1fr; } }

  /* ── Card shell ── */
  .db-card {
    background: var(--white); border: 1px solid var(--border);
    overflow: hidden;
  }
  .db-card-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.1rem 1.4rem; border-bottom: 1px solid var(--border);
  }
  .db-card-title {
    font-size: 0.62rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: rgba(43,35,24,0.4);
    display: flex; align-items: center; gap: 0.5rem;
  }
  .db-card-title-dot { width: 5px; height: 5px; background: var(--bronze); border-radius: 50%; }
  .db-card-link {
    font-size: 0.6rem; letter-spacing: 0.16em; text-transform: uppercase;
    color: var(--bronze); text-decoration: none;
    transition: color 0.2s;
  }
  .db-card-link:hover { color: var(--bark); }

  /* ── Revenue bar chart ── */
  .db-chart { padding: 1.25rem 1.4rem; }
  .db-chart-bars {
    display: flex; align-items: flex-end; gap: 6px; height: 120px;
  }
  .db-chart-col {
    flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px;
  }
  .db-bar-wrap { flex: 1; width: 100%; display: flex; align-items: flex-end; }
  .db-bar {
    width: 100%; background: rgba(160,116,60,0.15);
    border-top: 2px solid var(--bronze);
    transition: background 0.2s;
    border-radius: 1px 1px 0 0;
    position: relative; cursor: default;
  }
  .db-bar:hover { background: rgba(160,116,60,0.28); }
  .db-bar-month {
    font-size: 0.55rem; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--fog); white-space: nowrap;
  }

  /* ── Activity feed ── */
  .db-feed { padding: 0.5rem 0; }
  .db-feed-item {
    display: flex; align-items: flex-start; gap: 0.85rem;
    padding: 0.85rem 1.4rem;
    border-bottom: 1px solid var(--border);
    transition: background 0.2s;
  }
  .db-feed-item:last-child { border-bottom: none; }
  .db-feed-item:hover { background: #fdfaf6; }

  .db-feed-dot-wrap {
    display: flex; flex-direction: column; align-items: center;
    padding-top: 2px;
  }
  .db-feed-dot {
    width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
  }
  .db-feed-dot.booking  { background: var(--green); }
  .db-feed-dot.payment  { background: var(--bronze); }
  .db-feed-dot.user     { background: #3498db; }
  .db-feed-dot.cancel   { background: var(--red); }

  .db-feed-body { flex: 1; min-width: 0; }
  .db-feed-text {
    font-size: 0.75rem; color: var(--bark-lt); line-height: 1.4;
  }
  .db-feed-text strong { font-weight: 500; color: var(--bark); }
  .db-feed-time {
    font-size: 0.62rem; color: var(--fog); margin-top: 0.2rem;
    letter-spacing: 0.04em;
  }

  /* ── Quick actions ── */
  .db-actions {
    display: grid; grid-template-columns: 1fr 1fr; gap: 1px;
    background: var(--border);
  }
  .db-action {
    background: var(--white); padding: 1.1rem 1.4rem;
    display: flex; flex-direction: column; gap: 0.35rem;
    text-decoration: none; color: var(--bark);
    transition: background 0.2s;
    cursor: pointer; border: none; text-align: left;
    font-family: 'Jost', sans-serif;
  }
  .db-action:hover { background: rgba(160,116,60,0.05); }
  .db-action-icon { color: var(--bronze); margin-bottom: 0.2rem; }
  .db-action-label {
    font-size: 0.75rem; font-weight: 500; color: var(--bark);
  }
  .db-action-sub { font-size: 0.62rem; color: var(--fog); }

  /* Count-up animation */
  .db-stat-val { animation: countReveal 0.5s ease both; }
  @keyframes countReveal {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .db-stat:nth-child(1) .db-stat-val { animation-delay: 0.05s; }
  .db-stat:nth-child(2) .db-stat-val { animation-delay: 0.12s; }
  .db-stat:nth-child(3) .db-stat-val { animation-delay: 0.19s; }
  .db-stat:nth-child(4) .db-stat-val { animation-delay: 0.26s; }
`;

/* ── SVG Icons ── */
const Icon = {
  bookings: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 9h18M8 2v4M16 2v4M7 13h2M11 13h2M15 13h2M7 17h2M11 17h2"/></svg>,
  revenue:  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 14h2M10 14h2"/></svg>,
  rooms:    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21V8l9-5 9 5v13H3z"/><rect x="9" y="13" width="3" height="8"/><rect x="12" y="13" width="3" height="8"/></svg>,
  users:    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="7" r="4"/><path d="M2 21c0-4 3-7 6-7s6 3 6 7"/><path d="M16 3a4 4 0 010 8M22 21c0-3-2-5-6-5"/></svg>,
};

const ActionIcon = {
  add:    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><circle cx="8" cy="8" r="6.5"/><path d="M8 5v6M5 8h6"/></svg>,
  view:   <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z"/><circle cx="8" cy="8" r="2"/></svg>,
  export: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M8 2v9M5 8l3 3 3-3M2 13h12"/></svg>,
  users:  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><circle cx="6" cy="5" r="3"/><path d="M1 14c0-3 2-5 5-5s5 2 5 5"/><path d="M12 3a3 3 0 010 6M15 14c0-2-1-4-4-4"/></svg>,
};

// Monthly revenue data (last 6 months)
const REVENUE_DATA = [
  { month: "Oct", val: 62 },
  { month: "Nov", val: 78 },
  { month: "Dec", val: 95 },
  { month: "Jan", val: 70 },
  { month: "Feb", val: 83 },
  { month: "Mar", val: 100 },
];

const ACTIVITY = [
  { type: "booking", text: <><strong>Sarah Mitchell</strong> booked Deluxe Suite for 3 nights</>, time: "2 min ago" },
  { type: "payment", text: <><strong>KES 42,000</strong> payment received from Daniel Mwangi</>, time: "18 min ago" },
  { type: "user",    text: <><strong>Maria Lopez</strong> created a new account</>, time: "1 hr ago" },
  { type: "booking", text: <><strong>Ahmed Al-Farsi</strong> booked Twin Room for 2 nights</>, time: "3 hrs ago" },
  { type: "cancel",  text: <><strong>James Odhiambo</strong> cancelled their reservation</>, time: "5 hrs ago" },
  { type: "payment", text: <><strong>KES 28,500</strong> payment received from Yuki Tanaka</>, time: "Yesterday" },
];

const QUICK_ACTIONS = [
  { icon: ActionIcon.add,    label: "Add Room",        sub: "Create new listing",    to: "/admin/rooms"     },
  { icon: ActionIcon.view,   label: "View Bookings",   sub: "Manage reservations",   to: "/admin/bookings"  },
  { icon: ActionIcon.users,  label: "Manage Users",    sub: "View all guests",       to: "/admin/users"     },
  { icon: ActionIcon.export, label: "Export Data",     sub: "Download reports",      to: "#"                },
];

// Simple animated counter
function CountUp({ target, prefix = "", suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    let start = 0;
    const duration = 900;
    const step = 16;
    const increment = target / (duration / step);

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, step);

    return () => clearInterval(timer);
  }, [target]);

  return <>{prefix}{count.toLocaleString()}{suffix}</>;
}

const maxVal = Math.max(...REVENUE_DATA.map(d => d.val));

export default function Dashboard() {
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")); }
    catch { return null; }
  })();
  const firstName = user?.fullName?.split(" ")[0] ?? "Admin";

  return (
    <>
      <style>{STYLES}</style>
      <div className="db-root">

        {/* ── Header ── */}
        <div className="db-header">
          <div className="db-greeting">{greeting}</div>
          <h1 className="db-title">
            Welcome back, <em>{firstName}</em>
          </h1>
          <p className="db-date">{today}</p>
        </div>

        {/* ── Stats ── */}
        <div className="db-stats">

          <div className="db-stat">
            <div className="db-stat-ghost">{Icon.bookings}</div>
            <span className="db-stat-label">Total Bookings</span>
            <span className="db-stat-val"><CountUp target={120} /></span>
            <div className="db-stat-delta">
              <span className="db-delta-up">↑ 12%</span>
              <span style={{ color: "var(--fog)" }}>vs last month</span>
            </div>
          </div>

          <div className="db-stat">
            <div className="db-stat-ghost">{Icon.revenue}</div>
            <span className="db-stat-label">Revenue</span>
            <span className="db-stat-val bronze">
              <CountUp target={450} prefix="KES " suffix="K" />
            </span>
            <div className="db-stat-delta">
              <span className="db-delta-up">↑ 8%</span>
              <span style={{ color: "var(--fog)" }}>vs last month</span>
            </div>
          </div>

          <div className="db-stat">
            <div className="db-stat-ghost">{Icon.rooms}</div>
            <span className="db-stat-label">Active Rooms</span>
            <span className="db-stat-val"><CountUp target={12} /></span>
            <div className="db-stat-delta">
              <span className="db-delta-neu">— unchanged</span>
            </div>
          </div>

          <div className="db-stat">
            <div className="db-stat-ghost">{Icon.users}</div>
            <span className="db-stat-label">Registered Users</span>
            <span className="db-stat-val green"><CountUp target={340} /></span>
            <div className="db-stat-delta">
              <span className="db-delta-up">↑ 24</span>
              <span style={{ color: "var(--fog)" }}>this week</span>
            </div>
          </div>

        </div>

        {/* ── Lower ── */}
        <div className="db-lower">

          {/* Left: chart + activity */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            {/* Revenue chart */}
            <div className="db-card">
              <div className="db-card-head">
                <div className="db-card-title">
                  <div className="db-card-title-dot" />
                  Monthly Revenue
                </div>
                <Link to="/admin/payments" className="db-card-link">View All →</Link>
              </div>
              <div className="db-chart">
                <div className="db-chart-bars">
                  {REVENUE_DATA.map((d, i) => (
                    <div key={i} className="db-chart-col">
                      <div className="db-bar-wrap">
                        <div
                          className="db-bar"
                          style={{ height: `${(d.val / maxVal) * 100}%` }}
                          title={`KES ${d.val}K`}
                        />
                      </div>
                      <span className="db-bar-month">{d.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Activity feed */}
            <div className="db-card">
              <div className="db-card-head">
                <div className="db-card-title">
                  <div className="db-card-title-dot" />
                  Recent Activity
                </div>
                <Link to="/admin/bookings" className="db-card-link">View All →</Link>
              </div>
              <div className="db-feed">
                {ACTIVITY.map((a, i) => (
                  <div key={i} className="db-feed-item">
                    <div className="db-feed-dot-wrap">
                      <div className={`db-feed-dot ${a.type}`} />
                    </div>
                    <div className="db-feed-body">
                      <div className="db-feed-text">{a.text}</div>
                      <div className="db-feed-time">{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right: quick actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            <div className="db-card">
              <div className="db-card-head">
                <div className="db-card-title">
                  <div className="db-card-title-dot" />
                  Quick Actions
                </div>
              </div>
              <div className="db-actions">
                {QUICK_ACTIONS.map((a, i) => (
                  <Link key={i} to={a.to} className="db-action">
                    <div className="db-action-icon">{a.icon}</div>
                    <div className="db-action-label">{a.label}</div>
                    <div className="db-action-sub">{a.sub}</div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Status summary card */}
            <div className="db-card">
              <div className="db-card-head">
                <div className="db-card-title">
                  <div className="db-card-title-dot" />
                  Booking Status
                </div>
              </div>
              <div style={{ padding: "1rem 1.4rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                {[
                  { label: "Confirmed", val: 74, color: "var(--green)",  pct: 62 },
                  { label: "Pending",   val: 28, color: "var(--amber)",  pct: 23 },
                  { label: "Cancelled", val: 18, color: "var(--red)",    pct: 15 },
                ].map((s, i) => (
                  <div key={i}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.35rem" }}>
                      <span style={{ fontSize:"0.7rem", color:"var(--fog)", letterSpacing:"0.06em" }}>{s.label}</span>
                      <span style={{ fontSize:"0.7rem", fontFamily:"'Cormorant Garamond', serif", color:"var(--bark)" }}>{s.val}</span>
                    </div>
                    <div style={{ height:"3px", background:"var(--border)", borderRadius:"2px", overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${s.pct}%`, background:s.color, borderRadius:"2px", transition:"width 1s ease" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </>
  );
}