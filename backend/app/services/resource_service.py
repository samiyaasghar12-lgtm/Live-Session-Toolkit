from sqlalchemy import select
from sqlalchemy.orm import Session as DBSession

from app.models.resource import Resource
from app.schemas.resource import (
    ResourceCreate,
    ResourceUpdate,
)


def create_resource(
    db: DBSession,
    resource_data: ResourceCreate,
    user_id: int,
) -> Resource:

    new_resource = Resource(
        owner_id=user_id,
        name=resource_data.name,
        type=resource_data.type,
        url=resource_data.url,
        description=resource_data.description,
    )

    db.add(new_resource)
    db.commit()
    db.refresh(new_resource)

    return new_resource


def get_all_resources(
    db: DBSession,
    user_id: int,
) -> list[Resource]:

    statement = (
        select(Resource)
        .where(Resource.owner_id == user_id)
        .order_by(Resource.id.desc())
    )

    return list(
        db.scalars(statement).all()
    )


def get_resource_by_id(
    db: DBSession,
    resource_id: int,
    user_id: int,
) -> Resource | None:

    statement = (
        select(Resource)
        .where(
            Resource.id == resource_id,
            Resource.owner_id == user_id,
        )
    )

    return db.scalar(statement)


def update_resource(
    db: DBSession,
    resource: Resource,
    resource_data: ResourceUpdate,
) -> Resource:

    update_data = resource_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(resource, field, value)

    db.commit()
    db.refresh(resource)

    return resource


def delete_resource(
    db: DBSession,
    resource: Resource,
) -> None:

    db.delete(resource)
    db.commit()