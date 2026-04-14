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
    --red:       #c0392b;
    --amber:     #e67e22;
  }

  .af-root { font-family: 'Jost', sans-serif; color: var(--bark); }

  /* ── Header ── */
  .af-header {
    display: flex; align-items: flex-end;
    justify-content: space-between; gap: 1rem;
    margin-bottom: 1.75rem; flex-wrap: wrap;
  }
  .af-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem; font-weight: 300; line-height: 1; letter-spacing: -0.02em;
  }
  .af-title em { font-style: italic; color: var(--bronze); }
  .af-subtitle { font-size: 0.72rem; color: var(--fog); margin-top: 0.3rem; }

  .af-add-btn {
    display: inline-flex; align-items: center; gap: 0.6rem;
    padding: 0.65rem 1.4rem;
    background: var(--bark); color: var(--parch);
    border: none; cursor: pointer;
    font-family: 'Jost', sans-serif;
    font-size: 0.68rem; letter-spacing: 0.18em; text-transform: uppercase;
    font-weight: 500; position: relative; overflow: hidden;
    transition: background 0.25s;
  }
  .af-add-btn::before {
    content: ''; position: absolute; inset: 0;
    background: var(--bronze); transform: translateX(-101%);
    transition: transform 0.3s ease; z-index: 0;
  }
  .af-add-btn:hover::before { transform: translateX(0); }
  .af-add-btn > * { position: relative; z-index: 1; }

  /* ── Stats ── */
  .af-stats {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 1px; background: var(--border); border: 1px solid var(--border);
    margin-bottom: 1.5rem;
  }
  @media (max-width: 700px) { .af-stats { grid-template-columns: repeat(2,1fr); } }

  .af-stat {
    background: var(--white); padding: 1.1rem 1.4rem;
    display: flex; flex-direction: column; gap: 0.25rem;
    position: relative;
  }
  .af-stat::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0;
    height: 2px; background: var(--border); transition: background 0.3s;
  }
  .af-stat:hover::before { background: var(--bronze); }
  .af-stat-label {
    font-size: 0.56rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--fog);
  }
  .af-stat-val {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.8rem; font-weight: 300; line-height: 1;
    letter-spacing: -0.02em; color: var(--bark);
  }
  .af-stat-val.bronze { color: var(--bronze); }
  .af-stat-val.green  { color: var(--green);  }
  .af-stat-val.amber  { color: var(--amber);  }

  /* ── Toolbar ── */
  .af-toolbar {
    display: flex; align-items: center; gap: 0.75rem;
    margin-bottom: 1rem; flex-wrap: wrap;
  }
  .af-search-wrap {
    flex: 1; min-width: 180px;
    display: flex; align-items: center; gap: 0.6rem;
    background: var(--white); border: 1px solid var(--border);
    padding: 0.55rem 0.9rem;
  }
  .af-search-icon { color: var(--fog); flex-shrink: 0; }
  .af-search {
    flex: 1; background: none; border: none; outline: none;
    font-size: 0.78rem; color: var(--bark);
    font-family: 'Jost', sans-serif; caret-color: var(--bronze);
  }
  .af-search::placeholder { color: rgba(43,35,24,0.25); }

  .af-filter {
    padding: 0.55rem 1rem;
    font-size: 0.62rem; letter-spacing: 0.14em; text-transform: uppercase;
    border: 1px solid var(--border); background: var(--white); color: var(--fog);
    cursor: pointer; font-family: 'Jost', sans-serif;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
  }
  .af-filter:hover  { color: var(--bark); border-color: rgba(43,35,24,0.2); }
  .af-filter.active { background: var(--bark); color: #f0ece4; border-color: var(--bark); }

  /* ── Table ── */
  .af-card {
    background: var(--white); border: 1px solid var(--border); overflow: hidden;
  }
  .af-table-wrap { overflow-x: auto; }

  table.af-table {
    width: 100%; border-collapse: collapse; font-size: 0.78rem;
  }
  .af-table thead tr {
    border-bottom: 1px solid var(--border); background: var(--parch);
  }
  .af-table th {
    padding: 0.75rem 1.25rem;
    font-size: 0.57rem; font-weight: 500;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: rgba(43,35,24,0.4); text-align: left; white-space: nowrap;
  }
  .af-table tbody tr {
    border-bottom: 1px solid var(--border); transition: background 0.2s;
  }
  .af-table tbody tr:last-child { border-bottom: none; }
  .af-table tbody tr:hover { background: #faf8f4; }
  .af-table td { padding: 0.95rem 1.25rem; vertical-align: middle; }

  /* Icon cell */
  .af-icon-cell {
    width: 36px; height: 36px;
    border: 1px solid var(--border); background: var(--parch);
    display: flex; align-items: center; justify-content: center;
    color: var(--bronze); flex-shrink: 0;
  }

  /* Name cell */
  .af-name-cell { display: flex; align-items: center; gap: 0.75rem; }
  .af-name { font-size: 0.82rem; font-weight: 400; color: var(--bark); }
  .af-desc { font-size: 0.65rem; color: var(--fog); margin-top: 0.1rem; }

  /* Category badge */
  .af-cat {
    display: inline-block;
    padding: 0.2rem 0.6rem;
    font-size: 0.57rem; letter-spacing: 0.14em; text-transform: uppercase;
    background: rgba(160,116,60,0.08); color: var(--bronze);
  }

  /* Toggle */
  .af-toggle-wrap {
    display: flex; align-items: center; gap: 0.6rem;
  }
  .af-toggle {
    width: 36px; height: 20px; border-radius: 10px;
    position: relative; cursor: pointer; border: none;
    transition: background 0.25s; flex-shrink: 0;
    background: var(--border);
  }
  .af-toggle.on { background: var(--green); }
  .af-toggle::after {
    content: ''; position: absolute;
    top: 3px; left: 3px;
    width: 14px; height: 14px;
    background: white; border-radius: 50%;
    transition: transform 0.25s ease;
  }
  .af-toggle.on::after { transform: translateX(16px); }
  .af-toggle-label {
    font-size: 0.65rem; letter-spacing: 0.06em;
    color: var(--fog);
  }

  /* Row actions */
  .af-row-actions { display: flex; align-items: center; gap: 0.5rem; }
  .af-action-btn {
    width: 28px; height: 28px;
    border: 1px solid var(--border); background: none;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--fog);
    transition: background 0.2s, color 0.2s, border-color 0.2s;
  }
  .af-action-btn.edit:hover   { background: var(--parch); color: var(--bark); border-color: rgba(43,35,24,0.2); }
  .af-action-btn.delete:hover { background: rgba(192,57,43,0.1); color: var(--red); border-color: rgba(192,57,43,0.2); }

  /* ── Skeleton ── */
  .af-skel { animation: shimmer 1.4s ease-in-out infinite; }
  @keyframes shimmer { 0%,100%{opacity:.45} 50%{opacity:1} }
  .af-skel-row { display:flex; align-items:center; gap:1rem; padding:0.95rem 1.25rem; border-bottom:1px solid var(--border); }
  .af-skel-sq  { width:36px; height:36px; background:var(--border); flex-shrink:0; }
  .af-skel-line{ height:10px; background:var(--border); border-radius:2px; }

  /* ── Empty ── */
  .af-empty {
    padding: 4rem 2rem; text-align: center;
    display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
  }
  .af-empty-icon { color: rgba(43,35,24,0.1); }
  .af-empty-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.2rem; font-style: italic; color: rgba(43,35,24,0.35);
  }

  /* ── Count bar ── */
  .af-count-bar {
    padding: 0.6rem 1.25rem; border-top: 1px solid var(--border);
    font-size: 0.62rem; letter-spacing: 0.1em; text-transform: uppercase;
    color: rgba(43,35,24,0.3); background: var(--parch);
  }

  /* ══════════════════════
     MODAL
  ══════════════════════ */
  .af-modal-backdrop {
    position: fixed; inset: 0;
    background: rgba(14,15,13,0.65);
    backdrop-filter: blur(4px); z-index: 500;
    display: flex; align-items: center; justify-content: center; padding: 1rem;
  }
  .af-modal {
    background: var(--white); padding: 0;
    max-width: 460px; width: 100%; overflow: hidden;
  }
  .af-modal-head {
    padding: 1.4rem 1.75rem;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }
  .af-modal-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.3rem; font-weight: 400; color: var(--bark);
  }
  .af-modal-title em { font-style: italic; color: var(--bronze); }
  .af-modal-close {
    width: 28px; height: 28px; border: 1px solid var(--border);
    background: none; cursor: pointer; color: var(--fog);
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem; transition: color 0.2s;
  }
  .af-modal-close:hover { color: var(--bark); }

  .af-modal-body { padding: 1.5rem 1.75rem; display: flex; flex-direction: column; gap: 1.25rem; }

  .af-field { display: flex; flex-direction: column; gap: 0.4rem; }
  .af-label {
    font-size: 0.6rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: rgba(43,35,24,0.35);
  }
  .af-input-wrap {
    border-bottom: 1px solid var(--border); padding-bottom: 0.6rem;
    transition: border-color 0.3s;
  }
  .af-input-wrap:focus-within { border-color: var(--bronze); }
  .af-input, .af-select, .af-textarea {
    width: 100%; background: none; border: none; outline: none;
    font-family: 'Cormorant Garamond', serif;
    font-size: 1rem; font-style: italic; color: var(--bark);
    caret-color: var(--bronze); resize: none;
  }
  .af-select { font-style: normal; font-family: 'Jost', sans-serif; font-size: 0.82rem; }
  .af-input::placeholder, .af-textarea::placeholder { color: rgba(43,35,24,0.2); font-style: italic; }

  .af-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

  .af-modal-foot {
    padding: 1rem 1.75rem; border-top: 1px solid var(--border);
    display: flex; gap: 0.75rem; justify-content: flex-end;
  }
  .af-modal-cancel {
    padding: 0.65rem 1.4rem;
    font-size: 0.68rem; letter-spacing: 0.14em; text-transform: uppercase;
    background: none; border: 1px solid var(--border);
    color: var(--fog); cursor: pointer; font-family: 'Jost', sans-serif;
    transition: color 0.2s, border-color 0.2s;
  }
  .af-modal-cancel:hover { color: var(--bark); border-color: rgba(43,35,24,0.2); }
  .af-modal-save {
    padding: 0.65rem 1.75rem;
    font-size: 0.68rem; letter-spacing: 0.18em; text-transform: uppercase;
    background: var(--bark); color: var(--parch); border: none;
    cursor: pointer; font-family: 'Jost', sans-serif; font-weight: 500;
    transition: background 0.25s;
  }
  .af-modal-save:hover { background: var(--bronze); }

  /* Delete confirm */
  .af-del-modal {
    background: var(--white); padding: 2rem; max-width: 360px; width: 100%;
  }
  .af-del-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.3rem; font-weight: 400; margin-bottom: 0.5rem;
  }
  .af-del-sub {
    font-size: 0.78rem; color: var(--fog); line-height: 1.6; margin-bottom: 1.5rem;
  }
  .af-del-btns { display: flex; gap: 0.75rem; }
  .af-del-cancel {
    flex: 1; padding: 0.7rem;
    font-size: 0.68rem; letter-spacing: 0.14em; text-transform: uppercase;
    background: none; border: 1px solid var(--border);
    color: var(--fog); cursor: pointer; font-family: 'Jost', sans-serif;
    transition: color 0.2s, border-color 0.2s;
  }
  .af-del-cancel:hover { color: var(--bark); }
  .af-del-confirm {
    flex: 1; padding: 0.7rem;
    font-size: 0.68rem; letter-spacing: 0.14em; text-transform: uppercase;
    background: var(--red); color: white; border: none;
    cursor: pointer; font-family: 'Jost', sans-serif; font-weight: 500;
  }
  .af-del-confirm:hover { background: #a93226; }

  /* Toast */
  .af-toast {
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

const CATEGORIES = ["All", "Leisure", "Wellness", "Dining", "Business", "Transport", "In-Room"];
const FACILITY_CATS = CATEGORIES.slice(1);

const BLANK = { name: "", description: "", category: "Leisure", available: true };

// Preset SVG icons for facilities
const ICONS = {
  pool:       <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" width="16" height="16"><path d="M2 8c2-2 4-2 6 0s4 2 6 0"/><path d="M2 12c2-2 4-2 6 0s4 2 6 0"/><circle cx="8" cy="4" r="1.5"/><path d="M8 5.5v2"/></svg>,
  spa:        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" width="16" height="16"><path d="M8 14c3-3 5-6 5-9A5 5 0 0 0 3 5c0 3 2 6 5 9z"/></svg>,
  gym:        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" width="16" height="16"><path d="M5 4v8M11 4v8M3 6h4m2 0h4M3 10h4m2 0h4"/></svg>,
  wifi:       <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" width="16" height="16"><path d="M4 9a5 5 0 018 0"/><path d="M2 7a8 8 0 0112 0"/><circle cx="8" cy="12" r="1" fill="currentColor"/></svg>,
  default:    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" width="16" height="16"><circle cx="8" cy="8" r="1.5"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.5 3.5l1.4 1.4M11.1 11.1l1.4 1.4M11.1 4.9l1.4-1.4M3.5 12.5l1.4-1.4"/></svg>,
};

const getIcon = (name = "") => {
  const n = name.toLowerCase();
  if (n.includes("pool") || n.includes("swim")) return ICONS.pool;
  if (n.includes("spa") || n.includes("wellness")) return ICONS.spa;
  if (n.includes("gym") || n.includes("fitness")) return ICONS.gym;
  if (n.includes("wifi") || n.includes("internet")) return ICONS.wifi;
  return ICONS.default;
};

function SkeletonRows() {
  return Array.from({ length: 5 }).map((_, i) => (
    <div key={i} className="af-skel-row af-skel">
      <div className="af-skel-sq" />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
        <div className="af-skel-line" style={{ width: `${50 + (i * 8) % 30}%` }} />
        <div className="af-skel-line" style={{ width: "35%" }} />
      </div>
      <div className="af-skel-line" style={{ width: "60px" }} />
      <div className="af-skel-line" style={{ width: "50px" }} />
    </div>
  ));
}

export default function AdminFacilities() {
  const [facilities, setFacilities] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");
  const [search,     setSearch]     = useState("");
  const [filter,     setFilter]     = useState("All");
  const [modal,      setModal]      = useState(null);    // null | "add" | "edit"
  const [form,       setForm]       = useState(BLANK);
  const [editId,     setEditId]     = useState(null);
  const [toDelete,   setToDelete]   = useState(null);
  const [saving,     setSaving]     = useState(false);
  const [toast,      setToast]      = useState("");

  const fetchFacilities = async () => {
    setLoading(true); setError("");
    try {
      const res = await axios.get("/api/facilities");
      const raw = res.data;
      const list = Array.isArray(raw)             ? raw
                 : Array.isArray(raw?.facilities)  ? raw.facilities
                 : Array.isArray(raw?.data)         ? raw.data
                 : [];
      setFacilities(list);
    } catch {
      setError("Could not load facilities.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFacilities(); }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const openAdd = () => {
    setForm(BLANK); setEditId(null); setModal("add");
  };
  const openEdit = (f) => {
    setForm({ name: f.name, description: f.description ?? "", category: f.category ?? "Leisure", available: f.available !== false });
    setEditId(f._id); setModal("edit");
  };
  const closeModal = () => { setModal(null); setForm(BLANK); setEditId(null); };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      if (modal === "add") {
        const res = await axios.post("/api/facilities", form);
        setFacilities(prev => [...prev, res.data]);
        showToast("Facility added");
      } else {
        const res = await axios.put(`/api/facilities/${editId}`, form);
        setFacilities(prev => prev.map(f => f._id === editId ? res.data : f));
        showToast("Facility updated");
      }
      closeModal();
    } catch {
      showToast("Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (facility) => {
    const updated = { ...facility, available: !facility.available };
    try {
      await axios.put(`/api/facilities/${facility._id}`, { available: updated.available });
      setFacilities(prev => prev.map(f => f._id === facility._id ? updated : f));
    } catch {
      showToast("Toggle failed.");
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await axios.delete(`/api/facilities/${toDelete._id}`);
      setFacilities(prev => prev.filter(f => f._id !== toDelete._id));
      showToast("Facility deleted");
    } catch {
      showToast("Delete failed.");
    } finally {
      setToDelete(null);
    }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return facilities.filter(f => {
      const matchSearch = !q || f.name?.toLowerCase().includes(q) || f.description?.toLowerCase().includes(q);
      const matchFilter = filter === "All" || f.category === filter;
      return matchSearch && matchFilter;
    });
  }, [facilities, search, filter]);

  const total     = facilities.length;
  const available = facilities.filter(f => f.available !== false).length;
  const catCounts = FACILITY_CATS.reduce((acc, c) => { acc[c] = facilities.filter(f => f.category === c).length; return acc; }, {});
  const topCat    = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

  return (
    <>
      <style>{STYLES}</style>
      <div className="af-root">

        {/* ── Header ── */}
        <div className="af-header">
          <div>
            <h1 className="af-title">All <em>Facilities</em></h1>
            <p className="af-subtitle">{total} facilit{total !== 1 ? "ies" : "y"} listed</p>
          </div>
          <button className="af-add-btn" onClick={openAdd}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M6 1v10M1 6h10"/>
            </svg>
            Add Facility
          </button>
        </div>

        {/* ── Stats ── */}
        <div className="af-stats">
          <div className="af-stat">
            <span className="af-stat-label">Total</span>
            <span className="af-stat-val">{total}</span>
          </div>
          <div className="af-stat">
            <span className="af-stat-label">Available</span>
            <span className="af-stat-val green">{available}</span>
          </div>
          <div className="af-stat">
            <span className="af-stat-label">Unavailable</span>
            <span className="af-stat-val amber">{total - available}</span>
          </div>
          <div className="af-stat">
            <span className="af-stat-label">Top Category</span>
            <span className="af-stat-val bronze" style={{ fontSize: "1.2rem" }}>{topCat}</span>
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div className="af-toolbar">
          <div className="af-search-wrap">
            <span className="af-search-icon">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                <circle cx="5.5" cy="5.5" r="4.5"/><path d="M9.5 9.5l2.5 2.5"/>
              </svg>
            </span>
            <input
              className="af-search"
              placeholder="Search facilities…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {CATEGORIES.map(c => (
            <button key={c} className={`af-filter${filter === c ? " active" : ""}`} onClick={() => setFilter(c)}>
              {c}
            </button>
          ))}
        </div>

        {/* ── Table ── */}
        <div className="af-card">
          {error ? (
            <div className="af-empty"><div className="af-empty-title">{error}</div></div>
          ) : loading ? (
            <SkeletonRows />
          ) : filtered.length === 0 ? (
            <div className="af-empty">
              <div className="af-empty-icon">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
                  <circle cx="20" cy="20" r="4"/><path d="M20 4v4M20 32v4M4 20h4M32 20h4M8.3 8.3l2.8 2.8M28.9 28.9l2.8 2.8M28.9 11.1l2.8-2.8M8.3 31.7l2.8-2.8"/>
                </svg>
              </div>
              <div className="af-empty-title">No facilities found</div>
            </div>
          ) : (
            <div className="af-table-wrap">
              <table className="af-table">
                <thead>
                  <tr>
                    <th>Facility</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(f => (
                    <tr key={f._id}>
                      <td>
                        <div className="af-name-cell">
                          <div className="af-icon-cell">{getIcon(f.name)}</div>
                          <div>
                            <div className="af-name">{f.name}</div>
                            {f.description && <div className="af-desc">{f.description}</div>}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="af-cat">{f.category ?? "—"}</span>
                      </td>
                      <td>
                        <div className="af-toggle-wrap">
                          <button
                            className={`af-toggle${f.available !== false ? " on" : ""}`}
                            onClick={() => handleToggle(f)}
                            aria-label="Toggle availability"
                          />
                          <span className="af-toggle-label">
                            {f.available !== false ? "Available" : "Unavailable"}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="af-row-actions">
                          <button className="af-action-btn edit" onClick={() => openEdit(f)} aria-label="Edit">
                            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M7.5 1.5l2 2-6 6H1.5v-2l6-6z"/>
                            </svg>
                          </button>
                          <button className="af-action-btn delete" onClick={() => setToDelete(f)} aria-label="Delete">
                            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1.5 3h8M4 3V2h3v1M9 3l-.5 7h-5L3 3"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="af-count-bar">
              Showing {filtered.length} of {total} facilit{total !== 1 ? "ies" : "y"}
            </div>
          )}
        </div>

        {/* ══ Add / Edit Modal ══ */}
        {modal && (
          <div className="af-modal-backdrop" onClick={closeModal}>
            <div className="af-modal" onClick={e => e.stopPropagation()}>
              <div className="af-modal-head">
                <div className="af-modal-title">
                  {modal === "add" ? <>Add <em>Facility</em></> : <>Edit <em>Facility</em></>}
                </div>
                <button className="af-modal-close" onClick={closeModal}>✕</button>
              </div>

              <div className="af-modal-body">
                <div className="af-field">
                  <label className="af-label">Facility Name</label>
                  <div className="af-input-wrap">
                    <input
                      className="af-input"
                      placeholder="e.g. Infinity Pool"
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="af-field">
                  <label className="af-label">Description</label>
                  <div className="af-input-wrap">
                    <textarea
                      className="af-textarea"
                      placeholder="Brief description…"
                      rows={2}
                      value={form.description}
                      onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="af-field-row">
                  <div className="af-field">
                    <label className="af-label">Category</label>
                    <div className="af-input-wrap">
                      <select
                        className="af-select"
                        value={form.category}
                        onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                      >
                        {FACILITY_CATS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="af-field">
                    <label className="af-label">Availability</label>
                    <div className="af-input-wrap" style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
                      <button
                        className={`af-toggle${form.available ? " on" : ""}`}
                        onClick={() => setForm(p => ({ ...p, available: !p.available }))}
                        type="button"
                      />
                      <span style={{ fontSize:"0.75rem", color:"var(--fog)" }}>
                        {form.available ? "Available" : "Unavailable"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="af-modal-foot">
                <button className="af-modal-cancel" onClick={closeModal}>Cancel</button>
                <button className="af-modal-save" onClick={handleSave} disabled={saving}>
                  {saving ? "Saving…" : modal === "add" ? "Add Facility" : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══ Delete Modal ══ */}
        {toDelete && (
          <div className="af-modal-backdrop" onClick={() => setToDelete(null)}>
            <div className="af-del-modal" onClick={e => e.stopPropagation()}>
              <div className="af-del-title">Delete Facility</div>
              <p className="af-del-sub">
                Are you sure you want to delete <strong style={{ color:"var(--bark-lt)" }}>{toDelete.name}</strong>?
                This cannot be undone.
              </p>
              <div className="af-del-btns">
                <button className="af-del-cancel" onClick={() => setToDelete(null)}>Cancel</button>
                <button className="af-del-confirm" onClick={handleDelete}>Delete</button>
              </div>
            </div>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div className="af-toast">
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