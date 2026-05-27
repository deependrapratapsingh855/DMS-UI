export default function AnimatedBackground() {
  const nodes = [
    { cx: "12%", cy: "22%", r: 3, delay: "0s" },
    { cx: "78%", cy: "18%", r: 2, delay: "1s" },
    { cx: "30%", cy: "70%", r: 2.5, delay: "2s" },
    { cx: "62%", cy: "55%", r: 2, delay: "0.5s" },
    { cx: "88%", cy: "78%", r: 3, delay: "1.5s" },
    { cx: "20%", cy: "45%", r: 2, delay: "2.5s" },
  ];
  return (
    <div className="dms-bg" aria-hidden>
      <div className="dms-grid" />
      <svg className="dms-svg" preserveAspectRatio="none">
        <defs>
          <linearGradient id="dms-line-grad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#5ee7ff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#b388ff" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <line x1="12%" y1="22%" x2="62%" y2="55%" stroke="url(#dms-line-grad)" strokeWidth="1" opacity="0.4" />
        <line x1="62%" y1="55%" x2="88%" y2="78%" stroke="url(#dms-line-grad)" strokeWidth="1" opacity="0.4" />
        <line x1="20%" y1="45%" x2="30%" y2="70%" stroke="url(#dms-line-grad)" strokeWidth="1" opacity="0.4" />
        <line x1="78%" y1="18%" x2="62%" y2="55%" stroke="url(#dms-line-grad)" strokeWidth="1" opacity="0.4" />
        {nodes.map((n, i) => (
          <circle key={i} cx={n.cx} cy={n.cy} r={n.r} className="dms-node" style={{ animationDelay: n.delay }} />
        ))}
      </svg>
      <div className="dms-blur-orb one" />
      <div className="dms-blur-orb two" />
    </div>
  );
}
