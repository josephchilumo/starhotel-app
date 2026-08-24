import React, { useEffect, useState, useMemo } from "react";
import API from "../utils/axios";

const STATUS_FILTERS = [
  "All",
  "Confirmed",
  "Pending",
  "Cancelled",
  "Completed",
];

const formatDate = (d) => {
  if (!d) return "—";

  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
};

const getNights = (ci, co) => {
  if (!ci || !co) return 0;

  return Math.round(
    (new Date(co) - new Date(ci)) / 86400000
  );
};

const getStatusStyles = (status = "") => {
  const s = status.toLowerCase();

  if (s === "confirmed") {
    return "bg-green-50 text-green-700 border border-green-200";
  }

  if (s === "pending") {
    return "bg-amber-50 text-amber-700 border border-amber-200";
  }

  if (s === "cancelled") {
    return "bg-red-50 text-red-700 border border-red-200";
  }

  if (s === "completed") {
    return "bg-blue-50 text-blue-700 border border-blue-200";
  }

  return "bg-gray-50 text-gray-600 border border-gray-200";
};

const getStatusDot = (status = "") => {
  const s = status.toLowerCase();

  if (s === "confirmed") return "bg-green-500";
  if (s === "pending") return "bg-amber-500";
  if (s === "cancelled") return "bg-red-500";
  if (s === "completed") return "bg-blue-500";

  return "bg-gray-400";
};

