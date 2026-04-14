import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import bedroomimage from "../Images/bedroomimage.png";
import roomImg      from "../Images/roomImg.webp";
import twinRoom     from "../Images/twinRoom.webp";
import roomImg2     from "../Images/roomImg2.webp";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400;1,600&family=Jost:wght@300;400;500&display=swap');

  :root {
    --ink:       #111210;
    --ink2:      #1a1c19;
    --ink3:      #212320;
    --bronze:    #a0743c;
    --bronze-lt: #c49558;
    --cream:     #f0ece4;
    --fog:       rgba(240,236,228,0.45);
    --border:    rgba(255,255,255,0.07);
  }

  .rr-root {
    background: var(--ink);
    font-family: 'Jost', sans-serif;
    color: var(--cream);
    padding: 7rem 0 0;
    overflow: hidden;
  }

  /* ── Header ── */
  .rr-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding: 0 5vw 4rem;
    gap: 2rem;
    flex-wrap: wrap;
  }

  .rr-eyebrow {
    display: flex; align-items: center; gap: 0.7rem;
    margin-bottom: 1.1rem;
  }
  .rr-eyebrow-line { width: 28px; height: 1px; background: var(--bronze); }
  .rr-eyebrow-text {
    font-size: 0.62rem; letter-spacing: 0.26em;
    text-transform: uppercase; color: var(--bronze-lt);
  }

  .rr-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.4rem, 5vw, 4rem);
    font-weight: 300; line-height: 1.05;
    letter-spacing: -0.02em; color: var(--cream);
  }
  .rr-title em { font-style: italic; color: var(--bronze-lt); }

  /* Scroll controls */
  .rr-controls {
    display: flex; align-items: center; gap: 0.5rem;
    flex-shrink: 0;
  }
  .rr-arrow {
    width: 42px; height: 42px;
    border: 1px solid var(--border);
    background: var(--ink2);
    color: rgba(240,236,228,0.5);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    font-size: 1rem; line-height: 1;
    transition: background 0.2s, color 0.2s, border-color 0.2s;
    font-family: 'Jost', sans-serif;
    border-radius: 0;
  }
  .rr-arrow:hover {
    background: var(--bronze);
    color: var(--cream);
    border-color: var(--bronze);
  }

  /* ── Scroll track ── */
  .rr-track-wrap {
    position: relative;
    padding: 0 5vw;
  }

  .rr-track {
    display: flex;
    gap: 3px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
    padding-bottom: 0;
  }
  .rr-track::-webkit-scrollbar { display: none; }

  /* ── Card ── */
  .rr-card {
    flex-shrink: 0;
    width: 300px;
    height: 480px;
    position: relative;
    overflow: hidden;
    scroll-snap-align: start;
    cursor: pointer;
  }
  @media (max-width: 640px) { .rr-card { width: 78vw; height: 420px; } }

  .rr-card-img {
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94);
  }
  .rr-card:hover .rr-card-img { transform: scale(1.06); }

  /* Base overlay */
  .rr-card-base {
    position: absolute; inset: 0;
    background: linear-gradient(
      to top,
      rgba(10,9,7,0.95) 0%,
      rgba(10,9,7,0.4)  45%,
      rgba(10,9,7,0.05) 100%
    );
  }

  /* Hover overlay */
  .rr-card-hover {
    position: absolute; inset: 0;
    background: rgba(10,9,7,0.4);
    opacity: 0;
    transition: opacity 0.4s;
  }
  .rr-card:hover .rr-card-hover { opacity: 1; }

  /* Ghost room number */
  .rr-ghost-num {
    position: absolute;
    top: 0.75rem; right: 1rem;
    font-family: 'Cormorant Garamond', serif;
    font-size: 7rem; font-weight: 300; font-style: italic;
    color: rgba(255,255,255,0.06);
    line-height: 1;
    user-select: none;
    transition: color 0.4s;
    pointer-events: none;
  }
  .rr-card:hover .rr-ghost-num { color: rgba(160,116,60,0.12); }

  /* Card content */
  .rr-card-content {
    position: absolute; inset: 0;
    display: flex; flex-direction: column;
    justify-content: flex-end;
    padding: 1.75rem 1.5rem;
  }

  .rr-card-tag {
    font-size: 0.6rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--bronze-lt);
    margin-bottom: 0.5rem;
    opacity: 0;
    transform: translateY(6px);
    transition: opacity 0.35s, transform 0.35s;
  }
  .rr-card:hover .rr-card-tag { opacity: 1; transform: translateY(0); }

  .rr-card-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.5rem; font-weight: 400; font-style: italic;
    color: var(--cream); line-height: 1.15;
    margin-bottom: 0; transition: margin-bottom 0.35s;
  }
  .rr-card:hover .rr-card-name { margin-bottom: 0.6rem; }

  .rr-card-sep {
    width: 0; height: 1px; background: var(--bronze);
    margin-bottom: 0;
    transition: width 0.4s ease 0.05s, margin-bottom 0.35s;
  }
  .rr-card:hover .rr-card-sep { width: 28px; margin-bottom: 0.75rem; }

  /* Price reveal */
  .rr-card-price {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem; font-weight: 300;
    color: var(--bronze-lt); line-height: 1;
    max-height: 0; overflow: hidden; opacity: 0;
    transition: max-height 0.4s ease, opacity 0.3s ease 0.1s, margin-bottom 0.35s;
    margin-bottom: 0;
  }
  .rr-card:hover .rr-card-price {
    max-height: 60px; opacity: 1; margin-bottom: 0.35rem;
  }
  .rr-card-price-sub {
    font-family: 'Jost', sans-serif;
    font-size: 0.62rem; letter-spacing: 0.12em;
    color: var(--fog); font-weight: 300;
  }

  /* Occupancy */
  .rr-card-occ {
    font-size: 0.72rem; letter-spacing: 0.06em;
    color: rgba(240,236,228,0.4);
    max-height: 0; overflow: hidden; opacity: 0;
    transition: max-height 0.35s ease 0.05s, opacity 0.3s ease 0.15s, margin-bottom 0.35s;
    margin-bottom: 0;
  }
  .rr-card:hover .rr-card-occ {
    max-height: 30px; opacity: 1; margin-bottom: 1rem;
  }

  /* CTA buttons */
  .rr-card-btns {
    display: flex; gap: 0.5rem;
    max-height: 0; overflow: hidden; opacity: 0;
    transition: max-height 0.45s ease 0.1s, opacity 0.3s ease 0.2s;
  }
  .rr-card:hover .rr-card-btns { max-height: 50px; opacity: 1; }

  .rr-btn-primary {
    flex: 1; padding: 0.55rem 0;
    background: var(--bronze);
    color: var(--cream); border: none;
    font-family: 'Jost', sans-serif;
    font-size: 0.62rem; letter-spacing: 0.18em;
    text-transform: uppercase; cursor: pointer;
    transition: background 0.2s;
    text-decoration: none; text-align: center; display: block;
  }
  .rr-btn-primary:hover { background: #b8843f; }

  .rr-btn-secondary {
    padding: 0.55rem 0.85rem;
    background: transparent;
    color: rgba(240,236,228,0.6); border: 1px solid var(--border);
    font-family: 'Jost', sans-serif;
    font-size: 0.62rem; letter-spacing: 0.18em;
    text-transform: uppercase; cursor: pointer;
    transition: color 0.2s, border-color 0.2s;
    text-decoration: none; display: block; white-space: nowrap;
  }
  .rr-btn-secondary:hover { color: var(--cream); border-color: rgba(255,255,255,0.2); }

  /* ── Progress dots ── */
  .rr-dots {
    display: flex; gap: 4px;
    padding: 1.5rem 5vw;
  }
  .rr-dot {
    height: 2px; flex: 1;
    background: var(--border);
    max-width: 32px;
    transition: background 0.3s, max-width 0.3s;
  }
  .rr-dot.active { background: var(--bronze); max-width: 56px; }

  /* ── Bottom strip ── */
  .rr-strip {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.5rem 5vw;
    border-top: 1px solid var(--border);
    flex-wrap: wrap; gap: 1rem;
  }
  .rr-strip-text {
    font-size: 0.62rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: rgba(240,236,228,0.2);
  }
  .rr-strip-link {
    font-size: 0.65rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--bronze-lt);
    text-decoration: none; display: flex;
    align-items: center; gap: 0.5rem;
    font-family: 'Jost', sans-serif;
    transition: gap 0.2s;
  }
  .rr-strip-link:hover { gap: 0.9rem; }
