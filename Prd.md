1.1 Product Overview
A multi-tenant recruiting platform that enables recruiting agencies to manage their clients, job openings, candidates, and hiring pipelines. The platform integrates with n8n for automated data scraping, candidate enrichment, and workflow automation.
1.2 Key Features

Multi-tenant Architecture: Each organization operates independently with invite-only access
Role-based Access Control: Admin, Recruiter/Hiring Manager, and External Client roles
Automated Data Collection: Integration with n8n for scraping jobs, candidates, and career changes
Interview Pipeline: Customizable stages with automated screening
Client Portal: External clients can track their candidates and applications
Real-time Notifications: In-app notifications for key events
Webhook Integration: Bidirectional communication with n8n workflows

1.3 Target Users

Recruiting Agencies: Primary users managing multiple client companies
Recruiters/Hiring Managers: Internal staff managing recruitment processes
External Clients: Companies hiring through the recruiting agency
System Administrators: Organization owners with full access


2. System Architecture
2.1 High-Level Architecture
┌─────────────────────────────────────────────────────────────┐
│                      Next.js Frontend                        │
│                    (Shadcn UI + Tailwind)                    │
└─────────────────┬───────────────────────────┬───────────────┘
                  │                           │
                  ▼                           ▼
         ┌────────────────┐         ┌─────────────────┐
         │  Clerk Auth    │         │   Supabase      │
         │  - SSO         │         │   - PostgreSQL  │
         │  - MFA         │         │   - Real-time   │
         │  - Sessions    │         │   - Storage     │
         └────────────────┘         └────────┬────────┘
                                             │
                                             │
                  ┌──────────────────────────┴────────┐
                  │                                   │
                  ▼                                   ▼
         ┌─────────────────┐              ┌──────────────────┐
         │  Next.js API    │◄────────────►│      n8n         │
         │   Routes        │              │   - Webhooks     │
         │  - REST API     │              │   - Scrapers     │
         │  - Webhooks     │              │   - Automation   │
         └─────────────────┘              └──────────────────┘
2.2 Multi-tenancy Model

Database Level: Row-level security (RLS) using organization_id
Application Level: Clerk organizations for user management
Data Isolation: Complete separation of data between organizations

2.3 Authentication Flow

User receives email invitation with organization context
User signs up via Clerk with invite token
Clerk creates user and associates with organization
Supabase RLS policies enforce data access based on organization


3. User Roles & Permissions
3.1 Role Definitions
RoleDescriptionAccess LevelAdminOrganization owner/administratorFull system access within orgRecruiter/Hiring ManagerInternal recruitment staffAll features except user managementClientExternal client company representativeView-only access to their candidates and jobs
3.2 Permissions Matrix
FeatureAdminRecruiterClientOrganization ManagementInvite/Remove Users✅❌❌Edit Organization Profile✅❌❌View Company Settings✅❌❌User ManagementView All Users✅✅❌Assign Roles✅❌❌Deactivate Users✅❌❌Client ManagementCreate Clients✅✅❌Edit Clients✅✅❌View Clients✅✅✅ (own only)Delete Clients✅✅❌Job/Role ManagementCreate Jobs✅✅❌Edit Jobs✅✅❌View Jobs✅✅✅ (assigned only)Delete Jobs✅✅❌Trigger Scraping (Generate)✅✅❌Applicant/Candidate ManagementAdd Candidates✅✅❌Edit Candidates✅✅❌View Candidates✅✅✅ (assigned jobs only)Move Pipeline Stages✅✅❌Screen Candidates (Auto)✅✅❌Interview ManagementSchedule Interviews✅✅❌View Interviews✅✅✅ (assigned jobs only)Cancel/Reschedule✅✅❌Pipeline ManagementCustomize Stages✅✅❌View Pipeline✅✅✅ (assigned jobs only)NotificationsReceive Notifications✅✅✅Configure Notification Settings✅✅✅
1.1 Product Overview
A multi-tenant recruiting platform that enables recruiting agencies to manage their clients, job openings, candidates, and hiring pipelines. The platform integrates with n8n for automated data scraping, candidate enrichment, and workflow automation.
1.2 Key Features

