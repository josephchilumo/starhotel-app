import React, { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import roomImg from "../Images/roomImg.webp";
import poolImg from "../Images/poolImg.webp";
import spaImg  from "../Images/spaImg.png";
import yoga    from "../Images/yoga.jpg";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400;1,600&family=Jost:wght@300;400;500&display=swap');

  :root {
    --cream:     #f8f3ec;
    --cream-dk:  #ede5d8;
    --bark:      #2b2318;
    --bronze:    #a0743c;
    --bronze-lt: #c49558;
    --fog:       #9c9188;
    --border:    rgba(43,35,24,0.1);
    --white:     #ffffff;
  }

  /* ── Section ── */
  .off-root {
    background: var(--cream);
    font-family: 'Jost', sans-serif;
    color: var(--bark);
    padding: 7rem 0 0;
    overflow: hidden;
  }

  /* ── Header ── */
  .off-header {
    padding: 0 5vw 4.5rem;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 2rem;
    flex-wrap: wrap;
  }

  .off-header-left {}

  .off-eyebrow {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    margin-bottom: 1.2rem;
  }
  .off-eyebrow-line { width: 28px; height: 1px; background: var(--bronze); }
  .off-eyebrow-text {
    font-size: 0.62rem;
    letter-spacing: 0.26em;
    text-transform: uppercase;
    color: var(--bronze);
    font-weight: 400;
  }

  .off-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.8rem, 6vw, 5rem);
    font-weight: 300;
    line-height: 1.05;
    letter-spacing: -0.025em;
    color: var(--bark);
  }
  .off-title em { font-style: italic; color: var(--bronze); }

  .off-header-right {
    max-width: 340px;
  }
  .off-subtitle {
    font-size: 0.875rem;
    color: var(--fog);
    line-height: 1.8;
    font-weight: 300;
    border-left: 2px solid var(--bronze);
    padding-left: 1.25rem;
  }

  /* ── Cards grid ── */
  .off-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    border-top: 1px solid var(--border);
  }
  @media (max-width: 900px) { .off-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 520px)  { .off-grid { grid-template-columns: 1fr 1fr; } }

  /* ── Individual card ── */
  .off-card {
    position: relative;
    overflow: hidden;
    height: 560px;
    border-right: 1px solid var(--border);
    cursor: default;
  }
  .off-card:last-child { border-right: none; }
  @media (max-width: 900px) {
    .off-card:nth-child(2n) { border-right: none; }
    .off-card { height: 420px; }
  }
  @media (max-width: 520px) { .off-card { height: 300px; } }

  /* Background image */
  .off-card-img {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover;
    transition: transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94);
  }
  .off-card:hover .off-card-img { transform: scale(1.07); }

  /* Base overlay — always visible at bottom for title */
  .off-card-base {
    position: absolute; inset: 0;
    background: linear-gradient(
      to top,
      rgba(20,16,10,0.88) 0%,
      rgba(20,16,10,0.35) 45%,
      rgba(20,16,10,0.05) 100%
    );
    transition: opacity 0.4s ease;
  }

  /* Hover overlay — fills more of the card */
  .off-card-hover-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(
      to top,
      rgba(20,16,10,0.95) 0%,
      rgba(20,16,10,0.75) 55%,
      rgba(20,16,10,0.3) 100%
    );
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  .off-card:hover .off-card-hover-overlay { opacity: 1; }

  /* Card content */
  .off-card-content {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 1.75rem 1.5rem;
  }

  /* Index number */
  .off-card-index {
    position: absolute;
    top: 1.25rem;
    left: 1.5rem;
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.8rem;
    font-style: italic;
    color: rgba(255,255,255,0.5);
    letter-spacing: 0.05em;
    transition: color 0.3s;
  }
  .off-card:hover .off-card-index { color: var(--bronze-lt); }

  /* Card title */
  .off-card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.4rem, 2.5vw, 1.85rem);
    font-weight: 300;
    font-style: italic;
    color: #f0ece4;
    line-height: 1.15;
    letter-spacing: -0.01em;
    margin-bottom: 0;
    transition: margin-bottom 0.4s ease;
  }
  .off-card:hover .off-card-title { margin-bottom: 0.85rem; }

  /* Bronze divider line */
  .off-card-line {
    width: 0;
    height: 1px;
    background: var(--bronze);
    margin-bottom: 0;
    transition: width 0.4s ease 0.05s, margin-bottom 0.4s ease;
  }
  .off-card:hover .off-card-line { width: 32px; margin-bottom: 0.85rem; }

  /* Description — hidden until hover */
  .off-card-desc {
    font-size: 0.78rem;
    color: rgba(240,236,228,0.65);
    line-height: 1.75;
    font-weight: 300;
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    transition: max-height 0.45s ease, opacity 0.35s ease 0.1s;
  }
  .off-card:hover .off-card-desc {
    max-height: 80px;
    opacity: 1;
  }

  /* ── Bottom strip ── */
  .off-strip {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem 5vw;
    border-top: 1px solid var(--border);
    margin-top: 0;
    flex-wrap: wrap;
    gap: 1rem;
  }
  .off-strip-text {
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--fog);
  }
  .off-strip-cta {
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--bronze);
    text-decoration: none;
    font-family: 'Jost', sans-serif;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: gap 0.2s;
  }
  .off-strip-cta:hover { gap: 0.85rem; }
`;

const OFFERINGS = [
  { title: "Luxurious Rooms",   desc: "Experience unparalleled comfort and elegance in our meticulously designed rooms.",                  image: roomImg, num: "01" },
  { title: "Infinity Pool",     desc: "Dive into serenity with our stunning infinity pool and breathtaking Indian Ocean views.",           image: poolImg, num: "02" },
  { title: "Spa & Wellness",    desc: "Indulge in rejuvenating treatments inspired by ancient Swahili coastal rituals.",                   image: spaImg,  num: "03" },
  { title: "Yoga & Meditation", desc: "Begin each morning with guided yoga sessions in our open-air pavilion overlooking the gardens.",   image: yoga,    num: "04" },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function Offering() {
  return (
    <>
      <style>{STYLES}</style>
      <section className="off-root">

        {/* ── Header ── */}
        <motion.div
          className="off-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div className="off-header-left">
            <div className="off-eyebrow">
              <div className="off-eyebrow-line" />
              <span className="off-eyebrow-text">Curated Experiences</span>
            </div>
            <h2 className="off-title">
              Our <em>Offerings</em>
            </h2>
          </div>

          <div className="off-header-right">
            <p className="off-subtitle">
              Discover the unique experiences that await you — from serene
              wellness rituals to panoramic coastal dining, every moment
              is crafted with intention.
            </p>
          </div>
        </motion.div>

        {/* ── Cards ── */}
        <div className="off-grid">
          {OFFERINGS.map((item, i) => (
            <motion.div
              key={i}
              className="off-card"
              custom={i}
              initial="hidden"
              whileInView="visible"
              variants={cardVariants}
              viewport={{ once: true, amount: 0.2 }}
            >
              <img src={item.image} alt={item.title} className="off-card-img" />
              <div className="off-card-base" />
              <div className="off-card-hover-overlay" />

              <div className="off-card-content">
                <span className="off-card-index">{item.num}</span>
                <h3 className="off-card-title">{item.title}</h3>
                <div className="off-card-line" />
                <p className="off-card-desc">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Bottom strip ── */}
        <div className="off-strip">
          <span className="off-strip-text">4 curated experiences · StarHotel Mombasa</span>
          <a href="/rooms" className="off-strip-cta">
            Explore All Offerings <span>→</span>
          </a>
        </div>

      </section>
    </>
  );
}
