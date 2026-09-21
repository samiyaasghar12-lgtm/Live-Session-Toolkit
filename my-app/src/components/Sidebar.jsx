import {
  LayoutDashboard,
  CalendarDays,
  Users,
  ListChecks,
  FolderOpen,
  BarChart3,
  Settings,
  Sparkles,
  Plus,
  ChevronLeft,
  ChevronRight,
  Radio,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Sessions", icon: CalendarDays, path: "/sessions" },
  { label: "Participants", icon: Users, path: "/participants" },
  { label: "Polls & Quizzes", icon: ListChecks, path: "/activities" },
  { label: "Resources", icon: FolderOpen, path: "/resources" },
  { label: "Analytics", icon: BarChart3, path: "/analytics" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="brand">
        <div className="brand-mark">
          <Radio size={19} />
        </div>

        {!collapsed && (
          <div>
            <strong>Live Session</strong>
            <span>TOOLKIT</span>
          </div>
        )}
      </div>

      <NavLink to="/sessions/create" className="create-btn">
        <Plus size={18} />
        {!collapsed && "Create Session"}
      </NavLink>

      <nav className="side-nav">
        {navigation.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={label}
            to={path}
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <Icon size={19} />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <NavLink to="/ai-assistant" className="ai-sidebar-card">
          <Sparkles size={20} />
          {!collapsed && (
            <div>
              <strong>AI Assistant</strong>
              <span>Create activities faster</span>
            </div>
          )}
        </NavLink>

        <button
          className="collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && "Collapse"}
        </button>
      </div>
    </aside>
  );
}