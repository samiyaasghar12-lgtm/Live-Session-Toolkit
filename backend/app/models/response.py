from datetime import datetime, timezone

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    String,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Response(Base):
    __tablename__ = "responses"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
    )

    session_id: Mapped[int] = mapped_column(
        ForeignKey(
            "sessions.id",
            ondelete="CASCADE",
        ),
        index=True,
        nullable=False,
    )

    activity_id: Mapped[int] = mapped_column(
        ForeignKey(
            "activities.id",
            ondelete="CASCADE",
        ),
        index=True,
        nullable=False,
    )

    participant_id: Mapped[int] = mapped_column(
        ForeignKey(
            "participants.id",
            ondelete="CASCADE",
        ),
        index=True,
        nullable=False,
    )

    answer: Mapped[str] = mapped_column(
        String(2000),
        nullable=False,
    )

    is_correct: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    submitted_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    session = relationship(
        "Session",
        back_populates="responses",
    )

    activity = relationship(
        "Activity",
        back_populates="responses",
    )

    participant = relationship(
        "Participant",
        back_populates="responses",
    )