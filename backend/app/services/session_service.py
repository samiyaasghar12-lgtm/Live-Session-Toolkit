import secrets
import string

from sqlalchemy import select
from sqlalchemy.orm import Session as DBSession

from app.models.session_model import Session
from app.schemas.session_schema import (
    SessionCreate,
    SessionUpdate,
)


def generate_join_code(
    length: int = 6,
) -> str:

    characters = (
        string.ascii_uppercase
        + string.digits
    )

    return "".join(
        secrets.choice(characters)
        for _ in range(length)
    )


def generate_unique_join_code(
    db: DBSession,
) -> str:

    while True:

        code = generate_join_code()

        existing = db.scalar(
            select(Session).where(
                Session.join_code == code
            )
        )

        if existing is None:
            return code


def serialize_session(
    session: Session,
) -> dict:

    return {
        "id": session.id,
        "title": session.title,
        "description": session.description,
        "date": session.date,
        "time": session.time,
        "duration": session.duration,
        "audience": session.audience,
        "type": session.type,
        "visibility": session.visibility,
        "status": session.status,
        "joinCode": session.join_code,
        "participants": session.participants,
        "engagement": session.engagement,
        "activities": [
            activity.id
            for activity in session.activities
        ],
        "responses": len(session.responses),
        "created_at": session.created_at,
        "updated_at": session.updated_at,
    }


def create_session(
    db: DBSession,
    session_data: SessionCreate,
    user_id: int,
) -> Session:

    new_session = Session(
        user_id=user_id,
        title=session_data.title.strip(),
        description=(
            session_data.description or ""
        ).strip(),
        date=session_data.date,
        time=session_data.time,
        duration=session_data.duration,
        audience=session_data.audience,
        type=session_data.type,
        visibility=session_data.visibility,
        status=session_data.status,
        join_code=generate_unique_join_code(
            db
        ),
        participants=0,
        engagement=0,
    )

    db.add(new_session)

    db.commit()

    db.refresh(new_session)

    return new_session


def get_all_sessions(
    db: DBSession,
    user_id: int,
) -> list[Session]:

    statement = (
        select(Session)
        .where(
            Session.user_id == user_id
        )
        .order_by(
            Session.created_at.desc()
        )
    )

    return list(
        db.scalars(statement).all()
    )


def get_session_by_id(
    db: DBSession,
    session_id: int,
    user_id: int,
) -> Session | None:

    statement = (
        select(Session)
        .where(
            Session.id == session_id,
            Session.user_id == user_id,
        )
    )

    return db.scalar(statement)


def get_public_session_by_code(
    db: DBSession,
    join_code: str,
) -> Session | None:

    statement = select(Session).where(
        Session.join_code
        == join_code.upper()
    )

    return db.scalar(statement)


def update_session(
    db: DBSession,
    session: Session,
    session_data: SessionUpdate,
) -> Session:

    update_data = (
        session_data.model_dump(
            exclude_unset=True
        )
    )

    for field, value in update_data.items():
        setattr(
            session,
            field,
            value,
        )

    db.commit()

    db.refresh(session)

    return session


def delete_session(
    db: DBSession,
    session: Session,
) -> None:

    db.delete(session)

    db.commit()


def attach_activity(
    db: DBSession,
    session: Session,
    activity,
) -> Session:

    if activity not in session.activities:
        session.activities.append(
            activity
        )

    db.commit()

    db.refresh(session)

    return session