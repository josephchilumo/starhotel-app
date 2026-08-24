import React, { useState } from "react";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";

/* ───────────────── ICONS ───────────────── */

const ICONS = {
  dashboard: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="1" width="6" height="6" rx="1" />
      <rect x="9" y="1" width="6" height="6" rx="1" />
      <rect x="1" y="9" width="6" height="6" rx="1" />
      <rect x="9" y="9" width="6" height="6" rx="1" />
    </svg>
  ),

  bookings: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="12" height="12" rx="1" />
      <path d="M5 1v4M11 1v4M2 7h12" />
    </svg>
  ),

  rooms: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 13V6l7-4 7 4v7H1z" />
      <rect x="5" y="8" width="3" height="5" rx="0.5" />
      <rect x="8" y="8" width="3" height="5" rx="0.5" />
    </svg>
  ),

  payments: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="14" height="9" rx="1" />
      <path d="M1 7h14" />
      <path d="M4 10.5h2M10 10.5h2" />
    </svg>
  ),

  users: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="5" r="3" />
      <path d="M1 14c0-3 2-5 5-5s5 2 5 5" />
      <path d="M11 2a3 3 0 010 6M15 14c0-2-1-4-4-4" />
    </svg>
  ),

  gallery: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="1" width="14" height="14" rx="1" />
      <path d="M1 10l4-4 3 3 2-2 5 5" />
      <circle cx="11.5" cy="4.5" r="1" />
    </svg>
  ),

  facilities: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="2" />
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.5 3.5l1.4 1.4M11.1 11.1l1.4 1.4M11.1 4.9l1.4-1.4M3.5 12.5l1.4-1.4" />
    </svg>
  ),
};

/* ───────────────── NAVIGATION ───────────────── */

const NAV_ITEMS = [
  {
    to: "/admin",
    label: "Dashboard",
    icon: ICONS.dashboard,
    exact: true,
  },
  {
    to: "/admin/bookings",
    label: "Bookings",
    icon: ICONS.bookings,
  },
  {
    to: "/admin/rooms",
    label: "Rooms",
    icon: ICONS.rooms,
  },
  {
    to: "/admin/payments",
    label: "Payments",
    icon: ICONS.payments,
  },
  {
    to: "/admin/users",
    label: "Users",
    icon: ICONS.users,
  },
  {
    to: "/admin/admingallery",
    label: "Gallery",
    icon: ICONS.gallery,
  },
  {
    to: "/admin/adminfacilities",
    label: "Facilities",
    icon: ICONS.facilities,
  },
];

/* ───────────────── SIDEBAR ───────────────── */

