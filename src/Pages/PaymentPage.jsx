import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FaCcVisa } from "react-icons/fa";
const MPESA_ICON = (
  <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
    <rect x="0.5" y="0.5" width="17" height="13" rx="1.5" stroke="currentColor"/>
    <path d="M4 7h10M9 4v6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

const METHODS = [
  { id: "mpesa",  label: "M-Pesa",               icon: MPESA_ICON          },
  { id: "card",   label: "Visa / Mastercard",     icon: <FaCcVisa />        },
];

export default function PaymentPage() {
  const { state } = useLocation();
  const navigate  = useNavigate();

  const [method,  setMethod]  = useState("mpesa");
  const [phone,   setPhone]   = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  if (!state) {
    return (
      <>
        <div className="min-h-screen bg-[#fafaf8] p-6 text-gray-900 transition-colors duration-1500 ease-in-out">
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
    if (method === "card" && (!cardNumber.trim() || !cardExpiry.trim() || !cardCvc.trim())) {
      setError("Please enter your card number, expiry date, and security code.");
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
      <div className="min-h-screen bg-[#fafaf8] text-gray-900 transition-colors duration-1500 ease-in-out">

        {/* ══ LEFT: summary ══ */}
          <div className="bg-[#faf7e8] p-6 text-gray-900 transition-colors duration-1500 ease-in-out lg:p-10">
          <div  aria-hidden="true" />
          <div  aria-hidden="true" />

          <div >
            <Link to="/" >Star<em>Hotel</em></Link>

            <div >
              <div  />
              <span >Booking Summary</span>
            </div>

            <h2 >
              Your <em>Reservation</em>
            </h2>

            <div >
              <div >
                <span >Room</span>
                <span >{room?.name}</span>
              </div>
              <div >
                <span >Check-in</span>
                <span >{formatDate(checkIn)}</span>
              </div>
              <div >
                <span >Check-out</span>
                <span >{formatDate(checkOut)}</span>
              </div>
              <div >
                <span >Duration</span>
                <span >{nights} night{nights !== 1 ? "s" : ""}</span>
              </div>
              <div >
                <span >Guests</span>
                <span >{guests}</span>
              </div>
              {addons && Object.values(addons).some(Boolean) && (
                <div >
                  <span >Extras</span>
                  <span >
                    {Object.entries(addons)
                      .filter(([, v]) => v)
                      .map(([k]) => k.charAt(0).toUpperCase() + k.slice(1))
                      .join(", ")}
                  </span>
                </div>
              )}
            </div>

            <div >
              <span >Total Due</span>
              <span >
                KES {total?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* ══ RIGHT: payment ══ */}
        <div className="p-5 sm:p-10">
          <div className="mx-auto max-w-xl rounded border border-gray-200 bg-[#fffaf0] p-5 shadow-sm transition-colors duration-1000 ease-in-out">

            <div >
              <div  />
              <span >Secure Checkout</span>
            </div>

            <h1 className="text-xl font-semibold">
              Complete <em>Payment</em>
            </h1>
            <p >
              Choose your preferred payment method below.
              All transactions are encrypted and secure.
            </p>

            <div >Payment Method</div>

            {/* ── Method tiles ── */}
            <div className="grid gap-3 sm:grid-cols-2">
              {METHODS.map(({ id, label, icon }) => (
                <div
                  key={id}
                  className={`flex cursor-pointer items-center justify-between rounded border p-3 transition-colors duration-1000 ease-in-out ${method === id ? "border-gray-900 bg-[#faf7e8]" : "border-gray-200"}`}
                  onClick={() => { setMethod(id); setError(""); }}
                  role="radio"
                  aria-checked={method === id}
                  tabIndex={0}
                  onKeyDown={e => e.key === "Enter" && setMethod(id)}
                >
                  <div >
                    <div >{icon}</div>
                    <span >{label}</span>
                  </div>
                  <div >
                    <div  />
                  </div>
                </div>
              ))}
            </div>

            {/* Payment details */}
            <div>
              <div >
                <label htmlFor={method === "mpesa" ? "mpesa-phone" : "card-number"}>
                  {method === "mpesa" ? "M-Pesa Number" : "Card Number"}
                </label>
                <div >
                  {method === "mpesa" ? <input id="mpesa-phone" type="tel" placeholder="+254 700 000 000" value={phone} onChange={e => { setPhone(e.target.value); setError(""); }} className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600" /> : <input id="card-number" inputMode="numeric" placeholder="1234 5678 9012 3456" value={cardNumber} onChange={e => { setCardNumber(e.target.value); setError(""); }} className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600" />}
                </div>
              </div>
              {method === "card" && <div className="mt-3 grid grid-cols-2 gap-3"><input aria-label="Card expiry" placeholder="MM/YY" value={cardExpiry} onChange={e => setCardExpiry(e.target.value)} className="rounded border border-gray-300 px-3 py-2 outline-none focus:border-green-600" /><input aria-label="Card security code" inputMode="numeric" placeholder="CVC" value={cardCvc} onChange={e => setCardCvc(e.target.value)} className="rounded border border-gray-300 px-3 py-2 outline-none focus:border-green-600" /></div>}
            </div>

            {error && (
              <div  role="alert">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="5.5" stroke="#c0392b"/>
                  <path d="M6 3.5v3M6 8.5v.5" stroke="#c0392b" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                {error}
              </div>
            )}

            <button
              className="mt-5 w-full rounded bg-gray-900 px-4 py-3 font-medium text-white hover:bg-gray-700 transition-colors duration-1000 ease-in-out disabled:cursor-not-allowed disabled:opacity-60"
              onClick={handlePayment}
              disabled={loading || !validDates}
            >
              {loading ? (
                <><span  /> Processing…</>
              ) : (
                <>
                  Pay KES {total?.toLocaleString()}
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                    <path d="M1 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              )}
            </button>

            <div >
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