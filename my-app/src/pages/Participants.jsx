import {
  useMemo,
  useState,
} from "react";

import {
  Search,
  Download,
  Users,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Modal from "../components/Modal";

import { useAppData } from "../context/AppDataContext";

export default function Participants({
  darkMode,
  setDarkMode,
}) {
  const { participants } =
    useAppData();

  const [query, setQuery] =
    useState("");

  const [selected, setSelected] =
    useState(null);

  const filtered = useMemo(
    () =>
      participants.filter(
        (person) =>
          person.name
            .toLowerCase()
            .includes(
              query.toLowerCase()
            )
      ),
    [participants, query]
  );

  const exportCsv = () => {
    const rows = [
      [
        "Name",
        "Status",
        "Participation",
      ],

      ...participants.map(
        (person) => [
          person.name,
          person.status,
          person.participation,
        ]
      ),
    ];

    const csv = rows
      .map((row) =>
        row
          .map(
            (cell) =>
              `"${String(cell).replaceAll(
                '"',
                '""'
              )}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      [csv],
      {
        type: "text/csv;charset=utf-8",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;
    a.download =
      "participants.csv";

    a.click();

    URL.revokeObjectURL(url);
  };

  const averageParticipation =
    Math.round(
      participants.reduce(
        (sum, person) =>
          sum + person.participation,
        0
      ) /
        participants.length
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
                AUDIENCE
              </span>

              <h1>
                Participants
              </h1>

              <p>
                Monitor participation and
                engagement.
              </p>
            </div>

            <button
              className="secondary-btn"
              onClick={exportCsv}
            >
              <Download size={16} />
              Export CSV
            </button>
          </div>

          <div className="participant-stats">
            <div className="mini-stat">
              <Users size={20} />

              <div>
                <span>
                  Total Participants
                </span>

                <strong>512</strong>
              </div>
            </div>

            <div className="mini-stat">
              <div className="online-dot" />

              <div>
                <span>
                  Currently Online
                </span>

                <strong>
                  {
                    participants.filter(
                      (person) =>
                        person.status ===
                        "Present"
                    ).length
                  }
                </strong>
              </div>
            </div>

            <div className="mini-stat">
              <div className="purple-dot" />

              <div>
                <span>
                  Average Participation
                </span>

                <strong>
                  {averageParticipation}%
                </strong>
              </div>
            </div>
          </div>

          <div className="panel participant-table">
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
                  placeholder="Search participants..."
                />
              </div>
            </div>

            <div className="table-header">
              <span>
                Participant
              </span>

              <span>Status</span>

              <span>
                Participation
              </span>

              <span />
            </div>

            {filtered.map(
              (person) => (
                <div
                  className="table-row"
                  key={person.id}
                >
                  <div className="table-session">
                    <div className="avatar small">
                      {person.initials}
                    </div>

                    <div>
                      <strong>
                        {person.name}
                      </strong>

                      <span>
                        Participant
                      </span>
                    </div>
                  </div>

                  <span
                    className={
                      person.status ===
                      "Present"
                        ? "online-status"
                        : "offline-status"
                    }
                  >
                    {person.status}
                  </span>

                  <div className="participation-value">
                    <div className="mini-progress">
                      <span
                        style={{
                          width: `${person.participation}%`,
                        }}
                      />
                    </div>

                    <strong>
                      {person.participation}%
                    </strong>
                  </div>

                  <button
                    className="secondary-btn small-btn"
                    onClick={() =>
                      setSelected(person)
                    }
                  >
                    View
                  </button>
                </div>
              )
            )}
          </div>

          <Modal
            open={Boolean(selected)}
            onClose={() =>
              setSelected(null)
            }
            title="Participant details"
          >
            {selected && (
              <div className="participant-detail">
                <div className="avatar large">
                  {selected.initials}
                </div>

                <h2>
                  {selected.name}
                </h2>

                <p>
                  {selected.status} ·{" "}
                  {selected.participation}%
                  participation
                </p>

                <div className="detail-list">
                  <div>
                    <span>Status</span>

                    <strong>
                      {selected.status}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Participation
                    </span>

                    <strong>
                      {
                        selected.participation
                      }
                      %
                    </strong>
                  </div>
                </div>
              </div>
            )}
          </Modal>
        </div>
      </main>
    </div>
  );
}