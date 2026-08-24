import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../utils/axios";

/* ─────────────────────────────────────────────
   SVG ICONS
───────────────────────────────────────────── */

const Icon = {
  bookings: (
    <svg
      width="42"
      height="42"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M3 9h18M8 2v4M16 2v4M7 13h2M11 13h2M15 13h2M7 17h2M11 17h2" />
    </svg>
  ),

  revenue: (
    <svg
      width="42"
      height="42"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20M6 14h2M10 14h2" />
    </svg>
  ),

  rooms: (
    <svg
      width="42"
      height="42"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 21V8l9-5 9 5v13H3z" />
      <rect x="9" y="13" width="3" height="8" />
      <rect x="12" y="13" width="3" height="8" />
    </svg>
  ),

  users: (
    <svg
      width="42"
      height="42"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="7" r="4" />
      <path d="M2 21c0-4 3-7 6-7s6 3 6 7" />
      <path d="M16 3a4 4 0 010 8M22 21c0-3-2-5-6-5" />
    </svg>
  ),
};

const ActionIcon = {
  add: (
    <svg
      width="17"
      height="17"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    >
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 5v6M5 8h6" />
    </svg>
  ),

  view: (
    <svg
      width="17"
      height="17"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    >
      <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" />
      <circle cx="8" cy="8" r="2" />
    </svg>
  ),

  export: (
    <svg
      width="17"
      height="17"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    >
      <path d="M8 2v9M5 8l3 3 3-3M2 13h12" />
    </svg>
  ),

  users: (
    <svg
      width="17"
      height="17"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    >
      <circle cx="6" cy="5" r="3" />
      <path d="M1 14c0-3 2-5 5-5s5 2 5 5" />
      <path d="M12 3a3 3 0 010 6M15 14c0-2-1-4-4-4" />
    </svg>
  ),
};

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */

const QUICK_ACTIONS = [
  {
    icon: ActionIcon.add,
    label: "Add Room",
    sub: "Create new listing",
    to: "/admin/rooms",
  },
  {
    icon: ActionIcon.view,
    label: "View Bookings",
    sub: "Manage reservations",
    to: "/admin/bookings",
  },
  {
    icon: ActionIcon.users,
    label: "Manage Users",
    sub: "View all guests",
    to: "/admin/users",
  },
];

/* ─────────────────────────────────────────────
   COUNTER
───────────────────────────────────────────── */

function CountUp({ target, prefix = "", suffix = "" }) {
  const [count, setCount] = useState(0);
  useEffect(() => setCount(target), [target]);

  return (
    <>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </>
  );
}

const formatRelativeTime = (date) => {
  if (!date) return "Unknown time";
  const elapsed = Math.max(0, Date.now() - new Date(date).getTime());
  const minutes = Math.floor(elapsed / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
};

const getMonthSeries = (payments) => {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);
    return { month: date.toLocaleDateString("en-GB", { month: "short" }), year: date.getFullYear(), monthIndex: date.getMonth(), val: 0 };
  });
  payments.forEach((payment) => {
    if (!["completed", "success"].includes(payment.status?.toLowerCase())) return;
    const date = new Date(payment.createdAt);
    const match = months.find((item) => item.year === date.getFullYear() && item.monthIndex === date.getMonth());
    if (match) match.val += Number(payment.amount) || 0;
  });
  return months;
};

