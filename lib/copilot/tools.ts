import type { ToolDefinition, ToolName } from "./types";

// Tool definitions for the LangGraph agent
// Each tool describes what it does and what parameters it needs

export const tools: Record<ToolName, ToolDefinition> = {
  // === CANDIDATE TOOLS ===
  search_candidates: {
    name: "search_candidates",
    description:
      "Search for candidates in the organization. Use this when the user wants to find, list, or filter candidates by name, skills, location, or other criteria.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query (name, email, or keywords)",
        },
        skills: {
          type: "string",
          description: "Comma-separated list of required skills",
        },
        location: {
          type: "string",
          description: "Location filter (city, state, or country)",
        },
        current_company: {
          type: "string",
          description: "Filter by current company",
        },
        limit: {
          type: "number",
          description: "Maximum number of results to return (default: 10)",
        },
      },
    },
    required: [],
  },

  get_candidate: {
    name: "get_candidate",
    description:
      "Get detailed information about a specific candidate by ID. Use this when the user asks about a particular candidate's profile, experience, or applications.",
    parameters: {
      type: "object",
      properties: {
        candidate_id: {
          type: "string",
          description: "The unique identifier of the candidate",
        },
      },
    },
    required: ["candidate_id"],
  },

  create_candidate: {
    name: "create_candidate",
    description:
      "Create a new candidate record. Use this when the user wants to add a new candidate to the system.",
    parameters: {
      type: "object",
      properties: {
        full_name: {
          type: "string",
          description: "Full name of the candidate",
        },
        email: {
          type: "string",
          description: "Email address",
        },
        phone: {
          type: "string",
          description: "Phone number",
        },
        current_title: {
          type: "string",
          description: "Current job title",
        },
        current_company: {
          type: "string",
          description: "Current employer",
        },
        location: {
          type: "string",
          description: "Location (city, state/country)",
        },
        linkedin_url: {
          type: "string",
          description: "LinkedIn profile URL",
        },
        source: {
          type: "string",
          description: "Source of the candidate (e.g., LinkedIn, Referral)",
        },
      },
    },
    required: ["full_name"],
    permission: ["admin", "recruiter"],
  },

  update_candidate: {
    name: "update_candidate",
    description:
      "Update an existing candidate's information. Use this when the user wants to modify candidate details.",
    parameters: {
      type: "object",
      properties: {
        candidate_id: {
          type: "string",
          description: "The unique identifier of the candidate",
        },
        full_name: {
          type: "string",
          description: "Full name of the candidate",
        },
        email: {
          type: "string",
          description: "Email address",
        },
        phone: {
          type: "string",
          description: "Phone number",
        },
        current_title: {
          type: "string",
          description: "Current job title",
        },
        current_company: {
          type: "string",
          description: "Current employer",
        },
        location: {
          type: "string",
          description: "Location (city, state/country)",
        },
      },
    },
    required: ["candidate_id"],
    permission: ["admin", "recruiter"],
  },

  // === JOB TOOLS ===
  search_jobs: {
    name: "search_jobs",
    description:
      "Search for jobs in the organization. Use this when the user wants to find, list, or filter jobs by title, status, client, or other criteria.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query (job title or keywords)",
        },
        status: {
          type: "string",
          enum: ["draft", "active", "paused", "closed", "filled"],
          description: "Filter by job status",
        },
        client_id: {
          type: "string",
          description: "Filter by client ID",
        },
        location: {
          type: "string",
          description: "Filter by location",
        },
        limit: {
          type: "number",
          description: "Maximum number of results to return (default: 10)",
        },
      },
    },
    required: [],
  },

  get_job: {
    name: "get_job",
    description:
      "Get detailed information about a specific job by ID. Use this when the user asks about a particular job's details, requirements, or applicants.",
    parameters: {
      type: "object",
      properties: {
        job_id: {
          type: "string",
          description: "The unique identifier of the job",
        },
      },
    },
    required: ["job_id"],
  },

  create_job: {
    name: "create_job",
    description:
      "Create a new job posting. Use this when the user wants to add a new job to the system.",
    parameters: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "Job title",
        },
        description: {
          type: "string",
          description: "Full job description",
        },
        client_id: {
          type: "string",
          description: "Client ID for the job",
        },
        location: {
          type: "string",
          description: "Job location",
        },
        employment_type: {
          type: "string",
          description: "Type of employment (e.g., Full-time, Contract)",
        },
        seniority: {
          type: "string",
          description: "Seniority level (e.g., Senior, Mid-level)",
        },
      },
    },
    required: ["title"],
    permission: ["admin", "recruiter"],
  },

  update_job: {
    name: "update_job",
    description:
      "Update an existing job posting. Use this when the user wants to modify job details or status.",
    parameters: {
      type: "object",
      properties: {
        job_id: {
          type: "string",
          description: "The unique identifier of the job",
        },
        title: {
          type: "string",
          description: "Job title",
        },
        status: {
          type: "string",
          enum: ["draft", "active", "paused", "closed", "filled"],
          description: "Job status",
        },
        description: {
          type: "string",
          description: "Full job description",
        },
      },
    },
    required: ["job_id"],
    permission: ["admin", "recruiter"],
  },

  // === APPLICATION TOOLS ===
  search_applications: {
    name: "search_applications",
    description:
      "Search for applications. Use this when the user wants to see candidates applied to jobs or track application status.",
    parameters: {
      type: "object",
      properties: {
        job_id: {
          type: "string",
          description: "Filter by job ID",
        },
        candidate_id: {
          type: "string",
          description: "Filter by candidate ID",
        },
        stage: {
          type: "string",
          description: "Filter by pipeline stage",
        },
        status: {
          type: "string",
          enum: ["active", "rejected", "hired", "withdrawn"],
          description: "Filter by application status",
        },
        limit: {
          type: "number",
          description: "Maximum number of results to return (default: 10)",
        },
      },
    },
    required: [],
  },

  update_application_stage: {
    name: "update_application_stage",
    description:
      "Move an application to a different pipeline stage. Use this when the user wants to advance or change an applicant's status.",
    parameters: {
      type: "object",
      properties: {
        application_id: {
          type: "string",
          description: "The unique identifier of the application",
        },
        stage: {
          type: "string",
          description: "The new pipeline stage",
        },
        notes: {
          type: "string",
          description: "Optional notes about the stage change",
        },
      },
    },
    required: ["application_id", "stage"],
    permission: ["admin", "recruiter"],
  },

  // === INTERVIEW TOOLS ===
  schedule_interview: {
    name: "schedule_interview",
    description:
      "Schedule an interview for an application. Use this when the user wants to set up an interview with a candidate.",
    parameters: {
      type: "object",
      properties: {
        application_id: {
          type: "string",
          description: "The application ID to schedule interview for",
        },
        scheduled_at: {
          type: "string",
          description: "ISO datetime string for the interview time",
        },
        notes: {
          type: "string",
          description: "Optional notes about the interview",
        },
      },
    },
    required: ["application_id", "scheduled_at"],
    permission: ["admin", "recruiter"],
  },

  get_upcoming_interviews: {
    name: "get_upcoming_interviews",
    description:
      "Get list of upcoming interviews. Use this when the user wants to see their interview schedule.",
    parameters: {
      type: "object",
      properties: {
        days_ahead: {
          type: "number",
          description: "Number of days to look ahead (default: 7)",
        },
        limit: {
          type: "number",
          description: "Maximum number of results to return (default: 10)",
        },
      },
    },
    required: [],
  },

  // === CLIENT TOOLS ===
  search_clients: {
    name: "search_clients",
    description:
      "Search for clients in the organization. Use this when the user wants to find or list clients.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query (client name or contact)",
        },
        status: {
          type: "string",
          enum: ["active", "inactive"],
          description: "Filter by client status",
        },
        limit: {
          type: "number",
          description: "Maximum number of results to return (default: 10)",
        },
      },
    },
    required: [],
  },

  get_client: {
    name: "get_client",
    description:
      "Get detailed information about a specific client by ID.",
    parameters: {
      type: "object",
      properties: {
        client_id: {
          type: "string",
          description: "The unique identifier of the client",
        },
      },
    },
    required: ["client_id"],
  },

  // === NOTE TOOLS ===
  add_note: {
    name: "add_note",
    description:
      "Add a note to an entity (candidate, job, client). Use this when the user wants to record information or feedback.",
    parameters: {
      type: "object",
      properties: {
        entity_type: {
          type: "string",
          enum: ["candidate", "job", "client"],
          description: "Type of entity to add note to",
        },
        entity_id: {
          type: "string",
          description: "The unique identifier of the entity",
        },
        content: {
          type: "string",
          description: "The note content",
        },
      },
    },
    required: ["entity_type", "entity_id", "content"],
  },

  // === DASHBOARD TOOLS ===
  get_dashboard_stats: {
    name: "get_dashboard_stats",
    description:
      "Get summary statistics for the dashboard. Use this when the user asks for metrics, summaries, or overviews.",
    parameters: {
      type: "object",
      properties: {
        include_breakdown: {
          type: "boolean",
          description: "Include breakdown by status or stage",
        },
      },
    },
    required: [],
  },
};

// Tool name list for validation
export const toolNames = Object.keys(tools) as ToolName[];

// Get tool by name
export function getTool(name: string): ToolDefinition | undefined {
  return tools[name as ToolName];
}

// Check if user has permission to use a tool
export function hasPermission(
  tool: ToolDefinition,
  userRole: "admin" | "recruiter" | "client"
): boolean {
  if (!tool.permission) return true;
  return tool.permission.includes(userRole);
}