function SkeletonRows() {
  return (
    <div className="divide-y divide-gray-100">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="grid min-w-[760px] grid-cols-5 gap-6 px-6 py-5"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />

            <div className="space-y-2">
              <div className="h-3 w-28 animate-pulse rounded bg-gray-200" />
              <div className="h-2.5 w-36 animate-pulse rounded bg-gray-100" />
            </div>
          </div>

          <div className="flex items-center">
            <div className="h-3 w-28 animate-pulse rounded bg-gray-200" />
          </div>

          <div className="space-y-2">
            <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
            <div className="h-2.5 w-16 animate-pulse rounded bg-gray-100" />
          </div>

          <div className="flex items-center">
            <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
          </div>

          <div className="flex items-center">
            <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Bookings() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const fetchBookings = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await API.get("/bookings");

      const raw = res.data;

      const list = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.bookings)
        ? raw.bookings
        : Array.isArray(raw?.data)
        ? raw.data
        : [];

      setData(list);
    } catch {
      setError("Could not load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    return data.filter((b) => {
      const guestName =
        b.user?.fullName?.toLowerCase() || "";

      const email =
        b.user?.email?.toLowerCase() || "";

      const accommodation =
        b.accommodation?.name?.toLowerCase() || "";

      const room =
        b.room?.name?.toLowerCase() || "";

      const matchSearch =
        !q ||
        guestName.includes(q) ||
        email.includes(q) ||
        accommodation.includes(q) ||
        room.includes(q);

      const matchStatus =
        filter === "All" ||
        b.status?.toLowerCase() === filter.toLowerCase();

      return matchSearch && matchStatus;
    });
  }, [data, search, filter]);

  // Stats
  const total = data.length;

  const confirmed = data.filter(
    (b) => b.status?.toLowerCase() === "confirmed"
  ).length;

  const pending = data.filter(
    (b) => b.status?.toLowerCase() === "pending"
  ).length;

  const revenue = data.reduce(
    (s, b) => s + (b.totalAmount || b.total || 0),
    0
  );

  return (
    <div className="space-y-6 text-gray-900">

      {/* HEADER */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-gray-200 pb-5">

        <div>
          <div className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-green-700">
            Reservations
          </div>

          <h1 className="text-3xl font-light tracking-tight sm:text-4xl">
            All <em className="font-serif text-green-700">Bookings</em>
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {total} reservation{total !== 1 ? "s" : ""} total
          </p>
        </div>

        <button
          onClick={fetchBookings}
          className="flex items-center gap-2 rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 transition hover:border-green-600 hover:text-green-700"
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

          Refresh
        </button>
      </div>

      {/* STATS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded border border-gray-200 bg-[#fffdf2] p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Total Bookings
            </span>

            <span className="text-xs text-gray-400">
              All
            </span>
          </div>

          <div className="mt-4 text-3xl font-light">
            {total}
          </div>

          <div className="mt-2 text-xs text-gray-500">
            Reservations received
          </div>
        </div>

        <div className="rounded border border-gray-200 bg-[#fffdf2] p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Confirmed
            </span>

            <span className="h-2 w-2 rounded-full bg-green-500" />
          </div>

          <div className="mt-4 text-3xl font-light text-green-700">
            {confirmed}
          </div>

          <div className="mt-2 text-xs text-gray-500">
            Active reservations
          </div>
        </div>

        <div className="rounded border border-gray-200 bg-[#fffdf2] p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Pending
            </span>

            <span className="h-2 w-2 rounded-full bg-amber-500" />
          </div>

          <div className="mt-4 text-3xl font-light text-amber-700">
            {pending}
          </div>

          <div className="mt-2 text-xs text-gray-500">
            Awaiting confirmation
          </div>
        </div>

        <div className="rounded border border-gray-200 bg-[#fffdf2] p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Total Revenue
            </span>

            <span className="text-xs font-medium text-green-700">
              KES
            </span>
          </div>

          <div className="mt-4 text-2xl font-light">
            {revenue > 0
              ? `KES ${revenue.toLocaleString()}`
              : "—"}
          </div>

          <div className="mt-2 text-xs text-gray-500">
            From all bookings
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="rounded border border-gray-200 bg-[#faf7e8] p-4">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          {/* Search */}
          <div className="relative w-full lg:max-w-sm">

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
                <circle cx="5.5" cy="5.5" r="4.5" />
                <path d="M9.5 9.5l2.5 2.5" />
              </svg>
            </span>

            <input
              className="w-full rounded border border-gray-300 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-green-600 focus:ring-1 focus:ring-green-600"
              placeholder="Search by guest, room…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded px-3 py-2 text-sm transition ${
                  filter === f
                    ? "bg-gray-900 text-white"
                    : "border border-gray-300 bg-white text-gray-700 hover:border-gray-900"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded border border-gray-200 bg-[#fafaf8] shadow-sm">

        {error ? (
          <div className="flex min-h-[300px] items-center justify-center p-8">
            <div className="rounded border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              {error}
            </div>
          </div>
        ) : loading ? (
          <SkeletonRows />
        ) : filtered.length === 0 ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">

            <div className="mb-4 rounded-full bg-gray-100 p-5 text-gray-400">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect
                  x="4"
                  y="8"
                  width="32"
                  height="28"
                  rx="2"
                />
                <path d="M4 16h32M13 4v8M27 4v8M12 24h16M12 30h10" />
              </svg>
            </div>

            <div className="text-lg font-medium">
              No bookings found
            </div>

            <div className="mt-1 text-sm text-gray-500">
              {search || filter !== "All"
                ? "Try adjusting your search or filter"
                : "No reservations have been made yet"}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[760px] text-left">

              <thead>
                <tr className="border-b border-gray-200 bg-[#fffdf2]">

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Guest
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Room
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Dates
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Total
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">

                {filtered.map((b) => {

                  const nights = getNights(
                    b.checkIn,
                    b.checkOut
                  );

                  const initial =
                    b.user?.fullName?.[0] ??
                    b.user?.email?.[0] ??
                    "?";

                  return (
                    <tr
                      key={b._id}
                      className="group transition-colors hover:bg-[#fffdf2]"
                    >

                      {/* Guest */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-medium uppercase text-white">
                            {initial}
                          </div>

                          <div className="min-w-0">

                            <div className="truncate text-sm font-medium text-gray-900">
                              {b.user?.fullName ?? "—"}
                            </div>

                            <div className="truncate text-xs text-gray-500">
                              {b.user?.email ?? "No email"}
                            </div>

                          </div>

                        </div>

                      </td>

                      {/* Room */}
                      <td className="px-6 py-5">

                        <div className="text-sm font-medium text-gray-900">
                          {b.accommodation?.name ??
                            b.room?.name ??
                            "—"}
                        </div>

                      </td>

                      {/* Dates */}
                      <td className="px-6 py-5">

                        <div className="text-sm text-gray-800">
                          {formatDate(b.checkIn)}

                          <span className="mx-2 text-gray-400">
                            →
                          </span>

                          {formatDate(b.checkOut)}
                        </div>

                        <div className="mt-1 text-xs text-gray-500">
                          {nights > 0
                            ? `${nights} night${
                                nights !== 1 ? "s" : ""
                              }`
                            : "—"}
                        </div>

                      </td>

                      {/* Total */}
                      <td className="px-6 py-5">

                        <span className="text-sm font-semibold text-gray-900">
                          KES{" "}
                          {(
                            b.totalAmount ??
                            b.total
                          )?.toLocaleString() ?? "—"}
                        </span>

                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">

                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${getStatusStyles(
                            b.status
                          )}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${getStatusDot(
                              b.status
                            )}`}
                          />

                          {b.status ?? "Pending"}
                        </span>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>
          </div>
        )}

        {/* COUNT BAR */}
        {!loading &&
          !error &&
          filtered.length > 0 && (
            <div className="border-t border-gray-200 bg-[#fffdf2] px-6 py-3 text-xs text-gray-500">
              Showing{" "}
              <span className="font-medium text-gray-900">
                {filtered.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-900">
                {total}
              </span>{" "}
              booking{total !== 1 ? "s" : ""}
            </div>
          )}

      </div>
    </div>
  );
}