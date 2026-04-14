import React, { useRef } from "react";
import { motion } from "framer-motion";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400;1,600&family=Jost:wght@300;400;500&display=swap');

  :root {
    --sand:      #f5ede0;
    --sand-dk:   #ebe0ce;
    --bark:      #2b2318;
    --bark-lt:   #4a3f33;
    --bronze:    #a0743c;
    --bronze-lt: #c49558;
    --fog:       #9c9188;
    --border:    rgba(43,35,24,0.1);
  }

  .gr-root {
    background: var(--sand);
    font-family: 'Jost', sans-serif;
    color: var(--bark);
    overflow: hidden;
  }

  /* ── Marquee ticker ── */
  .gr-ticker {
    background: var(--bark);
    padding: 0.65rem 0;
    overflow: hidden;
    white-space: nowrap;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .gr-ticker-track {
    display: inline-flex;
    animation: tickerScroll 28s linear infinite;
    gap: 0;
  }
  .gr-ticker-item {
    display: inline-flex;
    align-items: center;
    gap: 1.25rem;
    padding: 0 2.5rem;
    font-size: 0.62rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(240,236,228,0.45);
    font-family: 'Jost', sans-serif;
  }
  .gr-ticker-dot {
    width: 3px; height: 3px;
    background: var(--bronze);
    border-radius: 50%;
    flex-shrink: 0;
  }
  @keyframes tickerScroll {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }

  /* ── Header ── */
  .gr-header {
    padding: 6rem 5vw 3rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: flex-end;
    gap: 3rem;
  }
  @media (max-width: 700px) { .gr-header { grid-template-columns: 1fr; gap: 1.5rem; padding: 4rem 5vw 2rem; } }

  .gr-eyebrow {
    display: flex; align-items: center; gap: 0.7rem;
    margin-bottom: 1.25rem;
  }
  .gr-eyebrow-line { width: 28px; height: 1px; background: var(--bronze); }
  .gr-eyebrow-text {
    font-size: 0.62rem; letter-spacing: 0.26em;
    text-transform: uppercase; color: var(--bronze);
  }

  .gr-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.5rem, 5.5vw, 4.5rem);
    font-weight: 300; line-height: 1.05;
    letter-spacing: -0.02em; color: var(--bark);
  }
  .gr-title em { font-style: italic; color: var(--bronze); }

  .gr-subtitle {
    font-size: 0.875rem; color: var(--fog);
    line-height: 1.8; font-weight: 300;
    border-left: 2px solid var(--bronze);
    padding-left: 1.25rem;
    max-width: 340px;
    align-self: flex-end;
  }

  /* ── Reviews grid ── */
  .gr-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    padding: 0 5vw 0;
    gap: 0;
    border-top: 1px solid var(--border);
  }
  @media (max-width: 900px) { .gr-grid { grid-template-columns: 1fr; } }
  @media (max-width: 520px) {
    .gr-grid {
      display: flex; overflow-x: auto;
      scroll-snap-type: x mandatory;
      scrollbar-width: none;
    }
    .gr-grid::-webkit-scrollbar { display: none; }
  }

  /* ── Review card ── */
  .gr-card {
    padding: 3rem 2.5rem;
    border-right: 1px solid var(--border);
    position: relative;
    transition: background 0.35s;
    min-width: 78vw; /* mobile snap */
    scroll-snap-align: center;
  }
  .gr-card:last-child { border-right: none; }
  @media (min-width: 520px) { .gr-card { min-width: 0; } }
  .gr-card:hover { background: var(--sand-dk); }

  /* Giant decorative quote mark */
  .gr-quote-mark {
    font-family: 'Cormorant Garamond', serif;
    font-size: 7rem; line-height: 0.6;
    color: var(--bronze);
    opacity: 0.2;
    margin-bottom: 1.25rem;
    display: block;
    transition: opacity 0.35s;
    user-select: none;
  }
  .gr-card:hover .gr-quote-mark { opacity: 0.35; }

  /* Review text */
  .gr-review-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.05rem, 1.8vw, 1.3rem);
    font-weight: 300; font-style: italic;
    color: var(--bark-lt);
    line-height: 1.75;
    margin-bottom: 2rem;
  }

  /* Stars */
  .gr-stars {
    display: flex; gap: 3px;
    margin-bottom: 1.75rem;
  }
  .gr-star {
    width: 10px; height: 10px;
    background: var(--bronze);
    clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  }
  .gr-star.empty {
    background: var(--sand-dk);
    border: 1px solid var(--border);
    clip-path: none;
    border-radius: 50%;
    width: 8px; height: 8px;
  }

  /* Guest info */
  .gr-guest {
    display: flex; align-items: center;
    gap: 0.85rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--border);
  }
  .gr-avatar {
    width: 42px; height: 42px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--sand-dk);
    flex-shrink: 0;
    transition: border-color 0.3s;
  }
  .gr-card:hover .gr-avatar { border-color: var(--bronze); }

  .gr-guest-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1rem; font-weight: 400;
    color: var(--bark); letter-spacing: 0.02em;
    margin-bottom: 0.1rem;
  }
  .gr-guest-loc {
    font-size: 0.68rem; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--fog);
  }

  /* Card index */
  .gr-card-num {
    position: absolute;
    top: 1.75rem; right: 2rem;
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.75rem; font-style: italic;
    color: rgba(43,35,24,0.2);
    transition: color 0.3s;
  }
  .gr-card:hover .gr-card-num { color: var(--bronze); }

  /* ── Bottom strip ── */
  .gr-strip {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.5rem 5vw;
    border-top: 1px solid var(--border);
    flex-wrap: wrap; gap: 1rem;
  }
  .gr-strip-rating {
    display: flex; align-items: baseline; gap: 0.5rem;
  }
  .gr-strip-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem; font-weight: 300; color: var(--bronze);
    line-height: 1;
  }
  .gr-strip-label {
    font-size: 0.62rem; letter-spacing: 0.16em;
    text-transform: uppercase; color: var(--fog);
  }
  .gr-strip-cta {
    font-size: 0.65rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--bronze);
    text-decoration: none; display: flex;
    align-items: center; gap: 0.5rem;
    font-family: 'Jost', sans-serif;
    transition: gap 0.2s;
  }
  .gr-strip-cta:hover { gap: 0.9rem; }
