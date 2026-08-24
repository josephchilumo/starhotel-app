import React from "react";
import { motion } from "framer-motion";

import roomImg from "../Images/roomImg.webp";
import poolImg from "../Images/poolImg.webp";
import spaImg from "../Images/spaImg.png";
import yoga from "../Images/yoga.jpg";

const OFFERINGS = [
  {
    title: "Luxurious Rooms",
    desc: "Experience unparalleled comfort and elegance in our meticulously designed rooms.",
    image: roomImg,
  },
  {
    title: "Infinity Pool",
    desc: "Dive into serenity with our stunning infinity pool and breathtaking Indian Ocean views.",
    image: poolImg,
  },
  {
    title: "Spa & Wellness",
    desc: "Indulge in rejuvenating treatments inspired by ancient Swahili coastal rituals.",
    image: spaImg,
  },
  {
    title: "Yoga & Meditation",
    desc: "Begin each morning with guided yoga sessions in our open-air pavilion overlooking the gardens.",
    image: yoga,
  },
];

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      delay: i * 0.1,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

export default function Offering() {
  return (
    <section className="bg-stone-50 text-gray-900 overflow-hidden">

      {/* ================= HEADER ================= */}

      <div className="max-w-6xl mx-auto px-6 lg:px-10 pt-16 lg:pt-20">

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >

          <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[0.9] tracking-tight">
            Experiences made
            <br />
            <span className="italic font-light">
              for slowing down.
            </span>
          </h2>

          <p className="mt-6 max-w-lg text-base lg:text-lg text-gray-500 leading-7">
            From quiet mornings beside the ocean to evenings spent
            around the table, every part of your stay has its own rhythm.
          </p>

        </motion.div>

      </div>


      {/* ================= EDITORIAL GRID ================= */}

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16 lg:py-20">

        <div className="grid md:grid-cols-12 gap-x-8 lg:gap-x-12 gap-y-16 lg:gap-y-20">


          {/* ================= ROOMS ================= */}

          <motion.article
            custom={0}
            initial="hidden"
            whileInView="visible"
            variants={cardVariants}
            viewport={{ once: true, amount: 0.15 }}
            className="md:col-span-7"
          >

            <div className="relative">

              <div className="overflow-hidden rounded-t-[3.5rem] rounded-br-[3.5rem]">

                <img
                  src={roomImg}
                  alt="Luxurious hotel room"
                  className="w-full aspect-[4/3] object-cover transition-transform duration-700 hover:scale-105"
                />

              </div>

              {/* Fold */}
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-stone-50">
                <div className="absolute top-0 left-0 border-t-[18px] border-t-gray-300 border-r-[18px] border-r-transparent" />
              </div>

            </div>

            <div className="mt-5 max-w-lg">

              <h3 className="font-serif text-3xl lg:text-4xl">
                Luxurious Rooms
              </h3>

              <p className="mt-3 text-base text-gray-500 leading-7">
                {OFFERINGS[0].desc}
              </p>

            </div>

          </motion.article>


          {/* ================= POOL ================= */}

          <motion.article
            custom={1}
            initial="hidden"
            whileInView="visible"
            variants={cardVariants}
            viewport={{ once: true, amount: 0.15 }}
            className="md:col-span-5 md:mt-24"
          >

            <div className="relative">

              <div className="overflow-hidden rounded-t-[3rem] rounded-bl-[3rem]">

                <img
                  src={poolImg}
                  alt="Infinity pool overlooking the ocean"
                  className="w-full aspect-[3/4] object-cover transition-transform duration-700 hover:scale-105"
                />

              </div>

              <div className="absolute bottom-0 left-0 w-14 h-14 bg-stone-50">
                <div className="absolute top-0 right-0 border-t-[16px] border-t-gray-300 border-l-[16px] border-l-transparent" />
              </div>

            </div>

            <div className="mt-5">

              <h3 className="font-serif text-3xl">
                Infinity Pool
              </h3>

              <p className="mt-3 text-base text-gray-500 leading-7">
                {OFFERINGS[1].desc}
              </p>

            </div>

          </motion.article>


          {/* ================= SPA ================= */}

          <motion.article
            custom={2}
            initial="hidden"
            whileInView="visible"
            variants={cardVariants}
            viewport={{ once: true, amount: 0.15 }}
            className="md:col-span-5 md:mt-4"
          >

            <div className="relative">

              <div className="overflow-hidden rounded-t-[3rem] rounded-br-[3rem]">

                <img
                  src={spaImg}
                  alt="Spa and wellness treatment"
                  className="w-full aspect-[4/5] object-cover transition-transform duration-700 hover:scale-105"
                />

              </div>

              <div className="absolute bottom-0 right-0 w-14 h-14 bg-stone-50">
                <div className="absolute top-0 left-0 border-t-[16px] border-t-gray-300 border-r-[16px] border-r-transparent" />
              </div>

            </div>

            <div className="mt-5">

              <h3 className="font-serif text-3xl">
                Spa & Wellness
              </h3>

              <p className="mt-3 text-base text-gray-500 leading-7">
                {OFFERINGS[2].desc}
              </p>

            </div>

          </motion.article>


          {/* ================= YOGA ================= */}

          <motion.article
            custom={3}
            initial="hidden"
            whileInView="visible"
            variants={cardVariants}
            viewport={{ once: true, amount: 0.15 }}
            className="md:col-span-7 md:mt-28"
          >

            <div className="relative">

              <div className="overflow-hidden rounded-t-[3.5rem] rounded-bl-[3.5rem]">

                <img
                  src={yoga}
                  alt="Yoga and meditation pavilion"
                  className="w-full aspect-[16/10] object-cover transition-transform duration-700 hover:scale-105"
                />

              </div>

              <div className="absolute bottom-0 left-0 w-16 h-16 bg-stone-50">
                <div className="absolute top-0 right-0 border-t-[18px] border-t-gray-300 border-l-[18px] border-l-transparent" />
              </div>

            </div>

            <div className="mt-5 max-w-lg">

              <h3 className="font-serif text-3xl lg:text-4xl">
                Yoga & Meditation
              </h3>

              <p className="mt-3 text-base text-gray-500 leading-7">
                {OFFERINGS[3].desc}
              </p>

            </div>

          </motion.article>

        </div>

      </div>

    </section>
  );
}