def test_signup_creates_user(client):
    response = client.post("/users", json={
        "email": "test@example.com",
        "name": "Test User",
        "password": "password123",
    })
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "id" in data
    assert "hashed_password" not in data   # password must never leak


def test_login_success(client):
    client.post("/users", json={
        "email": "test@example.com", "name": "Test User", "password": "password123",
    })
    response = client.post("/auth/login", data={        # note: data=, not json=
        "username": "test@example.com", "password": "password123",
    })
    assert response.status_code == 200
    assert "access_token" in response.json()


def test_login_wrong_password(client):
    client.post("/users", json={
        "email": "test@example.com", "name": "Test User", "password": "password123",
    })
    response = client.post("/auth/login", data={
        "username": "test@example.com", "password": "wrongpassword",
    })
    assert response.status_code == 401

def test_token_required_for_protected_route(client):
    response = client.get("/users/me")
    assert response.status_code == 401  # Unauthorized without token


def test_nonexistent_user_login(client):
    response = client.post("/auth/login", data={
        "username": "nonexistent@example.com", "password": "password123",
    })
    assert response.status_code == 401