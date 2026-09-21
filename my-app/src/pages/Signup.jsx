import { useState } from "react";
import {
  Radio,
  ArrowRight,
} from "lucide-react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import { api } from "../api/client";


export default function Signup() {

  const navigate =
    useNavigate();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [agreed, setAgreed] =
    useState(false);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  const submit = async (
    event
  ) => {

    event.preventDefault();

    setError("");

    if (
      !name.trim() ||
      !email.trim() ||
      !password
    ) {

      setError(
        "Please complete all fields."
      );

      return;
    }

    if (!agreed) {

      setError(
        "Please agree to the terms and privacy policy."
      );

      return;
    }

    setLoading(true);

    try {

      const result =
        await api.signup({
          name:
            name.trim(),
          email:
            email.trim(),
          password,
        });

      localStorage.setItem(
        "access_token",
        result.access_token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          result.user
        )
      );

      window.dispatchEvent(
        new Event(
          "auth-changed"
        )
      );

      navigate(
        "/dashboard"
      );

    } catch (
      requestError
    ) {

      setError(
        requestError.message ||
        "Unable to create your account."
      );

    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="auth-page">

      <div className="auth-brand">

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

      </div>


      <form
        className="auth-card"
        onSubmit={submit}
      >

        <span className="eyebrow">
          GET STARTED
        </span>

        <h1>
          Create your workspace
        </h1>

        <p>
          Start building more engaging
          live sessions.
        </p>


        <label>
          Full Name
        </label>

        <input
          value={name}
          onChange={(event) =>
            setName(
              event.target.value
            )
          }
          placeholder="Your full name"
          autoComplete="name"
        />


        <label>
          Email
        </label>

        <input
          type="email"
          value={email}
          onChange={(event) =>
            setEmail(
              event.target.value
            )
          }
          placeholder="you@example.com"
          autoComplete="email"
        />


        <label>
          Password
        </label>

        <input
          type="password"
          value={password}
          onChange={(event) =>
            setPassword(
              event.target.value
            )
          }
          placeholder="Create a password"
          autoComplete="new-password"
        />


        <label className="checkbox-label">

          <input
            type="checkbox"
            checked={agreed}
            onChange={(event) =>
              setAgreed(
                event.target.checked
              )
            }
          />

          I agree to the terms and privacy policy.

        </label>


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
            ? "Creating Account..."
            : "Create Account"}

          {!loading && (
            <ArrowRight size={17} />
          )}

        </button>


        <p className="auth-bottom">

          Already have an account?{" "}

          <Link to="/login">
            Sign in
          </Link>

        </p>

      </form>

    </div>
  );
}