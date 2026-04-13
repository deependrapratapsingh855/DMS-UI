import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, saveSession } from "../services/authService";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      // const data = await loginUser(email, password);
const data = { success: true, user: { name : email , email : 'deependra@gmail.com' } }
      // Save a simple session flag + whatever user info your backend returns
      saveSession(data.user || data || {});

      navigate("/home");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Invalid credentials. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      {/* ── Left hero panel ── */}
      <div className="login-hero">
        <div className="hero-overlay" />
        <div className="hero-network" aria-hidden="true">
          {/* SVG network / world-map graphic */}
          <svg viewBox="0 0 480 340" xmlns="http://www.w3.org/2000/svg" className="network-svg">
            {/* Continents silhouette (simplified) */}
            <ellipse cx="120" cy="130" rx="70" ry="45" fill="none" stroke="#00d4aa22" strokeWidth="1" />
            <ellipse cx="240" cy="110" rx="90" ry="50" fill="none" stroke="#00d4aa22" strokeWidth="1" />
            <ellipse cx="360" cy="140" rx="65" ry="40" fill="none" stroke="#00d4aa22" strokeWidth="1" />
            {/* Grid dots */}
            {Array.from({ length: 8 }, (_, row) =>
              Array.from({ length: 12 }, (_, col) => (
                <circle
                  key={`${row}-${col}`}
                  cx={col * 40 + 20}
                  cy={row * 40 + 20}
                  r="1.5"
                  fill="#00d4aa33"
                />
              ))
            )}
            {/* Connection lines */}
            <line x1="120" y1="130" x2="240" y2="110" stroke="#00d4aa55" strokeWidth="1.2" strokeDasharray="4 3" />
            <line x1="240" y1="110" x2="360" y2="140" stroke="#00d4aa55" strokeWidth="1.2" strokeDasharray="4 3" />
            <line x1="120" y1="130" x2="80"  y2="220" stroke="#00d4aa44" strokeWidth="1" strokeDasharray="4 3" />
            <line x1="360" y1="140" x2="400" y2="230" stroke="#00d4aa44" strokeWidth="1" strokeDasharray="4 3" />
            <line x1="240" y1="110" x2="200" y2="200" stroke="#00d4aa44" strokeWidth="1" strokeDasharray="4 3" />
            <line x1="240" y1="110" x2="280" y2="210" stroke="#00d4aa44" strokeWidth="1" strokeDasharray="4 3" />
            {/* Hub circles */}
            <circle cx="120" cy="130" r="6" fill="#00d4aa" opacity="0.8" />
            <circle cx="240" cy="110" r="8" fill="#00d4aa" opacity="0.9" />
            <circle cx="360" cy="140" r="6" fill="#00d4aa" opacity="0.8" />
            <circle cx="80"  cy="220" r="5" fill="#00aaff" opacity="0.7" />
            <circle cx="400" cy="230" r="5" fill="#00aaff" opacity="0.7" />
            <circle cx="200" cy="200" r="5" fill="#00d4aa" opacity="0.6" />
            <circle cx="280" cy="210" r="5" fill="#00d4aa" opacity="0.6" />
            {/* Pulse rings */}
            <circle cx="240" cy="110" r="18" fill="none" stroke="#00d4aa" strokeWidth="1" opacity="0.3" className="pulse-ring" />
            <circle cx="240" cy="110" r="28" fill="none" stroke="#00d4aa" strokeWidth="0.6" opacity="0.15" className="pulse-ring-slow" />
            {/* Truck / box icons (simplified) */}
            <rect x="220" y="220" width="40" height="24" rx="4" fill="none" stroke="#00d4aa" strokeWidth="1.5" opacity="0.6" />
            <circle cx="228" cy="248" r="4" fill="#00d4aa" opacity="0.7" />
            <circle cx="252" cy="248" r="4" fill="#00d4aa" opacity="0.7" />
            <rect x="258" y="224" width="22" height="16" rx="2" fill="none" stroke="#00d4aa" strokeWidth="1.2" opacity="0.5" />
          </svg>
        </div>
        <div className="hero-content">
          <div className="hero-logo">
            <DmsIcon size={38} />
            <span className="hero-logo-text">DMS</span>
          </div>
          <p className="hero-tagline">
            Empower Your<br />Distribution <span className="accent">| DMS</span>
          </p>
        </div>
        {/* Floating labels */}
        <div className="float-label fl-1">DMS</div>
        <div className="float-label fl-2">DMS</div>
        <div className="float-label fl-3">DMS</div>
      </div>

      {/* ── Right login panel ── */}
      <div className="login-panel">
        <div className="login-card">
          {/* Logo */}
          <div className="card-logo">
            <DmsIcon size={28} />
            <span className="card-logo-text">DMS</span>
          </div>

          <h2 className="card-title">
            Login <span className="divider">|</span>{" "}
            <span className="subtitle-text">Distributor Portal</span>
          </h2>

          {error && <div className="error-banner">{error}</div>}

          <form onSubmit={handleLogin} className="login-form" noValidate>
            {/* Email */}
            <div className="field-wrap">
              <span className="field-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M2 7l10 7 10-7" />
                </svg>
              </span>
              <input
                type="email"
                placeholder="Email Address"
                className="field-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            {/* Password */}
            <div className="field-wrap">
              <span className="field-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="field-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword((v) => !v)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff /> : <EyeOn />}
              </button>
            </div>

            <div className="forgot-row">
              <a href="#" className="forgot-link">Forgot your password?</a>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? (
                <span className="spinner" />
              ) : (
                "Secure Login"
              )}
            </button>
          </form>

          <p className="register-row">
            New to DMS?{" "}
            <a href="#" className="register-link">Get Started</a>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Inline icon components ── */
function DmsIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="#0d1f2d" stroke="#00d4aa" strokeWidth="2" />
      <path d="M12 14h8a6 6 0 0 1 0 12h-8V14z" fill="none" stroke="#00d4aa" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="26" cy="20" r="2" fill="#00d4aa" />
    </svg>
  );
}

function EyeOn() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOff() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}
