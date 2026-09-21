from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import (
    activities,
    ai,
    analytics,
    auth,
    participants,
    resources,
    sessions,
    responses,
    ws,
)

from app.core.config import settings
from app.db.base import Base
from app.db.session import engine


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,

    allow_origins=
        settings.FRONTEND_ORIGINS,

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


@app.on_event("startup")
def startup():

    Base.metadata.create_all(
        bind=engine
    )


@app.get(
    "/api/health",
    tags=["Health"],
)
def health():

    return {
        "status": "ok",
        "service": settings.APP_NAME,
    }


app.include_router(
    auth.router,
    prefix="/api",
)

app.include_router(
    sessions.router,
    prefix="/api",
)

app.include_router(
    activities.router,
    prefix="/api",
)

app.include_router(
    resources.router,
    prefix="/api",
)

app.include_router(
    participants.router,
    prefix="/api",
)

app.include_router(
    analytics.router,
    prefix="/api",
)

app.include_router(
    ai.router,
    prefix="/api",
)

app.include_router(
    responses.router,
    prefix="/api",
)

app.include_router(
    ws.router,
)