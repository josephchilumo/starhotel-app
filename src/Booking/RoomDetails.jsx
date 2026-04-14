import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/axios";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Outfit:wght@300;400;500&display=swap');

  :root {
    --bg:        #111210;
    --bg2:       #1a1c19;
    --bg3:       #222420;
    --border:    rgba(255,255,255,0.07);
    --amber:     #d4943a;
    --amber-lt:  #e8b06a;
    --ivory:     #f0ece4;
    --mist:      #8a8a82;
    --white:     #ffffff;
    --success:   #4a9e6b;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .rd-root {
    min-height: 100vh;
    background: var(--bg);
    font-family: 'Outfit', sans-serif;
    color: var(--ivory);
  }

  /* ── Fullscreen hero ── */
  .rd-hero {
    position: relative;
    height: 100vh;
    min-height: 560px;
    overflow: hidden;
  }
  .rd-hero-img {
    width: 100%; height: 100%;
    object-fit: cover;
    transition: transform 10s ease;
    transform: scale(1.08);
  }
  .rd-hero-img.loaded { transform: scale(1); }

  .rd-hero-gradient {
    position: absolute; inset: 0;
    background:
      linear-gradient(to right, rgba(17,18,16,0.92) 0%, rgba(17,18,16,0.4) 55%, rgba(17,18,16,0.15) 100%),
      linear-gradient(to top, rgba(17,18,16,0.7) 0%, transparent 40%);
  }

  /* ── Back button ── */
  .rd-back {
    position: fixed;
    top: 1.5rem; left: 1.5rem;
    z-index: 100;
    display: flex; align-items: center; gap: 0.5rem;
    font-size: 0.72rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(240,236,228,0.7);
    background: rgba(17,18,16,0.5);
    border: 1px solid var(--border);
    backdrop-filter: blur(10px);
    padding: 0.5rem 1.1rem;
    cursor: pointer;
    transition: color 0.2s, border-color 0.2s;
    font-family: 'Outfit', sans-serif;
  }
  .rd-back:hover { color: var(--amber); border-color: rgba(212,148,58,0.4); }

  /* ── Hero content ── */
  .rd-hero-content {
    position: absolute;
    top: 50%; left: 0;
    transform: translateY(-50%);
    padding: 0 5vw;
    max-width: 680px;
  }
  .rd-category {
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--amber);
    margin-bottom: 1.2rem;
    display: flex; align-items: center; gap: 0.75rem;
  }
  .rd-category::before {
    content: '';
    display: block;
    width: 28px; height: 1px;
    background: var(--amber);
  }
  .rd-hero-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.6rem, 6vw, 5rem);
    font-weight: 700;
    line-height: 1.05;
    letter-spacing: -0.02em;
    color: var(--ivory);
    margin-bottom: 1.5rem;
  }
  .rd-hero-title em { font-style: italic; color: var(--amber-lt); }
  .rd-hero-meta {
    display: flex; align-items: center; gap: 1.5rem;
    flex-wrap: wrap;
  }
  .rd-meta-pill {
    font-size: 0.75rem;
    letter-spacing: 0.06em;
    color: rgba(240,236,228,0.6);
    display: flex; align-items: center; gap: 0.4rem;
  }
  .rd-meta-pill strong { color: var(--ivory); font-weight: 500; }

  /* ── Thumbnail rail ── */
  .rd-rail {
    position: absolute;
    bottom: 1.5rem; right: 2rem;
    display: flex; gap: 0.5rem;
    align-items: flex-end;
  }
  .rd-rail-thumb {
    width: 70px; height: 50px;
    object-fit: cover;
    cursor: pointer;
    opacity: 0.45;
    border: 1.5px solid transparent;
    transition: opacity 0.25s, border-color 0.25s, transform 0.25s;
    flex-shrink: 0;
  }
  .rd-rail-thumb:hover { opacity: 0.75; transform: translateY(-3px); }
  .rd-rail-thumb.active { opacity: 1; border-color: var(--amber); transform: translateY(-5px); }

  /* ── Main content ── */
  .rd-main {
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 0;
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 2rem 6rem;
  }
  @media (max-width: 900px) {
    .rd-main { grid-template-columns: 1fr; padding: 2.5rem 1.25rem 4rem; }
    .rd-hero-content { padding: 0 1.5rem; }
    .rd-rail { right: 1rem; }
    .rd-rail-thumb { width: 52px; height: 38px; }
  }

  /* ── Left column ── */
  .rd-left { padding-right: 3rem; }
  @media (max-width: 900px) { .rd-left { padding-right: 0; margin-bottom: 2rem; } }

  .rd-section-label {
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--amber);
    margin-bottom: 1rem;
    display: flex; align-items: center; gap: 0.6rem;
  }
  .rd-section-label::after {
    content: '';
    flex: 1; height: 1px;
    background: var(--border);
    max-width: 60px;
  }

  .rd-description {
    font-size: 1.05rem;
    line-height: 1.85;
    color: rgba(240,236,228,0.75);
    margin-bottom: 3rem;
    font-weight: 300;
  }

  /* ── Facilities ── */
  .rd-facilities {
    display: flex; flex-wrap: wrap; gap: 0.6rem;
    margin-bottom: 3rem;
  }
  .rd-facility {
    display: flex; align-items: center; gap: 0.45rem;
    padding: 0.5rem 0.9rem;
    background: var(--bg2);
    border: 1px solid var(--border);
    font-size: 0.78rem;
    color: rgba(240,236,228,0.7);
    letter-spacing: 0.03em;
    transition: border-color 0.2s, color 0.2s;
  }
  .rd-facility:hover { border-color: rgba(212,148,58,0.35); color: var(--ivory); }
  .rd-facility-dot {
    width: 5px; height: 5px;
    background: var(--amber);
    border-radius: 50%;
    flex-shrink: 0;
  }

  /* ── Right column / sticky card ── */
  .rd-card {
    position: sticky;
    top: 2rem;
    align-self: start;
    background: var(--bg2);
    border: 1px solid var(--border);
    padding: 2rem;
  }

  .rd-price-block {
    margin-bottom: 1.75rem;
    padding-bottom: 1.75rem;
    border-bottom: 1px solid var(--border);
  }
  .rd-per-night {
    font-size: 0.68rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--mist);
    margin-bottom: 0.4rem;
  }
  .rd-price {
    font-family: 'Playfair Display', serif;
    font-size: 2.6rem;
    font-weight: 700;
    color: var(--amber);
    line-height: 1;
  }
  .rd-price sup {
    font-size: 1rem;
    vertical-align: top;
    margin-top: 0.5rem;
    display: inline-block;
    font-family: 'Outfit', sans-serif;
    font-weight: 300;
    color: var(--amber-lt);
  }

  /* ── Occupancy indicator ── */
  .rd-occupancy {
    display: flex; align-items: center; gap: 0.6rem;
    font-size: 0.8rem;
    color: var(--mist);
    margin-bottom: 1.75rem;
    padding-bottom: 1.75rem;
    border-bottom: 1px solid var(--border);
  }
  .rd-occ-icon { font-size: 1rem; }
  .rd-occ-count { color: var(--ivory); font-weight: 500; }

  /* ── Book button ── */
  .rd-book-btn {
    width: 100%;
    padding: 1rem;
    background: var(--amber);
    color: var(--bg);
    border: none;
    font-family: 'Outfit', sans-serif;
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.25s, transform 0.15s;
    position: relative;
    overflow: hidden;
  }
  .rd-book-btn::before {
    content: '';
    position: absolute; inset: 0;
    background: var(--ivory);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
    z-index: 0;
  }
  .rd-book-btn:hover::before { transform: scaleX(1); }
  .rd-book-btn span { position: relative; z-index: 1; }
  .rd-book-btn:active { transform: scale(0.98); }

  .rd-book-note {
    font-size: 0.7rem;
    color: var(--mist);
    text-align: center;
    margin-top: 0.85rem;
    line-height: 1.6;
  }

  /* ── Animations ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fu  { animation: fadeUp 0.6s ease both; }
  .fu1 { animation-delay: 0.1s; }
  .fu2 { animation-delay: 0.2s; }
  .fu3 { animation-delay: 0.32s; }
  .fu4 { animation-delay: 0.44s; }

  /* ── Loading / error screens ── */
  .rd-screen {
    min-height: 100vh;
    background: var(--bg);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Outfit', sans-serif;
  }
  .rd-screen-inner { text-align: center; }
  .rd-spinner {
    width: 36px; height: 36px;
    border: 2px solid var(--border);
    border-top-color: var(--amber);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 1rem;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .rd-screen-text { font-size: 0.8rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--mist); }
  .rd-screen-err  { color: #c0392b; font-size: 0.9rem; }
`;

// Minimal icon map for facilities
const FACILITY_ICONS = {
  wifi: "◈", pool: "◉", ac: "❄", gym: "◎", breakfast: "◑", parking: "◐",
  spa: "◈", bar: "◉", restaurant: "◎", tv: "◐", balcony: "◑", safe: "◈",
};
const getFacilityIcon = (f) => {
  const key = f.toLowerCase().replace(/\s+/g, "");
  for (const k in FACILITY_ICONS) {
    if (key.includes(k)) return FACILITY_ICONS[k];
  }
  return "·";
};

export default function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentImage, setCurrentImage] = useState(0);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await API.get("/accommodations");
        setRooms(res.data);
      } catch {
        setError("Could not load rooms.");
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  if (loading) return (
    <div className="rd-screen">
      <style>{STYLES}</style>
      <div className="rd-screen-inner">
        <div className="rd-spinner" />
        <p className="rd-screen-text">Loading room</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="rd-screen">
      <style>{STYLES}</style>
      <p className="rd-screen-err">{error}</p>
    </div>
  );

  const room = rooms.find((r) => String(r._id) === String(id));

  if (!room) return (
    <div className="rd-screen">
      <style>{STYLES}</style>
      <p className="rd-screen-text" style={{ color: "#c0392b" }}>Room not found.</p>
    </div>
  );

  const images     = room.images || [];
  const facilities = room.facilities || [];

  // Split room name for italic accent on last word
  const nameParts = room.name.trim().split(" ");
  const nameMain  = nameParts.slice(0, -1).join(" ");
  const nameLast  = nameParts[nameParts.length - 1];

  return (
    <>
      <style>{STYLES}</style>
      <div className="rd-root">

        {/* ── Fixed back button ── */}
        <button className="rd-back" onClick={() => navigate(-1)}>
          ← Back
        </button>

        {/* ── Fullscreen hero ── */}
        <div className="rd-hero">
          <img
            className={`rd-hero-img${imgLoaded ? " loaded" : ""}`}
            src={images[currentImage] || "https://via.placeholder.com/1400x900"}
            alt={room.name}
            onLoad={() => setImgLoaded(true)}
          />
          <div className="rd-hero-gradient" />

          {/* Hero text */}
          <div className="rd-hero-content">
            <div className="rd-category fu fu1">Accommodation</div>
            <h1 className="rd-hero-title fu fu2">
              {nameMain} <em>{nameLast}</em>
            </h1>
            <div className="rd-hero-meta fu fu3">
              {room.occupancy && (
                <div className="rd-meta-pill">
                  👤 Up to <strong>&nbsp;{room.occupancy} guests</strong>
                </div>
              )}
              <div className="rd-meta-pill">
                <strong>KES {room.price?.toLocaleString()}</strong>&nbsp;/ night
              </div>
            </div>
          </div>

          {/* Thumbnail rail */}
          {images.length > 1 && (
            <div className="rd-rail">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  className={`rd-rail-thumb${currentImage === i ? " active" : ""}`}
                  onClick={() => { setCurrentImage(i); setImgLoaded(false); }}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Main content ── */}
        <div className="rd-main">

          {/* Left — description + facilities */}
          <div className="rd-left fu fu1">

            <div className="rd-section-label">About this room</div>
            <p className="rd-description">{room.description}</p>

            {facilities.length > 0 && (
              <>
                <div className="rd-section-label">Facilities</div>
                <div className="rd-facilities">
                  {facilities.map((f, i) => (
                    <div key={i} className="rd-facility">
                      <span className="rd-facility-dot" />
                      {f}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Right — sticky booking card */}
          <div className="fu fu2">
            <div className="rd-card">

              <div className="rd-price-block">
                <div className="rd-per-night">Starting from</div>
                <div className="rd-price">
                  <sup>KES </sup>
                  {room.price?.toLocaleString()}
                </div>
              </div>

              {room.occupancy && (
                <div className="rd-occupancy">
                  <span className="rd-occ-icon">👤</span>
                  <span>Sleeps&nbsp;<span className="rd-occ-count">{room.occupancy}</span></span>
                </div>
              )}

              <button
                className="rd-book-btn"
                onClick={() => navigate(`/booking/${room._id}`, { state: { room } })}
              >
                <span>Reserve This Room</span>
              </button>

              <p className="rd-book-note">
                Free cancellation · No payment required today
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
