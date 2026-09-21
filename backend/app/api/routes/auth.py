from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import (
    Token,
    UserCreate,
    UserLogin,
    UserRead,
    UserUpdate,
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


def serialize_user(user: User) -> dict:
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "notifications": user.notifications,
        "emailNotifications": user.email_notifications,
        "privacy": user.privacy,
    }


@router.post(
    "/signup",
    response_model=Token,
    status_code=status.HTTP_201_CREATED,
)
def signup(
    payload: UserCreate,
    db: Session = Depends(get_db),
):
    email = str(payload.email).lower()

    existing = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=409,
            detail="An account with this email already exists.",
        )

    user = User(
        name=payload.name.strip(),
        email=email,
        password_hash=hash_password(payload.password),
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(str(user.id))

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": serialize_user(user),
    }


@router.post(
    "/login",
    response_model=Token,
)
def login(
    payload: UserLogin,
    db: Session = Depends(get_db),
):
    email = str(payload.email).lower()

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if not user or not verify_password(
        payload.password,
        user.password_hash,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password.",
        )

    token = create_access_token(str(user.id))

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": serialize_user(user),
    }


# This endpoint is specifically for Swagger's OAuth2
# Authorize button.
@router.post(
    "/token",
)
def token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    email = form_data.username.lower()

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if not user or not verify_password(
        form_data.password,
        user.password_hash,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    access_token = create_access_token(str(user.id))

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.get(
    "/me",
    response_model=UserRead,
)
def current_user(
    user: User = Depends(get_current_user),
):
    return serialize_user(user)


@router.patch(
    "/me",
    response_model=UserRead,
)
def update_profile(
    payload: UserUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    data = payload.model_dump(
        exclude_unset=True
    )

    if "email" in data:
        new_email = str(data["email"]).lower()

        duplicate = (
            db.query(User)
            .filter(
                User.email == new_email,
                User.id != user.id,
            )
            .first()
        )

        if duplicate:
            raise HTTPException(
                status_code=409,
                detail="That email is already in use.",
            )

        user.email = new_email
        data.pop("email")

    if "emailNotifications" in data:
        user.email_notifications = data.pop(
            "emailNotifications"
        )

    if "name" in data:
        user.name = data["name"]

    if "role" in data:
        user.role = data["role"]

    if "notifications" in data:
        user.notifications = data["notifications"]

    if "privacy" in data:
        user.privacy = data["privacy"]

    db.commit()
    db.refresh(user)

    return serialize_user(user)