import { useState } from "react";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import BrandMark from "../../components/BrandMark";

export default function LoginForm({ onToast }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    if (identifier.trim().length < 3) e.identifier = "Enter your username or email";
    if (password.length < 6) e.password = "Password must be at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    onToast?.({ title: "Welcome back", desc: `Signed in as ${identifier}` });
  };

  return (
    <div className="dms-card dms-glass">
      <div className="dms-card-mobile-brand">
        <BrandMark />
      </div>

      <h1>
        Sign in to your <span className="dms-gradient-text">DMS</span>
      </h1>
      <p className="dms-card-sub">
        Manage your distributors, inventory and orders in one place.
      </p>

      <form className="dms-form" onSubmit={handleSubmit} noValidate>
        <div className="dms-field">
          <label className="dms-label" htmlFor="identifier">Username or Email</label>
          <input
            id="identifier"
            type="text"
            autoComplete="username"
            placeholder="you@company.com"
            className="dms-input"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
          {errors.identifier && <p className="dms-error">{errors.identifier}</p>}
        </div>

        <div className="dms-field">
          <label className="dms-label" htmlFor="password">Password</label>
          <div className="dms-password-wrap">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              className="dms-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="dms-eye"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="dms-error">{errors.password}</p>}
        </div>

        {/* <div className="dms-row">
          <label className="dms-remember">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Remember me
          </label>
          <button
            type="button"
            className="dms-forgot"
            onClick={() =>
              onToast?.({ title: "Password reset link sent", desc: "Check your email for instructions." })
            }
          >
            Forgot password?
          </button>
        </div> */}

        <button type="submit" className="dms-btn-primary" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 size={16} className="dms-spin" />
              Signing in…
            </>
          ) : (
            <>
              <LogIn size={16} />
              Sign in
            </>
          )}
        </button>

        <p className="dms-foot">Protected by enterprise-grade encryption.</p>
      </form>
    </div>
  );
}
