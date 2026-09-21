from pydantic import BaseModel, ConfigDict, Field


class ResourceBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    type: str = Field(..., min_length=1, max_length=80)
    url: str = ""
    description: str = ""


class ResourceCreate(ResourceBase):
    pass


class ResourceUpdate(BaseModel):
    name: str | None = Field(
        default=None,
        min_length=1,
        max_length=255,
    )
    type: str | None = Field(
        default=None,
        min_length=1,
        max_length=80,
    )
    url: str | None = None
    description: str | None = None


class ResourceResponse(ResourceBase):
    id: int
    owner_id: int

    model_config = ConfigDict(
        from_attributes=True,
    )