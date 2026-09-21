import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import { AppDataProvider } from "./context/AppDataContext";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Sessions from "./pages/Sessions";
import CreateSession from "./pages/CreateSession";
import SessionDetails from "./pages/SessionDetails";
import HostLive from "./pages/HostLive";
import JoinSession from "./pages/JoinSession";
import ParticipantView from "./pages/ParticipantView";
import Participants from "./pages/Participants";
import Activities from "./pages/Activities";
import AIAssistant from "./pages/AIAssistant";
import SessionSummary from "./pages/SessionSummary";
import Analytics from "./pages/Analytics";
import Resources from "./pages/Resources";
import Settings from "./pages/Settings";

function App() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      darkMode
    );

    localStorage.setItem(
      "theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  return (
    <AppDataProvider>
      <div className="app">
        <Routes>
          <Route path="/" element={<Landing />} />

          <Route path="/login" element={<Login />} />

          <Route path="/signup" element={<Signup />} />

          <Route
            path="/dashboard"
            element={
              <Dashboard
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            }
          />

          <Route
            path="/sessions"
            element={
              <Sessions
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            }
          />

          <Route
            path="/sessions/create"
            element={
              <CreateSession
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            }
          />

          <Route
            path="/sessions/:id"
            element={
              <SessionDetails
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            }
          />

          <Route
            path="/sessions/:id/live"
            element={
              <HostLive
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            }
          />

          <Route
            path="/join"
            element={
              <JoinSession
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            }
          />

          <Route
            path="/participant"
            element={
              <ParticipantView
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            }
          />

          <Route
            path="/participants"
            element={
              <Participants
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            }
          />

          <Route
            path="/activities"
            element={
              <Activities
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            }
          />

          <Route
            path="/ai-assistant"
            element={
              <AIAssistant
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            }
          />

          <Route
            path="/summary"
            element={
              <SessionSummary
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            }
          />

          <Route
            path="/analytics"
            element={
              <Analytics
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            }
          />

          <Route
            path="/resources"
            element={
              <Resources
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            }
          />

          <Route
            path="/settings"
            element={
              <Settings
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            }
          />

          <Route path="*" element={<Landing />} />
        </Routes>
      </div>
    </AppDataProvider>
  );
}

export default App;