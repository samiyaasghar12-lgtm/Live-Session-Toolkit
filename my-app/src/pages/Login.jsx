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


export default function Login() {

  const navigate =
    useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

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
      !email.trim() ||
      !password
    ) {
      setError(
        "Please enter your email and password."
      );

      return;
    }

    setLoading(true);

    try {

      const result =
        await api.login({
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
        "Unable to sign in."
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
          WELCOME BACK
        </span>

        <h1>
          Sign in to your workspace
        </h1>

        <p>
          Continue managing engaging
          live sessions.
        </p>


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
          placeholder="Enter your password"
          autoComplete="current-password"
        />


        <div className="auth-options">

          <label className="checkbox-label">

            <input
              type="checkbox"
            />

            Remember me

          </label>


          <button
            type="button"
            onClick={() =>
              setError(
                "Password recovery is not configured yet."
              )
            }
          >
            Forgot password?
          </button>

        </div>


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
            ? "Signing In..."
            : "Sign In"}

          {!loading && (
            <ArrowRight size={17} />
          )}

        </button>


        <p className="auth-bottom">

          Don't have an account?{" "}

          <Link to="/signup">
            Create one
          </Link>

        </p>

      </form>

    </div>
  );
}