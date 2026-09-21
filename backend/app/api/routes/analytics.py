from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session as DBSession

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.session_model import Session
from app.models.user import User
from app.services.analytics_service import (
    get_overview_analytics,
    get_session_analytics,
)


router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"],
)


@router.get(
    "/overview"
)
def analytics_overview(
    db: DBSession = Depends(get_db),
    user: User = Depends(get_current_user),
):

    return get_overview_analytics(
        db,
        user.id,
    )


@router.get(
    "/sessions/{session_id}"
)
def session_analytics(
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

    return get_session_analytics(
        db,
        session,
    )