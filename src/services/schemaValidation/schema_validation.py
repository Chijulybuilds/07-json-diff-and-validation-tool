
from jsonschema import Draft202012Validator
from jsonschema.exceptions import SchemaError

value = {
    "name": "Theophilus",
    "age": "30",
    "city": "Port Harcourt",
    "skills": ["Python", "Django"],
    "is_employed": False
}
schema = {
    "name": "Theophilus",
    "age": 31,
    "city": "Lagos",
    "skills": ["Python", "Django", "Flask"],
    "is_employed": True
}

def validate_json(value, schema):
    """Validate a JSON value against a JSON Schema."""

    try:
        Draft202012Validator.check_schema(schema)

    except SchemaError as exc:
        return {
            "success": False,
            "valid": False,
            "errors": [
                {
                    "code": "INVALID_SCHEMA",
                    "path": "$",
                    "message": exc.message,
                }
            ],
        }

    validator = Draft202012Validator(schema)

    errors = []

    # Collect every validation error.
    for error in validator.iter_errors(value):
        path = "$"

        for part in error.absolute_path:
            if isinstance(part, int):
                path += f"[{part}]"
            else:
                path += f"[{part!r}]"

                errors.append({
                    "code": "VALIDATION_ERROR",
                    "path": path,
                    "message": error.message,
                })

                # Return only after all errors have been collected.
    return {
        "success": True,
        "valid": not errors,
        "errors": errors,
    }
print(validate_json(schema,value))    


