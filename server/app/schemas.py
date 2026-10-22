from pydantic import BaseModel, ConfigDict


class ComparisonRequest(BaseModel):
    """Defines the information required for a comparison."""

    model_config = ConfigDict(extra="forbid")

    first_value: str
    second_value: str