function Sidebar({ sidebarOpen, closeSidebar }) {
  const location = useLocation();

  const isActive = (item) =>
    item.exact
      ? location.pathname === item.to
      : location.pathname.startsWith(item.to);

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px] transition-opacity lg:hidden ${
          sidebarOpen
            ? "opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={closeSidebar}
      />

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-64 flex-col
          border-r border-gray-200
          bg-[#fffdf4]
          px-4 py-5
          shadow-xl
          transition-transform duration-300
          lg:translate-x-0 lg:shadow-none
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* Logo */}

        <div className="flex items-center justify-between px-3">

          <Link
            to="/"
            onClick={closeSidebar}
            className="text-xl tracking-[0.08em] text-gray-900"
          >
            Star<span className="font-light">Hotel</span>
          </Link>

          <button
            onClick={closeSidebar}
            className="flex h-8 w-8 items-center justify-center rounded text-gray-400 hover:bg-gray-100 hover:text-gray-900 lg:hidden"
            aria-label="Close sidebar"
          >
            ✕
          </button>

        </div>

        <div className="mt-1 px-3 text-[9px] uppercase tracking-[0.25em] text-gray-400">
          Admin Console
        </div>

        {/* Navigation */}

        <nav className="mt-9 flex-1" aria-label="Admin navigation">

          {/* MAIN */}

          <div>

            <p className="mb-3 px-3 text-[9px] uppercase tracking-[0.25em] text-gray-400">
              Main
            </p>

            <div className="space-y-1">

              {NAV_ITEMS.slice(0, 4).map((item) => {

                const active = isActive(item);

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={closeSidebar}
                    className={`
                      group flex items-center gap-3
                      rounded-md px-3 py-2.5
                      text-sm
                      transition-all duration-200
                      ${
                        active
                          ? "bg-gray-900 text-white shadow-sm"
                          : "text-gray-600 hover:bg-[#f4f0db] hover:text-gray-900"
                      }
                    `}
                  >

                    <span
                      className={`
                        flex h-5 w-5 items-center justify-center
                        ${
                          active
                            ? "text-white"
                            : "text-gray-400 group-hover:text-gray-900"
                        }
                      `}
                    >
                      {item.icon}
                    </span>

                    <span>{item.label}</span>

                  </Link>
                );
              })}

            </div>

          </div>

          {/* CONTENT */}

          <div className="mt-8">

            <p className="mb-3 px-3 text-[9px] uppercase tracking-[0.25em] text-gray-400">
              Content
            </p>

            <div className="space-y-1">

              {NAV_ITEMS.slice(4).map((item) => {

                const active = isActive(item);

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={closeSidebar}
                    className={`
                      group flex items-center gap-3
                      rounded-md px-3 py-2.5
                      text-sm
                      transition-all duration-200
                      ${
                        active
                          ? "bg-gray-900 text-white shadow-sm"
                          : "text-gray-600 hover:bg-[#f4f0db] hover:text-gray-900"
                      }
                    `}
                  >

                    <span
                      className={`
                        flex h-5 w-5 items-center justify-center
                        ${
                          active
                            ? "text-white"
                            : "text-gray-400 group-hover:text-gray-900"
                        }
                      `}
                    >
                      {item.icon}
                    </span>

                    <span>{item.label}</span>

                  </Link>
                );
              })}

            </div>

          </div>

        </nav>

        {/* Sidebar bottom */}

        <div className="border-t border-gray-200 pt-4">

          <div className="flex items-center gap-3 px-3">

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-xs text-white">
              A
            </div>

            <div className="min-w-0">

              <p className="truncate text-xs font-medium text-gray-900">
                Administrator
              </p>

              <p className="text-[9px] uppercase tracking-[0.15em] text-gray-400">
                StarHotel
              </p>

            </div>

          </div>

        </div>

      </aside>
    </>
  );
}

/* ───────────────── LAYOUT ───────────────── */

export default function AdminLayout() {

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const location = useLocation();

  if (!localStorage.getItem("starhotel_token")) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const currentItem = NAV_ITEMS.find((item) =>
    item.exact
      ? location.pathname === item.to
      : location.pathname.startsWith(item.to)
  );

  const sectionLabel =
    currentItem?.label ?? "Dashboard";

  const today = new Date().toLocaleDateString(
    "en-GB",
    {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );

  return (
    <div className="min-h-screen bg-[#f7f4ea] text-gray-900">

      {/* SIDEBAR */}

      <Sidebar
        sidebarOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
      />

      {/* MAIN */}

      <div className="min-h-screen lg:pl-64">

        {/* TOP BAR */}

        <header className="sticky top-0 z-30 border-b border-gray-200 bg-[#faf9f4]/95 backdrop-blur">

          <div className="flex h-16 items-center justify-between px-5 sm:px-7">

            {/* LEFT */}

            <div className="flex items-center gap-4">

              {/* Mobile menu */}

              <button
                onClick={() =>
                  setSidebarOpen(true)
                }
                className="flex h-9 w-9 items-center justify-center rounded border border-gray-200 bg-white text-gray-700 hover:border-gray-900 lg:hidden"
                aria-label="Open sidebar"
              >

                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                >
                  <path d="M2 4h12M2 8h12M2 12h12" />
                </svg>

              </button>

              {/* Breadcrumb */}

              <div className="flex items-center gap-2 text-xs">

                <Link
                  to="/admin"
                  className="text-gray-400 hover:text-gray-900 transition"
                >
                  Admin
                </Link>

                {sectionLabel !== "Dashboard" && (
                  <>
                    <span className="text-gray-300">
                      /
                    </span>

                    <span className="font-medium text-gray-700">
                      {sectionLabel}
                    </span>
                  </>
                )}

              </div>

            </div>

            {/* RIGHT */}

            <div className="flex items-center gap-4">

              <div className="hidden sm:block text-[10px] uppercase tracking-[0.15em] text-gray-400">
                {today}
              </div>

              <div className="h-8 w-8 rounded-full bg-gray-900 flex items-center justify-center text-[10px] text-white">
                A
              </div>

            </div>

          </div>

        </header>

        {/* PAGE */}

        <main className="p-4 sm:p-6 lg:p-8">

          <Outlet />

        </main>

      </div>

    </div>
  );
}