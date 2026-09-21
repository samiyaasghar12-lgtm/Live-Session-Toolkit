import { useState } from "react";

import {
  Radio,
  ArrowRight,
  QrCode,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import { api } from "../api/client";


export default function JoinSession() {

  const [code, setCode] =
    useState("");

  const [name, setName] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const navigate =
    useNavigate();


  const join = async (
    event
  ) => {

    event.preventDefault();

    setError("");


    if (
      code.trim().length !== 6
    ) {

      setError(
        "Please enter the 6-character session code."
      );

      return;
    }


    if (!name.trim()) {

      setError(
        "Please enter your name."
      );

      return;
    }


    setLoading(true);


    try {

      const session =
        await api.getSessionByCode(
          code.trim()
        );


      const participant =
        await api.joinSession(
          session.id,
          name.trim()
        );


      sessionStorage.setItem(
        "participant_session_id",
        String(session.id)
      );

      sessionStorage.setItem(
        "participant_id",
        String(participant.id)
      );

      sessionStorage.setItem(
        "participant_name",
        participant.name
      );

      sessionStorage.setItem(
        "participant_join_code",
        code.trim().toUpperCase()
      );


      navigate(
        "/participant"
      );

    } catch (
      requestError
    ) {

      setError(
        requestError.message ||
        "Unable to join this session."
      );

    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="join-page">

      <form
        className="join-card"
        onSubmit={join}
      >

        <div className="brand centered">

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


        <span className="eyebrow">
          JOIN A SESSION
        </span>

        <h1>
          Ready to participate?
        </h1>

        <p>
          Enter the session code and
          your name to join the live
          activity.
        </p>


        <label>
          Your Name
        </label>

        <input
          value={name}
          onChange={(event) =>
            setName(
              event.target.value
            )
          }
          placeholder="Your name"
        />


        <label>
          Session Code
        </label>

        <input
          className="session-code-input"
          maxLength="6"
          value={code}
          onChange={(event) =>
            setCode(
              event.target.value
                .toUpperCase()
                .replace(
                  /[^A-Z0-9]/g,
                  ""
                )
            )
          }
          placeholder="ABC123"
        />


        {error && (
          <p className="form-error">
            {error}
          </p>
        )}


        <button
          className="primary-btn full-btn"
          type="submit"
          disabled={loading}
        >

          {loading
            ? "Joining..."
            : "Join Session"}

          {!loading && (
            <ArrowRight size={17} />
          )}

        </button>


        <div className="qr-option">

          <QrCode size={19} />

          <span>
            Or scan the QR code
            from your host
          </span>

        </div>

      </form>

    </div>
  );
}