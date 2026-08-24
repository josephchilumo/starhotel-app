import React, { useState } from "react";
import { Link } from "react-router-dom";

const NAV_LINKS = [
  { to: "/rooms", label: "Accommodation" },
  { to: "/events", label: "Events" },
  { to: "/dining", label: "Dining" },
  { to: "/facilities", label: "Facilities" },
  { to: "/gallery", label: "Gallery" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {/* NAVBAR */}
      <header className="fixed inset-x-0 top-0 z-50 bg-[#f4f0db] text-gray-900 border-b border-gray-900/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 h-20 flex items-center justify-between">

          {/* MENU BUTTON */}
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation menu"
            className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em]"
          >
            <span className="flex flex-col gap-[5px] w-6">
              <span className="h-px w-full bg-gray-900" />
              <span className="h-px w-full bg-gray-900" />
              <span className="h-px w-full bg-gray-900" />
            </span>

            <span className="hidden sm:block">
              Menu
            </span>
          </button>

          {/* LOGO */}
          <Link
            to="/"
            onClick={closeMenu}
            className="absolute left-1/2 -translate-x-1/2 text-xl sm:text-2xl tracking-[0.08em]"
          >
            Star<span className="font-light">Hotel</span>
          </Link>

          {/* BOOK NOW */}
          <Link
            to="/rooms"
            onClick={closeMenu}
            className="border border-gray-900 px-4 sm:px-5 py-2.5 text-[10px] sm:text-[11px] uppercase tracking-[0.18em] hover:bg-gray-900 hover:text-white transition duration-300"
          >
            Book Now
          </Link>
        </div>
      </header>

      {/* DARK OVERLAY */}
      <div
        onClick={closeMenu}
        className={`fixed inset-0 bg-black/20 z-[60] transition-opacity duration-300 ${
          menuOpen
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* SIDE MENU */}
      <aside
        className={`fixed top-0 right-0 h-full w-[85%] sm:w-[420px] bg-[#faf7e8] text-gray-900 z-[70] shadow-2xl transition-transform duration-300 ease-out ${
          menuOpen
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">

          {/* MENU HEADER */}
          <div className="h-20 px-6 flex items-center justify-between border-b border-gray-900/10">

            <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500">
              Navigation
            </span>

            <button
              onClick={closeMenu}
              aria-label="Close navigation menu"
              className="w-9 h-9 flex items-center justify-center border border-gray-900/20 hover:bg-gray-900 hover:text-white transition"
            >
              <span className="text-xl leading-none">
                ×
              </span>
            </button>

          </div>

          {/* LINKS */}
          <nav className="flex-1 px-6 py-8">

            {NAV_LINKS.map(({ to, label }, index) => (
              <Link
                key={to}
                to={to}
                onClick={closeMenu}
                className="group flex items-center justify-between py-5 border-b border-gray-900/10"
              >
                <div className="flex items-center gap-4">


                  <span className="text-lg sm:text-xl font-light group-hover:translate-x-1 transition-transform duration-200">
                    {label}
                  </span>

                </div>

              </Link>
            ))}

          </nav>

          {/* BOTTOM */}
          <div className="px-6 py-8 border-t border-gray-900/10">

            <p className="text-xs text-gray-500 leading-relaxed max-w-xs mb-6">
              Thoughtfully designed spaces, coastal hospitality,
              and slower moments.
            </p>

            <Link
              to="/rooms"
              onClick={closeMenu}
              className="inline-block text-[10px] uppercase tracking-[0.25em] border-b border-gray-900 pb-2 hover:opacity-50 transition"
            >
              Book Your Stay
            </Link>

          </div>

        </div>
      </aside>
    </>
  );
}