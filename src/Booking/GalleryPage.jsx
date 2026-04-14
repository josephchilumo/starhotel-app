import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400;1,600&family=Jost:wght@300;400;500&display=swap');

  :root {
    --ink:       #0e0f0d;
    --ink2:      #171916;
    --bronze:    #a0743c;
    --bronze-lt: #c49558;
    --cream:     #f0ece4;
    --fog:       rgba(240,236,228,0.42);
    --border:    rgba(255,255,255,0.07);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .gp-root {
    min-height: 100vh;
    background: var(--ink);
    font-family: 'Jost', sans-serif;
    color: var(--cream);
  }

  .gp-hero {
    padding: 7rem 5vw 4rem;
    display: flex; align-items: flex-end;
    justify-content: space-between; gap: 2rem; flex-wrap: wrap;
  }
  .gp-eyebrow { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem; }
  .gp-eyebrow-line { width: 28px; height: 1px; background: var(--bronze); }
  .gp-eyebrow-text {
    font-size: 0.62rem; letter-spacing: 0.28em;
    text-transform: uppercase; color: var(--bronze-lt);
  }
  .gp-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(3rem, 7vw, 5.5rem);
    font-weight: 300; line-height: 1.02;
    letter-spacing: -0.025em; color: var(--cream);
  }
  .gp-title em { font-style: italic; color: var(--bronze-lt); }
  .gp-count-display {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(3.5rem, 8vw, 6rem);
    font-weight: 300; font-style: italic;
    color: rgba(160,116,60,0.12); line-height: 1;
    user-select: none; align-self: flex-start; margin-top: 0.5rem;
  }

  .gp-filters {
    padding: 0 5vw 2.5rem;
    display: flex; gap: 0.5rem; flex-wrap: wrap;
    border-bottom: 1px solid var(--border);
  }
  .gp-filter-btn {
    padding: 0.45rem 1.1rem;
    font-size: 0.62rem; letter-spacing: 0.18em; text-transform: uppercase;
    background: transparent; border: 1px solid var(--border);
    color: var(--fog); cursor: pointer; font-family: 'Jost', sans-serif;
    transition: background 0.2s, color 0.2s, border-color 0.2s;
  }
  .gp-filter-btn:hover { color: var(--cream); border-color: rgba(255,255,255,0.2); }
  .gp-filter-btn.active { background: var(--bronze); color: var(--cream); border-color: var(--bronze); }

  .gp-grid {
    padding: 3px 5vw; columns: 3; column-gap: 3px;
  }
  @media (max-width: 900px) { .gp-grid { columns: 2; } }
  @media (max-width: 520px) { .gp-grid { columns: 1; } }

  .gp-cell {
    break-inside: avoid; position: relative;
    overflow: hidden; margin-bottom: 3px; cursor: pointer;
  }
  .gp-cell-img {
    width: 100%; display: block; object-fit: cover;
    transition: transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94);
  }
  .gp-cell:hover .gp-cell-img { transform: scale(1.05); }
  .gp-cell-base {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(10,9,7,0.85) 0%, rgba(10,9,7,0.1) 45%, transparent 100%);
  }
  .gp-cell-hover {
    position: absolute; inset: 0;
    background: rgba(10,9,7,0.35); opacity: 0; transition: opacity 0.35s;
  }
  .gp-cell:hover .gp-cell-hover { opacity: 1; }
  .gp-cell-content {
    position: absolute; bottom: 0; left: 0; right: 0;
    padding: 1.25rem 1.5rem;
    transform: translateY(8px); transition: transform 0.35s ease;
  }
  .gp-cell:hover .gp-cell-content { transform: translateY(0); }
  .gp-cell-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.15rem; font-style: italic; font-weight: 300;
    color: var(--cream); line-height: 1.2;
    margin-bottom: 0; transition: margin-bottom 0.3s;
  }
  .gp-cell:hover .gp-cell-title { margin-bottom: 0.35rem; }
  .gp-cell-cat {
    font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--bronze-lt); opacity: 0; transform: translateY(4px);
    transition: opacity 0.3s ease 0.05s, transform 0.3s ease 0.05s;
  }
  .gp-cell:hover .gp-cell-cat { opacity: 1; transform: translateY(0); }
  .gp-cell-index {
    position: absolute; top: 0.9rem; left: 1.1rem;
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.7rem; font-style: italic;
    color: rgba(255,255,255,0.3); transition: color 0.3s;
  }
  .gp-cell:hover .gp-cell-index { color: var(--bronze-lt); }

  .gp-strip {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.5rem 5vw; border-top: 1px solid var(--border);
    flex-wrap: wrap; gap: 1rem;
  }
  .gp-strip-text {
    font-size: 0.62rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: rgba(240,236,228,0.2);
  }

  /* ── Skeleton loader ── */
  .gp-skel-grid { padding: 3px 5vw; columns: 3; column-gap: 3px; }
  @media (max-width: 900px) { .gp-skel-grid { columns: 2; } }
  @media (max-width: 520px) { .gp-skel-grid { columns: 1; } }
  .gp-skel-cell {
    break-inside: avoid; margin-bottom: 3px;
    background: rgba(255,255,255,0.04);
    animation: gpShimmer 1.4s ease-in-out infinite;
  }
  @keyframes gpShimmer { 0%,100%{opacity:0.4} 50%{opacity:0.8} }

  /* ── Error state ── */
  .gp-error {
    padding: 6rem 5vw; text-align: center;
    display: flex; flex-direction: column; align-items: center; gap: 1rem;
  }
  .gp-error-icon { color: rgba(240,236,228,0.08); }
  .gp-error-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.4rem; font-style: italic;
    color: rgba(240,236,228,0.3);
  }
  .gp-error-sub { font-size: 0.72rem; color: rgba(240,236,228,0.2); }
  .gp-retry-btn {
    margin-top: 0.5rem; padding: 0.6rem 1.5rem;
    font-size: 0.65rem; letter-spacing: 0.18em; text-transform: uppercase;
    background: var(--bronze); color: var(--cream);
    border: none; cursor: pointer; font-family: 'Jost', sans-serif;
    transition: background 0.2s;
  }
  .gp-retry-btn:hover { background: #b8843f; }

  /* ── Lightbox ── */
  .gp-lb-backdrop {
    position: fixed; inset: 0; z-index: 1000;
    background: rgba(8,7,6,0.97);
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    display: flex; flex-direction: column;
  }
  .gp-lb-topbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.5rem 2rem; border-bottom: 1px solid var(--border); flex-shrink: 0;
  }
  .gp-lb-meta { display: flex; align-items: center; gap: 1.25rem; }
  .gp-lb-counter {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.95rem; font-style: italic; color: var(--bronze-lt); letter-spacing: 0.06em;
  }
  .gp-lb-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1rem; font-weight: 300; font-style: italic; color: rgba(240,236,228,0.6);
  }
  .gp-lb-close {
    width: 36px; height: 36px; border: 1px solid var(--border);
    background: transparent; color: var(--fog);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 1.1rem;
    transition: background 0.2s, color 0.2s, border-color 0.2s; font-family: 'Jost', sans-serif;
  }
  .gp-lb-close:hover { background: var(--bronze); color: var(--cream); border-color: var(--bronze); }
  .gp-lb-stage {
    flex: 1; display: flex; align-items: center; justify-content: center;
    padding: 2rem; position: relative; overflow: hidden; min-height: 0;
  }
  .gp-lb-img {
    max-width: 100%; max-height: 100%; object-fit: contain; display: block;
    box-shadow: 0 32px 80px rgba(0,0,0,0.7);
  }
  .gp-lb-nav {
    position: absolute; top: 50%; transform: translateY(-50%);
    width: 44px; height: 44px; border: 1px solid var(--border);
    background: rgba(14,15,13,0.7); color: var(--fog);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 1.2rem;
    transition: background 0.2s, color 0.2s, border-color 0.2s;
    backdrop-filter: blur(4px); font-family: 'Jost', sans-serif;
  }
  .gp-lb-nav:hover { background: var(--bronze); color: var(--cream); border-color: var(--bronze); }
  .gp-lb-nav.prev { left: 1.5rem; }
  .gp-lb-nav.next { right: 1.5rem; }
  .gp-lb-bottom {
    padding: 1rem 2rem; border-top: 1px solid var(--border);
    display: flex; align-items: center; gap: 0.75rem;
    overflow-x: auto; scrollbar-width: none; flex-shrink: 0;
  }
  .gp-lb-bottom::-webkit-scrollbar { display: none; }
  .gp-lb-thumb {
    width: 52px; height: 36px; object-fit: cover; flex-shrink: 0;
    opacity: 0.35; cursor: pointer; border: 1.5px solid transparent;
    transition: opacity 0.2s, border-color 0.2s;
  }
  .gp-lb-thumb.active { opacity: 1; border-color: var(--bronze); }
  .gp-lb-thumb:hover  { opacity: 0.7; }
