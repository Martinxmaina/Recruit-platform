import { DynamicStructuredTool } from "@langchain/core/tools";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

// Initialize Supabase admin client
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Get Supabase org UUID from Clerk org ID
async function getSupabaseOrgId(clerkOrgId: string): Promise<string> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("organizations")
    .select("id")
    .eq("clerk_org_id", clerkOrgId)
    .single();

  if (error || !data) {
    throw new Error(`Organization not found: ${error?.message || "No data"}`);
  }
  return data.id;
}

// Helper to get org ID from env
async function getOrgId(): Promise<string> {
  const clerkOrgId = process.env.CURRENT_ORG_ID;
  if (!clerkOrgId) {
    throw new Error("CURRENT_ORG_ID not set");
  }
  return getSupabaseOrgId(clerkOrgId);
}

// Tool: Search Candidates
export const searchCandidatesTool = new DynamicStructuredTool({
  name: "search_candidates",
  description:
    "Search for candidates in the database. Use this when the user wants to find, list, or filter candidates by name, skills, location, or other criteria.",
  schema: z.object({
    query: z.string().optional().describe("Search query (name, email, or keywords)"),
    location: z.string().optional().describe("Location filter (city, state, or country)"),
    current_company: z.string().optional().describe("Filter by current company"),
    current_title: z.string().optional().describe("Filter by current job title"),
    limit: z.number().optional().describe("Maximum number of results (default: 10)"),
  }),
  func: async ({ query, location, current_company, current_title, limit = 10 }) => {
    try {
      const supabase = getSupabaseAdmin();
      const orgId = await getOrgId();

      let q = supabase
        .from("candidates")
        .select("id, full_name, email, current_title, current_company, location, phone")
        .eq("organization_id", orgId)
        .limit(limit);

      if (query) {
        q = q.or(`full_name.ilike.%${query}%,email.ilike.%${query}%,current_title.ilike.%${query}%`);
      }
      if (location) {
        q = q.ilike("location", `%${location}%`);
      }
      if (current_company) {
        q = q.ilike("current_company", `%${current_company}%`);
      }
      if (current_title) {
        q = q.ilike("current_title", `%${current_title}%`);
      }

      const { data, error } = await q;
      if (error) return JSON.stringify({ error: error.message });

      return JSON.stringify({
        count: data?.length || 0,
        candidates: data || [],
      });
    } catch (err) {
      return JSON.stringify({ error: String(err) });
    }
  },
});

// Tool: Get Candidate Details
export const getCandidateTool = new DynamicStructuredTool({
  name: "get_candidate",
  description:
    "Get detailed information about a specific candidate by ID. Use when the user asks about a particular candidate.",
  schema: z.object({
    candidate_id: z.string().describe("The unique identifier of the candidate"),
  }),
  func: async ({ candidate_id }) => {
    try {
      const supabase = getSupabaseAdmin();
      const orgId = await getOrgId();

      const { data, error } = await supabase
        .from("candidates")
        .select(`
          *,
          notes(id, content, author_name, created_at)
        `)
        .eq("id", candidate_id)
        .eq("organization_id", orgId)
        .single();

      if (error) return JSON.stringify({ error: error.message });
      return JSON.stringify(data);
    } catch (err) {
      return JSON.stringify({ error: String(err) });
    }
  },
});

// Tool: Search Jobs
export const searchJobsTool = new DynamicStructuredTool({
  name: "search_jobs",
  description:
    "Search for jobs in the database. Use when the user wants to find, list, or filter jobs by title, status, or location.",
  schema: z.object({
    query: z.string().optional().describe("Search query (job title or keywords)"),
    status: z.enum(["draft", "active", "paused", "closed", "filled"]).optional().describe("Filter by job status"),
    location: z.string().optional().describe("Filter by location"),
    limit: z.number().optional().describe("Maximum number of results (default: 10)"),
  }),
  func: async ({ query, status, location, limit = 10 }) => {
    try {
      const supabase = getSupabaseAdmin();
      const orgId = await getOrgId();

      let q = supabase
        .from("jobs")
        .select("id, title, status, location, seniority, description_text")
        .eq("organization_id", orgId)
        .limit(limit);

      if (query) {
        q = q.or(`title.ilike.%${query}%,description_text.ilike.%${query}%`);
      }
      if (status) {
        q = q.eq("status", status);
      }
      if (location) {
        q = q.ilike("location", `%${location}%`);
      }

      const { data, error } = await q;
      if (error) return JSON.stringify({ error: error.message });

      return JSON.stringify({
        count: data?.length || 0,
        jobs: data || [],
      });
    } catch (err) {
      return JSON.stringify({ error: String(err) });
    }
  },
});

