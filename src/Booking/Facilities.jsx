import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Jost:wght@300;400;500&display=swap');

  :root {
    --ink:       #0e0f0d;
    --ink2:      #171916;
    --ink3:      #1f211e;
    --bronze:    #a0743c;
    --bronze-lt: #c49558;
    --cream:     #f0ece4;
    --fog:       rgba(240,236,228,0.42);
    --border:    rgba(255,255,255,0.07);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .fc-root {
    min-height: 100vh;
    background: var(--ink);
    font-family: 'Jost', sans-serif;
    color: var(--cream);
    position: relative;
    overflow: hidden;
  }

  /* ── Dot grid background ── */
  .fc-dotgrid {
    position: fixed; inset: 0;
    z-index: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,0.045) 1px, transparent 1px);
    background-size: 36px 36px;
    animation: gridDrift 24s ease-in-out infinite alternate;
    pointer-events: none;
  }
  @keyframes gridDrift {
    from { background-position: 0 0; }
    to   { background-position: 18px 18px; }
  }

  /* ── Hero ── */
  .fc-hero {
    position: relative; z-index: 1;
    padding: 8rem 5vw 5rem;
  }
  .fc-hero::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 55% 70% at 80% 40%, rgba(160,116,60,0.07), transparent 65%);
    pointer-events: none;
  }

  .fc-eyebrow {
    display: flex; align-items: center; gap: 0.75rem;
    margin-bottom: 1.5rem;
    opacity: 0; animation: fadeUp 0.7s ease 0.15s both;
  }
  .fc-eyebrow-line { width: 28px; height: 1px; background: var(--bronze); }
  .fc-eyebrow-text {
    font-size: 0.62rem; letter-spacing: 0.28em;
    text-transform: uppercase; color: var(--bronze-lt);
  }

  .fc-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(3rem, 7vw, 6rem);
    font-weight: 300; line-height: 1.02;
    letter-spacing: -0.025em; color: var(--cream);
    max-width: 700px;
    opacity: 0; animation: fadeUp 0.75s ease 0.3s both;
  }
  .fc-title em { font-style: italic; color: var(--bronze-lt); }

  .fc-sub {
    font-size: 0.9rem; color: var(--fog);
    line-height: 1.8; font-weight: 300;
    max-width: 420px; margin-top: 1.5rem;
    border-left: 2px solid var(--bronze); padding-left: 1.25rem;
    opacity: 0; animation: fadeUp 0.75s ease 0.48s both;
  }

  /* ── Count badge ── */
  .fc-count {
    position: absolute; top: 7rem; right: 5vw;
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(4rem, 10vw, 8rem);
    font-weight: 300; font-style: italic;
    color: rgba(160,116,60,0.08); line-height: 1;
    user-select: none; pointer-events: none; z-index: 0;
    opacity: 0; animation: fadeIn 1s ease 0.6s both;
  }

  /* ── Facilities list ── */
  .fc-list {
    position: relative; z-index: 1;
    padding: 0 5vw;
    border-top: 1px solid var(--border);
  }

  /* ── Facility row ── */
  .fc-row {
    display: grid;
    grid-template-columns: 80px 1fr auto;
    align-items: center;
    padding: 2.25rem 0;
    border-bottom: 1px solid var(--border);
    gap: 2rem;
    cursor: default;
    position: relative;
    transition: background 0.35s;
  }
  .fc-row::before {
    content: '';
    position: absolute; left: -5vw; right: -5vw; inset-block: 0;
    background: var(--ink2);
    opacity: 0;
    transition: opacity 0.35s;
    z-index: 0;
  }
  .fc-row:hover::before { opacity: 1; }
  .fc-row > * { position: relative; z-index: 1; }

  @media (max-width: 600px) {
    .fc-row { grid-template-columns: 48px 1fr; gap: 1rem; }
    .fc-row-right { display: none; }
  }

  /* Left: ghost number */
  .fc-row-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.2rem; font-weight: 300; font-style: italic;
    color: rgba(255,255,255,0.12); line-height: 1;
    transition: color 0.35s;
    user-select: none;
  }
  .fc-row:hover .fc-row-num { color: var(--bronze-lt); }

  /* Centre: title + description */
  .fc-row-centre { display: flex; flex-direction: column; gap: 0; }

  .fc-row-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.3rem, 2.5vw, 1.75rem);
    font-weight: 400; line-height: 1.2;
    color: var(--cream); letter-spacing: -0.01em;
    transition: color 0.3s;
  }
  .fc-row:hover .fc-row-title { color: var(--cream); }

  .fc-row-desc {
    font-size: 0.8rem; color: var(--fog);
    line-height: 1.7; font-weight: 300;
    max-height: 0; overflow: hidden; opacity: 0;
    transition: max-height 0.45s ease, opacity 0.35s ease 0.08s, margin-top 0.35s;
    margin-top: 0;
  }
  .fc-row:hover .fc-row-desc {
    max-height: 60px; opacity: 1; margin-top: 0.5rem;
  }

  /* Right: icon + label */
  .fc-row-right {
    display: flex; flex-direction: column; align-items: flex-end; gap: 0.3rem;
    flex-shrink: 0;
  }

  .fc-row-icon {
    width: 38px; height: 38px;
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    color: rgba(240,236,228,0.25);
    transition: border-color 0.3s, color 0.3s, background 0.3s;
  }
  .fc-row:hover .fc-row-icon {
    border-color: var(--bronze);
    color: var(--bronze-lt);
    background: rgba(160,116,60,0.08);
  }

  .fc-row-tag {
    font-size: 0.55rem; letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(240,236,228,0.2);
    transition: color 0.3s;
  }
  .fc-row:hover .fc-row-tag { color: var(--bronze); }

  /* Bronze bar that slides in from left on hover */
  .fc-row-bar {
    position: absolute; left: -5vw; top: 0; bottom: 0;
    width: 3px;
    background: var(--bronze);
    transform: scaleY(0);
    transform-origin: top;
    transition: transform 0.4s ease;
    z-index: 2;
  }
  .fc-row:hover .fc-row-bar { transform: scaleY(1); }

  /* ── CTA ── */
  .fc-cta {
    position: relative; z-index: 1;
    background: var(--ink2);
    border-top: 1px solid var(--border);
    padding: 6rem 5vw;
    display: flex; flex-direction: column; align-items: center;
    text-align: center; gap: 1.75rem;
    overflow: hidden;
  }
  .fc-cta::before {
    content: '"Every comfort, considered"';
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%,-50%);
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.5rem, 4vw, 4rem); font-style: italic;
    color: rgba(255,255,255,0.02);
    white-space: nowrap; pointer-events: none; z-index: 0;
    letter-spacing: -0.02em;
  }

  .fc-cta-eyebrow {
    position: relative; z-index: 1;
    display: flex; align-items: center; gap: 0.75rem;
  }
  .fc-cta-ey-line { width: 28px; height: 1px; background: var(--bronze); }
  .fc-cta-ey-text {
    font-size: 0.62rem; letter-spacing: 0.26em;
    text-transform: uppercase; color: var(--bronze-lt);
  }

  .fc-cta-title {
    position: relative; z-index: 1;
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2rem, 4.5vw, 3.8rem);
    font-weight: 300; line-height: 1.1;
    color: var(--cream); letter-spacing: -0.02em;
  }
  .fc-cta-title em { font-style: italic; color: var(--bronze-lt); }

  .fc-cta-sub {
    position: relative; z-index: 1;
    font-size: 0.875rem; color: var(--fog);
    line-height: 1.8; font-weight: 300; max-width: 400px;
  }

  .fc-cta-btn {
    position: relative; z-index: 1;
    display: inline-flex; align-items: center; gap: 0.75rem;
    padding: 0.9rem 2.5rem;
    background: var(--bronze); color: var(--cream);
    border: none; cursor: pointer;
    font-family: 'Jost', sans-serif;
    font-size: 0.68rem; letter-spacing: 0.2em;
    text-transform: uppercase; font-weight: 500;
    text-decoration: none; overflow: hidden;
    transition: background 0.25s;
  }
  .fc-cta-btn::before {
    content: '';
    position: absolute; inset: 0;
    background: rgba(255,255,255,0.1);
    transform: translateX(-101%);
    transition: transform 0.3s ease;
  }
  .fc-cta-btn:hover::before { transform: translateX(0); }

  /* Corner accents */
  .fc-cta-corner {
    position: absolute; width: 48px; height: 48px; z-index: 1;
  }
  .fc-cta-corner-tl { top: 2rem; left: 2rem; border-top: 1px solid rgba(160,116,60,0.25); border-left: 1px solid rgba(160,116,60,0.25); }
  .fc-cta-corner-br { bottom: 2rem; right: 2rem; border-bottom: 1px solid rgba(160,116,60,0.25); border-right: 1px solid rgba(160,116,60,0.25); }

  /* ── Keyframes ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
`;

// Refined SVG icons — no emojis
const ICONS = {
  pool: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/><path d="M2 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/><circle cx="12" cy="5" r="2"/><path d="M12 7v3"/>
    </svg>
  ),
  spa: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22c4-4 7-8 7-12A7 7 0 0 0 5 10c0 4 3 8 7 12z"/><path d="M12 22c-4-4-7-8-7-12"/>
    </svg>
  ),
  gym: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4v6m12-6v6M4 7h4m8 0h4M6 20v-6m12 6v-6M4 17h4m8 0h4M12 12v0"/>
    </svg>
  ),
  wifi: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1" fill="currentColor"/>
    </svg>
  ),
  shuttle: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  ),
  roomservice: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17h18M3 12a9 9 0 0 1 18 0"/><path d="M12 3v2"/>
    </svg>
  ),
};

const FACILITIES = [
  { title: "Swimming Pool",    desc: "Relax and unwind in our luxurious outdoor infinity pool with breathtaking Indian Ocean views.",     tag: "Leisure",       icon: ICONS.pool,        num: "01" },
  { title: "Spa & Wellness",   desc: "Rejuvenate body and mind with our world-class Swahili-inspired spa treatments and rituals.",        tag: "Wellness",      icon: ICONS.spa,         num: "02" },
  { title: "Fitness Center",   desc: "Stay active with premium gym equipment, personal training, and a spacious workout floor.",          tag: "Health",        icon: ICONS.gym,         num: "03" },
  { title: "High-Speed Wi-Fi", desc: "Complimentary fibre-optic internet throughout the hotel — rooms, lounges, and pool areas.",         tag: "Connectivity",  icon: ICONS.wifi,        num: "04" },
  { title: "Airport Shuttle",  desc: "Convenient private transfers to and from Moi International Airport, available around the clock.",   tag: "Transport",     icon: ICONS.shuttle,     num: "05" },
  { title: "24/7 Room Service",desc: "Curated menus delivered directly to your room — breakfast, lunch, dinner, or a midnight snack.",    tag: "In-Room",       icon: ICONS.roomservice, num: "06" },
];

const rowVariants = {
  hidden:  { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.55, delay: i * 0.09, ease: [0.25,0.46,0.45,0.94] },
  }),
};

export default function Facilities() {
  return (
    <>
      <style>{STYLES}</style>
      <div className="fc-root">

        {/* Dot grid */}
        <div className="fc-dotgrid" aria-hidden="true" />

        {/* ── Hero ── */}
        <div className="fc-hero">
          <div className="fc-count" aria-hidden="true">0{FACILITIES.length}</div>
          <div className="fc-eyebrow">
            <div className="fc-eyebrow-line" />
            <span className="fc-eyebrow-text">Hotel Amenities</span>
          </div>
          <h1 className="fc-title">
            Everything you<br /><em>need, and more</em>
          </h1>
          <p className="fc-sub">
            Comfort, convenience, and luxury — every facility at StarHotel is
            designed to make your stay effortlessly exceptional.
          </p>
        </div>

        {/* ── Facilities list ── */}
        <div className="fc-list">
          {FACILITIES.map((f, i) => (
            <motion.div
              key={i}
              className="fc-row"
              custom={i}
              initial="hidden"
              whileInView="visible"
              variants={rowVariants}
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="fc-row-bar" aria-hidden="true" />

              {/* Number */}
              <div className="fc-row-num">{f.num}</div>

              {/* Content */}
              <div className="fc-row-centre">
                <div className="fc-row-title">{f.title}</div>
                <div className="fc-row-desc">{f.desc}</div>
              </div>

              {/* Icon + tag */}
              <div className="fc-row-right">
                <div className="fc-row-icon">{f.icon}</div>
                <span className="fc-row-tag">{f.tag}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── CTA ── */}
        <motion.div
          className="fc-cta"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div className="fc-cta-corner fc-cta-corner-tl" aria-hidden="true" />
          <div className="fc-cta-corner fc-cta-corner-br" aria-hidden="true" />

          <div className="fc-cta-eyebrow">
            <div className="fc-cta-ey-line" />
            <span className="fc-cta-ey-text">Ready to experience it all?</span>
            <div className="fc-cta-ey-line" />
          </div>

          <h2 className="fc-cta-title">
            Book your <em>stay</em> today
          </h2>

          <p className="fc-cta-sub">
            Every facility, every amenity — yours to enjoy from the moment you arrive.
          </p>

          <Link to="/rooms" className="fc-cta-btn">
            Reserve a Room
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
              <path d="M1 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </motion.div>

      </div>
    </>
  );
}