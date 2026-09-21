import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Check,
  Radio,
} from "lucide-react";

import { api } from "../api/client";


export default function ParticipantView() {

  const sessionId =
    sessionStorage.getItem(
      "participant_session_id"
    );

  const participantId =
    sessionStorage.getItem(
      "participant_id"
    );

  const joinCode =
    sessionStorage.getItem(
      "participant_join_code"
    );


  const [
    session,
    setSession,
  ] = useState(null);

  const [
    activities,
    setActivities,
  ] = useState([]);

  const [
    currentIndex,
    setCurrentIndex,
  ] = useState(0);

  const [
    selected,
    setSelected,
  ] = useState("");

  const [
    submitted,
    setSubmitted,
  ] = useState(false);

  const [error, setError] =
    useState("");


  useEffect(() => {

    if (
      !sessionId ||
      !joinCode
    ) {
      return;
    }


    let active = true;


    const load =
      async () => {

        try {

          const [
            sessionData,
            activityData,
          ] =
            await Promise.all([
              api.getSessionByCode(
                joinCode
              ),

              api.getPublicSessionActivities(
                sessionId
              ),
            ]);


          if (active) {

            setSession(
              sessionData
            );

            setActivities(
              activityData
            );

          }

        } catch (
          requestError
        ) {

          if (active) {

            setError(
              requestError.message ||
              "Unable to load the session."
            );

          }

        }

      };


    void load();


    return () => {
      active = false;
    };

  }, [
    sessionId,
    joinCode,
  ]);


  const activity =
    activities[
      currentIndex
    ];


  const options =
    useMemo(
      () =>
        activity?.options ||
        [],
      [activity]
    );


  const submit =
    async () => {

      if (
        !activity ||
        !participantId ||
        !selected
      ) {
        return;
      }


      try {

        await api.submitResponse(
          sessionId,
          participantId,
          {
            activity_id:
              activity.id,

            answer:
              selected,
          }
        );


        setSubmitted(
          true
        );

      } catch (
        requestError
      ) {

        setError(
          requestError.message ||
          "Unable to submit your response."
        );

      }

    };


  const next = () => {

    setSelected("");

    setSubmitted(false);

    setCurrentIndex(
      (index) =>
        index + 1
    );
  };


  if (
    !sessionId ||
    !participantId ||
    !joinCode
  ) {

    return (
      <div className="participant-page">

        <main className="participant-content">

          <div className="participant-question">

            <h1>
              No active participant session
            </h1>

            <p>
              Return to Join Session
              and enter a valid
              session code.
            </p>

          </div>

        </main>

      </div>
    );
  }


  return (
    <div className="participant-page">

      <header className="participant-header">

        <div className="brand">

          <div className="brand-mark">
            <Radio size={19} />
          </div>

          <div>

            <strong>
              Live Session
            </strong>

            <span>
              TOOLKIT
            </span>

          </div>

        </div>


        <span>

          {activities.length
            ? `Question ${
                Math.min(
                  currentIndex + 1,
                  activities.length
                )
              } of ${
                activities.length
              }`
            : session?.title ||
              "Live Session"}

        </span>

      </header>


      <main className="participant-content">

        <div className="participant-progress">

          <span
            style={{
              width: `${
                activities.length
                  ? (
                      (
                        currentIndex +
                        (
                          submitted
                            ? 1
                            : 0
                        )
                      ) /
                      activities.length
                    ) *
                    100
                  : 0
              }%`,
            }}
          />

        </div>


        <div className="participant-question">

          {error && (
            <p className="form-error">
              {error}
            </p>
          )}


          {!activity &&
            !error && (
              <>
                <span className="eyebrow">
                  WAITING
                </span>

                <h1>
                  Waiting for the host
                  to add an activity.
                </h1>

                <p>
                  Your participation has
                  been registered for{" "}
                  {session?.title ||
                    "this session"}.
                </p>
              </>
            )}


          {activity && (
            <>

              <span className="eyebrow">
                {activity.type}
              </span>

              <h1>
                {activity.title}
              </h1>

              <p>
                {submitted
                  ? "Your response has been recorded."
                  : "Select one answer."}
              </p>


              {!submitted &&
                options.length >
                  0 && (

                  <div className="participant-options">

                    {options.map(
                      (
                        option,
                        index
                      ) => (

                        <button
                          key={`${option}-${index}`}
                          className={
                            selected ===
                            option
                              ? "selected"
                              : ""
                          }
                          onClick={() =>
                            setSelected(
                              option
                            )
                          }
                        >

                          <span>
                            {String.fromCharCode(
                              65 +
                                index
                            )}
                          </span>

                          {option}

                          {selected ===
                            option && (
                            <Check
                              size={
                                18
                              }
                            />
                          )}

                        </button>

                      )
                    )}

                  </div>

                )}


              {!submitted ? (

                <button
                  className="primary-btn full-btn"
                  disabled={
                    !selected
                  }
                  onClick={() =>
                    void submit()
                  }
                >
                  Submit Answer
                </button>

              ) : currentIndex +
                  1 <
                activities.length ? (

                <button
                  className="primary-btn full-btn"
                  onClick={next}
                >
                  Next Question
                </button>

              ) : (

                <button
                  className="primary-btn full-btn"
                  disabled
                >
                  All Responses Submitted
                </button>

              )}

            </>
          )}

        </div>

      </main>

    </div>
  );
}