Multi-tenant Architecture: Each organization operates independently with invite-only access
Role-based Access Control: Admin, Recruiter/Hiring Manager, and External Client roles
Automated Data Collection: Integration with n8n for scraping jobs, candidates, and career changes
Interview Pipeline: Customizable stages with automated screening
Client Portal: External clients can track their candidates and applications
Real-time Notifications: In-app notifications for key events
Webhook Integration: Bidirectional communication with n8n workflows

1.3 Target Users

Recruiting Agencies: Primary users managing multiple client companies
Recruiters/Hiring Managers: Internal staff managing recruitment processes
External Clients: Companies hiring through the recruiting agency
System Administrators: Organization owners with full access


2. System Architecture
2.1 High-Level Architecture
┌─────────────────────────────────────────────────────────────┐
│                      Next.js Frontend                        │
│                    (Shadcn UI + Tailwind)                    │
└─────────────────┬───────────────────────────┬───────────────┘
                  │                           │
                  ▼                           ▼
         ┌────────────────┐         ┌─────────────────┐
         │  Clerk Auth    │         │   Supabase      │
         │  - SSO         │         │   - PostgreSQL  │
         │  - MFA         │         │   - Real-time   │
         │  - Sessions    │         │   - Storage     │
         └────────────────┘         └────────┬────────┘
                                             │
                                             │
                  ┌──────────────────────────┴────────┐
                  │                                   │
                  ▼                                   ▼
         ┌─────────────────┐              ┌──────────────────┐
         │  Next.js API    │◄────────────►│      n8n         │
         │   Routes        │              │   - Webhooks     │
         │  - REST API     │              │   - Scrapers     │
         │  - Webhooks     │              │   - Automation   │
         └─────────────────┘              └──────────────────┘
2.2 Multi-tenancy Model

Database Level: Row-level security (RLS) using organization_id
Application Level: Clerk organizations for user management
Data Isolation: Complete separation of data between organizations

2.3 Authentication Flow

User receives email invitation with organization context
User signs up via Clerk with invite token
Clerk creates user and associates with organization
Supabase RLS policies enforce data access based on organization


3. User Roles & Permissions
3.1 Role Definitions
RoleDescriptionAccess LevelAdminOrganization owner/administratorFull system access within orgRecruiter/Hiring ManagerInternal recruitment staffAll features except user managementClientExternal client company representativeView-only access to their candidates and jobs
3.2 Permissions Matrix
FeatureAdminRecruiterClientOrganization ManagementInvite/Remove Users✅❌❌Edit Organization Profile✅❌❌View Company Settings✅❌❌User ManagementView All Users✅✅❌Assign Roles✅❌❌Deactivate Users✅❌❌Client ManagementCreate Clients✅✅❌Edit Clients✅✅❌View Clients✅✅✅ (own only)Delete Clients✅✅❌Job/Role ManagementCreate Jobs✅✅❌Edit Jobs✅✅❌View Jobs✅✅✅ (assigned only)Delete Jobs✅✅❌Trigger Scraping (Generate)✅✅❌Applicant/Candidate ManagementAdd Candidates✅✅❌Edit Candidates✅✅❌View Candidates✅✅✅ (assigned jobs only)Move Pipeline Stages✅✅❌Screen Candidates (Auto)✅✅❌Interview ManagementSchedule Interviews✅✅❌View Interviews✅✅✅ (assigned jobs only)Cancel/Reschedule✅✅❌Pipeline ManagementCustomize Stages✅✅❌View Pipeline✅✅✅ (assigned jobs only)NotificationsReceive Notifications✅✅✅Configure Notification Settings✅✅✅

--

## 5. Page Specifications

### 5.1 Home Page
**URL**: `/`

**Purpose**: Landing page for authenticated users

**Features**:
- Quick stats dashboard (total jobs, active candidates, pending interviews)
- Recent activity feed
- Quick actions (Add Job, Add Candidate, Schedule Interview)
- Upcoming interviews calendar widget

**Components**:
- `StatsCards` (total jobs, candidates, interviews)
- `ActivityFeed` (latest actions across the system)
- `QuickActions` (button group)
- `UpcomingInterviews` (calendar view)

---

### 5.2 Dashboard
**URL**: `/dashboard`

