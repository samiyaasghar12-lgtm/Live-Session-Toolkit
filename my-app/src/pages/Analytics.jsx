import { useEffect, useState } from "react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import {
  TrendingUp,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import { api } from "../api/client";


export default function Analytics({
  darkMode,
  setDarkMode,
}) {

  const [
    analytics,
    setAnalytics,
  ] = useState(null);

  const [error, setError] =
    useState("");


  useEffect(() => {

    let active = true;


    const load =
      async () => {

        try {

          const result =
            await api.getAnalyticsOverview();

          if (active) {
            setAnalytics(
              result
            );
          }

        } catch (
          requestError
        ) {

          if (active) {

            setError(
              requestError.message ||
              "Unable to load analytics."
            );

          }

        }

      };


    void load();


    return () => {
      active = false;
    };

  }, []);


  const sessionsData =
    (
      analytics?.sessions_data ||
      []
    )
      .slice(0, 7)
      .reverse()
      .map(
        (item) => ({
          day:
            item.session_title
              .length > 14
              ? `${item.session_title.slice(
                  0,
                  14
                )}…`
              : item.session_title,

          participation:
            item.participation_rate,

          engagement:
            item.engagement,
        })
      );


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
                INSIGHTS
              </span>

              <h1>
                Analytics
              </h1>

              <p>
                Understand how your
                sessions are performing.
              </p>

            </div>


            <select
              className="period-select"
            >
              <option>
                All sessions
              </option>

              <option>
                Last 7 days
              </option>

              <option>
                Last 30 days
              </option>
            </select>

          </div>


          {error && (
            <p className="form-error">
              {error}
            </p>
          )}


          <div className="stats-grid">

            <div className="stat-card">

              <TrendingUp size={20} />

              <span className="stat-label">
                Avg. Engagement
              </span>

              <strong className="stat-value">
                {analytics?.avg_engagement ??
                  0}
                %
              </strong>

            </div>


            <div className="stat-card">

              <span className="stat-label">
                Response Rate
              </span>

              <strong className="stat-value">
                {analytics?.response_rate ??
                  0}
                %
              </strong>

            </div>


            <div className="stat-card">

              <span className="stat-label">
                Avg. Participants
              </span>

              <strong className="stat-value">
                {analytics?.avg_participants ??
                  0}
              </strong>

            </div>


            <div className="stat-card">

              <span className="stat-label">
                Sessions
              </span>

              <strong className="stat-value">
                {analytics?.sessions ??
                  0}
              </strong>

            </div>

          </div>


          <div className="dashboard-grid">

            <div className="panel chart-panel">

              <span className="eyebrow">
                PARTICIPATION
              </span>

              <h2>
                Participation Trend
              </h2>

              <div className="chart-container">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <AreaChart
                    data={
                      sessionsData
                    }
                  >

                    <XAxis
                      dataKey="day"
                    />

                    <YAxis />

                    <Tooltip />

                    <Area
                      type="monotone"
                      dataKey="participation"
                      stroke="#6657e8"
                      fill="#6657e8"
                      fillOpacity={0.12}
                    />

                  </AreaChart>

                </ResponsiveContainer>

              </div>

            </div>


            <div className="panel chart-panel">

              <span className="eyebrow">
                ENGAGEMENT
              </span>

              <h2>
                Engagement by Session
              </h2>

              <div className="chart-container">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <BarChart
                    data={
                      sessionsData
                    }
                  >

                    <XAxis
                      dataKey="day"
                    />

                    <YAxis />

                    <Tooltip />

                    <Bar
                      dataKey="engagement"
                      fill="#8b7cf6"
                      radius={[
                        6,
                        6,
                        0,
                        0,
                      ]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}