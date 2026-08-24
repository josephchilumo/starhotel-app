import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const EVENTS = [
  {
    title: "Weddings",
    tag: "Celebration",
    index: "01",
    description:
      "Celebrate your special day in a breathtaking setting with elegant décor and world-class service.",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
  },
  {
    title: "Corporate Events",
    tag: "Business",
    index: "02",
    description:
      "Host meetings, conferences, and business events with modern facilities and seamless support.",
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&q=80",
  },
  {
    title: "Private Parties",
    tag: "Occasion",
    index: "03",
    description:
      "From birthdays to anniversaries, enjoy unforgettable moments in a luxurious atmosphere.",
    image:
      "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=1200&q=80",
  },
];

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 32,
  },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      delay: i * 0.13,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

function EventCard({ event, index }) {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      variants={cardVariants}
      viewport={{ once: true, amount: 0.15 }}
      className="overflow-hidden rounded border border-gray-200 bg-[#fffaf0] shadow-sm"
    >
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        <div className="absolute bottom-4 left-5 text-sm font-medium tracking-widest text-white">
          {event.index}
        </div>
      </div>

      {/* Content */}
      <div className="bg-[#fafaf8] px-5 py-8 text-gray-900">
        <div className="mb-3 text-xs uppercase tracking-[0.2em] text-green-700">
          {event.tag}
        </div>

        <h2 className="text-2xl font-semibold">{event.title}</h2>

        <div className="my-4 h-px w-10 bg-green-600" />

        <p className="text-sm leading-6 text-gray-600">
          {event.description}
        </p>

        <button className="mt-6 flex items-center gap-2 text-sm font-medium text-gray-900 transition-colors hover:text-green-700">
          Learn More

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
      </div>
    </motion.div>
  );
}

export default function Events() {
  return (
    <div className="bg-[#fafaf8] px-4 py-12 text-gray-900 transition-colors duration-1000 sm:px-8">

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mx-auto max-w-3xl text-center"
      >
        <div className="flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em] text-green-700">
          <div className="h-px w-8 bg-green-600" />
          <span>Events & Celebrations</span>
          <div className="h-px w-8 bg-green-600" />
        </div>

        <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
          Create <em className="font-serif">Unforgettable</em>
          <br />
          Experiences
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
          From intimate gatherings to grand celebrations — our elegant spaces
          and dedicated team bring your vision to life.
        </p>
      </motion.div>

      {/* Event Cards */}
      <div className="mx-auto mt-12 grid max-w-6xl gap-6 md:grid-cols-2">

        <EventCard event={EVENTS[0]} index={0} />

        <EventCard event={EVENTS[1]} index={1} />

        <div className="md:col-span-2 md:max-w-2xl md:mx-auto">
          <EventCard event={EVENTS[2]} index={2} />
        </div>

      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: "easeOut" }}
        viewport={{ once: true }}
        className="mx-auto mt-16 max-w-4xl rounded border border-gray-200 bg-[#fffaf0] px-6 py-12 text-center shadow-sm sm:px-12"
      >
        <div className="flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em] text-green-700">
          <div className="h-px w-8 bg-green-600" />
          <span>Let's Begin</span>
          <div className="h-px w-8 bg-green-600" />
        </div>

        <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
          Ready to plan your <em className="font-serif">event?</em>
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-gray-600">
          Our events team is ready to help you design an experience that your
          guests will remember for years to come.
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            to="/contact"
            className="flex items-center gap-2 rounded bg-gray-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-green-700"
          >
            Contact Our Team

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

          <Link
            to="/rooms"
            className="rounded border border-gray-300 px-5 py-3 text-sm text-gray-900 transition-colors hover:border-gray-900"
          >
            View Spaces
          </Link>
        </div>
      </motion.div>

    </div>
  );
}