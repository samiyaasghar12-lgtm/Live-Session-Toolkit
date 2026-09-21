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
from app.schemas.resource import (
    ResourceCreate,
    ResourceResponse,
    ResourceUpdate,
)
from app.services.resource_service import (
    create_resource,
    delete_resource,
    get_all_resources,
    get_resource_by_id,
    update_resource,
)


router = APIRouter(
    prefix="/resources",
    tags=["Resources"],
)


@router.post(
    "",
    response_model=ResourceResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_resource(
    resource_data: ResourceCreate,
    db: DBSession = Depends(get_db),
    user: User = Depends(get_current_user),
):

    return create_resource(
        db,
        resource_data,
        user.id,
    )


@router.get(
    "",
    response_model=list[ResourceResponse],
)
def get_resources(
    db: DBSession = Depends(get_db),
    user: User = Depends(get_current_user),
):

    return get_all_resources(
        db,
        user.id,
    )


@router.get(
    "/{resource_id}",
    response_model=ResourceResponse,
)
def get_single_resource(
    resource_id: int,
    db: DBSession = Depends(get_db),
    user: User = Depends(get_current_user),
):

    resource = get_resource_by_id(
        db,
        resource_id,
        user.id,
    )

    if resource is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource not found.",
        )

    return resource


@router.put(
    "/{resource_id}",
    response_model=ResourceResponse,
)
def update_existing_resource(
    resource_id: int,
    resource_data: ResourceUpdate,
    db: DBSession = Depends(get_db),
    user: User = Depends(get_current_user),
):

    resource = get_resource_by_id(
        db,
        resource_id,
        user.id,
    )

    if resource is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource not found.",
        )

    return update_resource(
        db,
        resource,
        resource_data,
    )


@router.delete(
    "/{resource_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_existing_resource(
    resource_id: int,
    db: DBSession = Depends(get_db),
    user: User = Depends(get_current_user),
):

    resource = get_resource_by_id(
        db,
        resource_id,
        user.id,
    )

    if resource is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource not found.",
        )

    delete_resource(
        db,
        resource,
    )

    return None