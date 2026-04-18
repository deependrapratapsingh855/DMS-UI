import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, saveSession, registerUser } from "../services/authService";
import axios from "axios";
import "./Login.css";

/* ─────────────── CONSTANTS ─────────────── */
const COUNTRY_CODES = [
  { code: "+91",  label: "🇮🇳 +91 India" },
  { code: "+1",   label: "🇺🇸 +1 USA" },
  { code: "+44",  label: "🇬🇧 +44 UK" },
  { code: "+61",  label: "🇦🇺 +61 Australia" },
  { code: "+971", label: "🇦🇪 +971 UAE" },
  { code: "+65",  label: "🇸🇬 +65 Singapore" },
  { code: "+49",  label: "🇩🇪 +49 Germany" },
  { code: "+33",  label: "🇫🇷 +33 France" },
  { code: "+81",  label: "🇯🇵 +81 Japan" },
  { code: "+86",  label: "🇨🇳 +86 China" },
];

const emailReg    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,16}$/;
const phoneReg    = /^\d{7,15}$/;

const EMPTY_FORM = {
  firstName: "", middleName: "", lastName: "",
  email: "", password: "", confirmPassword: "",
  dob: "",
  primaryCountryCode: "+91", primaryPhone: "",
  altCountryCode: "+91",     altPhone: "",
  permanentAddress: "", residentialAddress: "",
};

/* ─────────────── VALIDATION ─────────────── */
function validate(fields) {
  const e = {};
  if (!fields.firstName.trim())          e.firstName           = "First name is required.";
  if (!fields.lastName.trim())           e.lastName            = "Last name is required.";
  if (!emailReg.test(fields.email))      e.email               = "Enter a valid email address.";
  if (!passwordReg.test(fields.password))
    e.password = "8–16 chars with uppercase, lowercase, number & special character.";
  if (fields.password !== fields.confirmPassword)
    e.confirmPassword = "Passwords do not match.";
  if (!fields.dob)                       e.dob                 = "Date of birth is required.";
  if (!phoneReg.test(fields.primaryPhone))
    e.primaryPhone = "Enter a valid phone number (digits only, 7–15 digits).";
  if (fields.altPhone && !phoneReg.test(fields.altPhone))
    e.altPhone = "Enter a valid alternate phone number.";
  if (!fields.permanentAddress.trim())   e.permanentAddress    = "Permanent address is required.";
  if (!fields.residentialAddress.trim()) e.residentialAddress  = "Residential address is required.";
  return e;
}

/* ─────────────── PASSWORD STRENGTH ─────────────── */
function getStrength(pwd) {
  let s = 0;
  if (pwd.length >= 8)  s++;
  if (pwd.length >= 12) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/[a-z]/.test(pwd)) s++;
  if (/\d/.test(pwd))    s++;
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd)) s++;
  return s;
}

function StrengthBar({ pwd }) {
  const s = getStrength(pwd);
  const labels = ["", "Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong"];
  const colors = ["", "#e74c3c", "#e67e22", "#f1c40f", "#2ecc71", "#27ae60", "#1abc9c"];
  if (!pwd) return null;
  return (
    <div className="strength-wrap">
      <div className="strength-bars">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="strength-bar"
               style={{ background: i <= s ? colors[s] : "#dde4ec" }} />
        ))}
      </div>
      <span className="strength-label" style={{ color: colors[s] }}>{labels[s]}</span>
    </div>
  );
}

