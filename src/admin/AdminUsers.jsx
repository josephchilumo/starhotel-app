import React, { useEffect, useState, useMemo } from "react";
import API from "../utils/axios";

const ROLE_FILTERS = ["All", "Admin", "User", "Suspended"];

const formatDate = (d) => {
  if (!d) return "—";

  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

function SkeletonRows() {
  return Array.from({ length: 6 }).map((_, i) => (
    <div
      key={i}
      className="grid grid-cols-[40px_1fr_100px_100px_140px] items-center gap-4 border-b border-gray-200 px-5 py-5 animate-pulse"
    >
      <div className="h-9 w-9 rounded-full bg-gray-200" />

      <div className="space-y-2">
        <div className="h-4 w-32 rounded bg-gray-200" />
        <div className="h-3 w-48 rounded bg-gray-200" />
      </div>

      <div className="h-6 w-16 rounded-full bg-gray-200" />
      <div className="h-4 w-20 rounded bg-gray-200" />
      <div className="h-7 w-28 rounded bg-gray-200" />
    </div>
  ));
}

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [toDelete, setToDelete] = useState(null);
  const [toast, setToast] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await API.get("/users");

      const raw = res.data;

      const list = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.users)
        ? raw.users
        : Array.isArray(raw?.data)
        ? raw.data
        : [];

      setUsers(list);
    } catch {
      setError("Could not load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const updateUser = (id, changes) => {
    setUsers((prev) =>
      prev.map((u) => (u._id === id ? { ...u, ...changes } : u))
    );
  };

  const handlePromote = async (user) => {
    try {
      await API.put(`/users/${user._id}`, { role: "admin" });

      updateUser(user._id, { role: "admin" });

      showToast(`${user.fullName} promoted to Admin`);
    } catch {
      showToast("Action failed.");
    }
  };

  const handleDemote = async (user) => {
    try {
      await API.put(`/users/${user._id}`, { role: "user" });

      updateUser(user._id, { role: "user" });

      showToast(`${user.fullName} demoted to User`);
    } catch {
      showToast("Action failed.");
    }
  };

  const handleSuspend = async (user) => {
    const suspended = user.suspended !== true;

    try {
      await API.put(`/users/${user._id}`, { suspended });

      updateUser(user._id, { suspended });

      showToast(
        suspended
          ? `${user.fullName} suspended`
          : `${user.fullName} reinstated`
      );
    } catch {
      showToast("Action failed.");
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;

    try {
      await API.delete(`/users/${toDelete._id}`);

      setUsers((prev) =>
        prev.filter((u) => u._id !== toDelete._id)
      );

      showToast("User deleted");
    } catch {
      showToast("Delete failed.");
    } finally {
      setToDelete(null);
    }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    return users.filter((u) => {
      const matchSearch =
        !q ||
        u.fullName?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.phone?.toLowerCase().includes(q);

      const matchFilter =
        filter === "All" ||
        (filter === "Admin" && u.role === "admin") ||
        (filter === "User" &&
          u.role !== "admin" &&
          !u.suspended) ||
        (filter === "Suspended" && u.suspended);

      return matchSearch && matchFilter;
    });
  }, [users, search, filter]);

  /* ================= STATS ================= */

  const total = users.length;

  const admins = users.filter(
    (u) => u.role === "admin"
  ).length;

  const suspended = users.filter(
    (u) => u.suspended
  ).length;

  const newThisWeek = users.filter((u) => {
    if (!u.createdAt) return false;

    const diff =
      (Date.now() - new Date(u.createdAt)) /
      86400000;

    return diff <= 7;
  }).length;

  return (
    <div className="space-y-7 text-gray-900">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

        <div>
          <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.3em] text-gray-400">
            Administration
          </p>

          <h1 className="font-serif text-4xl tracking-tight sm:text-5xl">
            All <em className="font-light">Users</em>
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {total} registered account
            {total !== 1 ? "s" : ""}
          </p>
        </div>

        <button
          onClick={fetchUsers}
          className="flex w-fit items-center gap-2 rounded border border-gray-300 bg-white px-4 py-2.5 text-xs uppercase tracking-[0.15em] transition hover:border-gray-900 hover:bg-gray-900 hover:text-white"
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

      {/* ================================================= */}
      {/* STATS */}
      {/* ================================================= */}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded border border-gray-200 bg-[#fffdf2] p-5">
          <div className="flex items-start justify-between">
            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
              Total Users
            </span>

            <span className="text-xs text-gray-400">
              01
            </span>
          </div>

          <div className="mt-5 font-serif text-3xl">
            {total}
          </div>
        </div>

        <div className="rounded border border-gray-200 bg-[#fffdf2] p-5">
          <div className="flex items-start justify-between">
            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
              Administrators
            </span>

            <span className="text-xs text-gray-400">
              02
            </span>
          </div>

          <div className="mt-5 font-serif text-3xl">
            {admins}
          </div>
        </div>

        <div className="rounded border border-gray-200 bg-[#fffdf2] p-5">
          <div className="flex items-start justify-between">
            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
              New This Week
            </span>

            <span className="text-xs text-gray-400">
              03
            </span>
          </div>

          <div className="mt-5 font-serif text-3xl text-green-700">
            {newThisWeek}
          </div>
        </div>

        <div className="rounded border border-gray-200 bg-[#fffdf2] p-5">
          <div className="flex items-start justify-between">
            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
              Suspended
            </span>

            <span className="text-xs text-gray-400">
              04
            </span>
          </div>

          <div className="mt-5 font-serif text-3xl text-red-600">
            {suspended}
          </div>
        </div>

      </div>

      {/* ================================================= */}
      {/* TOOLBAR */}
      {/* ================================================= */}

      <div className="flex flex-col gap-4 rounded border border-gray-200 bg-[#fffdf2] p-4 lg:flex-row lg:items-center lg:justify-between">

        {/* Search */}

        <div className="relative w-full lg:max-w-sm">

          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
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

          <input
            className="w-full rounded border border-gray-300 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-gray-900"
            placeholder="Search by name, email, phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        {/* Filters */}

        <div className="flex flex-wrap gap-2">

          {ROLE_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded px-4 py-2 text-xs uppercase tracking-[0.12em] transition ${
                filter === f
                  ? "bg-gray-900 text-white"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-gray-900 hover:text-gray-900"
              }`}
            >
              {f}
            </button>
          ))}

        </div>

      </div>

      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      <div className="overflow-hidden rounded border border-gray-200 bg-white">

        {error ? (

          <div className="flex min-h-[300px] items-center justify-center p-8">
            <div className="rounded border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
              {error}
            </div>
          </div>

        ) : loading ? (

          <div>
            <div className="hidden border-b border-gray-200 bg-[#fafaf8] px-5 py-4 lg:grid lg:grid-cols-[40px_1fr_100px_100px_140px] lg:gap-4">
              <span />
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
                User
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
                Role
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
                Joined
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
                Actions
              </span>
            </div>

            <SkeletonRows />
          </div>

        ) : filtered.length === 0 ? (

          <div className="flex min-h-[350px] flex-col items-center justify-center text-center">

            <div className="mb-5 rounded-full bg-[#faf7e8] p-5 text-gray-400">

              <svg
                width="38"
                height="38"
                viewBox="0 0 40 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="16" cy="14" r="7" />
                <path d="M4 36c0-7 5-12 12-12s12 5 12 12" />
                <path d="M28 8a7 7 0 010 14M36 36c0-5-3-9-8-11" />
              </svg>

            </div>

            <div className="font-serif text-2xl">
              No users found
            </div>

            <p className="mt-2 text-sm text-gray-400">
              Try adjusting your search or filter.
            </p>

          </div>

        ) : (

          <>
            {/* Desktop table */}

            <div className="hidden overflow-x-auto md:block">

              <table className="w-full text-left">

                <thead className="border-b border-gray-200 bg-[#fafaf8]">

                  <tr>

                    <th className="px-5 py-4 text-[10px] font-medium uppercase tracking-[0.2em] text-gray-400">
                      User
                    </th>

                    <th className="px-5 py-4 text-[10px] font-medium uppercase tracking-[0.2em] text-gray-400">
                      Role
                    </th>

                    <th className="px-5 py-4 text-[10px] font-medium uppercase tracking-[0.2em] text-gray-400">
                      Joined
                    </th>

                    <th className="px-5 py-4 text-[10px] font-medium uppercase tracking-[0.2em] text-gray-400">
                      Bookings
                    </th>

                    <th className="px-5 py-4 text-[10px] font-medium uppercase tracking-[0.2em] text-gray-400">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filtered.map((u) => {

                    const initial =
                      u.fullName?.[0] ??
                      u.email?.[0] ??
                      "?";

                    const isAdmin =
                      u.role === "admin";

                    const isSuspended =
                      u.suspended === true;

                    return (
                      <tr
                        key={u._id}
                        className="border-b border-gray-100 transition hover:bg-[#fffdf5]"
                      >

                        {/* USER */}

                        <td className="px-5 py-5">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f4f0db] font-serif text-lg">
                              {initial.toUpperCase()}
                            </div>

                            <div className="min-w-0">

                              <div className="flex items-center gap-2 font-medium">

                                <span className="truncate">
                                  {u.fullName ?? "—"}
                                </span>

                                {isSuspended && (
                                  <span className="rounded bg-red-50 px-2 py-0.5 text-[9px] uppercase tracking-wider text-red-600">
                                    Suspended
                                  </span>
                                )}

                              </div>

                              <div className="mt-1 truncate text-xs text-gray-400">
                                {u.email}
                              </div>

                            </div>

                          </div>

                        </td>

                        {/* ROLE */}

                        <td className="px-5 py-5">

                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] uppercase tracking-wider ${
                              isAdmin
                                ? "bg-green-50 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >

                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                isAdmin
                                  ? "bg-green-600"
                                  : "bg-gray-400"
                              }`}
                            />

                            {isAdmin ? "Admin" : "User"}

                          </span>

                        </td>

                        {/* JOINED */}

                        <td className="px-5 py-5 text-sm text-gray-500">
                          {formatDate(u.createdAt)}
                        </td>

                        {/* BOOKINGS */}

                        <td className="px-5 py-5">

                          <span className="font-medium">
                            {u.bookingsCount ??
                              u.bookings?.length ??
                              0}
                          </span>

                        </td>

                        {/* ACTIONS */}

                        <td className="px-5 py-5">

                          <div className="flex items-center gap-1">

                            {!isAdmin ? (
                              <button
                                onClick={() =>
                                  handlePromote(u)
                                }
                                className="rounded px-2.5 py-1.5 text-[10px] uppercase tracking-wider text-green-700 hover:bg-green-50"
                              >
                                Promote
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  handleDemote(u)
                                }
                                className="rounded px-2.5 py-1.5 text-[10px] uppercase tracking-wider text-gray-500 hover:bg-gray-100"
                              >
                                Demote
                              </button>
                            )}

                            <button
                              onClick={() =>
                                handleSuspend(u)
                              }
                              className={`rounded px-2.5 py-1.5 text-[10px] uppercase tracking-wider ${
                                isSuspended
                                  ? "text-green-700 hover:bg-green-50"
                                  : "text-orange-600 hover:bg-orange-50"
                              }`}
                            >
                              {isSuspended
                                ? "Reinstate"
                                : "Suspend"}
                            </button>

                            <button
                              onClick={() =>
                                setToDelete(u)
                              }
                              className="rounded p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                              aria-label="Delete user"
                            >
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 11 11"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M1.5 3h8M4 3V2h3v1M9 3l-.5 7h-5L3 3" />
                              </svg>
                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>

            {/* ================================================= */}
            {/* MOBILE CARDS */}
            {/* ================================================= */}

            <div className="divide-y divide-gray-100 md:hidden">

              {filtered.map((u) => {

                const initial =
                  u.fullName?.[0] ??
                  u.email?.[0] ??
                  "?";

                const isAdmin =
                  u.role === "admin";

                const isSuspended =
                  u.suspended === true;

                return (
                  <div
                    key={u._id}
                    className="p-5"
                  >

                    <div className="flex items-start gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f4f0db] font-serif text-lg">
                        {initial.toUpperCase()}
                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="font-medium">
                          {u.fullName ?? "—"}
                        </div>

                        <div className="mt-1 truncate text-xs text-gray-400">
                          {u.email}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">

                          <span
                            className={`rounded-full px-3 py-1 text-[9px] uppercase tracking-wider ${
                              isAdmin
                                ? "bg-green-50 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {isAdmin ? "Admin" : "User"}
                          </span>

                          {isSuspended && (
                            <span className="rounded-full bg-red-50 px-3 py-1 text-[9px] uppercase tracking-wider text-red-600">
                              Suspended
                            </span>
                          )}

                        </div>

                      </div>

                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4">

                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-gray-400">
                          Joined
                        </p>

                        <p className="mt-1 text-sm">
                          {formatDate(u.createdAt)}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-gray-400">
                          Bookings
                        </p>

                        <p className="mt-1 text-sm">
                          {u.bookingsCount ??
                            u.bookings?.length ??
                            0}
                        </p>
                      </div>

                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">

                      {!isAdmin ? (
                        <button
                          onClick={() =>
                            handlePromote(u)
                          }
                          className="rounded border border-green-200 px-3 py-2 text-[10px] uppercase tracking-wider text-green-700"
                        >
                          Promote
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            handleDemote(u)
                          }
                          className="rounded border border-gray-200 px-3 py-2 text-[10px] uppercase tracking-wider text-gray-600"
                        >
                          Demote
                        </button>
                      )}

                      <button
                        onClick={() =>
                          handleSuspend(u)
                        }
                        className="rounded border border-orange-200 px-3 py-2 text-[10px] uppercase tracking-wider text-orange-600"
                      >
                        {isSuspended
                          ? "Reinstate"
                          : "Suspend"}
                      </button>

                      <button
                        onClick={() =>
                          setToDelete(u)
                        }
                        className="rounded border border-red-200 px-3 py-2 text-[10px] uppercase tracking-wider text-red-600"
                      >
                        Delete
                      </button>

                    </div>

                  </div>
                );
              })}

            </div>

          </>
        )}

        {!loading &&
          !error &&
          filtered.length > 0 && (
            <div className="border-t border-gray-200 bg-[#fafaf8] px-5 py-3 text-[10px] uppercase tracking-[0.15em] text-gray-400">
              Showing {filtered.length} of {total} user
              {total !== 1 ? "s" : ""}
            </div>
          )}

      </div>

      {/* ================================================= */}
      {/* DELETE MODAL */}
      {/* ================================================= */}

      {toDelete && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5 backdrop-blur-sm"
          onClick={() => setToDelete(null)}
        >

          <div
            className="w-full max-w-md rounded border border-gray-200 bg-[#fffdf2] p-7 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 font-serif text-xl text-red-600">
              {toDelete.fullName?.[0] ??
                toDelete.email?.[0] ??
                "?"}
            </div>

            <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400">
              User Management
            </p>

            <h2 className="mt-2 font-serif text-3xl">
              Delete <em>User</em>
            </h2>

            <p className="mt-4 text-sm leading-6 text-gray-500">
              Are you sure you want to permanently delete{" "}
              <strong className="font-medium text-gray-900">
                {toDelete.fullName ??
                  toDelete.email}
              </strong>
              ? All their data and bookings will be lost.
            </p>

            <div className="mt-7 flex justify-end gap-3">

              <button
                onClick={() =>
                  setToDelete(null)
                }
                className="rounded border border-gray-300 px-4 py-2.5 text-xs uppercase tracking-wider hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="rounded bg-red-600 px-4 py-2.5 text-xs uppercase tracking-wider text-white hover:bg-red-700"
              >
                Delete User
              </button>

            </div>

          </div>

        </div>

      )}

      {/* ================================================= */}
      {/* TOAST */}
      {/* ================================================= */}

      {toast && (

        <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-3 rounded bg-gray-900 px-4 py-3 text-xs text-white shadow-xl">

          <svg
            width="13"
            height="13"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          >
            <circle cx="6" cy="6" r="5" />
            <path d="M4 6l1.5 1.5L8 4" />
          </svg>

          {toast}

        </div>

      )}

    </div>
  );
}