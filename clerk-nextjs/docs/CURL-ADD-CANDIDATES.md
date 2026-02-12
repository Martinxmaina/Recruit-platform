# Add candidates via cURL and verify in the database

Use these curl commands to create candidates through the API. They are written so that **successful responses mean the candidate was inserted into the database** for your organization.

---

## 1. Get your session cookie

You must be signed in to the app (Clerk). Then:

1. Open the app in the browser (e.g. `http://localhost:3000`) and sign in.
2. Open DevTools → **Application** (Chrome) or **Storage** (Firefox) → **Cookies** → your origin.
3. Find the cookie named **`__session`** and copy its **Value**.

Set it in your terminal (replace with your real value):

```bash
export COOKIE="__session=paste_your_session_value_here"
export BASE="http://localhost:3000"
```

If your app runs on another port or domain, change `BASE` (e.g. `https://yourapp.vercel.app`).

---

## 2. Add a candidate (minimal – only required field)

Only **`full_name`** is required. The rest are optional.

```bash
curl -s -X POST "${BASE}/api/v1/candidates" \
  -H "Cookie: ${COOKIE}" \
  -H "Content-Type: application/json" \
  -d '{"full_name": "Jane Doe"}'
```

**Success:** HTTP 201 and a JSON object with the new candidate (including `id`, `full_name`, `organization_id`, `created_at`, etc.). That record is in the `candidates` table.

**Typical failure:** 401 = not authenticated (wrong/expired cookie). Fix by re-copying `__session` after signing in again.

---

## 3. Add a candidate (full example)

All fields the API accepts. Optional fields can be omitted or set to `null`.

```bash
curl -s -X POST "${BASE}/api/v1/candidates" \
  -H "Cookie: ${COOKIE}" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Alex Rivera",
    "email": "alex.rivera@example.com",
    "phone": "+1 555 234 8901",
    "linkedin_url": "https://linkedin.com/in/alexrivera",
    "current_company": "TechCorp Inc",
    "current_title": "Senior Software Engineer",
    "location": "San Francisco, CA",
    "resume_url": "https://example.com/resumes/alex.pdf",
    "source": "linkedin"
  }'
```

Again: **201 + JSON body** = candidate was inserted into the database.

---

## 4. Verify in the database (via API)

### List all candidates (should include the one you added)

```bash
curl -s -X GET "${BASE}/api/v1/candidates" \
  -H "Cookie: ${COOKIE}"
```

You get a JSON array of candidates for your org. Check that the new name appears (e.g. `"full_name": "Jane Doe"` or `"Alex Rivera"`).

### Get the new candidate by ID

From the POST response, copy the `id` (UUID). Then:

```bash
# Replace CANDIDATE_UUID with the id from the POST response
curl -s -X GET "${BASE}/api/v1/candidates/CANDIDATE_UUID" \
  -H "Cookie: ${COOKIE}"
```

You should see the same candidate object. That data is read from the database.

### Optional: filter by search or source

```bash
# By name/email search
curl -s -X GET "${BASE}/api/v1/candidates?search=Alex" \
  -H "Cookie: ${COOKIE}"

# By source
curl -s -X GET "${BASE}/api/v1/candidates?source=linkedin" \
  -H "Cookie: ${COOKIE}"
```

---

## 5. One-shot: add then list (copy-paste block)

Set `COOKIE` and `BASE` first (see step 1), then run:

```bash
# Add candidate
RESP=$(curl -s -w "\n%{http_code}" -X POST "${BASE}/api/v1/candidates" \
  -H "Cookie: ${COOKIE}" \
  -H "Content-Type: application/json" \
  -d '{"full_name": "Test Candidate", "email": "test@example.com", "source": "api"}')
HTTP_CODE=$(echo "$RESP" | tail -n1)
BODY=$(echo "$RESP" | sed '$d')
echo "HTTP $HTTP_CODE"
echo "$BODY" | head -c 500

# If created (201), list all candidates to confirm they reflect in the DB
if [ "$HTTP_CODE" = "201" ]; then
  echo ""
  echo "--- Listing candidates (should include the one above) ---"
  curl -s -X GET "${BASE}/api/v1/candidates" -H "Cookie: ${COOKIE}" | head -c 1000
fi
```

If you see **HTTP 201** and then a list that includes `"full_name":"Test Candidate"`, the candidate was added and is stored in the database.

---

## 6. Field reference (POST body)

| Field          | Required | Type   | Example / notes                          |
|----------------|----------|--------|------------------------------------------|
| `full_name`    | Yes      | string | `"Jane Doe"`                             |
| `email`        | No       | string | `"jane@example.com"` or omit            |
| `phone`        | No       | string | `"+1234567890"`                          |
| `linkedin_url` | No       | string | Full LinkedIn profile URL                |
| `current_company` | No    | string | Employer name                            |
| `current_title`   | No    | string | Job title                                |
| `location`     | No       | string | City, region, or "Remote"                |
| `resume_url`   | No       | string | URL to resume/CV                         |
| `source`       | No       | string | e.g. `"linkedin"`, `"api"`, `"referral"`|

All optional fields are stored in the database when you send them; omitting them leaves those columns as `null`.

---

## Troubleshooting

| Response | Meaning |
|----------|--------|
| **401 Unauthorized** | Missing or invalid session. Sign in again and copy a fresh `__session` cookie. |
| **404 Organization not found** | Your Clerk org has no matching row in `organizations`. Ensure org sync (e.g. sign-in/sync) has run. |
| **400** with `"error": "full_name is required"` | Request body must be JSON and include `"full_name": "Some Name"`. |
| **201** + JSON object | Candidate was inserted. Use GET list or GET by `id` to confirm it reflects in the database. |