`;

const REVIEWS = [
  {
    name: "Sarah Mitchell",
    location: "London, UK",
    review: "Elegant rooms, relaxing spa, and incredible service. One of the best stays I've had.",
    rating: 5,
    avatar: "https://i.pravatar.cc/100?img=47",
  },
  {
    name: "Daniel Mwangi",
    location: "Nairobi, Kenya",
    review: "The infinity pool at sunset was unforgettable. I would absolutely stay here again.",
    rating: 5,
    avatar: "https://i.pravatar.cc/100?img=12",
  },
  {
    name: "Maria Lopez",
    location: "Madrid, Spain",
    review: "Beautiful atmosphere and peaceful rooms. Everything felt luxurious and calm.",
    rating: 4,
    avatar: "https://i.pravatar.cc/100?img=32",
  },
];

// Ticker items — doubled for seamless loop
const TICKER_ITEMS = [
  "Sarah Mitchell · London",
  "Daniel Mwangi · Nairobi",
  "Maria Lopez · Madrid",
  "James Odhiambo · Mombasa",
  "Yuki Tanaka · Tokyo",
  "Emma Rossi · Rome",
  "Ahmed Al-Farsi · Dubai",
  "Priya Sharma · Mumbai",
];

const cardVariants = {
  hidden:  { opacity: 0, y: 28 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, delay: i * 0.13, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function GuestReviews() {
  return (
    <>
      <style>{STYLES}</style>
      <section className="gr-root">

        {/* ── Ticker ── */}
        <div className="gr-ticker" aria-hidden="true">
          <div className="gr-ticker-track">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="gr-ticker-item">
                {item}
                <span className="gr-ticker-dot" />
              </span>
            ))}
          </div>
        </div>

        {/* ── Header ── */}
        <motion.div
          className="gr-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div>
            <div className="gr-eyebrow">
              <div className="gr-eyebrow-line" />
              <span className="gr-eyebrow-text">Guest Stories</span>
            </div>
            <h2 className="gr-title">
              What Our<br /><em>Guests Say</em>
            </h2>
          </div>
          <p className="gr-subtitle">
            Genuine experiences shared by travellers who have enjoyed a stay
            with us — their words, unedited and heartfelt.
          </p>
        </motion.div>

        {/* ── Cards ── */}
        <div className="gr-grid">
          {REVIEWS.map((r, i) => (
            <motion.div
              key={i}
              className="gr-card"
              custom={i}
              initial="hidden"
              whileInView="visible"
              variants={cardVariants}
              viewport={{ once: true, amount: 0.2 }}
            >
              <span className="gr-card-num">0{i + 1}</span>

              <span className="gr-quote-mark">"</span>

              <div className="gr-stars">
                {Array.from({ length: 5 }).map((_, s) => (
                  <div key={s} className={`gr-star${s >= r.rating ? " empty" : ""}`} />
                ))}
              </div>

              <p className="gr-review-text">{r.review}</p>

              <div className="gr-guest">
                <img src={r.avatar} alt={r.name} className="gr-avatar" />
                <div>
                  <div className="gr-guest-name">{r.name}</div>
                  <div className="gr-guest-loc">{r.location}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Bottom strip ── */}
        <div className="gr-strip">
          <div className="gr-strip-rating">
            <span className="gr-strip-num">4.9</span>
            <span className="gr-strip-label">Average guest rating · 200+ reviews</span>
          </div>
          <a href="/reviews" className="gr-strip-cta">
            Read All Reviews <span>→</span>
          </a>
        </div>

      </section>
    </>
  );
}