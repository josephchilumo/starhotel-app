import React, { useEffect, useRef } from "react";
import { FaBed, FaUtensils, FaSpa, FaSwimmer } from "react-icons/fa";
import starhotelhero from "../Images/starhotelhero.png";
import roomImg2 from "../Images/roomImg2.webp";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

  :root {
    --ink:       #0f0d0b;
    --ink2:      #1a1714;
    --ink3:      #242018;
    --bronze:    #a0743c;
    --bronze-lt: #c49558;
    --bronze-dk: #7a5628;
    --cream:     #f0ece4;
    --fog:       rgba(240,236,228,0.5);
    --border:    rgba(255,255,255,0.07);
  }

  /* ── Section shell ── */
  .cta-root {
    background: var(--ink);
    font-family: 'Jost', sans-serif;
    color: var(--cream);
    overflow: hidden;
  }

  /* ═══════════════════════════════════════
     AMENITIES BAND
  ═══════════════════════════════════════ */
  .cta-amenities {
    max-width: 1280px;
    margin: 0 auto;
    padding: 7rem 5vw 5rem;
  }

  /* Section label */
  .cta-label {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }
  .cta-label-line {
    width: 28px; height: 1px;
    background: var(--bronze);
  }
  .cta-label-text {
    font-size: 0.62rem;
    letter-spacing: 0.26em;
    text-transform: uppercase;
    color: var(--bronze-lt);
    font-weight: 400;
  }

  .cta-section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.2rem, 5vw, 4rem);
    font-weight: 300;
    line-height: 1.1;
    letter-spacing: -0.02em;
    color: var(--cream);
    margin-bottom: 0.75rem;
    max-width: 500px;
  }
  .cta-section-title em {
    font-style: italic;
    color: var(--bronze-lt);
  }

  .cta-section-sub {
    font-size: 0.85rem;
    color: var(--fog);
    font-weight: 300;
    line-height: 1.7;
    max-width: 420px;
    margin-bottom: 4rem;
  }

  /* ── Amenity tiles ── */
  .cta-tiles {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    border-top: 1px solid var(--border);
    border-left: 1px solid var(--border);
  }
  @media (max-width: 860px) { .cta-tiles { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 480px) { .cta-tiles { grid-template-columns: 1fr; } }

  .cta-tile {
    padding: 2.5rem 2rem;
    border-right: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    position: relative;
    overflow: hidden;
    transition: background 0.35s;
    cursor: default;
  }
  .cta-tile::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(160,116,60,0.08), transparent);
    opacity: 0;
    transition: opacity 0.35s;
  }
  .cta-tile:hover { background: var(--ink2); }
  .cta-tile:hover::before { opacity: 1; }

  /* Large decorative number */
  .cta-tile-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 5rem;
    font-weight: 300;
    color: rgba(160,116,60,0.07);
    line-height: 1;
    position: absolute;
    top: 0.5rem; right: 1rem;
    transition: color 0.35s;
    user-select: none;
  }
  .cta-tile:hover .cta-tile-num { color: rgba(160,116,60,0.14); }

  .cta-tile-icon {
    font-size: 1.1rem;
    color: var(--bronze);
    margin-bottom: 1.25rem;
    transition: color 0.3s;
  }
  .cta-tile:hover .cta-tile-icon { color: var(--bronze-lt); }

  .cta-tile-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.3rem;
    font-weight: 400;
    color: var(--cream);
    margin-bottom: 0.6rem;
    letter-spacing: 0.01em;
  }

  .cta-tile-desc {
    font-size: 0.78rem;
    color: var(--fog);
    font-weight: 300;
    line-height: 1.7;
  }

  /* ═══════════════════════════════════════
     CTA / IMAGE SPLIT SECTION
  ═══════════════════════════════════════ */
  .cta-split {
    margin-top: 5rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    min-height: 640px;
  }
  @media (max-width: 860px) {
    .cta-split { grid-template-columns: 1fr; }
  }

  /* Left: dark text panel */
  .cta-split-text {
    background: var(--ink2);
    padding: 6rem 5vw 6rem 5vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }
  /* Decorative corner accent */
  .cta-split-text::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 80px; height: 80px;
    border-top: 1px solid var(--bronze-dk);
    border-left: 1px solid var(--bronze-dk);
  }
  .cta-split-text::after {
    content: '';
    position: absolute;
    bottom: 0; right: 0;
    width: 80px; height: 80px;
    border-bottom: 1px solid var(--bronze-dk);
    border-right: 1px solid var(--bronze-dk);
  }

  .cta-pull-quote {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2rem, 4vw, 3.2rem);
    font-weight: 300;
    font-style: italic;
    color: var(--cream);
    line-height: 1.25;
    letter-spacing: -0.01em;
    margin-bottom: 2rem;
    position: relative;
  }
  .cta-pull-quote::before {
    content: '"';
    font-size: 6rem;
    color: var(--bronze-dk);
    line-height: 0;
    position: absolute;
    top: 2.2rem; left: -1.5rem;
    font-style: normal;
    opacity: 0.6;
  }

  .cta-body-text {
    font-size: 0.875rem;
    color: var(--fog);
    line-height: 1.85;
    font-weight: 300;
    max-width: 400px;
    margin-bottom: 2.75rem;
  }

  /* Stats row */
  .cta-stats {
    display: flex;
    gap: 2.5rem;
    margin-bottom: 3rem;
    padding-bottom: 2.5rem;
    border-bottom: 1px solid var(--border);
  }
  .cta-stat-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.2rem;
    font-weight: 300;
    color: var(--bronze-lt);
    line-height: 1;
    margin-bottom: 0.25rem;
  }
  .cta-stat-label {
    font-size: 0.62rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(240,236,228,0.35);
  }

  /* CTA button */
  .cta-book-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.85rem;
    padding: 0.9rem 2.25rem;
    background: var(--bronze);
    color: var(--cream);
    font-size: 0.68rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    font-weight: 500;
    text-decoration: none;
    font-family: 'Jost', sans-serif;
    border: none;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: background 0.25s;
    align-self: flex-start;
  }
  .cta-book-btn::before {
    content: '';
    position: absolute; inset: 0;
    background: rgba(255,255,255,0.1);
    transform: translateX(-101%);
    transition: transform 0.3s ease;
  }
  .cta-book-btn:hover::before { transform: translateX(0); }
  .cta-book-btn:hover { background: #b8843f; }
  .cta-book-btn svg { flex-shrink: 0; }

  /* Right: stacked images */
  .cta-split-images {
    position: relative;
    overflow: hidden;
    background: var(--ink3);
    min-height: 500px;
  }

  .cta-img-back {
    position: absolute;
    inset: 0;
    width: 100%; height: 100%;
    object-fit: cover;
    opacity: 0.85;
    transition: transform 0.7s ease;
  }
  .cta-split-images:hover .cta-img-back { transform: scale(1.04); }

  /* Overlay gradient on image */
  .cta-img-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(
      to right,
      rgba(15,13,11,0.55) 0%,
      transparent 60%
    );
  }

  /* Floating front card image */
  .cta-img-front {
    position: absolute;
    bottom: 2.5rem;
    left: -2rem;
    width: 52%;
    aspect-ratio: 3/4;
    object-fit: cover;
    box-shadow: 0 24px 64px rgba(0,0,0,0.55);
    border: 3px solid var(--ink2);
    transition: transform 0.5s ease;
  }
  .cta-split-images:hover .cta-img-front { transform: translateY(-6px) translateX(4px); }

  /* Bronze tag on front image */
  .cta-img-tag {
    position: absolute;
    bottom: 2.5rem;
    left: calc(-2rem + 52% + 1rem);
    background: var(--bronze);
    padding: 0.5rem 1rem;
    font-size: 0.6rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--cream);
    font-family: 'Jost', sans-serif;
    white-space: nowrap;
  }
  @media (max-width: 480px) {
    .cta-img-front { display: none; }
    .cta-img-tag { display: none; }
  }

  /* ── Fade-up animation ── */
  .cta-fu {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .cta-fu.visible {
    opacity: 1;
    transform: translateY(0);
  }
  .cta-fu:nth-child(2) { transition-delay: 0.1s; }
  .cta-fu:nth-child(3) { transition-delay: 0.2s; }
  .cta-fu:nth-child(4) { transition-delay: 0.3s; }
`;

// Simple intersection observer hook
function useFadeUp(ref) {
  useEffect(() => {
    const els = ref.current?.querySelectorAll(".cta-fu");
    if (!els) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.15 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [ref]);
}

const FEATURES = [
  { icon: <FaBed />,      num: "01", title: "Luxury Rooms",   desc: "Spacious, elegantly appointed rooms designed for deep rest and quiet indulgence." },
  { icon: <FaUtensils />, num: "02", title: "Fine Dining",    desc: "Gourmet cuisine crafted by award-winning chefs, served with an ocean breeze." },
  { icon: <FaSpa />,      num: "03", title: "Spa & Wellness", desc: "Rejuvenating treatments inspired by ancient Swahili coastal rituals." },
  { icon: <FaSwimmer />,  num: "04", title: "Infinity Pool",  desc: "Disappear into the horizon from our signature pool overlooking the Indian Ocean." },
];

export default function CTASection() {
  const rootRef = useRef(null);
  useFadeUp(rootRef);

  return (
    <>
      <style>{STYLES}</style>
      <section className="cta-root" ref={rootRef}>

        {/* ══ AMENITIES BAND ══ */}
        <div className="cta-amenities">

          <div className="cta-label cta-fu">
            <div className="cta-label-line" />
            <span className="cta-label-text">What We Offer</span>
          </div>

          <h2 className="cta-section-title cta-fu">
            Crafted for the <em>discerning</em> traveller
          </h2>

          <p className="cta-section-sub cta-fu">
            Every detail at StarHotel is curated to exceed expectation —
            from the thread count of your linen to the view from your balcony.
          </p>

          {/* Tiles */}
          <div className="cta-tiles">
            {FEATURES.map((f, i) => (
              <div key={i} className="cta-tile">
                <span className="cta-tile-num">{f.num}</span>
                <div className="cta-tile-icon">{f.icon}</div>
                <h3 className="cta-tile-title">{f.title}</h3>
                <p className="cta-tile-desc">{f.desc}</p>
              </div>
            ))}
          </div>

        </div>

        {/* ══ CTA SPLIT ══ */}
        <div className="cta-split">

          {/* Text panel */}
          <div className="cta-split-text">

            <div className="cta-pull-quote cta-fu">
              Experience unmatched luxury on the Kenyan coast
            </div>

            <p className="cta-body-text cta-fu">
              Discover the perfect union of elegance and comfort at StarHotel.
              Reserve your retreat today and step into a world where every
              moment is designed to delight.
            </p>

            {/* Stats */}
            <div className="cta-stats cta-fu">
              {[
                { num: "25+", label: "Years of Excellence" },
                { num: "48",  label: "Curated Rooms" },
                { num: "4.9", label: "Guest Rating" },
              ].map((s, i) => (
                <div key={i}>
                  <div className="cta-stat-num">{s.num}</div>
                  <div className="cta-stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            <a href="/rooms" className="cta-book-btn cta-fu">
              Reserve a Room
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                <path d="M1 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>

          </div>

          {/* Images panel */}
          <div className="cta-split-images">
            <img src={roomImg2} alt="Hotel interior" className="cta-img-back" />
            <div className="cta-img-overlay" />
            <img src={starhotelhero} alt="Luxury room" className="cta-img-front" />
            <div className="cta-img-tag">Signature Suite</div>
          </div>

        </div>

      </section>
    </>
  );
}