**Purpose**: Main analytics and overview page

**Sections**:

1. **Key Metrics** (Top row cards)
   - Open Jobs (with filter: Country, Remote/Onsite/Hybrid)
   - Total Candidates
   - Active Interviews
   - New Career Changes (from n8n scraping)

2. **Charts**
   - Applications over time (line chart)
   - Jobs by status (donut chart)
   - Candidates by pipeline stage (funnel chart)
   - Interview completion rate (bar chart)

3. **Recent Activities**
   - New applications
   - Interview scheduled
   - Status changes
   - New jobs posted

4. **Quick Filters**
   - Date range picker
   - Client filter
   - Job type filter (Remote/Onsite/Hybrid)
   - Country filter

**Generate Button**: 
- Location: Top right of each metric card
- Action: Triggers webhook to n8n with context:
  ```json
  {
    "origin": "dashboard",
    "action": "generate",
    "filters": {
      "work_type": "remote",
      "country": "USA"
    }
  }
  ```

---

### 5.3 Clients
**URL**: `/clients`

**Purpose**: List all external client companies

**Features**:
- **Table View** (Default)
  - Columns: Name, Industry, Active Jobs, Total Candidates, Contact, Status, Actions
  - Search bar (by name, industry)
  - Filter by status (Active, Inactive, Archived)
  - Sort by name, created date, active jobs

- **Card View** (Toggle option)
  - Client logo
  - Company name
  - Quick stats (jobs, candidates)
  - View Details button

- **Actions**
  - Add New Client (Admin/Recruiter only)
  - Edit (Admin/Recruiter only)
  - View Details
  - Archive (Admin/Recruiter only)

**Generate Button**:
- Location: Top right
- Action: Triggers n8n to scrape new potential clients or enrich existing ones
  ```json
  {
    "origin": "clients",
    "action": "generate",
    "client_ids": ["uuid-1", "uuid-2"]
  }
  ```

**Role-based View**:
- **Admin/Recruiter**: See all clients
- **Client**: See only their company profile

---

### 5.4 Client Details
**URL**: `/clients/[id]`

**Purpose**: Detailed view of a specific client

**Sections**:

1. **Header**
   - Client logo
   - Company name
   - Industry, website, contact info
   - Edit button (Admin/Recruiter only)

2. **Tabs**
   - **Overview**
     - Company information
     - Notes
     - Assigned recruiters
   
   - **Active Jobs** (Table)
     - Job title, location, type, applicants count, status
     - Add Job button (Admin/Recruiter only)
   
   - **All Candidates** (Table)
     - Name, email, current job, applied to, stage, status
     - View Details button
   
   - **Activity History**
     - Timeline of all interactions (jobs created, candidates added, interviews scheduled)

**Generate Button**:
- Location: In Jobs tab
- Action: Scrape job openings from client's career page
  ```json
  {
    "origin": "client_details",
    "action": "generate_jobs",
    "client_id": "uuid",
    "client_website": "https://example.com/careers"
  }
  ```

---

### 5.5 Roles (Jobs)
**URL**: `/jobs`

**Purpose**: Manage all job openings

**Features**:

1. **Filter Bar**
   - Search (by title, description)
   - Status (Open, Closed, On Hold, Filled)
   - Work Type (Remote, Onsite, Hybrid) - **Chips/Pills**
   - Country dropdown
   - Client dropdown
   - Date range

2. **Job Cards Grid**
   Each card shows:
   - Job title
   - Client name + logo
   - Location + work type badge
   - Status badge
   - Applicants count
   - Posted date
   - Generate button (bottom right)
   - View Details button

3. **List View** (Alternative)
   - Table with columns: Title, Client, Location, Type, Country, Applicants, Status, Posted Date, Actions

4. **Actions**
   - Add New Job (Admin/Recruiter only)
   - Edit (Admin/Recruiter only)
   - View Details
   - Close Job (Admin/Recruiter only)
   - Duplicate Job (Admin/Recruiter only)

**Generate Button** (Per Job Card):
- Action: Scrape candidates for this specific job
  ```json
  {
    "origin": "jobs",
    "action": "scrape_candidates",
    "job_id": "uuid",
    "job_title": "Senior React Developer",
    "keywords": ["React", "TypeScript", "Next.js"]
  }
  ```

