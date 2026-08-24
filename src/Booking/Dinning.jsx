import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const RESTAURANTS = [
  {
    name: "Riverfront Restaurant",
    tag: "Fine Dining",
    index: "01",
    description:
      "Enjoy fine dining with breathtaking river views and a curated international menu. Open for lunch and dinner, seven days a week.",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80",
    hours: "12:00 – 22:30",
  },
  {
    name: "Sky Lounge",
    tag: "Rooftop Bar",
    index: "02",
    description:
      "Relax with handcrafted cocktails and light bites in a sophisticated rooftop atmosphere. The perfect sundowner destination.",
    image:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1200&q=80",
    hours: "17:00 – 01:00",
  },
  {
    name: "Poolside Bar",
    tag: "Casual Dining",
    index: "03",
    description:
      "Sip refreshing tropical drinks and enjoy light snacks by the pool in a relaxed, sun-drenched setting.",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80",
    hours: "10:00 – 19:00",
  },
];

const panelVariants = {
  hidden: {
    opacity: 0,
    y: 35,
  },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      delay: i * 0.12,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

export default function Dining() {
  return (
    <div className="bg-[#fafaf8] px-4 py-12 text-gray-900 sm:px-8">

      {/* ================= HERO ================= */}
      <motion.section
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mx-auto max-w-6xl"
      >
        <div className="relative min-h-[420px] overflow-hidden rounded border border-gray-200 bg-[#fffaf0]">

          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80"
            alt="Dining at StarHotel"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/10" />

          {/* Hero content */}
          <div className="relative z-10 flex min-h-[420px] max-w-xl flex-col justify-center px-6 py-12 text-white sm:px-10">

            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-green-300">
              <div className="h-px w-8 bg-green-400" />
              <span>Culinary Experiences</span>
            </div>

            <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
              Taste the{" "}
              <em className="font-serif font-normal">Finest</em>
              <br />
              Flavours
            </h1>

            <p className="mt-5 max-w-lg text-sm leading-6 text-white/80 sm:text-base">
              Three distinct dining venues, each with its own character —
              from candlelit fine dining to breezy poolside bites.
            </p>

            <div className="mt-7 flex w-fit flex-col border-l border-green-400 pl-4">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/60">
                Dining Hours
              </span>

              <span className="mt-1 text-sm">
                10:00 AM – 01:00 AM
              </span>
            </div>

          </div>
        </div>
      </motion.section>

      {/* ================= SECTION HEADER ================= */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="mx-auto mt-16 flex max-w-6xl flex-col gap-6 border-b border-gray-200 pb-8 md:flex-row md:items-end md:justify-between"
      >
        <div>

          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-green-700">
            <div className="h-px w-8 bg-green-600" />
            <span>Our Venues</span>
          </div>

          <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
            Where Every
            <br />
            <em className="font-serif font-normal">Meal Matters</em>
          </h2>

        </div>

        <p className="max-w-md text-sm leading-6 text-gray-600">
          From rooftop sunsets to riverside lunches — each venue is crafted
          to make dining an experience in itself.
        </p>
      </motion.section>

      {/* ================= RESTAURANTS ================= */}
      <section className="mx-auto mt-10 grid max-w-6xl gap-6">

        {RESTAURANTS.map((restaurant, index) => (
          <motion.article
            key={restaurant.index}
            custom={index}
            initial="hidden"
            whileInView="visible"
            variants={panelVariants}
            viewport={{ once: true, amount: 0.15 }}
            className="group grid overflow-hidden rounded border border-gray-200 bg-[#fffaf0] shadow-sm md:grid-cols-2"
          >

            {/* Image */}
            <div className="relative min-h-[280px] overflow-hidden md:min-h-[350px]">

              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

              <span className="absolute bottom-5 left-5 text-sm font-medium tracking-widest text-white">
                {restaurant.index}
              </span>

            </div>

            {/* Content */}
            <div className="flex flex-col justify-center bg-[#fafaf8] p-6 sm:p-10">

              <div className="text-xs uppercase tracking-[0.2em] text-green-700">
                {restaurant.tag}
              </div>

              <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">
                {restaurant.name}
              </h2>

              <div className="my-5 h-px w-10 bg-green-600" />

              <p className="max-w-lg text-sm leading-6 text-gray-600">
                {restaurant.description}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-4">

                <button className="flex items-center gap-2 rounded bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700">
                  View Menu

                  <svg
                    width="12"
                    height="9"
                    viewBox="0 0 12 9"
                    fill="none"
                  >
                    <path
                      d="M1 4.5h10M6.5 1l4 3.5-4 3.5"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <span className="text-xs text-gray-500">
                  ◈ {restaurant.hours}
                </span>

              </div>

            </div>
          </motion.article>
        ))}

      </section>

      {/* ================= RESERVATION CTA ================= */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75 }}
        viewport={{ once: true }}
        className="mx-auto mt-16 grid max-w-6xl overflow-hidden rounded border border-gray-200 bg-[#fffaf0] md:grid-cols-2"
      >

        {/* CTA Content */}
        <div className="flex flex-col justify-center p-7 sm:p-12">

          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-green-700">
            <div className="h-px w-8 bg-green-600" />
            <span>Reservations</span>
          </div>

          <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
            Reserve your
            <br />
            <em className="font-serif font-normal">table today</em>
          </h2>

          <p className="mt-5 max-w-md text-sm leading-6 text-gray-600">
            Secure your seat at any of our venues. We recommend booking ahead
            for weekend evenings and special occasions.
          </p>

          <Link
            to="/booking"
            className="mt-7 flex w-fit items-center gap-2 rounded bg-gray-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-green-700"
          >
            Book a Table

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

        {/* CTA Image */}
        <div className="relative min-h-[300px]">

          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80"
            alt="Reserve a table"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/20" />

          <span className="absolute bottom-5 right-6 text-2xl text-white/80">
            ◈
          </span>

        </div>

      </motion.section>

    </div>
  );
}