from datetime import datetime, timezone

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    JSON,
    String,
    Table,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


session_activities = Table(
    "session_activities",
    Base.metadata,

    Column(
        "session_id",
        ForeignKey(
            "sessions.id",
            ondelete="CASCADE",
        ),
        primary_key=True,
    ),

    Column(
        "activity_id",
        ForeignKey(
            "activities.id",
            ondelete="CASCADE",
        ),
        primary_key=True,
    ),
)


class Activity(Base):
    __tablename__ = "activities"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
    )

    owner_id: Mapped[int] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        index=True,
        nullable=False,
    )

    title: Mapped[str] = mapped_column(
        String(1000),
        nullable=False,
    )

    type: Mapped[str] = mapped_column(
        String(80),
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="Draft",
        nullable=False,
    )

    options: Mapped[list] = mapped_column(
        JSON,
        default=list,
        nullable=False,
    )

    correct_answer: Mapped[str] = mapped_column(
        String(500),
        default="",
        nullable=False,
    )

    audience: Mapped[str] = mapped_column(
        String(120),
        default="",
        nullable=False,
    )

    responses_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    owner = relationship(
        "User",
        back_populates="activities",
    )

    sessions = relationship(
        "Session",
        secondary=session_activities,
        back_populates="activities",
    )

    responses = relationship(
        "Response",
        back_populates="activity",
        cascade="all, delete-orphan",
    )