**New Jobs Section** (Top of page):
- Carousel or horizontal scroll of newly scraped jobs from n8n
- Each card has "Import" button to add to system

---

### 5.6 Role Details
**URL**: `/jobs/[id]`

**Purpose**: Detailed view of a job opening

**Sections**:

1. **Header**
   - Job title
   - Client info
   - Location, work type, country badges
   - Status indicator
   - Edit/Close buttons (Admin/Recruiter only)

2. **Tabs**
   
   - **Job Description**
     - Full description
     - Requirements
     - Salary range
     - Employment type
     - External link (if scraped)
   
   - **Applicants** (Table)
     - Name, email, applied date, stage, screening score, status
     - Filter by stage
     - Filter by screening score (High/Medium/Low)
     - Add Candidate button (Admin/Recruiter only)
     - Generate button (to scrape more candidates)
   
   - **Interview Pipeline**
     - Kanban board view of candidates by stage
     - Drag & drop to move candidates (Admin/Recruiter only)
     - Custom stage names (per organization)
     - Default stages: New → Screening → Interview 1 → Interview 2 → Offer → Hired
   
   - **Applicant Screening**
     - Auto-screening results table
     - Columns: Candidate name, Score, Match Reasons, Red Flags
     - Sort by score
     - "Run Screening" button (triggers n8n AI screening)
   
   - **Interviews Scheduled**
     - Calendar view
     - Upcoming interviews list
     - Past interviews
     - Schedule New Interview button (Admin/Recruiter only)
   
   - **Activity**
     - Timeline of all activities for this job

**Generate Button**:
- Location: In Applicants tab header
- Action: Scrape more matching candidates
  ```json
  {
    "origin": "job_details",
    "action": "find_candidates",
    "job_id": "uuid",
    "min_experience": 5,
    "required_skills": ["React", "Node.js"]
  }
  ```

**Applicant Screening Panel**:
- Automated scoring (0-100) based on:
  - Skills match
  - Experience level
  - Education fit
  - Location compatibility
- Visual indicators (Green/Yellow/Red)
- Quick accept/reject actions (Admin/Recruiter only)

---

### 5.7 Applicants
**URL**: `/applicants`

**Purpose**: Manage all candidates across all jobs

**Features**:

1. **Filter Bar**
   - Search (by name, email, skills)
   - Job applied to
   - Pipeline stage
   - Screening score range
   - Status (New, Reviewing, Shortlisted, etc.)
   - Date added
   - Source (LinkedIn, Indeed, Referral, etc.)

2. **Table View** (Default)
   - Columns: Name, Email, Current Role, Applied To (job), Stage, Score, Status, Added Date, Actions
   - Batch actions (Move stage, Send email, Export)
   - Row click → opens details modal

3. **Card View** (Toggle)
   - Candidate photo/avatar
   - Name, current title
   - Top 3 skills
   - Applied jobs count
   - Screening score badge
   - View Details button

4. **Actions**
   - Add Candidate manually (Admin/Recruiter only)
   - Import from LinkedIn (Admin/Recruiter only)
   - Export to CSV
   - Bulk actions

**Generate Button**:
- Location: Top right
- Action: Scrape new candidates from job boards
  ```json
  {
    "origin": "applicants",
    "action": "scrape_new_candidates",
    "filters": {
      "skills": ["Python", "Machine Learning"],
      "location": "San Francisco",
      "experience_min": 3
    }
  }
  ```

**New Career Changes Section** (Banner at top):
- Shows candidates who recently changed jobs (scraped by n8n)
- "LinkedIn tracking detected John Doe moved from Google to Meta"
- Action buttons: "Add to Job", "Send Message", "Dismiss"

---

### 5.8 Applicant Details
**URL**: `/applicants/[id]`

**Purpose**: Complete candidate profile

**Layout**: 2-column layout

**Left Column** (Sticky):
1. **Profile Card**
   - Photo
   - Name, email, phone
   - LinkedIn, portfolio links
   - Current company & title
   - Location
   - Years of experience
   - Generate button (enrich profile via n8n)

