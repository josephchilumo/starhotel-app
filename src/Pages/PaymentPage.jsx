import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FaPaypal, FaCcVisa } from "react-icons/fa";
import { SiStripe } from "react-icons/si";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

  :root {
    --parch:      #f2e8d9;
    --parch-dk:   #e8dac5;
    --bark:       #2b2318;
    --bark-lt:    #4a3f33;
    --bronze:     #a0743c;
    --bronze-lt:  #c49558;
    --fog:        #9c9188;
    --border:     rgba(43,35,24,0.1);
    --ink:        #0e0f0d;
    --ink2:       #171916;
    --cream:      #f0ece4;
    --white:      #ffffff;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .pp-root {
    min-height: 100vh;
    background: var(--parch);
    font-family: 'Jost', sans-serif;
    color: var(--bark);
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 860px) {
    .pp-root { grid-template-columns: 1fr; }
  }

  /* ══════════════════════════════
     LEFT — booking summary
  ══════════════════════════════ */
  .pp-summary {
    background: var(--ink2);
    padding: 4rem 5vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  /* Subtle mesh */
  .pp-summary::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 60% 60% at 20% 80%, rgba(160,116,60,0.09), transparent 65%);
    pointer-events: none;
  }

  /* Corner accents */
  .pp-corner {
    position: absolute; width: 44px; height: 44px;
  }
  .pp-corner-tl { top: 2rem; left: 2rem; border-top: 1px solid rgba(160,116,60,0.3); border-left: 1px solid rgba(160,116,60,0.3); }
  .pp-corner-br { bottom: 2rem; right: 2rem; border-bottom: 1px solid rgba(160,116,60,0.3); border-right: 1px solid rgba(160,116,60,0.3); }

  .pp-sum-inner { position: relative; z-index: 1; max-width: 380px; }

  /* Logo */
  .pp-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.3rem; font-weight: 300;
    letter-spacing: 0.08em; color: var(--cream);
    text-decoration: none; display: block; margin-bottom: 3rem;
  }
  .pp-logo em { font-style: italic; color: var(--bronze-lt); }

  .pp-sum-eyebrow {
    display: flex; align-items: center; gap: 0.7rem; margin-bottom: 1.25rem;
  }
  .pp-sum-ey-line { width: 20px; height: 1px; background: var(--bronze); }
  .pp-sum-ey-text {
    font-size: 0.6rem; letter-spacing: 0.26em;
    text-transform: uppercase; color: var(--bronze-lt);
  }

  .pp-sum-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.8rem, 3vw, 2.6rem);
    font-weight: 300; line-height: 1.1;
    color: var(--cream); letter-spacing: -0.02em;
    margin-bottom: 2rem;
  }
  .pp-sum-title em { font-style: italic; color: var(--bronze-lt); }

  /* Summary rows */
  .pp-sum-rows { display: flex; flex-direction: column; gap: 0; }

  .pp-sum-row {
    display: flex; align-items: baseline;
    justify-content: space-between;
    padding: 0.85rem 0;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .pp-sum-row:last-child { border-bottom: none; }

  .pp-sum-row-label {
    font-size: 0.72rem; letter-spacing: 0.08em;
    color: rgba(240,236,228,0.4); text-transform: uppercase;
  }
  .pp-sum-row-val {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1rem; font-weight: 400; font-style: italic;
    color: rgba(240,236,228,0.75);
    text-align: right; max-width: 60%;
  }

  /* Total row */
  .pp-sum-total {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(255,255,255,0.1);
    display: flex; align-items: baseline;
    justify-content: space-between;
  }
  .pp-sum-total-label {
    font-size: 0.62rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: rgba(240,236,228,0.35);
  }
  .pp-sum-total-amount {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.4rem; font-weight: 300;
    color: var(--bronze-lt); line-height: 1; letter-spacing: -0.02em;
  }

  /* ══════════════════════════════
     RIGHT — payment panel
  ══════════════════════════════ */
  .pp-payment {
    background: var(--parch);
    padding: 4rem 5vw;
    display: flex; flex-direction: column;
    justify-content: center;
    position: relative;
  }

  .pp-pay-inner { max-width: 400px; width: 100%; margin: 0 auto; }

  .pp-pay-eyebrow {
    display: flex; align-items: center; gap: 0.7rem; margin-bottom: 1.1rem;
  }
  .pp-pay-ey-line { width: 20px; height: 1px; background: var(--bronze); }
  .pp-pay-ey-text {
    font-size: 0.6rem; letter-spacing: 0.26em;
    text-transform: uppercase; color: var(--bronze);
  }

  .pp-pay-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.8rem, 3vw, 2.4rem);
    font-weight: 300; line-height: 1.1;
    color: var(--bark); letter-spacing: -0.02em; margin-bottom: 0.4rem;
  }
  .pp-pay-title em { font-style: italic; color: var(--bronze); }

  .pp-pay-sub {
    font-size: 0.78rem; color: var(--fog); font-weight: 300;
    margin-bottom: 2.25rem; line-height: 1.6;
  }

  /* ── Method label ── */
  .pp-method-label {
    font-size: 0.6rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: rgba(43,35,24,0.35);
    margin-bottom: 0.75rem;
  }

  /* ── Payment tiles ── */
  .pp-methods { display: flex; flex-direction: column; gap: 2px; margin-bottom: 1.5rem; }

  .pp-method {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1rem 1.25rem;
    background: var(--white);
    border: 1px solid var(--border);
    cursor: pointer;
    transition: border-color 0.25s, background 0.25s;
    position: relative;
    overflow: hidden;
  }
  .pp-method::before {
    content: '';
    position: absolute; left: 0; top: 0; bottom: 0;
    width: 3px;
    background: var(--bronze);
    transform: scaleY(0);
    transform-origin: top;
    transition: transform 0.3s ease;
  }
  .pp-method.selected { border-color: var(--bronze); background: rgba(160,116,60,0.04); }
  .pp-method.selected::before { transform: scaleY(1); }
  .pp-method:hover:not(.selected) { border-color: rgba(43,35,24,0.2); }

  .pp-method-left {
    display: flex; align-items: center; gap: 0.85rem;
  }
  .pp-method-icon {
    width: 32px; height: 32px;
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.85rem; color: var(--fog);
    transition: border-color 0.25s, color 0.25s;
    flex-shrink: 0;
  }
  .pp-method.selected .pp-method-icon { border-color: var(--bronze); color: var(--bronze); }

  .pp-method-name {
    font-size: 0.82rem; color: var(--bark-lt); font-weight: 400;
    letter-spacing: 0.02em;
    transition: color 0.25s;
  }
  .pp-method.selected .pp-method-name { color: var(--bark); }

  /* Custom radio */
  .pp-radio {
    width: 16px; height: 16px;
    border: 1.5px solid var(--border);
    border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    transition: border-color 0.25s;
  }
  .pp-method.selected .pp-radio { border-color: var(--bronze); }
  .pp-radio-dot {
    width: 7px; height: 7px;
    background: var(--bronze); border-radius: 50%;
    transform: scale(0);
    transition: transform 0.2s ease;
  }
  .pp-method.selected .pp-radio-dot { transform: scale(1); }

  /* ── M-Pesa input (slides in) ── */
  .pp-mpesa-wrap {
    overflow: hidden;
    max-height: 0;
    opacity: 0;
    transition: max-height 0.4s ease, opacity 0.3s ease 0.05s, margin-bottom 0.35s;
    margin-bottom: 0;
  }
  .pp-mpesa-wrap.visible {
    max-height: 80px; opacity: 1; margin-bottom: 1.5rem;
  }

  .pp-mpesa-field {}
  .pp-mpesa-label {
    display: block; font-size: 0.6rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: rgba(43,35,24,0.35);
    margin-bottom: 0.45rem;
  }
  .pp-mpesa-input-wrap {
    display: flex; align-items: center;
    border-bottom: 1px solid var(--border);
    padding-bottom: 0.65rem;
    transition: border-color 0.3s;
  }
  .pp-mpesa-input-wrap:focus-within { border-color: var(--bronze); }
  .pp-mpesa-input {
    flex: 1; background: transparent; border: none; outline: none;
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.05rem; font-style: italic;
    color: var(--bark); caret-color: var(--bronze);
  }
  .pp-mpesa-input::placeholder { color: rgba(43,35,24,0.2); font-style: italic; }

  /* ── Submit button ── */
  .pp-submit {
    width: 100%; padding: 1rem;
    background: var(--bark); color: var(--parch);
    border: none; cursor: pointer;
    font-family: 'Jost', sans-serif;
    font-size: 0.7rem; letter-spacing: 0.22em;
    text-transform: uppercase; font-weight: 500;
    position: relative; overflow: hidden;
    transition: background 0.25s;
    display: flex; align-items: center; justify-content: center; gap: 0.65rem;
  }
  .pp-submit::before {
    content: '';
    position: absolute; inset: 0;
    background: var(--bronze);
    transform: translateX(-101%);
    transition: transform 0.35s ease;
    z-index: 0;
  }
  .pp-submit:hover:not(:disabled)::before { transform: translateX(0); }
  .pp-submit > * { position: relative; z-index: 1; }
  .pp-submit:disabled { opacity: 0.55; cursor: not-allowed; }
  .pp-submit:disabled::before { display: none; }

  .pp-spinner {
    width: 13px; height: 13px;
    border: 1.5px solid rgba(242,232,217,0.3);
    border-top-color: var(--parch);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Security note ── */
  .pp-secure {
    display: flex; align-items: center; gap: 0.5rem;
    margin-top: 1rem; justify-content: center;
    font-size: 0.62rem; letter-spacing: 0.1em;
    color: rgba(43,35,24,0.3); text-transform: uppercase;
  }

  /* ── Error ── */
  .pp-error {
    font-size: 0.7rem; color: #c0392b;
    margin-top: 1rem;
    padding: 0.65rem 0.85rem;
    border: 1px solid rgba(192,57,43,0.2);
    background: rgba(192,57,43,0.05);
    display: flex; align-items: center; gap: 0.5rem;
  }

  /* Entrance animation */
  .pp-pay-inner, .pp-sum-inner {
    animation: formUp 0.65s ease both;
  }
  @keyframes formUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Mobile: stack summary above */
  @media (max-width: 860px) {
    .pp-summary { padding: 3rem 5vw; }
    .pp-payment  { padding: 3rem 5vw; }
    .pp-sum-inner { max-width: 100%; }
  }
`;

const MPESA_ICON = (
  <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
    <rect x="0.5" y="0.5" width="17" height="13" rx="1.5" stroke="currentColor"/>
    <path d="M4 7h10M9 4v6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

const METHODS = [
  { id: "mpesa",  label: "M-Pesa",               icon: MPESA_ICON          },
  { id: "card",   label: "Visa / Mastercard",     icon: <FaCcVisa />        },
  { id: "paypal", label: "PayPal",                icon: <FaPaypal />        },
  { id: "stripe", label: "Stripe",                icon: <SiStripe />        },
];

export default function PaymentPage() {
  const { state } = useLocation();
  const navigate  = useNavigate();

  const [method,  setMethod]  = useState("mpesa");
  const [phone,   setPhone]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  if (!state) {
    return (
      <>
        <style>{STYLES}</style>
        <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"var(--parch)", fontFamily:"'Cormorant Garamond', serif", fontSize:"1.2rem", color:"#c0392b", fontStyle:"italic" }}>
          No booking data found.
        </div>
      </>
    );
  }

  const { room, nights, checkIn, checkOut, total, guests, addons } = state;
  const validDates = checkIn && checkOut && nights > 0;

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" });
  };

  const handlePayment = async () => {
    if (!validDates) return;
    if (method === "mpesa" && !phone.trim()) {
      setError("Please enter your M-Pesa number.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/success", { state });
    }, 2200);
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="pp-root">

        {/* ══ LEFT: summary ══ */}
        <div className="pp-summary">
          <div className="pp-corner pp-corner-tl" aria-hidden="true" />
          <div className="pp-corner pp-corner-br" aria-hidden="true" />

          <div className="pp-sum-inner">
            <Link to="/" className="pp-logo">Star<em>Hotel</em></Link>

            <div className="pp-sum-eyebrow">
              <div className="pp-sum-ey-line" />
              <span className="pp-sum-ey-text">Booking Summary</span>
            </div>

            <h2 className="pp-sum-title">
              Your <em>Reservation</em>
            </h2>

            <div className="pp-sum-rows">
              <div className="pp-sum-row">
                <span className="pp-sum-row-label">Room</span>
                <span className="pp-sum-row-val">{room?.name}</span>
              </div>
              <div className="pp-sum-row">
                <span className="pp-sum-row-label">Check-in</span>
                <span className="pp-sum-row-val">{formatDate(checkIn)}</span>
              </div>
              <div className="pp-sum-row">
                <span className="pp-sum-row-label">Check-out</span>
                <span className="pp-sum-row-val">{formatDate(checkOut)}</span>
              </div>
              <div className="pp-sum-row">
                <span className="pp-sum-row-label">Duration</span>
                <span className="pp-sum-row-val">{nights} night{nights !== 1 ? "s" : ""}</span>
              </div>
              <div className="pp-sum-row">
                <span className="pp-sum-row-label">Guests</span>
                <span className="pp-sum-row-val">{guests}</span>
              </div>
              {addons && Object.values(addons).some(Boolean) && (
                <div className="pp-sum-row">
                  <span className="pp-sum-row-label">Extras</span>
                  <span className="pp-sum-row-val">
                    {Object.entries(addons)
                      .filter(([, v]) => v)
                      .map(([k]) => k.charAt(0).toUpperCase() + k.slice(1))
                      .join(", ")}
                  </span>
                </div>
              )}
            </div>

            <div className="pp-sum-total">
              <span className="pp-sum-total-label">Total Due</span>
              <span className="pp-sum-total-amount">
                KES {total?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* ══ RIGHT: payment ══ */}
        <div className="pp-payment">
          <div className="pp-pay-inner">

            <div className="pp-pay-eyebrow">
              <div className="pp-pay-ey-line" />
              <span className="pp-pay-ey-text">Secure Checkout</span>
            </div>

            <h1 className="pp-pay-title">
              Complete <em>Payment</em>
            </h1>
            <p className="pp-pay-sub">
              Choose your preferred payment method below.
              All transactions are encrypted and secure.
            </p>

            <div className="pp-method-label">Payment Method</div>

            {/* ── Method tiles ── */}
            <div className="pp-methods">
              {METHODS.map(({ id, label, icon }) => (
                <div
                  key={id}
                  className={`pp-method${method === id ? " selected" : ""}`}
                  onClick={() => { setMethod(id); setError(""); }}
                  role="radio"
                  aria-checked={method === id}
                  tabIndex={0}
                  onKeyDown={e => e.key === "Enter" && setMethod(id)}
                >
                  <div className="pp-method-left">
                    <div className="pp-method-icon">{icon}</div>
                    <span className="pp-method-name">{label}</span>
                  </div>
                  <div className="pp-radio">
                    <div className="pp-radio-dot" />
                  </div>
                </div>
              ))}
            </div>

            {/* ── M-Pesa number (slides in) ── */}
            <div className={`pp-mpesa-wrap${method === "mpesa" ? " visible" : ""}`}>
              <div className="pp-mpesa-field">
                <label className="pp-mpesa-label" htmlFor="mpesa-phone">
                  M-Pesa Number
                </label>
                <div className="pp-mpesa-input-wrap">
                  <input
                    id="mpesa-phone"
                    type="tel"
                    placeholder="+254 700 000 000"
                    value={phone}
                    onChange={e => { setPhone(e.target.value); setError(""); }}
                    className="pp-mpesa-input"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="pp-error" role="alert">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="5.5" stroke="#c0392b"/>
                  <path d="M6 3.5v3M6 8.5v.5" stroke="#c0392b" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                {error}
              </div>
            )}

            <button
              className="pp-submit"
              onClick={handlePayment}
              disabled={loading || !validDates}
            >
              {loading ? (
                <><span className="pp-spinner" /> Processing…</>
              ) : (
                <>
                  Pay KES {total?.toLocaleString()}
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                    <path d="M1 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              )}
            </button>

            <div className="pp-secure">
              <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                <path d="M5 1L1 3v3.5C1 9 3 11 5 11s4-2 4-4.5V3L5 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
              </svg>
              SSL encrypted · 256-bit secure
            </div>

          </div>
        </div>

      </div>
    </>
  );
}