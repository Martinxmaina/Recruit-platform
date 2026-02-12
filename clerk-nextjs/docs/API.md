# REST API v1 – cURL reference

Base URL: `http://localhost:3000` (or your deployment origin).

All endpoints require **Clerk authentication**. Send the session cookie you get after signing in:

- Sign in via the app in the browser.
- Open DevTools → Application (or Storage) → Cookies → copy the `__session` cookie value (or the full `Cookie` header).
- Use it in curl with: `-H "Cookie: __session=YOUR_SESSION_VALUE"`

Replace `BASE` and `COOKIE` in the examples:

```bash
BASE="http://localhost:3000"
COOKIE="__session=YOUR_SESSION_COOKIE_VALUE"
```

---

## Jobs

### List jobs

Optional query params: `status`, `work_type`, `country`, `client_id`, `search`.

```bash
curl -s -X GET "${BASE}/api/v1/jobs" \
  -H "Cookie: ${COOKIE}"
```

```bash
curl -s -X GET "${BASE}/api/v1/jobs?status=open&search=engineer" \
  -H "Cookie: ${COOKIE}"
```

### Create job

```bash
curl -s -X POST "${BASE}/api/v1/jobs" \
  -H "Cookie: ${COOKIE}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Engineer",
    "description": "Full description here",
    "status": "open",
    "work_type": "remote",
    "location": "New York",
    "country": "USA",
    "client_id": null,
    "ai_requirements_summary": null,
    "ai_working_hours": 40,
    "ai_job_language": "English",
    "ai_visa_sponsorship": false,
    "ai_keywords": ["React", "Node"],
    "ai_taxonomies_a": ["Engineering"],
    "ai_education_requirements": null
  }'
```

### Get job by ID

```bash
curl -s -X GET "${BASE}/api/v1/jobs/JOB_UUID" \
  -H "Cookie: ${COOKIE}"
```

### Update job

```bash
curl -s -X PATCH "${BASE}/api/v1/jobs/JOB_UUID" \
  -H "Cookie: ${COOKIE}" \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title", "status": "closed"}'
```

### Delete job

```bash
curl -s -X DELETE "${BASE}/api/v1/jobs/JOB_UUID" \
  -H "Cookie: ${COOKIE}"
```

---

## Candidates

**Step-by-step curl for adding candidates and verifying they appear in the database:** see [CURL-ADD-CANDIDATES.md](./CURL-ADD-CANDIDATES.md).

### List candidates

Optional query params: `search`, `source`.

```bash
curl -s -X GET "${BASE}/api/v1/candidates" \
  -H "Cookie: ${COOKIE}"
```

```bash
curl -s -X GET "${BASE}/api/v1/candidates?search=john&source=linkedin" \
  -H "Cookie: ${COOKIE}"
```

### Create candidate

```bash
curl -s -X POST "${BASE}/api/v1/candidates" \
  -H "Cookie: ${COOKIE}" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+1234567890",
    "linkedin_url": "https://linkedin.com/in/janedoe",
    "current_company": "Acme Inc",
    "current_title": "Engineer",
    "location": "San Francisco",
    "resume_url": null,
    "source": "linkedin"
  }'
```

### Get candidate by ID

```bash
curl -s -X GET "${BASE}/api/v1/candidates/CANDIDATE_UUID" \
  -H "Cookie: ${COOKIE}"
```

### Update candidate

```bash
curl -s -X PATCH "${BASE}/api/v1/candidates/CANDIDATE_UUID" \
  -H "Cookie: ${COOKIE}" \
  -H "Content-Type: application/json" \
  -d '{"full_name": "Jane Smith", "email": "jane.smith@example.com"}'
```

### Delete candidate

```bash
curl -s -X DELETE "${BASE}/api/v1/candidates/CANDIDATE_UUID" \
  -H "Cookie: ${COOKIE}"
```

---

## Applications

### List applications

Optional query params: `job_id`, `candidate_id`, `stage`, `status`.

