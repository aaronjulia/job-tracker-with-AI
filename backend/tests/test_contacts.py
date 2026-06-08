import uuid


def test_contacts_require_authentication(client):
    response = client.get(f"/applications/{uuid.uuid4()}/contacts")
    assert response.status_code == 401  # No token -> unauthorized


def test_get_contacts_empty(client, auth_headers, application_id):
    response = client.get(
        f"/applications/{application_id}/contacts", headers=auth_headers
    )
    assert response.status_code == 200
    assert response.json() == []


def test_create_contact(client, auth_headers, application_id):
    response = client.post(
        f"/applications/{application_id}/contacts",
        headers=auth_headers,
        json={"name": "Jane Doe", "email": "jane@example.com", "title": "Recruiter"},
    )
    assert response.status_code == 201
    body = response.json()
    assert body["name"] == "Jane Doe"
    assert body["email"] == "jane@example.com"
    assert body["title"] == "Recruiter"
    assert "id" in body

    # The new contact now appears in the application's list.
    listed = client.get(
        f"/applications/{application_id}/contacts", headers=auth_headers
    )
    assert listed.status_code == 200
    assert len(listed.json()) == 1


def test_get_contact(client, auth_headers, application_id):
    created = client.post(
        f"/applications/{application_id}/contacts",
        headers=auth_headers,
        json={"name": "Jane Doe"},
    ).json()

    response = client.get(
        f"/applications/{application_id}/contacts/{created['id']}",
        headers=auth_headers,
    )
    assert response.status_code == 200
    assert response.json()["id"] == created["id"]
    assert response.json()["name"] == "Jane Doe"


def test_get_contact_not_found(client, auth_headers, application_id):
    response = client.get(
        f"/applications/{application_id}/contacts/{uuid.uuid4()}",
        headers=auth_headers,
    )
    assert response.status_code == 404


def test_update_contact(client, auth_headers, application_id):
    created = client.post(
        f"/applications/{application_id}/contacts",
        headers=auth_headers,
        json={"name": "Jane Doe", "title": "Recruiter"},
    ).json()

    response = client.put(
        f"/applications/{application_id}/contacts/{created['id']}",
        headers=auth_headers,
        json={"title": "Hiring Manager"},
    )
    assert response.status_code == 200
    assert response.json()["title"] == "Hiring Manager"
    assert response.json()["name"] == "Jane Doe"  # untouched fields are preserved


def test_delete_contact(client, auth_headers, application_id):
    created = client.post(
        f"/applications/{application_id}/contacts",
        headers=auth_headers,
        json={"name": "Jane Doe"},
    ).json()

    response = client.delete(
        f"/applications/{application_id}/contacts/{created['id']}",
        headers=auth_headers,
    )
    assert response.status_code == 200

    # It is gone afterwards.
    follow_up = client.get(
        f"/applications/{application_id}/contacts/{created['id']}",
        headers=auth_headers,
    )
    assert follow_up.status_code == 404
