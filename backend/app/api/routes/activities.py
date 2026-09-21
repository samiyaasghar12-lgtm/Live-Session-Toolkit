from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session as DBSession

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.activity import (
    ActivityCreate,
    ActivityResponse,
    ActivityUpdate,
)
from app.schemas.public_activity import (
    PublicActivityResponse,
)
from app.services.activity_service import (
    create_activity,
    delete_activity,
    get_activity_by_id,
    get_all_activities,
    update_activity,
)


router = APIRouter(
    prefix="/activities",
    tags=["Activities"],
)


@router.get(
    "/public/session/{session_id}",
    response_model=list[
        PublicActivityResponse
    ],
)
def get_public_session_activities(
    session_id: int,
    db: DBSession = Depends(get_db),
):

    from app.models.session_model import Session

    session = db.get(
        Session,
        session_id,
    )

    if session is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found.",
        )

    return session.activities


@router.post(
    "",
    response_model=ActivityResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_activity(
    activity_data: ActivityCreate,
    db: DBSession = Depends(get_db),
    user: User = Depends(get_current_user),
):

    return create_activity(
        db,
        activity_data,
        user.id,
    )


@router.get(
    "",
    response_model=list[ActivityResponse],
)
def get_activities(
    db: DBSession = Depends(get_db),
    user: User = Depends(get_current_user),
):

    return get_all_activities(
        db,
        user.id,
    )


@router.get(
    "/{activity_id}",
    response_model=ActivityResponse,
)
def get_single_activity(
    activity_id: int,
    db: DBSession = Depends(get_db),
    user: User = Depends(get_current_user),
):

    activity = get_activity_by_id(
        db,
        activity_id,
        user.id,
    )

    if activity is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Activity not found.",
        )

    return activity


@router.put(
    "/{activity_id}",
    response_model=ActivityResponse,
)
def update_existing_activity(
    activity_id: int,
    activity_data: ActivityUpdate,
    db: DBSession = Depends(get_db),
    user: User = Depends(get_current_user),
):

    activity = get_activity_by_id(
        db,
        activity_id,
        user.id,
    )

    if activity is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Activity not found.",
        )

    return update_activity(
        db,
        activity,
        activity_data,
    )


@router.delete(
    "/{activity_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_existing_activity(
    activity_id: int,
    db: DBSession = Depends(get_db),
    user: User = Depends(get_current_user),
):

    activity = get_activity_by_id(
        db,
        activity_id,
        user.id,
    )

    if activity is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Activity not found.",
        )

    delete_activity(
        db,
        activity,
    )

    return None