/* ─────────────── MAIN COMPONENT ─────────────── */
export default function Login() {
  const navigate = useNavigate();

  /* view: "login" | "register" */
  const [view, setView] = useState("login");

  /* login state */
  const [loginEmail,    setLoginEmail]    = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPwd,  setShowLoginPwd]  = useState(false);
  const [loginLoading,  setLoginLoading]  = useState(false);
  const [loginError,    setLoginError]    = useState("");

  /* register state */
  const [form,         setForm]         = useState(EMPTY_FORM);
  const [showPwd,      setShowPwd]      = useState(false);
  const [showCPwd,     setShowCPwd]     = useState(false);
  const [errors,       setErrors]       = useState({});
  const [sameAddress,  setSameAddress]  = useState(false);
  const [regLoading,   setRegLoading]   = useState(false);
  const [regSuccess,   setRegSuccess]   = useState(false);
  const [regError,     setRegError]     = useState("");

  /* ── Login ── */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    if (!loginEmail || !loginPassword) { setLoginError("Please enter email and password."); return; }
    setLoginLoading(true);
    try {
      const data = await loginUser(loginEmail, loginPassword);
      saveSession(data.user || data || {});
      navigate("/home");
    } catch (err) {
      setLoginError(err?.response?.data?.message || err?.response?.data?.error || "Invalid credentials. Please try again.");
    } finally { setLoginLoading(false); }
  };

  /* ── Form change ── */
  const handleChange = (field) => (e) => {
    const val = e.target.value;
    if (sameAddress && field === "permanentAddress") {
      setForm(f => ({ ...f, permanentAddress: val, residentialAddress: val }));
    } else {
      setForm(f => ({ ...f, [field]: val }));
    }
    if (errors[field]) setErrors(er => ({ ...er, [field]: "" }));
  };

  const handleSameAddress = (e) => {
    setSameAddress(e.target.checked);
    if (e.target.checked) setForm(f => ({ ...f, residentialAddress: f.permanentAddress }));
    else setForm(f => ({ ...f, residentialAddress: "" }));
  };

  /* ── Register ── */
  const handleRegister = async (e) => {
    e.preventDefault();
    setRegError("");
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setRegLoading(true);
    try {
      const payload = {
          username:       form.email,
          password:       form.password,
          role:           "ADMIN",
          firstName:      form.firstName,
          middleName:     form.middleName || null,
          lastName:       form.lastName,
          email:          form.email,
          priCountryCode: form.primaryCountryCode,
          primaryNumber:  form.primaryPhone,
          permAddress:    form.permanentAddress,
          resiAddress:    form.residentialAddress,
        }
        const data = await registerUser(payload);
      setRegSuccess(true);
      setForm(EMPTY_FORM);
      setErrors({});
    } catch (err) {
      setRegError(err?.response?.data?.message || err?.response?.data?.error || "Registration failed. Please try again.");
    } finally { setRegLoading(false); }
  };

  const goToRegister = () => {
    setRegSuccess(false);
    setRegError("");
    setErrors({});
    setForm(EMPTY_FORM);
    setSameAddress(false);
    setView("register");
  };

  const goToLogin = () => {
    setRegSuccess(false);
    setRegError("");
    setErrors({});
    setForm(EMPTY_FORM);
    setSameAddress(false);
    setView("login");
  };

  /* ─────────────── RENDER ─────────────── */
  return (
    <div className="login-root">

      {/* ── Left hero (always visible) ── */}
      <div className="login-hero">
        <div className="hero-overlay" />
        <div className="hero-network" aria-hidden="true">
          <svg viewBox="0 0 480 340" xmlns="http://www.w3.org/2000/svg" className="network-svg">
            <ellipse cx="120" cy="130" rx="70" ry="45" fill="none" stroke="#00d4aa22" strokeWidth="1" />
            <ellipse cx="240" cy="110" rx="90" ry="50" fill="none" stroke="#00d4aa22" strokeWidth="1" />
            <ellipse cx="360" cy="140" rx="65" ry="40" fill="none" stroke="#00d4aa22" strokeWidth="1" />
            {Array.from({ length: 8 }, (_, row) =>
              Array.from({ length: 12 }, (_, col) => (
                <circle key={`${row}-${col}`} cx={col*40+20} cy={row*40+20} r="1.5" fill="#00d4aa33" />
              ))
            )}
            <line x1="120" y1="130" x2="240" y2="110" stroke="#00d4aa55" strokeWidth="1.2" strokeDasharray="4 3"/>
            <line x1="240" y1="110" x2="360" y2="140" stroke="#00d4aa55" strokeWidth="1.2" strokeDasharray="4 3"/>
            <line x1="120" y1="130" x2="80"  y2="220" stroke="#00d4aa44" strokeWidth="1"   strokeDasharray="4 3"/>
            <line x1="360" y1="140" x2="400" y2="230" stroke="#00d4aa44" strokeWidth="1"   strokeDasharray="4 3"/>
            <line x1="240" y1="110" x2="200" y2="200" stroke="#00d4aa44" strokeWidth="1"   strokeDasharray="4 3"/>
            <line x1="240" y1="110" x2="280" y2="210" stroke="#00d4aa44" strokeWidth="1"   strokeDasharray="4 3"/>
            <circle cx="120" cy="130" r="6"  fill="#00d4aa" opacity="0.8"/>
            <circle cx="240" cy="110" r="8"  fill="#00d4aa" opacity="0.9"/>
            <circle cx="360" cy="140" r="6"  fill="#00d4aa" opacity="0.8"/>
            <circle cx="80"  cy="220" r="5"  fill="#00aaff" opacity="0.7"/>
            <circle cx="400" cy="230" r="5"  fill="#00aaff" opacity="0.7"/>
            <circle cx="200" cy="200" r="5"  fill="#00d4aa" opacity="0.6"/>
            <circle cx="280" cy="210" r="5"  fill="#00d4aa" opacity="0.6"/>
            <circle cx="240" cy="110" r="18" fill="none" stroke="#00d4aa" strokeWidth="1"   opacity="0.3"  className="pulse-ring"/>
            <circle cx="240" cy="110" r="28" fill="none" stroke="#00d4aa" strokeWidth="0.6" opacity="0.15" className="pulse-ring-slow"/>
            <rect x="220" y="220" width="40" height="24" rx="4" fill="none" stroke="#00d4aa" strokeWidth="1.5" opacity="0.6"/>
            <circle cx="228" cy="248" r="4" fill="#00d4aa" opacity="0.7"/>
            <circle cx="252" cy="248" r="4" fill="#00d4aa" opacity="0.7"/>
            <rect x="258" y="224" width="22" height="16" rx="2" fill="none" stroke="#00d4aa" strokeWidth="1.2" opacity="0.5"/>
          </svg>
        </div>
        <div className="hero-content">
          <div className="hero-logo"><DmsIcon size={38}/><span className="hero-logo-text">DMS</span></div>
          <p className="hero-tagline">Empower Your<br/>Distribution <span className="accent">| DMS</span></p>
        </div>
        <div className="float-label fl-1">DMS</div>
        <div className="float-label fl-2">DMS</div>
        <div className="float-label fl-3">DMS</div>
      </div>

      {/* ── Right panel: Login ── */}
      {view === "login" && (
        <div className="login-panel">
          <div className="login-card">
            <div className="card-logo"><DmsIcon size={28}/><span className="card-logo-text">DMS</span></div>
            <h2 className="card-title">
              Login <span className="divider">|</span>{" "}
              <span className="subtitle-text">Distributor Portal</span>
            </h2>

            {loginError && <div className="error-banner">{loginError}</div>}

            <form onSubmit={handleLogin} className="login-form" noValidate>
              <div className="field-wrap">
                <span className="field-icon"><IconMail/></span>
                <input type="email" placeholder="Email Address" className="field-input"
                  value={loginEmail} onChange={e => setLoginEmail(e.target.value)} autoComplete="email"/>
              </div>
              <div className="field-wrap">
                <span className="field-icon"><IconLock/></span>
                <input type={showLoginPwd ? "text" : "password"} placeholder="Password" className="field-input"
                  value={loginPassword} onChange={e => setLoginPassword(e.target.value)} autoComplete="current-password"/>
                <button type="button" className="eye-btn" onClick={() => setShowLoginPwd(v => !v)}>
                  {showLoginPwd ? <EyeOff/> : <EyeOn/>}
                </button>
              </div>
              <div className="forgot-row">
                <a href="#" className="forgot-link">Forgot your password?</a>
              </div>
              <button type="submit" className="login-btn" disabled={loginLoading}>
                {loginLoading ? <span className="spinner"/> : "Login"}
              </button>
            </form>

            <p className="register-row">
              New to DMS?{" "}
              <button className="register-link-btn" onClick={goToRegister}>Get Started</button>
            </p>
          </div>
        </div>
      )}

      {/* ── Right panel: Register (full page, no drawer) ── */}
      {view === "register" && (
        <div className="login-panel reg-page-panel">

          {/* Success screen */}
          {regSuccess ? (
            <div className="reg-success">
              <div className="success-icon">🎉</div>
              <h3>Registration Successful!</h3>
              <p>Your account has been created. You can now log in.</p>
              <button className="login-btn" style={{ marginTop: "1.8rem", maxWidth: 220 }} onClick={goToLogin}>
                Back to Login
              </button>
            </div>
          ) : (
            <div className="reg-page-card">

              {/* Page header */}
              <div className="reg-page-header">
                <div className="reg-header-left">
                  <DmsIcon size={26}/>
                  <div>
                    <h2 className="reg-title" style={{ color: "#0d2240" }}>Create Account</h2>
                    <p className="reg-subtitle" style={{ color: "#6a7f96" }}>DMS Distributor Portal</p>
                  </div>
                </div>
                <button className="cancel-btn" onClick={goToLogin} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  ← Back to Login
                </button>
              </div>

              {/* Registration form */}
              <form onSubmit={handleRegister} className="reg-form reg-page-form" noValidate>
                {regError && <div className="error-banner">{regError}</div>}

                {/* Personal Info */}
                <SectionLabel icon="👤" text="Personal Information" />
                <div className="reg-row three-col">
                  <RegField label="First Name *" error={errors.firstName}>
                    <input className={`finput ${errors.firstName ? "finput--err" : ""}`}
                      placeholder="First Name" value={form.firstName} onChange={handleChange("firstName")}/>
                  </RegField>
                  <RegField label="Middle Name" error="">
                    <input className="finput" placeholder="Optional"
                      value={form.middleName} onChange={handleChange("middleName")}/>
                  </RegField>
                  <RegField label="Last Name *" error={errors.lastName}>
                    <input className={`finput ${errors.lastName ? "finput--err" : ""}`}
                      placeholder="Last Name" value={form.lastName} onChange={handleChange("lastName")}/>
                  </RegField>
                </div>

                <div className="reg-row two-col">
                  <RegField label="Date of Birth *" error={errors.dob}>
                    <input type="date" className={`finput ${errors.dob ? "finput--err" : ""}`}
                      value={form.dob} onChange={handleChange("dob")}
                      max={new Date().toISOString().split("T")[0]}/>
                  </RegField>
                  <RegField label="Email Address *" error={errors.email}>
                    <input type="email" className={`finput ${errors.email ? "finput--err" : ""}`}
                      placeholder="you@example.com" value={form.email} onChange={handleChange("email")}/>
                  </RegField>
                </div>

                {/* Security */}
                <SectionLabel icon="🔐" text="Security" />
                <div className="reg-row two-col">
                  <RegField label="Password *" error={errors.password}>
                    <div className={`field-wrap compact ${errors.password ? "field-err" : ""}`}>
                      <input type={showPwd ? "text" : "password"} className="field-input"
                        placeholder="Create password" value={form.password} onChange={handleChange("password")}/>
                      <button type="button" className="eye-btn" onClick={() => setShowPwd(v => !v)}>
                        {showPwd ? <EyeOff/> : <EyeOn/>}
                      </button>
                    </div>
                    <StrengthBar pwd={form.password}/>
                  </RegField>
                  <RegField label="Confirm Password *" error={errors.confirmPassword}>
                    <div className={`field-wrap compact ${errors.confirmPassword ? "field-err" : ""}`}>
                      <input type={showCPwd ? "text" : "password"} className="field-input"
                        placeholder="Repeat password" value={form.confirmPassword} onChange={handleChange("confirmPassword")}/>
                      <button type="button" className="eye-btn" onClick={() => setShowCPwd(v => !v)}>
                        {showCPwd ? <EyeOff/> : <EyeOn/>}
                      </button>
                    </div>
                    {form.confirmPassword && !errors.confirmPassword && form.password === form.confirmPassword && (
                      <p className="match-ok">✓ Passwords match</p>
                    )}
                  </RegField>
                </div>
                <p className="pwd-hint">Must be 8–16 characters and include uppercase, lowercase, number &amp; special character</p>

                {/* Contact */}
                <SectionLabel icon="📱" text="Contact Information" />
                <div className="reg-row two-col">
                  <RegField label="Primary Phone *" error={errors.primaryPhone}>
                    <div className={`field-wrap compact phone-wrap ${errors.primaryPhone ? "field-err" : ""}`}>
                      <select className="country-select" value={form.primaryCountryCode} onChange={handleChange("primaryCountryCode")}>
                        {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
                      </select>
                      <div className="phone-divider"/>
                      <input className="field-input" placeholder="Phone number"
                        value={form.primaryPhone} onChange={handleChange("primaryPhone")} maxLength={15}/>
                    </div>
                  </RegField>
                  <RegField label="Alternate Phone (Optional)" error={errors.altPhone}>
                    <div className={`field-wrap compact phone-wrap ${errors.altPhone ? "field-err" : ""}`}>
                      <select className="country-select" value={form.altCountryCode} onChange={handleChange("altCountryCode")}>
                        {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
                      </select>
                      <div className="phone-divider"/>
                      <input className="field-input" placeholder="Optional"
                        value={form.altPhone} onChange={handleChange("altPhone")} maxLength={15}/>
                    </div>
                  </RegField>
                </div>

                {/* Address */}
                <SectionLabel icon="📍" text="Address Details" />
                <RegField label="Permanent Address *" error={errors.permanentAddress}>
                  <textarea className={`finput textarea-field ${errors.permanentAddress ? "finput--err" : ""}`}
                    placeholder="House No., Street, City, State, PIN Code"
                    rows={2} value={form.permanentAddress} onChange={handleChange("permanentAddress")}/>
                </RegField>

                <label className="same-addr-label">
                  <input type="checkbox" checked={sameAddress} onChange={handleSameAddress}/>
                  <span>Residential address same as permanent address</span>
                </label>

                <RegField label="Residential Address *" error={errors.residentialAddress}>
                  <textarea className={`finput textarea-field ${errors.residentialAddress ? "finput--err" : ""} ${sameAddress ? "finput--disabled" : ""}`}
                    placeholder="House No., Street, City, State, PIN Code"
                    rows={2} value={form.residentialAddress} onChange={handleChange("residentialAddress")}
                    disabled={sameAddress}/>
                </RegField>

                {/* Actions */}
                <div className="reg-actions">
                  <button type="button" className="cancel-btn" onClick={goToLogin}>Cancel</button>
                  <button type="submit" className="login-btn" disabled={regLoading} style={{ minWidth: 160 }}>
                    {regLoading ? <span className="spinner"/> : "Create Account"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Sub-components ─── */
function SectionLabel({ icon, text }) {
  return (
    <div className="section-label">
      <span className="section-icon">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function RegField({ label, error, children }) {
  return (
    <div className="reg-field">
      <label className="reg-label">{label}</label>
      {children}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

/* ─── Icons ─── */
function DmsIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18" fill="#0d1f2d" stroke="#00d4aa" strokeWidth="2"/>
      <path d="M12 14h8a6 6 0 0 1 0 12h-8V14z" fill="none" stroke="#00d4aa" strokeWidth="2" strokeLinejoin="round"/>
      <circle cx="26" cy="20" r="2" fill="#00d4aa"/>
    </svg>
  );
}
function IconMail()  { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>; }
function IconLock()  { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>; }
function EyeOn()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>; }
function EyeOff()   { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>; }
