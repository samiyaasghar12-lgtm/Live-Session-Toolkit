import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Trash2,
  Pencil,
  ExternalLink,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatusBadge from "../components/StatusBadge";
import Modal from "../components/Modal";

import { useAppData } from "../context/AppDataContext";

export default function Sessions({
  darkMode,
  setDarkMode,
}) {
  const navigate = useNavigate();

  const {
    sessions,
    deleteSession,
  } = useAppData();

  const [query, setQuery] =
    useState("");

  const [status, setStatus] =
    useState("All");

  const [menuId, setMenuId] =
    useState(null);

  const [deleteTarget, setDeleteTarget] =
    useState(null);

  const filtered = useMemo(
    () =>
      sessions.filter((session) => {
        const matchesQuery =
          `${session.title} ${session.type}`
            .toLowerCase()
            .includes(
              query.toLowerCase()
            );

        const matchesStatus =
          status === "All" ||
          session.status === status;

        return (
          matchesQuery &&
          matchesStatus
        );
      }),
    [sessions, query, status]
  );

  const confirmDelete = () => {
    if (!deleteTarget) return;

    void deleteSession(
      deleteTarget.id
    );
    setDeleteTarget(null);
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
          <div className="page-heading with-action">
            <div>
              <span className="eyebrow">
                MANAGEMENT
              </span>

              <h1>Sessions</h1>

              <p>
                Create, manage and review your
                live sessions.
              </p>
            </div>

            <Link
              to="/sessions/create"
              className="primary-btn"
            >
              <Plus size={17} />
              Create Session
            </Link>
          </div>

          <div className="toolbar">
            <div className="search-box inner">
              <Search size={17} />

              <input
                value={query}
                onChange={(e) =>
                  setQuery(e.target.value)
                }
                placeholder="Search sessions..."
              />
            </div>

            <div className="filter-control">
              <Filter size={16} />

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
              >
                <option>All</option>
                <option>Upcoming</option>
                <option>Completed</option>
                <option>Draft</option>
                <option>Live</option>
              </select>
            </div>
          </div>

          <div className="sessions-table panel">
            <div className="table-header">
              <span>Session</span>
              <span>Date</span>
              <span>Participants</span>
              <span>Engagement</span>
              <span>Status</span>
              <span />
            </div>

            {filtered.length === 0 ? (
              <div className="empty-state">
                <h3>
                  No sessions found
                </h3>

                <p>
                  Try another search or create
                  a new session.
                </p>

                <Link
                  to="/sessions/create"
                  className="primary-btn"
                >
                  Create Session
                </Link>
              </div>
            ) : (
              filtered.map((session) => (
                <div
                  className="table-row"
                  key={session.id}
                >
                  <Link
                    to={`/sessions/${session.id}`}
                    className="table-session"
                  >
                    <div className="session-symbol">
                      <span>
                        {session.title.charAt(
                          0
                        )}
                      </span>
                    </div>

                    <div>
                      <strong>
                        {session.title}
                      </strong>

                      <span>
                        {session.type} ·{" "}
                        {session.visibility ||
                          "Public"}
                      </span>
                    </div>
                  </Link>

                  <span>
                    {session.date}
                  </span>

                  <span>
                    {session.participants}
                  </span>

                  <strong>
                    {session.engagement || 0}%
                  </strong>

                  <StatusBadge
                    status={session.status}
                  />

                  <div className="row-menu-wrap">
                    <button
                      className="more-btn"
                      onClick={() =>
                        setMenuId(
                          menuId ===
                            session.id
                            ? null
                            : session.id
                        )
                      }
                    >
                      <MoreHorizontal size={18} />
                    </button>

                    {menuId === session.id && (
                      <div className="row-menu">
                        <button
                          onClick={() =>
                            navigate(
                              `/sessions/${session.id}`
                            )
                          }
                        >
                          <ExternalLink size={14} />
                          View
                        </button>

                        <button
                          onClick={() =>
                            navigate(
                              `/sessions/${session.id}?edit=1`
                            )
                          }
                        >
                          <Pencil size={14} />
                          Edit
                        </button>

                        <button
                          className="danger-text"
                          onClick={() => {
                            setDeleteTarget(
                              session
                            );
                            setMenuId(null);
                          }}
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <Modal
            open={Boolean(deleteTarget)}
            onClose={() =>
              setDeleteTarget(null)
            }
            title="Delete session"
          >
            <p>
              Delete{" "}
              <strong>
                {deleteTarget?.title}
              </strong>
              ? This action removes it from
              your frontend workspace.
            </p>

            <div className="modal-actions">
              <button
                className="secondary-btn"
                onClick={() =>
                  setDeleteTarget(null)
                }
              >
                Cancel
              </button>

              <button
                className="danger-btn"
                onClick={confirmDelete}
              >
                Delete Session
              </button>
            </div>
          </Modal>
        </div>
      </main>
    </div>
  );
}