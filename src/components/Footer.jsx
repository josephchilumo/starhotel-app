import React from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

  :root {
    --ink:       #0d0f0c;
    --ink2:      #161814;
    --bronze:    #a0743c;
    --bronze-lt: #c49558;
    --cream:     #f0ece4;
    --fog:       rgba(240,236,228,0.38);
    --border:    rgba(255,255,255,0.07);
  }

  .ft-root {
    background: var(--ink);
    font-family: 'Jost', sans-serif;
    color: var(--cream);
    position: relative;
    overflow: hidden;
  }

  /* ── Giant ghost wordmark ── */
  .ft-wordmark {
    position: absolute;
    bottom: 3.5rem;
    left: 50%;
    transform: translateX(-50%);
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(5rem, 14vw, 13rem);
    font-weight: 300;
    font-style: italic;
    white-space: nowrap;
    color: rgba(255,255,255,0.03);
    letter-spacing: -0.02em;
    user-select: none;
    pointer-events: none;
    z-index: 0;
    line-height: 1;
  }

  /* ── Main grid ── */
  .ft-grid {
    position: relative;
    z-index: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 5rem 5vw 3.5rem;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1.2fr;
    gap: 3rem;
  }
  @media (max-width: 900px) {
    .ft-grid { grid-template-columns: 1fr 1fr; gap: 2.5rem; }
  }
  @media (max-width: 520px) {
    .ft-grid { grid-template-columns: 1fr; gap: 2rem; padding: 3.5rem 5vw 2.5rem; }
  }

  /* ── Brand column ── */
  .ft-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.6rem;
    font-weight: 300;
    letter-spacing: 0.06em;
    color: var(--cream);
    margin-bottom: 1.25rem;
    display: block;
    text-decoration: none;
  }
  .ft-logo em { font-style: italic; color: var(--bronze-lt); }

  .ft-tagline {
    font-size: 0.8rem;
    color: var(--fog);
    line-height: 1.8;
    font-weight: 300;
    margin-bottom: 2rem;
    max-width: 240px;
  }

  /* Location block */
  .ft-location {
    display: flex;
    align-items: flex-start;
    gap: 0.6rem;
  }
  .ft-loc-dot {
    width: 7px; height: 7px;
    background: var(--bronze);
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 0.25rem;
    box-shadow: 0 0 0 0 rgba(160,116,60,0.5);
    animation: locPulse 2.5s ease-in-out infinite;
  }
  @keyframes locPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(160,116,60,0.4); }
    50%       { box-shadow: 0 0 0 6px rgba(160,116,60,0); }
  }
  .ft-loc-text { display: flex; flex-direction: column; gap: 0.15rem; }
  .ft-loc-city {
    font-size: 0.75rem;
    color: rgba(240,236,228,0.6);
    letter-spacing: 0.06em;
  }
  .ft-loc-coords {
    font-size: 0.62rem;
    letter-spacing: 0.1em;
    color: rgba(240,236,228,0.25);
    font-family: 'Jost', sans-serif;
  }

  /* ── Column label ── */
  .ft-col-label {
    font-size: 0.6rem;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: var(--bronze);
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }
  .ft-col-label::after {
    content: '';
    flex: 1; height: 1px;
    background: var(--border);
    max-width: 32px;
  }

  /* ── Nav links ── */
  .ft-nav {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
  }
  .ft-nav a {
    font-size: 0.8rem;
    color: var(--fog);
    text-decoration: none;
    letter-spacing: 0.04em;
    font-weight: 300;
    transition: color 0.2s, padding-left 0.2s;
    display: block;
  }
  .ft-nav a:hover { color: var(--cream); padding-left: 4px; }

  /* ── Contact list ── */
  .ft-contact {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
  }
  .ft-contact li {
    font-size: 0.8rem;
    color: var(--fog);
    font-weight: 300;
    letter-spacing: 0.04em;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .ft-contact-icon { color: var(--bronze); font-size: 0.65rem; flex-shrink: 0; }

  /* ── Social ── */
  .ft-social {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .ft-social-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.78rem;
    color: var(--fog);
    text-decoration: none;
    font-weight: 300;
    letter-spacing: 0.04em;
    transition: color 0.2s;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--border);
  }
  .ft-social-link:last-child { border-bottom: none; }
  .ft-social-link:hover { color: var(--cream); }
  .ft-social-icon {
    width: 28px; height: 28px;
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.7rem;
    flex-shrink: 0;
    transition: background 0.2s, border-color 0.2s, color 0.2s;
    color: var(--bronze-lt);
  }
  .ft-social-link:hover .ft-social-icon {
    background: var(--bronze);
    border-color: var(--bronze);
    color: var(--cream);
  }

  /* ── Divider ── */
  .ft-divider {
    position: relative; z-index: 1;
    max-width: 1200px; margin: 0 auto;
    padding: 0 5vw;
    display: flex; align-items: center; gap: 1rem;
  }
  .ft-divider-line { flex: 1; height: 1px; background: var(--border); }
  .ft-divider-diamond {
    width: 5px; height: 5px;
    background: var(--bronze);
    transform: rotate(45deg);
    flex-shrink: 0;
  }

  /* ── Bottom bar ── */
  .ft-bottom {
    position: relative; z-index: 1;
    max-width: 1200px; margin: 0 auto;
    padding: 1.25rem 5vw 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.75rem;
  }
  .ft-copy {
    font-size: 0.65rem;
    letter-spacing: 0.14em;
    color: rgba(240,236,228,0.2);
  }
  .ft-copy em { color: var(--bronze); font-style: normal; }
  .ft-bottom-links {
    display: flex; gap: 1.75rem;
  }
  .ft-bottom-link {
    font-size: 0.62rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(240,236,228,0.2);
    text-decoration: none;
    transition: color 0.2s;
  }
  .ft-bottom-link:hover { color: rgba(240,236,228,0.5); }