2. **Quick Actions**
   - Add to Job
   - Schedule Interview
   - Send Email
   - Download Resume
   - Edit Profile (Admin/Recruiter only)

3. **Skills Tags**
   - Tag cloud of skills
   - Endorsement count (if from LinkedIn)

**Right Column** (Scrollable):

1. **Tabs**
   
   - **Overview**
     - Summary/Bio
     - Career highlights
     - Preferences (salary expectations, availability)
   
   - **Work History**
     - Timeline view
     - Company, title, duration, description
     - Enriched data from n8n (if available)
   
   - **Education**
     - Degree, institution, year
     - Certifications
   
   - **Applications** (Table)
     - Jobs applied to
     - Application date
     - Current stage
     - Status
     - View Job button
   
   - **Interviews**
     - Upcoming interviews
     - Past interviews with feedback
     - Schedule new interview button
   
   - **Activity & Notes**
     - Internal notes (Admin/Recruiter only)
     - Activity log (emails sent, profile viewed, status changes)
     - Add Note button

**Generate Button** (in Profile Card):
- Action: Enrich candidate data
  ```json
  {
    "origin": "applicant_details",
    "action": "enrich_profile",
    "applicant_id": "uuid",
    "linkedin_url": "https://linkedin.com/in/johndoe"
  }
  ```

---

### 5.9 Recruiters (Internal Users)
**URL**: `/recruiters`

**Purpose**: Manage internal users (Admin only for full access, Recruiters can view)

**Features**:

1. **User Table**
   - Columns: Name, Email, Role, Clients Assigned, Active Jobs, Status, Last Active, Actions
   - Search by name/email
   - Filter by role, status

2. **Actions** (Admin only)
   - Invite New User (opens invite modal)
   - Edit Role
   - Assign to Clients
   - Deactivate/Activate
   - Remove from Organization

3. **Invite Modal** (Admin only)
   - Email input
   - Role selection (Admin, Recruiter, Client)
   - Assign to clients (if role is Client or Recruiter)
   - Send Invite button

**Stats Cards** (Top):
- Total Recruiters
- Active Users
- Pending Invitations

---

### 5.10 Company Profile
**URL**: `/company`

**Purpose**: Organization settings and branding

**Sections** (Admin only can edit):

1. **Company Information**
   - Organization name
   - Logo upload
   - Domain
   - Industry
   - Website
   - Address

2. **Branding**
   - Primary color
   - Secondary color
   - Logo (light/dark mode)

3. **Pipeline Stages Configuration**
   - List of custom stages
   - Add/Edit/Delete stages
   - Reorder stages (drag & drop)
   - Set default stages
   - Color coding

4. **Notification Settings**
   - Toggle notifications by type
   - Email digests (daily/weekly)
   - Notification preferences

5. **Integrations**
   - n8n Webhook URL configuration
   - API Keys (display/regenerate)
   - Connected services status

6. **Billing & Usage** (Future)
   - Current plan
   - Usage stats
   - Payment method

---

## 6. API Endpoints

### 6.1 REST API Structure

**Base URL**: `/api/v1`

**Authentication**: All endpoints require Clerk JWT in `Authorization: Bearer <token>` header

**Standard Response Format**:
```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

### 6.2 Endpoint Specifications

#### **Organizations**

```
GET    /api/v1/organizations/:id
PUT    /api/v1/organizations/:id
GET    /api/v1/organizations/:id/members
POST   /api/v1/organizations/:id/members/invite
DELETE /api/v1/organizations/:id/members/:userId
```

**Example**:
```typescript
// GET /api/v1/organizations/123
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Acme Recruiting",
    "logo_url": "...",
    "settings": {
      "default_pipeline_stages": ["..."],
      "notification_preferences": {}
    }
  }
}

// POST /api/v1/organizations/123/members/invite
Request:
{
  "email": "john@example.com",
  "role": "recruiter",
  "client_ids": ["uuid1", "uuid2"] // optional
}

