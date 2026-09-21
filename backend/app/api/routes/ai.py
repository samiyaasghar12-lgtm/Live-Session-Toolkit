from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.ai import (
    AIAssistantRequest,
    AIAssistantResponse,
    ActivityGenerationRequest,
)
from app.services.ai_service import (
    ask_ai,
    generate_activity,
)


router = APIRouter(
    prefix="/ai",
    tags=["AI"],
)


@router.post(
    "/generate-activity",
)
def generate_ai_activity(
    request: ActivityGenerationRequest,
    user: User = Depends(get_current_user),
):

    return generate_activity(
        topic=request.topic,
        audience=request.audience,
        activity_type=request.activity_type,
    )


@router.post(
    "/assistant",
    response_model=AIAssistantResponse,
)
def ai_assistant(
    request: AIAssistantRequest,
    user: User = Depends(get_current_user),
):

    return ask_ai(
        request.message
    )