`;

export default function Footer() {
  return (
    <>
      <style>{STYLES}</style>
      <footer className="ft-root">

        {/* Ghost wordmark */}
        <div className="ft-wordmark" aria-hidden="true">StarHotel</div>

        {/* Main grid */}
        <div className="ft-grid">

          {/* ── Brand ── */}
          <div>
            <Link to="/" className="ft-logo">Star<em>Hotel</em></Link>
            <p className="ft-tagline">
              Experience luxury, comfort, and world-class hospitality on the
              Kenyan coast. Your perfect stay begins here.
            </p>
            <div className="ft-location">
              <span className="ft-loc-dot" aria-hidden="true" />
              <div className="ft-loc-text">
                <span className="ft-loc-city">Mombasa, Kenya</span>
                <span className="ft-loc-coords">4°03′S · 39°40′E</span>
              </div>
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div>
            <div className="ft-col-label">Navigate</div>
            <ul className="ft-nav">
              {[
                { label: "Home",        to: "/"           },
                { label: "Rooms",       to: "/rooms"      },
                { label: "Dining",      to: "/dining"     },
                { label: "Facilities",  to: "/facilities" },
                { label: "Gallery",     to: "/gallery"    },
                { label: "Contact",     to: "/contact"    },
                { label: "A",     to: "/admin" }
              ].map(({ label, to }) => (
                <li key={to}><Link to={to}>{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* ── Contact ── */}
          <div>
            <div className="ft-col-label">Contact</div>
            <ul className="ft-contact">
              <li>
                <span className="ft-contact-icon">◈</span>
                +254 700 000 000
              </li>
              <li>
                <span className="ft-contact-icon">◈</span>
                info@starhotel.com
              </li>
              <li>
                <span className="ft-contact-icon">◈</span>
                Mombasa, Kenya
              </li>
              <li style={{ marginTop: "0.5rem" }}>
                <span className="ft-contact-icon">◈</span>
                <span>
                  <span style={{ display: "block", fontSize: "0.72rem", color: "rgba(240,236,228,0.5)" }}>Check-in</span>
                  <span style={{ fontSize: "0.72rem", color: "rgba(240,236,228,0.25)" }}>From 2:00 PM daily</span>
                </span>
              </li>
            </ul>
          </div>

          {/* ── Social ── */}
          <div>
            <div className="ft-col-label">Follow Us</div>
            <div className="ft-social">
              {[
                { icon: <FaFacebook />,  label: "Facebook"  },
                { icon: <FaInstagram />, label: "Instagram" },
                { icon: <FaTwitter />,   label: "Twitter"   },
              ].map(({ icon, label }) => (
                <a key={label} href="#" className="ft-social-link" aria-label={label}>
                  <span className="ft-social-icon">{icon}</span>
                  {label}
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="ft-divider">
          <div className="ft-divider-line" />
          <div className="ft-divider-diamond" aria-hidden="true" />
          <div className="ft-divider-line" />
        </div>

        {/* Bottom bar */}
        <div className="ft-bottom">
          <p className="ft-copy">
            &copy; {new Date().getFullYear()} <em>StarHotel</em>. All rights reserved.
          </p>
          <div className="ft-bottom-links">
            <a href="#" className="ft-bottom-link">Privacy</a>
            <a href="#" className="ft-bottom-link">Terms</a>
            <a href="#" className="ft-bottom-link">Cookies</a>
          </div>
        </div>

      </footer>
    </>
  );
}