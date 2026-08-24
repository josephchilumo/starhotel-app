import React from "react";
import { motion } from "framer-motion";

const REVIEWS = [
  {
    name: "Sarah Mitchell",
    location: "London, UK",
    review:
      "Elegant rooms, relaxing spa, and incredible service. One of the best stays I've had.",
    rating: 5,
    avatar: "https://i.pravatar.cc/100?img=47",
  },
  {
    name: "Daniel Mwangi",
    location: "Nairobi, Kenya",
    review:
      "The infinity pool at sunset was unforgettable. I would absolutely stay here again.",
    rating: 5,
    avatar: "https://i.pravatar.cc/100?img=12",
  },
  {
    name: "Maria Lopez",
    location: "Madrid, Spain",
    review:
      "Beautiful atmosphere and peaceful rooms. Everything felt luxurious and calm.",
    rating: 4,
    avatar: "https://i.pravatar.cc/100?img=32",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.12,
    },
  }),
};

export default function GuestReviews() {
  return (
    <section className="bg-[#faf9f6] px-5 py-16 text-gray-900">

      {/* Header */}
      <motion.div
        className="mx-auto max-w-6xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        
        <h2 className="mt-3 max-w-md text-3xl font-medium leading-tight md:text-4xl">
          What Our <br />
          <span className="font-serif italic">Guests Say</span>
        </h2>

        <p className="mt-4 max-w-xl text-sm leading-6 text-gray-500">
          Genuine experiences from travellers who have enjoyed a stay with us.
        </p>
      </motion.div>

      {/* Reviews */}
      <div className="mx-auto mt-10 grid max-w-6xl gap-5 md:grid-cols-3">
        {REVIEWS.map((review, index) => (
          <motion.div
            key={review.name}
            custom={index}
            initial="hidden"
            whileInView="visible"
            variants={cardVariants}
            viewport={{ once: true, amount: 0.2 }}
            className="rounded-xl border border-[#e5e0d8] bg-[#fffdf9] p-6"
          >

            {/* Rating */}
            <div className="mt-4 flex gap-1">
              {Array.from({ length: 5 }).map((_, star) => (
                <span
                  key={star}
                  className={
                    star < review.rating
                      ? "text-gray-800"
                      : "text-gray-300"
                  }
                >
                  ★
                </span>
              ))}
            </div>

            {/* Review */}
            <p className="mt-5 min-h-[90px] text-sm leading-6 text-gray-600">
              "{review.review}"
            </p>

            {/* Guest */}
            <div className="mt-6 flex items-center gap-2 pt-5">
              <img
                src={review.avatar}
                alt={review.name}
                className="h-10 w-10 rounded-full object-cover"
              />

              <div>
                <p className="text-sm font-medium">
                  {review.name}
                </p>

                <p className="text-xs text-gray-400">
                  {review.location}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom */}
      <div className="mx-auto mt-8 flex max-w-6xl flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <a
          href="/reviews"
          className="text-sm font-medium underline underline-offset-4"
        >
          Read All Reviews
        </a>
      </div>
    </section>
  );
}