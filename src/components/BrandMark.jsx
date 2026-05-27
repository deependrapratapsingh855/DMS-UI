import { Boxes } from "lucide-react";

export default function BrandMark() {
  return (
    <div className="dms-brand">
      <div className="dms-brand-badge">
        <Boxes size={20} strokeWidth={2.5} />
      </div>
      <div>
        <div className="dms-brand-title dms-gradient-text">DMS</div>
        <div className="dms-brand-sub">Distributor System</div>
      </div>
    </div>
  );
}