Response:
{
  "success": true,
  "data": {
    "invite_id": "uuid",
    "invite_link": "https://clerk.app/invite/...",
    "expires_at": "2024-03-01T00:00:00Z"
  }
}
```

---

#### **Clients**

```
GET    /api/v1/clients
POST   /api/v1/clients
GET    /api/v1/clients/:id
PUT    /api/v1/clients/:id
DELETE /api/v1/clients/:id
GET    /api/v1/clients/:id/jobs
GET    /api/v1/clients/:id/candidates
```

**Example**:
```typescript
// POST /api/v1/clients
Request:
{
  "name": "Tech Corp",
  "industry": "Technology",
  "website": "https://techcorp.com",
  "contact_person": "Jane Doe",
  "contact_email": "jane@techcorp.com",
  "contact_phone": "+1234567890",
  "address": "123 Main St, SF, CA",
  "notes": "Preferred vendor"
}

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Tech Corp",
    "status": "active",
    "created_at": "2024-02-11T10:00:00Z",
    ...
  }
}

// GET /api/v1/clients?status=active&search=tech
Response:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Tech Corp",
      "industry": "Technology",
      "active_jobs_count": 5,
      "total_candidates_count": 120,
      "status": "active"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 45
  }
}
```

---

#### **Jobs**

```
GET    /api/v1/jobs
POST   /api/v1/jobs
GET    /api/v1/jobs/:id
PUT    /api/v1/jobs/:id
DELETE /api/v1/jobs/:id
GET    /api/v1/jobs/:id/applicants
POST   /api/v1/jobs/:id/applicants
```

**Query Parameters** (GET /api/v1/jobs):
- `status`: open, closed, on-hold, filled
- `work_type`: onsite, remote, hybrid
- `country`: USA, UK, etc.
- `client_id`: filter by client
- `search`: search in title, description
- `page`, `limit`: pagination

**Example**:
```typescript
// POST /api/v1/jobs
Request:
{
  "client_id": "uuid",
  "title": "Senior Full Stack Developer",
  "description": "We are looking for...",
  "requirements": "5+ years experience...",
  "location": "San Francisco, CA",
  "work_type": "hybrid",
  "country": "USA",
  "employment_type": "full-time",
  "salary_range_min": 120000,
  "salary_range_max": 180000,
  "salary_currency": "USD",
  "status": "open",
  "posted_date": "2024-02-11"
}

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Senior Full Stack Developer",
    "client": {
      "id": "uuid",
      "name": "Tech Corp"
    },
    "status": "open",
    "applicants_count": 0,
    "created_at": "2024-02-11T10:00:00Z",
    ...
  }
}

// GET /api/v1/jobs/:id/applicants
Response:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "applicant": {
        "id": "uuid",
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@example.com",
        "current_title": "Software Engineer"
      },
      "applied_date": "2024-02-10T14:30:00Z",
      "pipeline_stage": {
        "id": "uuid",
        "name": "Screening"
      },
      "screening_score": 85.5,
      "status": "reviewing"
    }
  ]
}
```

---

#### **Applicants**

```
GET    /api/v1/applicants
POST   /api/v1/applicants
GET    /api/v1/applicants/:id
PUT    /api/v1/applicants/:id
DELETE /api/v1/applicants/:id
POST   /api/v1/applicants/:id/apply-to-job
GET    /api/v1/applicants/:id/applications
```

**Example**:
```typescript
// POST /api/v1/applicants
Request:
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "linkedin_url": "https://linkedin.com/in/johndoe",
  "resume_url": "https://storage.../resume.pdf",
  "current_company": "Google",
  "current_title": "Software Engineer",
  "years_of_experience": 7,
  "location": "San Francisco, CA",
  "skills": ["JavaScript", "React", "Node.js", "Python"],
  "source": "linkedin"
}

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "full_name": "John Doe",
    "email": "john@example.com",
    "created_at": "2024-02-11T10:00:00Z",
    ...
  }
}

// POST /api/v1/applicants/:id/apply-to-job
Request:
{
  "job_id": "uuid",
  "cover_letter": "I am very interested in..."
}

Response:
{
  "success": true,
  "data": {
    "job_application_id": "uuid",
    "status": "new",
    "applied_date": "2024-02-11T10:00:00Z"
  }
}
```

---

#### **Job Applications**

```
GET    /api/v1/job-applications/:id
PUT    /api/v1/job-applications/:id
PATCH  /api/v1/job-applications/:id/stage
PATCH  /api/v1/job-applications/:id/status
POST   /api/v1/job-applications/:id/screen
```

**Example**:
```typescript
// PATCH /api/v1/job-applications/:id/stage
Request:
{
  "pipeline_stage_id": "uuid" // new stage
}

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "pipeline_stage": {
      "id": "uuid",
      "name": "Interview 1",
      "stage_order": 3
    },
    "updated_at": "2024-02-11T11:00:00Z"
  }
}

