from sqlalchemy import select
from sqlalchemy.orm import Session as DBSession

from app.models.activity import Activity
from app.schemas.activity import (
    ActivityCreate,
    ActivityUpdate,
)


def create_activity(
    db: DBSession,
    activity_data: ActivityCreate,
    user_id: int,
) -> Activity:

    new_activity = Activity(
        owner_id=user_id,
        title=activity_data.title,
        type=activity_data.type,
        status=activity_data.status,
        options=activity_data.options,
        correct_answer=activity_data.correct_answer,
        audience=activity_data.audience,
        responses_count=activity_data.responses_count,
    )

    db.add(new_activity)
    db.commit()
    db.refresh(new_activity)

    return new_activity


def get_all_activities(
    db: DBSession,
    user_id: int,
) -> list[Activity]:

    statement = (
        select(Activity)
        .where(Activity.owner_id == user_id)
        .order_by(Activity.created_at.desc())
    )

    return list(
        db.scalars(statement).all()
    )


def get_activity_by_id(
    db: DBSession,
    activity_id: int,
    user_id: int,
) -> Activity | None:

    statement = (
        select(Activity)
        .where(
            Activity.id == activity_id,
            Activity.owner_id == user_id,
        )
    )

    return db.scalar(statement)


def update_activity(
    db: DBSession,
    activity: Activity,
    activity_data: ActivityUpdate,
) -> Activity:

    update_data = activity_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(activity, field, value)

    db.commit()
    db.refresh(activity)

    return activity


def delete_activity(
    db: DBSession,
    activity: Activity,
) -> None:

    db.delete(activity)
    db.commit()