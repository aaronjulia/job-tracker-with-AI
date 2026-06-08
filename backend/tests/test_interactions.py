import uuid


def _create_interaction(client, auth_headers, application_id, **overrides):
    payload = {"type": "note", "notes": "Phone screen scheduled"}
    payload.update(overrides)
    return client.post(
        f"/applications/{application_id}/interactions",
        headers=auth_headers,
        json=payload,
    )


def _list_interactions(client, auth_headers, application_id):
    return client.get(
        f"/applications/{application_id}/interactions", headers=auth_headers
    ).json()


def test_interactions_require_authentication(client):
    response = client.get(f"/applications/{uuid.uuid4()}/interactions")
    assert response.status_code == 401  # No token -> unauthorized


def test_get_interactions_empty(client, auth_headers, application_id):
    response = client.get(
        f"/applications/{application_id}/interactions", headers=auth_headers
    )
    assert response.status_code == 200
    assert response.json() == []


def test_create_interaction(client, auth_headers, application_id):
    response = _create_interaction(client, auth_headers, application_id)
    assert response.status_code == 201

    # The create endpoint returns a detail message, so verify via the list.
    listed = _list_interactions(client, auth_headers, application_id)
    assert len(listed) == 1
    assert listed[0]["type"] == "note"
    assert listed[0]["notes"] == "Phone screen scheduled"


def test_get_interaction(client, auth_headers, application_id):
    _create_interaction(client, auth_headers, application_id)
    interaction = _list_interactions(client, auth_headers, application_id)[0]

    response = client.get(
        f"/applications/{application_id}/interactions/{interaction['id']}",
        headers=auth_headers,
    )
    assert response.status_code == 200
    assert response.json()["id"] == interaction["id"]


def test_get_interaction_not_found(client, auth_headers, application_id):
    response = client.get(
        f"/applications/{application_id}/interactions/{uuid.uuid4()}",
        headers=auth_headers,
    )
    assert response.status_code == 404


def test_update_interaction(client, auth_headers, application_id):
    _create_interaction(client, auth_headers, application_id)
    interaction = _list_interactions(client, auth_headers, application_id)[0]

    response = client.put(
        f"/applications/{application_id}/interactions/{interaction['id']}",
        headers=auth_headers,
        json={"type": "email", "notes": "Sent follow-up"},
    )
    assert response.status_code == 200

    updated = client.get(
        f"/applications/{application_id}/interactions/{interaction['id']}",
        headers=auth_headers,
    ).json()
    assert updated["type"] == "email"
    assert updated["notes"] == "Sent follow-up"


def test_delete_interaction(client, auth_headers, application_id):
    _create_interaction(client, auth_headers, application_id)
    interaction = _list_interactions(client, auth_headers, application_id)[0]

    response = client.delete(
        f"/applications/{application_id}/interactions/{interaction['id']}",
        headers=auth_headers,
    )
    assert response.status_code == 200

    # It is gone afterwards.
    follow_up = client.get(
        f"/applications/{application_id}/interactions/{interaction['id']}",
        headers=auth_headers,
    )
    assert follow_up.status_code == 404
