import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../utils/axios";

const HEIGHTS = [340, 480, 360, 440, 320, 420, 360, 400, 460, 380, 300, 500];

function normalise(raw, index) {
  return {
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
      `Photo ${index + 1}`,

    description: raw.description ?? raw.caption ?? "",

    cat:
      raw.category ??
      raw.cat ??
      raw.type ??
      "General",

    _id:
      raw._id ??
      raw.id ??
      String(index),

    h: HEIGHTS[index % HEIGHTS.length],
  };
}

const cellVariants = {
  hidden: {
    opacity: 0,
    y: 25,
  },

  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay: i * 0.06,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

function SkeletonGrid() {
  return (
    <div className="mx-auto mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
      {HEIGHTS.slice(0, 9).map((h, i) => (
        <div
          key={i}
          style={{ height: h }}
          className="mb-4 animate-pulse break-inside-avoid rounded bg-gray-200"
        />
      ))}
    </div>
  );
}

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);

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

  const categories = [
    "All",
    ...Array.from(
      new Set(images.map((img) => img.cat))
    )
      .filter(Boolean)
      .sort(),
  ];

  useEffect(() => {
    if (
      filter !== "All" &&
      !categories.includes(filter)
    ) {
      setFilter("All");
    }
  }, [images]);

  const filtered =
    filter === "All"
      ? images
      : images.filter((img) => img.cat === filter);

  const openLightbox = (index) => {
    setSelected(index);
  };

  const closeLightbox = () => {
    setSelected(null);
  };

  const prev = useCallback(() => {
    setSelected((current) => {
      if (current === null || filtered.length === 0) {
        return current;
      }

      return (
        (current - 1 + filtered.length) %
        filtered.length
      );
    });
  }, [filtered.length]);

  const next = useCallback(() => {
    setSelected((current) => {
      if (current === null || filtered.length === 0) {
        return current;
      }

      return (current + 1) % filtered.length;
    });
  }, [filtered.length]);

  useEffect(() => {
    if (selected === null) return;

    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") closeLightbox();
    };

    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [selected, prev, next]);

  return (
    <main className="min-h-screen bg-[#fafaf8] px-5 py-14 text-gray-900 sm:px-8">

      {/* HERO */}
      <motion.section
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75 }}
        className="mx-auto max-w-6xl"
      >
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">

          <div>
            

            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              Visual{" "}
              <em className="font-serif font-normal">
                Archive
              </em>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-gray-600">
              Explore the spaces, moments, and experiences
              that make StarHotel a destination worth
              remembering.
            </p>
          </div>

        </div>
      </motion.section>

      {/* FILTERS */}
      {!loading && !error && categories.length > 1 && (
        <div className="mx-auto mt-10 flex max-w-6xl flex-wrap gap-2 border-y border-gray-200 py-4">

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setFilter(cat);
                setSelected(null);
              }}
              className={`rounded px-4 py-2 text-xs uppercase tracking-[0.12em] transition-all duration-300 ${
                filter === cat
                  ? "bg-gray-900 text-white"
                  : "border border-gray-300 text-gray-700 hover:border-gray-900 hover:text-gray-900"
              }`}
            >
              {cat}
            </button>
          ))}

        </div>
      )}

      {/* LOADING */}
      {loading && <SkeletonGrid />}

      {/* ERROR */}
      {!loading && error && (
        <div className="mx-auto mt-12 max-w-xl rounded border border-red-200 bg-red-50 px-6 py-12 text-center">

          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-red-200 text-red-500">
            <svg
              width="28"
              height="28"
              viewBox="0 0 48 48"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            >
              <rect
                x="4"
                y="4"
                width="40"
                height="40"
                rx="3"
              />
              <path d="M24 14v12" />
              <circle cx="24" cy="33" r="1" fill="currentColor" />
            </svg>
          </div>

          <h2 className="text-lg font-semibold">
            Could not load gallery
          </h2>

          <p className="mt-2 text-sm text-red-600">
            Check your connection and try again.
          </p>

          <button
            onClick={fetchImages}
            className="mt-6 rounded bg-gray-900 px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-white transition hover:bg-gray-700"
          >
            Try Again
          </button>

        </div>
      )}

      {/* EMPTY */}
      {!loading && !error && filtered.length === 0 && (
        <div className="mx-auto mt-12 max-w-xl rounded border border-gray-200 bg-[#fffaf0] px-6 py-16 text-center">

          <div className="text-4xl text-gray-300">
            ◇
          </div>

          <h2 className="mt-4 text-lg font-semibold">
            No images found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            There are currently no images in this category.
          </p>

        </div>
      )}

      {/* MASONRY */}
      {!loading && !error && filtered.length > 0 && (
        <section className="mx-auto mt-10 max-w-6xl">

          <motion.div
            initial="hidden"
            animate="visible"
            className="columns-1 gap-4 sm:columns-2 lg:columns-3"
          >

            <AnimatePresence mode="popLayout">

              {filtered.map((img, i) => (
                <motion.article
                  key={img._id}
                  custom={i}
                  variants={cellVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{
                    opacity: 0,
                    scale: 0.95,
                  }}
                  onClick={() => openLightbox(i)}
                  className="group relative mb-4 cursor-pointer break-inside-avoid overflow-hidden rounded border border-gray-200 bg-[#fffaf0]"
                >

                  <img
                    src={img.src}
                    alt={img.title}
                    style={{ height: img.h }}
                    className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* Number */}
                  <span className="absolute right-4 top-4 text-xs tracking-[0.15em] text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Bottom info */}
                  <div className="absolute bottom-0 left-0 right-0 translate-y-3 p-5 text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">

                    <div className="text-[10px] uppercase tracking-[0.2em] text-gray-300">
                      {img.cat}
                    </div>

                    <div className="mt-1 text-lg font-medium">
                      {img.title}
                    </div>

                    {img.description && <p className="mt-1 text-sm text-gray-200">{img.description}</p>}

                  </div>

                </motion.article>
              ))}

            </AnimatePresence>

          </motion.div>

        </section>
      )}

      {/* LIGHTBOX */}
      <AnimatePresence>
        {selected !== null && filtered[selected] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 p-4 sm:p-8"
          >

            {/* Header */}
            <div className="mx-auto flex max-w-7xl items-center justify-between text-white">

              <div>
                <span className="ml-4 text-sm">
                  {filtered[selected].title}
                </span>
                {filtered[selected].description && <p className="mt-1 text-sm text-gray-300">{filtered[selected].description}</p>}
              </div>

              <button
                onClick={closeLightbox}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-xl text-gray-300 transition hover:bg-white hover:text-black"
                aria-label="Close"
              >
                ×
              </button>

            </div>

            {/* Main image */}
            <div className="relative mx-auto mt-6 flex h-[70vh] max-w-6xl items-center justify-center">

              <AnimatePresence mode="wait">

                <motion.img
                  key={selected}
                  src={filtered[selected].src}
                  alt={filtered[selected].title}
                  initial={{
                    opacity: 0,
                    scale: 0.97,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 1.03,
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                  className="max-h-full max-w-full rounded object-contain"
                />

              </AnimatePresence>

              {filtered.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-2 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/30 text-2xl text-white backdrop-blur-sm transition hover:bg-white hover:text-black sm:left-5"
                    aria-label="Previous"
                  >
                    ‹
                  </button>

                  <button
                    onClick={next}
                    className="absolute right-2 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/30 text-2xl text-white backdrop-blur-sm transition hover:bg-white hover:text-black sm:right-5"
                    aria-label="Next"
                  >
                    ›
                  </button>
                </>
              )}

            </div>

            {/* Thumbnails */}
            {filtered.length > 1 && (
              <div className="mx-auto mt-5 flex max-w-6xl gap-2 overflow-x-auto pb-2">

                {filtered.map((img, i) => (
                  <button
                    key={img._id}
                    onClick={() => setSelected(i)}
                    className={`h-14 w-20 flex-shrink-0 overflow-hidden rounded border transition ${
                      i === selected
                        ? "border-white"
                        : "border-white/20 opacity-50 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img.src}
                      alt={img.title}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}

              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}