from app.exceptions import ServiceValidationError


def validate_values(first_value: str, second_value: str) -> bool:
    """
    Placeholder for Teammate 2's validation service.

    Replace this implementation with the agreed validation
    service interface when it becomes available.
    """

    if not first_value.strip():
        raise ServiceValidationError(
            "first_value must not be empty."
        )

    if not second_value.strip():
        raise ServiceValidationError(
            "second_value must not be empty."
        )

    return True


def compare_values(first_value: str, second_value: str) -> bool:
    """
    Placeholder for Teammate 1's comparison service.

    Replace this implementation with the agreed comparison
    service interface when it becomes available.
    """

    return first_value == second_value