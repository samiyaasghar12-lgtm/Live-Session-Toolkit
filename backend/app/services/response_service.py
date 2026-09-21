from sqlalchemy import func, select
from sqlalchemy.orm import Session as DBSession

from app.models.activity import Activity
from app.models.participant import Participant
from app.models.response import Response
from app.models.session_model import Session
from app.schemas.response import ResponseCreate


def submit_response(
    db: DBSession,
    session: Session,
    participant: Participant,
    response_data: ResponseCreate,
) -> Response:

    activity = db.get(
        Activity,
        response_data.activity_id,
    )

    if activity is None:
        raise ValueError(
            "Activity not found."
        )

    if activity not in session.activities:
        raise ValueError(
            "Activity does not belong "
            "to this session."
        )

    answer = response_data.answer.strip()

    is_correct = (
        answer.lower()
        == activity.correct_answer
        .strip()
        .lower()
    )

    response = Response(
        session_id=session.id,
        activity_id=activity.id,
        participant_id=participant.id,
        answer=answer,
        is_correct=is_correct,
    )

    db.add(response)

    activity.responses_count += 1

    db.flush()

    activity_count = max(
        len(session.activities),
        1,
    )

    participant_response_count = (
        db.scalar(
            select(
                func.count(
                    Response.id
                )
            ).where(
                Response.session_id
                == session.id,
                Response.participant_id
                == participant.id,
            )
        )
        or 0
    )

    participant.participation = min(
        100,
        round(
            (
                participant_response_count
                / activity_count
            )
            * 100
        ),
    )

    average_participation = (
        db.scalar(
            select(
                func.avg(
                    Participant.participation
                )
            ).where(
                Participant.session_id
                == session.id
            )
        )
    )

    session.engagement = round(
        float(
            average_participation or 0
        )
    )

    db.commit()

    db.refresh(response)

    return response