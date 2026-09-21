from datetime import datetime

from pydantic import (
    AliasChoices,
    BaseModel,
    ConfigDict,
    Field,
)


class SessionBase(BaseModel):
    title: str = Field(
        ...,
        min_length=1,
        max_length=200,
    )

    description: str | None = None

    date: str

    time: str

    duration: str | None = None

    audience: str | None = None

    type: str = "Workshop"

    visibility: str = "Private"


class SessionCreate(SessionBase):
    status: str = "Draft"


class SessionUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=200,
    )

    description: str | None = None

    date: str | None = None

    time: str | None = None

    duration: str | None = None

    audience: str | None = None

    type: str | None = None

    visibility: str | None = None

    status: str | None = None


class SessionResponse(BaseModel):

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
    )

    id: int

    title: str

    description: str | None = None

    date: str

    time: str

    duration: str | None = None

    audience: str | None = None

    type: str

    visibility: str

    status: str

    joinCode: str = Field(
        validation_alias=AliasChoices(
            "join_code",
            "joinCode",
        ),
        serialization_alias="joinCode",
    )

    participants: int

    engagement: int

    activities: list[int] = Field(
        default_factory=list
    )

    responses: int = 0

    created_at: datetime

    updated_at: datetime