`;

const ROOMS = [
  { name: "Deluxe Suite",    price: "350",  per: "night", occupants: "2 Adults",              tag: "Most Popular", src: bedroomimage, num: "I"   },
  { name: "Executive Room",  price: "250",  per: "night", occupants: "2 Adults",              tag: "Business",     src: roomImg,      num: "II"  },
  { name: "Standard Room",   price: "150",  per: "night", occupants: "2 Adults",              tag: "Great Value",  src: twinRoom,     num: "III" },
  { name: "Family Room",     price: "400",  per: "night", occupants: "2 Adults + 2 Children", tag: "Family",       src: roomImg2,     num: "IV"  },
];

const cardVariants = {
  hidden:  { opacity: 0, y: 32 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25,0.46,0.45,0.94] },
  }),
};

export default function RoomReview() {
  const trackRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const scroll = (dir) => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({ left: dir === "left" ? -310 : 310, behavior: "smooth" });
  };

  const handleScroll = () => {
    if (!trackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
    const pct = scrollLeft / (scrollWidth - clientWidth);
    setActiveIdx(Math.round(pct * (ROOMS.length - 1)));
  };

  return (
    <>
      <style>{STYLES}</style>
      <section className="rr-root">

        {/* ── Header ── */}
        <motion.div
          className="rr-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div>
            <div className="rr-eyebrow">
              <div className="rr-eyebrow-line" />
              <span className="rr-eyebrow-text">Get the Star Treatment</span>
            </div>
            <h2 className="rr-title">
              Rooms &amp; <em>Suites</em>
            </h2>
          </div>

          <div className="rr-controls">
            <button className="rr-arrow" onClick={() => scroll("left")} aria-label="Scroll left">‹</button>
            <button className="rr-arrow" onClick={() => scroll("right")} aria-label="Scroll right">›</button>
          </div>
        </motion.div>

        {/* ── Scroll track ── */}
        <div className="rr-track-wrap">
          <div className="rr-track" ref={trackRef} onScroll={handleScroll}>
            {ROOMS.map((room, i) => (
              <motion.div
                key={i}
                className="rr-card"
                custom={i}
                initial="hidden"
                whileInView="visible"
                variants={cardVariants}
                viewport={{ once: true, amount: 0.15 }}
              >
                <img src={room.src} alt={room.name} className="rr-card-img" />
                <div className="rr-card-base" />
                <div className="rr-card-hover" />

                {/* Ghost number */}
                <span className="rr-ghost-num" aria-hidden="true">{room.num}</span>

                <div className="rr-card-content">
                  <div className="rr-card-tag">{room.tag}</div>
                  <h3 className="rr-card-name">{room.name}</h3>
                  <div className="rr-card-sep" />

                  <div className="rr-card-price">
                    <sup style={{ fontSize:"0.9rem", verticalAlign:"super" }}>$</sup>
                    {room.price}
                    <span className="rr-card-price-sub"> / {room.per}</span>
                  </div>

                  <div className="rr-card-occ">👤 {room.occupants}</div>

                  <div className="rr-card-btns">
                    <a href={`/booking`} className="rr-btn-primary">Book Now</a>
                    <a href={`/room`}    className="rr-btn-secondary">Details</a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Progress dots ── */}
        <div className="rr-dots" aria-hidden="true">
          {ROOMS.map((_, i) => (
            <div key={i} className={`rr-dot${i === activeIdx ? " active" : ""}`} />
          ))}
        </div>

        {/* ── Bottom strip ── */}
        <div className="rr-strip">
          <span className="rr-strip-text">{ROOMS.length} curated rooms &amp; suites · StarHotel</span>
          <a href="/rooms" className="rr-strip-link">View All Rooms <span>→</span></a>
        </div>

      </section>
    </>
  );
}