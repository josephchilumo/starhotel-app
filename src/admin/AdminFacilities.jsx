import React, { useEffect, useState, useMemo } from "react";
import API from "../utils/axios";

const CATEGORIES = [
  "All",
  "Leisure",
  "Wellness",
  "Dining",
  "Business",
  "Transport",
  "In-Room",
];

const FACILITY_CATS = CATEGORIES.slice(1);

const BLANK = {
  name: "",
  description: "",
  category: "Leisure",
  available: true,
  imageUrl: "",
};

/* ───────────────── ICONS ───────────────── */

const ICONS = {
  pool: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <path d="M2 8c2-2 4-2 6 0s4 2 6 0" />
      <path d="M2 12c2-2 4-2 6 0s4 2 6 0" />
      <circle cx="8" cy="4" r="1.5" />
      <path d="M8 5.5v2" />
    </svg>
  ),

  spa: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <path d="M8 14c3-3 5-6 5-9A5 5 0 0 0 3 5c0 3 2 6 5 9z" />
    </svg>
  ),

  gym: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <path d="M5 4v8M11 4v8M3 6h4m2 0h4M3 10h4m2 0h4" />
    </svg>
  ),

  wifi: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <path d="M4 9a5 5 0 018 0" />
      <path d="M2 7a8 8 0 0112 0" />
      <circle cx="8" cy="12" r="1" fill="currentColor" />
    </svg>
  ),

  default: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <circle cx="8" cy="8" r="1.5" />
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.5 3.5l1.4 1.4M11.1 11.1l1.4 1.4M11.1 4.9l1.4-1.4M3.5 12.5l1.4-1.4" />
    </svg>
  ),
};

const getIcon = (name = "") => {
  const n = name.toLowerCase();

  if (n.includes("pool") || n.includes("swim")) return ICONS.pool;
  if (n.includes("spa") || n.includes("wellness")) return ICONS.spa;
  if (n.includes("gym") || n.includes("fitness")) return ICONS.gym;
  if (n.includes("wifi") || n.includes("internet")) return ICONS.wifi;

  return ICONS.default;
};

/* ───────────────── SKELETON ───────────────── */

function SkeletonRows() {
  return (
    <div className="divide-y divide-gray-200">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-5 py-5 animate-pulse"
        >
          <div className="h-10 w-10 rounded bg-gray-200" />

          <div className="flex-1 space-y-2">
            <div className="h-4 w-40 rounded bg-gray-200" />
            <div className="h-3 w-64 rounded bg-gray-100" />
          </div>

          <div className="h-6 w-20 rounded-full bg-gray-200" />
          <div className="h-6 w-20 rounded-full bg-gray-200" />
        </div>
      ))}
    </div>
  );
}

/* ───────────────── COMPONENT ───────────────── */