`;

// Varied heights for masonry visual rhythm
const HEIGHTS = [340, 480, 360, 440, 320, 420, 360, 400, 460, 380, 300, 500];

// ─────────────────────────────────────────────
// Normalise raw API image into a consistent shape.
// Handles the common field name variations your
// backend might use.
// ─────────────────────────────────────────────
function normalise(raw, index) {
  return {
    // image URL — try common field names
    src:   raw.url      ?? raw.src    ?? raw.image    ?? raw.imageUrl ?? "",
    // display title
    title: raw.title    ?? raw.name   ?? raw.caption  ?? `Photo ${index + 1}`,
    // category for filtering
    cat:   raw.category ?? raw.cat    ?? raw.type     ?? "General",
    // unique key
    _id:   raw._id      ?? raw.id     ?? String(index),
    // masonry height (cycles through preset values)
    h:     HEIGHTS[index % HEIGHTS.length],
  };
}

const cellVariants = {
  hidden:  { opacity: 0, scale: 0.97 },
  visible: (i) => ({
    opacity: 1, scale: 1,
    transition: { duration: 0.55, delay: i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

function SkeletonGrid() {
  return (
    <div className="gp-skel-grid">
      {HEIGHTS.slice(0, 9).map((h, i) => (
        <div key={i} className="gp-skel-cell" style={{ height: h }} />
      ))}
    </div>
  );
}

export default function GalleryPage() {
  const [images,   setImages]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [filter,   setFilter]   = useState("All");
  const [selected, setSelected] = useState(null);

  // ── Fetch from backend ──────────────────────
  const fetchImages = async () => {
    setLoading(true); setError("");
    try {
      const res = await axios.get("http://localhost:5000/api/gallery");

      // Guard against wrapped response shapes
      const raw = res.data;
      const list = Array.isArray(raw)          ? raw
                 : Array.isArray(raw?.images)   ? raw.images
                 : Array.isArray(raw?.gallery)  ? raw.gallery
                 : Array.isArray(raw?.data)     ? raw.data
                 : [];

      setImages(list.map(normalise));
    } catch {
      setError("Could not load gallery images.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchImages(); }, []);

  // ── Derive categories dynamically from API data ──
  const categories = [
    "All",
    ...Array.from(new Set(images.map(img => img.cat))).filter(Boolean).sort(),
  ];

  // Reset to All if current filter no longer exists after re-fetch
  useEffect(() => {
    if (filter !== "All" && !categories.includes(filter)) setFilter("All");
  }, [images]);

  const filtered = filter === "All"
    ? images
    : images.filter(img => img.cat === filter);

  // ── Lightbox controls ───────────────────────
  const openLightbox  = (idx) => setSelected(idx);
  const closeLightbox = ()    => setSelected(null);

  const prev = useCallback(() => {
    setSelected(i => (i - 1 + filtered.length) % filtered.length);
  }, [filtered.length]);

  const next = useCallback(() => {
    setSelected(i => (i + 1) % filtered.length);
  }, [filtered.length]);

  useEffect(() => {
    if (selected === null) return;
    const onKey = (e) => {
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape")     closeLightbox();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, prev, next]);

  return (
    <>
      <style>{STYLES}</style>
      <div className="gp-root">

        {/* ── Hero ── */}
        <motion.div
          className="gp-hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
        >
          <div>
            <div className="gp-eyebrow">
              <div className="gp-eyebrow-line" />
              <span className="gp-eyebrow-text">Visual Archive</span>
            </div>
            <h1 className="gp-title">Our <em>Gallery</em></h1>
          </div>
          <div className="gp-count-display" aria-hidden="true">
            {loading ? "…" : String(filtered.length).padStart(2, "0")}
          </div>
        </motion.div>

        {/* ── Category filters — built from API data ── */}
        {!loading && !error && (
          <div className="gp-filters">
            {categories.map(cat => (
              <button
                key={cat}
                className={`gp-filter-btn${filter === cat ? " active" : ""}`}
                onClick={() => { setFilter(cat); setSelected(null); }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* ── Loading ── */}
        {loading && <SkeletonGrid />}

        {/* ── Error ── */}
        {!loading && error && (
          <div className="gp-error">
            <div className="gp-error-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="4" width="40" height="40" rx="3"/>
                <path d="M4 34l12-12 9 9 6-6 13 13"/>
                <circle cx="16" cy="16" r="4"/>
                <path d="M24 24l6-6M30 24l-6-6"/>
              </svg>
            </div>
            <div className="gp-error-title">Could not load gallery</div>
            <div className="gp-error-sub">Check your connection or try again</div>
            <button className="gp-retry-btn" onClick={fetchImages}>Retry</button>
          </div>
        )}

        {/* ── Masonry grid ── */}
        {!loading && !error && (
          <>
            <motion.div className="gp-grid" initial="hidden" animate="visible">
              <AnimatePresence>
                {filtered.map((img, i) => (
                  <motion.div
                    key={img._id}
                    className="gp-cell"
                    custom={i}
                    variants={cellVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => openLightbox(i)}
                  >
                    <img
                      src={img.src}
                      alt={img.title}
                      className="gp-cell-img"
                      style={{ height: `${img.h}px` }}
                      onError={e => { e.target.style.opacity = "0.15"; }}
                    />
                    <div className="gp-cell-base" />
                    <div className="gp-cell-hover" />
                    <span className="gp-cell-index">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="gp-cell-content">
                      <div className="gp-cell-title">{img.title}</div>
                      <div className="gp-cell-cat">{img.cat}</div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            <div className="gp-strip">
              <span className="gp-strip-text">
                {filtered.length} image{filtered.length !== 1 ? "s" : ""} · StarHotel Mombasa
              </span>
            </div>
          </>
        )}

        {/* ── Lightbox ── */}
        <AnimatePresence>
          {selected !== null && (
            <motion.div
              className="gp-lb-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="gp-lb-topbar">
                <div className="gp-lb-meta">
                  <span className="gp-lb-counter">
                    {String(selected + 1).padStart(2, "0")} / {String(filtered.length).padStart(2, "0")}
                  </span>
                  <span className="gp-lb-title">{filtered[selected]?.title}</span>
                </div>
                <button className="gp-lb-close" onClick={closeLightbox} aria-label="Close">✕</button>
              </div>

              <div className="gp-lb-stage">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selected}
                    src={filtered[selected]?.src}
                    alt={filtered[selected]?.title}
                    className="gp-lb-img"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.03 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </AnimatePresence>

                {filtered.length > 1 && (
                  <>
                    <button className="gp-lb-nav prev" onClick={prev} aria-label="Previous">‹</button>
                    <button className="gp-lb-nav next" onClick={next} aria-label="Next">›</button>
                  </>
                )}
              </div>

              <div className="gp-lb-bottom">
                {filtered.map((img, i) => (
                  <img
                    key={img._id}
                    src={img.src}
                    alt={img.title}
                    className={`gp-lb-thumb${i === selected ? " active" : ""}`}
                    onClick={() => setSelected(i)}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </>
  );
}