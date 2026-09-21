import { useEffect, useRef, useState } from "react";
import {
  Search,
  Bell,
  Moon,
  Sun,
  HelpCircle,
  ChevronDown,
  X,
} from "lucide-react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAppData } from "../context/AppDataContext";

export default function Header({
  darkMode,
  setDarkMode,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    sessions,
    activities,
    profile,
  } = useAppData();

  const [query, setQuery] = useState("");
  const [openMenu, setOpenMenu] = useState(null);

  const menuRef = useRef(null);

  useEffect(() => {
    const close = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpenMenu(null);
      }
    };

    document.addEventListener(
      "mousedown",
      close
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        close
      );
  }, []);

  const matches = query.trim()
    ? [
        ...sessions
          .filter((item) =>
            item.title
              .toLowerCase()
              .includes(query.toLowerCase())
          )
          .map((item) => ({
            type: "Session",
            title: item.title,
            path: `/sessions/${item.id}`,
          })),

        ...activities
          .filter((item) =>
            item.title
              .toLowerCase()
              .includes(query.toLowerCase())
          )
          .map((item) => ({
            type: "Activity",
            title: item.title,
            path: "/activities",
          })),
      ].slice(0, 6)
    : [];

  const goTo = (path) => {
    setQuery("");
    setOpenMenu(null);
    navigate(path);
  };

  const isDashboard =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/sessions") ||
    location.pathname.startsWith("/activities") ||
    location.pathname.startsWith("/participants") ||
    location.pathname.startsWith("/resources") ||
    location.pathname.startsWith("/analytics") ||
    location.pathname.startsWith("/settings") ||
    location.pathname.startsWith("/ai-assistant");

  if (!isDashboard) {
    return null;
  }

  return (
    <header className="top-header">
      <div className="header-search-wrap">
        <div className="search-box">
          <Search size={18} />

          <input
            value={query}
            onChange={(e) =>
              setQuery(e.target.value)
            }
            placeholder="Search sessions, activities..."
          />

          {query && (
            <button
              className="search-clear"
              onClick={() => setQuery("")}
            >
              <X size={15} />
            </button>
          )}

          <span className="search-shortcut">
            ⌘ K
          </span>
        </div>

        {matches.length > 0 && (
          <div className="global-search-results">
            {matches.map((item) => (
              <button
                key={`${item.type}-${item.title}`}
                onClick={() => goTo(item.path)}
              >
                <span>{item.type}</span>
                <strong>{item.title}</strong>
              </button>
            ))}
          </div>
        )}
      </div>

      <div
        className="header-actions"
        ref={menuRef}
      >
        <button
          className="icon-btn"
          title="Help"
          onClick={() =>
            setOpenMenu(
              openMenu === "help"
                ? null
                : "help"
            )
          }
        >
          <HelpCircle size={19} />
        </button>

        <button
          className="icon-btn notification-btn"
          title="Notifications"
          onClick={() =>
            setOpenMenu(
              openMenu === "notifications"
                ? null
                : "notifications"
            )
          }
        >
          <Bell size={19} />
          <span />
        </button>

        <button
          className="theme-toggle"
          onClick={() =>
            setDarkMode(!darkMode)
          }
          title="Toggle theme"
        >
          {darkMode ? (
            <Sun size={18} />
          ) : (
            <Moon size={18} />
          )}
        </button>

        <button
          className="profile-menu"
          onClick={() =>
            setOpenMenu(
              openMenu === "profile"
                ? null
                : "profile"
            )
          }
        >
          <div className="avatar">
            {profile.name
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="profile-info">
            <strong>{profile.name}</strong>
            <span>{profile.role}</span>
          </div>

          <ChevronDown size={16} />
        </button>

        {openMenu === "help" && (
          <div className="header-popover">
            <strong>Need a hand?</strong>

            <p>
              Use the sidebar to manage sessions,
              activities, resources and analytics.
            </p>

            <button
              className="secondary-btn"
              onClick={() =>
                goTo("/ai-assistant")
              }
            >
              Open AI Assistant
            </button>
          </div>
        )}

        {openMenu === "notifications" && (
          <div className="header-popover">
            <strong>Notifications</strong>

            <p>
              You are all caught up. New session
              activity will appear here.
            </p>
          </div>
        )}

        {openMenu === "profile" && (
          <div className="header-popover profile-popover">
            <strong>{profile.name}</strong>

            <span>{profile.email}</span>

            <button
              onClick={() =>
                goTo("/settings")
              }
            >
              Settings
            </button>

            <button
              onClick={() => goTo("/")}
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}