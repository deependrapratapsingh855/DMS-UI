import { useState, useCallback } from "react";
import "./Login.css";
import AnimatedBackground from "../components/AnimatedBackground";
import BrandMark from "../components/BrandMark";
import HeroCarousel from "../components/HeroCarousel";
import LoginForm from "../features/authentication/LoginForm";

export default function Login() {
  const [toasts, setToasts] = useState([]);

  const pushToast = useCallback((t) => {
    const id = Date.now() + Math.random();
    setToasts((arr) => [...arr, { id, ...t }]);
    setTimeout(() => setToasts((arr) => arr.filter((x) => x.id !== id)), 3500);
  }, []);

  return (
    <main className="dms-root">
      <AnimatedBackground />

      <div className="dms-grid-wrap">
        {/* Hero column — desktop / laptop */}
        <section className="dms-hero-col">
          <BrandMark />
          <HeroCarousel />
          <div className="dms-stats">
            {[
              { v: "15+", l: "Distributors" },
              { v: "99.9%", l: "Uptime" },
              { v: "2+", l: "Regions" },
            ].map((s) => (
              <div key={s.l} className="dms-stat dms-glass">
                <div className="dms-stat-v dms-gradient-text">{s.v}</div>
                <div className="dms-stat-l">{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Form column */}
        <section className="dms-form-col">
          <LoginForm onToast={pushToast} />
        </section>
      </div>

      {/* Toasts */}
      <div className="dms-toast-wrap">
        {toasts.map((t) => (
          <div key={t.id} className="dms-toast">
            <div className="dms-toast-title">{t.title}</div>
            {t.desc && <div className="dms-toast-desc">{t.desc}</div>}
          </div>
        ))}
      </div>
    </main>
  );
}
