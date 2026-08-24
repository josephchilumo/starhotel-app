import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import roomImg from "../Images/roomImg.webp";
import poolImg from "../Images/poolImg.webp";
import spaImg from "../Images/spaImg.png";
import yoga from "../Images/yoga.jpg";
import spaImg1 from "../Images/spaImg1.jpeg";
import twinRoom from "../Images/twinRoom.webp";

const ITEMS = [
  {
    image: roomImg,
    title: "Luxury Suites",
    desc: "Elegant rooms designed for comfort and deep relaxation.",
    link: "/rooms",
    button: "View Rooms",
  },
  {
    image: poolImg,
    title: "Infinity Pool",
    desc: "Breathtaking views stretching toward the Indian Ocean.",
    link: "/facilities",
    button: "Discover",
  },
  {
    image: spaImg,
    title: "Spa Retreat",
    desc: "Coastal-inspired treatments designed to restore and renew.",
    link: "/facilities",
    button: "Explore Spa",
  },
  {
    image: yoga,
    title: "Morning Yoga",
    desc: "Peaceful mornings surrounded by tropical gardens.",
    link: "/facilities",
    button: "Learn More",
  },
  {
    image: spaImg1,
    title: "Wellness Therapy",
    desc: "Traditional inspiration meets contemporary relaxation.",
    link: "/facilities",
    button: "Explore",
  },
  {
    image: twinRoom,
    title: "Twin Rooms",
    desc: "Thoughtfully designed spaces for shared stays.",
    link: "/rooms",
    button: "View Rooms",
  },
];

export default function Gallery() {
  return (
    <section className="bg-stone-50 text-gray-900 overflow-hidden">

      {/* HEADER */}

      <div className="max-w-6xl mx-auto px-5 lg:px-12 pt-14 lg:pt-20 pb-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >

          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-none">
            Discover
            <br />
            <span className="italic font-light">
              StarHotel.
            </span>
          </h2>

          <p className="mt-4 max-w-md text-sm lg:text-base text-gray-500 leading-6">
            A glimpse of the spaces and experiences waiting for you.
          </p>

        </motion.div>

      </div>


      {/* GRID */}

      <div className="max-w-6xl mx-auto px-5 lg:px-12 pb-14">

        <div className="grid grid-cols-2 gap-4 sm:gap-6">

          {ITEMS.map((item, index) => (

            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.05,
              }}
              viewport={{ once: true, amount: 0.1 }}
              className="min-w-0"
            >

              {/* IMAGE */}

              <div
                className={`overflow-hidden ${
                  index % 2 === 0
                    ? "rounded-t-[1.5rem] rounded-br-[1.5rem]"
                    : "rounded-t-[1.5rem] rounded-bl-[1.5rem]"
                }`}
              >

                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full aspect-[4/5] object-cover hover:scale-105 transition-transform duration-700"
                />

              </div>


              {/* TEXT */}

              <div className="mt-3">

                <h3 className="font-serif text-xl lg:text-2xl leading-tight">
                  {item.title}
                </h3>

                <p className="hidden sm:block mt-2 text-sm text-gray-500 leading-5">
                  {item.desc}
                </p>

                <Link
                  to={item.link}
                  className="inline-flex mt-3 px-3 py-2 bg-gray-900 text-white text-[9px] sm:text-xs uppercase tracking-[0.12em] hover:bg-gray-700 transition"
                >
                  {item.button}
                </Link>

              </div>

            </motion.article>

          ))}

        </div>

      </div>


      {/* FOOTER */}

      <div className="max-w-6xl mx-auto px-5 lg:px-12 pb-10">

        <div className="border-t border-gray-200 pt-4 flex justify-between items-center">

          <span className="text-[9px] sm:text-xs uppercase tracking-[0.15em] text-gray-500">
            StarHotel · Mombasa
          </span>

          <Link
            to="/gallery"
            className="text-[9px] sm:text-xs uppercase tracking-[0.15em] hover:italic transition"
          >
            Full Gallery
          </Link>

        </div>

      </div>

    </section>
  );
}