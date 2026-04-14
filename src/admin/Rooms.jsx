import React, { useEffect, useState } from "react";
import API from "../utils/axios";
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
    --red:       #c0392b;
  }

  .rm-root { font-family: 'Jost', sans-serif; color: var(--bark); }

  /* ── Page header ── */
  .rm-header {
    display: flex; align-items: flex-end;
    justify-content: space-between; gap: 1rem;
    margin-bottom: 1.75rem; flex-wrap: wrap;
  }
  .rm-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem; font-weight: 300; line-height: 1;
    letter-spacing: -0.02em;
  }
  .rm-title em { font-style: italic; color: var(--bronze); }
  .rm-subtitle { font-size: 0.72rem; color: var(--fog); margin-top: 0.3rem; }

  .rm-add-btn {
    display: inline-flex; align-items: center; gap: 0.6rem;
    padding: 0.65rem 1.4rem;
    background: var(--bark); color: var(--parch);
    border: none; cursor: pointer;
    font-family: 'Jost', sans-serif;
    font-size: 0.68rem; letter-spacing: 0.18em; text-transform: uppercase;
    font-weight: 500; text-decoration: none;
    position: relative; overflow: hidden;
    transition: background 0.25s;
  }
  .rm-add-btn::before {
    content: '';
    position: absolute; inset: 0;
    background: var(--bronze);
    transform: translateX(-101%);
    transition: transform 0.3s ease;
    z-index: 0;
  }
  .rm-add-btn:hover::before { transform: translateX(0); }
  .rm-add-btn > * { position: relative; z-index: 1; }

  /* ── Stats bar ── */
  .rm-stats {
    display: flex; gap: 1px; background: var(--border);
    border: 1px solid var(--border); margin-bottom: 1.5rem;
    overflow: hidden;
  }
  .rm-stat {
    flex: 1; background: var(--white);
    padding: 1rem 1.25rem;
    display: flex; flex-direction: column; gap: 0.2rem;
  }
  .rm-stat-label {
    font-size: 0.55rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--fog);
  }
  .rm-stat-val {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.75rem; font-weight: 300; color: var(--bark);
    line-height: 1; letter-spacing: -0.02em;
  }
  .rm-stat-val.bronze { color: var(--bronze); }
  @media (max-width: 600px) { .rm-stats { flex-wrap: wrap; } .rm-stat { min-width: 50%; } }

  /* ── Toolbar ── */
  .rm-toolbar {
    display: flex; align-items: center; gap: 0.75rem;
    margin-bottom: 1.25rem; flex-wrap: wrap;
  }
  .rm-search-wrap {
    flex: 1; min-width: 180px;
    display: flex; align-items: center; gap: 0.6rem;
    background: var(--white); border: 1px solid var(--border);
    padding: 0.55rem 0.9rem;
  }
  .rm-search-icon { color: var(--fog); flex-shrink: 0; }
  .rm-search {
    flex: 1; background: none; border: none; outline: none;
    font-size: 0.78rem; color: var(--bark);
    font-family: 'Jost', sans-serif; caret-color: var(--bronze);
  }
  .rm-search::placeholder { color: rgba(43,35,24,0.25); }

  /* ── Grid ── */
  .rm-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px; background: var(--border);
    border: 1px solid var(--border);
  }
  @media (max-width: 900px) { .rm-grid { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 520px)  { .rm-grid { grid-template-columns: 1fr; } }

  /* ── Room card ── */
  .rm-card {
    background: var(--white);
    position: relative; overflow: hidden;
  }

  /* Image */
  .rm-card-img-wrap {
    position: relative; height: 160px; overflow: hidden;
  }
  .rm-card-img {
    width: 100%; height: 100%; object-fit: cover; display: block;
    transition: transform 0.6s ease;
  }
  .rm-card:hover .rm-card-img { transform: scale(1.05); }

  /* Image overlay with actions */
  .rm-card-overlay {
    position: absolute; inset: 0;
    background: rgba(14,15,13,0.55);
    display: flex; align-items: center; justify-content: center; gap: 0.65rem;
    opacity: 0; transition: opacity 0.3s;
  }
  .rm-card:hover .rm-card-overlay { opacity: 1; }

  .rm-overlay-btn {
    display: flex; align-items: center; gap: 0.4rem;
    padding: 0.5rem 1rem;
    font-size: 0.62rem; letter-spacing: 0.16em; text-transform: uppercase;
    border: none; cursor: pointer;
    font-family: 'Jost', sans-serif; font-weight: 500;
    transition: background 0.2s, color 0.2s;
  }
  .rm-overlay-btn.edit {
    background: var(--white); color: var(--bark);
  }
  .rm-overlay-btn.edit:hover { background: var(--parch); }
  .rm-overlay-btn.delete {
    background: rgba(192,57,43,0.9); color: var(--white);
  }
  .rm-overlay-btn.delete:hover { background: var(--red); }

  /* Status badge */
  .rm-card-badge {
    position: absolute; top: 0.75rem; left: 0.75rem;
    font-size: 0.55rem; letter-spacing: 0.16em; text-transform: uppercase;
    padding: 0.2rem 0.55rem; font-weight: 500;
    display: flex; align-items: center; gap: 0.3rem;
  }
  .rm-card-badge.available  { background: rgba(39,174,96,0.9);  color: white; }
  .rm-card-badge.unavailable{ background: rgba(192,57,43,0.9);  color: white; }

  .rm-badge-dot { width: 4px; height: 4px; border-radius: 50%; background: currentColor; opacity: 0.7; }

  /* Card body */
  .rm-card-body { padding: 1rem 1.25rem; }

  .rm-card-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.15rem; font-weight: 400; color: var(--bark);
    line-height: 1.2; margin-bottom: 0.35rem;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  .rm-card-meta {
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 0.5rem;
  }
  .rm-card-price {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1rem; color: var(--bronze); font-weight: 400;
  }
  .rm-card-occ {
    font-size: 0.62rem; letter-spacing: 0.06em; color: var(--fog);
    display: flex; align-items: center; gap: 0.25rem;
  }

  /* ── Delete confirm modal ── */
  .rm-modal-backdrop {
    position: fixed; inset: 0;
    background: rgba(14,15,13,0.65);
    backdrop-filter: blur(4px);
    z-index: 500;
    display: flex; align-items: center; justify-content: center;
    padding: 1rem;
  }
  .rm-modal {
    background: var(--white);
    padding: 2rem; max-width: 360px; width: 100%;
    position: relative;
  }
  .rm-modal-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.35rem; font-weight: 400; color: var(--bark);
    margin-bottom: 0.5rem;
  }
  .rm-modal-sub {
    font-size: 0.78rem; color: var(--fog); line-height: 1.6;
    margin-bottom: 1.5rem;
  }
  .rm-modal-sub strong { color: var(--bark-lt); font-weight: 500; }
  .rm-modal-btns { display: flex; gap: 0.75rem; }
  .rm-modal-cancel {
    flex: 1; padding: 0.7rem;
    font-size: 0.68rem; letter-spacing: 0.14em; text-transform: uppercase;
    background: none; border: 1px solid var(--border);
    color: var(--fog); cursor: pointer; font-family: 'Jost', sans-serif;
    transition: color 0.2s, border-color 0.2s;
  }
  .rm-modal-cancel:hover { color: var(--bark); border-color: rgba(43,35,24,0.2); }
  .rm-modal-confirm {
    flex: 1; padding: 0.7rem;
    font-size: 0.68rem; letter-spacing: 0.14em; text-transform: uppercase;
    background: var(--red); color: white; border: none; cursor: pointer;
    font-family: 'Jost', sans-serif; font-weight: 500;
    transition: background 0.2s;
  }
  .rm-modal-confirm:hover { background: #a93226; }

  /* ── Skeleton ── */
  .rm-skel { animation: shimmer 1.4s ease-in-out infinite; }
  @keyframes shimmer { 0%,100%{opacity:.45} 50%{opacity:1} }
  .rm-skel-card { background: var(--white); }
  .rm-skel-img  { height: 160px; background: var(--border); }
  .rm-skel-body { padding: 1rem 1.25rem; display: flex; flex-direction: column; gap: 8px; }
  .rm-skel-line { height: 10px; background: var(--border); border-radius: 2px; }

  /* ── Empty ── */
  .rm-empty {
    grid-column: 1/-1; padding: 4rem;
    display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
    background: var(--white);
  }
  .rm-empty-icon { color: rgba(43,35,24,0.1); }
  .rm-empty-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.2rem; font-style: italic; color: rgba(43,35,24,0.35);
  }

  /* Count bar */
  .rm-count-bar {
    padding: 0.6rem 1.25rem; border-top: 1px solid var(--border);
    font-size: 0.62rem; letter-spacing: 0.1em; text-transform: uppercase;
    color: rgba(43,35,24,0.3); background: var(--parch);
    border: 1px solid var(--border); border-top: none;
  }
