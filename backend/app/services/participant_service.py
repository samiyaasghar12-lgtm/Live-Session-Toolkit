from sqlalchemy import select
from sqlalchemy.orm import Session as DBSession

from app.models.participant import Participant
from app.models.session_model import Session


def generate_initials(name: str) -> str:
    parts = name.strip().split()

    if len(parts) >= 2:
        return (
            parts[0][0] + parts[-1][0]
        ).upper()

    return parts[0][:2].upper()


def join_session(
    db: DBSession,
    session: Session,
    name: str,
) -> Participant:

    participant = Participant(
        session_id=session.id,
        name=name.strip(),
        initials=generate_initials(name),
        status="Present",
        participation=0,
    )

    db.add(participant)

    session.participants += 1

    db.commit()
    db.refresh(participant)

    return participant


def get_session_participants(
    db: DBSession,
    session_id: int,
) -> list[Participant]:

    statement = (
        select(Participant)
        .where(
            Participant.session_id == session_id
        )
        .order_by(Participant.joined_at.asc())
    )

    return list(
        db.scalars(statement).all()
    )


def get_participant_by_id(
    db: DBSession,
    participant_id: int,
) -> Participant | None:

    return db.get(
        Participant,
        participant_id,
    )