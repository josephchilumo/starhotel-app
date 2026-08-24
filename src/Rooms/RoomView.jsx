import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../utils/axios";

export default function RoomView() {
  const scrollRef = useRef(null);

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await API.get("/accommodations");
        setRooms(res.data);
      } catch {
        setError("Could not load rooms.");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) {
    return (
      <section className="min-h-[50vh] bg-[#fafaf8] px-4 py-20 text-gray-900">
        <div className="flex items-center justify-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-green-600" />
          <span className="text-sm text-gray-500">
            Loading rooms...
          </span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-[#fafaf8] px-4 py-16">
        <div className="mx-auto max-w-2xl rounded border border-red-200 bg-red-50 p-6 text-center text-red-700">
          <p className="text-sm">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#fafaf8] px-4 py-14 text-gray-900 transition-colors duration-700 sm:px-8 lg:py-20">

      {/* Header */}
      <div className="mx-auto max-w-3xl text-center">

        <span className="text-xs font-medium uppercase tracking-[0.25em] text-green-700">
          Select your retreat
        </span>

        <h1 className="mt-3 text-3xl font-light tracking-tight sm:text-4xl">
          Our <em className="font-serif">Rooms</em>
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
          Handcrafted spaces where the Indian Ocean meets refined comfort.
        </p>
      </div>

      {/* Count bar */}
      <div className="mx-auto mt-10 flex max-w-6xl items-center justify-between border-y border-gray-200 py-4">

        <div>
          <p className="text-xs uppercase tracking-wider text-gray-400">
            Accommodation
          </p>

          <p className="mt-1 text-sm font-medium text-gray-900">
            {rooms.length}{" "}
            {rooms.length === 1 ? "room" : "rooms"} available
          </p>
        </div>

        <div className="hidden h-2 w-2 rounded-full bg-green-600 sm:block" />
      </div>

      {/* Mobile controls */}
      <div className="mx-auto mt-5 flex max-w-6xl justify-end gap-2 md:hidden">

        <button
          onClick={() =>
            scrollRef.current?.scrollBy({
              left: -300,
              behavior: "smooth",
            })
          }
          className="flex h-9 w-9 items-center justify-center rounded border border-gray-300 bg-white text-lg text-gray-700 transition hover:border-gray-900 hover:bg-gray-900 hover:text-white"
          aria-label="Previous rooms"
        >
          ←
        </button>

        <button
          onClick={() =>
            scrollRef.current?.scrollBy({
              left: 300,
              behavior: "smooth",
            })
          }
          className="flex h-9 w-9 items-center justify-center rounded border border-gray-300 bg-white text-lg text-gray-700 transition hover:border-gray-900 hover:bg-gray-900 hover:text-white"
          aria-label="Next rooms"
        >
          →
        </button>

      </div>

      {/* Rooms */}
      <div className="mx-auto mt-6 max-w-6xl">

        <div
          ref={scrollRef}
          className="
            grid gap-6
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >

          {rooms.map((room, index) => (

            <article
              key={room._id}
              className="
                group
                overflow-hidden
                rounded
                border border-gray-200
                bg-[#fffdf2]
                transition-all duration-500
                hover:-translate-y-1
                hover:border-gray-300
                hover:shadow-lg
              "
            >

              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">

                <img
                  src={room.images?.[0]}
                  alt={room.name}
                  className="
                    h-full
                    w-full
                    object-cover
                    transition-transform
                    duration-700
                    group-hover:scale-105
                  "
                />

                {/* Image gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

                {/* Number */}
                <div className="absolute left-4 top-4">

                  <span className="
                    rounded
                    bg-white/90
                    px-2.5
                    py-1.5
                    text-[10px]
                    font-medium
                    tracking-widest
                    text-gray-900
                    backdrop-blur-sm
                  ">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                </div>

                {/* Availability */}
                <div className="absolute right-4 top-4">

                  <span className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    bg-white/90
                    px-3
                    py-1.5
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-wider
                    text-gray-800
                    backdrop-blur-sm
                  ">

                    <span className="h-1.5 w-1.5 rounded-full bg-green-600" />

                    Available

                  </span>

                </div>

                {/* Desktop hover actions */}
                <div className="
                  absolute
                  bottom-0
                  left-0
                  right-0
                  hidden
                  translate-y-full
                  gap-2
                  bg-black/70
                  p-4
                  transition-transform
                  duration-300
                  group-hover:translate-y-0
                  md:flex
                ">

                  <Link
                    to={`/booking/${room._id}`}
                    className="
                      flex-1
                      rounded
                      bg-white
                      px-4
                      py-2.5
                      text-center
                      text-xs
                      font-medium
                      text-gray-900
                      transition
                      hover:bg-green-600
                      hover:text-white
                    "
                  >
                    Book Now
                  </Link>

                  <Link
                    to={`/room/${room._id}`}
                    className="
                      flex-1
                      rounded
                      border
                      border-white/70
                      px-4
                      py-2.5
                      text-center
                      text-xs
                      font-medium
                      text-white
                      transition
                      hover:bg-white
                      hover:text-gray-900
                    "
                  >
                    Details
                  </Link>

                </div>

              </div>

              {/* Content */}
              <div className="p-5">

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <h2 className="
                      text-lg
                      font-medium
                      tracking-tight
                      text-gray-900
                    ">
                      {room.name}
                    </h2>

                    {room.occupancy && (
                      <p className="mt-2 text-xs text-gray-500">
                        Up to {room.occupancy} guests
                      </p>
                    )}

                  </div>

                  <div className="text-right">

                    <p className="
                      text-base
                      font-semibold
                      text-green-700
                    ">
                      KES {room.price?.toLocaleString()}
                    </p>

                    <p className="mt-0.5 text-[10px] uppercase tracking-wider text-gray-400">
                      per night
                    </p>

                  </div>

                </div>

                {/* Divider */}
                <div className="my-5 border-t border-gray-200" />

                {/* Mobile buttons */}
                <div className="flex gap-2 md:hidden">

                  <Link
                    to={`/booking/${room._id}`}
                    className="
                      flex-1
                      rounded
                      bg-gray-900
                      px-4
                      py-2.5
                      text-center
                      text-xs
                      font-medium
                      text-white
                      transition
                      hover:bg-green-700
                    "
                  >
                    Book Now
                  </Link>

                  <Link
                    to={`/room/${room._id}`}
                    className="
                      flex-1
                      rounded
                      border
                      border-gray-300
                      px-4
                      py-2.5
                      text-center
                      text-xs
                      font-medium
                      text-gray-900
                      transition
                      hover:border-gray-900
                    "
                  >
                    Details
                  </Link>

                </div>

              </div>

            </article>

          ))}

        </div>

      </div>

      {/* Bottom count */}
      {rooms.length > 0 && (
        <div className="mx-auto mt-10 max-w-6xl border-t border-gray-200 pt-4 text-center">

          <p className="text-xs uppercase tracking-wider text-gray-400">
            Showing all {rooms.length}{" "}
            {rooms.length === 1 ? "room" : "rooms"}
          </p>

        </div>
      )}

    </section>
  );
}