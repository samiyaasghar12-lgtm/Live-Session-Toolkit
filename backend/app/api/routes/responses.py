from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session as DBSession

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.participant import Participant
from app.models.session_model import Session
from app.models.user import User
from app.schemas.response import (
    ResponseCreate,
    ResponseResponse,
)
from app.services.response_service import (
    submit_response,
)


router = APIRouter(
    prefix="/responses",
    tags=["Responses"],
)


@router.post(
    "/{session_id}/{participant_id}",
    response_model=ResponseResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_response(
    session_id: int,
    participant_id: int,
    response_data: ResponseCreate,
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

    participant = db.get(
        Participant,
        participant_id,
    )

    if participant is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Participant not found.",
        )

    if participant.session_id != session_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Participant does not belong to this session.",
        )

    try:
        return submit_response(
            db,
            session,
            participant,
            response_data,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )


@router.get(
    "/session/{session_id}",
    response_model=list[ResponseResponse],
)
def get_session_responses(
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

    return session.responses