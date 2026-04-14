import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/axios";

// ─── Inline styles & keyframes injected once ───────────────────────────────
const GLOBAL_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --sand:    #f5efe6;
    --sand-dk: #e8ddd0;
    --clay:    #c4a882;
    --ocean:   #1a3a4a;
    --ocean-lt:#2d5a70;
    --foam:    #ffffff;
    --ink:     #1c1917;
    --mist:    #6b7280;
    --gold:    #b8965a;
    --success: #2d6a4f;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body { background: var(--sand); }

  .booking-root {
    min-height: 100vh;
    background: var(--sand);
    font-family: 'DM Sans', sans-serif;
    color: var(--ink);
  }

  /* ── Hero banner ── */
  .bk-hero {
    position: relative;
    height: 38vh;
    min-height: 260px;
    overflow: hidden;
  }
  .bk-hero img {
    width: 100%; height: 100%;
    object-fit: cover;
    transform: scale(1.06);
    transition: transform 8s ease;
  }
  .bk-hero img.loaded { transform: scale(1); }
  .bk-hero-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to bottom,
      rgba(26,58,74,0.25) 0%,
      rgba(26,58,74,0.65) 100%);
  }
  .bk-hero-content {
    position: absolute; bottom: 0; left: 0; right: 0;
    padding: 2rem 2.5rem;
    display: flex; align-items: flex-end; justify-content: space-between;
  }
  .bk-hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.8rem, 4vw, 3rem);
    font-weight: 300;
    color: var(--foam);
    line-height: 1.1;
    letter-spacing: -0.02em;
  }
  .bk-hero-price {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.1rem, 2.5vw, 1.6rem);
    color: var(--clay);
    font-style: italic;
    white-space: nowrap;
    margin-left: 1rem;
  }

  /* ── Back button ── */
  .bk-back {
    position: absolute; top: 1.25rem; left: 1.5rem; z-index: 10;
    display: flex; align-items: center; gap: 0.4rem;
    background: rgba(255,255,255,0.15);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.3);
    color: var(--foam);
    font-size: 0.8rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 0.45rem 1rem;
    cursor: pointer;
    transition: background 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .bk-back:hover { background: rgba(255,255,255,0.28); }

  /* ── Thumbnail strip ── */
  .bk-thumbs {
    display: flex; gap: 0.5rem;
    padding: 0.75rem 2.5rem;
    background: var(--ocean);
    overflow-x: auto;
    scrollbar-width: none;
  }
  .bk-thumbs::-webkit-scrollbar { display: none; }
  .bk-thumb {
    width: 64px; height: 44px;
    object-fit: cover;
    flex-shrink: 0;
    cursor: pointer;
    opacity: 0.55;
    border: 2px solid transparent;
    transition: opacity 0.2s, border-color 0.2s;
  }
  .bk-thumb.active { opacity: 1; border-color: var(--clay); }

  /* ── Main layout ── */
  .bk-body {
    max-width: 1100px;
    margin: 0 auto;
    padding: 2.5rem 1.5rem 4rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
  @media (max-width: 768px) {
    .bk-body { grid-template-columns: 1fr; padding: 1.5rem 1rem 3rem; }
    .bk-hero-content { padding: 1.5rem; }
    .bk-thumbs { padding: 0.6rem 1rem; }
  }

  /* ── Panel card ── */
  .bk-panel {
    background: var(--foam);
    border: 1px solid var(--sand-dk);
    padding: 2rem;
  }
  .bk-panel-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.3rem;
    font-weight: 400;
    color: var(--ocean);
    letter-spacing: 0.02em;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--sand-dk);
    margin-bottom: 1.5rem;
  }

  /* ── Room info ── */
  .bk-desc {
    font-size: 0.875rem;
    color: var(--mist);
    line-height: 1.75;
    margin-bottom: 1.25rem;
  }
  .bk-price-tag {
    display: inline-flex; align-items: baseline; gap: 0.3rem;
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.5rem;
    color: var(--gold);
    margin-bottom: 1.5rem;
  }
  .bk-price-tag span { font-size: 0.8rem; color: var(--mist); font-family: 'DM Sans', sans-serif; }

  /* ── Addon checkboxes ── */
  .bk-addons-title {
    font-size: 0.7rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--mist);
    margin-bottom: 0.75rem;
  }
  .bk-addon {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.7rem 0;
    border-bottom: 1px solid var(--sand-dk);
    cursor: pointer;
    transition: background 0.15s;
  }
  .bk-addon:last-child { border-bottom: none; }
  .bk-addon-left { display: flex; align-items: center; gap: 0.75rem; }
  .bk-addon-check {
    width: 18px; height: 18px;
    border: 1.5px solid var(--clay);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: background 0.2s;
  }
  .bk-addon-check.checked { background: var(--ocean); border-color: var(--ocean); }
  .bk-addon-check svg { display: none; }
  .bk-addon-check.checked svg { display: block; }
  .bk-addon-name { font-size: 0.875rem; color: var(--ink); }
  .bk-addon-sub { font-size: 0.72rem; color: var(--mist); margin-top: 0.1rem; }
  .bk-addon-price { font-size: 0.8rem; color: var(--gold); font-family: 'Cormorant Garamond', serif; }

  /* ── Form inputs ── */
  .bk-field {
    display: flex; flex-direction: column; gap: 0.35rem;
    margin-bottom: 1rem;
  }
  .bk-label {
    font-size: 0.68rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--mist);
  }
  .bk-input {
    width: 100%;
    background: var(--sand);
    border: 1px solid var(--sand-dk);
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    font-family: 'DM Sans', sans-serif;
    color: var(--ink);
    outline: none;
    transition: border-color 0.2s, background 0.2s;
  }
  .bk-input:focus { border-color: var(--ocean); background: var(--foam); }
  .bk-input::placeholder { color: #aaa; }
  .bk-input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0.4; }

  .bk-date-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }

  /* ── Summary ── */
  .bk-summary {
    background: var(--sand);
    padding: 1.25rem;
    margin-top: 1.5rem;
  }
  .bk-summary-row {
    display: flex; justify-content: space-between; align-items: center;
    font-size: 0.825rem;
    color: var(--mist);
    padding: 0.4rem 0;
  }
  .bk-summary-total {
    display: flex; justify-content: space-between; align-items: center;
    padding-top: 0.75rem;
    margin-top: 0.5rem;
    border-top: 1px solid var(--sand-dk);
  }
  .bk-summary-total-label {
    font-size: 0.7rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--ocean);
  }
  .bk-summary-total-amount {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.5rem;
    color: var(--ocean);
  }

  /* ── CTA Button ── */
  .bk-cta {
    width: 100%;
    margin-top: 1.5rem;
    padding: 1rem;
    background: var(--ocean);
    color: var(--foam);
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.78rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.25s, transform 0.15s;
    position: relative;
    overflow: hidden;
  }
  .bk-cta::after {
    content: '';
    position: absolute; inset: 0;
    background: var(--gold);
    transform: translateX(-101%);
    transition: transform 0.3s ease;
    z-index: 0;
  }
  .bk-cta:hover::after { transform: translateX(0); }
  .bk-cta span { position: relative; z-index: 1; }
  .bk-cta:active { transform: scale(0.98); }

  /* ── Other rooms ── */
  .bk-others {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 1.5rem 4rem;
  }
  .bk-others-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.6rem;
    font-weight: 300;
    color: var(--ocean);
    margin-bottom: 1.25rem;
    letter-spacing: -0.01em;
  }
  .bk-others-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
  @media (max-width: 640px) {
    .bk-others-grid { grid-template-columns: repeat(2, 1fr); }
    .bk-others { padding: 0 1rem 3rem; }
  }
  .bk-other-card {
    cursor: pointer;
    overflow: hidden;
    border: 1px solid var(--sand-dk);
    background: var(--foam);
    transition: transform 0.25s, box-shadow 0.25s;
  }
  .bk-other-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(26,58,74,0.12); }
  .bk-other-img {
    width: 100%; height: 130px;
    object-fit: cover;
    display: block;
    transition: transform 0.4s ease;
  }
  .bk-other-card:hover .bk-other-img { transform: scale(1.05); }
  .bk-other-info { padding: 0.75rem; }
  .bk-other-name { font-size: 0.825rem; color: var(--ink); margin-bottom: 0.2rem; }
  .bk-other-price {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1rem;
    color: var(--gold);
  }

  /* ── Divider ── */
  .bk-divider {
    max-width: 1100px;
    margin: 0 auto 2rem;
    padding: 0 1.5rem;
    display: flex; align-items: center; gap: 1rem;
  }
  .bk-divider-line { flex: 1; height: 1px; background: var(--sand-dk); }
  .bk-divider-dot {
    width: 6px; height: 6px;
    background: var(--clay);
    transform: rotate(45deg);
  }

  /* ── Fade-in animation ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fade-up { animation: fadeUp 0.5s ease both; }
  .fade-up-1 { animation-delay: 0.05s; }
  .fade-up-2 { animation-delay: 0.12s; }
  .fade-up-3 { animation-delay: 0.2s; }
`;

function BookingRoom() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentImage, setCurrentImage] = useState(0);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [addons, setAddons] = useState({
    breakfast: false,
    airport: false,
    extraBed: false,
  });

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await API.get("/accommodations");
        setRooms(res.data);
      } catch (err) {
        setError("Could not load rooms.");
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const addonOptions = {
    breakfast: { label: "Breakfast Included", sub: "Continental buffet daily", price: 1500, type: "perNight" },
    airport:   { label: "Airport Pickup",      sub: "Private transfer",          price: 3000, type: "oneTime" },
    extraBed:  { label: "Extra Bed",            sub: "Full size bed",             price: 2000, type: "perNight" },
  };

  const handleAddonChange = (name) =>
    setAddons((prev) => ({ ...prev, [name]: !prev[name] }));

  const getNights = () => {
    if (!checkIn || !checkOut) return 0;
    const diff = (new Date(checkOut) - new Date(checkIn)) / 86400000;
    return diff > 0 ? diff : 0;
  };
  const nights = getNights();

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5efe6", fontFamily: "DM Sans, sans-serif", color: "#6b7280", letterSpacing: "0.1em", fontSize: "0.8rem", textTransform: "uppercase" }}>
      Loading rooms…
    </div>
  );
  if (error) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5efe6", fontFamily: "DM Sans, sans-serif", color: "#c0392b" }}>
      {error}
    </div>
  );

  const selectedRoom = rooms.find((r) => String(r._id) === String(id));
  const otherRooms   = rooms.filter((r) => String(r._id) !== String(id));

  if (!selectedRoom) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5efe6", fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", color: "#1a3a4a" }}>
      Room not found.
    </div>
  );

  const images     = selectedRoom.images || [];
  const roomTotal  = nights * selectedRoom.price;
  const addonTotal = Object.keys(addons).reduce((sum, key) => {
    if (!addons[key]) return sum;
    const o = addonOptions[key];
    return o.type === "perNight" ? sum + o.price * nights : sum + o.price;
  }, 0);
  const total = roomTotal + addonTotal;

  const handleConfirm = () => {
    if (!fullName.trim())        return alert("Please enter your full name.");
    if (!phone.trim())           return alert("Please enter your phone number.");
    if (!email.trim())           return alert("Please enter your email.");
    if (!checkIn || !checkOut || nights === 0) return alert("Please select valid check-in and check-out dates.");
    navigate("/payment", { state: { room: selectedRoom, nights, total, checkIn, checkOut, guests, addons, fullName, phone, email } });
  };

  return (
    <>
      <style>{GLOBAL_STYLE}</style>

      <div className="booking-root">

        {/* ── Hero ── */}
        <div className="bk-hero">
          <img
            src={images[currentImage] || "https://via.placeholder.com/1200x500"}
            alt={selectedRoom.name}
            className={imgLoaded ? "loaded" : ""}
            onLoad={() => setImgLoaded(true)}
          />
          <div className="bk-hero-overlay" />

          <button className="bk-back" onClick={() => navigate("/rooms")}>
            ← Rooms
          </button>

          <div className="bk-hero-content">
            <h1 className="bk-hero-title">{selectedRoom.name}</h1>
            <div className="bk-hero-price">
              KES {selectedRoom.price.toLocaleString()} <span style={{ fontSize: "0.9rem", color: "#c4a882" }}>/ night</span>
            </div>
          </div>
        </div>

        {/* ── Thumbnail strip ── */}
        {images.length > 1 && (
          <div className="bk-thumbs">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                className={`bk-thumb${currentImage === i ? " active" : ""}`}
                onClick={() => { setCurrentImage(i); setImgLoaded(false); }}
              />
            ))}
          </div>
        )}

        {/* ── Two-column body ── */}
        <div className="bk-body">

          {/* Left — Room info + addons */}
          <div className="fade-up fade-up-1">
            <div className="bk-panel">
              <div className="bk-panel-title">Room Details</div>

              <p className="bk-desc">{selectedRoom.description}</p>

              <div className="bk-price-tag">
                KES {selectedRoom.price.toLocaleString()}
                <span>per night</span>
              </div>

              {/* Occupancy badge */}
              {selectedRoom.occupancy && (
                <div style={{ fontSize: "0.78rem", color: "#6b7280", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span style={{ color: "#1a3a4a" }}>👤</span> Up to {selectedRoom.occupancy} guests
                </div>
              )}

              {/* Add-ons */}
              <div className="bk-addons-title">Enhance Your Stay</div>
              {Object.keys(addonOptions).map((key) => {
                const o = addonOptions[key];
                return (
                  <div
                    key={key}
                    className="bk-addon"
                    onClick={() => handleAddonChange(key)}
                  >
                    <div className="bk-addon-left">
                      <div className={`bk-addon-check${addons[key] ? " checked" : ""}`}>
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div>
                        <div className="bk-addon-name">{o.label}</div>
                        <div className="bk-addon-sub">{o.sub}</div>
                      </div>
                    </div>
                    <div className="bk-addon-price">
                      KES {o.price.toLocaleString()}
                      <span style={{ fontSize: "0.68rem", color: "#6b7280", fontFamily: "DM Sans, sans-serif" }}> {o.type === "perNight" ? "/ night" : " once"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right — Booking form */}
          <div className="fade-up fade-up-2">
            <div className="bk-panel">
              <div className="bk-panel-title">Your Details</div>

              <div className="bk-field">
                <label className="bk-label">Full Name</label>
                <input className="bk-input" type="text" placeholder="Jane Mwangi" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>

              <div className="bk-field">
                <label className="bk-label">Phone Number</label>
                <input className="bk-input" type="text" placeholder="+254 700 000 000" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>

              <div className="bk-field">
                <label className="bk-label">Email Address</label>
                <input className="bk-input" type="email" placeholder="jane@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div className="bk-field">
                <label className="bk-label">Dates</label>
                <div className="bk-date-row">
                  <input className="bk-input" type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
                  <input className="bk-input" type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
                </div>
              </div>

              <div className="bk-field">
                <label className="bk-label">Guests</label>
                <input className="bk-input" type="number" value={guests} min="1" onChange={(e) => setGuests(Number(e.target.value))} />
              </div>

              {/* Summary */}
              <div className="bk-summary">
                <div className="bk-summary-row">
                  <span>Room × {nights} night{nights !== 1 ? "s" : ""}</span>
                  <span>KES {roomTotal.toLocaleString()}</span>
                </div>
                {addonTotal > 0 && (
                  <div className="bk-summary-row">
                    <span>Extras</span>
                    <span>KES {addonTotal.toLocaleString()}</span>
                  </div>
                )}
                <div className="bk-summary-total">
                  <span className="bk-summary-total-label">Total Due</span>
                  <span className="bk-summary-total-amount">KES {total.toLocaleString()}</span>
                </div>
              </div>

              <button className="bk-cta" onClick={handleConfirm}>
                <span>Confirm & Proceed to Payment</span>
              </button>
            </div>
          </div>

        </div>

        {/* ── Divider ── */}
        {otherRooms.length > 0 && (
          <div className="bk-divider">
            <div className="bk-divider-line" />
            <div className="bk-divider-dot" />
            <div className="bk-divider-line" />
          </div>
        )}

        {/* ── Other rooms ── */}
        {otherRooms.length > 0 && (
          <div className="bk-others fade-up fade-up-3">
            <div className="bk-others-title">You Might Also Like</div>
            <div className="bk-others-grid">
              {otherRooms.slice(0, 3).map((room) => (
                <div key={room._id} className="bk-other-card" onClick={() => navigate(`/booking/${room._id}`)}>
                  <img src={room.images?.[0]} alt={room.name} className="bk-other-img" />
                  <div className="bk-other-info">
                    <div className="bk-other-name">{room.name}</div>
                    <div className="bk-other-price">KES {room.price.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </>
  );
}

export default BookingRoom;
