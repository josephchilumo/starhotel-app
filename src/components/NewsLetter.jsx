import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400;1,600&family=Jost:wght@300;400;500&display=swap');

  :root {
    --ink:       #0d0f0e;
    --ink2:      #151816;
    --bronze:    #a0743c;
    --bronze-lt: #c49558;
    --cream:     #f0ece4;
    --fog:       rgba(240,236,228,0.45);
    --border:    rgba(255,255,255,0.08);
  }

  /* ── Section ── */
  .nl-root {
    position: relative;
    background: var(--ink);
    font-family: 'Jost', sans-serif;
    color: var(--cream);
    overflow: hidden;
    padding: 8rem 5vw 7rem;
  }

  /* ── Animated mesh gradient background ── */
  .nl-mesh {
    position: absolute;
    inset: 0;
    z-index: 0;
    background:
      radial-gradient(ellipse 70% 60% at 15% 50%, rgba(160,116,60,0.13) 0%, transparent 70%),
      radial-gradient(ellipse 50% 80% at 85% 20%, rgba(26,58,74,0.2) 0%, transparent 65%),
      radial-gradient(ellipse 60% 50% at 60% 85%, rgba(160,116,60,0.07) 0%, transparent 60%);
    animation: meshShift 14s ease-in-out infinite alternate;
  }
  @keyframes meshShift {
    0%   { opacity: 0.7; transform: scale(1) rotate(0deg); }
    50%  { opacity: 1;   transform: scale(1.04) rotate(1deg); }
    100% { opacity: 0.8; transform: scale(1.02) rotate(-0.5deg); }
  }

  /* ── Corner decorations ── */
  .nl-corner {
    position: absolute;
    width: 64px; height: 64px;
    z-index: 1;
  }
  .nl-corner-tl { top: 2.5rem; left: 2.5rem; border-top: 1px solid rgba(160,116,60,0.3); border-left: 1px solid rgba(160,116,60,0.3); }
  .nl-corner-br { bottom: 2.5rem; right: 2.5rem; border-bottom: 1px solid rgba(160,116,60,0.3); border-right: 1px solid rgba(160,116,60,0.3); }

  /* ── Content ── */
  .nl-content {
    position: relative;
    z-index: 2;
    max-width: 720px;
    margin: 0 auto;
    text-align: center;
  }

  /* Eyebrow */
  .nl-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.75rem;
  }
  .nl-eyebrow-line { width: 28px; height: 1px; background: var(--bronze); }
  .nl-eyebrow-text {
    font-size: 0.62rem; letter-spacing: 0.26em;
    text-transform: uppercase; color: var(--bronze-lt);
  }

  /* Headline */
  .nl-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.6rem, 6vw, 5rem);
    font-weight: 300; line-height: 1.1;
    letter-spacing: -0.025em;
    color: var(--cream);
    margin-bottom: 1.25rem;
  }
  .nl-title em { font-style: italic; color: var(--bronze-lt); }

  /* Sub */
  .nl-sub {
    font-size: 0.875rem; color: var(--fog);
    line-height: 1.8; font-weight: 300;
    max-width: 460px; margin: 0 auto 3.5rem;
  }

  /* ── Form ── */
  .nl-form {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 0;
    max-width: 520px;
    margin: 0 auto;
    border-bottom: 1px solid rgba(255,255,255,0.15);
    padding-bottom: 0;
    transition: border-color 0.3s;
  }
  .nl-form:focus-within { border-color: var(--bronze); }

  .nl-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    padding: 0.85rem 0.5rem 0.85rem 0;
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.15rem;
    font-style: italic;
    color: var(--cream);
    letter-spacing: 0.02em;
    caret-color: var(--bronze-lt);
  }
  .nl-input::placeholder {
    color: rgba(240,236,228,0.25);
    font-style: italic;
  }

  .nl-submit {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.85rem 0 0.85rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-family: 'Jost', sans-serif;
    font-size: 0.65rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--bronze-lt);
    transition: color 0.2s, gap 0.2s;
    white-space: nowrap;
  }
  .nl-submit:hover { color: var(--cream); gap: 0.9rem; }
  .nl-submit svg { flex-shrink: 0; }

  /* ── Privacy note ── */
  .nl-note {
    margin-top: 1.5rem;
    font-size: 0.65rem;
    letter-spacing: 0.1em;
    color: rgba(240,236,228,0.22);
    text-align: center;
  }

  /* ── Success state ── */
  .nl-success {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  .nl-success-icon {
    width: 52px; height: 52px;
    border: 1px solid var(--bronze);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--bronze-lt);
  }
  .nl-success-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.75rem;
    font-style: italic; font-weight: 300;
    color: var(--cream);
  }
  .nl-success-sub {
    font-size: 0.78rem;
    letter-spacing: 0.08em;
    color: var(--fog);
    font-weight: 300;
  }

  /* ── Perks row ── */
  .nl-perks {
    display: flex;
    justify-content: center;
    gap: 3rem;
    margin-top: 4rem;
    padding-top: 3rem;
    border-top: 1px solid var(--border);
    flex-wrap: wrap;
  }
  .nl-perk {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
  }
  .nl-perk-icon {
    font-size: 1rem;
    color: var(--bronze);
    margin-bottom: 0.2rem;
  }
  .nl-perk-label {
    font-size: 0.62rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(240,236,228,0.35);
    text-align: center;
  }
  .nl-perk-val {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.95rem;
    font-style: italic;
    color: rgba(240,236,228,0.6);
  }
