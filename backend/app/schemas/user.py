from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserCreate(BaseModel):
    name: str = Field(
        min_length=1,
        max_length=120,
    )

    email: EmailStr

    password: str = Field(
        min_length=6,
        max_length=128,
    )


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    role: str | None = None
    notifications: bool | None = None
    emailNotifications: bool | None = None
    privacy: str | None = None


class UserRead(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
    )

    id: int
    name: str
    email: EmailStr
    role: str
    notifications: bool
    emailNotifications: bool
    privacy: str


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserRead