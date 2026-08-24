import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API from "../utils/axios";

const EMPTY = { name: "", occupancy: 1, price: "", description: "", capacity: 1, location: "", isAvailable: true, facilities: [] };

export default function RoomForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(id);
  const [form, setForm] = useState(EMPTY);
  const [facilities, setFacilities] = useState([]);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const facilityResponse = await API.get("/facilities");
        const facilityData = facilityResponse.data;
        setFacilities(Array.isArray(facilityData) ? facilityData : facilityData.facilities || []);
        if (editing) {
          const { data } = await API.get(`/accommodations/${id}`);
          setForm({ ...EMPTY, ...data, occupancy: data.occupancy || 1, capacity: data.capacity || 1, facilities: data.facilities?.map((facility) => facility._id || facility) || [] });
          setExistingImages(data.images || []);
        }
      } catch {
        setError("Could not load room details.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, editing]);

  const update = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const toggleFacility = (facilityId) => {
    setForm((current) => ({
      ...current,
      facilities: current.facilities.includes(facilityId) ? current.facilities.filter((value) => value !== facilityId) : [...current.facilities, facilityId],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const uploadedImages = [];
      if (images.length) {
        const data = new FormData();
        images.forEach((image) => data.append("images", image));
        data.append("category", "rooms");
        const response = await API.post("/gallery/upload", data);
        uploadedImages.push(...response.data.map((image) => image.imageUrl));
      }
      const payload = { ...form, occupancy: Number(form.occupancy), price: Number(form.price), capacity: Number(form.capacity), images: [...existingImages, ...uploadedImages] };
      if (editing) await API.put(`/accommodations/${id}`, payload);
      else await API.post("/accommodations", payload);
      navigate("/admin/rooms");
    } catch (requestError) {
      setError(requestError.response?.data?.msg || "Could not save room. Check your admin sign in and try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-gray-500">Loading room...</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6 text-gray-900">
      <div className="flex items-end justify-between border-b border-gray-200 pb-5"><div><p className="text-xs uppercase tracking-[0.2em] text-green-700">Accommodation</p><h1 className="mt-2 font-serif text-3xl">{editing ? "Edit room" : "Add room"}</h1></div><Link to="/admin/rooms" className="text-sm text-gray-600 hover:text-green-700">Back to rooms</Link></div>
      {error && <p className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <div className="grid gap-4 rounded border border-gray-200 bg-[#fffdf2] p-5 sm:grid-cols-2">
        <label className="text-sm font-medium">Room name<input required name="name" value={form.name} onChange={update} className="mt-2 w-full rounded border border-gray-300 bg-white px-3 py-2.5" /></label>
        <label className="text-sm font-medium">Location<input required name="location" value={form.location} onChange={update} className="mt-2 w-full rounded border border-gray-300 bg-white px-3 py-2.5" /></label>
        <label className="text-sm font-medium">Price per night<input required min="0" type="number" name="price" value={form.price} onChange={update} className="mt-2 w-full rounded border border-gray-300 bg-white px-3 py-2.5" /></label>
        <label className="text-sm font-medium">Guests<input required min="1" type="number" name="occupancy" value={form.occupancy} onChange={update} className="mt-2 w-full rounded border border-gray-300 bg-white px-3 py-2.5" /></label>
        <label className="text-sm font-medium">Capacity<input required min="1" type="number" name="capacity" value={form.capacity} onChange={update} className="mt-2 w-full rounded border border-gray-300 bg-white px-3 py-2.5" /></label>
        <label className="flex items-center gap-3 self-end pb-2 text-sm font-medium"><input type="checkbox" name="isAvailable" checked={form.isAvailable} onChange={update} /> Available for booking</label>
        <label className="text-sm font-medium sm:col-span-2">Description<textarea required name="description" rows="4" value={form.description} onChange={update} className="mt-2 w-full rounded border border-gray-300 bg-white px-3 py-2.5" /></label>
      </div>
      <div className="rounded border border-gray-200 bg-[#fffdf2] p-5"><h2 className="font-serif text-xl">Room images</h2><input className="mt-3 block w-full text-sm" type="file" accept="image/*" multiple onChange={(event) => setImages(Array.from(event.target.files || []))} /><p className="mt-2 text-xs text-gray-500">Choose up to 12 images. New images are uploaded when you save.</p>{existingImages.length > 0 && <div className="mt-4 grid grid-cols-3 gap-3">{existingImages.map((src) => <img key={src} src={src} alt="Room" className="h-24 w-full rounded object-cover" />)}</div>}</div>
      <div className="rounded border border-gray-200 bg-[#fffdf2] p-5"><h2 className="font-serif text-xl">Facilities</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{facilities.map((facility) => <label key={facility._id} className="flex items-center gap-3 text-sm"><input type="checkbox" checked={form.facilities.includes(facility._id)} onChange={() => toggleFacility(facility._id)} />{facility.name}</label>)}</div></div>
      <button disabled={saving} className="rounded bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50">{saving ? "Saving..." : editing ? "Save changes" : "Create room"}</button>
    </form>
  );
}