`;

function SkeletonCards() {
  return Array.from({ length: 6 }).map((_, i) => (
    <div key={i} className="rm-skel-card rm-skel">
      <div className="rm-skel-img" />
      <div className="rm-skel-body">
        <div className="rm-skel-line" style={{ width: "65%" }} />
        <div className="rm-skel-line" style={{ width: "40%" }} />
      </div>
    </div>
  ));
}

export default function Rooms() {
  const [rooms,   setRooms]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [search,  setSearch]  = useState("");
  const [toDelete, setToDelete] = useState(null); // room object

  const fetchRooms = async () => {
    setLoading(true); setError("");
    try {
      // ✅ Fixed typo: accomodation → accommodations
      const res = await API.get("/accommodations");
      setRooms(res.data);
    } catch {
      setError("Could not load rooms.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRooms(); }, []);

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await API.delete(`/accommodations/${toDelete._id}`);
      setRooms(prev => prev.filter(r => r._id !== toDelete._id));
    } catch {
      alert("Delete failed.");
    } finally {
      setToDelete(null);
    }
  };

  const filtered = rooms.filter(r =>
    !search || r.name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = rooms.reduce((s, r) => s + (r.price || 0), 0);
  const available    = rooms.filter(r => r.available !== false).length;

  return (
    <>
      <style>{STYLES}</style>
      <div className="rm-root">

        {/* ── Header ── */}
        <div className="rm-header">
          <div>
            <h1 className="rm-title">All <em>Rooms</em></h1>
            <p className="rm-subtitle">{rooms.length} room{rooms.length !== 1 ? "s" : ""} listed</p>
          </div>
          <Link to="/admin/rooms/add" className="rm-add-btn">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M6 1v10M1 6h10"/>
            </svg>
            Add Room
          </Link>
        </div>

        {/* ── Stats ── */}
        <div className="rm-stats">
          <div className="rm-stat">
            <span className="rm-stat-label">Total Rooms</span>
            <span className="rm-stat-val">{rooms.length}</span>
          </div>
          <div className="rm-stat">
            <span className="rm-stat-label">Available</span>
            <span className="rm-stat-val" style={{ color: "var(--green)" }}>{available}</span>
          </div>
          <div className="rm-stat">
            <span className="rm-stat-label">Unavailable</span>
            <span className="rm-stat-val" style={{ color: "var(--red)" }}>{rooms.length - available}</span>
          </div>
          <div className="rm-stat">
            <span className="rm-stat-label">Avg. Rate</span>
            <span className="rm-stat-val bronze">
              {rooms.length ? `KES ${Math.round(totalRevenue / rooms.length).toLocaleString()}` : "—"}
            </span>
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div className="rm-toolbar">
          <div className="rm-search-wrap">
            <span className="rm-search-icon">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                <circle cx="5.5" cy="5.5" r="4.5"/><path d="M9.5 9.5l2.5 2.5"/>
              </svg>
            </span>
            <input
              className="rm-search"
              placeholder="Search rooms…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button
            style={{ padding:"0.55rem 1rem", fontSize:"0.65rem", letterSpacing:"0.14em", textTransform:"uppercase", border:"1px solid var(--border)", background:"var(--white)", color:"var(--fog)", cursor:"pointer", fontFamily:"'Jost', sans-serif" }}
            onClick={fetchRooms}
          >
            Refresh
          </button>
        </div>

        {/* ── Grid ── */}
        <div className="rm-grid">
          {loading ? (
            <SkeletonCards />
          ) : error ? (
            <div className="rm-empty">
              <div className="rm-empty-title">{error}</div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rm-empty">
              <div className="rm-empty-icon">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
                  <path d="M5 35V16L20 5l15 11v19H5z"/><rect x="14" y="22" width="5" height="13"/><rect x="21" y="22" width="5" height="13"/>
                </svg>
              </div>
              <div className="rm-empty-title">No rooms found</div>
            </div>
          ) : (
            filtered.map(room => (
              <div key={room._id} className="rm-card">

                {/* Image */}
                <div className="rm-card-img-wrap">
                  <img
                    src={room.images?.[0] || "https://via.placeholder.com/400x200"}
                    alt={room.name}
                    className="rm-card-img"
                  />

                  {/* Status badge */}
                  <div className={`rm-card-badge ${room.available === false ? "unavailable" : "available"}`}>
                    <span className="rm-badge-dot" />
                    {room.available === false ? "Unavailable" : "Available"}
                  </div>

                  {/* Hover overlay actions */}
                  <div className="rm-card-overlay">
                    <Link to={`/admin/rooms/edit/${room._id}`} className="rm-overlay-btn edit">
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7.5 1.5l2 2-6 6H1.5v-2l6-6z"/>
                      </svg>
                      Edit
                    </Link>
                    <button
                      className="rm-overlay-btn delete"
                      onClick={() => setToDelete(room)}
                    >
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1.5 3h8M4 3V2h3v1M9 3l-.5 7h-5L3 3"/>
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="rm-card-body">
                  <div className="rm-card-name">{room.name}</div>
                  <div className="rm-card-meta">
                    <span className="rm-card-price">KES {room.price?.toLocaleString()}<span style={{ fontSize:"0.65rem", color:"var(--fog)", fontFamily:"'Jost', sans-serif" }}> /night</span></span>
                    {room.occupancy && (
                      <span className="rm-card-occ">👤 {room.occupancy}</span>
                    )}
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

        {/* Count bar */}
        {!loading && !error && filtered.length > 0 && (
          <div className="rm-count-bar">
            Showing {filtered.length} of {rooms.length} room{rooms.length !== 1 ? "s" : ""}
          </div>
        )}

        {/* ── Delete confirmation modal ── */}
        {toDelete && (
          <div className="rm-modal-backdrop" onClick={() => setToDelete(null)}>
            <div className="rm-modal" onClick={e => e.stopPropagation()}>
              <div className="rm-modal-title">Delete Room</div>
              <p className="rm-modal-sub">
                Are you sure you want to delete <strong>{toDelete.name}</strong>?
                This action cannot be undone.
              </p>
              <div className="rm-modal-btns">
                <button className="rm-modal-cancel" onClick={() => setToDelete(null)}>Cancel</button>
                <button className="rm-modal-confirm" onClick={handleDelete}>Delete</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}