```bash
curl -s -X GET "${BASE}/api/v1/applications" \
  -H "Cookie: ${COOKIE}"
```

```bash
curl -s -X GET "${BASE}/api/v1/applications?job_id=JOB_UUID&status=active" \
  -H "Cookie: ${COOKIE}"
```

### Create application

```bash
curl -s -X POST "${BASE}/api/v1/applications" \
  -H "Cookie: ${COOKIE}" \
  -H "Content-Type: application/json" \
  -d '{
    "candidate_id": "CANDIDATE_UUID",
    "job_id": "JOB_UUID",
    "stage": "new",
    "status": "active",
    "applied_at": "2025-02-12T10:00:00.000Z"
  }'
```

### Get application by ID

```bash
curl -s -X GET "${BASE}/api/v1/applications/APPLICATION_UUID" \
  -H "Cookie: ${COOKIE}"
```

### Update application

```bash
curl -s -X PATCH "${BASE}/api/v1/applications/APPLICATION_UUID" \
  -H "Cookie: ${COOKIE}" \
  -H "Content-Type: application/json" \
  -d '{"stage": "interview_1", "status": "active", "screening_score": 85}'
```

### Delete application

```bash
curl -s -X DELETE "${BASE}/api/v1/applications/APPLICATION_UUID" \
  -H "Cookie: ${COOKIE}"
```

---

## Interviews

### List interviews

Optional query params: `job_id`, `candidate_id`, `status`, `upcoming` (true/false).

```bash
curl -s -X GET "${BASE}/api/v1/interviews" \
  -H "Cookie: ${COOKIE}"
```

```bash
curl -s -X GET "${BASE}/api/v1/interviews?upcoming=true" \
  -H "Cookie: ${COOKIE}"
```

### Create interview

```bash
curl -s -X POST "${BASE}/api/v1/interviews" \
  -H "Cookie: ${COOKIE}" \
  -H "Content-Type: application/json" \
  -d '{
    "application_id": "APPLICATION_UUID",
    "scheduled_at": "2025-02-20T14:00:00.000Z",
    "status": "scheduled",
    "notes": "Technical round"
  }'
```

### Get interview by ID

```bash
curl -s -X GET "${BASE}/api/v1/interviews/INTERVIEW_UUID" \
  -H "Cookie: ${COOKIE}"
```

### Update interview

```bash
curl -s -X PATCH "${BASE}/api/v1/interviews/INTERVIEW_UUID" \
  -H "Cookie: ${COOKIE}" \
  -H "Content-Type: application/json" \
  -d '{"scheduled_at": "2025-02-21T15:00:00.000Z", "status": "completed", "notes": "Done"}'
```

### Delete interview

```bash
curl -s -X DELETE "${BASE}/api/v1/interviews/INTERVIEW_UUID" \
  -H "Cookie: ${COOKIE}"
```

---

## Clients

### List clients

```bash
curl -s -X GET "${BASE}/api/v1/clients" \
  -H "Cookie: ${COOKIE}"
```

### Create client

```bash
curl -s -X POST "${BASE}/api/v1/clients" \
  -H "Cookie: ${COOKIE}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acme Corp",
    "industry": "Technology",
    "status": "active",
    "contact_person": "John Smith",
    "contact_email": "john@acme.com",
    "contact_phone": "+1234567890",
    "website": "https://acme.com",
    "address": "123 Main St"
  }'
```

### Get client by ID

```bash
curl -s -X GET "${BASE}/api/v1/clients/CLIENT_UUID" \
  -H "Cookie: ${COOKIE}"
```

### Update client

```bash
curl -s -X PATCH "${BASE}/api/v1/clients/CLIENT_UUID" \
  -H "Cookie: ${COOKIE}" \
  -H "Content-Type: application/json" \
  -d '{"name": "Acme Inc", "status": "active"}'
```

---

## Notes

### List notes for an entity

Required query params: `entity_type`, `entity_id`.  
`entity_type`: one of `candidate`, `job`, `client`, `application`.

