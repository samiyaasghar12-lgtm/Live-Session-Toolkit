import {
  useMemo,
  useState,
} from "react";

import {
  Plus,
  Sparkles,
  Search,
} from "lucide-react";

import { Link } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ActivityCard from "../components/ActivityCard";
import Modal from "../components/Modal";

import { useAppData } from "../context/AppDataContext";

export default function Activities({
  darkMode,
  setDarkMode,
}) {
  const {
    activities,
    createActivity,
    updateActivity,
    deleteActivity,
  } = useAppData();

  const [query, setQuery] =
    useState("");

  const [modal, setModal] =
    useState(null);

  const [form, setForm] =
    useState({
      title: "",
      type: "Multiple Choice",
      status: "Draft",
    });

  const filtered = useMemo(
    () =>
      activities.filter(
        (item) =>
          item.title
            .toLowerCase()
            .includes(
              query.toLowerCase()
            ) ||
          item.type
            .toLowerCase()
            .includes(
              query.toLowerCase()
            )
      ),
    [activities, query]
  );

  const openCreate = () => {
    setForm({
      title: "",
      type: "Multiple Choice",
      status: "Draft",
    });

    setModal("create");
  };

  const openEdit = (activity) => {
    setForm({
      ...activity,
    });

    setModal(activity);
  };

  const save = async () => {
    if (!form.title.trim()) {
      return;
    }
  
    if (modal === "create") {
      await createActivity(form);
    } else {
      await updateActivity(
        modal.id,
        {
          title: form.title,
          type: form.type,
          status: form.status,
        }
      );
    }
  
    setModal(null);
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
                INTERACTION
              </span>

              <h1>
                Polls & Quizzes
              </h1>

              <p>
                Create activities and keep
                your audience involved.
              </p>
            </div>

            <div className="heading-actions">
              <Link
                to="/ai-assistant"
                className="secondary-btn"
              >
                <Sparkles size={16} />
                Generate with AI
              </Link>

              <button
                className="primary-btn"
                onClick={openCreate}
              >
                <Plus size={17} />
                Create Activity
              </button>
            </div>
          </div>

          <div className="toolbar">
            <div className="search-box inner">
              <Search size={17} />

              <input
                value={query}
                onChange={(e) =>
                  setQuery(
                    e.target.value
                  )
                }
                placeholder="Search activities..."
              />
            </div>
          </div>

          <div className="activity-grid">
            {filtered.map(
              (activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onEdit={openEdit}
                  onPreview={(item) =>
                    setModal({
                      ...item,
                      preview: true,
                    })
                  }
                  onDelete={(item) =>
                    deleteActivity(
                      item.id
                    )
                  }
                />
              )
            )}
          </div>

          {filtered.length === 0 && (
            <div className="empty-state">
              <h3>
                No activities found
              </h3>

              <p>
                Create one manually or
                generate activities with AI.
              </p>
            </div>
          )}

          <Modal
            open={Boolean(modal)}
            onClose={() =>
              setModal(null)
            }
            title={
              modal?.preview
                ? "Activity Preview"
                : modal === "create"
                ? "Create Activity"
                : "Edit Activity"
            }
          >
            {modal?.preview ? (
              <div>
                <span className="eyebrow">
                  {modal.type}
                </span>

                <h2>
                  {modal.title}
                </h2>

                <p>
                  This is a frontend preview
                  of the activity.
                </p>

                <button
                  className="primary-btn"
                  onClick={() =>
                    setModal(null)
                  }
                >
                  Close Preview
                </button>
              </div>
            ) : (
              <div>
                <label>
                  Question / Prompt
                </label>

                <textarea
                  rows="4"
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title:
                        e.target.value,
                    })
                  }
                  placeholder="Write your question..."
                />

                <label>Type</label>

                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      type:
                        e.target.value,
                    })
                  }
                >
                  <option>
                    Multiple Choice
                  </option>
                  <option>Poll</option>
                  <option>
                    True / False
                  </option>
                  <option>
                    Open Ended
                  </option>
                  <option>
                    Rating
                  </option>
                </select>

                <label>Status</label>

                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status:
                        e.target.value,
                    })
                  }
                >
                  <option>
                    Draft
                  </option>
                  <option>
                    Published
                  </option>
                </select>

                <div className="modal-actions">
                  <button
                    className="secondary-btn"
                    onClick={() =>
                      setModal(null)
                    }
                  >
                    Cancel
                  </button>

                  <button
                    className="primary-btn"
                    onClick={save}
                  >
                    Save Activity
                  </button>
                </div>
              </div>
            )}
          </Modal>
        </div>
      </main>
    </div>
  );
}