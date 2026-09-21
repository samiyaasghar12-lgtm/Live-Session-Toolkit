export default function StatTile({
  icon,
  label,
  value,
  change,
  positive = true,
}) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <div className="stat-icon">{icon}</div>
        {change && (
          <span className={`change ${positive ? "positive" : "negative"}`}>
            {positive ? "↑" : "↓"} {change}
          </span>
        )}
      </div>

      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value}</strong>
    </div>
  );
}