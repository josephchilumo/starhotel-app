import React, { useEffect, useState, useMemo } from "react";
import API from "../utils/axios";

const STATUS_FILTERS = ["All", "Success", "Pending", "Failed", "Refunded"];

const METHOD_ICONS = {
  mpesa: (
    <svg width="14" height="14" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <rect x="0.5" y="0.5" width="12" height="12" rx="1" />
      <path d="M3 6.5h7M6.5 3.5v6" />
    </svg>
  ),
  card: (
    <svg width="14" height="14" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <rect x="0.5" y="2.5" width="12" height="8" rx="1" />
      <path d="M0.5 5.5h12" />
    </svg>
  ),
  paypal: (
    <svg width="14" height="14" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <path d="M3 2h5a3 3 0 010 6H4l-1 5" />
    </svg>
  ),
  stripe: (
    <svg width="14" height="14" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <path d="M2 8.5c0 1.1.9 2 2 2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v3.5z" />
    </svg>
  ),
};

const formatDate = (d) => {
  if (!d) return "—";

  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getStatusStyles = (status = "") => {
  const s = status.toLowerCase();

  if (s === "success" || s === "completed") {
    return "bg-green-50 text-green-700 border-green-200";
  }

  if (s === "pending") {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  if (s === "failed") {
    return "bg-red-50 text-red-700 border-red-200";
  }

  if (s === "refunded") {
    return "bg-gray-100 text-gray-700 border-gray-200";
  }

  return "bg-gray-50 text-gray-600 border-gray-200";
};

const getStatusDot = (status = "") => {
  const s = status.toLowerCase();

  if (s === "success" || s === "completed") return "bg-green-500";
  if (s === "pending") return "bg-amber-500";
  if (s === "failed") return "bg-red-500";
  if (s === "refunded") return "bg-gray-500";

  return "bg-gray-400";
};

function SkeletonRows() {
  return (
    <div className="divide-y divide-gray-100">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="grid min-w-[750px] grid-cols-5 gap-6 px-6 py-5"
        >
          <div className="h-8 w-24 animate-pulse rounded bg-gray-100" />

          <div className="flex items-center gap-3">
            <div className="h-9 w-9 animate-pulse rounded-full bg-gray-100" />
            <div className="space-y-2">
              <div className="h-3 w-28 animate-pulse rounded bg-gray-100" />
              <div className="h-2.5 w-36 animate-pulse rounded bg-gray-100" />
            </div>
          </div>

          <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-20 animate-pulse rounded bg-gray-100" />
          <div className="h-7 w-20 animate-pulse rounded-full bg-gray-100" />
        </div>
      ))}
    </div>
  );
}

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const fetchPayments = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await API.get("/payments");

      const raw = res.data;

      const list = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.payments)
        ? raw.payments
        : Array.isArray(raw?.data)
        ? raw.data
        : [];

      setPayments(list);
    } catch {
      setError("Could not load payments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    return payments.filter((p) => {
      const matchSearch =
        !q ||
        p.method?.toLowerCase().includes(q) ||
        p.user?.fullName?.toLowerCase().includes(q) ||
        p.user?.email?.toLowerCase().includes(q);

      const status = p.status?.toLowerCase();

      const matchStatus =
        filter === "All" ||
        status === filter.toLowerCase() ||
        (filter === "Success" && status === "completed");

      return matchSearch && matchStatus;
    });
  }, [payments, search, filter]);

  // Stats
  const total = payments.length;

  const revenue = payments
    .filter((p) =>
      ["success", "completed"].includes(p.status?.toLowerCase())
    )
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const pending = payments.filter(
    (p) => p.status?.toLowerCase() === "pending"
  ).length;

  const failed = payments.filter(
    (p) => p.status?.toLowerCase() === "failed"
  ).length;

  return (
    <div className="space-y-6 text-gray-900">

      {/* HEADER */}
      <div className="flex flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-green-700">
            Finance
          </p>

          <h1 className="font-serif text-3xl tracking-tight text-gray-950 sm:text-4xl">
            All <em className="font-normal text-green-700">Payments</em>
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {total} transaction{total !== 1 ? "s" : ""} recorded
          </p>
        </div>

        <button
          onClick={fetchPayments}
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

      {/* STATS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded border border-gray-200 bg-[#fffdf2] p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Total Transactions
            </span>

            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600">
              #
            </span>
          </div>

          <div className="text-3xl font-semibold tracking-tight">
            {total}
          </div>

          <p className="mt-2 text-xs text-gray-500">
            All recorded transactions
          </p>
        </div>

        <div className="rounded border border-gray-200 bg-[#fffdf2] p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Revenue Collected
            </span>

            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50 text-green-700">
              K
            </span>
          </div>

          <div className="text-2xl font-semibold tracking-tight">
            {revenue > 0
              ? `KES ${revenue.toLocaleString()}`
              : "KES 0"}
          </div>

          <p className="mt-2 text-xs text-green-700">
            Successful payments
          </p>
        </div>

        <div className="rounded border border-gray-200 bg-[#fffdf2] p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Pending
            </span>

            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-600">
              !
            </span>
          </div>

          <div className="text-3xl font-semibold tracking-tight">
            {pending}
          </div>

          <p className="mt-2 text-xs text-gray-500">
            Awaiting confirmation
          </p>
        </div>

        <div className="rounded border border-gray-200 bg-[#fffdf2] p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Failed
            </span>

            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-600">
              ×
            </span>
          </div>

          <div className="text-3xl font-semibold tracking-tight">
            {failed}
          </div>

          <p className="mt-2 text-xs text-red-600">
            Unsuccessful transactions
          </p>
        </div>

      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col gap-4 rounded border border-gray-200 bg-[#fffdf2] p-4 sm:flex-row sm:flex-wrap">

        {/* Search */}
        <div className="relative min-w-0 flex-1 sm:min-w-[260px]">
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
            className="w-full rounded border border-gray-300 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-1 focus:ring-green-600"
            placeholder="Search by guest or method..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`rounded px-3.5 py-2 text-sm font-medium transition ${
                filter === status
                  ? "bg-gray-900 text-white"
                  : "border border-gray-300 bg-white text-gray-700 hover:border-gray-900"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded border border-gray-200 bg-white shadow-sm">

        {error ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              !
            </div>

            <p className="text-sm font-medium text-gray-900">
              {error}
            </p>

            <button
              onClick={fetchPayments}
              className="mt-4 rounded bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800"
            >
              Try Again
            </button>
          </div>

        ) : loading ? (
          <SkeletonRows />

        ) : filtered.length === 0 ? (

          <div className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">

            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-gray-400">
              <svg
                width="32"
                height="32"
                viewBox="0 0 40 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="4" y="8" width="32" height="22" rx="2" />
                <path d="M4 14h32M10 22h4M24 22h6M10 28h8" />
              </svg>
            </div>

            <p className="font-medium text-gray-900">
              No payments found
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Try changing your search or payment filter.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse">

              <thead>
                <tr className="border-b border-gray-200 bg-[#fafaf8] text-left">
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Method
                  </th>

                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Guest
                  </th>

                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Date
                  </th>

                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">

                {filtered.map((p) => {
                  const methodKey = p.method
                    ?.toLowerCase()
                    .replace(/\s/g, "");

                  const icon =
                    METHOD_ICONS[methodKey] || METHOD_ICONS.card;

                  const initial =
                    p.user?.fullName?.[0] ??
                    p.user?.email?.[0] ??
                    "?";

                  const status = p.status ?? "Pending";

                  return (
                    <tr
                      key={p._id}
                      className="group transition hover:bg-[#fffdf2]"
                    >

                      {/* METHOD */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">

                          <div className="flex h-9 w-9 items-center justify-center rounded border border-gray-200 bg-gray-50 text-gray-600">
                            {icon}
                          </div>

                          <span className="text-sm font-medium capitalize text-gray-800">
                            {p.method ?? "—"}
                          </span>

                        </div>
                      </td>

                      {/* GUEST */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-50 text-sm font-semibold uppercase text-green-700">
                            {initial}
                          </div>

                          <div className="min-w-0">

                            <div className="truncate text-sm font-medium text-gray-900">
                              {p.user?.fullName ?? "—"}
                            </div>

                            <div className="mt-0.5 max-w-[220px] truncate text-xs text-gray-500">
                              {p.user?.email ?? "No email"}
                            </div>

                          </div>

                        </div>
                      </td>

                      {/* AMOUNT */}
                      <td className="px-6 py-5">
                        <span className="text-sm font-semibold text-gray-900">
                          KES{" "}
                          {p.amount != null
                            ? p.amount.toLocaleString()
                            : "—"}
                        </span>
                      </td>

                      {/* DATE */}
                      <td className="px-6 py-5">
                        <span className="text-sm text-gray-600">
                          {formatDate(p.createdAt)}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium capitalize ${getStatusStyles(
                            status
                          )}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${getStatusDot(
                              status
                            )}`}
                          />

                          {status}
                        </span>
                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>
          </div>
        )}

        {/* FOOTER */}
        {!loading && !error && filtered.length > 0 && (
          <div className="border-t border-gray-200 bg-[#fafaf8] px-6 py-3">
            <p className="text-xs text-gray-500">
              Showing{" "}
              <span className="font-medium text-gray-700">
                {filtered.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-700">
                {total}
              </span>{" "}
              payment{total !== 1 ? "s" : ""}
            </p>
          </div>
        )}

      </div>

    </div>
  );
}