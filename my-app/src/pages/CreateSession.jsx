import { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Eye,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import { useAppData } from "../context/AppDataContext";

const initialForm = {
  title: "",
  description: "",
  date: "",
  time: "",
  duration: "60 minutes",
  audience: "University Students",
  type: "Workshop",
  visibility: "Public",
};

export default function CreateSession({
  darkMode,
  setDarkMode,
}) {
  const navigate = useNavigate();

  const { createSession } =
    useAppData();

  const [form, setForm] =
    useState(initialForm);

  const [error, setError] =
    useState("");

  const update = (
    key,
    value
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const save = async (
    status = "Upcoming"
  ) => {
    if (!form.title.trim()) {
      setError(
        "Please enter a session title."
      );
      return;
    }

    const session = await createSession({
      ...form,
      status,
    });

    navigate(
      `/sessions/${session.id}`
    );
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
          <Link
            to="/sessions"
            className="back-link"
          >
            <ArrowLeft size={16} />
            Back to Sessions
          </Link>

          <div className="page-heading">
            <span className="eyebrow">
              NEW SESSION
            </span>

            <h1>
              Create a new session
            </h1>

            <p>
              Set up your session before
              adding interactive activities.
            </p>
          </div>

          <div className="create-grid">
            <div className="panel form-panel">
              <div className="step-indicator">
                <span className="active">
                  01
                </span>

                <span>
                  Session Details
                </span>

                <i />

                <span>02</span>

                <span>
                  Activities
                </span>

                <i />

                <span>03</span>

                <span>
                  Review & Launch
                </span>
              </div>

              <div className="form-section">
                <h2>
                  Session information
                </h2>

                <p>
                  Tell participants what this
                  session is about.
                </p>

                {error && (
                  <div className="form-error">
                    {error}
                  </div>
                )}

                <label>
                  Session Title
                </label>

                <input
                  value={form.title}
                  onChange={(e) =>
                    update(
                      "title",
                      e.target.value
                    )
                  }
                  placeholder="e.g. Introduction to Cybersecurity"
                />

                <label>
                  Description
                </label>

                <textarea
                  value={form.description}
                  onChange={(e) =>
                    update(
                      "description",
                      e.target.value
                    )
                  }
                  placeholder="Describe the purpose and objectives of your session..."
                  rows="4"
                />

                <div className="two-columns">
                  <div>
                    <label>
                      <Calendar size={15} />
                      Date
                    </label>

                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) =>
                        update(
                          "date",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>
                      <Clock size={15} />
                      Time
                    </label>

                    <input
                      type="time"
                      value={form.time}
                      onChange={(e) =>
                        update(
                          "time",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>

                <div className="two-columns">
                  <div>
                    <label>
                      Duration
                    </label>

                    <select
                      value={form.duration}
                      onChange={(e) =>
                        update(
                          "duration",
                          e.target.value
                        )
                      }
                    >
                      <option>
                        30 minutes
                      </option>
                      <option>
                        45 minutes
                      </option>
                      <option>
                        60 minutes
                      </option>
                      <option>
                        90 minutes
                      </option>
                      <option>
                        120 minutes
                      </option>
                    </select>
                  </div>

                  <div>
                    <label>
                      <Users size={15} />
                      Audience
                    </label>

                    <select
                      value={form.audience}
                      onChange={(e) =>
                        update(
                          "audience",
                          e.target.value
                        )
                      }
                    >
                      <option>
                        University Students
                      </option>
                      <option>
                        Professionals
                      </option>
                      <option>
                        Teachers
                      </option>
                      <option>
                        Workshop Participants
                      </option>
                    </select>
                  </div>
                </div>

                <div className="two-columns">
                  <div>
                    <label>
                      Session Type
                    </label>

                    <select
                      value={form.type}
                      onChange={(e) =>
                        update(
                          "type",
                          e.target.value
                        )
                      }
                    >
                      <option>
                        Workshop
                      </option>
                      <option>
                        Lecture
                      </option>
                      <option>
                        Training
                      </option>
                      <option>
                        Brainstorm
                      </option>
                    </select>
                  </div>

                  <div>
                    <label>
                      Visibility
                    </label>

                    <select
                      value={form.visibility}
                      onChange={(e) =>
                        update(
                          "visibility",
                          e.target.value
                        )
                      }
                    >
                      <option>
                        Public
                      </option>
                      <option>
                        Private
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-footer">
                <Link
                  to="/sessions"
                  className="secondary-btn"
                >
                  Cancel
                </Link>

                <button
                  className="secondary-btn"
                  onClick={() =>
                    save("Draft")
                  }
                >
                  Save Draft
                </button>

                <button
                  className="primary-btn"
                  onClick={() =>
                    save("Upcoming")
                  }
                >
                  Create Session
                </button>
              </div>
            </div>

            <div className="session-preview panel">
              <div className="panel-header">
                <div>
                  <span className="eyebrow">
                    PREVIEW
                  </span>

                  <h2>
                    Session Preview
                  </h2>
                </div>

                <Eye size={18} />
              </div>

              <div className="preview-card">
                <div className="preview-icon">
                  <Calendar size={24} />
                </div>

                <h2>
                  {form.title ||
                    "Your Session Title"}
                </h2>

                <p>
                  {form.description ||
                    "Your session description will appear here."}
                </p>

                <div className="preview-details">
                  <span>
                    {form.date ||
                      "Date not selected"}
                  </span>

                  <span>
                    {form.time ||
                      "Time not selected"}
                  </span>

                  <span>
                    {form.audience}
                  </span>
                </div>

                <button
                  className="primary-btn"
                  onClick={() =>
                    save("Upcoming")
                  }
                  disabled={
                    !form.title.trim()
                  }
                >
                  Create Session
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}