// POST /api/v1/job-applications/:id/screen
// Triggers n8n automated screening
Request:
{
  "job_requirements": "5+ years React...",
  "candidate_profile": {...}
}

Response:
{
  "success": true,
  "data": {
    "screening_score": 88.5,
    "screening_notes": "Strong technical fit. Excellent React and TypeScript experience...",
    "is_screened": true,
    "screened_at": "2024-02-11T11:05:00Z"
  }
}
```

---

#### **Interviews**

```
GET    /api/v1/interviews
POST   /api/v1/interviews
GET    /api/v1/interviews/:id
PUT    /api/v1/interviews/:id
DELETE /api/v1/interviews/:id
PATCH  /api/v1/interviews/:id/status
```

**Example**:
```typescript
// POST /api/v1/interviews
Request:
{
  "job_application_id": "uuid",
  "interview_type": "video",
  "scheduled_at": "2024-02-15T14:00:00Z",
  "duration_minutes": 60,
  "location": "https://zoom.us/j/123456",
  "interviewer_ids": ["uuid1", "uuid2"],
  "notes": "Focus on system design"
}

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "job_application": {
      "id": "uuid",
      "applicant": {...},
      "job": {...}
    },
    "interview_type": "video",
    "scheduled_at": "2024-02-15T14:00:00Z",
    "status": "scheduled",
    "created_at": "2024-02-11T11:00:00Z"
  }
}

// This will also trigger n8n webhook to send calendar invite to client
```

---

#### **Pipeline Stages**

```
GET    /api/v1/pipeline-stages
POST   /api/v1/pipeline-stages
PUT    /api/v1/pipeline-stages/:id
DELETE /api/v1/pipeline-stages/:id
PATCH  /api/v1/pipeline-stages/reorder
```

**Example**:
```typescript
// GET /api/v1/pipeline-stages
Response:
{
  "success": true,
  "data": [
    {
      "id": "uuid1",
      "name": "New",
      "stage_order": 1,
      "color": "#3B82F6",
      "is_default": true
    },
    {
      "id": "uuid2",
      "name": "Screening",
      "stage_order": 2,
      "color": "#8B5CF6",
      "is_default": true
    },
    {
      "id": "uuid3",
      "name": "Interview 1",
      "stage_order": 3,
      "color": "#F59E0B",
      "is_default": true
    }
  ]
}

// PATCH /api/v1/pipeline-stages/reorder
Request:
{
  "stages": [
    {"id": "uuid1", "stage_order": 1},
    {"id": "uuid3", "stage_order": 2}, // swapped
    {"id": "uuid2", "stage_order": 3}
  ]
}
```

---

#### **Notifications**

```
GET    /api/v1/notifications
PATCH  /api/v1/notifications/:id/read
PATCH  /api/v1/notifications/mark-all-read
DELETE /api/v1/notifications/:id
```

**Example**:
```typescript
// GET /api/v1/notifications?is_read=false
Response:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "new_applicant",
      "title": "New Application Received",
      "message": "John Doe applied to Senior Full Stack Developer",
      "link": "/jobs/uuid/applicants/uuid",
      "is_read": false,
      "created_at": "2024-02-11T09:30:00Z"
    }
  ],
  "meta": {
    "unread_count": 12
  }
}
```

---

#### **Webhooks** (For n8n to call)

```
POST   /api/v1/webhooks/jobs-scraped
POST   /api/v1/webhooks/candidates-scraped
POST   /api/v1/webhooks/candidate-enriched
POST   /api/v1/webhooks/screening-complete
POST   /api/v1/webhooks/career-change-detected
```

**Example**:
```typescript
// POST /api/v1/webhooks/jobs-scraped
// Called by n8n after scraping job boards

