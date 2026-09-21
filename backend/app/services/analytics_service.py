from sqlalchemy import func, select
from sqlalchemy.orm import Session as DBSession

from app.models.participant import Participant
from app.models.response import Response
from app.models.session_model import Session


def get_session_analytics(
    db: DBSession,
    session: Session,
) -> dict:

    participant_count = (
        db.scalar(
            select(
                func.count(
                    Participant.id
                )
            ).where(
                Participant.session_id
                == session.id
            )
        )
        or 0
    )

    response_count = (
        db.scalar(
            select(
                func.count(
                    Response.id
                )
            ).where(
                Response.session_id
                == session.id
            )
        )
        or 0
    )

    correct_count = (
        db.scalar(
            select(
                func.count(
                    Response.id
                )
            ).where(
                Response.session_id
                == session.id,
                Response.is_correct.is_(True),
            )
        )
        or 0
    )

    unique_respondents = (
        db.scalar(
            select(
                func.count(
                    func.distinct(
                        Response.participant_id
                    )
                )
            ).where(
                Response.session_id
                == session.id
            )
        )
        or 0
    )

    accuracy = (
        round(
            (
                correct_count
                / response_count
            )
            * 100,
            2,
        )
        if response_count
        else 0
    )

    participation_rate = (
        round(
            (
                unique_respondents
                / participant_count
            )
            * 100,
            2,
        )
        if participant_count
        else 0
    )

    return {
        "session_id": session.id,
        "session_title": session.title,
        "participants": participant_count,
        "responses": response_count,
        "activities": len(
            session.activities
        ),
        "correct_responses": correct_count,
        "accuracy": accuracy,
        "participation_rate": participation_rate,
        "engagement": session.engagement,
    }


def get_overview_analytics(
    db: DBSession,
    user_id: int,
) -> dict:

    sessions = list(
        db.scalars(
            select(Session)
            .where(
                Session.user_id
                == user_id
            )
            .order_by(
                Session.created_at.desc()
            )
        ).all()
    )

    if not sessions:
        return {
            "sessions": 0,
            "participants": 0,
            "responses": 0,
            "avg_engagement": 0,
            "avg_participants": 0,
            "response_rate": 0,
            "sessions_data": [],
        }

    session_data = [
        get_session_analytics(
            db,
            session,
        )
        for session in sessions
    ]

    total_participants = sum(
        item["participants"]
        for item in session_data
    )

    total_responses = sum(
        item["responses"]
        for item in session_data
    )

    avg_engagement = round(
        sum(
            item["engagement"]
            for item in session_data
        )
        / len(session_data),
        2,
    )

    avg_participants = round(
        total_participants
        / len(session_data),
        2,
    )

    response_rate = round(
        sum(
            item["participation_rate"]
            for item in session_data
        )
        / len(session_data),
        2,
    )

    return {
        "sessions": len(sessions),
        "participants": total_participants,
        "responses": total_responses,
        "avg_engagement": avg_engagement,
        "avg_participants": avg_participants,
        "response_rate": response_rate,
        "sessions_data": session_data,
    }