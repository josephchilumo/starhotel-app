import React from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] lg:min-h-[calc(100vh-6rem)] overflow-hidden text-[#ECD9BA]">

      {/* ================= BACKGROUND IMAGE ================= */}
      <img
        src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1800&q=90"
        alt="Luxury hotel interior"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* ================= OVERLAY ================= */}
      <div className="absolute inset-0 bg-black/45" />

      {/* ================= HERO CONTENT ================= */}
      <div className="relative z-10 min-h-[90vh] lg:min-h-[calc(100vh-6rem)] flex items-end">

        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 pb-12 lg:pb-20">

          <div className="max-w-6xl">

            <h1 className="text-6xl sm:text-7xl lg:text-[8rem] xl:text-[9rem] font-bold leading-[0.84] tracking-tight text-[#ECD9BA]">
              A different
              <br />

              <span className="italic font-light">
                kind of stay.
              </span>
            </h1>

            <div className="mt-8 lg:mt-10 flex flex-col sm:flex-row sm:items-center gap-6">

              <p className="max-w-xl text-base lg:text-xl text-white/80 leading-relaxed">
                Thoughtfully designed spaces, warm coastal hospitality,
                and everything you need to slow down and stay awhile.
              </p>

              <div className="flex items-center gap-5 shrink-0">

                <Link
                  to="/rooms"
                  className="inline-flex items-center bg-[#fffaf0] text-gray-900 px-6 lg:px-7 py-4 text-xs uppercase tracking-[0.2em] hover:bg-[#fffdf2] transition duration-500 ease-in-out"
                >
                  Explore Rooms
                </Link>

                <Link
                  to="/facilities"
                  className="text-xs uppercase tracking-[0.2em] border-b border-white/70 pb-2 text-white hover:border-white transition duration-500 ease-in-out"
                >
                  Explore the Hotel
                </Link>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}