export default function AdminFacilities() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [editId, setEditId] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [image, setImage] = useState(null);

  /* ───────────────── FETCH ───────────────── */

  const fetchFacilities = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await API.get("/facilities");

      const raw = res.data;

      const list = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.facilities)
        ? raw.facilities
        : Array.isArray(raw?.data)
        ? raw.data
        : [];

      setFacilities(list);
    } catch {
      setError("Could not load facilities.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  /* ───────────────── TOAST ───────────────── */

  const showToast = (msg) => {
    setToast(msg);

    setTimeout(() => {
      setToast("");
    }, 3000);
  };

  /* ───────────────── MODALS ───────────────── */

  const openAdd = () => {
    setForm(BLANK);
    setImage(null);
    setEditId(null);
    setModal("add");
  };

  const openEdit = (facility) => {
    setForm({
      name: facility.name,
      description: facility.description ?? "",
      category: facility.category ?? "Leisure",
      available: facility.available !== false,
      imageUrl: facility.imageUrl ?? "",
    });
    setImage(null);

    setEditId(facility._id);
    setModal("edit");
  };

  const closeModal = () => {
    setModal(null);
    setForm(BLANK);
    setImage(null);
    setEditId(null);
  };

  /* ───────────────── SAVE ───────────────── */

  const handleSave = async () => {
    if (!form.name.trim()) return;

    setSaving(true);

    try {
      let imageUrl = form.imageUrl;
      if (image) {
        const data = new FormData();
        data.append("images", image);
        data.append("category", "amenities");
        const uploadResponse = await API.post("/gallery/upload", data);
        imageUrl = uploadResponse.data[0]?.imageUrl || imageUrl;
      }
      const payload = { ...form, imageUrl };
      if (modal === "add") {
        const res = await API.post("/facilities", payload);

        setFacilities((prev) => [...prev, res.data]);

        showToast("Facility added successfully");
      } else {
        const res = await API.put(
          `/facilities/${editId}`,
          payload
        );

        setFacilities((prev) =>
          prev.map((facility) =>
            facility._id === editId ? res.data : facility
          )
        );

        showToast("Facility updated successfully");
      }

      closeModal();
    } catch {
      showToast("Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  /* ───────────────── TOGGLE ───────────────── */

  const handleToggle = async (facility) => {
    const updated = {
      ...facility,
      available: !facility.available,
    };

    try {
      await API.put(`/facilities/${facility._id}`, {
        available: updated.available,
      });

      setFacilities((prev) =>
        prev.map((f) =>
          f._id === facility._id ? updated : f
        )
      );

      showToast(
        updated.available
          ? "Facility marked available"
          : "Facility marked unavailable"
      );
    } catch {
      showToast("Toggle failed.");
    }
  };

  /* ───────────────── DELETE ───────────────── */

  const handleDelete = async () => {
    if (!toDelete) return;

    try {
      await API.delete(`/facilities/${toDelete._id}`);

      setFacilities((prev) =>
        prev.filter((f) => f._id !== toDelete._id)
      );

      showToast("Facility deleted");
    } catch {
      showToast("Delete failed.");
    } finally {
      setToDelete(null);
    }
  };

  /* ───────────────── FILTER ───────────────── */

  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    return facilities.filter((facility) => {
      const matchSearch =
        !q ||
        facility.name?.toLowerCase().includes(q) ||
        facility.description?.toLowerCase().includes(q);

      const matchFilter =
        filter === "All" ||
        facility.category === filter;

      return matchSearch && matchFilter;
    });
  }, [facilities, search, filter]);

  /* ───────────────── STATS ───────────────── */

  const total = facilities.length;

  const available = facilities.filter(
    (f) => f.available !== false
  ).length;

  const unavailable = total - available;

  const catCounts = FACILITY_CATS.reduce(
    (acc, category) => {
      acc[category] = facilities.filter(
        (f) => f.category === category
      ).length;

      return acc;
    },
    {}
  );

  const topCat =
    Object.entries(catCounts).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] ?? "—";

  /* ───────────────── UI ───────────────── */

  return (
    <div className="min-h-screen bg-[#f7f4ea] text-gray-900">

      {/* HEADER */}
      <div className="border-b border-gray-900/10 bg-[#f4f0db]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-7">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-2">
                Hotel Management
              </p>

              <h1 className="text-2xl sm:text-3xl font-light tracking-tight">
                All <em className="font-serif">Facilities</em>
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                {total} facilit{total !== 1 ? "ies" : "y"} listed
              </p>
            </div>

            <button
              onClick={openAdd}
              className="inline-flex items-center justify-center gap-2 rounded bg-gray-900 px-5 py-3 text-xs uppercase tracking-[0.15em] text-white hover:bg-gray-700 transition"
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

              Add Facility
            </button>

          </div>
        </div>
      </div>

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-7">

        {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-7">

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
              Total
            </p>

            <p className="mt-2 text-2xl font-light">
              {total}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
              Available
            </p>

            <p className="mt-2 text-2xl font-light text-green-700">
              {available}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
              Unavailable
            </p>

            <p className="mt-2 text-2xl font-light text-gray-500">
              {unavailable}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
              Top Category
            </p>

            <p className="mt-2 text-lg font-light truncate">
              {topCat}
            </p>
          </div>

        </div>

        {/* TOOLBAR */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-5">

          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">

            {/* SEARCH */}
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
                className="w-full rounded border border-gray-200 bg-[#faf9f4] pl-9 pr-3 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                placeholder="Search facilities..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

            </div>

            {/* FILTERS */}
            <div className="flex gap-1 overflow-x-auto pb-1">

              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`whitespace-nowrap rounded px-3 py-2 text-[10px] uppercase tracking-[0.12em] transition ${
                    filter === category
                      ? "bg-gray-900 text-white"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {category}
                </button>
              ))}

            </div>

          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">

          {error ? (
            <div className="px-6 py-16 text-center">
              <p className="text-sm text-red-600">
                {error}
              </p>
            </div>
          ) : loading ? (
            <SkeletonRows />
          ) : filtered.length === 0 ? (
            <div className="px-6 py-20 text-center">

              <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                {ICONS.default}
              </div>

              <p className="text-sm text-gray-600">
                No facilities found
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Try changing your search or category.
              </p>

            </div>
          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[700px]">

                <thead>
                  <tr className="border-b border-gray-200 bg-[#faf9f4]">

                    <th className="text-left px-5 py-3 text-[10px] uppercase tracking-[0.2em] font-medium text-gray-400">
                      Facility
                    </th>

                    <th className="text-left px-5 py-3 text-[10px] uppercase tracking-[0.2em] font-medium text-gray-400">
                      Category
                    </th>

                    <th className="text-left px-5 py-3 text-[10px] uppercase tracking-[0.2em] font-medium text-gray-400">
                      Status
                    </th>

                    <th className="text-right px-5 py-3 text-[10px] uppercase tracking-[0.2em] font-medium text-gray-400">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">

                  {filtered.map((facility) => (

                    <tr
                      key={facility._id}
                      className="hover:bg-[#faf9f4] transition"
                    >

                      {/* FACILITY */}
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-4">

                          <div className="w-10 h-10 rounded-lg bg-[#f4f0db] flex items-center justify-center text-gray-700">
                            {facility.imageUrl ? <img src={facility.imageUrl} alt="" className="h-full w-full rounded-lg object-cover" /> : <div className="w-4 h-4">{getIcon(facility.name)}</div>}
                          </div>

                          <div className="min-w-0">

                            <p className="text-sm font-medium truncate">
                              {facility.name}
                            </p>

                            {facility.description && (
                              <p className="text-xs text-gray-400 mt-1 max-w-md truncate">
                                {facility.description}
                              </p>
                            )}

                          </div>

                        </div>

                      </td>

                      {/* CATEGORY */}
                      <td className="px-5 py-4">

                        <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-[10px] uppercase tracking-[0.1em] text-gray-500">
                          {facility.category ?? "—"}
                        </span>

                      </td>

                      {/* STATUS */}
                      <td className="px-5 py-4">

                        <button
                          onClick={() => handleToggle(facility)}
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.1em] ${
                            facility.available !== false
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >

                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              facility.available !== false
                                ? "bg-green-600"
                                : "bg-gray-400"
                            }`}
                          />

                          {facility.available !== false
                            ? "Available"
                            : "Unavailable"}

                        </button>

                      </td>

                      {/* ACTIONS */}
                      <td className="px-5 py-4">

                        <div className="flex justify-end gap-2">

                          <button
                            onClick={() => openEdit(facility)}
                            aria-label="Edit facility"
                            className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition"
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
                              <path d="M7.5 1.5l2 2-6 6H1.5v-2l6-6z" />
                            </svg>
                          </button>

                          <button
                            onClick={() => setToDelete(facility)}
                            aria-label="Delete facility"
                            className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-red-600 hover:text-white hover:border-red-600 transition"
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

                  ))}

                </tbody>

              </table>

            </div>

          )}

          {!loading &&
            !error &&
            filtered.length > 0 && (
              <div className="border-t border-gray-100 px-5 py-3 text-xs text-gray-400">
                Showing {filtered.length} of {total} facilit
                {total !== 1 ? "ies" : "y"}
              </div>
            )}

        </div>

      </main>

      {/* ───────────────── ADD / EDIT MODAL ───────────────── */}

      {modal && (

        <div
          onClick={closeModal}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
        >

          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-xl bg-[#faf9f4] shadow-2xl overflow-hidden"
          >

            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">

              <div>

                <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 mb-1">
                  Facility Management
                </p>

                <h2 className="text-xl font-light">
                  {modal === "add" ? (
                    <>
                      Add <em className="font-serif">Facility</em>
                    </>
                  ) : (
                    <>
                      Edit <em className="font-serif">Facility</em>
                    </>
                  )}
                </h2>

              </div>

              <button
                onClick={closeModal}
                className="w-8 h-8 rounded border border-gray-200 text-gray-500 hover:bg-gray-900 hover:text-white transition"
              >
                ×
              </button>

            </div>

            {/* FORM */}
            <div className="p-6 space-y-5">

              <div>
                <label className="block mb-2 text-[10px] uppercase tracking-[0.18em] text-gray-500">
                  Facility Name
                </label>

                <input
                  className="w-full rounded border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                  placeholder="e.g. Infinity Pool"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      name: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label className="block mb-2 text-[10px] uppercase tracking-[0.18em] text-gray-500">
                  Description
                </label>

                <textarea
                  className="w-full rounded border border-gray-200 bg-white px-3 py-3 text-sm outline-none resize-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                  placeholder="Brief description..."
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      description: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                <div>
                  <label className="block mb-2 text-[10px] uppercase tracking-[0.18em] text-gray-500">
                    Category
                  </label>

                  <select
                    className="w-full rounded border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                    value={form.category}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        category: e.target.value,
                      }))
                    }
                  >
                    {FACILITY_CATS.map((category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>

                  <label className="block mb-2 text-[10px] uppercase tracking-[0.18em] text-gray-500">
                    Availability
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      setForm((p) => ({
                        ...p,
                        available: !p.available,
                      }))
                    }
                    className="flex items-center gap-3 h-[46px]"
                  >

                    <span
                      className={`relative w-10 h-5 rounded-full transition ${
                        form.available
                          ? "bg-green-600"
                          : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition ${
                          form.available
                            ? "left-5"
                            : "left-0.5"
                        }`}
                      />
                    </span>

                    <span className="text-sm text-gray-600">
                      {form.available
                        ? "Available"
                        : "Unavailable"}
                    </span>

                  </button>

                </div>

              </div>

              <div>
                <label className="block mb-2 text-[10px] uppercase tracking-[0.18em] text-gray-500">
                  Facility Image
                </label>
                <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="w-full rounded border border-gray-200 bg-white px-3 py-3 text-sm" />
                {form.imageUrl && !image && <img src={form.imageUrl} alt="Current facility" className="mt-3 h-24 w-36 rounded object-cover" />}
              </div>

            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-3 px-6 py-5 border-t border-gray-200">

              <button
                onClick={closeModal}
                className="px-4 py-2.5 text-xs uppercase tracking-[0.12em] text-gray-500 hover:text-gray-900 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={saving || !form.name.trim()}
                className="rounded bg-gray-900 px-5 py-2.5 text-xs uppercase tracking-[0.12em] text-white hover:bg-gray-700 disabled:opacity-40 transition"
              >
                {saving
                  ? "Saving..."
                  : modal === "add"
                  ? "Add Facility"
                  : "Save Changes"}
              </button>

            </div>

          </div>

        </div>

      )}

      {/* ───────────────── DELETE MODAL ───────────────── */}

      {toDelete && (

        <div
          onClick={() => setToDelete(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
        >

          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-xl bg-[#faf9f4] shadow-2xl p-6"
          >

            <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-5">
              !
            </div>

            <h2 className="text-xl font-light">
              Delete Facility
            </h2>

            <p className="mt-3 text-sm text-gray-500 leading-relaxed">
              Are you sure you want to delete{" "}
              <strong className="text-gray-900">
                {toDelete.name}
              </strong>
              ? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 mt-7">

              <button
                onClick={() => setToDelete(null)}
                className="px-4 py-2.5 text-xs uppercase tracking-[0.12em] text-gray-500 hover:text-gray-900"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="rounded bg-red-600 px-5 py-2.5 text-xs uppercase tracking-[0.12em] text-white hover:bg-red-700 transition"
              >
                Delete
              </button>

            </div>

          </div>

        </div>

      )}

      {/* ───────────────── TOAST ───────────────── */}

      {toast && (

        <div className="fixed bottom-6 right-6 z-[200] flex items-center gap-3 rounded-lg bg-gray-900 px-4 py-3 text-xs text-white shadow-xl">

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