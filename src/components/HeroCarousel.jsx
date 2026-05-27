import { useEffect, useState } from "react";
import heroImg from "../assets/dms-hero.jpg";

const slides = [
  { title: "The future of", accent: "distribution", body: "Real-time inventory, smart routing and unified distributor insights — all in one lightning-fast platform." },
  { title: "Track every", accent: "shipment", body: "Live order visibility from warehouse to last-mile, with predictive ETAs and instant alerts." },
  { title: "Empower your", accent: "network", body: "Onboard distributors in minutes and grow revenue with intelligent demand forecasting." },
  { title: "Decisions backed by", accent: "data", body: "Beautiful dashboards turn raw operations into clear, actionable insights for every team." },
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="dms-carousel">
      <img src={heroImg} alt="Futuristic distribution warehouse" width="1280" height="1600" />
      <div className="dms-carousel-overlay" />
      <div className="dms-carousel-content">
        <div className="dms-slide-stack">
          {slides.map((s, i) => (
            <div
              key={i}
              className="dms-slide"
              aria-hidden={i !== index}
              style={{
                opacity: i === index ? 1 : 0,
                transform: i === index ? "translateY(0)" : "translateY(12px)",
              }}
            >
              <h2>
                {s.title} <span className="dms-gradient-text">{s.accent}</span>.
              </h2>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
        <div className="dms-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className="dms-dot"
              style={{ width: i === index ? 28 : 14 }}
            >
              <span className="dms-dot-fill" style={{ width: i === index ? "100%" : "0%" }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
