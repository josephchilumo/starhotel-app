import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

  :root {
    --ink:       #0e0f0d;
    --ink2:      #161814;
    --ink3:      #1e2019;
    --bronze:    #a0743c;
    --bronze-lt: #c49558;
    --cream:     #f0ece4;
    --parch:     #f5f0e8;
    --fog:       rgba(240,236,228,0.38);
    --border-dk: rgba(255,255,255,0.07);
    --border-lt: rgba(43,35,24,0.1);
    --sidebar-w: 240px;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .al-root {
    display: flex;
    min-height: 100vh;
    font-family: 'Jost', sans-serif;
    background: var(--parch);
  }

  /* ══════════════════════════════════
     SIDEBAR
  ══════════════════════════════════ */
  .al-sidebar {
    width: var(--sidebar-w);
    background: var(--ink);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    position: fixed;
    top: 0; left: 0; bottom: 0;
    z-index: 200;
    border-right: 1px solid var(--border-dk);
    transition: transform 0.35s ease;
  }
  @media (max-width: 860px) {
    .al-sidebar {
      transform: translateX(-100%);
      box-shadow: 4px 0 32px rgba(0,0,0,0.4);
    }
    .al-sidebar.open { transform: translateX(0); }
  }

  /* Logo area */
  .al-logo-wrap {
    padding: 1.75rem 1.5rem 1.5rem;
    border-bottom: 1px solid var(--border-dk);
    flex-shrink: 0;
  }
  .al-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.25rem; font-weight: 300;
    letter-spacing: 0.08em;
    color: var(--cream); text-decoration: none;
    display: block; line-height: 1;
  }
  .al-logo em { font-style: italic; color: var(--bronze-lt); }

  .al-logo-badge {
    font-size: 0.55rem; letter-spacing: 0.22em;
    text-transform: uppercase; color: rgba(240,236,228,0.25);
    margin-top: 0.3rem; display: block;
  }

  /* Nav */
  .al-nav {
    flex: 1; overflow-y: auto; padding: 1.25rem 0;
    scrollbar-width: none;
  }
  .al-nav::-webkit-scrollbar { display: none; }

  .al-nav-section {
    margin-bottom: 1.5rem;
  }
  .al-nav-section-label {
    font-size: 0.52rem; letter-spacing: 0.26em;
    text-transform: uppercase;
    color: rgba(240,236,228,0.18);
    padding: 0 1.5rem; margin-bottom: 0.4rem;
    display: block;
  }

  .al-nav-item {
    display: flex; align-items: center; gap: 0.75rem;
    padding: 0.7rem 1.5rem;
    font-size: 0.75rem; letter-spacing: 0.08em;
    color: rgba(240,236,228,0.45);
    text-decoration: none;
    position: relative;
    transition: color 0.2s, background 0.2s;
    cursor: pointer; border: none; background: none;
    width: 100%; text-align: left; font-family: 'Jost', sans-serif;
  }
  .al-nav-item::before {
    content: '';
    position: absolute; left: 0; top: 0; bottom: 0;
    width: 3px; background: var(--bronze);
    transform: scaleY(0); transform-origin: top;
    transition: transform 0.3s ease;
  }
  .al-nav-item:hover { color: rgba(240,236,228,0.75); background: rgba(255,255,255,0.03); }
  .al-nav-item.active {
    color: var(--cream); background: rgba(160,116,60,0.1);
  }
  .al-nav-item.active::before { transform: scaleY(1); }

  .al-nav-icon {
    width: 16px; height: 16px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; opacity: 0.6;
    transition: opacity 0.2s;
  }
  .al-nav-item.active .al-nav-icon,
  .al-nav-item:hover .al-nav-icon { opacity: 1; }

  /* Sidebar footer */
  .al-sidebar-footer {
    padding: 1.25rem 1.5rem;
    border-top: 1px solid var(--border-dk);
    flex-shrink: 0;
  }
  .al-sidebar-user {
    display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;
  }
  .al-user-avatar {
    width: 30px; height: 30px;
    border: 1px solid var(--border-dk);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.9rem; font-style: italic;
    color: var(--bronze-lt); background: rgba(160,116,60,0.1);
    flex-shrink: 0;
  }
  .al-user-info { display: flex; flex-direction: column; gap: 0.1rem; }
  .al-user-name {
    font-size: 0.72rem; color: rgba(240,236,228,0.7); letter-spacing: 0.04em;
  }
  .al-user-role {
    font-size: 0.55rem; letter-spacing: 0.18em;
    text-transform: uppercase; color: var(--bronze);
  }
  .al-logout-btn {
    width: 100%; padding: 0.5rem 0;
    font-size: 0.62rem; letter-spacing: 0.16em;
    text-transform: uppercase; color: rgba(240,236,228,0.25);
    background: none; border: none; cursor: pointer;
    font-family: 'Jost', sans-serif; text-align: left;
    transition: color 0.2s;
    display: flex; align-items: center; gap: 0.5rem;
  }
  .al-logout-btn:hover { color: #c0392b; }

  /* ══════════════════════════════════
     MAIN AREA
  ══════════════════════════════════ */
  .al-main {
    flex: 1;
    margin-left: var(--sidebar-w);
    display: flex; flex-direction: column;
    min-height: 100vh;
  }
  @media (max-width: 860px) { .al-main { margin-left: 0; } }

  /* Top bar */
  .al-topbar {
    height: 60px;
    background: #ffffff;
    border-bottom: 1px solid var(--border-lt);
    display: flex; align-items: center;
    padding: 0 2rem;
    justify-content: space-between;
    position: sticky; top: 0; z-index: 100;
    flex-shrink: 0;
  }

  .al-topbar-left { display: flex; align-items: center; gap: 1rem; }

  /* Mobile burger */
  .al-burger {
    display: none; flex-direction: column; gap: 4px;
    background: none; border: none; cursor: pointer;
    padding: 4px; color: #6b7280;
  }
  @media (max-width: 860px) { .al-burger { display: flex; } }
  .al-burger-line {
    display: block; width: 20px; height: 1.5px;
    background: currentColor; border-radius: 2px;
    transform-origin: center;
    transition: transform 0.3s, opacity 0.3s;
  }
  .al-burger.open .al-burger-line:nth-child(1) { transform: translateY(5.5px) rotate(45deg); }
  .al-burger.open .al-burger-line:nth-child(2) { opacity: 0; }
  .al-burger.open .al-burger-line:nth-child(3) { transform: translateY(-5.5px) rotate(-45deg); }

  .al-breadcrumb {
    display: flex; align-items: center; gap: 0.5rem;
    font-size: 0.68rem; letter-spacing: 0.1em;
  }
  .al-breadcrumb-root {
    color: rgba(43,35,24,0.3); text-decoration: none;
    transition: color 0.2s;
  }
  .al-breadcrumb-root:hover { color: var(--bronze); }
  .al-breadcrumb-sep { color: rgba(43,35,24,0.2); font-size: 0.55rem; }
  .al-breadcrumb-current {
    color: #2b2318; font-weight: 500; letter-spacing: 0.08em;
    text-transform: capitalize;
  }

  .al-topbar-right { display: flex; align-items: center; gap: 1rem; }
  .al-topbar-date {
    font-size: 0.62rem; letter-spacing: 0.1em;
    color: rgba(43,35,24,0.3); white-space: nowrap;
  }
  @media (max-width: 480px) { .al-topbar-date { display: none; } }

  /* Content */
  .al-content {
    flex: 1;
    padding: 2rem;
  }
  @media (max-width: 520px) { .al-content { padding: 1.25rem; } }

  /* Overlay for mobile */
  .al-overlay {
    display: none;
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.55);
    z-index: 199;
  }
  @media (max-width: 860px) {
    .al-overlay.open { display: block; }
  }
