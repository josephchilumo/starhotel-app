import React, { useState } from "react";
import API from "../utils/axios";
import { useNavigate, Link } from "react-router-dom";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400;1,600&family=Jost:wght@300;400;500&display=swap');

  :root {
    --ink:       #0e0f0d;
    --ink2:      #161815;
    --bronze:    #a0743c;
    --bronze-lt: #c49558;
    --cream:     #f0ece4;
    --fog:       rgba(240,236,228,0.42);
    --border:    rgba(255,255,255,0.08);
    --error:     #c0392b;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .lg-root {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    font-family: 'Jost', sans-serif;
    background: var(--ink);
  }
  @media (max-width: 800px) { .lg-root { grid-template-columns: 1fr; } }

  /* ── Left: image panel ── */
  .lg-image-panel {
    position: relative;
    overflow: hidden;
  }
  @media (max-width: 800px) { .lg-image-panel { display: none; } }

  .lg-image-panel img {
    width: 100%; height: 100%;
    object-fit: cover; display: block;
    transform: scale(1.04);
    animation: imgZoom 20s ease-in-out infinite alternate;
  }
  @keyframes imgZoom {
    from { transform: scale(1.04); }
    to   { transform: scale(1.0); }
  }

  .lg-img-overlay {
    position: absolute; inset: 0;
    background:
      linear-gradient(to bottom, rgba(10,9,7,0.35) 0%, rgba(10,9,7,0.7) 100%),
      linear-gradient(to right, rgba(10,9,7,0.5) 0%, transparent 50%);
  }

  .lg-img-content {
    position: absolute; inset: 0;
    display: flex; flex-direction: column;
    justify-content: space-between;
    padding: 2.5rem;
  }

  /* Logo on image */
  .lg-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.4rem; font-weight: 300;
    letter-spacing: 0.08em;
    color: rgba(240,236,228,0.9);
    text-decoration: none;
  }
  .lg-logo em { font-style: italic; color: var(--bronze-lt); }

  /* Quote */
  .lg-quote {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.5rem, 2.5vw, 2.2rem);
    font-weight: 300; font-style: italic;
    color: rgba(240,236,228,0.8);
    line-height: 1.4; letter-spacing: -0.01em;
    max-width: 380px;
  }
  .lg-quote-attr {
    font-size: 0.65rem; letter-spacing: 0.18em;
    text-transform: uppercase; color: var(--bronze-lt);
    margin-top: 0.75rem;
    display: flex; align-items: center; gap: 0.6rem;
  }
  .lg-quote-attr::before { content: ''; width: 20px; height: 1px; background: var(--bronze); }

  /* ── Right: form panel ── */
  .lg-form-panel {
    background: var(--ink2);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 3rem 5vw;
    position: relative;
  }

  /* Corner accents */
  .lg-corner {
    position: absolute; width: 40px; height: 40px;
  }
  .lg-corner-tl { top: 2rem; left: 2rem; border-top: 1px solid rgba(160,116,60,0.25); border-left: 1px solid rgba(160,116,60,0.25); }
  .lg-corner-br { bottom: 2rem; right: 2rem; border-bottom: 1px solid rgba(160,116,60,0.25); border-right: 1px solid rgba(160,116,60,0.25); }

  .lg-form-inner {
    width: 100%; max-width: 380px;
  }

  /* Mobile logo */
  .lg-mobile-logo {
    display: none;
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.4rem; font-weight: 300;
    letter-spacing: 0.08em;
    color: rgba(240,236,228,0.9);
    text-decoration: none;
    margin-bottom: 2.5rem;
    align-self: flex-start;
  }
  .lg-mobile-logo em { font-style: italic; color: var(--bronze-lt); }
  @media (max-width: 800px) { .lg-mobile-logo { display: block; } }

  /* Eyebrow */
  .lg-eyebrow {
    display: flex; align-items: center; gap: 0.7rem;
    margin-bottom: 1.25rem;
  }
  .lg-eyebrow-line { width: 20px; height: 1px; background: var(--bronze); }
  .lg-eyebrow-text {
    font-size: 0.6rem; letter-spacing: 0.26em;
    text-transform: uppercase; color: var(--bronze-lt);
  }

  /* Title */
  .lg-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2rem, 4vw, 2.8rem);
    font-weight: 300; line-height: 1.1;
    letter-spacing: -0.02em; color: var(--cream);
    margin-bottom: 0.5rem;
  }
  .lg-title em { font-style: italic; color: var(--bronze-lt); }

  .lg-subtitle {
    font-size: 0.8rem; color: var(--fog);
    font-weight: 300; margin-bottom: 3rem; line-height: 1.6;
  }

  /* Fields */
  .lg-field {
    margin-bottom: 1.75rem;
  }
  .lg-label {
    display: block;
    font-size: 0.6rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: rgba(240,236,228,0.3);
    margin-bottom: 0.5rem;
  }
  .lg-input-wrap {
    display: flex; align-items: center;
    border-bottom: 1px solid rgba(255,255,255,0.12);
    transition: border-color 0.3s;
    padding-bottom: 0.75rem;
  }
  .lg-input-wrap:focus-within { border-color: var(--bronze); }
  .lg-input-wrap.error { border-color: var(--error); }

  .lg-input {
    flex: 1;
    background: transparent; border: none; outline: none;
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1rem; font-style: italic;
    color: var(--cream); letter-spacing: 0.02em;
    caret-color: var(--bronze-lt);
  }
  .lg-input::placeholder { color: rgba(240,236,228,0.18); font-style: italic; }

  /* Password toggle */
  .lg-pw-toggle {
    background: none; border: none; cursor: pointer;
    color: rgba(240,236,228,0.25);
    font-size: 0.7rem; letter-spacing: 0.1em;
    font-family: 'Jost', sans-serif;
    padding: 0; transition: color 0.2s;
    text-transform: uppercase;
  }
  .lg-pw-toggle:hover { color: var(--bronze-lt); }

  /* Error message */
  .lg-error-msg {
    font-size: 0.7rem; color: var(--error);
    letter-spacing: 0.06em; margin-top: 2rem;
    display: flex; align-items: center; gap: 0.5rem;
    padding: 0.65rem 0.85rem;
    border: 1px solid rgba(192,57,43,0.25);
    background: rgba(192,57,43,0.06);
  }

  /* Submit */
  .lg-submit {
    width: 100%; margin-top: 2.5rem;
    padding: 1rem;
    background: var(--bronze); color: var(--cream);
    border: none; cursor: pointer;
    font-family: 'Jost', sans-serif;
    font-size: 0.7rem; letter-spacing: 0.22em;
    text-transform: uppercase; font-weight: 500;
    position: relative; overflow: hidden;
    transition: background 0.25s;
    display: flex; align-items: center; justify-content: center; gap: 0.6rem;
  }
  .lg-submit::before {
    content: '';
    position: absolute; inset: 0;
    background: rgba(255,255,255,0.1);
    transform: translateX(-101%);
    transition: transform 0.3s ease;
  }
  .lg-submit:hover::before { transform: translateX(0); }
  .lg-submit:disabled { opacity: 0.6; cursor: not-allowed; }
  .lg-submit:disabled::before { display: none; }

  /* Loading spinner */
  .lg-spinner {
    width: 14px; height: 14px;
    border: 1.5px solid rgba(240,236,228,0.3);
    border-top-color: var(--cream);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Register link */
  .lg-footer {
    margin-top: 1.75rem;
    font-size: 0.72rem; color: var(--fog);
    letter-spacing: 0.04em; text-align: center;
  }
  .lg-footer a {
    color: var(--bronze-lt); text-decoration: none;
    border-bottom: 1px solid rgba(196,149,88,0.3);
    padding-bottom: 1px;
    transition: border-color 0.2s, color 0.2s;
  }
  .lg-footer a:hover { color: var(--cream); border-color: var(--cream); }

  /* Entrance animation */
  .lg-form-inner {
    animation: formUp 0.65s ease both;
  }
  @keyframes formUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ email: "", password: "" });
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleChange = (e) => {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("user", JSON.stringify(res.data));
      res.data.role === "admin" ? navigate("/admin") : navigate("/");
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="lg-root">

        {/* ── Left image panel ── */}
        <div className="lg-image-panel">
          <img
            src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80"
            alt="StarHotel"
          />
          <div className="lg-img-overlay" />
          <div className="lg-img-content">
            <Link to="/" className="lg-logo">Star<em>Hotel</em></Link>
            <div>
              <p className="lg-quote">
                "Where every arrival feels like coming home to something extraordinary."
              </p>
              <div className="lg-quote-attr">Mombasa, Kenya</div>
            </div>
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div className="lg-form-panel">
          <div className="lg-corner lg-corner-tl" aria-hidden="true" />
          <div className="lg-corner lg-corner-br" aria-hidden="true" />

          <div className="lg-form-inner">
            <Link to="/" className="lg-mobile-logo">Star<em>Hotel</em></Link>

            <div className="lg-eyebrow">
              <div className="lg-eyebrow-line" />
              <span className="lg-eyebrow-text">Welcome Back</span>
            </div>

            <h1 className="lg-title">Sign <em>in</em></h1>
            <p className="lg-subtitle">Access your account and manage your reservations.</p>

            <div className="lg-field">
              <label className="lg-label" htmlFor="email">Email Address</label>
              <div className={`lg-input-wrap${error ? " error" : ""}`}>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={handleChange}
                  className="lg-input"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="lg-field">
              <label className="lg-label" htmlFor="password">Password</label>
              <div className={`lg-input-wrap${error ? " error" : ""}`}>
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="lg-input"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="lg-pw-toggle"
                  onClick={() => setShowPw(v => !v)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && (
              <div className="lg-error-msg" role="alert">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="5.5" stroke="#c0392b"/>
                  <path d="M6 3.5v3M6 8.5v.5" stroke="#c0392b" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                {error}
              </div>
            )}

            <button
              className="lg-submit"
              onClick={handleSubmit}
              disabled={loading}
              type="button"
            >
              {loading ? (
                <>
                  <span className="lg-spinner" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign In
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                    <path d="M1 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              )}
            </button>

            <p className="lg-footer">
              Don't have an account?&nbsp;
              <Link to="/register">Create one</Link>
            </p>
          </div>
        </div>

      </div>
    </>
  );
}