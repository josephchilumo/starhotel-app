import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Jost:wght@300;400;500&display=swap');

  :root {
    --parch:     #f2e8d9;
    --parch-dk:  #e6d9c5;
    --bark:      #2b2318;
    --bark-lt:   #4a3f33;
    --bronze:    #a0743c;
    --bronze-lt: #c49558;
    --fog:       #9c9188;
    --white:     #ffffff;
    --border:    rgba(43,35,24,0.1);
    --ink-over:  rgba(15,12,8,0.88);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .dn-root {
    min-height: 100vh;
    background: var(--parch);
    font-family: 'Jost', sans-serif;
    color: var(--bark);
  }

  /* ══════════════════════════════════
     HERO
  ══════════════════════════════════ */
  .dn-hero {
    position: relative;
    height: 100vh; min-height: 600px;
    overflow: hidden;
    display: flex; align-items: flex-end;
  }

  .dn-hero-img {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover;
    transform: scale(1.06);
    animation: heroZoom 18s ease-in-out infinite alternate;
  }
  @keyframes heroZoom {
    from { transform: scale(1.06); }
    to   { transform: scale(1.0); }
  }

  .dn-hero-overlay {
    position: absolute; inset: 0;
    background:
      linear-gradient(105deg, rgba(15,12,8,0.85) 0%, rgba(15,12,8,0.4) 55%, rgba(15,12,8,0.1) 100%),
      linear-gradient(to top, rgba(15,12,8,0.6) 0%, transparent 50%);
  }

  .dn-hero-content {
    position: relative; z-index: 2;
    padding: 0 5vw 5vh;
    max-width: 760px;
  }

  .dn-hero-eyebrow {
    display: flex; align-items: center; gap: 0.75rem;
    margin-bottom: 1.5rem;
    opacity: 0; animation: fadeUp 0.7s ease 0.2s both;
  }
  .dn-hero-eyebrow-line { width: 28px; height: 1px; background: var(--bronze); }
  .dn-hero-eyebrow-text {
    font-size: 0.62rem; letter-spacing: 0.26em;
    text-transform: uppercase; color: var(--bronze-lt);
  }

  .dn-hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(3rem, 7vw, 6rem);
    font-weight: 300; line-height: 1.02;
    letter-spacing: -0.025em;
    color: var(--white);
    opacity: 0; animation: fadeUp 0.75s ease 0.38s both;
  }
  .dn-hero-title em { font-style: italic; color: var(--bronze-lt); }

  .dn-hero-sub {
    font-size: 0.9rem; color: rgba(255,255,255,0.6);
    line-height: 1.8; font-weight: 300;
    max-width: 420px; margin-top: 1.25rem;
    border-left: 2px solid var(--bronze);
    padding-left: 1.25rem;
    opacity: 0; animation: fadeUp 0.75s ease 0.55s both;
  }

  /* Hours pill */
  .dn-hero-hours {
    position: absolute; bottom: 3rem; right: 5vw;
    z-index: 2;
    display: flex; flex-direction: column; align-items: flex-end; gap: 0.3rem;
    opacity: 0; animation: fadeIn 0.8s ease 0.9s both;
  }
  .dn-hours-label {
    font-size: 0.58rem; letter-spacing: 0.22em;
    text-transform: uppercase; color: rgba(255,255,255,0.3);
  }
  .dn-hours-time {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1rem; font-style: italic;
    color: var(--bronze-lt); letter-spacing: 0.04em;
  }

  /* ══════════════════════════════════
     SECTION HEADER
  ══════════════════════════════════ */
  .dn-section-head {
    padding: 5rem 5vw 3rem;
    display: flex; align-items: flex-end;
    justify-content: space-between; gap: 2rem; flex-wrap: wrap;
  }

  .dn-sec-eyebrow {
    display: flex; align-items: center; gap: 0.7rem; margin-bottom: 1rem;
  }
  .dn-sec-eyebrow-line { width: 28px; height: 1px; background: var(--bronze); }
  .dn-sec-eyebrow-text {
    font-size: 0.62rem; letter-spacing: 0.26em;
    text-transform: uppercase; color: var(--bronze);
  }

  .dn-sec-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.2rem, 4.5vw, 3.8rem);
    font-weight: 300; line-height: 1.1;
    letter-spacing: -0.02em; color: var(--bark);
  }
  .dn-sec-title em { font-style: italic; color: var(--bronze); }

  .dn-sec-sub {
    font-size: 0.85rem; color: var(--fog);
    line-height: 1.8; font-weight: 300;
    border-left: 2px solid var(--bronze);
    padding-left: 1.25rem; max-width: 320px;
    align-self: flex-end;
  }

  /* ══════════════════════════════════
     RESTAURANT PANELS (horizontal splits)
  ══════════════════════════════════ */
  .dn-panels {
    padding: 0 5vw;
    display: flex; flex-direction: column;
    gap: 3px;
  }

  .dn-panel {
    display: grid;
    grid-template-columns: 1fr 1fr;
    height: 420px;
    border: 1px solid var(--border);
    overflow: hidden;
    transition: box-shadow 0.35s;
  }
  .dn-panel:hover { box-shadow: 0 12px 48px rgba(43,35,24,0.1); }

  /* Alternate image side */
  .dn-panel.reverse { direction: rtl; }
  .dn-panel.reverse > * { direction: ltr; }

  @media (max-width: 760px) {
    .dn-panel { grid-template-columns: 1fr; height: auto; }
    .dn-panel.reverse { direction: ltr; }
    .dn-panel-img-wrap { height: 260px; }
  }

  .dn-panel-img-wrap {
    position: relative; overflow: hidden;
    height: 100%;
  }
  .dn-panel-img {
    width: 100%; height: 100%;
    object-fit: cover; display: block;
    transition: transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94);
  }
  .dn-panel:hover .dn-panel-img { transform: scale(1.05); }

  /* Index watermark on image */
  .dn-panel-img-num {
    position: absolute; bottom: 1rem; right: 1.25rem;
    font-family: 'Cormorant Garamond', serif;
    font-size: 5rem; font-weight: 300; font-style: italic;
    color: rgba(255,255,255,0.12); line-height: 1;
    user-select: none; pointer-events: none;
  }

  /* Text side */
  .dn-panel-body {
    background: var(--white);
    padding: 3rem;
    display: flex; flex-direction: column; justify-content: center;
    position: relative; overflow: hidden;
  }
  .dn-panel-body::before {
    content: '';
    position: absolute; top: 0; left: 0;
    width: 3px; height: 0;
    background: var(--bronze);
    transition: height 0.4s ease;
  }
  .dn-panel:hover .dn-panel-body::before { height: 100%; }

  .dn-panel-tag {
    font-size: 0.6rem; letter-spacing: 0.22em;
    text-transform: uppercase; color: var(--bronze);
    margin-bottom: 1rem;
    display: flex; align-items: center; gap: 0.6rem;
  }
  .dn-panel-tag::before { content: ''; width: 20px; height: 1px; background: var(--bronze-lt); }

  .dn-panel-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.6rem, 2.5vw, 2.2rem);
    font-weight: 400; line-height: 1.15;
    color: var(--bark); margin-bottom: 1rem;
    letter-spacing: -0.01em;
  }
  .dn-panel-name em { font-style: italic; color: var(--bronze); }

  .dn-panel-desc {
    font-size: 0.85rem; color: var(--fog);
    line-height: 1.8; font-weight: 300;
    margin-bottom: 1.75rem;
  }

  .dn-panel-cta {
    display: inline-flex; align-items: center; gap: 0.6rem;
    font-size: 0.65rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--bronze);
    background: none; border: none; cursor: pointer;
    font-family: 'Jost', sans-serif; padding: 0;
    transition: gap 0.2s, color 0.2s;
  }
  .dn-panel-cta:hover { gap: 1rem; color: var(--bark); }

  /* ══════════════════════════════════
     RESERVATION CTA
  ══════════════════════════════════ */
  .dn-reservation {
    margin-top: 5rem;
    background: var(--bark);
    display: grid; grid-template-columns: 1fr 1fr;
    min-height: 420px;
    position: relative; overflow: hidden;
  }
  @media (max-width: 760px) { .dn-reservation { grid-template-columns: 1fr; } }

  /* Left: text */
  .dn-res-text {
    padding: 5rem 4vw 5rem 5vw;
    display: flex; flex-direction: column; justify-content: center; gap: 1.5rem;
    position: relative; z-index: 1;
  }
  .dn-res-text::before {
    content: '';
    position: absolute; top: 2.5rem; left: 2.5rem;
    width: 48px; height: 48px;
    border-top: 1px solid rgba(160,116,60,0.3);
    border-left: 1px solid rgba(160,116,60,0.3);
  }

  .dn-res-eyebrow {
    display: flex; align-items: center; gap: 0.7rem;
  }
  .dn-res-ey-line { width: 20px; height: 1px; background: var(--bronze); }
  .dn-res-ey-text {
    font-size: 0.6rem; letter-spacing: 0.26em;
    text-transform: uppercase; color: var(--bronze-lt);
  }

  .dn-res-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2rem, 3.5vw, 3rem);
    font-weight: 300; line-height: 1.1;
    color: var(--white); letter-spacing: -0.015em;
  }
  .dn-res-title em { font-style: italic; color: var(--bronze-lt); }

  .dn-res-sub {
    font-size: 0.82rem; color: rgba(240,236,228,0.5);
    line-height: 1.8; font-weight: 300; max-width: 340px;
  }

  .dn-res-btn {
    align-self: flex-start;
    display: inline-flex; align-items: center; gap: 0.75rem;
    padding: 0.9rem 2.25rem;
    background: var(--bronze); color: var(--white);
    border: none; cursor: pointer;
    font-family: 'Jost', sans-serif;
    font-size: 0.68rem; letter-spacing: 0.2em;
    text-transform: uppercase; font-weight: 500;
    text-decoration: none;
    overflow: hidden; position: relative;
    transition: background 0.25s;
  }
  .dn-res-btn::before {
    content: '';
    position: absolute; inset: 0;
    background: rgba(255,255,255,0.1);
    transform: translateX(-101%);
    transition: transform 0.3s ease;
  }
  .dn-res-btn:hover::before { transform: translateX(0); }

  /* Right: decorative image */
  .dn-res-img-wrap {
    position: relative; overflow: hidden;
  }
  .dn-res-img {
    width: 100%; height: 100%;
    object-fit: cover; display: block;
    opacity: 0.6;
    transition: opacity 0.4s, transform 0.8s ease;
  }
  .dn-reservation:hover .dn-res-img { opacity: 0.75; transform: scale(1.03); }

  /* Overlay on image */
  .dn-res-img-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to right, rgba(43,35,24,0.6), transparent);
  }

  /* Ghost number */
  .dn-res-ghost {
    position: absolute; bottom: 1rem; right: 1.5rem;
    font-family: 'Cormorant Garamond', serif;
    font-size: 8rem; font-weight: 300; font-style: italic;
    color: rgba(255,255,255,0.04); line-height: 1;
    user-select: none; pointer-events: none; z-index: 1;
  }

  /* ── Animations ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
`;

const RESTAURANTS = [
  {
    name: "Riverfront Restaurant",
    nameEm: "Restaurant",
    tag: "Fine Dining",
    index: "01",
    description: "Enjoy fine dining with breathtaking river views and a curated international menu. Open for lunch and dinner, seven days a week.",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80",
    hours: "12:00 – 22:30",
  },
  {
    name: "Sky Lounge",
    nameEm: "Lounge",
    tag: "Rooftop Bar",
    index: "02",
    description: "Relax with handcrafted cocktails and light bites in a sophisticated rooftop atmosphere. The perfect sundowner destination.",
    image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1200&q=80",
    hours: "17:00 – 01:00",
  },
  {
    name: "Poolside Bar",
    nameEm: "Bar",
    tag: "Casual Dining",
    index: "03",
    description: "Sip refreshing tropical drinks and enjoy light snacks by the pool in a relaxed, sun-drenched setting.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80",
    hours: "10:00 – 19:00",
  },
];

const panelVariants = {
  hidden:  { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.13, ease: [0.25,0.46,0.45,0.94] },
  }),
};

export default function Dining() {
  return (
    <>
      <style>{STYLES}</style>
      <div className="dn-root">

        {/* ── Hero ── */}
        <section className="dn-hero">
          <img
            className="dn-hero-img"
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80"
            alt="Dining at StarHotel"
          />
          <div className="dn-hero-overlay" />

          <div className="dn-hero-content">
            <div className="dn-hero-eyebrow">
              <div className="dn-hero-eyebrow-line" />
              <span className="dn-hero-eyebrow-text">Culinary Experiences</span>
            </div>
            <h1 className="dn-hero-title">
              Taste the <em>Finest</em><br />Flavours
            </h1>
            <p className="dn-hero-sub">
              Three distinct dining venues, each with its own character —
              from candlelit fine dining to breezy poolside bites.
            </p>
          </div>

          <div className="dn-hero-hours">
            <span className="dn-hours-label">Dining Hours</span>
            <span className="dn-hours-time">10:00 AM – 01:00 AM</span>
          </div>
        </section>

        {/* ── Section header ── */}
        <motion.div
          className="dn-section-head"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div>
            <div className="dn-sec-eyebrow">
              <div className="dn-sec-eyebrow-line" />
              <span className="dn-sec-eyebrow-text">Our Venues</span>
            </div>
            <h2 className="dn-sec-title">
              Where Every<br /><em>Meal Matters</em>
            </h2>
          </div>
          <p className="dn-sec-sub">
            From rooftop sunsets to riverside lunches — each venue is
            crafted to make dining an experience in itself.
          </p>
        </motion.div>

        {/* ── Restaurant panels ── */}
        <div className="dn-panels">
          {RESTAURANTS.map((r, i) => (
            <motion.div
              key={i}
              className={`dn-panel${i % 2 !== 0 ? " reverse" : ""}`}
              custom={i}
              initial="hidden"
              whileInView="visible"
              variants={panelVariants}
              viewport={{ once: true, amount: 0.15 }}
            >
              {/* Image */}
              <div className="dn-panel-img-wrap">
                <img src={r.image} alt={r.name} className="dn-panel-img" />
                <span className="dn-panel-img-num" aria-hidden="true">{r.index}</span>
              </div>

              {/* Text */}
              <div className="dn-panel-body">
                <div className="dn-panel-tag">{r.tag}</div>
                <h2 className="dn-panel-name">{r.name}</h2>
                <p className="dn-panel-desc">{r.description}</p>
                <div style={{ display:"flex", alignItems:"center", gap:"1.5rem", flexWrap:"wrap" }}>
                  <button className="dn-panel-cta">
                    View Menu
                    <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                      <path d="M1 4.5h10M6.5 1l4 3.5-4 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <span style={{ fontSize:"0.68rem", letterSpacing:"0.1em", color:"var(--fog)" }}>
                    ◈ {r.hours}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Reservation CTA ── */}
        <motion.div
          className="dn-reservation"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          viewport={{ once: true }}
          style={{ marginTop: "5rem" }}
        >
          <div className="dn-res-text">
            <div className="dn-res-eyebrow">
              <div className="dn-res-ey-line" />
              <span className="dn-res-ey-text">Reservations</span>
            </div>
            <h2 className="dn-res-title">
              Reserve your<br /><em>table today</em>
            </h2>
            <p className="dn-res-sub">
              Secure your seat at any of our venues. We recommend booking
              ahead for weekend evenings and special occasions.
            </p>
            <Link to="/booking" className="dn-res-btn">
              Book a Table
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                <path d="M1 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

          <div className="dn-res-img-wrap">
            <img
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80"
              alt="Reserve a table"
              className="dn-res-img"
            />
            <div className="dn-res-img-overlay" />
            <span className="dn-res-ghost" aria-hidden="true">◈</span>
          </div>
        </motion.div>

      </div>
    </>
  );
}