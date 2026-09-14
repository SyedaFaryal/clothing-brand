export default function StatCard({ label, value, sub }) {
  return (
    <div className="stat-card">
      <span className="eyebrow">{label}</span>
      <span className="stat-value">{value}</span>
      {sub && <span className="stat-sub">{sub}</span>}
    </div>
  );
}
