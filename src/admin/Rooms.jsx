import React, { useEffect, useState } from "react";
import API from "../utils/axios";
import { Link } from "react-router-dom";

function SkeletonCards() {
  return Array.from({ length: 6 }).map((_, i) => (
    <div
      key={i}
      className="overflow-hidden rounded border border-gray-200 bg-white shadow-sm"
    >
      <div className="h-52 animate-pulse bg-gray-100" />

      <div className="space-y-4 p-5">
        <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-gray-100" />
      </div>
    </div>
  ));
}

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [toDelete, setToDelete] = useState(null);

  const fetchRooms = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await API.get("/accommodations");
      setRooms(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError("Could not load rooms.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleDelete = async () => {
    if (!toDelete) return;

    try {
      await API.delete(`/accommodations/${toDelete._id}`);

      setRooms((prev) =>
        prev.filter((r) => r._id !== toDelete._id)
      );
    } catch {
      alert("Delete failed.");
    } finally {
      setToDelete(null);
    }
  };

  const filtered = rooms.filter((room) =>
    !search ||
    room.name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = rooms.reduce(
    (sum, room) => sum + (room.price || 0),
    0
  );

  const available = rooms.filter(
    (room) => room.isAvailable !== false
  ).length;

  return (
    <div className="space-y-6 text-gray-900">

      {/* ───────────────── HEADER ───────────────── */}
      <div className="flex flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-end sm:justify-between">

        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-green-700">
            Accommodation
          </p>

          <h1 className="font-serif text-3xl tracking-tight text-gray-950 sm:text-4xl">
            All{" "}
            <em className="font-normal text-green-700">
              Rooms
            </em>
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {rooms.length} room
            {rooms.length !== 1 ? "s" : ""} listed
          </p>
        </div>

        <Link
          to="/admin/rooms/add"
          className="inline-flex w-fit items-center gap-2 rounded bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-700"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          >
            <path d="M6 1v10M1 6h10" />
          </svg>

          Add Room
        </Link>
      </div>

      {/* ───────────────── STATS ───────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded border border-gray-200 bg-[#fffdf2] p-5 shadow-sm">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
            Total Rooms
          </span>

          <div className="mt-3 text-3xl font-semibold tracking-tight text-gray-950">
            {rooms.length}
          </div>

          <p className="mt-1 text-xs text-gray-500">
            Listed accommodation
          </p>
        </div>

        <div className="rounded border border-gray-200 bg-[#fffdf2] p-5 shadow-sm">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
            Available
          </span>

          <div className="mt-3 text-3xl font-semibold tracking-tight text-green-700">
            {available}
          </div>

          <p className="mt-1 text-xs text-gray-500">
            Currently bookable
          </p>
        </div>

        <div className="rounded border border-gray-200 bg-[#fffdf2] p-5 shadow-sm">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
            Unavailable
          </span>

          <div className="mt-3 text-3xl font-semibold tracking-tight text-red-600">
            {rooms.length - available}
          </div>

          <p className="mt-1 text-xs text-gray-500">
            Not currently bookable
          </p>
        </div>

        <div className="rounded border border-gray-200 bg-[#fffdf2] p-5 shadow-sm">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
            Average Rate
          </span>

          <div className="mt-3 text-2xl font-semibold tracking-tight text-gray-950">
            {rooms.length
              ? `KES ${Math.round(
                  totalRevenue / rooms.length
                ).toLocaleString()}`
              : "KES 0"}
          </div>

          <p className="mt-1 text-xs text-gray-500">
            Average nightly rate
          </p>
        </div>

      </div>

      {/* ───────────────── TOOLBAR ───────────────── */}
      <div className="flex flex-col gap-3 rounded border border-gray-200 bg-[#fffdf2] p-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="relative w-full sm:max-w-md">

          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg
              width="14"
              height="14"
              viewBox="0 0 13 13"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            >
              <circle
                cx="5.5"
                cy="5.5"
                r="4.5"
              />
              <path d="M9.5 9.5l2.5 2.5" />
            </svg>
          </span>

          <input
            className="w-full rounded border border-gray-300 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-1 focus:ring-green-600"
            placeholder="Search rooms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          onClick={fetchRooms}
          disabled={loading}
          className="inline-flex w-fit items-center gap-2 rounded border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-green-600 hover:text-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          >
            <path d="M10.5 1.5A5 5 0 1 1 1.5 6" />
            <path d="M10.5 1.5V5h-3.5" />
          </svg>

          {loading ? "Loading..." : "Refresh"}
        </button>

      </div>

      {/* ───────────────── GRID ───────────────── */}
      {loading ? (

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <SkeletonCards />
        </div>

      ) : error ? (

        <div className="flex min-h-[300px] flex-col items-center justify-center rounded border border-gray-200 bg-white p-8 text-center">

          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
            !
          </div>

          <p className="text-sm font-medium text-gray-900">
            {error}
          </p>

          <button
            onClick={fetchRooms}
            className="mt-4 rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Try Again
          </button>

        </div>

      ) : filtered.length === 0 ? (

        <div className="flex min-h-[300px] flex-col items-center justify-center rounded border border-gray-200 bg-white p-8 text-center">

          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-gray-400">
            <svg
              width="34"
              height="34"
              viewBox="0 0 40 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            >
              <path d="M5 35V16L20 5l15 11v19H5z" />
              <rect
                x="14"
                y="22"
                width="5"
                height="13"
              />
              <rect
                x="21"
                y="22"
                width="5"
                height="13"
              />
            </svg>
          </div>

          <p className="font-medium text-gray-900">
            No rooms found
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search.
          </p>

        </div>

      ) : (

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

          {filtered.map((room) => (

            <div
              key={room._id}
              className="group overflow-hidden rounded border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >

              {/* IMAGE */}
              <div className="relative h-56 overflow-hidden bg-gray-100">

                <img
                  src={
                    room.images?.[0] ||
                    "https://via.placeholder.com/400x200"
                  }
                  alt={room.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70" />

                {/* STATUS */}
                <div className="absolute left-4 top-4">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur ${
                      room.isAvailable === false
                        ? "border-red-200 bg-red-50/95 text-red-700"
                        : "border-green-200 bg-green-50/95 text-green-700"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        room.isAvailable === false
                          ? "bg-red-500"
                          : "bg-green-500"
                      }`}
                    />

                    {room.isAvailable === false
                      ? "Unavailable"
                      : "Available"}
                  </span>
                </div>

                {/* ACTIONS */}
                <div className="absolute bottom-4 left-4 right-4 flex translate-y-2 gap-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">

                  <Link
                    to={`/admin/rooms/edit/${room._id}`}
                    className="flex flex-1 items-center justify-center gap-2 rounded bg-white px-3 py-2 text-xs font-medium text-gray-900 shadow-sm transition hover:bg-green-50 hover:text-green-700"
                  >
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 11 11"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M7.5 1.5l2 2-6 6H1.5v-2l6-6z" />
                    </svg>

                    Edit
                  </Link>

                  <button
                    onClick={() => setToDelete(room)}
                    className="flex flex-1 items-center justify-center gap-2 rounded bg-red-600 px-3 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-red-700"
                  >
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 11 11"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1.5 3h8M4 3V2h3v1M9 3l-.5 7h-5L3 3" />
                    </svg>

                    Delete
                  </button>

                </div>

              </div>

              {/* BODY */}
              <div className="p-5">

                <div className="flex items-start justify-between gap-4">

                  <div className="min-w-0">

                    <h2 className="truncate font-serif text-lg font-medium text-gray-950">
                      {room.name || "Unnamed Room"}
                    </h2>

                    {room.description && (
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-500">
                        {room.description}
                      </p>
                    )}

                  </div>

                  <div className="shrink-0 text-right">

                    <div className="text-base font-semibold text-gray-950">
                      KES{" "}
                      {room.price?.toLocaleString() ?? "—"}
                    </div>

                    <div className="text-[11px] text-gray-400">
                      per night
                    </div>

                  </div>

                </div>

                {/* DETAILS */}
                <div className="mt-5 flex items-center gap-4 border-t border-gray-100 pt-4">

                  {room.occupancy && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">

                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                      >
                        <circle cx="8" cy="5" r="3" />
                        <path d="M2 14c0-3.5 2.5-5 6-5s6 1.5 6 5" />
                      </svg>

                      <span>
                        {room.occupancy} guest
                        {room.occupancy !== 1 ? "s" : ""}
                      </span>

                    </div>
                  )}

                  {room.category && (
                    <div className="rounded-full bg-gray-50 px-2.5 py-1 text-[11px] text-gray-500">
                      {room.category}
                    </div>
                  )}

                </div>

              </div>

            </div>

          ))}

        </div>
      )}

      {/* ───────────────── COUNT ───────────────── */}
      {!loading && !error && filtered.length > 0 && (
        <div className="border-t border-gray-200 pt-4">
          <p className="text-xs text-gray-500">
            Showing{" "}
            <span className="font-medium text-gray-700">
              {filtered.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-gray-700">
              {rooms.length}
            </span>{" "}
            room{rooms.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}

      {/* ───────────────── DELETE MODAL ───────────────── */}
      {toDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={() => setToDelete(null)}
        >

          <div
            className="w-full max-w-md rounded-lg border border-gray-200 bg-[#fffdf2] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              >
                <path d="M3 5h14M7 5V3h6v2M15 5l-1 12H6L5 5" />
                <path d="M8 9v5M12 9v5" />
              </svg>
            </div>

            <h2 className="font-serif text-2xl text-gray-950">
              Delete Room
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              Are you sure you want to permanently delete{" "}
              <strong className="font-semibold text-gray-900">
                {toDelete.name}
              </strong>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">

              <button
                onClick={() => setToDelete(null)}
                className="rounded border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-gray-900 hover:text-gray-900"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="rounded bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
              >
                Delete Room
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}