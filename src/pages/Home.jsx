import { useNavigate } from "react-router-dom";
import { clearSession } from "../services/authService";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSession();
    navigate("/login");
  };

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("dms_user") || "{}"); }
    catch { return {}; }
  })();

  return (
    <div className="home-root">
      <header className="home-header">
        <div className="home-logo">
          <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" fill="#0d1f2d" stroke="#00d4aa" strokeWidth="2" />
            <path d="M12 14h8a6 6 0 0 1 0 12h-8V14z" fill="none" stroke="#00d4aa" strokeWidth="2" strokeLinejoin="round" />
            <circle cx="26" cy="20" r="2" fill="#00d4aa" />
          </svg>
          <span className="home-logo-text">DMS</span>
        </div>
        <div className="home-user-section">
          {user?.name && (
            <span className="home-greeting">Welcome, {user.name}</span>
          )}
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="home-main">
        <div className="home-welcome-card">
          <div className="welcome-icon">✅</div>
          <h1>Login Successful!</h1>
          <p>You're now in the DMS Distributor Portal.</p>
        </div>
      </main>
    </div>
  );
}
