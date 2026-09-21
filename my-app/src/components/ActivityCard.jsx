import {
  MoreHorizontal,
  Play,
  Pencil,
  Trash2,
  ListChecks,
  Star,
  MessageSquare,
} from "lucide-react";

import StatusBadge from "./StatusBadge";

export default function ActivityCard({
  activity,
  onEdit,
  onPreview,
  onDelete,
}) {
  const icons = {
    "Multiple Choice": (
      <ListChecks size={19} />
    ),
    Poll: <ListChecks size={19} />,
    "True / False": (
      <ListChecks size={19} />
    ),
    Rating: <Star size={19} />,
    "Open Ended": (
      <MessageSquare size={19} />
    ),
  };

  return (
    <div className="activity-card">
      <div className="activity-card-top">
        <div className="activity-type">
          {icons[activity.type] || (
            <ListChecks size={19} />
          )}

          <span>{activity.type}</span>
        </div>

        <button
          className="more-btn"
          onClick={() =>
            onEdit?.(activity)
          }
        >
          <MoreHorizontal size={19} />
        </button>
      </div>

      <h3>{activity.title}</h3>

      <div className="activity-meta">
        <span>
          {activity.responses || 0} responses
        </span>

        <StatusBadge
          status={activity.status}
        />
      </div>

      <div className="activity-actions">
        <button
          className="secondary-btn"
          onClick={() =>
            onEdit?.(activity)
          }
        >
          <Pencil size={15} />
          Edit
        </button>

        <button
          className="secondary-btn"
          onClick={() =>
            onPreview?.(activity)
          }
        >
          <Play size={15} />
          Preview
        </button>

        <button
          className="danger-icon"
          onClick={() =>
            onDelete?.(activity)
          }
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}