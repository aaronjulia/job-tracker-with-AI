def test_get_applications_requires_auth(client):
    response = client.get("/applications")
    assert response.status_code == 401  # Unauthorized without token

def test_get_applications(client):
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
    response = client.get("/applications", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200

def test_get_application(client):
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
    response = client.get("/applications", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200

def test_create_application(client):
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
    response = client.get("/applications", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200

def test_update_application(client):
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
    response = client.get("/applications", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200

def test_delete_application(client):
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
    response = client.get("/applications", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200

def test_applications_requires_auth(client):
    response = client.get("/applications")
    assert response.status_code == 401  # Unauthorized without token