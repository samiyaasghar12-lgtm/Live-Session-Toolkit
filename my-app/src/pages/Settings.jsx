import { useState } from "react";

import {
  User,
  Bell,
  Shield,
  Palette,
  Save,
  RotateCcw,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import { useAppData } from "../context/AppDataContext";

export default function Settings({
  darkMode,
  setDarkMode,
}) {
  const {
    profile,
    updateProfile,
    resetDemoData,
  } = useAppData();

  const [tab, setTab] =
    useState("Profile");

  const [form, setForm] =
    useState(profile);

  const [saved, setSaved] =
    useState(false);

  const save = () => {
    updateProfile(form);

    setSaved(true);

    setTimeout(
      () => setSaved(false),
      1500
    );
  };

  const tabs = [
    ["Profile", User],
    ["Notifications", Bell],
    ["Privacy", Shield],
    ["Appearance", Palette],
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="main-area">
        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <div className="page-content">
          <div className="page-heading">
            <span className="eyebrow">
              PREFERENCES
            </span>

            <h1>Settings</h1>

            <p>
              Manage your profile and
              application preferences.
            </p>
          </div>

          <div className="settings-grid">
            <div className="settings-nav panel">
              {tabs.map(
                ([label, Icon]) => (
                  <button
                    key={label}
                    className={
                      tab === label
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setTab(label)
                    }
                  >
                    <Icon size={18} />
                    {label}
                  </button>
                )
              )}
            </div>

            <div className="panel settings-form">
              {tab === "Profile" && (
                <>
                  <span className="eyebrow">
                    PROFILE
                  </span>

                  <h2>
                    Personal information
                  </h2>

                  <label>
                    Full Name
                  </label>

                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        name: e.target
                          .value,
                      })
                    }
                  />

                  <label>
                    Email Address
                  </label>

                  <input
                    value={form.email}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        email:
                          e.target.value,
                      })
                    }
                  />

                  <label>Role</label>

                  <select
                    value={form.role}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        role:
                          e.target.value,
                      })
                    }
                  >
                    <option>
                      Host
                    </option>

                    <option>
                      Trainer
                    </option>

                    <option>
                      Lecturer
                    </option>
                  </select>
                </>
              )}

              {tab ===
                "Notifications" && (
                <>
                  <span className="eyebrow">
                    NOTIFICATIONS
                  </span>

                  <h2>
                    Notification preferences
                  </h2>

                  <label className="setting-toggle">
                    <input
                      type="checkbox"
                      checked={
                        form.notifications
                      }
                      onChange={(e) =>
                        setForm({
                          ...form,
                          notifications:
                            e.target.checked,
                        })
                      }
                    />

                    In-app notifications
                  </label>

                  <label className="setting-toggle">
                    <input
                      type="checkbox"
                      checked={
                        form.emailNotifications
                      }
                      onChange={(e) =>
                        setForm({
                          ...form,
                          emailNotifications:
                            e.target.checked,
                        })
                      }
                    />

                    Email notifications
                  </label>
                </>
              )}

              {tab === "Privacy" && (
                <>
                  <span className="eyebrow">
                    PRIVACY
                  </span>

                  <h2>
                    Workspace privacy
                  </h2>

                  <label>
                    Who can view your
                    workspace?
                  </label>

                  <select
                    value={form.privacy}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        privacy:
                          e.target.value,
                      })
                    }
                  >
                    <option>
                      Workspace members
                    </option>

                    <option>
                      Only me
                    </option>

                    <option>
                      Anyone with a
                      session link
                    </option>
                  </select>
                </>
              )}

              {tab ===
                "Appearance" && (
                <>
                  <span className="eyebrow">
                    APPEARANCE
                  </span>

                  <h2>Theme</h2>

                  <p>
                    Current theme:{" "}
                    <strong>
                      {darkMode
                        ? "Dark"
                        : "Light"}
                    </strong>
                  </p>

                  <button
                    className="secondary-btn"
                    onClick={() =>
                      setDarkMode(
                        !darkMode
                      )
                    }
                  >
                    {darkMode
                      ? "Switch to Light"
                      : "Switch to Dark"}
                  </button>
                </>
              )}

              {tab !==
                "Appearance" && (
                <button
                  className="primary-btn"
                  onClick={save}
                >
                  <Save size={16} />

                  {saved
                    ? "Saved"
                    : "Save Changes"}
                </button>
              )}

              <div className="settings-reset">
                <button
                  className="secondary-btn"
                  onClick={() => {
                    resetDemoData();
                    window.location.reload();
                  }}
                >
                  <RotateCcw size={15} />
                  Reset Demo Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}