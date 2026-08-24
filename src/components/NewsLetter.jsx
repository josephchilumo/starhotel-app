import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PERKS = [
  {
    icon: "◈",
    label: "Exclusive Offers",
    val: "Members only rates",
  },
  {
    icon: "◉",
    label: "Early Access",
    val: "New room previews",
  },
  {
    icon: "◎",
    label: "Travel Inspiration",
    val: "Curated coastal stories",
  },
];

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 900);
  };

  return (
    <section className="bg-[#faf9f6] px-5 py-16 text-gray-900">

      <motion.div
        className="mx-auto max-w-3xl text-center"
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >

        {/* Title */}
        <h2 className="mt-3 text-3xl font-medium md:text-4xl">
          Let's Keep in{" "}
          <span className="font-serif italic">Touch</span>
        </h2>

        {/* Description */}
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-gray-500">
          Subscribe and receive exclusive offers, travel inspiration,
          and special discounts delivered quietly to your inbox.
        </p>

        {/* Form / Success */}
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <form
                onSubmit={handleSubmit}
                className="mx-auto mt-7 flex max-w-xl flex-col gap-2 sm:flex-row"
              >
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="min-w-0 flex-1 rounded-md border border-[#ddd8d0] bg-[#fffdf9] px-4 py-3 text-sm outline-none transition focus:border-gray-500"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-md bg-gray-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-700 disabled:opacity-60"
                >
                  {loading ? "Subscribing..." : "Subscribe "}
                </button>
              </form>

              <p className="mt-3 text-xs text-gray-400">
                No spam, ever. Unsubscribe at any time.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mx-auto mt-7 max-w-md rounded-xl border border-[#e5e0d8] bg-[#fffdf9] p-6"
            >
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-white">
                ✓
              </div>

              <h3 className="mt-4 text-lg font-medium">
                You're on the list
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Welcome to StarHotel — expect something beautiful in your
                inbox soon.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Perks */}
        {!submitted && (
          <motion.div
            className="mx-auto mt-10 grid max-w-2xl border-t border-[#e5e0d8] pt-7 sm:grid-cols-3"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {PERKS.map((perk) => (
              <div
                key={perk.label}
                className="border-b border-[#e5e0d8] py-4 last:border-b-0 sm:border-b-0 sm:border-r sm:py-0 sm:last:border-r-0"
              >
                <div className="text-lg text-gray-700">
                  {perk.icon}
                </div>

                <p className="mt-2 text-xs font-medium">
                  {perk.label}
                </p>

                <p className="mt-1 text-[11px] text-gray-400">
                  {perk.val}
                </p>
              </div>
            ))}
          </motion.div>
        )}

      </motion.div>
    </section>
  );
}