Request:
{
  "webhook_id": "n8n-execution-id",
  "source": "linkedin",
  "jobs": [
    {
      "external_id": "linkedin-123",
      "title": "Senior React Developer",
      "company": "Tech Corp",
      "location": "San Francisco, CA",
      "work_type": "remote",
      "description": "...",
      "posted_date": "2024-02-10",
      "external_url": "https://linkedin.com/jobs/123"
    }
  ]
}

Response:
{
  "success": true,
  "data": {
    "jobs_created": 1,
    "jobs_updated": 0,
    "duplicates_skipped": 0
  }
}

// POST /api/v1/webhooks/candidate-enriched
// Called by n8n after enriching candidate profile

Request:
{
  "applicant_id": "uuid",
  "enrichment_data": {
    "linkedin_profile": {
      "headline": "Senior Software Engineer at Google",
      "skills": ["React", "Node.js", "AWS"],
      "endorsements_count": 45,
      "connections": 500
    },
    "github_profile": {
      "username": "johndoe",
      "public_repos": 25,
      "followers": 150
    }
  }
}

Response:
{
  "success": true,
  "data": {
    "applicant_id": "uuid",
    "enrichment_applied": true
  }
}
```

---
### 8.3 Notification Creation (Backend)

```typescript
// utils/notifications.ts

export async function createNotification({
  organization_id,
  user_id,
  type,
  title,
  message,
  link,
  metadata = {}
}: NotificationInput) {
  
  const notification = await supabase
    .from('notifications')
    .insert({
      organization_id,
      user_id,
      type,
      title,
      message,
      link,
      metadata
    })
    .single();
  
  // Trigger real-time update
  await supabase
    .channel(`notifications:${user_id}`)
    .send({
      type: 'broadcast',
      event: 'new_notification',
      payload: notification
    });
  
  return notification;
}

// Example usage:
await createNotification({
  organization_id: 'uuid',
  user_id: recruiter.id,
  type: 'new_applicant',
  title: 'New Application Received',
  message: `${applicant.name} applied to ${job.title}`,
  link: `/jobs/${job.id}/applicants/${applicant.id}`,
  metadata: {
    job_id: job.id,
    applicant_id: applicant.id
  }
});
```

---

## 9. Technical Stack

### 9.1 Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: Shadcn UI + Radix UI
- **Styling**: Tailwind CSS
- **State Management**: React Context + Zustand (for global state)
- **Forms**: React Hook Form + Zod validation
- **Data Fetching**: TanStack Query (React Query)
- **Real-time**: Supabase Realtime subscriptions
- **Charts**: Recharts or Tremor
- **Drag & Drop**: dnd-kit (for pipeline Kanban)
- **Date/Time**: date-fns
- **Tables**: TanStack Table

### 9.2 Backend
- **Runtime**: Next.js API Routes (Edge runtime where possible)
- **Database**: Supabase (PostgreSQL 15)
- **ORM**: Supabase JS Client
- **File Storage**: Supabase Storage (for resumes, logos)
- **Real-time**: Supabase Realtime
- **Authentication**: Clerk
- **API Security**: API key validation, rate limiting (Upstash)
- **Logging**: Axiom or Better Stack

### 9.3 Infrastructure
- **Hosting**: Vercel
- **Database**: Supabase Cloud
- **Background Jobs**: n8n (self-hosted or n8n Cloud)
- **CDN**: Vercel Edge Network
- **Email**: Resend or SendGrid (via n8n)
- **Monitoring**: Vercel Analytics + Sentry

### 9.4 Development Tools
- **Version Control**: Git + GitHub
- **Package Manager**: pnpm
- **Linting**: ESLint + Prettier
- **Type Checking**: TypeScript strict mode
- **Testing**: Vitest + Playwright (E2E)
- **CI/CD**: GitHub Actions → Vercel

---

## 10. Development Roadmap

**Goal**: Set up infrastructure and authentication

- [ ] Project setup (Next.js, TypeScript, Tailwind, Shadcn)
- [ ] Supabase project setup
- [ ] Database schema creation
- [ ] RLS policies implementation
- [ ] Clerk integration
- [ ] Basic layout (header, sidebar, navigation)
- [ ] Authentication flows (login, signup, invite)

**Deliverable**: User can sign up, create organization, invite members

---