// Tool: Get Job Details
export const getJobTool = new DynamicStructuredTool({
  name: "get_job",
  description:
    "Get detailed information about a specific job including applicants.",
  schema: z.object({
    job_id: z.string().describe("The unique identifier of the job"),
  }),
  func: async ({ job_id }) => {
    try {
      const supabase = getSupabaseAdmin();
      const orgId = await getOrgId();

      const { data, error } = await supabase
        .from("jobs")
        .select(`
          *,
          clients(name),
          applications(id, stage, status, candidates(id, full_name, email)),
          notes(id, content, author_name, created_at)
        `)
        .eq("id", job_id)
        .eq("organization_id", orgId)
        .single();

      if (error) return JSON.stringify({ error: error.message });
      return JSON.stringify(data);
    } catch (err) {
      return JSON.stringify({ error: String(err) });
    }
  },
});

// Tool: Get Dashboard Stats
export const getDashboardStatsTool = new DynamicStructuredTool({
  name: "get_dashboard_stats",
  description:
    "Get summary statistics for the recruitment dashboard. Use when the user asks for metrics, summaries, or overviews.",
  schema: z.object({}),
  func: async () => {
    try {
      const supabase = getSupabaseAdmin();
      const orgId = await getOrgId();

      const [candidates, jobs, applications, interviews] = await Promise.all([
        supabase.from("candidates").select("id", { count: "exact" }).eq("organization_id", orgId),
        supabase.from("jobs").select("id, status", { count: "exact" }).eq("organization_id", orgId),
        supabase.from("applications").select("id, stage, status").eq("organization_id", orgId),
        supabase
          .from("interviews")
          .select("id, status")
          .eq("organization_id", orgId)
          .gte("scheduled_at", new Date().toISOString()),
      ]);

      const activeJobs = jobs.data?.filter((j) => j.status === "active").length || 0;
      const pendingApplications = applications.data?.filter((a) => a.status === "active").length || 0;

      return JSON.stringify({
        totalCandidates: candidates.count || 0,
        totalJobs: jobs.count || 0,
        activeJobs,
        pendingApplications,
        upcomingInterviews: interviews.data?.length || 0,
      });
    } catch (err) {
      return JSON.stringify({ error: String(err) });
    }
  },
});

// Tool: Get Upcoming Interviews
export const getUpcomingInterviewsTool = new DynamicStructuredTool({
  name: "get_upcoming_interviews",
  description:
    "Get list of upcoming interviews. Use when the user wants to see their interview schedule.",
  schema: z.object({
    days_ahead: z.number().optional().describe("Number of days to look ahead (default: 7)"),
    limit: z.number().optional().describe("Maximum number of results (default: 10)"),
  }),
  func: async ({ days_ahead = 7, limit = 10 }) => {
    try {
      const supabase = getSupabaseAdmin();
      const orgId = await getOrgId();

      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + days_ahead);

      const { data, error } = await supabase
        .from("interviews")
        .select(`
          id,
          scheduled_at,
          status,
          notes,
          applications (
            id,
            candidates (id, full_name, email),
            jobs (id, title)
          )
        `)
        .eq("organization_id", orgId)
        .gte("scheduled_at", new Date().toISOString())
        .lte("scheduled_at", futureDate.toISOString())
        .order("scheduled_at", { ascending: true })
        .limit(limit);

      if (error) return JSON.stringify({ error: error.message });
      return JSON.stringify({ interviews: data || [] });
    } catch (err) {
      return JSON.stringify({ error: String(err) });
    }
  },
});

// Tool: Add Note
export const addNoteTool = new DynamicStructuredTool({
  name: "add_note",
  description:
    "Add a note to an entity (candidate, job, client). Use when the user wants to record information or feedback.",
  schema: z.object({
    entity_type: z.enum(["candidate", "job", "client"]).describe("Type of entity"),
    entity_id: z.string().describe("The unique identifier of the entity"),
    content: z.string().describe("The note content"),
  }),
  func: async ({ entity_type, entity_id, content }) => {
    try {
      const supabase = getSupabaseAdmin();
      const orgId = await getOrgId();
      const userId = process.env.CURRENT_USER_ID || "unknown";
      const userName = process.env.CURRENT_USER_NAME || "AI Assistant";

      const { data, error } = await supabase
        .from("notes")
        .insert({
          entity_type,
          entity_id,
          content,
          author_id: userId,
          author_name: userName,
          organization_id: orgId,
        })
        .select()
        .single();

      if (error) return JSON.stringify({ error: error.message, success: false });
      return JSON.stringify({ success: true, note: data });
    } catch (err) {
      return JSON.stringify({ error: String(err), success: false });
    }
  },
});

