from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ResponseCreate(BaseModel):
    activity_id: int
    answer: str


class ResponseResponse(BaseModel):
    id: int
    session_id: int
    activity_id: int
    participant_id: int
    answer: str
    is_correct: bool
    submitted_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )