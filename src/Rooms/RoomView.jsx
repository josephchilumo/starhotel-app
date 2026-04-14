import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;0,600;1,300;1,500&family=Jost:wght@300;400;500&display=swap');

  :root {
    --cream:    #f8f3ec;
    --cream-dk: #ede5d8;
    --bark:     #2b2318;
    --bark-lt:  #4a3f33;
    --bronze:   #a0743c;
    --bronze-lt:#c49558;
    --fog:      #9c9188;
    --white:    #ffffff;
    --border:   rgba(43,35,24,0.1);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .rv-root {
    min-height: 100vh;
    background: var(--cream);
    font-family: 'Jost', sans-serif;
    color: var(--bark);
    padding-bottom: 6rem;
  }

  /* ── Header section ── */
  .rv-header {
    padding: 5rem 5vw 3.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    position: relative;
  }
  .rv-header::after {
    content: '';
    display: block;
    width: 1px;
    height: 48px;
    background: linear-gradient(to bottom, var(--bronze), transparent);
    margin-top: 2.5rem;
  }

  .rv-eyebrow {
    font-size: 0.65rem;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--bronze);
    margin-bottom: 1.25rem;
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }
  .rv-eyebrow::before,
  .rv-eyebrow::after {
    content: '';
    display: block;
    width: 32px;
    height: 1px;
    background: var(--bronze-lt);
  }

  .rv-title {
    font-family: 'Cormorant', serif;
    font-size: clamp(3rem, 8vw, 7rem);
    font-weight: 300;
    letter-spacing: -0.02em;
    line-height: 1;
    color: var(--bark);
  }
  .rv-title em {
    font-style: italic;
    color: var(--bronze);
  }

  .rv-subtitle {
    margin-top: 1.25rem;
    font-size: 0.85rem;
    letter-spacing: 0.06em;
    color: var(--fog);
    font-weight: 300;
    max-width: 380px;
  }

  /* ── Mobile scroll arrows ── */
  .rv-arrows {
    display: none;
    gap: 0.5rem;
    margin-bottom: 1rem;
    padding: 0 1.25rem;
  }
  @media (max-width: 640px) { .rv-arrows { display: flex; justify-content: flex-end; } }

  .rv-arrow-btn {
    width: 36px; height: 36px;
    border: 1px solid var(--border);
    background: var(--white);
    color: var(--bark-lt);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    font-size: 0.75rem;
    transition: background 0.2s, color 0.2s;
  }
  .rv-arrow-btn:hover { background: var(--bark); color: var(--cream); }

  /* ── Grid / scroll container ── */
  .rv-grid-wrap {
    padding: 0 4vw;
  }

  .rv-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5px;
  }
  @media (max-width: 900px) { .rv-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 580px) {
    .rv-grid {
      display: flex;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      gap: 1rem;
      padding-bottom: 0.5rem;
      scrollbar-width: none;
    }
    .rv-grid::-webkit-scrollbar { display: none; }
  }

  /* ── Room card ── */
  .rv-card {
    position: relative;
    background: var(--white);
    overflow: hidden;
    cursor: pointer;
    min-width: 260px;
    scroll-snap-align: start;
  }

  /* Card number badge */
  .rv-card-num {
    position: absolute;
    top: 1rem; left: 1rem;
    z-index: 3;
    font-family: 'Cormorant', serif;
    font-size: 0.85rem;
    font-style: italic;
    color: rgba(255,255,255,0.75);
    line-height: 1;
    text-shadow: 0 1px 4px rgba(0,0,0,0.3);
  }

  /* Image container */
  .rv-img-wrap {
    position: relative;
    height: 300px;
    overflow: hidden;
  }
  @media (max-width: 640px) { .rv-img-wrap { height: 240px; } }

  .rv-img {
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94);
  }
  .rv-card:hover .rv-img { transform: scale(1.07); }

  /* Hover overlay */
  .rv-img-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top,
      rgba(43,35,24,0.85) 0%,
      rgba(43,35,24,0.2) 50%,
      transparent 100%);
    opacity: 0;
    transition: opacity 0.4s ease;
    display: flex;
    align-items: flex-end;
    padding: 1.5rem;
    gap: 0.75rem;
  }
  .rv-card:hover .rv-img-overlay { opacity: 1; }

  .rv-overlay-btn {
    flex: 1;
    padding: 0.6rem 0;
    font-family: 'Jost', sans-serif;
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    text-align: center;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
    display: block;
  }
  .rv-overlay-btn.primary {
    background: var(--bronze);
    color: var(--white);
  }
  .rv-overlay-btn.primary:hover { background: var(--bronze-lt); }
  .rv-overlay-btn.secondary {
    background: rgba(255,255,255,0.12);
    color: var(--white);
    border: 1px solid rgba(255,255,255,0.3);
    backdrop-filter: blur(4px);
  }
  .rv-overlay-btn.secondary:hover { background: rgba(255,255,255,0.22); }

  /* Card body */
  .rv-card-body {
    padding: 1.25rem 1.5rem 1.5rem;
    border-top: 1px solid var(--cream-dk);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .rv-card-name {
    font-family: 'Cormorant', serif;
    font-size: 1.35rem;
    font-weight: 400;
    color: var(--bark);
    letter-spacing: 0.01em;
    line-height: 1.2;
  }

  .rv-card-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 0.25rem;
  }

  .rv-card-occ {
    font-size: 0.72rem;
    letter-spacing: 0.06em;
    color: var(--fog);
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }
  .rv-card-occ::before {
    content: '◈';
    font-size: 0.5rem;
    color: var(--bronze-lt);
  }

  .rv-card-price {
    font-family: 'Cormorant', serif;
    font-size: 1.25rem;
    color: var(--bronze);
    font-weight: 600;
    letter-spacing: -0.01em;
  }
  .rv-card-price span {
    font-family: 'Jost', sans-serif;
    font-size: 0.65rem;
    color: var(--fog);
    font-weight: 300;
    letter-spacing: 0.06em;
    margin-left: 0.2rem;
  }

  /* Mobile inline buttons (visible when overlay isn't accessible) */
  .rv-card-btns {
    display: none;
    gap: 0.5rem;
    margin-top: 0.75rem;
  }
  @media (max-width: 640px) { .rv-card-btns { display: flex; } }
  .rv-card-btn {
    flex: 1;
    padding: 0.55rem;
    font-family: 'Jost', sans-serif;
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    text-align: center;
    text-decoration: none;
    cursor: pointer;
    border: none;
    display: block;
    transition: background 0.2s, color 0.2s;
  }
  .rv-card-btn.primary { background: var(--bark); color: var(--cream); }
  .rv-card-btn.primary:hover { background: var(--bark-lt); }
  .rv-card-btn.secondary { background: transparent; color: var(--bark); border: 1px solid var(--border); }
  .rv-card-btn.secondary:hover { background: var(--cream-dk); }

  /* ── Stagger animation ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .rv-card { animation: fadeUp 0.55s ease both; }
  .rv-card:nth-child(1) { animation-delay: 0.05s; }
  .rv-card:nth-child(2) { animation-delay: 0.12s; }
  .rv-card:nth-child(3) { animation-delay: 0.19s; }
  .rv-card:nth-child(4) { animation-delay: 0.26s; }
  .rv-card:nth-child(5) { animation-delay: 0.33s; }
  .rv-card:nth-child(6) { animation-delay: 0.4s; }

  /* ── Loading / error ── */
  .rv-screen {
    min-height: 100vh;
    background: var(--cream);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Jost', sans-serif;
    flex-direction: column;
    gap: 1rem;
    color: var(--fog);
    font-size: 0.78rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  .rv-spinner {
    width: 32px; height: 32px;
    border: 1.5px solid var(--cream-dk);
    border-top-color: var(--bronze);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Count bar ── */
  .rv-count {
    padding: 1.75rem 4vw 1.25rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .rv-count-text {
    font-size: 0.68rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--fog);
  }
  .rv-count-line {
    flex: 1;
    height: 1px;
    background: var(--border);
    margin: 0 1.5rem;
  }
`;

export default function RoomView() {
  const scrollRef = useRef(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/accommodations");
        const data = await res.json();
        setRooms(data);
      } catch {
        setError("Could not load rooms.");
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  if (loading) return (
    <div className="rv-screen">
      <style>{STYLES}</style>
      <div className="rv-spinner" />
      <span>Loading rooms</span>
    </div>
  );

  if (error) return (
    <div className="rv-screen">
      <style>{STYLES}</style>
      <span style={{ color: "#c0392b" }}>{error}</span>
    </div>
  );

  return (
    <>
      <style>{STYLES}</style>
      <div className="rv-root">

        {/* ── Header ── */}
        <div className="rv-header">
          <div className="rv-eyebrow">Select your retreat</div>
          <h1 className="rv-title">Our <em>Rooms</em></h1>
          <p className="rv-subtitle">
            Handcrafted spaces where the Indian Ocean meets refined comfort
          </p>
        </div>

        {/* ── Count bar ── */}
        <div className="rv-count">
          <span className="rv-count-text">{rooms.length} rooms available</span>
          <div className="rv-count-line" />
        </div>

        {/* ── Mobile arrows ── */}
        <div className="rv-arrows">
          <button className="rv-arrow-btn" onClick={() => scrollRef.current?.scrollBy({ left: -280, behavior: "smooth" })}>
            ‹
          </button>
          <button className="rv-arrow-btn" onClick={() => scrollRef.current?.scrollBy({ left: 280, behavior: "smooth" })}>
            ›
          </button>
        </div>

        {/* ── Grid ── */}
        <div className="rv-grid-wrap">
          <div className="rv-grid" ref={scrollRef}>
            {rooms.map((room, index) => (
              <div key={room._id} className="rv-card">

                {/* Index badge */}
                <div className="rv-card-num">
                  {String(index + 1).padStart(2, "0")}
                </div>

                {/* Image + hover overlay */}
                <div className="rv-img-wrap">
                  <img
                    src={room.images?.[0]}
                    alt={room.name}
                    className="rv-img"
                  />
                  <div className="rv-img-overlay">
                    <Link to={`/booking/${room._id}`} className="rv-overlay-btn primary">
                      Book Now
                    </Link>
                    <Link to={`/room/${room._id}`} className="rv-overlay-btn secondary">
                      Details
                    </Link>
                  </div>
                </div>

                {/* Card info */}
                <div className="rv-card-body">
                  <div className="rv-card-name">{room.name}</div>
                  <div className="rv-card-meta">
                    <div className="rv-card-occ">{room.occupancy}</div>
                    <div className="rv-card-price">
                      KES {room.price.toLocaleString()}
                      <span>/ night</span>
                    </div>
                  </div>

                  {/* Mobile-only buttons */}
                  <div className="rv-card-btns">
                    <Link to={`/booking/${room._id}`} className="rv-card-btn primary">Book</Link>
                    <Link to={`/room/${room._id}`} className="rv-card-btn secondary">Details</Link>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}