```bash
curl -s -X GET "${BASE}/api/v1/notes?entity_type=candidate&entity_id=CANDIDATE_UUID" \
  -H "Cookie: ${COOKIE}"
```

### Create note

```bash
curl -s -X POST "${BASE}/api/v1/notes" \
  -H "Cookie: ${COOKIE}" \
  -H "Content-Type: application/json" \
  -d '{
    "entity_type": "candidate",
    "entity_id": "CANDIDATE_UUID",
    "content": "Strong technical background. Follow up next week."
  }'
```

### Delete note

```bash
curl -s -X DELETE "${BASE}/api/v1/notes/NOTE_UUID" \
  -H "Cookie: ${COOKIE}"
```

---

## Tracking (tracked candidates)

### List tracked candidates

```bash
curl -s -X GET "${BASE}/api/v1/tracking" \
  -H "Cookie: ${COOKIE}"
```

### Add candidate to tracking

```bash
curl -s -X POST "${BASE}/api/v1/tracking" \
  -H "Cookie: ${COOKIE}" \
  -H "Content-Type: application/json" \
  -d '{"candidate_id": "CANDIDATE_UUID"}'
```

### Update tracked candidate

```bash
curl -s -X PATCH "${BASE}/api/v1/tracking/TRACKED_UUID" \
  -H "Cookie: ${COOKIE}" \
  -H "Content-Type: application/json" \
  -d '{"linkedin_url": "https://linkedin.com/in/janedoe", "notes": "To contact in Q2"}'
```

### Remove from tracking

```bash
curl -s -X DELETE "${BASE}/api/v1/tracking/TRACKED_UUID" \
  -H "Cookie: ${COOKIE}"
```

---

## Pipeline stages

### List pipeline stages

```bash
curl -s -X GET "${BASE}/api/v1/pipeline-stages" \
  -H "Cookie: ${COOKIE}"
```

### Create pipeline stage

```bash
curl -s -X POST "${BASE}/api/v1/pipeline-stages" \
  -H "Cookie: ${COOKIE}" \
  -H "Content-Type: application/json" \
  -d '{"name": "Final Interview", "sort_order": 5}'
```

### Update pipeline stage

```bash
curl -s -X PATCH "${BASE}/api/v1/pipeline-stages/STAGE_UUID" \
  -H "Cookie: ${COOKIE}" \
  -H "Content-Type: application/json" \
  -d '{"name": "Final Round", "sort_order": 6}'
```

### Delete pipeline stage

```bash
curl -s -X DELETE "${BASE}/api/v1/pipeline-stages/STAGE_UUID" \
  -H "Cookie: ${COOKIE}"
```

---

## Notifications

### List notifications

Optional query param: `limit` (default 20).

```bash
curl -s -X GET "${BASE}/api/v1/notifications" \
  -H "Cookie: ${COOKIE}"
```

```bash
curl -s -X GET "${BASE}/api/v1/notifications?limit=50" \
  -H "Cookie: ${COOKIE}"
```

### Create notification

```bash
curl -s -X POST "${BASE}/api/v1/notifications" \
  -H "Cookie: ${COOKIE}" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "USER_CLERK_ID",
    "type": "application_update",
    "title": "New application",
    "message": "Jane Doe applied to Senior Engineer",
    "link": "/candidates/abc-123",
    "metadata": {"job_id": "JOB_UUID"}
  }'
```

### Mark notification as read

```bash
curl -s -X PATCH "${BASE}/api/v1/notifications/NOTIFICATION_UUID/read" \
  -H "Cookie: ${COOKIE}"
```

---

## HTTP status codes

| Code | Meaning |
|------|--------|
| 200 | Success (GET, PATCH, DELETE) |
| 201 | Created (POST) |
| 400 | Bad request (validation, duplicate, etc.) |
| 401 | Unauthorized (missing or invalid auth) |
| 404 | Not found (org, resource by id) |

Error responses are JSON: `{"error": "Message"}`.