`;

const PERKS = [
  { icon: "◈", label: "Exclusive Offers",    val: "Members only rates"      },
  { icon: "◉", label: "Early Access",         val: "New room previews"       },
  { icon: "◎", label: "Travel Inspiration",  val: "Curated coastal stories" },
];

export default function Newsletter() {
  const [email, setEmail]       = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 900);
  };

  return (
    <>
      <style>{STYLES}</style>
      <section className="nl-root">

        {/* Mesh background */}
        <div className="nl-mesh" aria-hidden="true" />

        {/* Corner accents */}
        <div className="nl-corner nl-corner-tl" aria-hidden="true" />
        <div className="nl-corner nl-corner-br" aria-hidden="true" />

        <motion.div
          className="nl-content"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          {/* Eyebrow */}
          <div className="nl-eyebrow">
            <div className="nl-eyebrow-line" />
            <span className="nl-eyebrow-text">Stay Connected</span>
            <div className="nl-eyebrow-line" />
          </div>

          {/* Title */}
          <h2 className="nl-title">
            Let's Keep in <em>Touch</em>
          </h2>

          {/* Sub */}
          <p className="nl-sub">
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
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4 }}
              >
                <form className="nl-form" onSubmit={handleSubmit}>
                  <input
                    type="email"
                    className="nl-input"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button type="submit" className="nl-submit" disabled={loading}>
                    {loading ? (
                      <span style={{ opacity: 0.5 }}>Subscribing…</span>
                    ) : (
                      <>
                        Subscribe
                        <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                          <path d="M1 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </>
                    )}
                  </button>
                </form>

                <p className="nl-note">
                  No spam, ever. Unsubscribe at any time.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                className="nl-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <div className="nl-success-icon">
                  <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
                    <path d="M1 8L7 14L19 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="nl-success-title">You're on the list</div>
                <div className="nl-success-sub">
                  Welcome to StarHotel — expect something beautiful in your inbox soon.
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Perks */}
          {!submitted && (
            <motion.div
              className="nl-perks"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              viewport={{ once: true }}
            >
              {PERKS.map((p, i) => (
                <div key={i} className="nl-perk">
                  <span className="nl-perk-icon">{p.icon}</span>
                  <span className="nl-perk-label">{p.label}</span>
                  <span className="nl-perk-val">{p.val}</span>
                </div>
              ))}
            </motion.div>
          )}

        </motion.div>
      </section>
    </>
  );
}