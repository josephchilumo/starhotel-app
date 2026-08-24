import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/axios";

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
    <div className="min-h-screen bg-[#fafaf8] p-6 text-gray-900 transition-colors duration-1500 ease-in-out">
      Loading rooms…
    </div>
  );
  if (error) return (
    <div className="min-h-screen bg-[#fafaf8] p-6 text-red-700 transition-colors duration-1500 ease-in-out">
      {error}
    </div>
  );

  const selectedRoom = rooms.find((r) => String(r._id) === String(id));
  const otherRooms   = rooms.filter((r) => String(r._id) !== String(id));

  if (!selectedRoom) return (
    <div className="min-h-screen bg-[#fafaf8] p-6 text-gray-900 transition-colors duration-1500 ease-in-out">
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

      <div className="min-h-screen bg-[#fafaf8] text-gray-900 transition-colors duration-1500 ease-in-out">

        {/* ── Hero ── */}
        <div className="relative h-72 overflow-hidden bg-[#fffaf0] sm:h-96 transition-colors duration-1000 ease-in-out">
          <img
            src={images[currentImage] || "https://via.placeholder.com/1200x500"}
            alt={selectedRoom.name}
            className="h-full w-full object-cover"
            onLoad={() => setImgLoaded(true)}
          />
          <div className="absolute inset-0 bg-black/30" />

          <button className="absolute left-4 top-4 rounded border border-white/70 bg-black/30 px-3 py-2 text-xl text-gray-900 hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-green-600" onClick={() => navigate("/rooms")}>
            ← Rooms
          </button>

          <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 p-5 text-gray-900 sm:p-8">
            <h1 className="text-xl font-semibold">{selectedRoom.name}</h1>
            <div className="text-xl font-semibold">
              KES {selectedRoom.price.toLocaleString()} <span className="text-xl font-normal">/ night</span>
            </div>
          </div>
        </div>

        {/* ── Thumbnail strip ── */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto border-b border-gray-200 bg-[#fffaf0] p-3 transition-colors duration-1000 ease-in-out">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                className={`h-14 w-20 shrink-0 rounded border-2 object-cover ${currentImage === i ? "border-green-600" : "border-transparent"}`}
                onClick={() => { setCurrentImage(i); setImgLoaded(false); }}
              />
            ))}
          </div>
        )}

        {/* ── Two-column body ── */}
        <div className="mx-auto grid max-w-6xl gap-6 p-4 sm:p-8 lg:grid-cols-2">

          {/* Left — Room info + addons */}
          <div >
            <div className="rounded border border-gray-200 bg-[#fffaf0] p-5 shadow-sm transition-colors duration-1000 ease-in-out">
              <div className="mb-4 border-b border-gray-200 pb-3 text-xl font-semibold text-gray-900">Room Details</div>

              <p className="mb-5 leading-7 text-gray-900">{selectedRoom.description}</p>

              <div className="mb-6 text-xl font-semibold text-green-600">
                KES {selectedRoom.price.toLocaleString()}
                <span className="ml-2 text-xl font-normal text-gray-900">per night</span>
              </div>

              {/* Occupancy badge */}
              {selectedRoom.occupancy && (
                <div className="mb-6 inline-flex rounded bg-[#fffaf0] px-3 py-2 text-xl text-gray-900 transition-colors duration-1000 ease-in-out">
                  <span className="mr-2">👤</span> Up to {selectedRoom.occupancy} guests
                </div>
              )}

              {/* Add-ons */}
              <div className="mb-3 text-xl font-semibold text-gray-900">Enhance Your Stay</div>
              {Object.keys(addonOptions).map((key) => {
                const o = addonOptions[key];
                return (
                  <div
                    key={key}
                    className={`mb-3 flex cursor-pointer items-center justify-between rounded border p-3 transition-colors duration-1000 ease-in-out hover:border-green-600 ${addons[key] ? "border-green-600 bg-[#fffaf0]" : "border-gray-200"}`}
                    onClick={() => handleAddonChange(key)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-5 w-5 items-center justify-center rounded border ${addons[key] ? "border-gray-900 bg-gray-900" : "border-gray-300"}`}>
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{o.label}</div>
                        <div className="text-xl text-gray-900">{o.sub}</div>
                      </div>
                    </div>
                    <div className="text-right text-xl font-medium text-gray-900">
                      KES {o.price.toLocaleString()}
                      <span className="block text-xl font-normal text-gray-900"> {o.type === "perNight" ? "/ night" : " once"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right — Booking form */}
          <div >
            <div className="rounded border border-gray-200 bg-[#fffaf0] p-5 shadow-sm transition-colors duration-1000 ease-in-out">
              <div className="mb-5 border-b border-gray-200 pb-3 text-xl font-semibold text-gray-900">Your Details</div>

              <div className="mb-4">
                <label className="mb-1 block text-xl font-medium text-gray-900">Full Name</label>
                <input className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600" type="text" placeholder="Jane Mwangi" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>

              <div className="mb-4">
                <label className="mb-1 block text-xl font-medium text-gray-900">Phone Number</label>
                <input className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600" type="text" placeholder="+254 700 000 000" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>

              <div className="mb-4">
                <label className="mb-1 block text-xl font-medium text-gray-900">Email Address</label>
                <input className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600" type="email" placeholder="jane@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div className="mb-4">
                <label className="mb-1 block text-xl font-medium text-gray-900">Dates</label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600" type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
                  <input className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600" type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
                </div>
              </div>

              <div className="mb-5">
                <label className="mb-1 block text-xl font-medium text-gray-900">Guests</label>
                <input className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600" type="number" value={guests} min="1" onChange={(e) => setGuests(Number(e.target.value))} />
              </div>

              {/* Summary */}
              <div className="mb-5 rounded bg-[#fffaf0] p-4 text-xl transition-colors duration-1000 ease-in-out">
                <div className="flex justify-between border-b border-gray-200 py-2 text-gray-900">
                  <span>Room × {nights} night{nights !== 1 ? "s" : ""}</span>
                  <span>KES {roomTotal.toLocaleString()}</span>
                </div>
                {addonTotal > 0 && (
                  <div className="flex justify-between border-b border-gray-200 py-2 text-gray-900">
                    <span>Extras</span>
                    <span>KES {addonTotal.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 text-xl font-semibold text-gray-900">
                  <span>Total Due</span>
                  <span className="text-green-600">KES {total.toLocaleString()}</span>
                </div>
              </div>

              <button className="w-full rounded bg-gray-900 px-4 py-3 font-medium text-white hover:bg-gray-700 transition-colors duration-1000 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2" onClick={handleConfirm}>
                <span>Confirm & Proceed to Payment</span>
              </button>
            </div>
          </div>

        </div>

        {/* ── Divider ── */}
        {otherRooms.length > 0 && (
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4">
            <div className="h-px flex-1 bg-gray-200" />
            <div className="h-2 w-2 rounded-full bg-gray-900" />
            <div className="h-px flex-1 bg-gray-200" />
          </div>
        )}

        {/* ── Other rooms ── */}
        {otherRooms.length > 0 && (
          <div className="mx-auto max-w-6xl px-4 pb-10">
            <div className="mb-4 text-xl font-semibold text-gray-900">You Might Also Like</div>
            <div className="grid gap-4 sm:grid-cols-3">
              {otherRooms.slice(0, 3).map((room) => (
                <div key={room._id} className="cursor-pointer overflow-hidden rounded border border-gray-200 bg-[#fafaf8] transition-colors duration-1000 ease-in-out hover:border-gray-900" onClick={() => navigate(`/booking/${room._id}`)}>
                  <img src={room.images?.[0]} alt={room.name} className="h-40 w-full object-cover" />
                  <div className="p-3">
                    <div className="font-medium text-gray-900">{room.name}</div>
                    <div className="mt-1 text-xl text-green-600">KES {room.price.toLocaleString()}</div>
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
