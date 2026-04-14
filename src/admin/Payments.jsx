import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

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
    --blue:      #2980b9;
  }

  .py-root { font-family: 'Jost', sans-serif; color: var(--bark); }

  /* ── Header ── */
  .py-header {
    display: flex; align-items: flex-end;
    justify-content: space-between; gap: 1rem;
    margin-bottom: 1.75rem; flex-wrap: wrap;
  }
  .py-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem; font-weight: 300; line-height: 1;
    letter-spacing: -0.02em;
  }
  .py-title em { font-style: italic; color: var(--bronze); }
  .py-subtitle { font-size: 0.72rem; color: var(--fog); margin-top: 0.3rem; }

  .py-refresh-btn {
    display: flex; align-items: center; gap: 0.5rem;
    font-size: 0.65rem; letter-spacing: 0.16em; text-transform: uppercase;
    color: var(--fog); background: none; border: none; cursor: pointer;
    font-family: 'Jost', sans-serif; padding: 0; transition: color 0.2s;
  }
  .py-refresh-btn:hover { color: var(--bronze); }

  /* ── Stats ── */
  .py-stats {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 1px; background: var(--border); border: 1px solid var(--border);
    margin-bottom: 1.5rem;
  }
  @media (max-width: 700px) { .py-stats { grid-template-columns: repeat(2,1fr); } }

  .py-stat {
    background: var(--white); padding: 1.25rem 1.5rem;
    display: flex; flex-direction: column; gap: 0.3rem;
    position: relative; overflow: hidden;
  }
  .py-stat::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0;
    height: 2px; background: var(--border); transition: background 0.3s;
  }
  .py-stat:hover::before { background: var(--bronze); }

  .py-stat-label {
    font-size: 0.57rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--fog);
  }
  .py-stat-val {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem; font-weight: 300; line-height: 1;
    letter-spacing: -0.03em; color: var(--bark);
  }
  .py-stat-val.bronze { color: var(--bronze); }
  .py-stat-val.green  { color: var(--green);  }
  .py-stat-val.amber  { color: var(--amber);  }

  /* ── Toolbar ── */
  .py-toolbar {
    display: flex; align-items: center; gap: 0.75rem;
    margin-bottom: 1rem; flex-wrap: wrap;
  }
  .py-search-wrap {
    flex: 1; min-width: 180px;
    display: flex; align-items: center; gap: 0.6rem;
    background: var(--white); border: 1px solid var(--border);
    padding: 0.55rem 0.9rem;
  }
  .py-search-icon { color: var(--fog); flex-shrink: 0; }
  .py-search {
    flex: 1; background: none; border: none; outline: none;
    font-size: 0.78rem; color: var(--bark);
    font-family: 'Jost', sans-serif; caret-color: var(--bronze);
  }
  .py-search::placeholder { color: rgba(43,35,24,0.25); }

  .py-filter {
    padding: 0.55rem 1rem;
    font-size: 0.62rem; letter-spacing: 0.14em; text-transform: uppercase;
    border: 1px solid var(--border); background: var(--white); color: var(--fog);
    cursor: pointer; font-family: 'Jost', sans-serif;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
  }
  .py-filter:hover    { color: var(--bark); border-color: rgba(43,35,24,0.2); }
  .py-filter.active   { background: var(--bark); color: #f0ece4; border-color: var(--bark); }

  /* ── Table card ── */
  .py-card {
    background: var(--white); border: 1px solid var(--border); overflow: hidden;
  }
  .py-table-wrap { overflow-x: auto; }

  table.py-table {
    width: 100%; border-collapse: collapse; font-size: 0.78rem;
  }
  .py-table thead tr {
    border-bottom: 1px solid var(--border); background: var(--parch);
  }
  .py-table th {
    padding: 0.75rem 1.25rem;
    font-size: 0.57rem; font-weight: 500;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: rgba(43,35,24,0.4); text-align: left; white-space: nowrap;
  }
  .py-table tbody tr {
    border-bottom: 1px solid var(--border); transition: background 0.2s;
  }
  .py-table tbody tr:last-child { border-bottom: none; }
  .py-table tbody tr:hover { background: #faf8f4; }
  .py-table td { padding: 0.95rem 1.25rem; vertical-align: middle; }

  /* Method cell */
  .py-method-cell { display: flex; align-items: center; gap: 0.65rem; }
  .py-method-icon {
    width: 30px; height: 30px;
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.7rem; color: var(--fog); flex-shrink: 0;
    background: var(--parch);
  }
  .py-method-name { font-size: 0.78rem; color: var(--bark); font-weight: 400; }

  /* Amount */
  .py-amount {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.05rem; font-weight: 400; color: var(--bronze);
  }

  /* Guest */
  .py-guest-cell { display: flex; align-items: center; gap: 0.6rem; }
  .py-guest-avatar {
    width: 26px; height: 26px; border-radius: 50%;
    background: rgba(160,116,60,0.12);
    border: 1px solid rgba(160,116,60,0.2);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.72rem; font-style: italic; color: var(--bronze);
    flex-shrink: 0;
  }

  /* Date */
  .py-date { font-size: 0.72rem; color: var(--fog); }

  /* Status badges */
  .py-badge {
    display: inline-flex; align-items: center; gap: 0.35rem;
    padding: 0.22rem 0.6rem;
    font-size: 0.57rem; letter-spacing: 0.14em; text-transform: uppercase;
    font-weight: 500; white-space: nowrap;
  }
  .py-badge-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
  .py-badge.success  { background: rgba(39,174,96,0.1);  color: #1e7a46; }
  .py-badge.success .py-badge-dot  { background: var(--green); }
  .py-badge.pending  { background: rgba(230,126,34,0.1);  color: #b35c0a; }
  .py-badge.pending .py-badge-dot  { background: var(--amber); }
  .py-badge.failed   { background: rgba(192,57,43,0.1);   color: #9e2a1e; }
  .py-badge.failed .py-badge-dot   { background: var(--red);   }
  .py-badge.refunded { background: rgba(41,128,185,0.1);  color: #1a5276; }
  .py-badge.refunded .py-badge-dot { background: var(--blue);  }

  /* Skeleton */
  .py-skel { animation: shimmer 1.4s ease-in-out infinite; }
  @keyframes shimmer { 0%,100%{opacity:.45} 50%{opacity:1} }
  .py-skel-row { display: flex; align-items: center; gap: 1rem; padding: 0.95rem 1.25rem; border-bottom: 1px solid var(--border); }
  .py-skel-circle { width: 26px; height: 26px; border-radius: 50%; background: var(--border); flex-shrink: 0; }
  .py-skel-line { height: 10px; background: var(--border); border-radius: 2px; }

  /* Empty */
  .py-empty {
    padding: 4rem 2rem; text-align: center;
    display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
  }
  .py-empty-icon { color: rgba(43,35,24,0.1); }
  .py-empty-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.2rem; font-style: italic; color: rgba(43,35,24,0.35);
  }

  /* Count bar */
  .py-count-bar {
    padding: 0.6rem 1.25rem; border-top: 1px solid var(--border);
    font-size: 0.62rem; letter-spacing: 0.1em; text-transform: uppercase;
    color: rgba(43,35,24,0.3); background: var(--parch);
  }
`;

const STATUS_FILTERS = ["All", "Success", "Pending", "Failed", "Refunded"];

const METHOD_ICONS = {
  mpesa:  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><rect x="0.5" y="0.5" width="12" height="12" rx="1"/><path d="M3 6.5h7M6.5 3.5v6"/></svg>,
  card:   <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><rect x="0.5" y="2.5" width="12" height="8" rx="1"/><path d="M0.5 5.5h12"/></svg>,
  paypal: <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><path d="M3 2h5a3 3 0 010 6H4l-1 5"/><path d="M5 8h3a3 3 0 010 0"/></svg>,
  stripe: <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><path d="M2 8.5c0 1.1.9 2 2 2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v3.5z"/></svg>,
};

const badgeClass = (status = "") => {
  const s = status.toLowerCase();
  if (s === "success" || s === "completed") return "py-badge success";
  if (s === "pending")  return "py-badge pending";
  if (s === "failed")   return "py-badge failed";
  if (s === "refunded") return "py-badge refunded";
  return "py-badge pending";
};

const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

function SkeletonRows() {
  return Array.from({ length: 5 }).map((_, i) => (
    <div key={i} className="py-skel-row py-skel">
      <div style={{ width: "30px", height: "30px", background: "var(--border)", flexShrink: 0 }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
        <div className="py-skel-line" style={{ width: `${50 + (i * 9) % 30}%` }} />
        <div className="py-skel-line" style={{ width: "30%" }} />
      </div>
      <div className="py-skel-line" style={{ width: "70px" }} />
      <div className="py-skel-line" style={{ width: "55px" }} />
    </div>
  ));
}

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [search,   setSearch]   = useState("");
  const [filter,   setFilter]   = useState("All");

  const fetchPayments = async () => {
    setLoading(true); setError("");
    try {
      const res = await axios.get("/api/payments");
      // Guard: API may return { payments:[] }, { data:[] }, or a plain array
      const raw = res.data;
      const list = Array.isArray(raw)          ? raw
                 : Array.isArray(raw?.payments) ? raw.payments
                 : Array.isArray(raw?.data)     ? raw.data
                 : [];
      setPayments(list);
    } catch {
      setError("Could not load payments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPayments(); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return payments.filter(p => {
      const matchSearch =
        !q ||
        p.method?.toLowerCase().includes(q) ||
        p.user?.fullName?.toLowerCase().includes(q) ||
        p.user?.email?.toLowerCase().includes(q);
      const matchStatus =
        filter === "All" ||
        p.status?.toLowerCase() === filter.toLowerCase() ||
        (filter === "Success" && p.status?.toLowerCase() === "completed");
      return matchSearch && matchStatus;
    });
  }, [payments, search, filter]);

  // Stats
  const total     = payments.length;
  const revenue   = payments.filter(p => ["success","completed"].includes(p.status?.toLowerCase())).reduce((s, p) => s + (p.amount || 0), 0);
  const pending   = payments.filter(p => p.status?.toLowerCase() === "pending").length;
  const failed    = payments.filter(p => p.status?.toLowerCase() === "failed").length;

  return (
    <>
      <style>{STYLES}</style>
      <div className="py-root">

        {/* ── Header ── */}
        <div className="py-header">
          <div>
            <h1 className="py-title">All <em>Payments</em></h1>
            <p className="py-subtitle">{total} transaction{total !== 1 ? "s" : ""} recorded</p>
          </div>
          <button className="py-refresh-btn" onClick={fetchPayments}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
              <path d="M10.5 1.5A5 5 0 1 1 1.5 6"/><path d="M10.5 1.5V5h-3.5"/>
            </svg>
            Refresh
          </button>
        </div>

        {/* ── Stats ── */}
        <div className="py-stats">
          <div className="py-stat">
            <span className="py-stat-label">Total Transactions</span>
            <span className="py-stat-val">{total}</span>
          </div>
          <div className="py-stat">
            <span className="py-stat-label">Revenue Collected</span>
            <span className="py-stat-val bronze">
              {revenue > 0 ? `KES ${revenue.toLocaleString()}` : "—"}
            </span>
          </div>
          <div className="py-stat">
            <span className="py-stat-label">Pending</span>
            <span className="py-stat-val amber">{pending}</span>
          </div>
          <div className="py-stat">
            <span className="py-stat-label">Failed</span>
            <span className="py-stat-val" style={{ color: "var(--red)" }}>{failed}</span>
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div className="py-toolbar">
          <div className="py-search-wrap">
            <span className="py-search-icon">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                <circle cx="5.5" cy="5.5" r="4.5"/><path d="M9.5 9.5l2.5 2.5"/>
              </svg>
            </span>
            <input
              className="py-search"
              placeholder="Search by guest or method…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {STATUS_FILTERS.map(f => (
            <button
              key={f}
              className={`py-filter${filter === f ? " active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* ── Table ── */}
        <div className="py-card">
          {error ? (
            <div className="py-empty"><div className="py-empty-title">{error}</div></div>
          ) : loading ? (
            <SkeletonRows />
          ) : filtered.length === 0 ? (
            <div className="py-empty">
              <div className="py-empty-icon">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="8" width="32" height="22" rx="2"/>
                  <path d="M4 14h32M10 22h4M24 22h6M10 28h8"/>
                </svg>
              </div>
              <div className="py-empty-title">No payments found</div>
            </div>
          ) : (
            <div className="py-table-wrap">
              <table className="py-table">
                <thead>
                  <tr>
                    <th>Method</th>
                    <th>Guest</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => {
                    const methodKey = p.method?.toLowerCase().replace(/\s/g, "");
                    const icon = METHOD_ICONS[methodKey] || METHOD_ICONS.card;
                    const initial = p.user?.fullName?.[0] ?? p.user?.email?.[0] ?? "?";
                    return (
                      <tr key={p._id}>
                        <td>
                          <div className="py-method-cell">
                            <div className="py-method-icon">{icon}</div>
                            <span className="py-method-name">
                              {p.method ?? "—"}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="py-guest-cell">
                            <div className="py-guest-avatar">{initial}</div>
                            <div>
                              <div style={{ fontSize: "0.78rem", color: "var(--bark)" }}>
                                {p.user?.fullName ?? "—"}
                              </div>
                              <div style={{ fontSize: "0.65rem", color: "var(--fog)" }}>
                                {p.user?.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="py-amount">
                            KES {p.amount?.toLocaleString() ?? "—"}
                          </span>
                        </td>
                        <td>
                          <span className="py-date">{formatDate(p.createdAt)}</span>
                        </td>
                        <td>
                          <span className={badgeClass(p.status)}>
                            <span className="py-badge-dot" />
                            {p.status ?? "Pending"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="py-count-bar">
              Showing {filtered.length} of {total} payment{total !== 1 ? "s" : ""}
            </div>
          )}
        </div>

      </div>
    </>
  );
}
