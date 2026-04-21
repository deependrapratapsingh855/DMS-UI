import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearSession } from "../services/authService";
import "./Home.css";

/* ── Static mock data ── */
const NODES = [
  { id: "Node I0001", status: "Online", location: "Location",   uptime: "1 hour ago",  cpu: 0.5,  mem: 90 },
  { id: "Node I0002", status: "Online", location: "San Fanaco", uptime: "4 hours ago", cpu: 1.2,  mem: 62 },
  { id: "Node I0003", status: "Online", location: "Location",   uptime: "4 hours ago", cpu: 0.5,  mem: 58 },
  { id: "Node I0004", status: "Offline",location: "Mumbai",     uptime: "2 days ago",  cpu: 0,    mem: 0  },
  { id: "Node I0005", status: "Online", location: "Delhi",      uptime: "6 hours ago", cpu: 2.1,  mem: 74 },
];

const ACTIVITY = [
  { user: "Comercrator", role: "Administrator", ago: "7 days ago",  desc: "Latest system events and user actions." },
  { user: "Connect",     role: "Administrator", ago: "13 days ago", desc: "Latest system events and user actions." },
  { user: "User",        role: "Administrator", ago: "12 days ago", desc: "Latest system events and user actions." },
];

const ALERTS = [
  { priority: "Red",    id: "Alert 001", node: "DMS Connect", message: "New Message",     time: "26 yr" },
  { priority: "Yellow", id: "Alert 002", node: "Node I0002",  message: "High Memory",     time: "2 hr" },
  { priority: "Red",    id: "Alert 003", node: "Node I0004",  message: "Node Offline",    time: "2 d"  },
];

/* Tiny SVG sparkline data for traffic chart */
const TRAFFIC_PTS = [10,28,18,42,35,55,40,62,50,70,45,80,60,72,55,85,65,90,70,78,60,95,80,88,75,100,85,92,80,70];

function buildSparkline(pts, w = 280, h = 70) {
  const max = Math.max(...pts), min = Math.min(...pts);
  const xs = pts.map((_, i) => (i / (pts.length - 1)) * w);
  const ys = pts.map(p => h - ((p - min) / (max - min || 1)) * (h - 8) - 4);
  return xs.map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
}

/* ── Circular gauge ── */
function Gauge({ label, value, color }) {
  const r = 28, circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <div className="gauge-item">
      <svg width="70" height="70" viewBox="0 0 70 70">
        <circle cx="35" cy="35" r={r} fill="none" stroke="#e8eef5" strokeWidth="7" />
        <circle cx="35" cy="35" r={r} fill="none" stroke={color} strokeWidth="7"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 35 35)" />
        <text x="35" y="40" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1a2e45">{value}%</text>
      </svg>
      <span className="gauge-label">{label}</span>
    </div>
  );
}

/* ── Nav item ── */
function NavItem({ icon, label, active, onClick }) {
  return (
    <button className={`nav-item ${active ? "nav-item--active" : ""}`} onClick={onClick}>
      <span className="nav-icon">{icon}</span>
      <span className="nav-label">{label}</span>
    </button>
  );
}

