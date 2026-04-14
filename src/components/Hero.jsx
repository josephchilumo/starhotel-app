import React, { useEffect, useState } from "react";
import bedroomimage from "../Images/bedroomimage.png";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,700;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

  :root {
    --bronze:    #a0743c;
    --bronze-lt: #c49558;
    --cream:     #f0ece4;
    --fog:       rgba(240,236,228,0.55);
  }

  /* ── Hero shell ── */
  .hero-root {
    position: relative;
    width: 100%;
    height: 100vh;
    min-height: 600px;
    overflow: hidden;
    display: flex;
    align-items: flex-end;
    font-family: 'Jost', sans-serif;
  }

  /* ── Background image with ken-burns ── */
  .hero-bg {
    position: absolute;
    inset: 0;
    background-image: var(--hero-img);
    background-size: cover;
    background-position: center;
    transform: scale(1.08);
    animation: heroZoom 22s ease-in-out infinite alternate;
    will-change: transform;
  }
  @keyframes heroZoom {
    from { transform: scale(1.08); }
    to   { transform: scale(1.0);  }
  }

  /* ── Multi-layer atmospheric overlay ── */
  .hero-overlay-1 {
    position: absolute; inset: 0;
    background: linear-gradient(
      105deg,
      rgba(17,14,10,0.78) 0%,
      rgba(17,14,10,0.45) 45%,
      rgba(17,14,10,0.15) 100%
    );
  }
  .hero-overlay-2 {
    position: absolute; inset: 0;
    background: linear-gradient(
      to top,
      rgba(17,14,10,0.65) 0%,
      transparent 55%
    );
  }
  /* Subtle vignette */
  .hero-overlay-3 {
    position: absolute; inset: 0;
    box-shadow: inset 0 0 120px rgba(0,0,0,0.35);
  }

  /* ── Vertical golden rule ── */
  .hero-rule {
    position: absolute;
    top: 0; bottom: 0;
    right: 22vw;
    width: 1px;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(160,116,60,0.6) 20%,
      rgba(160,116,60,0.6) 80%,
      transparent 100%
    );
  }
  @media (max-width: 768px) { .hero-rule { display: none; } }

  /* ── Right sidebar stat ── */
  .hero-stat {
    position: absolute;
    right: 0;
    width: 22vw;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    opacity: 0;
    animation: fadeIn 1s ease 1.4s both;
  }
  @media (max-width: 768px) { .hero-stat { display: none; } }

  .hero-stat-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(3rem, 5vw, 4.5rem);
    font-weight: 300;
    color: var(--bronze-lt);
    line-height: 1;
    letter-spacing: -0.03em;
  }
  .hero-stat-label {
    font-size: 0.6rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(240,236,228,0.45);
    text-align: center;
  }
  .hero-stat-divider {
    width: 24px; height: 1px;
    background: var(--bronze);
    margin: 0.25rem 0;
  }

  /* ── Content area ── */
  .hero-content {
    position: relative;
    z-index: 10;
    width: 100%;
    padding: 0 5vw 5vh;
    max-width: 900px;
  }

  /* ── Eyebrow ── */
  .hero-eyebrow {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.75rem;
    opacity: 0;
    animation: slideUp 0.7s ease 0.2s both;
  }
  .hero-eyebrow-line {
    width: 28px; height: 1px;
    background: var(--bronze);
  }
  .hero-eyebrow-text {
    font-size: 0.65rem;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: var(--bronze-lt);
    font-weight: 400;
  }

  /* ── Main headline ── */
  .hero-h1 {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.8rem, 7vw, 6.5rem);
    font-weight: 300;
    line-height: 1.05;
    letter-spacing: -0.025em;
    color: var(--cream);
    margin-bottom: 1.75rem;
  }
  .hero-h1 .word {
    display: inline-block;
    opacity: 0;
    transform: translateY(30px);
    animation: wordUp 0.6s ease both;
    margin-right: 0.25em;
  }
  .hero-h1 .word.italic { font-style: italic; color: var(--bronze-lt); }

  /* Staggered word delays */
  .hero-h1 .word:nth-child(1) { animation-delay: 0.35s; }
  .hero-h1 .word:nth-child(2) { animation-delay: 0.48s; }
  .hero-h1 .word:nth-child(3) { animation-delay: 0.61s; }
  .hero-h1 .word:nth-child(4) { animation-delay: 0.74s; }
  .hero-h1 .word:nth-child(5) { animation-delay: 0.87s; }
  .hero-h1 .word:nth-child(6) { animation-delay: 1.0s; }

  /* ── Sub text ── */
  .hero-sub {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1rem, 1.8vw, 1.25rem);
    font-weight: 300;
    font-style: italic;
    color: rgba(240,236,228,0.65);
    line-height: 1.7;
    max-width: 520px;
    margin-bottom: 2.75rem;
    opacity: 0;
    animation: fadeIn 0.8s ease 1.1s both;
  }

  /* ── CTA row ── */
  .hero-cta-row {
    display: flex;
    align-items: center;
    gap: 2rem;
    opacity: 0;
    animation: fadeIn 0.8s ease 1.3s both;
    flex-wrap: wrap;
  }

  .hero-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.85rem 2rem;
    background: var(--bronze);
    color: #fff;
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    font-weight: 500;
    border: none;
    cursor: pointer;
    text-decoration: none;
    font-family: 'Jost', sans-serif;
    position: relative;
    overflow: hidden;
    transition: background 0.25s;
  }
  .hero-btn-primary::before {
    content: '';
    position: absolute; inset: 0;
    background: rgba(255,255,255,0.12);
    transform: translateX(-101%);
    transition: transform 0.3s ease;
  }
  .hero-btn-primary:hover::before { transform: translateX(0); }
  .hero-btn-primary:hover { background: #b8863f; }

  .hero-btn-secondary {
    font-size: 0.68rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(240,236,228,0.6);
    background: none;
    border: none;
    cursor: pointer;
    font-family: 'Jost', sans-serif;
    padding: 0;
    position: relative;
    transition: color 0.2s;
  }
  .hero-btn-secondary::after {
    content: '';
    position: absolute;
    bottom: -2px; left: 0;
    width: 0; height: 1px;
    background: var(--bronze-lt);
    transition: width 0.3s;
  }
  .hero-btn-secondary:hover { color: var(--cream); }
  .hero-btn-secondary:hover::after { width: 100%; }

  /* ── Scroll indicator ── */
  .hero-scroll {
    position: absolute;
    bottom: 2.5rem;
    right: 5vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    opacity: 0;
    animation: fadeIn 1s ease 1.6s both;
  }
  .hero-scroll-text {
    font-size: 0.58rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(240,236,228,0.35);
    writing-mode: vertical-rl;
    transform: rotate(180deg);
  }
  .hero-scroll-line {
    width: 1px;
    height: 48px;
    background: linear-gradient(to bottom, var(--bronze), transparent);
    animation: scrollPulse 2s ease-in-out 2s infinite;
  }
  @keyframes scrollPulse {
    0%, 100% { opacity: 0.4; transform: scaleY(1); }
    50%       { opacity: 1;   transform: scaleY(1.15); }
  }

  /* ── Year badge ── */
  .hero-badge {
    position: absolute;
    top: 2.5rem;
    right: 5vw;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.2rem;
    opacity: 0;
    animation: fadeIn 0.8s ease 0.5s both;
  }
  .hero-badge-year {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.75rem;
    font-style: italic;
    color: var(--bronze-lt);
    letter-spacing: 0.1em;
  }
  .hero-badge-est {
    font-size: 0.55rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(240,236,228,0.35);
  }

  /* ── Shared keyframes ── */
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes wordUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
`;

export default function Hero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{STYLES}</style>

      <section className="hero-root" style={{ "--hero-img": `url(${bedroomimage})` }}>

        {/* ── Background ── */}
        <div className="hero-bg" />

        {/* ── Overlays ── */}
        <div className="hero-overlay-1" />
        <div className="hero-overlay-2" />
        <div className="hero-overlay-3" />

        {/* ── Vertical rule ── */}
        <div className="hero-rule" />

        {/* ── Right stat ── */}
        <div className="hero-stat">
          <div className="hero-stat-num">25</div>
          <div className="hero-stat-divider" />
          <div className="hero-stat-label">Years of<br />Hospitality</div>
        </div>

        {/* ── Est. badge ── */}
        <div className="hero-badge">
          <div className="hero-badge-year">Est. 1998</div>
          <div className="hero-badge-est">Mombasa, Kenya</div>
        </div>

        {/* ── Main content ── */}
        <div className="hero-content">

          <div className="hero-eyebrow">
            <div className="hero-eyebrow-line" />
            <span className="hero-eyebrow-text">Luxury Coastal Retreat</span>
          </div>

          <h1 className="hero-h1">
            <span className="word">Where</span>
            <span className="word">Every</span>
            <span className="word">Stay</span>
            <span className="word">Becomes</span>
            <span className="word italic">a</span>
            <span className="word italic">Story</span>
          </h1>

          <p className="hero-sub">
            From candlelit dinners to peaceful Indian Ocean mornings —
            StarHotel has welcomed travellers for over two decades with
            unmatched comfort and elegance.
          </p>

          <div className="hero-cta-row">
            <a href="/rooms" className="hero-btn-primary">
              Explore Rooms
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                <path d="M1 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <button className="hero-btn-secondary">View Dining →</button>
          </div>

        </div>

        {/* ── Scroll indicator ── */}
        <div className="hero-scroll">
          <div className="hero-scroll-line" />
          <span className="hero-scroll-text">Scroll</span>
        </div>

      </section>
    </>
  );
}
