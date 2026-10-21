class ServiceValidationError(Exception):
    """Raised when the validation service rejects input."""


class ServiceUnavailableError(Exception):
    """Raised when a required service cannot be reached."""