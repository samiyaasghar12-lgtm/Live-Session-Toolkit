from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.activity import session_activities


class Session(Base):
    __tablename__ = "sessions"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    date: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    time: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    duration: Mapped[str | None] = mapped_column(
        String(80),
        nullable=True,
    )

    audience: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="Workshop",
    )

    visibility: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="Private",
    )

    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="Draft",
    )

    join_code: Mapped[str] = mapped_column(
        String(20),
        unique=True,
        nullable=False,
        index=True,
    )

    participants: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    engagement: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    user = relationship(
        "User",
        back_populates="sessions",
    )

    activities = relationship(
        "Activity",
        secondary=session_activities,
        back_populates="sessions",
    )

    participant_records = relationship(
        "Participant",
        back_populates="session",
        cascade="all, delete-orphan",
    )

    responses = relationship(
        "Response",
        back_populates="session",
        cascade="all, delete-orphan",
    )