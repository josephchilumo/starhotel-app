import React, { useEffect, useState, useMemo } from "react";
import API from "../utils/axios";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

  :root {
    --bark:      #2b2318;
    --bronze:    #a0743c;
    --bronze-lt: #c49558;
    --fog:       #9c9188;
    --border:    rgba(43,35,24,0.08);
    --parch:     #f5f0e8;
    --white:     #ffffff;
  }

  .bk-root { font-family: 'Jost', sans-serif; color: var(--bark); }

  /* ── Page header ── */
  .bk-header {
    display: flex; align-items: flex-end;
    justify-content: space-between; gap: 1rem;
    margin-bottom: 1.75rem; flex-wrap: wrap;
  }
  .bk-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem; font-weight: 300; line-height: 1;
    letter-spacing: -0.02em; color: var(--bark);
  }
  .bk-title em { font-style: italic; color: var(--bronze); }
  .bk-subtitle {
    font-size: 0.72rem; color: var(--fog); margin-top: 0.3rem;
    letter-spacing: 0.04em;
  }
  .bk-refresh-btn {
    display: flex; align-items: center; gap: 0.5rem;
    font-size: 0.65rem; letter-spacing: 0.16em; text-transform: uppercase;
    color: var(--fog); background: none; border: none; cursor: pointer;
    font-family: 'Jost', sans-serif; padding: 0;
    transition: color 0.2s;
  }
  .bk-refresh-btn:hover { color: var(--bronze); }

  /* ── Stat cards ── */
  .bk-stats {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 1px; background: var(--border);
    border: 1px solid var(--border);
    margin-bottom: 1.5rem;
  }
  @media (max-width: 700px) { .bk-stats { grid-template-columns: repeat(2,1fr); } }

  .bk-stat {
    background: var(--white);
    padding: 1.25rem 1.5rem;
    display: flex; flex-direction: column; gap: 0.35rem;
  }
  .bk-stat-label {
    font-size: 0.58rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--fog);
  }
  .bk-stat-val {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.9rem; font-weight: 300; color: var(--bark);
    line-height: 1; letter-spacing: -0.02em;
  }
  .bk-stat-sub {
    font-size: 0.65rem; color: var(--fog);
  }
  .bk-stat-val.bronze { color: var(--bronze); }

  /* ── Toolbar ── */
  .bk-toolbar {
    display: flex; align-items: center;
    gap: 0.75rem; margin-bottom: 1rem; flex-wrap: wrap;
  }

  .bk-search-wrap {
    flex: 1; min-width: 180px;
    display: flex; align-items: center; gap: 0.6rem;
    background: var(--white);
    border: 1px solid var(--border);
    padding: 0.6rem 0.9rem;
  }
  .bk-search-icon { color: var(--fog); flex-shrink: 0; }
  .bk-search {
    flex: 1; background: none; border: none; outline: none;
    font-size: 0.78rem; color: var(--bark);
    font-family: 'Jost', sans-serif; caret-color: var(--bronze);
  }
  .bk-search::placeholder { color: rgba(43,35,24,0.25); }

  .bk-filter {
    padding: 0.6rem 1rem;
    font-size: 0.65rem; letter-spacing: 0.14em; text-transform: uppercase;
    border: 1px solid var(--border);
    background: var(--white); color: var(--fog);
    cursor: pointer; font-family: 'Jost', sans-serif;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
  }
  .bk-filter:hover    { border-color: rgba(43,35,24,0.2); color: var(--bark); }
  .bk-filter.active   { background: var(--bark); color: #f0ece4; border-color: var(--bark); }

  /* ── Table card ── */
  .bk-card {
    background: var(--white);
    border: 1px solid var(--border);
    overflow: hidden;
  }

  .bk-table-wrap { overflow-x: auto; }

  table.bk-table {
    width: 100%; border-collapse: collapse;
    font-size: 0.78rem;
  }

  .bk-table thead tr {
    border-bottom: 1px solid var(--border);
    background: var(--parch);
  }
  .bk-table th {
    padding: 0.75rem 1.25rem;
    font-size: 0.58rem; font-weight: 500;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: rgba(43,35,24,0.4);
    text-align: left; white-space: nowrap;
  }

  .bk-table tbody tr {
    border-bottom: 1px solid var(--border);
    transition: background 0.2s;
  }
  .bk-table tbody tr:last-child { border-bottom: none; }
  .bk-table tbody tr:hover { background: #faf8f4; }

  .bk-table td {
    padding: 1rem 1.25rem;
    color: var(--bark); vertical-align: middle;
  }

  /* User cell */
  .bk-user-cell { display: flex; align-items: center; gap: 0.65rem; }
  .bk-user-avatar {
    width: 28px; height: 28px; border-radius: 50%;
    background: rgba(160,116,60,0.12);
    border: 1px solid rgba(160,116,60,0.2);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.75rem; font-style: italic;
    color: var(--bronze); flex-shrink: 0;
  }
  .bk-user-name  { font-weight: 400; font-size: 0.78rem; }
  .bk-user-email { font-size: 0.65rem; color: var(--fog); }

  /* Room cell */
  .bk-room-name { font-weight: 400; }

  /* Date cell */
  .bk-dates { display: flex; flex-direction: column; gap: 0.15rem; }
  .bk-date-range {
    font-size: 0.75rem; color: var(--bark);
    display: flex; align-items: center; gap: 0.35rem;
  }
  .bk-date-arrow { color: var(--fog); font-size: 0.6rem; }
  .bk-nights { font-size: 0.62rem; color: var(--fog); }

  /* Total */
  .bk-total {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1rem; font-weight: 400; color: var(--bronze);
  }

  /* Status badges */
  .bk-badge {
    display: inline-flex; align-items: center; gap: 0.35rem;
    padding: 0.25rem 0.65rem;
    font-size: 0.58rem; letter-spacing: 0.14em; text-transform: uppercase;
    font-weight: 500; border-radius: 0; white-space: nowrap;
  }
  .bk-badge-dot {
    width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0;
  }
  .bk-badge.confirmed  { background: rgba(39,174,96,0.1);  color: #1e7a46; }
  .bk-badge.confirmed .bk-badge-dot  { background: #27ae60; }
  .bk-badge.pending    { background: rgba(230,126,34,0.1);  color: #b35c0a; }
  .bk-badge.pending .bk-badge-dot    { background: #e67e22; }
  .bk-badge.cancelled  { background: rgba(192,57,43,0.1);   color: #9e2a1e; }
  .bk-badge.cancelled .bk-badge-dot  { background: #c0392b; }
  .bk-badge.completed  { background: rgba(43,35,24,0.07);   color: var(--fog); }
  .bk-badge.completed .bk-badge-dot  { background: var(--fog); }

  /* ── Skeleton loader ── */
  .bk-skeleton { animation: shimmer 1.4s ease-in-out infinite; }
  @keyframes shimmer {
    0%,100% { opacity: 0.5; }
    50%      { opacity: 1; }
  }
  .bk-skel-row { display: flex; align-items: center; gap: 1rem; padding: 1rem 1.25rem; border-bottom: 1px solid var(--border); }
  .bk-skel-circle { width: 28px; height: 28px; border-radius: 50%; background: var(--border); flex-shrink: 0; }
  .bk-skel-line {
    height: 10px; background: var(--border); border-radius: 2px;
  }

  /* ── Empty state ── */
  .bk-empty {
    padding: 4rem 2rem; text-align: center;
    display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
  }
  .bk-empty-icon { color: rgba(43,35,24,0.12); margin-bottom: 0.5rem; }
  .bk-empty-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.3rem; font-style: italic; font-weight: 300; color: rgba(43,35,24,0.4);
  }
  .bk-empty-sub { font-size: 0.72rem; color: rgba(43,35,24,0.25); }

  /* ── Count bar ── */
  .bk-count-bar {
    padding: 0.65rem 1.25rem;
    border-top: 1px solid var(--border);
    font-size: 0.62rem; letter-spacing: 0.1em;
    color: rgba(43,35,24,0.3); text-transform: uppercase;
    background: var(--parch);
  }
`;

const STATUS_FILTERS = ["All", "Confirmed", "Pending", "Cancelled", "Completed"];

const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};

const getNights = (ci, co) => {
  if (!ci || !co) return 0;
  return Math.round((new Date(co) - new Date(ci)) / 86400000);
};

const badgeClass = (status = "") => {
  const s = status.toLowerCase();
  if (s === "confirmed")  return "bk-badge confirmed";
  if (s === "pending")    return "bk-badge pending";
  if (s === "cancelled")  return "bk-badge cancelled";
  if (s === "completed")  return "bk-badge completed";
  return "bk-badge pending";
};

function SkeletonRows() {
  return Array.from({ length: 5 }).map((_, i) => (
    <div key={i} className="bk-skel-row bk-skeleton">
      <div className="bk-skel-circle" />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
        <div className="bk-skel-line" style={{ width: `${55 + (i * 7) % 30}%` }} />
        <div className="bk-skel-line" style={{ width: "35%" }} />
      </div>
      <div className="bk-skel-line" style={{ width: "80px" }} />
      <div className="bk-skel-line" style={{ width: "60px" }} />
    </div>
  ));
}

export default function Bookings() {
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState("All");

  const fetchBookings = async () => {
    setLoading(true); setError("");
    try {
      const res = await API.get("/api/bookings");
      setData(res.data);
    } catch {
      setError("Could not load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data.filter(b => {
      const matchSearch =
        !q ||
        b.user?.fullName?.toLowerCase().includes(q) ||
        b.user?.email?.toLowerCase().includes(q) ||
        b.room?.name?.toLowerCase().includes(q);
      const matchStatus =
        filter === "All" || b.status?.toLowerCase() === filter.toLowerCase();
      return matchSearch && matchStatus;
    });
  }, [data, search, filter]);

  // Stats
  const total     = data.length;
  const confirmed = data.filter(b => b.status?.toLowerCase() === "confirmed").length;
  const pending   = data.filter(b => b.status?.toLowerCase() === "pending").length;
  const revenue   = data.reduce((s, b) => s + (b.total || 0), 0);

  return (
    <>
      <style>{STYLES}</style>
      <div className="bk-root">

        {/* ── Header ── */}
        <div className="bk-header">
          <div>
            <h1 className="bk-title">All <em>Bookings</em></h1>
            <p className="bk-subtitle">{total} reservation{total !== 1 ? "s" : ""} total</p>
          </div>
          <button className="bk-refresh-btn" onClick={fetchBookings}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
              <path d="M10.5 1.5A5 5 0 1 1 1.5 6"/>
              <path d="M10.5 1.5V5h-3.5"/>
            </svg>
            Refresh
          </button>
        </div>

        {/* ── Stats ── */}
        <div className="bk-stats">
          <div className="bk-stat">
            <span className="bk-stat-label">Total Bookings</span>
            <span className="bk-stat-val">{total}</span>
          </div>
          <div className="bk-stat">
            <span className="bk-stat-label">Confirmed</span>
            <span className="bk-stat-val" style={{ color: "#1e7a46" }}>{confirmed}</span>
          </div>
          <div className="bk-stat">
            <span className="bk-stat-label">Pending</span>
            <span className="bk-stat-val" style={{ color: "#b35c0a" }}>{pending}</span>
          </div>
          <div className="bk-stat">
            <span className="bk-stat-label">Total Revenue</span>
            <span className="bk-stat-val bronze">
              {revenue > 0 ? `KES ${revenue.toLocaleString()}` : "—"}
            </span>
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div className="bk-toolbar">
          <div className="bk-search-wrap">
            <span className="bk-search-icon">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                <circle cx="5.5" cy="5.5" r="4.5"/><path d="M9.5 9.5l2.5 2.5"/>
              </svg>
            </span>
            <input
              className="bk-search"
              placeholder="Search by guest, room…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {STATUS_FILTERS.map(f => (
            <button
              key={f}
              className={`bk-filter${filter === f ? " active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* ── Table card ── */}
        <div className="bk-card">
          {error ? (
            <div className="bk-empty">
              <div className="bk-empty-title">{error}</div>
            </div>
          ) : loading ? (
            <SkeletonRows />
          ) : filtered.length === 0 ? (
            <div className="bk-empty">
              <div className="bk-empty-icon">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="8" width="32" height="28" rx="2"/>
                  <path d="M4 16h32M13 4v8M27 4v8M12 24h16M12 30h10"/>
                </svg>
              </div>
              <div className="bk-empty-title">No bookings found</div>
              <div className="bk-empty-sub">
                {search || filter !== "All" ? "Try adjusting your search or filter" : "No reservations have been made yet"}
              </div>
            </div>
          ) : (
            <div className="bk-table-wrap">
              <table className="bk-table">
                <thead>
                  <tr>
                    <th>Guest</th>
                    <th>Room</th>
                    <th>Dates</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b) => {
                    const nights = getNights(b.checkIn, b.checkOut);
                    const initial = b.user?.fullName?.[0] ?? b.user?.email?.[0] ?? "?";
                    return (
                      <tr key={b._id}>
                        <td>
                          <div className="bk-user-cell">
                            <div className="bk-user-avatar">{initial}</div>
                            <div>
                              <div className="bk-user-name">{b.user?.fullName ?? "—"}</div>
                              <div className="bk-user-email">{b.user?.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="bk-room-name">{b.room?.name ?? "—"}</div>
                        </td>
                        <td>
                          <div className="bk-dates">
                            <div className="bk-date-range">
                              {formatDate(b.checkIn)}
                              <span className="bk-date-arrow">→</span>
                              {formatDate(b.checkOut)}
                            </div>
                            <div className="bk-nights">
                              {nights > 0 ? `${nights} night${nights !== 1 ? "s" : ""}` : "—"}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="bk-total">
                            KES {b.total?.toLocaleString() ?? "—"}
                          </span>
                        </td>
                        <td>
                          <span className={badgeClass(b.status)}>
                            <span className="bk-badge-dot" />
                            {b.status ?? "Pending"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Count bar */}
          {!loading && !error && filtered.length > 0 && (
            <div className="bk-count-bar">
              Showing {filtered.length} of {total} booking{total !== 1 ? "s" : ""}
            </div>
          )}
        </div>

      </div>
    </>
  );
}
