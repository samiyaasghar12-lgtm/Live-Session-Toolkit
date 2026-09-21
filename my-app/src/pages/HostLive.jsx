import { useEffect, useMemo, useRef, useState } from "react";

import {
  BarChart3,
  Camera,
  CameraOff,
  Mic,
  MicOff,
  MonitorUp,
  Pause,
  Play,
  Square,
  Users,
  Wifi,
  X,
} from "lucide-react";

import { Link, useNavigate, useParams } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Modal from "../components/Modal";

import { useAppData } from "../context/AppDataContext";

import "./HostLive.css";

export default function HostLive({ darkMode, setDarkMode }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    sessions,
    activities,
    resources,
    updateSession,
  } = useAppData();

  const session = sessions.find(
    (item) => String(item.id) === String(id)
  );

  const sessionActivities = useMemo(
    () =>
      activities.filter(
        (activity) =>
          String(activity.sessionId) === String(session?.id) ||
          (Array.isArray(session?.activities) &&
            session.activities.some(
              (activityId) =>
                String(activityId) === String(activity.id)
            ))
      ),
    [activities, session]
  );

  const [activeActivity, setActiveActivity] =
    useState(null);

  const [activityPickerOpen, setActivityPickerOpen] =
    useState(false);

  const [resourcePickerOpen, setResourcePickerOpen] =
    useState(false);

  const [activeResource, setActiveResource] =
    useState(null);

  const [cameraOn, setCameraOn] =
    useState(false);

  const [micOn, setMicOn] =
    useState(false);

  const [screenSharing, setScreenSharing] =
    useState(false);

  const [mediaError, setMediaError] =
    useState("");

  const [seconds, setSeconds] =
    useState(45);

  const [responses, setResponses] =
    useState(session?.participants || 0);

  const [running, setRunning] =
    useState(true);

  const cameraStreamRef =
    useRef(null);

  const micStreamRef =
    useRef(null);

  const screenStreamRef =
    useRef(null);

  const cameraVideoRef =
    useRef(null);

  const screenVideoRef =
    useRef(null);

  useEffect(() => {
    if (
      session &&
      session.status !== "Live"
    ) {
      updateSession(session.id, {
        status: "Live",
      });
    }
  }, [session?.id]);

  useEffect(() => {
    if (!activeActivity) {
      setSeconds(45);
      return undefined;
    }

    const timer = setInterval(() => {
      if (!running) return;

      setSeconds((value) =>
        value <= 0 ? 45 : value - 1
      );
    }, 1000);

    return () =>
      clearInterval(timer);
  }, [
    activeActivity,
    running,
  ]);

  useEffect(() => {
    if (
      cameraVideoRef.current &&
      cameraStreamRef.current
    ) {
      cameraVideoRef.current.srcObject =
        cameraStreamRef.current;
    }
  }, [cameraOn]);

  useEffect(() => {
    if (
      screenVideoRef.current &&
      screenStreamRef.current
    ) {
      screenVideoRef.current.srcObject =
        screenStreamRef.current;
    }
  }, [screenSharing]);

  useEffect(() => {
    return () => {
      cameraStreamRef.current
        ?.getTracks()
        .forEach((track) =>
          track.stop()
        );

      micStreamRef.current
        ?.getTracks()
        .forEach((track) =>
          track.stop()
        );

      screenStreamRef.current
        ?.getTracks()
        .forEach((track) =>
          track.stop()
        );
    };
  }, []);

  if (!session) {
    return (
      <div className="dashboard-layout">
        <Sidebar />

        <main className="main-area">
          <Header
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />

          <div className="page-content">
            <div className="empty-state">
              <h1>
                Session not found
              </h1>

              <Link
                to="/sessions"
                className="primary-btn"
              >
                Back to Sessions
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const toggleCamera =
    async () => {
      setMediaError("");

      if (cameraOn) {
        cameraStreamRef.current
          ?.getTracks()
          .forEach((track) =>
            track.stop()
          );

        cameraStreamRef.current =
          null;

        if (
          cameraVideoRef.current
        ) {
          cameraVideoRef.current.srcObject =
            null;
        }

        setCameraOn(false);

        return;
      }

      if (
        !navigator.mediaDevices
          ?.getUserMedia
      ) {
        setMediaError(
          "Camera access is not supported by this browser."
        );

        return;
      }

      try {
        const stream =
          await navigator.mediaDevices.getUserMedia(
            {
              video: true,
              audio: false,
            }
          );

        cameraStreamRef.current =
          stream;

        if (
          cameraVideoRef.current
        ) {
          cameraVideoRef.current.srcObject =
            stream;
        }

        setCameraOn(true);
      } catch {
        setMediaError(
          "Camera permission was denied or is unavailable."
        );
      }
    };

  const toggleMic =
    async () => {
      setMediaError("");

      if (micOn) {
        micStreamRef.current
          ?.getTracks()
          .forEach((track) =>
            track.stop()
          );

        micStreamRef.current =
          null;

        setMicOn(false);

        return;
      }

      if (
        !navigator.mediaDevices
          ?.getUserMedia
      ) {
        setMediaError(
          "Microphone access is not supported by this browser."
        );

        return;
      }

      try {
        const audioStream =
          await navigator.mediaDevices.getUserMedia(
            {
              audio: true,
              video: false,
            }
          );

        micStreamRef.current =
          audioStream;

        setMicOn(true);
      } catch {
        setMediaError(
          "Microphone permission was denied or is unavailable."
        );
      }
    };

  const toggleScreenShare =
    async () => {
      setMediaError("");

      if (screenSharing) {
        screenStreamRef.current
          ?.getTracks()
          .forEach((track) =>
            track.stop()
          );

        screenStreamRef.current =
          null;

        if (
          screenVideoRef.current
        ) {
          screenVideoRef.current.srcObject =
            null;
        }

        setScreenSharing(false);

        return;
      }

      if (
        !navigator.mediaDevices
          ?.getDisplayMedia
      ) {
        setMediaError(
          "Screen sharing is not supported by this browser."
        );

        return;
      }

      try {
        const stream =
          await navigator.mediaDevices.getDisplayMedia(
            {
              video: true,
              audio: false,
            }
          );

        screenStreamRef.current =
          stream;

        if (
          screenVideoRef.current
        ) {
          screenVideoRef.current.srcObject =
            stream;
        }

        setScreenSharing(true);

        const [track] =
          stream.getVideoTracks();

        if (track) {
          track.onended = () => {
            screenStreamRef.current =
              null;

            if (
              screenVideoRef.current
            ) {
              screenVideoRef.current.srcObject =
                null;
            }

            setScreenSharing(false);
          };
        }
      } catch {
        // Closing the browser's screen-share picker
        // is not treated as an application error.
      }
    };

  const selectActivity =
    (activity) => {
      setActiveActivity(
        activity
      );

      setActivityPickerOpen(
        false
      );

      setActiveResource(null);

      setSeconds(45);

      setRunning(true);
    };

  const selectResource =
    (resource) => {
      setActiveResource(
        resource
      );

      setResourcePickerOpen(
        false
      );
    };

  const end = () => {
    cameraStreamRef.current
      ?.getTracks()
      .forEach((track) =>
        track.stop()
      );

    micStreamRef.current
      ?.getTracks()
      .forEach((track) =>
        track.stop()
      );

    screenStreamRef.current
      ?.getTracks()
      .forEach((track) =>
        track.stop()
      );

    updateSession(
      session.id,
      {
        status: "Completed",
        participants: Math.max(
          session.participants || 0,
          responses
        ),
      }
    );

    navigate("/summary");
  };

  const participantBase =
    Math.max(
      session.participants ||
        48,
      1
    );

  const participation =
    Math.min(
      100,
      Math.max(
        0,
        Math.round(
          (responses /
            participantBase) *
            100
        )
      )
    );

  const activityOptions =
    Array.isArray(
      activeActivity?.options
    )
      ? activeActivity.options
      : [];

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="main-area live-area">
        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <div className="page-content">

          <div className="live-header">
            <div>
              <div className="live-title">
                <span className="live-dot" />

                LIVE SESSION
              </div>

              <h1>
                {session.title}
              </h1>

              <p>
                {activeActivity
                  ? `${
                      activeActivity.type ||
                      "Activity"
                    } selected for participants`
                  : "Your session is live. Choose what to present to participants."}
              </p>
            </div>

            <div className="live-controls">

              <div className="connection">
                <Wifi size={16} />

                Excellent connection
              </div>

              <div className="live-participants">
                <Users size={16} />

                {responses}
              </div>

              <button
                className="end-session-btn"
                onClick={end}
              >
                <Square size={14} />

                End Session
              </button>

            </div>
          </div>

          {mediaError && (
            <div className="live-media-error">
              {mediaError}

              <button
                className="icon-btn"
                onClick={() =>
                  setMediaError("")
                }
                aria-label="Dismiss"
              >
                <X size={15} />
              </button>
            </div>
          )}

          <div className="live-host-toolbar panel">

            <div className="live-host-toolbar__group">

              <button
                className={`live-media-btn ${
                  cameraOn
                    ? "is-active"
                    : ""
                }`}
                onClick={
                  toggleCamera
                }
                title={
                  cameraOn
                    ? "Turn camera off"
                    : "Turn camera on"
                }
              >
                {cameraOn ? (
                  <Camera size={17} />
                ) : (
                  <CameraOff size={17} />
                )}

                {cameraOn
                  ? "Camera On"
                  : "Camera"}
              </button>

              <button
                className={`live-media-btn ${
                  micOn
                    ? "is-active"
                    : ""
                }`}
                onClick={
                  toggleMic
                }
                title={
                  micOn
                    ? "Mute microphone"
                    : "Unmute microphone"
                }
              >
                {micOn ? (
                  <Mic size={17} />
                ) : (
                  <MicOff size={17} />
                )}

                {micOn
                  ? "Mic On"
                  : "Microphone"}
              </button>

              <button
                className={`live-media-btn ${
                  screenSharing
                    ? "is-active"
                    : ""
                }`}
                onClick={
                  toggleScreenShare
                }
                title={
                  screenSharing
                    ? "Stop sharing"
                    : "Share screen"
                }
              >
                <MonitorUp size={17} />

                {screenSharing
                  ? "Stop Sharing"
                  : "Share Screen"}
              </button>

            </div>

            <div className="live-host-toolbar__group">

              <button
                className="secondary-btn"
                onClick={() =>
                  setActivityPickerOpen(
                    true
                  )
                }
              >
                Add Activity
              </button>

              <button
                className="secondary-btn"
                onClick={() =>
                  setResourcePickerOpen(
                    true
                  )
                }
              >
                Resources
              </button>

            </div>

          </div>

          {(cameraOn ||
            screenSharing) && (
            <div className="live-media-stage panel">

              {screenSharing ? (
                <video
                  ref={
                    screenVideoRef
                  }
                  className="live-screen-video"
                  autoPlay
                  playsInline
                />
              ) : (
                <div className="live-screen-placeholder">
                  <MonitorUp
                    size={25}
                  />

                  <strong>
                    Screen sharing is off
                  </strong>

                  <span>
                    Your camera is currently active.
                  </span>
                </div>
              )}

              {cameraOn && (
                <div className="live-camera-preview">

                  <video
                    ref={
                      cameraVideoRef
                    }
                    autoPlay
                    muted
                    playsInline
                  />

                  <span>
                    Host camera
                  </span>

                </div>
              )}

            </div>
          )}

          <div className="live-grid">

            <div className="live-question panel">

              {!activeActivity ? (
                <div className="live-waiting-state">

                  <div className="live-waiting-icon">
                    <MonitorUp
                      size={26}
                    />
                  </div>

                  <span className="eyebrow">
                    READY TO PRESENT
                  </span>

                  <h2>
                    No activity is running
                  </h2>

                  <p>
                    Choose a saved activity
                    from Polls & Quizzes when
                    you are ready for
                    participants to respond.
                  </p>

                  <button
                    className="primary-btn"
                    onClick={() =>
                      setActivityPickerOpen(
                        true
                      )
                    }
                  >
                    Add Activity
                  </button>

                </div>
              ) : (
                <>
                  <div className="question-top">

                    <span>
                      {String(
                        activeActivity.type ||
                          "ACTIVITY"
                      ).toUpperCase()}
                    </span>

                    <strong>
                      00:
                      {String(
                        seconds
                      ).padStart(
                        2,
                        "0"
                      )}
                    </strong>

                  </div>

                  <h2>
                    {
                      activeActivity.title
                    }
                  </h2>

                  {activityOptions.length >
                  0 ? (
                    <div className="live-options">

                      {activityOptions.map(
                        (
                          option,
                          optionIndex
                        ) => (
                          <div
                            key={`${option}-${optionIndex}`}
                          >
                            <span>
                              {String.fromCharCode(
                                65 +
                                  optionIndex
                              )}
                            </span>

                            {option}
                          </div>
                        )
                      )}

                    </div>
                  ) : (
                    <div className="live-activity-note">

                      <strong>
                        Participant response area
                      </strong>

                      <span>
                        Participants can respond
                        according to this activity
                        type.
                      </span>

                    </div>
                  )}

                  <div className="live-navigation">

                    <button
                      className="secondary-btn"
                      onClick={() =>
                        setActiveActivity(
                          null
                        )
                      }
                    >
                      Remove Activity
                    </button>

                    <button
                      className="secondary-btn"
                      onClick={() =>
                        setRunning(
                          !running
                        )
                      }
                    >
                      {running ? (
                        <Pause size={15} />
                      ) : (
                        <Play size={15} />
                      )}

                      {running
                        ? "Pause timer"
                        : "Resume timer"}
                    </button>

                  </div>
                </>
              )}

            </div>

            <div className="live-insights">

              <div className="panel">

                <div className="panel-header">

                  <div>
                    <span className="eyebrow">
                      REAL-TIME
                    </span>

                    <h2>
                      Participation
                    </h2>
                  </div>

                  <BarChart3 size={18} />

                </div>

                <div className="big-percentage">
                  {participation}%
                </div>

                <div className="large-progress">
                  <span
                    style={{
                      width: `${participation}%`,
                    }}
                  />
                </div>

                <div className="progress-caption">

                  <span>
                    {responses} responded
                  </span>

                  <span>
                    {session.participants ||
                      48}{" "}
                    participants
                  </span>

                </div>

              </div>

              <div className="panel">

                <span className="eyebrow">
                  LIVE STATUS
                </span>

                <div className="status-list">

                  <div>
                    <span className="status-indicator green" />

                    Session is live
                  </div>

                  <div>
                    <span className="status-indicator blue" />

                    {activeActivity
                      ? "Activity running"
                      : "Waiting for activity"}
                  </div>

                  <div>
                    <span className="status-indicator green" />

                    Connection stable
                  </div>

                </div>

                {activeResource && (
                  <div className="live-resource-chip">

                    <div>
                      <span className="eyebrow">
                        RESOURCE OPEN
                      </span>

                      <strong>
                        {
                          activeResource.name
                        }
                      </strong>
                    </div>

                    <button
                      className="icon-btn"
                      onClick={() =>
                        setActiveResource(
                          null
                        )
                      }
                      title="Close resource"
                    >
                      <X size={15} />
                    </button>

                  </div>
                )}

              </div>

            </div>

          </div>

          {activeResource && (
            <div className="panel live-resource-display">

              <div className="panel-header">

                <div>
                  <span className="eyebrow">
                    RESOURCE
                  </span>

                  <h2>
                    {
                      activeResource.name
                    }
                  </h2>
                </div>

                <button
                  className="icon-btn"
                  onClick={() =>
                    setActiveResource(
                      null
                    )
                  }
                  title="Close resource"
                >
                  <X size={17} />
                </button>

              </div>

              <p>
                {
                  activeResource.description ||
                  "No description provided."
                }
              </p>

              <a
                className="primary-btn"
                href={
                  activeResource.url
                }
                target="_blank"
                rel="noreferrer"
              >
                Open Resource
              </a>

            </div>
          )}

          <Modal
            open={
              activityPickerOpen
            }
            onClose={() =>
              setActivityPickerOpen(
                false
              )
            }
            title="Add Activity to Live Session"
          >
            <div className="live-picker">

              <p>
                Select one of your saved
                Polls & Quizzes activities
                to present to participants.
              </p>

              {activities.length ===
              0 ? (
                <div className="empty-state compact">

                  <h3>
                    No saved activities
                  </h3>

                  <p>
                    Create or save an
                    activity in Polls &
                    Quizzes first.
                  </p>

                </div>
              ) : (
                <div className="live-picker-list">

                  {activities.map(
                    (activity) => (
                      <button
                        key={
                          activity.id
                        }
                        className="live-picker-item"
                        onClick={() =>
                          selectActivity(
                            activity
                          )
                        }
                      >

                        <span className="live-picker-item__type">
                          {
                            activity.type
                          }
                        </span>

                        <strong>
                          {
                            activity.title
                          }
                        </strong>

                        <span className="live-picker-item__arrow">
                          Select
                        </span>

                      </button>
                    )
                  )}

                </div>
              )}

            </div>
          </Modal>

          <Modal
            open={
              resourcePickerOpen
            }
            onClose={() =>
              setResourcePickerOpen(
                false
              )
            }
            title="Resources"
          >
            <div className="live-picker">

              <p>
                Select a saved resource
                to open while hosting
                the session.
              </p>

              {resources.length ===
              0 ? (
                <div className="empty-state compact">

                  <h3>
                    No saved resources
                  </h3>

                  <p>
                    Add a resource from
                    the Resources page
                    first.
                  </p>

                </div>
              ) : (
                <div className="live-picker-list">

                  {resources.map(
                    (resource) => (
                      <button
                        key={
                          resource.id
                        }
                        className="live-picker-item"
                        onClick={() =>
                          selectResource(
                            resource
                          )
                        }
                      >

                        <span className="live-picker-item__type">
                          {
                            resource.type
                          }
                        </span>

                        <strong>
                          {
                            resource.name
                          }
                        </strong>

                        <span className="live-picker-item__arrow">
                          Open
                        </span>

                      </button>
                    )
                  )}

                </div>
              )}

            </div>
          </Modal>

        </div>
      </main>
    </div>
  );
}