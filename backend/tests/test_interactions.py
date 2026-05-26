def test_get_interactions(client):
    # First, create a user and log in to get a token
    client.post("/users", json={
        "email": "test@example.com",
        "name": "Test User",
        "password": "password123",
    })
    login_response = client.post("/auth/login", data={
        "username": "test@example.com", "password": "password123",
    })
    token = login_response.json()["access_token"]

    # Now, use the token to access the protected route
    response = client.get("/interactions", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200

def test_get_interaction(client):
    # First, create a user and log in to get a token
    client.post("/users", json={
        "email": "test@example.com",
        "name": "Test User",
        "password": "password123",
    })
    login_response = client.post("/auth/login", data={
        "username": "test@example.com", "password": "password123",
    })
    token = login_response.json()["access_token"]

    # Now, use the token to access the protected route
    response = client.get("/interactions", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200

def test_create_interaction(client):
    # First, create a user and log in to get a token
    client.post("/users", json={
        "email": "test@example.com",
        "name": "Test User",
        "password": "password123",
    })
    login_response = client.post("/auth/login", data={
        "username": "test@example.com", "password": "password123",
    })
    token = login_response.json()["access_token"]

    # Now, use the token to access the protected route
    response = client.get("/interactions", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200

def test_update_interaction(client):
    # First, create a user and log in to get a token
    client.post("/users", json={
        "email": "test@example.com",
        "name": "Test User",
        "password": "password123",
    })
    login_response = client.post("/auth/login", data={
        "username": "test@example.com", "password": "password123",
    })
    token = login_response.json()["access_token"]

    # Now, use the token to access the protected route
    response = client.get("/interactions", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200

def test_delete_interaction(client):
    # First, create a user and log in to get a token
    client.post("/users", json={
        "email": "test@example.com",
        "name": "Test User",
        "password": "password123",
    })
    login_response = client.post("/auth/login", data={
        "username": "test@example.com", "password": "password123",
    })
    token = login_response.json()["access_token"]

    # Now, use the token to access the protected route
    response = client.get("/interactions", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200

def test_interactions_require_authentication(client):
    response = client.get("/interactions")
    assert response.status_code == 401  # Unauthorized without token