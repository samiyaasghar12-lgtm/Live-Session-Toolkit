import { useMemo, useState } from "react";
import {
  Play,
  Users,
  BarChart3,
  QrCode,
  Share2,
  Pencil,
  Trash2,
  Copy,
  Check,
} from "lucide-react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatusBadge from "../components/StatusBadge";
import Modal from "../components/Modal";

import { useAppData } from "../context/AppDataContext";

export default function SessionDetails({
  darkMode,
  setDarkMode,
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    sessions,
    activities,
    updateSession,
    deleteSession,
  } = useAppData();

  const session = sessions.find(
    (item) =>
      String(item.id) === String(id)
  );

  const [tab, setTab] =
    useState("Overview");

  const [editing, setEditing] =
    useState(false);

  const [copied, setCopied] =
    useState(false);

  const [
    confirmDelete,
    setConfirmDelete,
  ] = useState(false);

  const sessionActivities =
    useMemo(
      () =>
        activities.filter(
          (activity) =>
            activity.sessionId ===
              session?.id ||
            session?.activities?.includes(
              activity.id
            )
        ),
      [activities, session]
    );

  if (!session) {
    return (
      <div className="dashboard-layout">
        <Sidebar />

        <main className="main-area">
          <Header
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />

          <div className="page-content">
            <div className="empty-state">
              <h1>
                Session not found
              </h1>

              <p>
                The session may have been
                deleted.
              </p>

              <Link
                to="/sessions"
                className="primary-btn"
              >
                Back to Sessions
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(
        session.joinCode || "482913"
      );
    } catch {}

    setCopied(true);

    setTimeout(
      () => setCopied(false),
      1200
    );
  };

  const share = async () => {
    const text = `${session.title} — Join code: ${
      session.joinCode || "482913"
    }`;

    try {
      await navigator.clipboard.writeText(
        text
      );
    } catch {}

    alert(
      "Session details copied to your clipboard."
    );
  };

  const remove = () => {
    deleteSession(session.id);
    navigate("/sessions");
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="main-area">
        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <div className="page-content">
          <div className="session-hero">
            <div>
              <StatusBadge
                status={session.status}
              />

              <h1>{session.title}</h1>

              <p>
                {session.date} ·{" "}
                {session.time} ·{" "}
                {session.type}
              </p>
            </div>

            <div className="heading-actions">
              <button
                className="secondary-btn"
                onClick={share}
              >
                <Share2 size={16} />
                Share
              </button>

              <button
                className="secondary-btn"
                onClick={copyCode}
              >
                <QrCode size={16} />

                {copied
                  ? "Copied"
                  : "QR / Code"}
              </button>

              <button
                className="secondary-btn"
                onClick={() =>
                  setEditing(true)
                }
              >
                <Pencil size={16} />
                Edit
              </button>

              <Link
                to={`/sessions/${session.id}/live`}
                className="primary-btn"
              >
                <Play size={16} />
                Start Session
              </Link>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <Users size={20} />

              <span className="stat-label">
                Participants
              </span>

              <strong className="stat-value">
                {session.participants}
              </strong>
            </div>

            <div className="stat-card">
              <BarChart3 size={20} />

              <span className="stat-label">
                Engagement
              </span>

              <strong className="stat-value">
                {session.engagement}%
              </strong>
            </div>

            <div className="stat-card">
              <span className="stat-label">
                Activities
              </span>

              <strong className="stat-value">
                {sessionActivities.length}
              </strong>
            </div>

            <div className="stat-card">
              <span className="stat-label">
                Responses
              </span>

              <strong className="stat-value">
                {session.responses || 0}
              </strong>
            </div>
          </div>

          <div className="session-tabs">
            {[
              "Overview",
              "Participants",
              "Polls & Quizzes",
              "Resources",
              "Analytics",
            ].map((item) => (
              <button
                key={item}
                className={
                  tab === item
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setTab(item)
                }
              >
                {item}
              </button>
            ))}
          </div>

          {tab === "Overview" && (
            <div className="dashboard-grid">
              <div className="panel">
                <div className="panel-header">
                  <div>
                    <span className="eyebrow">
                      SESSION
                    </span>

                    <h2>Overview</h2>
                  </div>
                </div>

                <p className="large-description">
                  {session.description ||
                    "This session is ready for interactive activities, participant responses and live discussion."}
                </p>

                <div className="detail-list">
                  <div>
                    <span>Audience</span>

                    <strong>
                      {session.audience ||
                        "All participants"}
                    </strong>
                  </div>

                  <div>
                    <span>Duration</span>

                    <strong>
                      {session.duration ||
                        "60 minutes"}
                    </strong>
                  </div>

                  <div>
                    <span>Visibility</span>

                    <strong>
                      {session.visibility ||
                        "Public"}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="panel session-code-card">
                <span className="eyebrow">
                  JOIN SESSION
                </span>

                <h2>
                  {session.joinCode ||
                    "482913"}
                </h2>

                <p>
                  Share this code with
                  participants.
                </p>

                <button
                  className="primary-btn"
                  onClick={copyCode}
                >
                  {copied ? (
                    <Check size={16} />
                  ) : (
                    <Copy size={16} />
                  )}

                  {copied
                    ? "Copied"
                    : "Copy Join Code"}
                </button>
              </div>
            </div>
          )}

          {tab === "Participants" && (
            <div className="panel">
              <h2>Participants</h2>

              <p className="page-lede">
                {session.participants}{" "}
                participants are associated
                with this session.
              </p>

              <Link
                to="/participants"
                className="secondary-btn"
              >
                Manage Participants
              </Link>
            </div>
          )}

          {tab ===
            "Polls & Quizzes" && (
            <div className="panel">
              <div className="panel-header">
                <div>
                  <span className="eyebrow">
                    ACTIVITIES
                  </span>

                  <h2>
                    {sessionActivities.length}{" "}
                    activities
                  </h2>
                </div>

                <Link
                  to="/activities"
                  className="primary-btn"
                >
                  Manage Activities
                </Link>
              </div>

              {sessionActivities.length ? (
                <div className="detail-list">
                  {sessionActivities.map(
                    (activity) => (
                      <div
                        key={activity.id}
                      >
                        <span>
                          {activity.type}
                        </span>

                        <strong>
                          {activity.title}
                        </strong>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="empty-state compact">
                  <p>
                    No activities have been
                    added to this session yet.
                  </p>

                  <Link
                    to="/activities"
                    className="secondary-btn"
                  >
                    Create Activity
                  </Link>
                </div>
              )}
            </div>
          )}

          {tab === "Resources" && (
            <div className="panel">
              <h2>Resources</h2>

              <p className="page-lede">
                Session resources are managed
                from the Resources page.
              </p>

              <Link
                to="/resources"
                className="secondary-btn"
              >
                Open Resources
              </Link>
            </div>
          )}

          {tab === "Analytics" && (
            <div className="panel">
              <h2>Analytics</h2>

              <p className="page-lede">
                Current engagement is{" "}
                {session.engagement || 0}% with{" "}
                {session.responses || 0}{" "}
                responses.
              </p>

              <Link
                to="/analytics"
                className="secondary-btn"
              >
                Open Analytics
              </Link>
            </div>
          )}

          <div className="danger-zone panel">
            <div>
              <span className="eyebrow">
                DANGER ZONE
              </span>

              <h3>
                Delete this session
              </h3>

              <p>
                This removes the session from
                the current frontend workspace.
              </p>
            </div>

            <button
              className="danger-btn"
              onClick={() =>
                setConfirmDelete(true)
              }
            >
              <Trash2 size={15} />
              Delete Session
            </button>
          </div>

          <Modal
            open={editing}
            onClose={() =>
              setEditing(false)
            }
            title="Edit session"
          >
            <SessionEditForm
              session={session}
              onSave={(updates) => {
                updateSession(
                  session.id,
                  updates
                );

                setEditing(false);
              }}
            />
          </Modal>

          <Modal
            open={confirmDelete}
            onClose={() =>
              setConfirmDelete(false)
            }
            title="Delete session"
          >
            <p>
              Are you sure you want to
              delete{" "}
              <strong>
                {session.title}
              </strong>
              ?
            </p>

            <div className="modal-actions">
              <button
                className="secondary-btn"
                onClick={() =>
                  setConfirmDelete(false)
                }
              >
                Cancel
              </button>

              <button
                className="danger-btn"
                onClick={remove}
              >
                Delete
              </button>
            </div>
          </Modal>
        </div>
      </main>
    </div>
  );
}

function SessionEditForm({
  session,
  onSave,
}) {
  const [title, setTitle] =
    useState(session.title);

  const [description, setDescription] =
    useState(
      session.description || ""
    );

  const [status, setStatus] =
    useState(session.status);

  return (
    <div>
      <label>Title</label>

      <input
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      <label>Description</label>

      <textarea
        rows="4"
        value={description}
        onChange={(e) =>
          setDescription(
            e.target.value
          )
        }
      />

      <label>Status</label>

      <select
        value={status}
        onChange={(e) =>
          setStatus(e.target.value)
        }
      >
        <option>Draft</option>
        <option>Upcoming</option>
        <option>Live</option>
        <option>Completed</option>
      </select>

      <div className="modal-actions">
        <button
          className="primary-btn"
          onClick={() =>
            onSave({
              title,
              description,
              status,
            })
          }
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}