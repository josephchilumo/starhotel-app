import React, { useState, useMemo } from "react";
import API from "../utils/axios";
import { useNavigate, Link } from "react-router-dom";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400;1,600&family=Jost:wght@300;400;500&display=swap');

  :root {
    --parch:      #f2e8d9;
    --parch-dk:   #e8dac5;
    --bark:       #2b2318;
    --bark-lt:    #4a3f33;
    --bronze:     #a0743c;
    --bronze-lt:  #c49558;
    --fog:        #9c9188;
    --border:     rgba(43,35,24,0.12);
    --error:      #c0392b;
    --ink:        #0e0f0d;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .rg-root {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    font-family: 'Jost', sans-serif;
    background: var(--parch);
  }
  @media (max-width: 800px) { .rg-root { grid-template-columns: 1fr; } }

  /* ── Left: form panel ── */
  .rg-form-panel {
    background: var(--parch);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 3rem 5vw;
    position: relative;
    order: 1;
  }
  @media (max-width: 800px) { .rg-form-panel { order: 1; } }

  /* Corner accents */
  .rg-corner {
    position: absolute; width: 40px; height: 40px;
  }
  .rg-corner-tl { top: 2rem; left: 2rem; border-top: 1px solid rgba(160,116,60,0.3); border-left: 1px solid rgba(160,116,60,0.3); }
  .rg-corner-br { bottom: 2rem; right: 2rem; border-bottom: 1px solid rgba(160,116,60,0.3); border-right: 1px solid rgba(160,116,60,0.3); }

  .rg-form-inner {
    width: 100%; max-width: 400px;
    animation: formUp 0.65s ease both;
  }
  @keyframes formUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Logo */
  .rg-logo {
    display: block;
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.35rem; font-weight: 300;
    letter-spacing: 0.08em; color: var(--bark);
    text-decoration: none; margin-bottom: 2.5rem;
  }
  .rg-logo em { font-style: italic; color: var(--bronze); }

  /* Eyebrow */
  .rg-eyebrow {
    display: flex; align-items: center; gap: 0.7rem; margin-bottom: 1.1rem;
  }
  .rg-eyebrow-line { width: 20px; height: 1px; background: var(--bronze); }
  .rg-eyebrow-text {
    font-size: 0.6rem; letter-spacing: 0.26em;
    text-transform: uppercase; color: var(--bronze);
  }

  /* Title */
  .rg-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2rem, 4vw, 2.8rem);
    font-weight: 300; line-height: 1.1;
    letter-spacing: -0.02em; color: var(--bark);
    margin-bottom: 0.4rem;
  }
  .rg-title em { font-style: italic; color: var(--bronze); }

  .rg-subtitle {
    font-size: 0.8rem; color: var(--fog);
    font-weight: 300; margin-bottom: 2.5rem; line-height: 1.6;
  }

  /* ── Progress steps ── */
  .rg-progress {
    display: flex; align-items: center; gap: 0;
    margin-bottom: 2.25rem;
  }
  .rg-step {
    display: flex; flex-direction: column; align-items: center; gap: 0.35rem;
    flex: 1; position: relative;
  }
  .rg-step:not(:last-child)::after {
    content: '';
    position: absolute; top: 9px; left: 50%; right: -50%;
    height: 1px;
    background: var(--border);
    z-index: 0;
    transition: background 0.4s;
  }
  .rg-step.done:not(:last-child)::after { background: var(--bronze); }

  .rg-step-dot {
    width: 18px; height: 18px;
    border: 1.5px solid var(--border);
    background: var(--parch);
    border-radius: 50%; z-index: 1;
    display: flex; align-items: center; justify-content: center;
    transition: border-color 0.3s, background 0.3s;
    font-size: 0.5rem; color: transparent;
  }
  .rg-step.active .rg-step-dot { border-color: var(--bronze); }
  .rg-step.done .rg-step-dot {
    border-color: var(--bronze); background: var(--bronze); color: white;
  }
  .rg-step-label {
    font-size: 0.55rem; letter-spacing: 0.12em;
    text-transform: uppercase; color: rgba(43,35,24,0.3);
    text-align: center;
    transition: color 0.3s;
  }
  .rg-step.active .rg-step-label,
  .rg-step.done .rg-step-label { color: var(--bronze); }

  /* ── Fields ── */
  .rg-field { margin-bottom: 1.6rem; }

  .rg-label {
    display: block;
    font-size: 0.6rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: rgba(43,35,24,0.35);
    margin-bottom: 0.45rem;
  }

  .rg-input-wrap {
    display: flex; align-items: center;
    border-bottom: 1px solid var(--border);
    transition: border-color 0.3s; padding-bottom: 0.65rem;
  }
  .rg-input-wrap:focus-within { border-color: var(--bronze); }
  .rg-input-wrap.has-value { border-color: rgba(160,116,60,0.4); }
  .rg-input-wrap.error { border-color: var(--error); }

  .rg-input {
    flex: 1; background: transparent; border: none; outline: none;
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.05rem; font-style: italic;
    color: var(--bark); letter-spacing: 0.02em;
    caret-color: var(--bronze);
  }
  .rg-input::placeholder { color: rgba(43,35,24,0.2); font-style: italic; }

  /* Pw toggle */
  .rg-pw-toggle {
    background: none; border: none; cursor: pointer;
    font-size: 0.65rem; letter-spacing: 0.1em;
    color: rgba(43,35,24,0.25);
    font-family: 'Jost', sans-serif; padding: 0;
    text-transform: uppercase; transition: color 0.2s;
  }
  .rg-pw-toggle:hover { color: var(--bronze); }

  /* ── Password strength ── */
  .rg-strength { margin-top: 0.6rem; }
  .rg-strength-bars {
    display: flex; gap: 3px; margin-bottom: 0.3rem;
  }
  .rg-sbar {
    flex: 1; height: 2px;
    background: var(--border);
    transition: background 0.35s;
  }
  .rg-sbar.filled-weak   { background: #c0392b; }
  .rg-sbar.filled-fair   { background: #e67e22; }
  .rg-sbar.filled-good   { background: #f1c40f; }
  .rg-sbar.filled-strong { background: #27ae60; }

  .rg-strength-label {
    font-size: 0.6rem; letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  .rg-strength-label.weak   { color: #c0392b; }
  .rg-strength-label.fair   { color: #e67e22; }
  .rg-strength-label.good   { color: #d4a017; }
  .rg-strength-label.strong { color: #27ae60; }

  /* ── Error banner ── */
  .rg-error-msg {
    font-size: 0.7rem; color: var(--error);
    letter-spacing: 0.04em; margin-top: 1.5rem;
    display: flex; align-items: center; gap: 0.5rem;
    padding: 0.65rem 0.85rem;
    border: 1px solid rgba(192,57,43,0.2);
    background: rgba(192,57,43,0.05);
  }

  /* ── Submit ── */
  .rg-submit {
    width: 100%; margin-top: 2rem;
    padding: 1rem;
    background: var(--bark); color: var(--parch);
    border: none; cursor: pointer;
    font-family: 'Jost', sans-serif;
    font-size: 0.7rem; letter-spacing: 0.22em;
    text-transform: uppercase; font-weight: 500;
    position: relative; overflow: hidden;
    transition: background 0.25s;
    display: flex; align-items: center; justify-content: center; gap: 0.6rem;
  }
  .rg-submit::before {
    content: '';
    position: absolute; inset: 0;
    background: var(--bronze);
    transform: translateX(-101%);
    transition: transform 0.3s ease;
    z-index: 0;
  }
  .rg-submit:hover::before { transform: translateX(0); }
  .rg-submit > * { position: relative; z-index: 1; }
  .rg-submit:disabled { opacity: 0.6; cursor: not-allowed; }
  .rg-submit:disabled::before { display: none; }

  /* Spinner */
  .rg-spinner {
    width: 13px; height: 13px;
    border: 1.5px solid rgba(242,232,217,0.3);
    border-top-color: var(--parch);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Login link */
  .rg-footer {
    margin-top: 1.5rem;
    font-size: 0.72rem; color: var(--fog);
    letter-spacing: 0.04em; text-align: center;
  }
  .rg-footer a {
    color: var(--bronze); text-decoration: none;
    border-bottom: 1px solid rgba(160,116,60,0.3);
    padding-bottom: 1px; transition: border-color 0.2s, color 0.2s;
  }
  .rg-footer a:hover { color: var(--bark); border-color: var(--bark); }

  /* ── Right: image panel ── */
  .rg-image-panel {
    position: relative; overflow: hidden; order: 2;
  }
  @media (max-width: 800px) { .rg-image-panel { display: none; } }

  .rg-image-panel img {
    width: 100%; height: 100%;
    object-fit: cover; display: block;
    transform: scale(1.05);
    animation: imgZoom 22s ease-in-out infinite alternate;
  }
  @keyframes imgZoom {
    from { transform: scale(1.05); }
    to   { transform: scale(1.0); }
  }

  .rg-img-overlay {
    position: absolute; inset: 0;
    background:
      linear-gradient(to top, rgba(10,9,7,0.65) 0%, rgba(10,9,7,0.15) 60%, transparent 100%),
      linear-gradient(to left, rgba(10,9,7,0.4) 0%, transparent 50%);
  }

  .rg-img-content {
    position: absolute; inset: 0;
    display: flex; flex-direction: column;
    justify-content: flex-end; padding: 2.5rem;
  }

  .rg-img-stat {
    display: flex; align-items: baseline; gap: 0.6rem; margin-bottom: 0.5rem;
  }
  .rg-img-stat-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.8rem; font-weight: 300;
    color: var(--bronze-lt); line-height: 1; letter-spacing: -0.03em;
  }
  .rg-img-stat-label {
    font-size: 0.65rem; letter-spacing: 0.18em;
    text-transform: uppercase; color: rgba(240,236,228,0.5);
  }

  .rg-img-tagline {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1rem; font-style: italic;
    color: rgba(240,236,228,0.55); font-weight: 300; line-height: 1.5;
    max-width: 280px;
  }
`;

const STEPS = ["Identity", "Contact", "Security", "Done"];

function getStrength(pw) {
  if (!pw) return { score: 0, label: "", cls: "" };
  let score = 0;
  if (pw.length >= 8)           score++;
  if (/[A-Z]/.test(pw))         score++;
  if (/[0-9]/.test(pw))         score++;
  if (/[^A-Za-z0-9]/.test(pw))  score++;
  const map = ["", "weak", "fair", "good", "strong"];
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  return { score, label: labels[score], cls: map[score] };
}

function getStep(form) {
  if (!form.fullName) return 0;
  if (!form.email)    return 1;
  if (!form.phone)    return 2;
  if (!form.password) return 3;
  return 4;
}

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ fullName: "", email: "", phone: "", password: "" });
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const strength  = useMemo(() => getStrength(form.password), [form.password]);
  const activeStep = getStep(form);

  const handleChange = (e) => {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/register", form);
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const barClass = (idx) => {
    if (idx >= strength.score) return "rg-sbar";
    return `rg-sbar filled-${strength.cls}`;
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="rg-root">

        {/* ── Left: form panel ── */}
        <div className="rg-form-panel">
          <div className="rg-corner rg-corner-tl" aria-hidden="true" />
          <div className="rg-corner rg-corner-br" aria-hidden="true" />

          <div className="rg-form-inner">
            <Link to="/" className="rg-logo">Star<em>Hotel</em></Link>

            <div className="rg-eyebrow">
              <div className="rg-eyebrow-line" />
              <span className="rg-eyebrow-text">Create Account</span>
            </div>

            <h1 className="rg-title">Join <em>StarHotel</em></h1>
            <p className="rg-subtitle">
              Create your account to manage bookings and access exclusive member offers.
            </p>

            {/* Step progress */}
            <div className="rg-progress" aria-label="Registration progress">
              {STEPS.map((label, i) => (
                <div
                  key={label}
                  className={`rg-step${i < activeStep ? " done" : i === activeStep ? " active" : ""}`}
                >
                  <div className="rg-step-dot">
                    {i < activeStep && (
                      <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                        <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span className="rg-step-label">{label}</span>
                </div>
              ))}
            </div>

            {/* Full Name */}
            <div className="rg-field">
              <label className="rg-label" htmlFor="fullName">Full Name</label>
              <div className={`rg-input-wrap${form.fullName ? " has-value" : ""}`}>
                <input
                  id="fullName" type="text" name="fullName"
                  placeholder="Jane Mwangi"
                  value={form.fullName} onChange={handleChange}
                  className="rg-input" required autoComplete="name"
                />
              </div>
            </div>

            {/* Email */}
            <div className="rg-field">
              <label className="rg-label" htmlFor="email">Email Address</label>
              <div className={`rg-input-wrap${form.email ? " has-value" : ""}`}>
                <input
                  id="email" type="email" name="email"
                  placeholder="your@email.com"
                  value={form.email} onChange={handleChange}
                  className="rg-input" required autoComplete="email"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="rg-field">
              <label className="rg-label" htmlFor="phone">Phone Number</label>
              <div className={`rg-input-wrap${form.phone ? " has-value" : ""}`}>
                <input
                  id="phone" type="tel" name="phone"
                  placeholder="+254 700 000 000"
                  value={form.phone} onChange={handleChange}
                  className="rg-input" required autoComplete="tel"
                />
              </div>
            </div>

            {/* Password */}
            <div className="rg-field">
              <label className="rg-label" htmlFor="password">Password</label>
              <div className={`rg-input-wrap${form.password ? " has-value" : ""}`}>
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  name="password"
                  placeholder="Min. 8 characters"
                  value={form.password} onChange={handleChange}
                  className="rg-input" required autoComplete="new-password"
                />
                <button
                  type="button" className="rg-pw-toggle"
                  onClick={() => setShowPw(v => !v)}
                  aria-label={showPw ? "Hide" : "Show"}
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>

              {/* Strength meter */}
              {form.password && (
                <div className="rg-strength">
                  <div className="rg-strength-bars">
                    {[0,1,2,3].map(i => (
                      <div key={i} className={barClass(i)} />
                    ))}
                  </div>
                  {strength.label && (
                    <span className={`rg-strength-label ${strength.cls}`}>
                      {strength.label} password
                    </span>
                  )}
                </div>
              )}
            </div>

            {error && (
              <div className="rg-error-msg" role="alert">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="5.5" stroke="#c0392b"/>
                  <path d="M6 3.5v3M6 8.5v.5" stroke="#c0392b" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                {error}
              </div>
            )}

            <button
              className="rg-submit"
              onClick={handleSubmit}
              disabled={loading}
              type="button"
            >
              {loading ? (
                <><span className="rg-spinner" />Creating account…</>
              ) : (
                <>
                  Create Account
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                    <path d="M1 5h12M8 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              )}
            </button>

            <p className="rg-footer">
              Already have an account?&nbsp;
              <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>

        {/* ── Right: image panel ── */}
        <div className="rg-image-panel">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80"
            alt="StarHotel"
          />
          <div className="rg-img-overlay" />
          <div className="rg-img-content">
            <div className="rg-img-stat">
              <span className="rg-img-stat-num">25</span>
              <span className="rg-img-stat-label">Years of excellence</span>
            </div>
            <p className="rg-img-tagline">
              Join thousands of guests who call StarHotel their home away from home.
            </p>
          </div>
        </div>

      </div>
    </>
  );
}