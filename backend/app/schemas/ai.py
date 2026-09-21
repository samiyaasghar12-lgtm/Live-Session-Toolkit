from pydantic import BaseModel, Field


class ActivityGenerationRequest(BaseModel):
    topic: str = Field(
        ...,
        min_length=1,
        max_length=500,
    )

    audience: str = Field(
        default="University Students",
        max_length=200,
    )

    activity_type: str = Field(
        default="MCQ",
        max_length=80,
    )


class AIAssistantRequest(BaseModel):
    message: str = Field(
        ...,
        min_length=1,
        max_length=4000,
    )


class AIAssistantResponse(BaseModel):
    response: str