/* ════════════ MAIN COMPONENT ════════════ */
export default function Home() {
  const navigate  = useNavigate();
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [showAll,   setShowAll]   = useState(false);

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("dms_user") || "{}"); }
    catch { return {}; }
  })();

  const handleLogout = () => { clearSession(); navigate("/login"); };

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const visibleNodes = showAll ? NODES : NODES.slice(0, 3);

  const NAV = [
    { icon: "⊞", label: "Dashboard" },
    { icon: "⬡", label: "Nodes & Clusters" },
    { icon: "☰", label: "Asset Management" },
    { icon: "♡", label: "System Health" },
    { icon: "⚙",  label: "Configuration" },
    { icon: "👤", label: "Users & Roles" },
    { icon: "🔒", label: "Security" },
    { icon: "📊", label: "Monitoring" },
    { icon: "📄", label: "Reports" },
  ];

  return (
    <div className="db-root">

      {/* ══ Sidebar ══ */}
      <aside className="db-sidebar">
        <div className="sidebar-logo">
          <DmsIcon size={30} />
          <span className="sidebar-logo-text">DMS Connect</span>
        </div>
        <nav className="sidebar-nav">
          {NAV.map(n => (
            <NavItem key={n.label} icon={n.icon} label={n.label}
              active={activeNav === n.label} onClick={() => setActiveNav(n.label)} />
          ))}
        </nav>
      </aside>

      {/* ══ Main ══ */}
      <div className="db-main">

        {/* ── Top bar ── */}
        <header className="db-topbar">
          <div className="topbar-left">
            <h1 className="topbar-title">Welcome, {user?.name || "Administrator"}!</h1>
            <p className="topbar-date">{dateStr} | {timeStr} EST</p>
          </div>
          <div className="topbar-actions">
            <button className="topbar-icon-btn" title="Messages">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>
            </button>
            <button className="topbar-icon-btn" title="Notifications">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <span className="notif-dot" />
            </button>
            <div className="topbar-avatar" onClick={handleLogout} title="Logout">
              {(user?.name || "Logout")}
            </div>
          </div>
        </header>

        {/* ── Stat cards ── */}
        <div className="db-content">
          <div className="stat-cards">
            <div className="stat-card">
              <div className="stat-card-left">
                <p className="stat-label">System Status</p>
                <p className="stat-value" style={{ color: "#27ae60" }}>99.8%</p>
                <span className="stat-badge stat-badge--green">● Online</span>
              </div>
              <div className="stat-card-right">
                <CheckIcon />
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-left">
                <p className="stat-label">Active Nodes</p>
                <p className="stat-value">142 <span className="stat-slash">/ 145</span></p>
                <span className="stat-badge stat-badge--red">3 offline</span>
              </div>
              <div className="stat-card-right">
                <XCircleIcon />
              </div>
            </div>

            <div className="stat-card stat-card--storage">
              <p className="stat-label">Storage Utilization</p>
              <div className="storage-row">
                <StorageIcon />
                <div>
                  <p className="stat-value">78.5 <span className="stat-slash">TB</span></p>
                  <p className="stat-sub">/ 120 TB</p>
                </div>
              </div>
              <div className="storage-bar-wrap">
                <div className="storage-bar"><div className="storage-fill" style={{ width: "65%" }} /></div>
                <span className="storage-pct">65% used</span>
              </div>
            </div>

            <div className="stat-card stat-card--alert">
              <div className="stat-card-left">
                <p className="stat-label">Critical Alerts</p>
                <p className="stat-value" style={{ color: "#e74c3c" }}>3 Active</p>
                <span className="stat-sub-small">3 Active, Remains, 2 details</span>
              </div>
              <div className="stat-card-right">
                <BellIcon />
              </div>
            </div>
          </div>

          {/* ── Body grid ── */}
          <div className="body-grid">

            {/* Left column */}
            <div className="body-left">

              {/* System Overview */}
              <section className="card">
                <h2 className="section-title">System Overview</h2>
                <p className="section-sub">Active Nodes</p>
                <div className="table-wrap">
                  <table className="db-table">
                    <thead>
                      <tr>
                        <th>Node ID</th>
                        <th>Status</th>
                        <th>Location</th>
                        <th>Uptime</th>
                        <th>CPU Load</th>
                        <th>Memory</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleNodes.map(n => (
                        <tr key={n.id}>
                          <td className="node-id">{n.id}</td>
                          <td>
                            <span className={`status-pill ${n.status === "Online" ? "status-pill--on" : "status-pill--off"}`}>
                              ● {n.status}
                            </span>
                          </td>
                          <td>{n.location}</td>
                          <td className="muted">{n.uptime}</td>
                          <td>{n.cpu}%</td>
                          <td>
                            <div className="mem-cell">
                              <div className="mini-bar"><div className="mini-fill" style={{ width: `${n.mem}%`, background: n.mem > 80 ? "#e74c3c" : "#3498db" }} /></div>
                              <span>{n.mem}%</span>
                            </div>
                          </td>
                          <td><button className="row-menu">⋯</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button className="show-more-btn" onClick={() => setShowAll(v => !v)}>
                  {showAll ? "Show less" : `Show ${NODES.length - 3} more`}
                </button>
              </section>

              {/* Recent Activity */}
              <section className="card">
                <h2 className="section-title">Recent Activity Stream</h2>
                <p className="section-sub">Latest system events and user actions</p>
                <div className="activity-list">
                  {ACTIVITY.map((a, i) => (
                    <div key={i} className="activity-item">
                      <div className="activity-avatar">{a.user[0]}</div>
                      <div className="activity-body">
                        <p className="activity-name">{a.user}: <span className="activity-role">{a.role}</span></p>
                        <p className="activity-desc">{a.desc}</p>
                      </div>
                      <span className="activity-ago">{a.ago}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Cluster Performance */}
              <section className="card">
                <h2 className="section-title">Cluster Performance</h2>
                <p className="section-sub">Traffic · Requests/sec</p>
                <div className="chart-area">
                  <svg viewBox="0 0 280 70" preserveAspectRatio="none" className="sparkline-svg">
                    <defs>
                      <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stopColor="#00d4aa" stopOpacity="0.3"/>
                        <stop offset="100%" stopColor="#00d4aa" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    <path d={buildSparkline(TRAFFIC_PTS) + " L280,70 L0,70 Z"} fill="url(#sparkGrad)" />
                    <path d={buildSparkline(TRAFFIC_PTS)} fill="none" stroke="#00d4aa" strokeWidth="2" strokeLinejoin="round"/>
                  </svg>
                  <div className="chart-labels">
                    {["0", "50", "100", "150", "200"].map(l => (
                      <span key={l}>{l}</span>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* Right column */}
            <div className="body-right">

              {/* Quick Access */}
              <section className="card">
                <h2 className="section-title">Quick Access</h2>
                <div className="quick-links">
                  <button className="quick-link">⬡ Manage Clusters</button>
                  <button className="quick-link">+ Add Node</button>
                  <button className="quick-link">🚀 Deploy App</button>
                </div>
              </section>

              {/* System Health Monitor */}
              <section className="card">
                <h2 className="section-title">System Health Monitor</h2>
                <div className="gauges-row">
                  <Gauge label="CPU"     value={34} color="#3498db" />
                  <Gauge label="Memory"  value={62} color="#f39c12" />
                  <Gauge label="Network" value={48} color="#27ae60" />
                </div>
              </section>

              {/* Critical Alerts */}
              <section className="card">
                <h2 className="section-title">Critical Alerts</h2>
                <table className="db-table alerts-table">
                  <thead>
                    <tr>
                      <th>Priority</th>
                      <th>Alert ID</th>
                      <th>Node</th>
                      <th>Message</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ALERTS.map((a, i) => (
                      <tr key={i}>
                        <td><span className={`priority-dot priority-dot--${a.priority.toLowerCase()}`} /></td>
                        <td className="muted">{a.id}</td>
                        <td>{a.node}</td>
                        <td>{a.message}</td>
                        <td className="muted">{a.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Icons ─── */
function DmsIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18" fill="#0a1e38" stroke="#00d4aa" strokeWidth="2"/>
      <path d="M12 14h8a6 6 0 0 1 0 12h-8V14z" fill="none" stroke="#00d4aa" strokeWidth="2" strokeLinejoin="round"/>
      <circle cx="26" cy="20" r="2" fill="#00d4aa"/>
    </svg>
  );
}
function CheckIcon() {
  return <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="16" fill="#eafaf1" stroke="#27ae60" strokeWidth="2"/><path d="M11 18l5 5 9-9" stroke="#27ae60" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function XCircleIcon() {
  return <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="16" fill="#fdf0f0" stroke="#e74c3c" strokeWidth="2"/><line x1="13" y1="13" x2="23" y2="23" stroke="#e74c3c" strokeWidth="2.5" strokeLinecap="round"/><line x1="23" y1="13" x2="13" y2="23" stroke="#e74c3c" strokeWidth="2.5" strokeLinecap="round"/></svg>;
}
function StorageIcon() {
  return <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="4" y="8" width="24" height="6" rx="3" fill="none" stroke="#3498db" strokeWidth="2"/><rect x="4" y="18" width="24" height="6" rx="3" fill="none" stroke="#3498db" strokeWidth="2"/><circle cx="25" cy="11" r="1.5" fill="#3498db"/><circle cx="25" cy="21" r="1.5" fill="#3498db"/></svg>;
}
function BellIcon() {
  return <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="16" fill="#fdf0f0"/><path d="M22 20c0-4-1.5-6-4-6s-4 2-4 6l-1 2h10l-1-2z" fill="none" stroke="#e74c3c" strokeWidth="2"/><path d="M16 22c0 1.1.9 2 2 2s2-.9 2-2" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round"/></svg>;
}
