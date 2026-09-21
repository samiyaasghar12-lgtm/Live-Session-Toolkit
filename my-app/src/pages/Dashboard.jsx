import { 
  CalendarDays, 
  Users, 
  ListChecks, 
  TrendingUp, 
  Plus, 
  Sparkles, 
  ArrowUpRight, 
} from "lucide-react"; 
 
import { Link } from "react-router-dom"; 
 
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
} from "recharts"; 
 
import Sidebar from "../components/Sidebar"; 
import Header from "../components/Header"; 
import StatTile from "../components/StatTile"; 
import StatusBadge from "../components/StatusBadge"; 
 
import { chartData } from "../data/mockData"; 
import { useAppData } from "../context/AppDataContext"; 
import { useEffect, useState } from "react"; 
 
export default function Dashboard({ 
  darkMode, 
  setDarkMode, 
}) { 
  const { 
    sessions, 
    activities, 
    participants, 
  } = useAppData(); 
 
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const user = JSON.parse(storedUser);

        if (user?.email) {
          const firstName = user.email
            .split("@")[0]
            .split(/[._-]/)[0];

          setUserName(
            firstName.charAt(0).toUpperCase() +
            firstName.slice(1)
          );
        }
      }
    } catch (error) {
      console.error("Unable to load user information:", error);
    }
  }, []);

  const totalParticipants = 
    512 + 
    Math.max( 
      0, 
      participants.length - 6 
    ); 
 
  const engagement = sessions.length 
    ? Math.round( 
        sessions.reduce( 
          (sum, item) => 
            sum + 
            Number( 
              item.engagement || 0 
            ), 
          0 
        ) / sessions.length 
      ) 
    : 0; 
 
  return ( 
    <div className="dashboard-layout"> 
      <Sidebar /> 
 
      <main className="main-area"> 
        <Header 
          darkMode={darkMode} 
          setDarkMode={setDarkMode} 
        /> 
 
        <div className="page-content"> 
          <div className="welcome-row"> 
            <div> 
              <span className="eyebrow"> 
                DASHBOARD 
              </span> 
 
              <h1> 
                Welcome back, {userName} 
              </h1> 
 
              <p> 
                Here's what's happening 
                with your live sessions. 
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
 
          <section className="stats-grid"> 
            <StatTile 
              icon={ 
                <CalendarDays size={20} /> 
              } 
              label="Total Sessions" 
              value={String( 
                sessions.length 
              )} 
              change="Live" 
            /> 
 
            <StatTile 
              icon={<Users size={20} />} 
              label="Total Participants" 
              value={String( 
                totalParticipants 
              )} 
              change="12%" 
            /> 
 
            <StatTile 
              icon={ 
                <ListChecks size={20} /> 
              } 
              label="Active Polls" 
              value={String( 
                activities.filter( 
                  (activity) => 
                    activity.status === 
                    "Published" 
                ).length 
              ).padStart(2, "0")} 
              change="8%" 
            /> 
 
            <StatTile 
              icon={ 
                <TrendingUp size={20} /> 
              } 
              label="Engagement Rate" 
              value={`${engagement}%`} 
              change="12%" 
            /> 
          </section> 
 
          <section className="dashboard-grid"> 
            <div className="panel chart-panel"> 
              <div className="panel-header"> 
                <div> 
                  <span className="eyebrow"> 
                    ENGAGEMENT 
                  </span> 
 
                  <h2> 
                    Participation Overview 
                  </h2> 
                </div> 
 
                <select> 
                  <option> 
                    Last 7 days 
                  </option> 
 
                  <option> 
                    Last 30 days 
                  </option> 
 
                  <option> 
                    This month 
                  </option> 
                </select> 
              </div> 
 
              <div className="chart-container"> 
                <ResponsiveContainer 
                  width="100%" 
                  height="100%" 
                > 
                  <AreaChart 
                    data={chartData} 
                  > 
                    <XAxis dataKey="day" /> 
 
                    <YAxis /> 
 
                    <Tooltip /> 
 
                    <Area 
                      type="monotone" 
                      dataKey="participation" 
                      stroke="#6657e8" 
                      strokeWidth={3} 
                      fill="#6657e8" 
                      fillOpacity={0.12} 
                    /> 
                  </AreaChart> 
                </ResponsiveContainer> 
              </div> 
            </div> 
 
            <div className="panel quick-panel"> 
              <div className="panel-header"> 
                <div> 
                  <span className="eyebrow"> 
                    SHORTCUTS 
                  </span> 
 
                  <h2> 
                    Quick Actions 
                  </h2> 
                </div> 
              </div> 
 
              <div className="quick-actions"> 
                <Link to="/sessions/create"> 
                  <Plus size={18} /> 
                  Create Session 
                  <ArrowUpRight size={16} /> 
                </Link> 
 
                <Link to="/activities"> 
                  <ListChecks size={18} /> 
                  Create Poll 
                  <ArrowUpRight size={16} /> 
                </Link> 
 
                <Link to="/ai-assistant"> 
                  <Sparkles size={18} /> 
                  Generate with AI 
                  <ArrowUpRight size={16} /> 
                </Link> 
 
                <Link to="/participants"> 
                  <Users size={18} /> 
                  View Participants 
                  <ArrowUpRight size={16} /> 
                </Link> 
              </div> 
            </div> 
          </section> 
 
          <section className="bottom-dashboard-grid"> 
            <div className="panel"> 
              <div className="panel-header"> 
                <div> 
                  <span className="eyebrow"> 
                    RECENT 
                  </span> 
 
                  <h2> 
                    Recent Sessions 
                  </h2> 
                </div> 
 
                <Link 
                  to="/sessions" 
                  className="text-link" 
                > 
                  View all 
                </Link> 
              </div> 
 
              <div className="session-list"> 
                {sessions 
                  .slice(0, 4) 
                  .map((session) => ( 
                    <Link 
                      to={`/sessions/${session.id}`} 
                      className="session-row" 
                      key={session.id} 
                    > 
                      <div className="session-symbol"> 
                        <CalendarDays 
                          size={18} 
                        /> 
                      </div> 
 
                      <div className="session-info"> 
                        <strong> 
                          {session.title} 
                        </strong> 
 
                        <span> 
                          {session.date} ·{" "} 
                          {session.time} 
                        </span> 
                      </div> 
 
                      <span className="session-participants"> 
                        {session.participants}{" "} 
                        participants 
                      </span> 
 
                      <StatusBadge 
                        status={ 
                          session.status 
                        } 
                      /> 
                    </Link> 
                  ))} 
              </div> 
            </div> 
 
            <div className="ai-mini-card"> 
              <div className="ai-mini-orb"> 
                <Sparkles size={27} /> 
              </div> 
 
              <span className="eyebrow"> 
                AI ASSISTANT 
              </span> 
 
              <h2> 
                Need help creating engaging 
                activities? 
              </h2> 
 
              <p> 
                Generate questions and 
                interactive activities based on 
                your session topic. 
              </p> 
 
              <Link 
                to="/ai-assistant" 
                className="primary-btn" 
              > 
                Open AI Assistant 
              </Link> 
            </div> 
          </section> 
        </div> 
      </main> 
    </div> 
  ); 
}