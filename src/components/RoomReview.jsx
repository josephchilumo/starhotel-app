import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import API from "../utils/axios";

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 25,
  },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.1,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

export default function RoomReview() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await API.get("/accommodations");
        setRooms(Array.isArray(response.data) ? response.data : []);
      } catch {
        setError("Rooms are temporarily unavailable.");
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  return (
    <section className="bg-[#faf9f6] px-5 py-16 text-gray-900">

      {/* Header */}
      <motion.div
        className="mx-auto max-w-6xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <span className="text-xs uppercase tracking-[0.2em] text-gray-500">
          Get the Star Treatment
        </span>

        <h2 className="mt-3 text-3xl font-medium md:text-4xl">
          Rooms & <span className="font-serif italic">Suites</span>
        </h2>

        <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500">
          Discover comfortable spaces designed for relaxation, privacy, and
          memorable stays.
        </p>
      </motion.div>

      {/* Room Cards */}
      <div className="mx-auto mt-10 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <p className="text-sm text-gray-500">Loading rooms...</p>
        ) : error ? (
          <p className="text-sm text-red-700">{error}</p>
        ) : rooms.length === 0 ? (
          <p className="text-sm text-gray-500">No rooms are available yet.</p>
        ) : rooms.slice(0, 4).map((room, i) => (
          <motion.div
            key={room._id}
            custom={i}
            initial="hidden"
            whileInView="visible"
            variants={cardVariants}
            viewport={{ once: true, amount: 0.15 }}
            className="overflow-hidden rounded-xl border border-[#e5e0d8] bg-[#fffdf9]"
          >
            {/* Image */}
            <div className="relative">
              <img
                src={room.images?.[0]}
                alt={room.name}
                className="h-52 w-full object-cover"
              />

              {/* Tag */}
              <span className="absolute left-4 top-4 rounded-full bg-[#fffdf9]/90 px-3 py-1 text-[10px] uppercase tracking-wider text-gray-700">
                {room.isAvailable === false ? "Unavailable" : "Available"}
              </span>
            </div>

            {/* Content */}
            <div className="p-5">

              <h3 className="text-lg font-medium">
                {room.name}
              </h3>

              <div className="my-4 border-t border-[#eee9e1]" />

              {/* Price */}
              <div className="flex items-end">
                <span className="text-2xl font-medium">
                  KES {Number(room.price || 0).toLocaleString()}
                </span>

                <span className="mb-1 ml-1 text-xs text-gray-400">
                  / {room.per}
                </span>
              </div>

              {/* Occupants */}
              <p className="mt-3 text-xs text-gray-500">
                  👤 Up to {room.occupancy || room.capacity || 0} guests
              </p>

              {/* Buttons */}
              <div className="mt-5 flex gap-2">
                <Link
                  to={`/booking/${room._id}`}
                  className="flex-1 rounded-md bg-gray-900 px-3 py-2.5 text-center text-xs text-white transition hover:bg-gray-700"
                >
                  Book Now
                </Link>

                <Link
                  to={`/room/${room._id}`}
                  className="rounded-md border border-[#ddd7ce] px-4 py-2.5 text-xs text-gray-700 transition hover:bg-[#f5f1eb]"
                >
                  Details
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom */}
      <div className="mx-auto mt-8 flex max-w-6xl flex-col gap-4 border-t border-[#e5e0d8] pt-6 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-xs text-gray-500">
          {rooms.length} curated room{rooms.length === 1 ? "" : "s"} & suites · StarHotel
        </span>

        <a
          href="/rooms"
          className="text-sm font-medium underline underline-offset-4"
        >
          View All Rooms →
        </a>
      </div>
    </section>
  );
}