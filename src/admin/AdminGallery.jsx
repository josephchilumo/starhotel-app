import React, { useEffect, useState, useRef } from "react";
import API from "../utils/axios";

function normalise(raw) {
  return {
    _id:
      raw._id ??
      raw.id ??
      Math.random().toString(36).slice(2),

    src:
      raw.url ??
      raw.src ??
      raw.image ??
      raw.imageUrl ??
      "",

    title:
      raw.title ??
      raw.name ??
      raw.caption ??
      "",

    description: raw.description ?? raw.caption ?? "",

    cat:
      raw.category ??
      raw.cat ??
      raw.type ??
      "General",
  };
}

/* ───────────────── SKELETON ───────────────── */

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-lg border border-gray-200 bg-white animate-pulse"
        >
          <div className="h-56 bg-gray-200" />

          <div className="p-4 space-y-2">
            <div className="h-3 w-28 rounded bg-gray-200" />
            <div className="h-3 w-20 rounded bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ───────────────── COMPONENT ───────────────── */

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [dragging, setDragging] = useState(false);
  const [toast, setToast] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryForUpload, setCategoryForUpload] = useState("rooms");

  const fileRef = useRef(null);

  /* ───────────────── FETCH ───────────────── */

  const fetchImages = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await API.get("/gallery");

      const raw = res.data;

      const list = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.images)
        ? raw.images
        : Array.isArray(raw?.gallery)
        ? raw.gallery
        : Array.isArray(raw?.data)
        ? raw.data
        : [];

      setImages(list.map(normalise));
    } catch {
      setError("Could not load gallery images.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  /* ───────────────── TOAST ───────────────── */

  const showToast = (msg) => {
    setToast(msg);

    setTimeout(() => {
      setToast("");
    }, 3000);
  };

  /* ───────────────── UPLOAD ───────────────── */

  const handleUpload = async (files) => {
    if (!files?.length) return;

    setUploading(true);

    try {
      const formData = new FormData();

      Array.from(files).forEach((file) => {
        formData.append("images", file);
      });
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", categoryForUpload);

      await API.post("/gallery/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await fetchImages();

      showToast(
        `${files.length} image${
          files.length > 1 ? "s" : ""
        } uploaded successfully`
      );
      setTitle("");
      setDescription("");
    } catch {
      showToast("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  /* ───────────────── DELETE ───────────────── */

  const handleDelete = async () => {
    if (!toDelete) return;

    try {
      await API.delete(`/gallery/${toDelete._id}`);

      setImages((prev) =>
        prev.filter(
          (img) => img._id !== toDelete._id
        )
      );

      showToast("Image deleted");
    } catch {
      showToast("Delete failed.");
    } finally {
      setToDelete(null);
    }
  };

  /* ───────────────── CATEGORIES ───────────────── */

  const categories = [
    "All",
    ...Array.from(
      new Set(images.map((img) => img.cat))
    )
      .filter(Boolean)
      .sort(),
  ];

  /* ───────────────── FILTER ───────────────── */

  const filtered = images.filter((img) => {
    const query = search.toLowerCase();

    const matchSearch =
      !query ||
      img.title?.toLowerCase().includes(query);

    const matchCategory =
      category === "All" ||
      img.cat === category;

    return matchSearch && matchCategory;
  });

  /* ───────────────── STATS ───────────────── */

  const topCategories = categories
    .slice(1)
    .map((cat) => ({
      cat,
      count: images.filter(
        (img) => img.cat === cat
      ).length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  /* Reset category if it disappears */

  useEffect(() => {
    if (
      category !== "All" &&
      !categories.includes(category)
    ) {
      setCategory("All");
    }
  }, [images]);

  /* ───────────────── DRAG & DROP ───────────────── */

  const onDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const onDragLeave = () => {
    setDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    handleUpload(e.dataTransfer.files);
  };

  /* ───────────────── UI ───────────────── */

  return (
    <div className="min-h-screen bg-[#f7f4ea] text-gray-900">

      {/* HEADER */}
      <div className="border-b border-gray-900/10 bg-[#f4f0db]">

        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-7">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

            <div>

              <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-gray-500">
                Hotel Management
              </p>

              <h1 className="text-2xl sm:text-3xl font-light tracking-tight">
                Gallery{" "}
                <em className="font-serif">
                  Manager
                </em>
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                {images.length} image
                {images.length !== 1 ? "s" : ""} in
                collection
              </p>

            </div>

            <button
              onClick={fetchImages}
              className="inline-flex items-center justify-center gap-2 rounded border border-gray-300 bg-white px-5 py-3 text-xs uppercase tracking-[0.15em] hover:border-gray-900 hover:bg-gray-900 hover:text-white transition"
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

        </div>

      </div>

      {/* CONTENT */}

      <main className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-7">

        {/* STATS */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-7">

          <div className="rounded-lg border border-gray-200 bg-white p-5">

            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
              Total Images
            </p>

            <p className="mt-2 text-2xl font-light">
              {images.length}
            </p>

          </div>

          {topCategories.map(
            ({ cat, count }) => (
              <div
                key={cat}
                className="rounded-lg border border-gray-200 bg-white p-5"
              >

                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 truncate">
                  {cat}
                </p>

                <p className="mt-2 text-2xl font-light">
                  {count}
                </p>

              </div>
            )
          )}

          {Array.from({
            length: Math.max(
              0,
              3 - topCategories.length
            ),
          }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="rounded-lg border border-gray-200 bg-white p-5"
            >

              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
                —
              </p>

              <p className="mt-2 text-2xl font-light text-gray-300">
                0
              </p>

            </div>
          ))}

        </div>

        {/* UPLOAD */}

        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() =>
            fileRef.current?.click()
          }
          className={`mb-7 cursor-pointer rounded-lg border-2 border-dashed p-8 sm:p-12 text-center transition ${
            dragging
              ? "border-gray-900 bg-[#f4f0db]"
              : "border-gray-300 bg-white hover:border-gray-500"
          }`}
        >

          <div className="mx-auto mb-6 grid max-w-2xl gap-3 text-left sm:grid-cols-2" onClick={(e) => e.stopPropagation()}>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Image title" className="rounded border border-gray-300 bg-white px-3 py-2.5 text-sm" />
            <select value={categoryForUpload} onChange={(e) => setCategoryForUpload(e.target.value)} className="rounded border border-gray-300 bg-white px-3 py-2.5 text-sm">
              <option value="rooms">Rooms</option><option value="exterior">Exterior</option><option value="events">Events</option><option value="amenities">Amenities</option>
            </select>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Image description" rows="3" className="rounded border border-gray-300 bg-white px-3 py-2.5 text-sm sm:col-span-2" />
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) =>
              handleUpload(e.target.files)
            }
          />

          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f4f0db] text-gray-600">

            <svg
              width="26"
              height="26"
              viewBox="0 0 36 36"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect
                x="2"
                y="2"
                width="32"
                height="32"
                rx="2"
              />

              <path d="M2 24l8-8 6 6 4-4 8 8" />

              <circle
                cx="12"
                cy="12"
                r="3"
              />
            </svg>

          </div>

          <p className="text-sm font-medium">
            {dragging
              ? "Drop images to upload"
              : "Drop images here to upload"}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            PNG, JPG, WEBP · Multiple files
            supported
          </p>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileRef.current?.click();
            }}
            className="mt-5 rounded bg-gray-900 px-5 py-2.5 text-xs uppercase tracking-[0.15em] text-white hover:bg-gray-700 transition"
          >
            Choose Files
          </button>

        </div>

        {/* UPLOAD PROGRESS */}

        {uploading && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-5 py-4 text-sm text-gray-600">

            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />

            Uploading images...

          </div>
        )}

        {/* TOOLBAR */}

        <div className="mb-5 rounded-lg border border-gray-200 bg-white p-4">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

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
                <circle
                  cx="5.5"
                  cy="5.5"
                  r="4.5"
                />

                <path d="M9.5 9.5l2.5 2.5" />
              </svg>

              <input
                className="w-full rounded border border-gray-200 bg-[#faf9f4] py-2.5 pl-9 pr-3 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                placeholder="Search images..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

            {/* CATEGORIES */}

            <div className="flex gap-1 overflow-x-auto pb-1">

              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() =>
                    setCategory(cat)
                  }
                  className={`whitespace-nowrap rounded px-3 py-2 text-[10px] uppercase tracking-[0.12em] transition ${
                    category === cat
                      ? "bg-gray-900 text-white"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {cat}
                </button>
              ))}

            </div>

          </div>

        </div>

        {/* GALLERY */}

        {error ? (

          <div className="rounded-lg border border-red-200 bg-red-50 px-6 py-16 text-center">

            <p className="text-sm text-red-600">
              {error}
            </p>

          </div>

        ) : loading ? (

          <SkeletonGrid />

        ) : filtered.length === 0 ? (

          <div className="rounded-lg border border-gray-200 bg-white px-6 py-20 text-center">

            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">

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
                <rect
                  x="3"
                  y="3"
                  width="34"
                  height="34"
                  rx="2"
                />

                <path d="M3 28l10-10 8 8 5-5 11 11" />

                <circle
                  cx="13"
                  cy="13"
                  r="4"
                />
              </svg>

            </div>

            <p className="text-sm text-gray-600">
              No images found
            </p>

            <p className="mt-1 text-xs text-gray-400">
              {search || category !== "All"
                ? "Try adjusting your search or filter"
                : "Upload your first image above"}
            </p>

          </div>

        ) : (

          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

              {filtered.map((img) => (

                <div
                  key={img._id}
                  className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition"
                >

                  {/* IMAGE */}

                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">

                    <img
                      src={img.src}
                      alt={
                        img.title ||
                        "Gallery image"
                      }
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      onError={(e) => {
                        e.currentTarget.style.display =
                          "none";
                      }}
                    />

                    {/* DELETE */}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setToDelete(img);
                      }}
                      aria-label="Delete image"
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-600 opacity-0 shadow-sm transition group-hover:opacity-100 hover:bg-red-600 hover:text-white"
                    >

                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1.5 3h9M4 3V2h4v1M9.5 3l-.5 8h-6L2.5 3" />
                      </svg>

                    </button>

                  </div>

                  {/* DETAILS */}

                  <div className="flex items-center justify-between gap-3 px-4 py-4">

                    <div className="min-w-0">

                      {img.title && (
                        <p className="truncate text-sm font-medium">
                          {img.title}
                        </p>
                      )}

                      {!img.title && (
                        <p className="text-sm text-gray-400">
                          Untitled image
                        </p>
                      )}

                      {img.cat && (
                        <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-gray-400">
                          {img.cat}
                        </p>
                      )}

                    </div>

                    <span className="shrink-0 rounded-full bg-[#f4f0db] px-2.5 py-1 text-[9px] uppercase tracking-[0.1em] text-gray-600">
                      Image
                    </span>

                  </div>

                </div>

              ))}

            </div>

            {/* COUNT */}

            <div className="mt-5 border-t border-gray-200 pt-4 text-xs text-gray-400">

              Showing {filtered.length} of{" "}
              {images.length} image
              {images.length !== 1 ? "s" : ""}

            </div>

          </>

        )}

      </main>

      {/* DELETE MODAL */}

      {toDelete && (

        <div
          onClick={() =>
            setToDelete(null)
          }
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm"
        >

          <div
            onClick={(e) =>
              e.stopPropagation()
            }
            className="w-full max-w-md overflow-hidden rounded-xl bg-[#faf9f4] shadow-2xl"
          >

            {toDelete.src && (

              <div className="aspect-video overflow-hidden bg-gray-100">

                <img
                  src={toDelete.src}
                  alt="Image to delete"
                  className="h-full w-full object-cover"
                />

              </div>

            )}

            <div className="p-6">

              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600">
                !
              </div>

              <h2 className="text-xl font-light">
                Delete Image
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-gray-500">
                This image will be permanently
                removed from the gallery. This
                action cannot be undone.
              </p>

              <div className="mt-7 flex justify-end gap-3">

                <button
                  onClick={() =>
                    setToDelete(null)
                  }
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

        </div>

      )}

      {/* TOAST */}

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
            <circle
              cx="6"
              cy="6"
              r="5"
            />

            <path d="M4 6l1.5 1.5L8 4" />
          </svg>

          {toast}

        </div>

      )}

    </div>
  );
}