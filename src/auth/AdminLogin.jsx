import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import API from "../utils/axios";

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const { data } = await API.post("/auth/login", form);
      if (data.role !== "admin") {
        setError("This account does not have administrator access.");
        return;
      }
      localStorage.setItem("starhotel_token", data.token);
      localStorage.setItem("starhotel_user", JSON.stringify(data));
      navigate(location.state?.from?.pathname || "/admin", { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.msg || "Sign in failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f4ea] px-5 py-12 text-gray-900">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded border border-gray-200 bg-[#fffdf2] p-8 shadow-sm">
        <Link to="/" className="text-sm text-green-700">StarHotel</Link>
        <p className="mt-10 text-xs font-medium uppercase tracking-[0.2em] text-green-700">Management</p>
        <h1 className="mt-2 font-serif text-3xl">Admin sign in</h1>
        <p className="mt-2 text-sm text-gray-500">Sign in with an administrator account to manage the hotel.</p>
        <label className="mt-7 block text-sm font-medium">Email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="mt-2 w-full rounded border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-green-600" /></label>
        <label className="mt-4 block text-sm font-medium">Password<input required type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="mt-2 w-full rounded border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-green-600" /></label>
        {error && <p className="mt-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <button disabled={saving} className="mt-6 w-full rounded bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50">{saving ? "Signing in..." : "Sign in"}</button>
      </form>
    </main>
  );
}
