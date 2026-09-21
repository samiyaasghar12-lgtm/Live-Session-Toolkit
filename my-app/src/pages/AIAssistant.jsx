import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import AIPanel from "../components/AIPanel";


export default function AIAssistant({
  darkMode,
  setDarkMode,
}) {

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

            <div>

              <span className="eyebrow">
                AI POWERED
              </span>

              <h1>
                Question & Activity Assistant
              </h1>

              <p>
                Create meaningful interactive
                activities without starting
                from scratch.
              </p>

            </div>

          </div>

          <AIPanel />

        </div>

      </main>

    </div>
  );
}