import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/axios";
// Minimal icon map for facilities
const FACILITY_ICONS = {
  wifi: "◈", pool: "◉", ac: "❄", gym: "◎", breakfast: "◑", parking: "◐",
  spa: "◈", bar: "◉", restaurant: "◎", tv: "◐", balcony: "◑", safe: "◈",
};
const getFacilityIcon = (f) => {
  const key = f.toLowerCase().replace(/\s+/g, "");
  for (const k in FACILITY_ICONS) {
    if (key.includes(k)) return FACILITY_ICONS[k];
  }
  return "·";
};

export default function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentImage, setCurrentImage] = useState(0);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await API.get("/accommodations");
        setRooms(res.data);
      } catch {
        setError("Could not load rooms.");
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-[#fafaf8] text-gray-900 transition-colors duration-1500 ease-in-out">
      <div className="flex items-center gap-3">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-green-600" />
        <p>Loading room</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="p-8 text-center text-red-700">
      <p>{error}</p>
    </div>
  );

  const room = rooms.find((r) => String(r._id) === String(id));

  if (!room) return (
    <div className="p-8 text-center text-gray-900">
      <p>Room not found.</p>
    </div>
  );

  const images     = room.images || [];
  const facilities = room.facilities || [];

  // Split room name for italic accent on last word
  const nameParts = room.name.trim().split(" ");
  const nameMain  = nameParts.slice(0, -1).join(" ");
  const nameLast  = nameParts[nameParts.length - 1];

  return (
    <>
      <div className="min-h-screen bg-[#fafaf8] text-gray-900 transition-colors duration-1500 ease-in-out">

        {/* ── Fixed back button ── */}
        <button className="absolute left-4 top-4 z-10 rounded border border-white/70 bg-black/30 px-3 py-2 text-xl text-gray-900 hover:bg-black/50" onClick={() => navigate(-1)}>
          ← Back
        </button>

        {/* ── Fullscreen hero ── */}
        <div className="relative h-[28rem] overflow-hidden bg-[#fffaf0] transition-colors duration-1000 ease-in-out">
          <img
            className="h-full w-full object-cover"
            src={images[currentImage] || "https://via.placeholder.com/1400x900"}
            alt={room.name}
            onLoad={() => setImgLoaded(true)}
          />
          <div className="absolute inset-0 bg-black/35" />

          {/* Hero text */}
          <div className="absolute inset-x-0 bottom-0 p-6 text-gray-900 sm:p-10">
            <div >Accommodation</div>
            <h1 className="mt-2 text-xl font-semibold">
              {nameMain} <em>{nameLast}</em>
            </h1>
            <div className="mt-4 flex flex-wrap gap-3 text-xl">
              {room.occupancy && (
                <div >
                  👤 Up to <strong>&nbsp;{room.occupancy} guests</strong>
                </div>
              )}
              <div >
                <strong>KES {room.price?.toLocaleString()}</strong>&nbsp;/ night
              </div>
            </div>
          </div>

          {/* Thumbnail rail */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto bg-[#fffaf0] p-3 transition-colors duration-1000 ease-in-out">
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
        </div>

        {/* ── Main content ── */}
        <div className="mx-auto grid max-w-6xl gap-8 p-5 sm:p-10 lg:grid-cols-[1fr_22rem]">

          {/* Left — description + facilities */}
          <div >

            <div className="mb-3 text-xl font-semibold">About this room</div>
            <p className="leading-7 text-gray-900">{room.description}</p>

            {facilities.length > 0 && (
              <>
                <div className="mb-3 mt-8 text-xl font-semibold">Facilities</div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {facilities.map((f, i) => (
                    <div key={i} className="rounded border border-gray-200 bg-[#fffaf0] p-3 text-xl text-gray-900 transition-colors duration-1000 ease-in-out">
                      <span className="mr-2" aria-hidden="true">
                        {getFacilityIcon(typeof f === "string" ? f : f.name || "facility")}
                      </span>
                      <span>{typeof f === "string" ? f : f.name || "Facility"}</span>
                      {typeof f === "object" && f.description && (
                        <span className="mt-1 block text-sm text-gray-500">{f.description}</span>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Right — sticky booking card */}
          <div >
            <div className="rounded border border-gray-200 bg-[#fffaf0] p-5 shadow-sm transition-colors duration-1000 ease-in-out lg:sticky lg:top-5 lg:self-start">

              <div >
                <div >Starting from</div>
                <div >
                  <sup>KES </sup>
                  {room.price?.toLocaleString()}
                </div>
              </div>

              {room.occupancy && (
                <div >
                  <span >👤</span>
                  <span>Sleeps&nbsp;<span >{room.occupancy}</span></span>
                </div>
              )}

              <button
                className="mt-5 w-full rounded bg-gray-900 px-4 py-3 font-medium text-white hover:bg-gray-700 transition-colors duration-1000 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-900"
                onClick={() => navigate(`/booking/${room._id}`, { state: { room } })}
              >
                <span>Reserve This Room</span>
              </button>

              <p >
                Free cancellation · No payment required today
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
