import {
  useMemo,
} from "react";

import {
  CheckCircle2,
  Download,
  ArrowRight,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import {
  useAppData,
} from "../context/AppDataContext";


export default function SessionSummary({
  darkMode,
  setDarkMode,
}) {

  const {
    sessions,
  } = useAppData();


  const session =
    useMemo(
      () =>
        sessions.find(
          (item) =>
            item.status ===
            "Completed"
        ) ||
        sessions[0],
      [sessions]
    );


  const downloadSummary =
    () => {

      const text = [
        `Session: ${
          session?.title ||
          "Live Session"
        }`,

        `Participants: ${
          session?.participants ||
          0
        }`,

        `Responses: ${
          session?.responses ||
          0
        }`,

        `Engagement: ${
          session?.engagement ||
          0
        }%`,
      ].join("\n");


      const blob =
        new Blob(
          [text],
          {
            type:
              "text/plain;charset=utf-8",
          }
        );


      const url =
        URL.createObjectURL(
          blob
        );


      const anchor =
        document.createElement(
          "a"
        );

      anchor.href = url;

      anchor.download =
        "session-summary.txt";

      anchor.click();

      URL.revokeObjectURL(
        url
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

          <div className="summary-success">

            <div className="success-icon">
              <CheckCircle2
                size={32}
              />
            </div>

            <span className="eyebrow">
              SESSION COMPLETE
            </span>

            <h1>
              Great session!
            </h1>

            <p>
              Your session has ended
              and participant responses
              have been organized.
            </p>


            <div className="heading-actions">

              <button
                className="secondary-btn"
                onClick={
                  downloadSummary
                }
              >
                <Download
                  size={16}
                />

                Export Summary
              </button>


              <Link
                to="/analytics"
                className="primary-btn"
              >
                View Analytics

                <ArrowRight
                  size={16}
                />
              </Link>

            </div>

          </div>


          <div className="stats-grid">

            <div className="stat-card">

              <span className="stat-label">
                Participants
              </span>

              <strong className="stat-value">
                {session?.participants ||
                  0}
              </strong>

            </div>


            <div className="stat-card">

              <span className="stat-label">
                Responses
              </span>

              <strong className="stat-value">
                {session?.responses ||
                  0}
              </strong>

            </div>


            <div className="stat-card">

              <span className="stat-label">
                Engagement
              </span>

              <strong className="stat-value">
                {session?.engagement ||
                  0}
                %
              </strong>

            </div>


            <div className="stat-card">

              <span className="stat-label">
                Status
              </span>

              <strong className="stat-value">
                Completed
              </strong>

            </div>

          </div>


          <div className="dashboard-grid">

            <div className="panel">

              <span className="eyebrow">
                SESSION
              </span>

              <h2>
                {session?.title ||
                  "Session"}
              </h2>

              <p>
                {session?.description ||
                  "The session has been completed successfully."}
              </p>

            </div>


            <div className="panel">

              <span className="eyebrow">
                NEXT STEP
              </span>

              <h2>
                Review your analytics
              </h2>

              <p>
                Use the analytics page
                to review participation,
                responses and engagement
                calculated from the
                database.
              </p>

              <Link
                to="/analytics"
                className="secondary-btn"
              >
                Open Analytics
              </Link>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}