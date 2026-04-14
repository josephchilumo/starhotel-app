import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import roomImg  from "../Images/roomImg.webp";
import poolImg  from "../Images/poolImg.webp";
import spaImg   from "../Images/spaImg.png";
import yoga     from "../Images/yoga.jpg";
import spaImg1  from "../Images/spaImg1.jpeg";
import twinRoom from "../Images/twinRoom.webp";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400;1,600&family=Jost:wght@300;400;500&display=swap');

  :root {
    --ink:       #111210;
    --ink2:      #1a1c19;
    --ink3:      #222420;
    --bronze:    #a0743c;
    --bronze-lt: #c49558;
    --cream:     #f0ece4;
    --fog:       rgba(240,236,228,0.45);
    --border:    rgba(255,255,255,0.07);
  }

  .gal-root {
    background: var(--ink);
    font-family: 'Jost', sans-serif;
    color: var(--cream);
    padding: 7rem 0 0;
    overflow: hidden;
  }

  /* ── Header ── */
  .gal-header {
    padding: 0 5vw 4rem;
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: flex-end;
    gap: 2rem;
  }
  @media (max-width: 640px) { .gal-header { grid-template-columns: 1fr; } }

  .gal-eyebrow {
    display: flex; align-items: center; gap: 0.75rem;
    margin-bottom: 1.25rem;
  }
  .gal-eyebrow-line { width: 28px; height: 1px; background: var(--bronze); }
  .gal-eyebrow-text {
    font-size: 0.62rem; letter-spacing: 0.26em;
    text-transform: uppercase; color: var(--bronze-lt);
  }

  .gal-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.4rem, 5.5vw, 4.5rem);
    font-weight: 300; line-height: 1.05;
    letter-spacing: -0.02em; color: var(--cream);
  }
  .gal-title em { font-style: italic; color: var(--bronze-lt); }

  .gal-count {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(4rem, 8vw, 7rem);
    font-weight: 300; font-style: italic;
    color: rgba(160,116,60,0.18);
    line-height: 1; letter-spacing: -0.04em;
    user-select: none;
  }

  /* ── Bento grid ── */
  .gal-grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: 340px 280px;
    gap: 3px;
    padding: 0 5vw;
  }

  /* Layout: [wide] [mid] [tall] | [small] [small] [wide] */
  .gal-cell-1 { grid-column: 1 / 5;  grid-row: 1; }
  .gal-cell-2 { grid-column: 5 / 8;  grid-row: 1; }
  .gal-cell-3 { grid-column: 8 / 13; grid-row: 1 / 3; } /* tall */
  .gal-cell-4 { grid-column: 1 / 4;  grid-row: 2; }
  .gal-cell-5 { grid-column: 4 / 6;  grid-row: 2; }
  .gal-cell-6 { grid-column: 6 / 8;  grid-row: 2; }

  @media (max-width: 900px) {
    .gal-grid {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: repeat(4, 240px);
      padding: 0 3vw;
    }
    .gal-cell-1 { grid-column: 1 / 3; grid-row: 1; }
    .gal-cell-2 { grid-column: 1;     grid-row: 2; }
    .gal-cell-3 { grid-column: 2;     grid-row: 2; }
    .gal-cell-4 { grid-column: 1;     grid-row: 3; }
    .gal-cell-5 { grid-column: 2;     grid-row: 3; }
    .gal-cell-6 { grid-column: 1 / 3; grid-row: 4; }
  }

  @media (max-width: 520px) {
    .gal-grid {
      display: flex; overflow-x: auto; scroll-snap-type: x mandatory;
      gap: 2px; padding: 0;
      scrollbar-width: none;
    }
    .gal-grid::-webkit-scrollbar { display: none; }
    .gal-cell-1,.gal-cell-2,.gal-cell-3,
    .gal-cell-4,.gal-cell-5,.gal-cell-6 {
      flex-shrink: 0;
      width: 78vw; height: 480px;
      scroll-snap-align: center;
    }
  }

  /* ── Card ── */
  .gal-card {
    position: relative; overflow: hidden;
    cursor: pointer;
  }

  .gal-card-img {
    width: 100%; height: 100%;
    object-fit: cover;
    transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    display: block;
  }
  .gal-card:hover .gal-card-img { transform: scale(1.06); }

  /* Always-on bottom gradient */
  .gal-card-base-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(
      to top,
      rgba(10,9,7,0.9) 0%,
      rgba(10,9,7,0.2) 50%,
      transparent 100%
    );
  }

  /* Hover fill overlay */
  .gal-card-hover-overlay {
    position: absolute; inset: 0;
    background: rgba(10,9,7,0.45);
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  .gal-card:hover .gal-card-hover-overlay { opacity: 1; }

  /* Card content */
  .gal-card-content {
    position: absolute; inset: 0;
    display: flex; flex-direction: column;
    justify-content: flex-end;
    padding: 1.5rem;
  }

  .gal-card-index {
    position: absolute; top: 1rem; left: 1.25rem;
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.75rem; font-style: italic;
    color: rgba(255,255,255,0.35);
    transition: color 0.3s;
  }
  .gal-card:hover .gal-card-index { color: var(--bronze-lt); }

  .gal-card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.1rem, 2vw, 1.5rem);
    font-weight: 400; font-style: italic;
    color: var(--cream); line-height: 1.2;
    margin-bottom: 0; transition: margin-bottom 0.35s ease;
  }
  .gal-card:hover .gal-card-title { margin-bottom: 0.6rem; }

  .gal-card-sep {
    width: 0; height: 1px; background: var(--bronze);
    margin-bottom: 0;
    transition: width 0.4s ease 0.05s, margin-bottom 0.35s ease;
  }
  .gal-card:hover .gal-card-sep { width: 28px; margin-bottom: 0.6rem; }

  .gal-card-desc {
    font-size: 0.75rem; color: var(--fog);
    line-height: 1.65; font-weight: 300;
    max-height: 0; overflow: hidden; opacity: 0;
    transition: max-height 0.4s ease, opacity 0.3s ease 0.1s;
  }
  .gal-card:hover .gal-card-desc { max-height: 60px; opacity: 1; }

  .gal-card-btn {
    display: inline-flex; align-items: center; gap: 0.5rem;
    margin-top: 0;
    padding: 0.45rem 1.1rem;
    background: var(--bronze);
    color: var(--cream);
    font-size: 0.62rem; letter-spacing: 0.18em;
    text-transform: uppercase; text-decoration: none;
    font-family: 'Jost', sans-serif; font-weight: 500;
    border: none; cursor: pointer;
    max-height: 0; overflow: hidden; opacity: 0;
    transition: max-height 0.4s ease 0.15s, opacity 0.3s ease 0.2s, margin-top 0.35s ease, background 0.2s;
    pointer-events: none;
  }
  .gal-card:hover .gal-card-btn {
    max-height: 50px; opacity: 1;
    margin-top: 0.75rem;
    pointer-events: all;
  }
  .gal-card-btn:hover { background: #b8843f; }

  /* ── Progress / scroll indicator (mobile) ── */
  .gal-progress {
    display: none;
    padding: 1.25rem 5vw;
    gap: 4px;
  }
  @media (max-width: 520px) { .gal-progress { display: flex; } }

  .gal-prog-dot {
    flex: 1; height: 2px;
    background: var(--border);
    transition: background 0.3s;
  }
  .gal-prog-dot.active { background: var(--bronze); }

  /* ── Bottom strip ── */
  .gal-strip {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.5rem 5vw;
    border-top: 1px solid var(--border);
    margin-top: 3px;
    flex-wrap: wrap; gap: 1rem;
  }
  .gal-strip-text {
    font-size: 0.62rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: rgba(240,236,228,0.25);
  }
  .gal-strip-link {
    font-size: 0.65rem; letter-spacing: 0.18em;
    text-transform: uppercase; color: var(--bronze-lt);
    text-decoration: none; font-family: 'Jost', sans-serif;
    display: flex; align-items: center; gap: 0.5rem;
    transition: gap 0.2s;
  }
  .gal-strip-link:hover { gap: 0.9rem; }
`;

const ITEMS = [
  { id: 1, src: roomImg,  title: "Luxury Suites",     desc: "Elegant rooms designed for comfort and deep relaxation.",           link: "/rooms",  btn: "Book a Suite"       },
  { id: 2, src: poolImg,  title: "Infinity Pool",     desc: "Swim while enjoying breathtaking Indian Ocean views.",              link: "/rooms",  btn: "Reserve Access"     },
  { id: 3, src: spaImg,   title: "Spa Retreat",       desc: "Rejuvenate with our premium coastal-inspired spa treatments.",      link: "/rooms",  btn: "Book Spa"           },
  { id: 4, src: yoga,     title: "Morning Yoga",      desc: "Start your day with peaceful guided sessions in open-air gardens.", link: "/rooms",  btn: "Join Session"       },
  { id: 5, src: spaImg1,  title: "Wellness Therapy",  desc: "Relax your mind and body with luxury Swahili-inspired therapies.",  link: "/rooms",  btn: "Explore Wellness"   },
  { id: 6, src: twinRoom, title: "Twin Rooms",        desc: "Perfectly appointed rooms for families and travel partners.",       link: "/rooms",  btn: "View Rooms"         },
];

const CELL_CLASSES = [
  "gal-cell-1","gal-cell-2","gal-cell-3",
  "gal-cell-4","gal-cell-5","gal-cell-6",
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const cellVariants = {
  hidden:  { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.25,0.46,0.45,0.94] } },
};

export default function Gallery() {
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollRef = useRef(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const pct = scrollLeft / (scrollWidth - clientWidth);
    setActiveIdx(Math.round(pct * (ITEMS.length - 1)));
  };

  return (
    <>
      <style>{STYLES}</style>
      <section className="gal-root">

        {/* ── Header ── */}
        <motion.div
          className="gal-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div>
            <div className="gal-eyebrow">
              <div className="gal-eyebrow-line" />
              <span className="gal-eyebrow-text">Visual Stories</span>
            </div>
            <h2 className="gal-title">
              Discover <em>StarHotel</em><br />Experiences
            </h2>
          </div>
          <div className="gal-count" aria-hidden="true">0{ITEMS.length}</div>
        </motion.div>

        {/* ── Bento grid ── */}
        <motion.div
          className="gal-grid"
          ref={scrollRef}
          onScroll={handleScroll}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {ITEMS.map((item, i) => (
            <motion.div
              key={item.id}
              className={`gal-card ${CELL_CLASSES[i]}`}
              variants={cellVariants}
            >
              <img src={item.src} alt={item.title} className="gal-card-img" />
              <div className="gal-card-base-overlay" />
              <div className="gal-card-hover-overlay" />

              <div className="gal-card-content">
                <span className="gal-card-index">0{item.id}</span>
                <h3 className="gal-card-title">{item.title}</h3>
                <div className="gal-card-sep" />
                <p className="gal-card-desc">{item.desc}</p>
                <a href={item.link} className="gal-card-btn">
                  {item.btn}
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4h8M5 1l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Mobile scroll dots ── */}
        <div className="gal-progress">
          {ITEMS.map((_, i) => (
            <div key={i} className={`gal-prog-dot${i === activeIdx ? " active" : ""}`} />
          ))}
        </div>

        {/* ── Bottom strip ── */}
        <div className="gal-strip">
          <span className="gal-strip-text">StarHotel · Mombasa, Kenya · Est. 1998</span>
          <a href="/gallery" className="gal-strip-link">
            Full Gallery <span>→</span>
          </a>
        </div>

      </section>
    </>
  );
}