// Tool: Search Applications
export const searchApplicationsTool = new DynamicStructuredTool({
  name: "search_applications",
  description:
    "Search for job applications. Use when the user wants to see candidates applied to jobs or track application status.",
  schema: z.object({
    job_id: z.string().optional().describe("Filter by job ID"),
    candidate_id: z.string().optional().describe("Filter by candidate ID"),
    stage: z.string().optional().describe("Filter by pipeline stage"),
    status: z.enum(["active", "rejected", "hired", "withdrawn"]).optional().describe("Filter by status"),
    limit: z.number().optional().describe("Maximum number of results (default: 10)"),
  }),
  func: async ({ job_id, candidate_id, stage, status, limit = 10 }) => {
    try {
      const supabase = getSupabaseAdmin();
      const orgId = await getOrgId();

      let q = supabase
        .from("applications")
        .select(`
          id,
          stage,
          status,
          applied_at,
          candidates (id, full_name, email, current_title),
          jobs (id, title)
        `)
        .eq("organization_id", orgId)
        .limit(limit);

      if (job_id) q = q.eq("job_id", job_id);
      if (candidate_id) q = q.eq("candidate_id", candidate_id);
      if (stage) q = q.eq("stage", stage);
      if (status) q = q.eq("status", status);

      const { data, error } = await q;
      if (error) return JSON.stringify({ error: error.message });

      return JSON.stringify({
        count: data?.length || 0,
        applications: data || [],
      });
    } catch (err) {
      return JSON.stringify({ error: String(err) });
    }
  },
});

// Tool: Update Application Stage
export const updateApplicationStageTool = new DynamicStructuredTool({
  name: "update_application_stage",
  description:
    "Move an application to a different pipeline stage. Use when the user wants to advance or change an applicant's status.",
  schema: z.object({
    application_id: z.string().describe("The application ID"),
    stage: z.string().describe("The new pipeline stage"),
    notes: z.string().optional().describe("Optional notes about the change"),
  }),
  func: async ({ application_id, stage, notes }) => {
    try {
      const supabase = getSupabaseAdmin();
      const orgId = await getOrgId();

      const { data, error } = await supabase
        .from("applications")
        .update({ stage, updated_at: new Date().toISOString() })
        .eq("id", application_id)
        .eq("organization_id", orgId)
        .select()
        .single();

      if (error) return JSON.stringify({ error: error.message, success: false });
      return JSON.stringify({ success: true, application: data });
    } catch (err) {
      return JSON.stringify({ error: String(err), success: false });
    }
  },
});

// Tool: Search Clients
export const searchClientsTool = new DynamicStructuredTool({
  name: "search_clients",
  description:
    "Search for clients. Use when the user wants to find or list clients.",
  schema: z.object({
    query: z.string().optional().describe("Search query (client name or contact)"),
    status: z.enum(["active", "inactive"]).optional().describe("Filter by status"),
    limit: z.number().optional().describe("Maximum number of results (default: 10)"),
  }),
  func: async ({ query, status, limit = 10 }) => {
    try {
      const supabase = getSupabaseAdmin();
      const orgId = await getOrgId();

      let q = supabase
        .from("clients")
        .select("id, name, contact_person, contact_email, status, industry")
        .eq("organization_id", orgId)
        .limit(limit);

      if (query) {
        q = q.or(`name.ilike.%${query}%,contact_person.ilike.%${query}%`);
      }
      if (status) {
        q = q.eq("status", status);
      }

      const { data, error } = await q;
      if (error) return JSON.stringify({ error: error.message });

      return JSON.stringify({
        count: data?.length || 0,
        clients: data || [],
      });
    } catch (err) {
      return JSON.stringify({ error: String(err) });
    }
  },
});

// Tool: Schedule Interview
export const scheduleInterviewTool = new DynamicStructuredTool({
  name: "schedule_interview",
  description:
    "Schedule an interview for an application. Use when the user wants to set up an interview with a candidate.",
  schema: z.object({
    application_id: z.string().describe("The application ID"),
    scheduled_at: z.string().describe("ISO datetime string for the interview time"),
    notes: z.string().optional().describe("Optional notes about the interview"),
  }),
  func: async ({ application_id, scheduled_at, notes }) => {
    try {
      const supabase = getSupabaseAdmin();
      const orgId = await getOrgId();

      const { data, error } = await supabase
        .from("interviews")
        .insert({
          application_id,
          scheduled_at,
          notes,
          status: "scheduled",
          organization_id: orgId,
        })
        .select()
        .single();

      if (error) return JSON.stringify({ error: error.message, success: false });
      return JSON.stringify({ success: true, interview: data });
    } catch (err) {
      return JSON.stringify({ error: String(err), success: false });
    }
  },
});

// Export all tools
export const copilotTools = [
  searchCandidatesTool,
  getCandidateTool,
  searchJobsTool,
  getJobTool,
  getDashboardStatsTool,
  getUpcomingInterviewsTool,
  addNoteTool,
  searchApplicationsTool,
  updateApplicationStageTool,
  searchClientsTool,
  scheduleInterviewTool,
];
