export default function StatusBadge({ status }) {
    return (
      <span className={`status-badge ${status.toLowerCase().replace(" ", "-")}`}>
        <span className="status-dot" />
        {status}
      </span>
    );
  }