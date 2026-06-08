import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base, get_db
from app import models  # noqa: F401 - registers tables on Base.metadata
from main import app
from app.config import settings
from app.limiter import limiter

# Rate limiting would otherwise trip across the many requests a test run makes
# from a single client, so turn it off for the suite.
limiter.enabled = False

engine = create_engine(settings.TEST_DB_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture
def db_session():
    Base.metadata.create_all(bind=engine)  # fresh tables before the test
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)  # wipe them after the test


@pytest.fixture
def client(db_session):
    def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db  # endpoints now use the test DB
    yield TestClient(app)
    app.dependency_overrides.clear()


@pytest.fixture
def auth_headers(client):
    """Register a user, log in, and return Authorization headers carrying the token."""
    client.post(
        "/users",
        json={
            "email": "test@example.com",
            "name": "Test User",
            "password": "password123",
        },
    )
    login = client.post(
        "/auth/login",
        data={"username": "test@example.com", "password": "password123"},
    )
    token = login.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def application_id(client, auth_headers):
    """Create an application for the authenticated user and return its id."""
    response = client.post(
        "/applications",
        headers=auth_headers,
        json={"company": "Acme Corp", "role": "Software Engineer"},
    )
    return response.json()["id"]
