from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.exceptions import (
    ServiceValidationError,
    ServiceUnavailableError,
)
from app.schemas import ComparisonRequest
from app.services import validate_values, compare_values


app = FastAPI(
    title="Comparison API",
    description="API for validating and comparing values.",
    version="1.0.0",
)


@app.exception_handler(RequestValidationError)
async def handle_request_validation_error(
    request: Request,
    exc: RequestValidationError,
):
    """Return a consistent response for malformed requests."""

    details = [
        {
            "field": ".".join(str(part) for part in error["loc"]),
            "message": error["msg"],
        }
        for error in exc.errors()
    ]

    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "error": "Invalid request.",
            "details": details,
        },
    )


@app.exception_handler(ServiceValidationError)
async def handle_service_validation_error(
    request: Request,
    exc: ServiceValidationError,
):
    """Return a clear error when input validation fails."""

    return JSONResponse(
        status_code=400,
        content={
            "success": False,
            "error": str(exc),
            "details": [],
        },
    )


@app.exception_handler(ServiceUnavailableError)
async def handle_service_unavailable(
    request: Request,
    exc: ServiceUnavailableError,
):
    """Return a consistent response when a service is unavailable."""

    return JSONResponse(
        status_code=503,
        content={
            "success": False,
            "error": "A required service is unavailable.",
            "details": [],
        },
    )


@app.get("/")
def health_check():
    """Confirm that the application is running."""

    return {
        "success": True,
        "message": "Comparison API is running.",
    }


@app.post("/compare")
def compare(request: ComparisonRequest):
    """
    Validate two values and compare them.

    This endpoint demonstrates the integration workflow.
    """

    # Step 1: Extract the request values.
    first_value = request.first_value
    second_value = request.second_value

    # Step 2: Call the validation service.
    validate_values(first_value, second_value)

    # Step 3: Call the comparison service.
    result = compare_values(first_value, second_value)

    # Step 4: Return a consistent success response.
    return {
        "success": True,
        "result": {
            "match": result,
        },
    }