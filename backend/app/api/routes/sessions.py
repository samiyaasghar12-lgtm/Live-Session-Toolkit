from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session as DBSession

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.activity import Activity
from app.models.user import User
from app.schemas.session_schema import (
    SessionCreate,
    SessionResponse,
    SessionUpdate,
)
from app.services.session_service import (
    attach_activity,
    create_session,
    delete_session,
    get_all_sessions,
    get_public_session_by_code,
    get_session_by_id,
    serialize_session,
    update_session,
)


router = APIRouter(
    prefix="/sessions",
    tags=["Sessions"],
)


@router.post(
    "",
    response_model=SessionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_session(
    session_data: SessionCreate,
    db: DBSession = Depends(get_db),
    user: User = Depends(get_current_user),
):

    session = create_session(
        db,
        session_data,
        user.id,
    )

    return serialize_session(session)


@router.get(
    "",
    response_model=list[SessionResponse],
)
def get_sessions(
    db: DBSession = Depends(get_db),
    user: User = Depends(get_current_user),
):

    return [
        serialize_session(session)
        for session in get_all_sessions(
            db,
            user.id,
        )
    ]


@router.get(
    "/join/{join_code}",
    response_model=SessionResponse,
)
def get_session_for_join(
    join_code: str,
    db: DBSession = Depends(get_db),
):

    session = get_public_session_by_code(
        db,
        join_code.strip(),
    )

    if session is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid session code.",
        )

    if session.status == "Completed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "This session has already "
                "been completed."
            ),
        )

    return serialize_session(session)


@router.get(
    "/{session_id}",
    response_model=SessionResponse,
)
def get_single_session(
    session_id: int,
    db: DBSession = Depends(get_db),
    user: User = Depends(get_current_user),
):

    session = get_session_by_id(
        db,
        session_id,
        user.id,
    )

    if session is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found.",
        )

    return serialize_session(session)


@router.put(
    "/{session_id}",
    response_model=SessionResponse,
)
def update_existing_session(
    session_id: int,
    session_data: SessionUpdate,
    db: DBSession = Depends(get_db),
    user: User = Depends(get_current_user),
):

    session = get_session_by_id(
        db,
        session_id,
        user.id,
    )

    if session is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found.",
        )

    updated = update_session(
        db,
        session,
        session_data,
    )

    return serialize_session(updated)


@router.post(
    "/{session_id}/activities/{activity_id}",
    response_model=SessionResponse,
)
def add_activity_to_session(
    session_id: int,
    activity_id: int,
    db: DBSession = Depends(get_db),
    user: User = Depends(get_current_user),
):

    session = get_session_by_id(
        db,
        session_id,
        user.id,
    )

    if session is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found.",
        )

    activity = (
        db.query(Activity)
        .filter(
            Activity.id == activity_id,
            Activity.owner_id == user.id,
        )
        .first()
    )

    if activity is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Activity not found.",
        )

    updated = attach_activity(
        db,
        session,
        activity,
    )

    return serialize_session(updated)


@router.delete(
    "/{session_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_existing_session(
    session_id: int,
    db: DBSession = Depends(get_db),
    user: User = Depends(get_current_user),
):

    session = get_session_by_id(
        db,
        session_id,
        user.id,
    )

    if session is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found.",
        )

    delete_session(
        db,
        session,
    )

    return None