from datetime import datetime, timezone

from sqlalchemy import (
    DateTime,
    ForeignKey,
    Integer,
    String,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Participant(Base):
    __tablename__ = "participants"

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

    name: Mapped[str] = mapped_column(
        String(120),
        nullable=False,
    )

    initials: Mapped[str] = mapped_column(
        String(10),
        default="",
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="Present",
        nullable=False,
    )

    participation: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    joined_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    session = relationship(
    "Session",
    back_populates="participant_records",
)

    responses = relationship(
        "Response",
        back_populates="participant",
        cascade="all, delete-orphan",
    )