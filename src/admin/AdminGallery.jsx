import React, { useEffect, useState, useRef } from "react";
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
    --red:       #c0392b;
    --green:     #27ae60;
  }

  .ag-root { font-family: 'Jost', sans-serif; color: var(--bark); }

  .ag-header {
    display: flex; align-items: flex-end;
    justify-content: space-between; gap: 1rem;
    margin-bottom: 1.75rem; flex-wrap: wrap;
  }
  .ag-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem; font-weight: 300; line-height: 1; letter-spacing: -0.02em;
  }
  .ag-title em { font-style: italic; color: var(--bronze); }
  .ag-subtitle { font-size: 0.72rem; color: var(--fog); margin-top: 0.3rem; }

  .ag-stats {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 1px; background: var(--border); border: 1px solid var(--border);
    margin-bottom: 1.5rem;
  }
  @media (max-width: 700px) { .ag-stats { grid-template-columns: repeat(2,1fr); } }

  .ag-stat {
    background: var(--white); padding: 1.1rem 1.4rem;
    display: flex; flex-direction: column; gap: 0.25rem; position: relative;
  }
  .ag-stat::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0;
    height: 2px; background: var(--border); transition: background 0.3s;
  }
  .ag-stat:hover::before { background: var(--bronze); }
  .ag-stat-label { font-size: 0.56rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--fog); }
  .ag-stat-val {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.8rem; font-weight: 300; line-height: 1;
    letter-spacing: -0.02em; color: var(--bark);
  }
  .ag-stat-val.bronze { color: var(--bronze); }

  .ag-upload-zone {
    border: 1.5px dashed var(--border); background: var(--white);
    padding: 2.5rem;
    display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
    cursor: pointer; transition: border-color 0.25s, background 0.25s;
    margin-bottom: 1.5rem; text-align: center;
  }
  .ag-upload-zone:hover,
  .ag-upload-zone.dragging { border-color: var(--bronze); background: rgba(160,116,60,0.03); }
  .ag-upload-zone input { display: none; }
  .ag-upload-icon { color: rgba(43,35,24,0.2); transition: color 0.25s; }
  .ag-upload-zone:hover .ag-upload-icon,
  .ag-upload-zone.dragging .ag-upload-icon { color: var(--bronze); }
  .ag-upload-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.15rem; font-weight: 300; color: rgba(43,35,24,0.5); font-style: italic;
  }
  .ag-upload-sub { font-size: 0.65rem; letter-spacing: 0.1em; color: rgba(43,35,24,0.3); }
  .ag-upload-btn {
    margin-top: 0.25rem; padding: 0.5rem 1.5rem;
    font-size: 0.65rem; letter-spacing: 0.18em; text-transform: uppercase;
    background: var(--bark); color: var(--parch);
    border: none; cursor: pointer; font-family: 'Jost', sans-serif; transition: background 0.2s;
  }
  .ag-upload-btn:hover { background: var(--bronze); }

  .ag-uploading {
    display: flex; align-items: center; gap: 0.75rem;
    font-size: 0.72rem; color: var(--fog); margin-bottom: 1rem;
    padding: 0.75rem 1rem; background: var(--white); border: 1px solid var(--border);
  }
  .ag-upload-spinner {
    width: 14px; height: 14px;
    border: 1.5px solid var(--border); border-top-color: var(--bronze);
    border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .ag-toolbar {
    display: flex; align-items: center; gap: 0.75rem;
    margin-bottom: 1.25rem; flex-wrap: wrap;
  }
  .ag-search-wrap {
    flex: 1; min-width: 180px;
    display: flex; align-items: center; gap: 0.6rem;
    background: var(--white); border: 1px solid var(--border); padding: 0.55rem 0.9rem;
  }
  .ag-search-icon { color: var(--fog); flex-shrink: 0; }
  .ag-search {
    flex: 1; background: none; border: none; outline: none;
    font-size: 0.78rem; color: var(--bark);
    font-family: 'Jost', sans-serif; caret-color: var(--bronze);
  }
  .ag-search::placeholder { color: rgba(43,35,24,0.25); }

  .ag-cat-btn {
    padding: 0.55rem 1rem;
    font-size: 0.62rem; letter-spacing: 0.14em; text-transform: uppercase;
    border: 1px solid var(--border); background: var(--white); color: var(--fog);
    cursor: pointer; font-family: 'Jost', sans-serif;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
  }
  .ag-cat-btn:hover  { color: var(--bark); border-color: rgba(43,35,24,0.2); }
  .ag-cat-btn.active { background: var(--bark); color: #f0ece4; border-color: var(--bark); }

  .ag-grid {
    columns: 4; column-gap: 1px;
    background: var(--border); border: 1px solid var(--border);
  }
  @media (max-width: 1000px) { .ag-grid { columns: 3; } }
  @media (max-width: 700px)  { .ag-grid { columns: 2; } }
  @media (max-width: 420px)  { .ag-grid { columns: 1; } }

  .ag-cell {
    break-inside: avoid; position: relative; overflow: hidden;
    margin-bottom: 1px; cursor: pointer; background: var(--white);
  }
  .ag-cell-img {
    width: 100%; display: block; object-fit: cover; transition: transform 0.6s ease;
  }
  .ag-cell:hover .ag-cell-img { transform: scale(1.05); }

  .ag-cell-overlay {
    position: absolute; inset: 0; background: rgba(14,15,13,0.55);
    opacity: 0; transition: opacity 0.3s;
    display: flex; flex-direction: column;
    align-items: flex-end; justify-content: space-between; padding: 0.75rem;
  }
  .ag-cell:hover .ag-cell-overlay { opacity: 1; }

  .ag-cell-delete {
    width: 28px; height: 28px;
    background: rgba(192,57,43,0.9); border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: white; transition: background 0.2s; flex-shrink: 0;
  }
  .ag-cell-delete:hover { background: var(--red); }

  .ag-cell-meta { width: 100%; }
  .ag-cell-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.85rem; font-style: italic; color: rgba(255,255,255,0.85);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .ag-cell-cat { font-size: 0.55rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--bronze-lt); }

  .ag-skel { animation: shimmer 1.4s ease-in-out infinite; }
  @keyframes shimmer { 0%,100%{opacity:.45} 50%{opacity:1} }
  .ag-skel-cell { break-inside: avoid; margin-bottom: 1px; background: var(--border); }

  .ag-empty {
    padding: 4rem; display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
    background: var(--white); border: 1px solid var(--border); text-align: center;
  }
  .ag-empty-icon { color: rgba(43,35,24,0.1); }
  .ag-empty-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.2rem; font-style: italic; color: rgba(43,35,24,0.35);
  }
  .ag-empty-sub { font-size: 0.7rem; color: rgba(43,35,24,0.25); }

  .ag-modal-backdrop {
    position: fixed; inset: 0; background: rgba(14,15,13,0.65);
    backdrop-filter: blur(4px); z-index: 500;
    display: flex; align-items: center; justify-content: center; padding: 1rem;
  }
  .ag-modal { background: var(--white); padding: 2rem; max-width: 360px; width: 100%; }
  .ag-modal-img { width: 100%; height: 140px; object-fit: cover; margin-bottom: 1.25rem; }
  .ag-modal-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.3rem; font-weight: 400; color: var(--bark); margin-bottom: 0.5rem;
  }
  .ag-modal-sub { font-size: 0.78rem; color: var(--fog); line-height: 1.6; margin-bottom: 1.5rem; }
  .ag-modal-btns { display: flex; gap: 0.75rem; }
  .ag-modal-cancel {
    flex: 1; padding: 0.7rem;
    font-size: 0.68rem; letter-spacing: 0.14em; text-transform: uppercase;
    background: none; border: 1px solid var(--border);
    color: var(--fog); cursor: pointer; font-family: 'Jost', sans-serif;
    transition: color 0.2s, border-color 0.2s;
  }
  .ag-modal-cancel:hover { color: var(--bark); border-color: rgba(43,35,24,0.2); }
  .ag-modal-confirm {
    flex: 1; padding: 0.7rem;
    font-size: 0.68rem; letter-spacing: 0.14em; text-transform: uppercase;
    background: var(--red); color: white; border: none;
    cursor: pointer; font-family: 'Jost', sans-serif; font-weight: 500;
  }
  .ag-modal-confirm:hover { background: #a93226; }

  .ag-count-bar {
    padding: 0.6rem 1.25rem;
    border: 1px solid var(--border); border-top: none;
    font-size: 0.62rem; letter-spacing: 0.1em; text-transform: uppercase;
    color: rgba(43,35,24,0.3); background: var(--parch);
  }

  .ag-toast {
    position: fixed; bottom: 2rem; right: 2rem; z-index: 600;
    background: var(--bark); color: var(--parch);
    padding: 0.75rem 1.25rem; font-size: 0.72rem; letter-spacing: 0.08em;
    display: flex; align-items: center; gap: 0.6rem;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    animation: toastIn 0.3s ease both;
  }
  @keyframes toastIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const HEIGHTS = [180, 240, 200, 260, 190, 220, 250, 180, 230];

// ─────────────────────────────────────────────────────────
// Normalise raw API image into a consistent shape so the
// rest of the component always works with the same fields.
//
// Your backend may return any of these field names:
//   image URL  → url | src | image | imageUrl
//   title      → title | name | caption
//   category   → category | cat | type
// ─────────────────────────────────────────────────────────
function normalise(raw) {
  return {
    _id:      raw._id      ?? raw.id      ?? Math.random().toString(36).slice(2),
    src:      raw.url      ?? raw.src     ?? raw.image    ?? raw.imageUrl ?? "",
    title:    raw.title    ?? raw.name    ?? raw.caption  ?? "",
    // ✅ FIX: always stored as `cat` — no more url/category mismatch
    cat:      raw.category ?? raw.cat     ?? raw.type     ?? "General",
  };
}

function SkeletonGrid() {
  return Array.from({ length: 9 }).map((_, i) => (
    <div key={i} className="ag-skel-cell ag-skel" style={{ height: HEIGHTS[i % HEIGHTS.length] }} />
  ));
}

export default function AdminGallery() {
  const [images,    setImages]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");
  const [uploading, setUploading] = useState(false);
  const [toDelete,  setToDelete]  = useState(null);
  const [search,    setSearch]    = useState("");
  const [category,  setCategory]  = useState("All");
  const [dragging,  setDragging]  = useState(false);
  const [toast,     setToast]     = useState("");
  const fileRef = useRef(null);

  const fetchImages = async () => {
    setLoading(true); setError("");
    try {
      const res = await axios.get("/api/gallery");
      const raw = res.data;
      const list = Array.isArray(raw)          ? raw
                 : Array.isArray(raw?.images)   ? raw.images
                 : Array.isArray(raw?.gallery)  ? raw.gallery
                 : Array.isArray(raw?.data)     ? raw.data
                 : [];
      // ✅ FIX: normalise every image so fields are consistent
      setImages(list.map(normalise));
    } catch {
      setError("Could not load gallery images.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchImages(); }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleUpload = async (files) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach(f => formData.append("images", f));
      await axios.post("/api/gallery/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await fetchImages();
      showToast(`${files.length} image${files.length > 1 ? "s" : ""} uploaded successfully`);
    } catch {
      showToast("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await axios.delete(`/api/gallery/${toDelete._id}`);
      setImages(prev => prev.filter(img => img._id !== toDelete._id));
      showToast("Image deleted");
    } catch {
      showToast("Delete failed.");
    } finally {
      setToDelete(null);
    }
  };

  // ✅ FIX: categories derived dynamically from normalised data
  const categories = [
    "All",
    ...Array.from(new Set(images.map(img => img.cat))).filter(Boolean).sort(),
  ];

  // ✅ FIX: filter and stats both use img.cat — consistent field name
  const filtered = images.filter(img => {
    const matchSearch = !search || img.title?.toLowerCase().includes(search.toLowerCase());
    const matchCat    = category === "All" || img.cat === category;
    return matchSearch && matchCat;
  });

  // ✅ FIX: stats built from normalised img.cat, not raw API field
  const topCategories = categories
    .slice(1)
    .map(cat => ({ cat, count: images.filter(img => img.cat === cat).length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  // Reset filter if it disappears after a re-fetch
  useEffect(() => {
    if (category !== "All" && !categories.includes(category)) setCategory("All");
  }, [images]);

  const onDragOver  = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = ()  => setDragging(false);
  const onDrop      = (e) => {
    e.preventDefault(); setDragging(false);
    handleUpload(e.dataTransfer.files);
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="ag-root">

        {/* ── Header ── */}
        <div className="ag-header">
          <div>
            <h1 className="ag-title">Gallery <em>Manager</em></h1>
            <p className="ag-subtitle">{images.length} image{images.length !== 1 ? "s" : ""} in collection</p>
          </div>
          <button
            style={{ display:"flex", alignItems:"center", gap:"0.5rem", fontSize:"0.65rem", letterSpacing:"0.16em", textTransform:"uppercase", color:"var(--fog)", background:"none", border:"none", cursor:"pointer", fontFamily:"'Jost', sans-serif" }}
            onClick={fetchImages}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
              <path d="M10.5 1.5A5 5 0 1 1 1.5 6"/><path d="M10.5 1.5V5h-3.5"/>
            </svg>
            Refresh
          </button>
        </div>

        {/* ── Stats — top 3 categories by count ── */}
        <div className="ag-stats">
          <div className="ag-stat">
            <span className="ag-stat-label">Total Images</span>
            <span className="ag-stat-val">{images.length}</span>
          </div>
          {topCategories.map(({ cat, count }) => (
            <div key={cat} className="ag-stat">
              <span className="ag-stat-label">{cat}</span>
              <span className="ag-stat-val bronze">{count}</span>
            </div>
          ))}
          {/* Fill empty stat slots if fewer than 3 categories */}
          {Array.from({ length: Math.max(0, 3 - topCategories.length) }).map((_, i) => (
            <div key={`empty-${i}`} className="ag-stat">
              <span className="ag-stat-label">—</span>
              <span className="ag-stat-val" style={{ color:"var(--fog)" }}>0</span>
            </div>
          ))}
        </div>

        {/* ── Upload zone ── */}
        <div
          className={`ag-upload-zone${dragging ? " dragging" : ""}`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileRef.current?.click()}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            onChange={e => handleUpload(e.target.files)}
          />
          <div className="ag-upload-icon">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="32" height="32" rx="2"/>
              <path d="M2 24l8-8 6 6 4-4 8 8"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          <div className="ag-upload-title">Drop images here to upload</div>
          <div className="ag-upload-sub">PNG, JPG, WEBP · Multiple files supported</div>
          <div className="ag-upload-btn" onClick={e => { e.stopPropagation(); fileRef.current?.click(); }}>
            Choose Files
          </div>
        </div>

        {uploading && (
          <div className="ag-uploading">
            <div className="ag-upload-spinner" />
            Uploading images…
          </div>
        )}

        {/* ── Toolbar — dynamic category buttons ── */}
        <div className="ag-toolbar">
          <div className="ag-search-wrap">
            <span className="ag-search-icon">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                <circle cx="5.5" cy="5.5" r="4.5"/><path d="M9.5 9.5l2.5 2.5"/>
              </svg>
            </span>
            <input
              className="ag-search"
              placeholder="Search images…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {/* ✅ FIX: categories derived from data, not hardcoded */}
          {categories.map(cat => (
            <button
              key={cat}
              className={`ag-cat-btn${category === cat ? " active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Grid ── */}
        {error ? (
          <div className="ag-empty">
            <div className="ag-empty-title">{error}</div>
          </div>
        ) : loading ? (
          <div className="ag-grid"><SkeletonGrid /></div>
        ) : filtered.length === 0 ? (
          <div className="ag-empty">
            <div className="ag-empty-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="34" height="34" rx="2"/>
                <path d="M3 28l10-10 8 8 5-5 11 11"/>
                <circle cx="13" cy="13" r="4"/>
              </svg>
            </div>
            <div className="ag-empty-title">No images found</div>
            <div className="ag-empty-sub">
              {search || category !== "All"
                ? "Try adjusting your search or filter"
                : "Upload your first image above"}
            </div>
          </div>
        ) : (
          <>
            <div className="ag-grid">
              {filtered.map((img, i) => (
                <div key={img._id} className="ag-cell">
                  <img
                    src={img.src}
                    alt={img.title || "Gallery image"}
                    className="ag-cell-img"
                    style={{ height: `${HEIGHTS[i % HEIGHTS.length]}px` }}
                    onError={e => { e.target.style.opacity = "0.15"; }}
                  />
                  <div className="ag-cell-overlay">
                    <button
                      className="ag-cell-delete"
                      onClick={e => { e.stopPropagation(); setToDelete(img); }}
                      aria-label="Delete image"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1.5 3h9M4 3V2h4v1M9.5 3l-.5 8h-6L2.5 3"/>
                      </svg>
                    </button>
                    <div className="ag-cell-meta">
                      {img.title && <div className="ag-cell-title">{img.title}</div>}
                      {img.cat   && <div className="ag-cell-cat">{img.cat}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="ag-count-bar">
              Showing {filtered.length} of {images.length} image{images.length !== 1 ? "s" : ""}
            </div>
          </>
        )}

        {/* ── Delete modal ── */}
        {toDelete && (
          <div className="ag-modal-backdrop" onClick={() => setToDelete(null)}>
            <div className="ag-modal" onClick={e => e.stopPropagation()}>
              {toDelete.src && (
                <img src={toDelete.src} alt="To delete" className="ag-modal-img" />
              )}
              <div className="ag-modal-title">Delete Image</div>
              <p className="ag-modal-sub">
                This image will be permanently removed from the gallery. This cannot be undone.
              </p>
              <div className="ag-modal-btns">
                <button className="ag-modal-cancel" onClick={() => setToDelete(null)}>Cancel</button>
                <button className="ag-modal-confirm" onClick={handleDelete}>Delete</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Toast ── */}
        {toast && (
          <div className="ag-toast">
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