from pydantic import BaseModel, ConfigDict


class PublicActivityResponse(BaseModel):

    model_config = ConfigDict(
        from_attributes=True
    )

    id: int

    title: str

    type: str

    options: list[str]

    audience: str