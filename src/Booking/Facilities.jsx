import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ICONS = {
  pool: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
      <path d="M2 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v3" />
    </svg>
  ),

  spa: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22c4-4 7-8 7-12A7 7 0 0 0 5 10c0 4 3 8 7 12z" />
      <path d="M12 22c-4-4-7-8-7-12" />
    </svg>
  ),

  gym: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4v6m12-6v6M4 7h4m8 0h4" />
      <path d="M6 20v-6m12 6v-6M4 17h4m8 0h4" />
      <path d="M8 12h8" />
    </svg>
  ),

  wifi: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <circle cx="12" cy="20" r="1" fill="currentColor" />
    </svg>
  ),

  shuttle: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="2" />
      <path d="M16 8h4l3 5v3h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  ),

  roomservice: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17h18" />
      <path d="M3 12a9 9 0 0 1 18 0" />
      <path d="M12 3v2" />
    </svg>
  ),
};

const FACILITIES = [
  {
    title: "Swimming Pool",
    desc: "Relax and unwind in our luxurious outdoor infinity pool with breathtaking Indian Ocean views.",
    tag: "Leisure",
    icon: ICONS.pool,
    num: "01",
  },
  {
    title: "Spa & Wellness",
    desc: "Rejuvenate body and mind with our world-class Swahili-inspired spa treatments and rituals.",
    tag: "Wellness",
    icon: ICONS.spa,
    num: "02",
  },
  {
    title: "Fitness Center",
    desc: "Stay active with premium gym equipment, personal training, and a spacious workout floor.",
    tag: "Health",
    icon: ICONS.gym,
    num: "03",
  },
  {
    title: "High-Speed Wi-Fi",
    desc: "Complimentary fibre-optic internet throughout the hotel — rooms, lounges, and pool areas.",
    tag: "Connectivity",
    icon: ICONS.wifi,
    num: "04",
  },
  {
    title: "Airport Shuttle",
    desc: "Convenient private transfers to and from Moi International Airport, available around the clock.",
    tag: "Transport",
    icon: ICONS.shuttle,
    num: "05",
  },
  {
    title: "24/7 Room Service",
    desc: "Curated menus delivered directly to your room — breakfast, lunch, dinner, or a midnight snack.",
    tag: "In-Room",
    icon: ICONS.roomservice,
    num: "06",
  },
];

const rowVariants = {
  hidden: {
    opacity: 0,
    y: 25,
  },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay: i * 0.08,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

export default function Facilities() {
  return (
    <main className="bg-[#fafaf8] px-5 py-14 text-gray-900 sm:px-8">

      {/* HERO */}
      <section className="mx-auto max-w-6xl">

        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-end">

          <div>
            <div className="mb-4 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.25em] text-green-700">
              <span className="h-px w-8 bg-green-700" />
              Hotel Amenities
            </div>

            <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Everything you
              <br />
              <em className="font-serif font-normal">
                need, and more.
              </em>
            </h1>
          </div>

          <div className="max-w-md md:justify-self-end">
            <p className="text-base leading-7 text-gray-600">
              Comfort, convenience, and luxury — every facility at StarHotel
              is designed to make your stay effortlessly exceptional.
            </p>

            <div className="mt-6 flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-gray-500">
              <span className="text-gray-900">
                06 Facilities
              </span>
              <span className="h-px w-10 bg-gray-300" />
              <span>Designed for you</span>
            </div>
          </div>

        </div>
      </section>

      {/* FACILITIES GRID */}
      <section className="mx-auto mt-14 max-w-6xl">

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {FACILITIES.map((facility, index) => (
            <motion.article
              key={facility.num}
              custom={index}
              initial="hidden"
              whileInView="visible"
              variants={rowVariants}
              viewport={{ once: true, amount: 0.15 }}
              className="group relative min-h-[270px] overflow-hidden rounded border border-gray-200 bg-[#fffaf0] p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-md"
            >

              {/* Number */}
              <div className="absolute right-5 top-5 text-xs tracking-[0.2em] text-gray-300">
                {facility.num}
              </div>

              {/* Icon */}
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-[#fafaf8] text-green-700 transition-all duration-500 group-hover:border-green-700 group-hover:bg-green-700 group-hover:text-white">
                {facility.icon}
              </div>

              {/* Content */}
              <div className="mt-10">
                <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-green-700">
                  {facility.tag}
                </span>

                <h2 className="mt-2 text-xl font-semibold tracking-tight">
                  {facility.title}
                </h2>

                <p className="mt-3 max-w-sm text-sm leading-6 text-gray-600">
                  {facility.desc}
                </p>
              </div>

              {/* Bottom line */}
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-green-700 transition-all duration-500 group-hover:w-full" />

            </motion.article>
          ))}

        </div>

      </section>

      {/* CTA */}
      <motion.section
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="mx-auto mt-16 max-w-6xl overflow-hidden rounded bg-[#1f2420] px-6 py-12 text-white sm:px-10 md:px-14"
      >

        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">

          <div>
            <div className="mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-green-400">
              <span className="h-px w-8 bg-green-400" />
              Your stay awaits
            </div>

            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Book your{" "}
              <em className="font-serif font-normal">
                stay
              </em>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-6 text-gray-300">
              Every facility, every amenity — yours to enjoy from the moment
              you arrive.
            </p>
          </div>

          <Link
            to="/rooms"
            className="inline-flex w-fit items-center gap-3 rounded bg-white px-5 py-3 text-sm font-medium text-gray-900 transition-all duration-300 hover:bg-green-50"
          >
            Reserve a Room

            <svg
              width="14"
              height="10"
              viewBox="0 0 14 10"
              fill="none"
            >
              <path
                d="M1 5h12M8 1l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

        </div>

      </motion.section>

    </main>
  );
}