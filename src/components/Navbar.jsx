import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

  :root {
    --nb-cream:      #f8f3ec;
    --nb-bark:       #2b2318;
    --nb-bronze:     #a0743c;
    --nb-bronze-lt:  #c49558;
    --nb-fog:        #9c9188;
    --nb-white:      #ffffff;
    --nb-h:          72px;
  }

  /* ── Base header ── */
  .nb-header {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 1000;
    height: var(--nb-h);
    transition: background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
    border-bottom: 1px solid transparent;
    font-family: 'Jost', sans-serif;
  }

  /* ─────────────────────────────────────────────
     UN-SCROLLED STATES
     nb-top       = page has dark hero (white text)
     nb-top-light = page has light bg (dark text)
  ───────────────────────────────────────────── */

  .nb-header.nb-top,
  .nb-header.nb-top-light {
    background: transparent;
    border-color: transparent;
    box-shadow: none;
  }

  /* Dark hero pages — gray-600 toned links */
  .nb-header.nb-top .nb-logo          { color: #6b7280; }
  .nb-header.nb-top .nb-link          { color: #6b7280; }
  .nb-header.nb-top .nb-link:hover    { color: #374151; }
  .nb-header.nb-top .nb-auth-btn      { color: #6b7280; }
  .nb-header.nb-top .nb-auth-btn:hover{ color: #374151; }
  .nb-header.nb-top .nb-burger        { color: #6b7280; }

  /* Light bg pages (login, register, booking, payment…) — dark links */
  .nb-header.nb-top-light .nb-logo          { color: var(--nb-bark); }
  .nb-header.nb-top-light .nb-link          { color: var(--nb-fog); }
  .nb-header.nb-top-light .nb-link:hover    { color: var(--nb-bark); }
  .nb-header.nb-top-light .nb-link.active   { color: var(--nb-bark); }
  .nb-header.nb-top-light .nb-auth-btn      { color: var(--nb-fog); }
  .nb-header.nb-top-light .nb-auth-btn:hover{ color: var(--nb-bark); }
  .nb-header.nb-top-light .nb-burger        { color: var(--nb-bark); }
  .nb-header.nb-top-light .nb-sep           { background: var(--nb-bronze); opacity: 0.5; }

  /* ─────────────────────────────────────────────
     SCROLLED STATES
     nb-scrolled          = dark glass (dark bg pages)
     nb-scrolled.nb-light = cream frost (light bg pages)
  ───────────────────────────────────────────── */

  .nb-header.nb-scrolled {
    background: rgba(26, 24, 20, 0.92);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-color: rgba(255,255,255,0.07);
    box-shadow: 0 4px 32px rgba(0,0,0,0.25);
  }
  .nb-header.nb-scrolled .nb-logo              { color: var(--nb-cream); }
  .nb-header.nb-scrolled .nb-link              { color: rgba(240,236,228,0.65); }
  .nb-header.nb-scrolled .nb-link:hover,
  .nb-header.nb-scrolled .nb-link.active       { color: var(--nb-cream); }
  .nb-header.nb-scrolled .nb-auth-btn          { color: rgba(240,236,228,0.65); }
  .nb-header.nb-scrolled .nb-auth-btn:hover    { color: var(--nb-cream); }
  .nb-header.nb-scrolled .nb-burger            { color: var(--nb-cream); }

  .nb-header.nb-scrolled.nb-light {
    background: rgba(248, 243, 236, 0.96);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-color: rgba(43,35,24,0.08);
    box-shadow: 0 2px 20px rgba(43,35,24,0.06);
  }
  .nb-header.nb-scrolled.nb-light .nb-logo              { color: var(--nb-bark); }
  .nb-header.nb-scrolled.nb-light .nb-link              { color: var(--nb-fog); }
  .nb-header.nb-scrolled.nb-light .nb-link:hover,
  .nb-header.nb-scrolled.nb-light .nb-link.active       { color: var(--nb-bark); }
  .nb-header.nb-scrolled.nb-light .nb-auth-btn          { color: var(--nb-fog); }
  .nb-header.nb-scrolled.nb-light .nb-auth-btn:hover    { color: var(--nb-bark); }
  .nb-header.nb-scrolled.nb-light .nb-burger            { color: var(--nb-bark); }

  /* ── Always-on overrides ── */
  .nb-link.nb-admin               { color: var(--nb-bronze-lt) !important; }
  .nb-auth-btn.nb-logout:hover    { color: #c0392b !important; }

  /* ── Inner layout ── */
  .nb-inner {
    max-width: 1280px;
    margin: 0 auto;
    height: 100%;
    padding: 0 2.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  /* ── Logo ── */
  .nb-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.45rem;
    font-weight: 300;
    letter-spacing: 0.08em;
    text-decoration: none;
    line-height: 1;
    transition: color 0.3s;
    white-space: nowrap;
  }
  .nb-logo em {
    font-style: italic;
    color: var(--nb-bronze-lt);
  }

  /* ── Nav links ── */
  .nb-nav {
    display: flex;
    align-items: center;
    gap: 2.25rem;
  }
  @media (max-width: 860px) { .nb-nav { display: none; } }

  .nb-link {
    font-size: 0.68rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    font-weight: 400;
    text-decoration: none;
    position: relative;
    padding-bottom: 2px;
    transition: color 0.25s;
  }
  .nb-link::after {
    content: '';
    position: absolute;
    bottom: -1px; left: 0;
    width: 0; height: 1px;
    background: var(--nb-bronze-lt);
    transition: width 0.3s ease;
  }
  .nb-link:hover::after,
  .nb-link.active::after { width: 100%; }

  /* ── Right actions ── */
  .nb-actions {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }
  @media (max-width: 860px) { .nb-actions { display: none; } }

  .nb-auth-btn {
    font-size: 0.68rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    font-weight: 400;
    background: none;
    border: none;
    cursor: pointer;
    text-decoration: none;
    padding: 0;
    transition: color 0.25s;
    font-family: 'Jost', sans-serif;
  }

  /* ── Book Now CTA ── */
  .nb-cta {
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    font-weight: 500;
    text-decoration: none;
    padding: 0.55rem 1.4rem;
    border: 1px solid var(--nb-bronze);
    color: var(--nb-bronze-lt);
    background: transparent;
    transition: background 0.25s, color 0.25s, border-color 0.25s;
    white-space: nowrap;
    font-family: 'Jost', sans-serif;
  }
  .nb-cta:hover {
    background: var(--nb-bronze);
    color: var(--nb-white);
    border-color: var(--nb-bronze);
  }

  /* ── Separator dot ── */
  .nb-sep {
    width: 3px; height: 3px;
    background: var(--nb-bronze);
    border-radius: 50%;
    opacity: 0.5;
  }

  /* ── Mobile hamburger ── */
  .nb-burger {
    display: none;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    width: 36px; height: 36px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    transition: color 0.3s;
  }
  @media (max-width: 860px) { .nb-burger { display: flex; } }

  .nb-burger-line {
    display: block;
    height: 1.5px;
    background: currentColor;
    border-radius: 2px;
    transform-origin: center;
    transition: transform 0.3s ease, opacity 0.3s ease;
  }

  .nb-burger.open .nb-burger-line:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
  .nb-burger.open .nb-burger-line:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .nb-burger.open .nb-burger-line:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

  /* ── Mobile drawer ── */
  .nb-drawer {
    position: fixed;
    top: var(--nb-h);
    left: 0; right: 0;
    z-index: 999;
    background: rgba(26, 24, 20, 0.97);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-top: 1px solid rgba(255,255,255,0.06);
    transform: translateY(-8px);
    opacity: 0;
    pointer-events: none;
    transition: transform 0.35s ease, opacity 0.35s ease;
    padding: 2rem 2.5rem 2.5rem;
    display: flex;
    flex-direction: column;
  }
  .nb-drawer.open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: all;
  }

  .nb-drawer-link {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.75rem;
    font-weight: 300;
    letter-spacing: 0.04em;
    color: rgba(240,236,228,0.7);
    text-decoration: none;
    padding: 0.6rem 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    transition: color 0.2s, padding-left 0.2s;
    display: block;
  }
  .nb-drawer-link:hover { color: var(--nb-cream); padding-left: 0.5rem; }
  .nb-drawer-link.nb-drawer-admin { color: var(--nb-bronze-lt); }
  .nb-drawer-link:last-of-type { border-bottom: none; }

  .nb-drawer-footer {
    margin-top: 1.75rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .nb-drawer-auth {
    font-size: 0.7rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--nb-fog);
    text-decoration: none;
    background: none;
    border: none;
    cursor: pointer;
    font-family: 'Jost', sans-serif;
    padding: 0;
    transition: color 0.2s;
  }
  .nb-drawer-auth:hover { color: var(--nb-cream); }
  .nb-drawer-auth.logout:hover { color: #c0392b; }

  .nb-drawer-cta {
    margin-top: 1.25rem;
    padding: 0.75rem 2rem;
    background: var(--nb-bronze);
    color: var(--nb-white);
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    text-decoration: none;
    font-family: 'Jost', sans-serif;
    font-weight: 500;
    text-align: center;
    display: block;
    transition: background 0.2s;
  }
  .nb-drawer-cta:hover { background: var(--nb-bronze-lt); }
`;

const NAV_LINKS = [
  { to: "/rooms",      label: "Accommodation" },
  { to: "/events",     label: "Events"        },
  { to: "/dining",     label: "Dining"        },
  { to: "/facilities", label: "Facilities"    },
  { to: "/gallery",    label: "Gallery"       },
];

// Pages with a DARK hero image underneath — navbar starts transparent with WHITE text
const DARK_HERO_PAGES = ["/", "/rooms", "/events", "/dining", "/facilities", "/gallery"];

// Pages with LIGHT backgrounds — navbar becomes cream-frosted when scrolled
const LIGHT_PAGES = ["/rooms", "/dining", "/facilities", "/events", "/gallery"];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")); }
    catch { return null; }
  })();

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // Track scroll position
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run once on mount
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close drawer on navigation
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  // Does this page have a dark hero (white nav text before scrolling)?
  const hasDarkHero = DARK_HERO_PAGES.some(p =>
    p === "/" ? location.pathname === "/" : location.pathname.startsWith(p)
  );

  // Does this page have a light background (cream nav when scrolled)?
  const isLightPage = LIGHT_PAGES.some(p => location.pathname.startsWith(p));

  /*
    headerClass logic:
    - Not scrolled + dark hero  → "nb-top"        (transparent, white text)
    - Not scrolled + light page → "nb-top-light"  (transparent, dark text)  ← THE FIX
    - Scrolled + dark bg page   → "nb-scrolled"
    - Scrolled + light bg page  → "nb-scrolled nb-light"
  */
  const headerClass = [
    "nb-header",
    scrolled
      ? `nb-scrolled${isLightPage ? " nb-light" : ""}`
      : hasDarkHero ? "nb-top" : "nb-top-light",
  ].join(" ");

  return (
    <>
      <style>{STYLES}</style>

      <header className={headerClass}>
        <div className="nb-inner">

          {/* ── Left nav ── */}
          <nav className="nb-nav" aria-label="Main navigation">
            {NAV_LINKS.slice(0, 4).map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`nb-link${location.pathname.startsWith(to) ? " active" : ""}`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* ── Logo (centred) ── */}
          <Link to="/" className="nb-logo">
            Star<em>Hotel</em>
          </Link>

          {/* ── Right actions ── */}
          <div className="nb-actions">
            <Link
              to="/gallery"
              className={`nb-link${location.pathname.startsWith("/gallery") ? " active" : ""}`}
            >
              Gallery
            </Link>

            <div className="nb-sep" />

            {!user ? (
              <>
                <Link to="/login"    className="nb-auth-btn">Login</Link>
                <Link to="/register" className="nb-auth-btn">Register</Link>
              </>
            ) : (
              <>
                {user.role === "admin" && (
                  <Link to="/admin" className="nb-link nb-admin">Admin</Link>
                )}
                <button className="nb-auth-btn nb-logout" onClick={logout}>
                  Logout
                </button>
              </>
            )}

            <Link to="/rooms" className="nb-cta">Book Now</Link>
          </div>

          {/* ── Mobile burger ── */}
          <button
            className={`nb-burger${menuOpen ? " open" : ""}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className="nb-burger-line" />
            <span className="nb-burger-line" />
            <span className="nb-burger-line" />
          </button>

        </div>
      </header>

      {/* ── Mobile drawer ── */}
      <div className={`nb-drawer${menuOpen ? " open" : ""}`} aria-hidden={!menuOpen}>
        {NAV_LINKS.map(({ to, label }) => (
          <Link key={to} to={to} className="nb-drawer-link">{label}</Link>
        ))}

        {user?.role === "admin" && (
          <Link to="/admin" className="nb-drawer-link nb-drawer-admin">Admin</Link>
        )}

        <div className="nb-drawer-footer">
          {!user ? (
            <>
              <Link to="/login"    className="nb-drawer-auth">Login</Link>
              <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "0.6rem" }}>|</span>
              <Link to="/register" className="nb-drawer-auth">Register</Link>
            </>
          ) : (
            <button className="nb-drawer-auth logout" onClick={logout}>
              Logout
            </button>
          )}
        </div>

        <Link to="/rooms" className="nb-drawer-cta">Book Now</Link>
      </div>

      {/* Spacer so page content sits below the fixed bar */}
      <div style={{ height: "var(--nb-h)" }} />
    </>
  );
}
