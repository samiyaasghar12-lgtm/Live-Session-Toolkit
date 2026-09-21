from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy import select
from sqlalchemy.orm import Session as DBSession

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.participant import Participant
from app.models.session_model import Session
from app.models.user import User
from app.schemas.participant import (
    ParticipantCreate,
    ParticipantResponse,
)
from app.services.participant_service import (
    get_session_participants,
    join_session,
)


router = APIRouter(
    prefix="/participants",
    tags=["Participants"],
)


@router.post(
    "/join/{session_id}",
    response_model=ParticipantResponse,
    status_code=status.HTTP_201_CREATED,
)
def join_existing_session(
    session_id: int,
    participant_data: ParticipantCreate,
    db: DBSession = Depends(get_db),
):

    session = db.get(
        Session,
        session_id,
    )

    if session is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found.",
        )

    if session.status == "Completed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "This session has already "
                "been completed."
            ),
        )

    return join_session(
        db,
        session,
        participant_data.name,
    )


@router.get(
    "",
    response_model=list[ParticipantResponse],
)
def get_all_participants(
    db: DBSession = Depends(get_db),
    user: User = Depends(get_current_user),
):

    statement = (
        select(Participant)
        .join(
            Session,
            Participant.session_id
            == Session.id,
        )
        .where(
            Session.user_id
            == user.id
        )
        .order_by(
            Participant.joined_at.desc()
        )
    )

    return list(
        db.scalars(statement).all()
    )


@router.get(
    "/session/{session_id}",
    response_model=list[ParticipantResponse],
)
def get_participants(
    session_id: int,
    db: DBSession = Depends(get_db),
    user: User = Depends(get_current_user),
):

    session = (
        db.query(Session)
        .filter(
            Session.id == session_id,
            Session.user_id == user.id,
        )
        .first()
    )

    if session is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found.",
        )

    return get_session_participants(
        db,
        session_id,
    )