`;

/* ── SVG icons ── */
const ICONS = {
  dashboard: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/>
      <rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/>
    </svg>
  ),
  bookings: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <rect x="2" y="3" width="12" height="12" rx="1"/><path d="M5 1v4M11 1v4M2 7h12"/>
    </svg>
  ),
  rooms: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <path d="M1 13V6l7-4 7 4v7H1z"/><rect x="5" y="8" width="3" height="5" rx="0.5"/>
      <rect x="8" y="8" width="3" height="5" rx="0.5"/>
    </svg>
  ),
  payments: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <rect x="1" y="4" width="14" height="9" rx="1"/><path d="M1 7h14"/>
      <path d="M4 10.5h2M10 10.5h2"/>
    </svg>
  ),
  users: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <circle cx="6" cy="5" r="3"/><path d="M1 14c0-3 2-5 5-5s5 2 5 5"/>
      <path d="M11 2a3 3 0 010 6M15 14c0-2-1-4-4-4"/>
    </svg>
  ),
  gallery: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <rect x="1" y="1" width="14" height="14" rx="1"/>
      <path d="M1 10l4-4 3 3 2-2 5 5"/>
      <circle cx="11.5" cy="4.5" r="1"/>
    </svg>
  ),
  facilities: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <circle cx="8" cy="8" r="2"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.5 3.5l1.4 1.4M11.1 11.1l1.4 1.4M11.1 4.9l1.4-1.4M3.5 12.5l1.4-1.4"/>
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 11l4-3-4-3M14 8H6"/>
    </svg>
  ),
};

const NAV_ITEMS = [
  { to: "/admin",              label: "Dashboard",  icon: ICONS.dashboard,  exact: true },
  { to: "/admin/bookings",     label: "Bookings",   icon: ICONS.bookings   },
  { to: "/admin/rooms",        label: "Rooms",      icon: ICONS.rooms      },
  { to: "/admin/payments",     label: "Payments",   icon: ICONS.payments   },
  { to: "/admin/users",        label: "Users",      icon: ICONS.users      },
  { to: "/admin/admingallery", label: "Gallery",    icon: ICONS.gallery    },
  { to: "/admin/adminfacilities",   label: "Facilities", icon: ICONS.facilities },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location  = useLocation();
  const navigate  = useNavigate();

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")); }
    catch { return null; }
  })();

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isActive = (item) =>
    item.exact
      ? location.pathname === item.to
      : location.pathname.startsWith(item.to) && item.to !== "/admin";

  // Current section label for breadcrumb
  const currentItem = NAV_ITEMS.find(i =>
    i.exact
      ? location.pathname === i.to
      : location.pathname.startsWith(i.to)
  );
  const sectionLabel = currentItem?.label ?? "Dashboard";

  // Today's date
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });

  const userInitial = user?.fullName?.[0] ?? user?.email?.[0] ?? "A";

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      <style>{STYLES}</style>
      <div className="al-root">

        {/* ── Mobile overlay ── */}
        <div
          className={`al-overlay${sidebarOpen ? " open" : ""}`}
          onClick={closeSidebar}
          aria-hidden="true"
        />

        {/* ══ SIDEBAR ══ */}
        <aside className={`al-sidebar${sidebarOpen ? " open" : ""}`}>

          {/* Logo */}
          <div className="al-logo-wrap">
            <Link to="/" className="al-logo">Star<em>Hotel</em></Link>
            <span className="al-logo-badge">Admin Console</span>
          </div>

          {/* Nav */}
          <nav className="al-nav" aria-label="Admin navigation">
            <div className="al-nav-section">
              <span className="al-nav-section-label">Main</span>
              {NAV_ITEMS.slice(0, 4).map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`al-nav-item${isActive(item) ? " active" : ""}`}
                  onClick={closeSidebar}
                >
                  <span className="al-nav-icon">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="al-nav-section">
              <span className="al-nav-section-label">Content</span>
              {NAV_ITEMS.slice(4).map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`al-nav-item${isActive(item) ? " active" : ""}`}
                  onClick={closeSidebar}
                >
                  <span className="al-nav-icon">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Footer */}
          <div className="al-sidebar-footer">
            <div className="al-sidebar-user">
              <div className="al-user-avatar">{userInitial}</div>
              <div className="al-user-info">
                <span className="al-user-name">
                  {user?.fullName ?? user?.email ?? "Administrator"}
                </span>
                <span className="al-user-role">Admin</span>
              </div>
            </div>
            <button className="al-logout-btn" onClick={logout}>
              <span>{ICONS.logout}</span>
              Sign Out
            </button>
          </div>

        </aside>

        {/* ══ MAIN ══ */}
        <div className="al-main">

          {/* Top bar */}
          <div className="al-topbar">
            <div className="al-topbar-left">
              <button
                className={`al-burger${sidebarOpen ? " open" : ""}`}
                onClick={() => setSidebarOpen(v => !v)}
                aria-label="Toggle sidebar"
              >
                <span className="al-burger-line" />
                <span className="al-burger-line" />
                <span className="al-burger-line" />
              </button>

              <div className="al-breadcrumb">
                <Link to="/admin" className="al-breadcrumb-root">Admin</Link>
                {sectionLabel !== "Dashboard" && (
                  <>
                    <span className="al-breadcrumb-sep">›</span>
                    <span className="al-breadcrumb-current">{sectionLabel}</span>
                  </>
                )}
              </div>
            </div>

            <div className="al-topbar-right">
              <span className="al-topbar-date">{today}</span>
            </div>
          </div>

          {/* Page content */}
          <div className="al-content">
            <Outlet />
          </div>

        </div>

      </div>
    </>
  );
}