export default function Dashboard() {
  const [dashboard, setDashboard] = useState({ bookings: [], payments: [], rooms: [], users: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      const results = await Promise.allSettled([
        API.get("/bookings"),
        API.get("/payments"),
        API.get("/accommodations"),
        API.get("/users"),
      ]);
      const [bookings, payments, rooms, users] = results.map((result) =>
        result.status === "fulfilled" && Array.isArray(result.value.data) ? result.value.data : []
      );
      if (results.some((result) => result.status === "rejected")) setError("Some dashboard data could not be loaded.");
      setDashboard({ bookings, payments, rooms, users });
      setLoading(false);
    };
    loadDashboard();
  }, []);

  const { bookings, payments, rooms, users } = dashboard;
  const revenue = payments.filter((payment) => ["completed", "success"].includes(payment.status?.toLowerCase())).reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0);
  const revenueData = getMonthSeries(payments);
  const maxRevenue = Math.max(...revenueData.map((item) => item.val), 1);
  const statusCounts = ["confirmed", "pending", "cancelled"].map((status) => ({
    label: status[0].toUpperCase() + status.slice(1),
    val: bookings.filter((booking) => booking.status?.toLowerCase() === status).length,
  }));
  const activities = [
    ...bookings.map((booking) => ({ date: booking.createdAt, text: <><strong>{booking.user?.fullName || booking.user?.email || "Guest"}</strong> made a booking for {booking.accommodation?.name || booking.room?.name || "a room"}</> })),
    ...payments.map((payment) => ({ date: payment.createdAt, text: <><strong>KES {(Number(payment.amount) || 0).toLocaleString()}</strong> payment recorded</> })),
    ...users.map((user) => ({ date: user.createdAt, text: <><strong>{user.fullName || user.email || "Guest"}</strong> created an account</> })),
  ].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0)).slice(0, 5);

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good morning"
      : hour < 17
      ? "Good afternoon"
      : "Good evening";

  return (
    <div className="space-y-6 text-gray-900">

      {/* ───────────────── HEADER ───────────────── */}

      <header className="border-b border-gray-200 pb-6">

        <p className="mb-1 text-sm font-medium uppercase tracking-[0.15em] text-green-700">
          {greeting}
        </p>

        <h1 className="text-3xl font-light tracking-tight sm:text-4xl">
          Welcome back,{" "}
          <em className="font-serif font-normal text-green-700">
            Admin
          </em>
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          {today}
        </p>

      </header>

      {/* ───────────────── STATS ───────────────── */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* BOOKINGS */}

        <div className="group rounded border border-gray-200 bg-[#faf7e8] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">

          <div className="mb-5 flex items-center justify-between">

            <div className="text-green-700">
              {Icon.bookings}
            </div>

            <span className="text-xs uppercase tracking-widest text-gray-400">
              Bookings
            </span>

          </div>

          <p className="text-sm text-gray-500">
            Total Bookings
          </p>

          <p className="mt-1 text-3xl font-light">
            <CountUp target={bookings.length} />
          </p>

          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="font-medium text-green-700">
              {loading ? "Loading" : `${bookings.filter((booking) => booking.status?.toLowerCase() === "confirmed").length} confirmed`}
            </span>
            <span className="text-gray-400">
              vs last month
            </span>
          </div>

        </div>

        {/* REVENUE */}

        <div className="group rounded border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">

          <div className="mb-5 flex items-center justify-between">

            <div className="text-green-700">
              {Icon.revenue}
            </div>

            <span className="text-xs uppercase tracking-widest text-gray-400">
              Income
            </span>

          </div>

          <p className="text-sm text-gray-500">
            Revenue
          </p>

          <p className="mt-1 text-3xl font-light">
            <CountUp
              target={revenue}
              prefix="KES "
            />
          </p>

          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="font-medium text-green-700">
              {loading ? "Loading" : `${payments.length} transactions`}
            </span>
            <span className="text-gray-400">
              vs last month
            </span>
          </div>

        </div>

        {/* ROOMS */}

        <div className="group rounded border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">

          <div className="mb-5 flex items-center justify-between">

            <div className="text-green-700">
              {Icon.rooms}
            </div>

            <span className="text-xs uppercase tracking-widest text-gray-400">
              Inventory
            </span>

          </div>

          <p className="text-sm text-gray-500">
            Active Rooms
          </p>

          <p className="mt-1 text-3xl font-light">
            <CountUp target={rooms.filter((room) => room.isAvailable !== false).length} />
          </p>

          <div className="mt-4 text-xs text-gray-400">
            {loading ? "Loading" : `${rooms.length} total rooms`}
          </div>

        </div>

        {/* USERS */}

        <div className="group rounded border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">

          <div className="mb-5 flex items-center justify-between">

            <div className="text-green-700">
              {Icon.users}
            </div>

            <span className="text-xs uppercase tracking-widest text-gray-400">
              Guests
            </span>

          </div>

          <p className="text-sm text-gray-500">
            Registered Users
          </p>

          <p className="mt-1 text-3xl font-light">
            <CountUp target={users.length} />
          </p>

          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="font-medium text-green-700">
              {loading ? "Loading" : `${users.filter((user) => user.role === "admin").length} admins`}
            </span>
            <span className="text-gray-400">
              this week
            </span>
          </div>

        </div>

      </div>

      {/* ───────────────── MAIN GRID ───────────────── */}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">

        {/* LEFT */}

        <div className="space-y-6">

          {/* REVENUE CHART */}

          <div className="rounded border border-gray-200 bg-white p-5 shadow-sm">

            <div className="mb-6 flex items-center justify-between">

              <div>

                <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
                  Performance
                </p>

                <h2 className="mt-1 text-xl font-light">
                  Monthly Revenue
                </h2>

              </div>

              <Link
                to="/admin/payments"
                className="text-sm text-green-700 transition-colors hover:text-green-900"
              >
                View all →
              </Link>

            </div>

            <div className="flex h-64 items-end gap-3 sm:gap-6">

              {revenueData.map((d) => (

                <div
                  key={`${d.year}-${d.monthIndex}`}
                  className="flex h-full flex-1 flex-col items-center justify-end"
                >

                  <div className="mb-2 text-[10px] text-gray-400">
                    KES {d.val.toLocaleString()}
                  </div>

                  <div className="flex h-[200px] w-full items-end">

                    <div
                      title={`KES ${d.val.toLocaleString()}`}
                      className="w-full rounded-t bg-green-700 transition-all duration-500 hover:bg-green-800"
                      style={{
                        height: `${(d.val / maxRevenue) * 100}%`,
                      }}
                    />

                  </div>

                  <span className="mt-3 text-xs text-gray-400">
                    {d.month}
                  </span>

                </div>

              ))}

            </div>

          </div>

          {/* ACTIVITY */}

          <div className="rounded border border-gray-200 bg-white shadow-sm">

            <div className="flex items-center justify-between border-b border-gray-200 p-5">

              <div>

                <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
                  Updates
                </p>

                <h2 className="mt-1 text-xl font-light">
                  Recent Activity
                </h2>

              </div>

              <Link
                to="/admin/bookings"
                className="text-sm text-green-700 hover:text-green-900"
              >
                View all →
              </Link>

            </div>

            <div className="divide-y divide-gray-100">

              {activities.length === 0 ? (
                <p className="p-5 text-sm text-gray-500">No recent activity.</p>
              ) : (
                activities.map((activity, index) => (
                  <div key={`${activity.date}-${index}`} className="flex gap-4 p-4 transition-colors hover:bg-[#fafaf8]">
                    <div className="flex flex-col items-center">
                      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-green-600" />
                      {index !== activities.length - 1 && <div className="mt-2 h-full w-px bg-gray-200" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-6 text-gray-700">{activity.text}</p>
                      <p className="mt-1 text-xs text-gray-400">{formatRelativeTime(activity.date)}</p>
                    </div>
                  </div>
                ))
              )}

            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="space-y-6">

          {/* QUICK ACTIONS */}

          <div className="rounded border border-gray-200 bg-[#fffdf2] p-5 shadow-sm">

            <div className="mb-5">

              <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
                Shortcuts
              </p>

              <h2 className="mt-1 text-xl font-light">
                Quick Actions
              </h2>

            </div>

            <div className="space-y-2">

              {QUICK_ACTIONS.map((action, i) => (

                <Link
                  key={i}
                  to={action.to}
                  className="group flex items-center gap-3 rounded border border-gray-200 bg-white p-3 transition-all duration-200 hover:border-green-300 hover:bg-[#fafaf8]"
                >

                  <div className="flex h-9 w-9 items-center justify-center rounded bg-[#faf7e8] text-green-700 transition-colors group-hover:bg-green-700 group-hover:text-white">
                    {action.icon}
                  </div>

                  <div className="min-w-0">

                    <p className="text-sm font-medium">
                      {action.label}
                    </p>

                    <p className="text-xs text-gray-400">
                      {action.sub}
                    </p>

                  </div>

                  <span className="ml-auto text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-green-700">
                    →
                  </span>

                </Link>

              ))}

            </div>

          </div>

          {/* BOOKING STATUS */}

          <div className="rounded border border-gray-200 bg-white p-5 shadow-sm">

            <div className="mb-6">

              <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
                Reservations
              </p>

              <h2 className="mt-1 text-xl font-light">
                Booking Status
              </h2>

            </div>

            <div className="space-y-5">

              {statusCounts.map((s) => (

                <div key={s.label}>

                  <div className="mb-2 flex justify-between text-sm">

                    <span className="text-gray-500">
                      {s.label}
                    </span>

                    <span className="font-medium">
                      {s.val}
                    </span>

                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">

                    <div
                      className="h-full rounded-full bg-green-700 transition-all duration-700"
                      style={{
                        width: `${bookings.length ? (s.val / bookings.length) * 100 : 0}%`,
                      }}
                    />

                  </div>

                  <p className="mt-1 text-right text-[10px] text-gray-400">
                    {bookings.length ? Math.round((s.val / bookings.length) * 100) : 0}%
                  </p>

                </div>

              ))}

            </div>

          </div>

          {/* MINI INFO CARD */}

          <div className="rounded bg-green-900 p-5 text-white">

            <p className="text-xs uppercase tracking-[0.15em] text-green-200">
              StarHotel
            </p>

            <h3 className="mt-3 text-xl font-light">
              Keep your hotel running smoothly.
            </h3>

            <p className="mt-2 text-sm leading-6 text-green-100">
              Manage rooms, bookings, guests and payments from one place.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

