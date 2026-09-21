import {
  ArrowRight,
  Play,
  Sparkles,
  Radio,
  BarChart3,
  Users,
  CalendarDays,
  Activity,
  MessageSquare,
  TrendingUp,
  MoreHorizontal,
  CheckCircle2,
  Wand2,
  Presentation,
  LineChart,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Landing() {
  const [showDemo, setShowDemo] = useState(false);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="landing-page">
      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <nav className="landing-nav">
        <div className="brand">
          <div className="brand-mark">
            <Radio size={19} />
          </div>

          <div>
            <strong>Live Session</strong>
            <span>TOOLKIT</span>
          </div>
        </div>

        <div className="landing-links">
          <a
            href="#features"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("features");
            }}
          >
            Features
          </a>

          <a
            href="#how"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("how");
            }}
          >
            How it works
          </a>

          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("about");
            }}
          >
            About
          </a>
        </div>

        <div className="landing-actions">
          <Link
            to="/login"
            className="secondary-btn"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="primary-btn"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">
            <Sparkles size={14} />
            Built for better live learning
          </span>

          <h1>
            Engage.
            <br />
            Interact.
            <br />
            <span>Inspire.</span>
          </h1>

          <p>
            A modern toolkit for creating interactive live
            sessions, connecting with participants and turning
            real-time responses into meaningful insights.
          </p>

          <div className="hero-actions">
            <Link
              to="/signup"
              className="primary-btn large"
            >
              Get Started Free
              <ArrowRight size={17} />
            </Link>

            <button
              className="secondary-btn large"
              onClick={() => setShowDemo(true)}
            >
              <Play size={16} />
              Watch Demo
            </button>
          </div>
        </div>

        {/* =================================================
            POPULATED DASHBOARD PREVIEW
            DO NOT REMOVE / REPLACE
        ================================================= */}

        <div className="hero-dashboard">
          <div className="hero-window">
            <div className="fake-window-bar">
              <span />
              <span />
              <span />

              <div className="fake-window-title">
                Live Session Dashboard
              </div>
            </div>

            <div className="fake-dashboard">
              <aside className="fake-sidebar">
                <div className="fake-sidebar-brand">
                  <span className="fake-sidebar-logo">
                    <Radio size={11} />
                  </span>

                  <span />
                </div>

                <div className="fake-nav fake-nav-active">
                  <span />
                  <span />
                </div>

                <div className="fake-nav">
                  <span />
                  <span />
                </div>

                <div className="fake-nav">
                  <span />
                  <span />
                </div>

                <div className="fake-nav">
                  <span />
                  <span />
                </div>

                <div className="fake-nav">
                  <span />
                  <span />
                </div>

                <div className="fake-sidebar-bottom">
                  <div className="fake-nav">
                    <span />
                    <span />
                  </div>

                  <div className="fake-nav">
                    <span />
                    <span />
                  </div>
                </div>
              </aside>

              <div className="fake-main">
                <div className="fake-main-header">
                  <div>
                    <div className="fake-eyebrow" />
                    <div className="fake-title" />
                    <div className="fake-subtitle" />
                  </div>

                  <div className="fake-header-action" />
                </div>

                <div className="fake-stats">
                  <div className="fake-stat-card">
                    <span className="fake-stat-icon">
                      <Users size={12} />
                    </span>

                    <span className="fake-stat-label" />

                    <strong>512</strong>

                    <span className="fake-stat-change" />
                  </div>

                  <div className="fake-stat-card">
                    <span className="fake-stat-icon">
                      <CalendarDays size={12} />
                    </span>

                    <span className="fake-stat-label" />

                    <strong>24</strong>

                    <span className="fake-stat-change" />
                  </div>

                  <div className="fake-stat-card">
                    <span className="fake-stat-icon">
                      <Activity size={12} />
                    </span>

                    <span className="fake-stat-label" />

                    <strong>87%</strong>

                    <span className="fake-stat-change" />
                  </div>
                </div>

                <div className="fake-dashboard-grid">
                  <div className="fake-chart-panel">
                    <div className="fake-panel-head">
                      <div>
                        <span className="fake-panel-eyebrow" />
                        <span className="fake-panel-title" />
                      </div>

                      <span className="fake-select" />
                    </div>

                    <div className="fake-chart">
                      <div className="fake-chart-y y1" />
                      <div className="fake-chart-y y2" />
                      <div className="fake-chart-y y3" />

                      <div className="fake-chart-line" />

                      <div className="fake-chart-dots">
                        <i />
                        <i />
                        <i />
                        <i />
                        <i />
                        <i />
                      </div>

                      <div className="fake-chart-x">
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                      </div>
                    </div>
                  </div>

                  <div className="fake-side-panel">
                    <div className="fake-panel-head">
                      <div>
                        <span className="fake-panel-eyebrow" />
                        <span className="fake-panel-title short" />
                      </div>

                      <MoreHorizontal size={13} />
                    </div>

                    <div className="fake-activity">
                      <span className="fake-activity-icon">
                        <MessageSquare size={11} />
                      </span>

                      <div>
                        <span />
                        <span />
                      </div>

                      <b>42</b>
                    </div>

                    <div className="fake-activity">
                      <span className="fake-activity-icon">
                        <Users size={11} />
                      </span>

                      <div>
                        <span />
                        <span />
                      </div>

                      <b>38</b>
                    </div>

                    <div className="fake-activity">
                      <span className="fake-activity-icon">
                        <TrendingUp size={11} />
                      </span>

                      <div>
                        <span />
                        <span />
                      </div>

                      <b>91%</b>
                    </div>

                    <div className="fake-progress">
                      <span />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURES
      ===================================================== */}

      <section
        className="feature-strip"
        id="features"
      >
        <div>
          <Sparkles size={22} />
          <h3>AI-Powered Assistant</h3>
          <p>
            Generate questions and activities in seconds.
          </p>
        </div>

        <div>
          <Radio size={22} />
          <h3>Real-Time Interaction</h3>
          <p>
            Keep participants actively involved.
          </p>
        </div>

        <div>
          <BarChart3 size={22} />
          <h3>Powerful Analytics</h3>
          <p>
            Understand participation and engagement.
          </p>
        </div>

        <div>
          <Users size={22} />
          <h3>Participant Insights</h3>
          <p>
            Organize responses and feedback.
          </p>
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <section
        className="landing-section how-section"
        id="how"
      >
        <div className="section-heading">
          <span className="section-kicker">
            HOW IT WORKS
          </span>

          <h2>
            Everything you need for a
            <span> better live session.</span>
          </h2>

          <p>
            From creating your session to understanding
            participant engagement, Live Session Toolkit keeps
            everything organized in one simple workflow.
          </p>
        </div>

        <div className="how-grid">
          <div className="how-card">
            <div className="how-number">01</div>

            <div className="how-icon">
              <CalendarDays size={22} />
            </div>

            <h3>Create your session</h3>

            <p>
              Set up your live session, choose the topic and
              prepare everything your participants need.
            </p>

            <div className="how-card-line" />
          </div>

          <div className="how-card">
            <div className="how-number">02</div>

            <div className="how-icon">
              <Presentation size={22} />
            </div>

            <h3>Engage participants</h3>

            <p>
              Launch interactive activities, polls and quizzes
              while keeping everyone involved in real time.
            </p>

            <div className="how-card-line" />
          </div>

          <div className="how-card">
            <div className="how-number">03</div>

            <div className="how-icon">
              <LineChart size={22} />
            </div>

            <h3>Understand the results</h3>

            <p>
              Review participation, responses and engagement
              insights after your session.
            </p>

            <div className="how-card-line" />
          </div>
        </div>

        <div className="how-bottom-card">
          <div className="how-bottom-icon">
            <Wand2 size={22} />
          </div>

          <div>
            <strong>
              Built to keep live learning simple.
            </strong>

            <p>
              Create, interact and analyze without jumping
              between different tools.
            </p>
          </div>

          <div className="how-checks">
            <span>
              <CheckCircle2 size={15} />
              Easy to use
            </span>

            <span>
              <CheckCircle2 size={15} />
              Real-time
            </span>

            <span>
              <CheckCircle2 size={15} />
              Insightful
            </span>
          </div>
        </div>
      </section>

      {/* =====================================================
          DEMO / EXPERIENCE SECTION
      ===================================================== */}

      <section className="demo-section">
        <div className="demo-content">
          <span className="section-kicker">
            SEE IT IN ACTION
          </span>

          <h2>
            A cleaner way to run
            <span> interactive sessions.</span>
          </h2>

          <p>
            Bring your session, participants, activities and
            insights together in one focused workspace.
          </p>

          <button
            className="primary-btn large"
            onClick={() => setShowDemo(true)}
          >
            <Play size={16} />
            Watch the Demo
          </button>
        </div>

        <div className="demo-mini-dashboard">
          <div className="demo-mini-top">
            <span />
            <span />
            <span />
          </div>

          <div className="demo-mini-content">
            <div className="demo-mini-sidebar">
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>

            <div className="demo-mini-main">
              <div className="demo-mini-heading" />

              <div className="demo-mini-cards">
                <div />
                <div />
                <div />
              </div>

              <div className="demo-mini-chart">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          ABOUT / FOOTER
      ===================================================== */}

      <footer
        className="landing-footer"
        id="about"
      >
        <div className="footer-main">
          <div className="footer-about">
            <div className="footer-brand">
              <div className="brand-mark">
                <Radio size={18} />
              </div>

              <div>
                <strong>Live Session</strong>
                <span>TOOLKIT</span>
              </div>
            </div>

            <p>
              Live Session Toolkit is designed to make
              interactive live learning easier, more engaging
              and more insightful.
            </p>
          </div>

          <div className="footer-column">
            <h4>Product</h4>

            <a href="#features">Features</a>

            <a href="#how">How it works</a>

            <button
              onClick={() => setShowDemo(true)}
            >
              Watch Demo
            </button>
          </div>

          <div className="footer-column">
            <h4>Get started</h4>

            <Link to="/login">
              Login
            </Link>

            <Link to="/signup">
              Create an account
            </Link>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © 2026 Live Session Toolkit. All rights
            reserved.
          </span>

          <span>
            Built for better live learning.
          </span>
        </div>
      </footer>

      {/* =====================================================
          WATCH DEMO MODAL
      ===================================================== */}

      {showDemo && (
        <div
          className="demo-modal-overlay"
          onClick={() => setShowDemo(false)}
        >
          <div
            className="demo-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="demo-modal-close"
              onClick={() => setShowDemo(false)}
              aria-label="Close demo"
            >
              <X size={19} />
            </button>

            <div className="demo-modal-icon">
              <Play size={22} />
            </div>

            <span className="section-kicker">
              PRODUCT DEMO
            </span>

            <h2>
              See how Live Session Toolkit works.
            </h2>

            <p>
              Explore the complete workflow — create a
              session, engage participants with interactive
              activities and review your results with
              meaningful analytics.
            </p>

            <div className="demo-modal-preview">
              <div className="demo-preview-top">
                <span />
                <span />
                <span />
              </div>

              <div className="demo-preview-body">
                <div className="demo-preview-sidebar">
                  <i />
                  <i />
                  <i />
                  <i />
                </div>

                <div className="demo-preview-main">
                  <div className="demo-preview-title" />

                  <div className="demo-preview-stat-row">
                    <div />
                    <div />
                    <div />
                  </div>

                  <div className="demo-preview-chart">
                    <div className="demo-preview-chart-line" />
                  </div>
                </div>
              </div>

              <div className="demo-play-overlay">
                <div>
                  <Play size={22} fill="currentColor" />
                </div>
              </div>
            </div>

            <Link
              to="/signup"
              className="primary-btn large demo-modal-action"
              onClick={() => setShowDemo(false)}
            >
              Try It Yourself
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}