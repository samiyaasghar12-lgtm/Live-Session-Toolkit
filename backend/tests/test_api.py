from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health():

    response = client.get(
        "/api/health"
    )

    assert response.status_code == 200

    assert response.json()["status"] == "ok"


def test_signup_and_login():

    email = (
        "backend_test_user@example.com"
    )

    signup_response = client.post(
        "/api/auth/signup",
        json={
            "name": "Backend Test User",
            "email": email,
            "password": "password123",
        },
    )

    if signup_response.status_code == 409:

        login_response = client.post(
            "/api/auth/login",
            json={
                "email": email,
                "password": "password123",
            },
        )

        assert (
            login_response.status_code
            == 200
        )

        token = login_response.json()[
            "access_token"
        ]

    else:

        assert (
            signup_response.status_code
            == 201
        )

        token = signup_response.json()[
            "access_token"
        ]

    headers = {
        "Authorization": f"Bearer {token}"
    }

    session_response = client.post(
        "/api/sessions",
        headers=headers,
        json={
            "title": "Backend Test Session",
            "description": "Testing backend",
            "date": "2026-09-01",
            "time": "10:00 AM",
            "duration": "60 minutes",
            "audience": "University Students",
            "type": "Workshop",
            "visibility": "Public",
            "status": "Upcoming",
        },
    )

    assert (
        session_response.status_code
        == 201
    )

    data = session_response.json()

    assert data["title"] == (
        "Backend Test Session"
    )

    assert len(
        data["joinCode"]
    ) == 6