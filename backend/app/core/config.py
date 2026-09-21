import os

from dotenv import load_dotenv


load_dotenv()


class Settings:
    APP_NAME = "Live Session Toolkit API"

    DATABASE_URL = os.getenv(
        "DATABASE_URL",
        "sqlite:///./live_session_toolkit.db",
    )

    SECRET_KEY = os.getenv(
        "SECRET_KEY",
        "development-secret-change-me",
    )

    ACCESS_TOKEN_EXPIRE_MINUTES = int(
        os.getenv(
            "ACCESS_TOKEN_EXPIRE_MINUTES",
            "1440",
        )
    )

    AI_PROVIDER = os.getenv(
        "AI_PROVIDER",
        "mock",
    )

    AI_API_KEY = os.getenv(
        "AI_API_KEY",
        "",
    )

    FRONTEND_ORIGINS = [
        origin.strip()
        for origin in os.getenv(
            "FRONTEND_ORIGINS",
            "http://localhost:5173,http://127.0.0.1:5173",
        ).split(",")
        if origin.strip()
    ]


settings = Settings()