from app.core.config import settings


def generate_activity(
    topic: str,
    audience: str,
    activity_type: str,
) -> dict:

    normalized = (
        activity_type.strip()
        or "Multiple Choice"
    )

    if (
        settings.AI_PROVIDER.lower()
        == "mock"
    ):

        if normalized == "True / False":

            options = [
                "True",
                "False",
            ]

            correct = "True"

        elif normalized == "Open Ended":

            options = []

            correct = ""

        elif normalized == "Rating":

            options = [
                "1",
                "2",
                "3",
                "4",
                "5",
            ]

            correct = ""

        else:

            options = [
                "Option A",
                "Option B",
                "Option C",
                "Option D",
            ]

            correct = "Option A"

        return {
            "title": (
                f"What is an important "
                f"idea about {topic.strip()}?"
            ),
            "type": normalized,
            "status": "Draft",
            "options": options,
            "correct_answer": correct,
            "audience": audience,
            "responses_count": 0,
        }

    raise NotImplementedError(
        "The selected AI provider has "
        "not been configured yet."
    )


def ask_ai(
    message: str,
) -> dict:

    if (
        settings.AI_PROVIDER.lower()
        == "mock"
    ):

        text = message.strip()

        return {
            "response": (
                f"I can help with "
                f"'{text}'. For this "
                "development build, AI "
                "is running in mock mode. "
                "Use Generate Activities "
                "to create a database-backed "
                "activity, or configure a "
                "real AI provider in .env."
            )
        }

    raise NotImplementedError(
        "The selected AI provider has "
        "not been configured yet."
    )