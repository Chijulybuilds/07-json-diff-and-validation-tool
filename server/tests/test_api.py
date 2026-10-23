from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health_check():
    response = client.get("/")

    assert response.status_code == 200
    assert response.json()["success"] is True


def test_matching_values():
    response = client.post(
        "/compare",
        json={
            "first_value": "ABC123",
            "second_value": "ABC123",
        },
    )

    assert response.status_code == 200
    assert response.json() == {
        "success": True,
        "result": {
            "match": True,
        },
    }


def test_different_values():
    response = client.post(
        "/compare",
        json={
            "first_value": "ABC123",
            "second_value": "XYZ789",
        },
    )

    assert response.status_code == 200
    assert response.json()["result"]["match"] is False


def test_missing_required_field():
    response = client.post(
        "/compare",
        json={
            "first_value": "ABC123",
        },
    )

    assert response.status_code == 422
    assert response.json()["success"] is False
    assert response.json()["error"] == "Invalid request."


def test_wrong_field_type():
    response = client.post(
        "/compare",
        json={
            "first_value": 123,
            "second_value": "ABC123",
        },
    )

    assert response.status_code == 422
    assert response.json()["success"] is False


def test_empty_value():
    response = client.post(
        "/compare",
        json={
            "first_value": "",
            "second_value": "ABC123",
        },
    )

    assert response.status_code == 400
    assert response.json()["success"] is False
    assert response.json()["error"] == (
        "first_value must not be empty."
    )