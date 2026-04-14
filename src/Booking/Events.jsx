import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Jost:wght@300;400;500&display=swap');

  :root {
    --ink:       #0f0e0c;
    --ink2:      #181714;
    --ink3:      #201f1b;
    --bronze:    #a0743c;
    --bronze-lt: #c49558;
    --cream:     #f0ece4;
    --fog:       rgba(240,236,228,0.45);
    --border:    rgba(255,255,255,0.07);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ev-root {
    min-height: 100vh;
    background: var(--ink);
    font-family: 'Jost', sans-serif;
    color: var(--cream);
  }

  /* ── Hero banner ── */
  .ev-hero {
    padding: 7rem 5vw 4rem;
    position: relative;
    overflow: hidden;
  }
  .ev-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 60% 80% at 80% 50%, rgba(160,116,60,0.07), transparent 70%);
    pointer-events: none;
  }

  .ev-eyebrow {
    display: flex; align-items: center; gap: 0.75rem;
    margin-bottom: 1.5rem;
  }
  .ev-eyebrow-line { width: 28px; height: 1px; background: var(--bronze); }
  .ev-eyebrow-text {
    font-size: 0.62rem; letter-spacing: 0.28em;
    text-transform: uppercase; color: var(--bronze-lt);
  }

  .ev-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(3rem, 7vw, 6.5rem);
    font-weight: 300; line-height: 1.02;
    letter-spacing: -0.025em; color: var(--cream);
    max-width: 820px;
  }
  .ev-title em { font-style: italic; color: var(--bronze-lt); }

  .ev-hero-sub {
    font-size: 0.9rem; color: var(--fog);
    line-height: 1.8; font-weight: 300;
    max-width: 440px; margin-top: 1.5rem;
    border-left: 2px solid var(--bronze);
    padding-left: 1.25rem;
  }

  /* ── Ticker strip ── */
  .ev-ticker {
    background: var(--ink2);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    padding: 0.7rem 0;
    overflow: hidden; white-space: nowrap;
  }
  .ev-ticker-track {
    display: inline-flex;
    animation: evTick 20s linear infinite;
  }
  @keyframes evTick {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  .ev-ticker-item {
    display: inline-flex; align-items: center; gap: 1.25rem;
    padding: 0 2.5rem;
    font-size: 0.62rem; letter-spacing: 0.24em;
    text-transform: uppercase;
    color: rgba(240,236,228,0.3);
  }
  .ev-ticker-dot {
    width: 3px; height: 3px;
    background: var(--bronze); border-radius: 50%; flex-shrink: 0;
  }

  /* ── Events layout ── */
  .ev-events {
    padding: 5rem 5vw;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  /* Row 1: wide left + tall right */
  .ev-row-1 {
    display: grid;
    grid-template-columns: 1.6fr 1fr;
    gap: 3px;
    height: 520px;
  }
  /* Row 2: single wide full */
  .ev-row-2 {
    height: 420px;
  }

  @media (max-width: 860px) {
    .ev-row-1 { grid-template-columns: 1fr; height: auto; }
    .ev-row-1 .ev-card { height: 400px; }
    .ev-row-2 { height: 400px; }
  }
  @media (max-width: 520px) {
    .ev-row-1 .ev-card { height: 320px; }
    .ev-row-2 { height: 320px; }
  }

  /* ── Event card ── */
  .ev-card {
    position: relative; overflow: hidden;
    cursor: pointer;
    height: 100%;
  }

  .ev-card-img {
    width: 100%; height: 100%;
    object-fit: cover; display: block;
    transition: transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94);
  }
  .ev-card:hover .ev-card-img { transform: scale(1.05); }

  .ev-card-base {
    position: absolute; inset: 0;
    background: linear-gradient(
      to top,
      rgba(10,9,7,0.92) 0%,
      rgba(10,9,7,0.35) 50%,
      rgba(10,9,7,0.05) 100%
    );
  }
  .ev-card-hover-overlay {
    position: absolute; inset: 0;
    background: rgba(10,9,7,0.35);
    opacity: 0; transition: opacity 0.4s;
  }
  .ev-card:hover .ev-card-hover-overlay { opacity: 1; }

  .ev-card-content {
    position: absolute; inset: 0;
    display: flex; flex-direction: column;
    justify-content: flex-end;
    padding: 2rem 2.25rem;
  }

  .ev-card-index {
    position: absolute; top: 1.5rem; left: 2rem;
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.78rem; font-style: italic;
    color: rgba(255,255,255,0.3);
    transition: color 0.3s;
  }
  .ev-card:hover .ev-card-index { color: var(--bronze-lt); }

  .ev-card-tag {
    font-size: 0.58rem; letter-spacing: 0.22em;
    text-transform: uppercase; color: var(--bronze-lt);
    margin-bottom: 0.5rem;
    opacity: 0; transform: translateY(6px);
    transition: opacity 0.35s, transform 0.35s;
  }
  .ev-card:hover .ev-card-tag { opacity: 1; transform: translateY(0); }

  .ev-card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.6rem, 3vw, 2.4rem);
    font-weight: 300; font-style: italic;
    color: var(--cream); line-height: 1.1;
    margin-bottom: 0; transition: margin-bottom 0.35s;
  }
  .ev-card:hover .ev-card-title { margin-bottom: 0.7rem; }

  .ev-card-sep {
    width: 0; height: 1px; background: var(--bronze);
    margin-bottom: 0;
    transition: width 0.4s ease 0.05s, margin-bottom 0.35s;
  }
  .ev-card:hover .ev-card-sep { width: 32px; margin-bottom: 0.75rem; }

  .ev-card-desc {
    font-size: 0.8rem; color: var(--fog);
    line-height: 1.7; font-weight: 300;
    max-height: 0; overflow: hidden; opacity: 0;
    transition: max-height 0.45s ease, opacity 0.35s ease 0.1s;
  }
  .ev-card:hover .ev-card-desc { max-height: 80px; opacity: 1; }

  .ev-card-cta {
    display: inline-flex; align-items: center; gap: 0.5rem;
    margin-top: 0;
    font-size: 0.62rem; letter-spacing: 0.18em;
    text-transform: uppercase; color: var(--bronze-lt);
    background: none; border: none; cursor: pointer;
    font-family: 'Jost', sans-serif; padding: 0;
    max-height: 0; overflow: hidden; opacity: 0;
    transition: max-height 0.4s ease 0.15s, opacity 0.3s ease 0.2s, margin-top 0.35s, gap 0.2s;
    pointer-events: none;
  }
  .ev-card:hover .ev-card-cta {
    max-height: 40px; opacity: 1; margin-top: 1rem; pointer-events: all;
  }
  .ev-card-cta:hover { gap: 0.85rem; }

  /* ── CTA section ── */
  .ev-cta {
    position: relative;
    background: var(--ink2);
    border-top: 1px solid var(--border);
    padding: 7rem 5vw;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 2rem;
  }
  /* Ghost pull-quote backdrop */
  .ev-cta::before {
    content: '"Moments made extraordinary"';
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2rem, 5vw, 5rem);
    font-style: italic; font-weight: 300;
    color: rgba(255,255,255,0.025);
    white-space: nowrap;
    pointer-events: none;
    letter-spacing: -0.02em;
    width: max-content;
    z-index: 0;
  }

  .ev-cta-eyebrow {
    position: relative; z-index: 1;
    display: flex; align-items: center; gap: 0.75rem;
  }
  .ev-cta-eyebrow-line { width: 28px; height: 1px; background: var(--bronze); }
  .ev-cta-eyebrow-text {
    font-size: 0.62rem; letter-spacing: 0.26em;
    text-transform: uppercase; color: var(--bronze-lt);
  }

  .ev-cta-title {
    position: relative; z-index: 1;
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.2rem, 5vw, 4rem);
    font-weight: 300; line-height: 1.1;
    letter-spacing: -0.02em; color: var(--cream);
  }
  .ev-cta-title em { font-style: italic; color: var(--bronze-lt); }

  .ev-cta-sub {
    position: relative; z-index: 1;
    font-size: 0.875rem; color: var(--fog);
    line-height: 1.8; font-weight: 300;
    max-width: 440px;
  }

  .ev-cta-btns {
    position: relative; z-index: 1;
    display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;
  }

  .ev-btn-primary {
    display: inline-flex; align-items: center; gap: 0.75rem;
    padding: 0.9rem 2.25rem;
    background: var(--bronze); color: var(--cream);
    border: none; cursor: pointer;
    font-family: 'Jost', sans-serif;
    font-size: 0.68rem; letter-spacing: 0.2em;
    text-transform: uppercase; font-weight: 500;
    text-decoration: none;
    position: relative; overflow: hidden;
    transition: background 0.25s;
  }
  .ev-btn-primary::before {
    content: '';
    position: absolute; inset: 0;
    background: rgba(255,255,255,0.1);
    transform: translateX(-101%);
    transition: transform 0.3s ease;
  }
  .ev-btn-primary:hover::before { transform: translateX(0); }
  .ev-btn-primary:hover { background: #b8843f; }

  .ev-btn-secondary {
    display: inline-flex; align-items: center; gap: 0.75rem;
    padding: 0.9rem 2.25rem;
    background: transparent; color: rgba(240,236,228,0.6);
    border: 1px solid var(--border); cursor: pointer;
    font-family: 'Jost', sans-serif;
    font-size: 0.68rem; letter-spacing: 0.2em;
    text-transform: uppercase; font-weight: 400;
    text-decoration: none;
    transition: color 0.2s, border-color 0.2s;
  }
  .ev-btn-secondary:hover { color: var(--cream); border-color: rgba(255,255,255,0.2); }

  /* Corner accents on CTA */
  .ev-cta-corner {
    position: absolute;
    width: 48px; height: 48px; z-index: 1;
  }
  .ev-cta-corner-tl { top: 2rem; left: 2rem; border-top: 1px solid rgba(160,116,60,0.3); border-left: 1px solid rgba(160,116,60,0.3); }
  .ev-cta-corner-br { bottom: 2rem; right: 2rem; border-bottom: 1px solid rgba(160,116,60,0.3); border-right: 1px solid rgba(160,116,60,0.3); }
`;

const EVENTS = [
  {
    title: "Weddings",
    tag: "Celebration",
    index: "01",
    description: "Celebrate your special day in a breathtaking setting with elegant décor and world-class service.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
  },
  {
    title: "Corporate Events",
    tag: "Business",
    index: "02",
    description: "Host meetings, conferences, and business events with modern facilities and seamless support.",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&q=80",
  },
  {
    title: "Private Parties",
    tag: "Occasion",
    index: "03",
    description: "From birthdays to anniversaries, enjoy unforgettable moments in a luxurious atmosphere.",
    image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=1200&q=80",
  },
];

const TICKER_ITEMS = ["Weddings", "Corporate Events", "Private Parties", "Galas", "Anniversaries", "Product Launches", "Retreats", "Celebrations"];

const cardVariants = {
  hidden:  { opacity: 0, y: 32 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, delay: i * 0.13, ease: [0.25,0.46,0.45,0.94] },
  }),
};

function EventCard({ event, index }) {
  return (
    <motion.div
      className="ev-card"
      custom={index}
      initial="hidden"
      whileInView="visible"
      variants={cardVariants}
      viewport={{ once: true, amount: 0.15 }}
    >
      <img src={event.image} alt={event.title} className="ev-card-img" />
      <div className="ev-card-base" />
      <div className="ev-card-hover-overlay" />
      <div className="ev-card-content">
        <span className="ev-card-index">{event.index}</span>
        <div className="ev-card-tag">{event.tag}</div>
        <h2 className="ev-card-title">{event.title}</h2>
        <div className="ev-card-sep" />
        <p className="ev-card-desc">{event.description}</p>
        <button className="ev-card-cta">
          Learn More
          <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
            <path d="M1 4.5h10M6.5 1l4 3.5-4 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </motion.div>
  );
}

export default function Events() {
  return (
    <>
      <style>{STYLES}</style>
      <div className="ev-root">

        {/* ── Hero ── */}
        <motion.div
          className="ev-hero"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="ev-eyebrow">
            <div className="ev-eyebrow-line" />
            <span className="ev-eyebrow-text">Events & Celebrations</span>
          </div>
          <h1 className="ev-title">
            Create <em>Unforgettable</em><br />Experiences
          </h1>
          <p className="ev-hero-sub">
            From intimate gatherings to grand celebrations — our elegant spaces
            and dedicated team bring your vision to life.
          </p>
        </motion.div>

        {/* ── Ticker ── */}
        <div className="ev-ticker" aria-hidden="true">
          <div className="ev-ticker-track">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="ev-ticker-item">
                {item}<span className="ev-ticker-dot" />
              </span>
            ))}
          </div>
        </div>

        {/* ── Event cards ── */}
        <div className="ev-events">

          {/* Row 1: two columns */}
          <div className="ev-row-1">
            <EventCard event={EVENTS[0]} index={0} />
            <EventCard event={EVENTS[1]} index={1} />
          </div>

          {/* Row 2: full-width */}
          <div className="ev-row-2">
            <EventCard event={EVENTS[2]} index={2} />
          </div>

        </div>

        {/* ── CTA ── */}
        <motion.div
          className="ev-cta"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div className="ev-cta-corner ev-cta-corner-tl" aria-hidden="true" />
          <div className="ev-cta-corner ev-cta-corner-br" aria-hidden="true" />

          <div className="ev-cta-eyebrow">
            <div className="ev-cta-eyebrow-line" />
            <span className="ev-cta-eyebrow-text">Let's Begin</span>
            <div className="ev-cta-eyebrow-line" />
          </div>

          <h2 className="ev-cta-title">
            Ready to plan your <em>event?</em>
          </h2>

          <p className="ev-cta-sub">
            Our events team is ready to help you design an experience that
            your guests will remember for years to come.
          </p>

          <div className="ev-cta-btns">
            <Link to="/contact" className="ev-btn-primary">
              Contact Our Team
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                <path d="M1 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link to="/rooms" className="ev-btn-secondary">
              View Spaces
            </Link>
          </div>
        </motion.div>

      </div>
    </>
  );
}