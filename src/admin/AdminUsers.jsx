import React, { useEffect, useState, useMemo } from "react";
import API from "../utils/axios";

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
    --red:       #c0392b;
    --amber:     #e67e22;
    --blue:      #2980b9;
  }

  .au-root { font-family: 'Jost', sans-serif; color: var(--bark); }

  /* ── Header ── */
  .au-header {
    display: flex; align-items: flex-end;
    justify-content: space-between; gap: 1rem;
    margin-bottom: 1.75rem; flex-wrap: wrap;
  }
  .au-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem; font-weight: 300; line-height: 1; letter-spacing: -0.02em;
  }
  .au-title em { font-style: italic; color: var(--bronze); }
  .au-subtitle { font-size: 0.72rem; color: var(--fog); margin-top: 0.3rem; }

  .au-refresh-btn {
    display: flex; align-items: center; gap: 0.5rem;
    font-size: 0.65rem; letter-spacing: 0.16em; text-transform: uppercase;
    color: var(--fog); background: none; border: none; cursor: pointer;
    font-family: 'Jost', sans-serif; transition: color 0.2s;
  }
  .au-refresh-btn:hover { color: var(--bronze); }

  /* ── Stats ── */
  .au-stats {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 1px; background: var(--border); border: 1px solid var(--border);
    margin-bottom: 1.5rem;
  }
  @media (max-width: 700px) { .au-stats { grid-template-columns: repeat(2,1fr); } }

  .au-stat {
    background: var(--white); padding: 1.1rem 1.4rem;
    display: flex; flex-direction: column; gap: 0.25rem;
    position: relative;
  }
  .au-stat::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0;
    height: 2px; background: var(--border); transition: background 0.3s;
  }
  .au-stat:hover::before { background: var(--bronze); }
  .au-stat-label {
    font-size: 0.56rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--fog);
  }
  .au-stat-val {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.8rem; font-weight: 300; line-height: 1;
    letter-spacing: -0.02em; color: var(--bark);
  }
  .au-stat-val.bronze { color: var(--bronze); }
  .au-stat-val.green  { color: var(--green);  }
  .au-stat-val.blue   { color: var(--blue);   }

  /* ── Toolbar ── */
  .au-toolbar {
    display: flex; align-items: center; gap: 0.75rem;
    margin-bottom: 1rem; flex-wrap: wrap;
  }
  .au-search-wrap {
    flex: 1; min-width: 180px;
    display: flex; align-items: center; gap: 0.6rem;
    background: var(--white); border: 1px solid var(--border);
    padding: 0.55rem 0.9rem;
  }
  .au-search-icon { color: var(--fog); flex-shrink: 0; }
  .au-search {
    flex: 1; background: none; border: none; outline: none;
    font-size: 0.78rem; color: var(--bark);
    font-family: 'Jost', sans-serif; caret-color: var(--bronze);
  }
  .au-search::placeholder { color: rgba(43,35,24,0.25); }

  .au-filter {
    padding: 0.55rem 1rem;
    font-size: 0.62rem; letter-spacing: 0.14em; text-transform: uppercase;
    border: 1px solid var(--border); background: var(--white); color: var(--fog);
    cursor: pointer; font-family: 'Jost', sans-serif;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
  }
  .au-filter:hover  { color: var(--bark); border-color: rgba(43,35,24,0.2); }
  .au-filter.active { background: var(--bark); color: #f0ece4; border-color: var(--bark); }

  /* ── Table card ── */
  .au-card {
    background: var(--white); border: 1px solid var(--border); overflow: hidden;
  }
  .au-table-wrap { overflow-x: auto; }

  table.au-table {
    width: 100%; border-collapse: collapse; font-size: 0.78rem;
  }
  .au-table thead tr {
    border-bottom: 1px solid var(--border); background: var(--parch);
  }
  .au-table th {
    padding: 0.75rem 1.25rem;
    font-size: 0.57rem; font-weight: 500;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: rgba(43,35,24,0.4); text-align: left; white-space: nowrap;
  }
  .au-table tbody tr {
    border-bottom: 1px solid var(--border); transition: background 0.2s;
  }
  .au-table tbody tr:last-child { border-bottom: none; }
  .au-table tbody tr:hover { background: #faf8f4; }
  .au-table td { padding: 0.9rem 1.25rem; vertical-align: middle; }

  /* User cell */
  .au-user-cell { display: flex; align-items: center; gap: 0.75rem; }
  .au-avatar {
    width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
    background: rgba(160,116,60,0.12);
    border: 1.5px solid rgba(160,116,60,0.25);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.9rem; font-style: italic; color: var(--bronze);
    position: relative;
  }
  .au-avatar-status {
    position: absolute; bottom: 0; right: 0;
    width: 9px; height: 9px; border-radius: 50%;
    border: 1.5px solid var(--white);
  }
  .au-avatar-status.active   { background: var(--green); }
  .au-avatar-status.inactive { background: var(--fog); }
  .au-avatar-status.suspended{ background: var(--red); }

  .au-user-name  { font-size: 0.82rem; font-weight: 400; color: var(--bark); }
  .au-user-email { font-size: 0.65rem; color: var(--fog); }

  /* Role badge */
  .au-role {
    display: inline-flex; align-items: center; gap: 0.3rem;
    padding: 0.22rem 0.65rem;
    font-size: 0.57rem; letter-spacing: 0.14em; text-transform: uppercase;
    font-weight: 500;
  }
  .au-role.admin { background: rgba(160,116,60,0.12); color: var(--bronze); }
  .au-role.user  { background: rgba(43,35,24,0.06);   color: var(--fog);    }
  .au-role-dot { width: 4px; height: 4px; border-radius: 50%; background: currentColor; }

  /* Join date */
  .au-date { font-size: 0.72rem; color: var(--fog); }

  /* Bookings count */
  .au-bookings-count {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1rem; color: var(--bronze);
  }

  /* Actions */
  .au-row-actions { display: flex; align-items: center; gap: 0.5rem; }
  .au-action-btn {
    height: 28px; padding: 0 0.7rem;
    border: 1px solid var(--border); background: none;
    display: flex; align-items: center; justify-content: center; gap: 0.35rem;
    cursor: pointer; color: var(--fog);
    font-size: 0.6rem; letter-spacing: 0.1em; text-transform: uppercase;
    font-family: 'Jost', sans-serif;
    transition: background 0.2s, color 0.2s, border-color 0.2s;
    white-space: nowrap;
  }
  .au-action-btn.promote:hover  { background: rgba(160,116,60,0.1); color: var(--bronze); border-color: rgba(160,116,60,0.3); }
  .au-action-btn.demote:hover   { background: rgba(43,35,24,0.06);  color: var(--bark-lt); border-color: rgba(43,35,24,0.15); }
  .au-action-btn.suspend:hover  { background: rgba(230,126,34,0.1); color: var(--amber);  border-color: rgba(230,126,34,0.3); }
  .au-action-btn.reinstate:hover{ background: rgba(39,174,96,0.1);  color: var(--green);  border-color: rgba(39,174,96,0.3); }
  .au-action-btn.delete:hover   { background: rgba(192,57,43,0.1);  color: var(--red);    border-color: rgba(192,57,43,0.2); }

  /* ── Skeleton ── */
  .au-skel { animation: shimmer 1.4s ease-in-out infinite; }
  @keyframes shimmer { 0%,100%{opacity:.45} 50%{opacity:1} }
  .au-skel-row {
    display: flex; align-items: center; gap: 1rem;
    padding: 0.9rem 1.25rem; border-bottom: 1px solid var(--border);
  }
  .au-skel-circle { width: 34px; height: 34px; border-radius: 50%; background: var(--border); flex-shrink: 0; }
  .au-skel-line   { height: 10px; background: var(--border); border-radius: 2px; }

  /* ── Empty ── */
  .au-empty {
    padding: 4rem 2rem; text-align: center;
    display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
  }
  .au-empty-icon { color: rgba(43,35,24,0.1); }
  .au-empty-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.2rem; font-style: italic; color: rgba(43,35,24,0.35);
  }

  /* ── Count bar ── */
  .au-count-bar {
    padding: 0.6rem 1.25rem; border-top: 1px solid var(--border);
    font-size: 0.62rem; letter-spacing: 0.1em; text-transform: uppercase;
    color: rgba(43,35,24,0.3); background: var(--parch);
  }

  /* ── Delete modal ── */
  .au-modal-backdrop {
    position: fixed; inset: 0;
    background: rgba(14,15,13,0.65);
    backdrop-filter: blur(4px); z-index: 500;
    display: flex; align-items: center; justify-content: center; padding: 1rem;
  }
  .au-modal {
    background: var(--white); padding: 2rem; max-width: 380px; width: 100%;
  }
  .au-modal-avatar {
    width: 48px; height: 48px; border-radius: 50%;
    background: rgba(160,116,60,0.12); border: 2px solid rgba(160,116,60,0.2);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.3rem; font-style: italic; color: var(--bronze);
    margin-bottom: 1rem;
  }
  .au-modal-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.3rem; font-weight: 400; color: var(--bark); margin-bottom: 0.5rem;
  }
  .au-modal-sub {
    font-size: 0.78rem; color: var(--fog); line-height: 1.6; margin-bottom: 1.5rem;
  }
  .au-modal-btns { display: flex; gap: 0.75rem; }
  .au-modal-cancel {
    flex: 1; padding: 0.7rem;
    font-size: 0.68rem; letter-spacing: 0.14em; text-transform: uppercase;
    background: none; border: 1px solid var(--border);
    color: var(--fog); cursor: pointer; font-family: 'Jost', sans-serif;
    transition: color 0.2s, border-color 0.2s;
  }
  .au-modal-cancel:hover { color: var(--bark); border-color: rgba(43,35,24,0.2); }
  .au-modal-confirm {
    flex: 1; padding: 0.7rem;
    font-size: 0.68rem; letter-spacing: 0.14em; text-transform: uppercase;
    background: var(--red); color: white; border: none;
    cursor: pointer; font-family: 'Jost', sans-serif; font-weight: 500;
    transition: background 0.2s;
  }
  .au-modal-confirm:hover { background: #a93226; }

  /* Toast */
  .au-toast {
    position: fixed; bottom: 2rem; right: 2rem; z-index: 600;
    background: var(--bark); color: var(--parch);
    padding: 0.75rem 1.25rem;
    font-size: 0.72rem; letter-spacing: 0.08em;
    display: flex; align-items: center; gap: 0.6rem;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    animation: toastIn 0.3s ease both;
  }
  @keyframes toastIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const ROLE_FILTERS = ["All", "Admin", "User", "Suspended"];

const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

function SkeletonRows() {
  return Array.from({ length: 6 }).map((_, i) => (
    <div key={i} className="au-skel-row au-skel">
      <div className="au-skel-circle" />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
        <div className="au-skel-line" style={{ width: `${50 + (i * 9) % 30}%` }} />
        <div className="au-skel-line" style={{ width: "38%" }} />
      </div>
      <div className="au-skel-line" style={{ width: "55px" }} />
      <div className="au-skel-line" style={{ width: "80px" }} />
    </div>
  ));
}

export default function AdminUsers() {
  const [users,    setUsers]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [search,   setSearch]   = useState("");
  const [filter,   setFilter]   = useState("All");
  const [toDelete, setToDelete] = useState(null);
  const [toast,    setToast]    = useState("");

  const fetchUsers = async () => {
    setLoading(true); setError("");
    try {
      const res = await API.get("/users");
      const raw = res.data;
      const list = Array.isArray(raw)        ? raw
                 : Array.isArray(raw?.users)  ? raw.users
                 : Array.isArray(raw?.data)   ? raw.data
                 : [];
      setUsers(list);
    } catch {
      setError("Could not load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const updateUser = (id, changes) =>
    setUsers(prev => prev.map(u => u._id === id ? { ...u, ...changes } : u));

  const handlePromote = async (user) => {
    try {
      await API.put(`/users/${user._id}`, { role: "admin" });
      updateUser(user._id, { role: "admin" });
      showToast(`${user.fullName} promoted to Admin`);
    } catch { showToast("Action failed."); }
  };

  const handleDemote = async (user) => {
    try {
      await API.put(`/users/${user._id}`, { role: "user" });
      updateUser(user._id, { role: "user" });
      showToast(`${user.fullName} demoted to User`);
    } catch { showToast("Action failed."); }
  };

  const handleSuspend = async (user) => {
    const suspended = user.suspended !== true;
    try {
      await API.put(`/users/${user._id}`, { suspended });
      updateUser(user._id, { suspended });
      showToast(suspended ? `${user.fullName} suspended` : `${user.fullName} reinstated`);
    } catch { showToast("Action failed."); }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await API.delete(`/users/${toDelete._id}`);
      setUsers(prev => prev.filter(u => u._id !== toDelete._id));
      showToast("User deleted");
    } catch { showToast("Delete failed."); }
    finally { setToDelete(null); }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter(u => {
      const matchSearch =
        !q ||
        u.fullName?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.phone?.toLowerCase().includes(q);
      const matchFilter =
        filter === "All" ||
        (filter === "Admin"     && u.role === "admin") ||
        (filter === "User"      && u.role !== "admin" && !u.suspended) ||
        (filter === "Suspended" && u.suspended);
      return matchSearch && matchFilter;
    });
  }, [users, search, filter]);

  // Stats
  const total     = users.length;
  const admins    = users.filter(u => u.role === "admin").length;
  const suspended = users.filter(u => u.suspended).length;
  const newThisWeek = users.filter(u => {
    if (!u.createdAt) return false;
    const diff = (Date.now() - new Date(u.createdAt)) / 86400000;
    return diff <= 7;
  }).length;

  const statusClass = (u) =>
    u.suspended ? "suspended" : u.lastLogin ? "active" : "inactive";

  return (
    <>
      <style>{STYLES}</style>
      <div className="au-root">

        {/* ── Header ── */}
        <div className="au-header">
          <div>
            <h1 className="au-title">All <em>Users</em></h1>
            <p className="au-subtitle">{total} registered account{total !== 1 ? "s" : ""}</p>
          </div>
          <button className="au-refresh-btn" onClick={fetchUsers}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
              <path d="M10.5 1.5A5 5 0 1 1 1.5 6"/><path d="M10.5 1.5V5h-3.5"/>
            </svg>
            Refresh
          </button>
        </div>

        {/* ── Stats ── */}
        <div className="au-stats">
          <div className="au-stat">
            <span className="au-stat-label">Total Users</span>
            <span className="au-stat-val">{total}</span>
          </div>
          <div className="au-stat">
            <span className="au-stat-label">Admins</span>
            <span className="au-stat-val bronze">{admins}</span>
          </div>
          <div className="au-stat">
            <span className="au-stat-label">New This Week</span>
            <span className="au-stat-val green">{newThisWeek}</span>
          </div>
          <div className="au-stat">
            <span className="au-stat-label">Suspended</span>
            <span className="au-stat-val" style={{ color: suspended > 0 ? "var(--red)" : "var(--fog)" }}>
              {suspended}
            </span>
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div className="au-toolbar">
          <div className="au-search-wrap">
            <span className="au-search-icon">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                <circle cx="5.5" cy="5.5" r="4.5"/><path d="M9.5 9.5l2.5 2.5"/>
              </svg>
            </span>
            <input
              className="au-search"
              placeholder="Search by name, email, phone…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {ROLE_FILTERS.map(f => (
            <button
              key={f}
              className={`au-filter${filter === f ? " active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* ── Table ── */}
        <div className="au-card">
          {error ? (
            <div className="au-empty"><div className="au-empty-title">{error}</div></div>
          ) : loading ? (
            <SkeletonRows />
          ) : filtered.length === 0 ? (
            <div className="au-empty">
              <div className="au-empty-icon">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="16" cy="14" r="7"/>
                  <path d="M4 36c0-7 5-12 12-12s12 5 12 12"/>
                  <path d="M28 8a7 7 0 010 14M36 36c0-5-3-9-8-11"/>
                </svg>
              </div>
              <div className="au-empty-title">No users found</div>
            </div>
          ) : (
            <div className="au-table-wrap">
              <table className="au-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Bookings</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(u => {
                    const initial = u.fullName?.[0] ?? u.email?.[0] ?? "?";
                    const isAdmin = u.role === "admin";
                    const isSuspended = u.suspended === true;
                    return (
                      <tr key={u._id}>

                        {/* User */}
                        <td>
                          <div className="au-user-cell">
                            <div className="au-avatar">
                              {initial}
                              <span className={`au-avatar-status ${statusClass(u)}`} />
                            </div>
                            <div>
                              <div className="au-user-name">
                                {u.fullName ?? "—"}
                                {isSuspended && (
                                  <span style={{ marginLeft:"0.4rem", fontSize:"0.55rem", letterSpacing:"0.14em", textTransform:"uppercase", color:"var(--red)", verticalAlign:"middle" }}>
                                    · Suspended
                                  </span>
                                )}
                              </div>
                              <div className="au-user-email">{u.email}</div>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td>
                          <span className={`au-role ${isAdmin ? "admin" : "user"}`}>
                            <span className="au-role-dot" />
                            {isAdmin ? "Admin" : "User"}
                          </span>
                        </td>

                        {/* Joined */}
                        <td>
                          <span className="au-date">{formatDate(u.createdAt)}</span>
                        </td>

                        {/* Bookings */}
                        <td>
                          <span className="au-bookings-count">
                            {u.bookingsCount ?? u.bookings?.length ?? 0}
                          </span>
                        </td>

                        {/* Actions */}
                        <td>
                          <div className="au-row-actions">
                            {!isAdmin ? (
                              <button className="au-action-btn promote" onClick={() => handlePromote(u)}>
                                ↑ Promote
                              </button>
                            ) : (
                              <button className="au-action-btn demote" onClick={() => handleDemote(u)}>
                                ↓ Demote
                              </button>
                            )}
                            <button
                              className={`au-action-btn ${isSuspended ? "reinstate" : "suspend"}`}
                              onClick={() => handleSuspend(u)}
                            >
                              {isSuspended ? "Reinstate" : "Suspend"}
                            </button>
                            <button
                              className="au-action-btn delete"
                              onClick={() => setToDelete(u)}
                              aria-label="Delete user"
                            >
                              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1.5 3h8M4 3V2h3v1M9 3l-.5 7h-5L3 3"/>
                              </svg>
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="au-count-bar">
              Showing {filtered.length} of {total} user{total !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        {/* ── Delete modal ── */}
        {toDelete && (
          <div className="au-modal-backdrop" onClick={() => setToDelete(null)}>
            <div className="au-modal" onClick={e => e.stopPropagation()}>
              <div className="au-modal-avatar">
                {toDelete.fullName?.[0] ?? toDelete.email?.[0] ?? "?"}
              </div>
              <div className="au-modal-title">Delete User</div>
              <p className="au-modal-sub">
                Are you sure you want to permanently delete{" "}
                <strong style={{ color: "var(--bark-lt)" }}>{toDelete.fullName ?? toDelete.email}</strong>?
                All their data and bookings will be lost.
              </p>
              <div className="au-modal-btns">
                <button className="au-modal-cancel" onClick={() => setToDelete(null)}>Cancel</button>
                <button className="au-modal-confirm" onClick={handleDelete}>Delete</button>
              </div>
            </div>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div className="au-toast">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
              <circle cx="6" cy="6" r="5"/><path d="M4 6l1.5 1.5L8 4"/>
            </svg>
            {toast}
          </div>
        )}

      </div>
    </>
  );
}