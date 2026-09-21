from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
)


class ActivityBase(BaseModel):

    title: str = Field(
        ...,
        min_length=1,
        max_length=1000,
    )

    type: str = Field(
        ...,
        min_length=1,
        max_length=80,
    )

    status: str = Field(
        default="Draft",
        max_length=30,
    )

    options: list[str] = Field(
        default_factory=list
    )

    correct_answer: str = ""

    audience: str = ""

    responses_count: int = 0


class ActivityCreate(ActivityBase):
    pass


class ActivityUpdate(BaseModel):

    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=1000,
    )

    type: str | None = Field(
        default=None,
        min_length=1,
        max_length=80,
    )

    status: str | None = Field(
        default=None,
        max_length=30,
    )

    options: list[str] | None = None

    correct_answer: str | None = None

    audience: str | None = None


class ActivityResponse(BaseModel):

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
    )

    id: int

    owner_id: int

    title: str

    type: str

    status: str

    options: list[str]

    correctAnswer: str = Field(
        validation_alias="correct_answer",
        serialization_alias="correctAnswer",
    )

    audience: str

    responses: int = Field(
        validation_alias="responses_count",
        serialization_alias="responses",
    )