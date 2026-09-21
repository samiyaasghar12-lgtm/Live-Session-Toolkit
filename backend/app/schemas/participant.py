from pydantic import BaseModel, ConfigDict, Field


class ParticipantBase(BaseModel):
    name: str = Field(
        ...,
        min_length=1,
        max_length=120,
    )


class ParticipantCreate(ParticipantBase):
    pass


class ParticipantResponse(ParticipantBase):
    id: int
    session_id: int
    initials: str
    status: str
    participation: int

    model_config = ConfigDict(
        from_attributes=True,
    )