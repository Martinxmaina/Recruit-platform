export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          applied_at: string | null
          candidate_id: string
          created_at: string | null
          id: string
          job_id: string
          organization_id: string
          screening_score: number | null
          stage: string
          status: string
          updated_at: string | null
        }
        Insert: {
          applied_at?: string | null
          candidate_id: string
          created_at?: string | null
          id?: string
          job_id: string
          organization_id: string
          screening_score?: number | null
          stage?: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          applied_at?: string | null
          candidate_id?: string
          created_at?: string | null
          id?: string
          job_id?: string
          organization_id?: string
          screening_score?: number | null
          stage?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      candidates: {
        Row: {
          created_at: string | null
          current_company: string | null
          current_title: string | null
          email: string | null
          full_name: string
          id: string
          linkedin_url: string | null
          location: string | null
          organization_id: string
          phone: string | null
          resume_url: string | null
          source: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_company?: string | null
          current_title?: string | null
          email?: string | null
          full_name: string
          id?: string
          linkedin_url?: string | null
          location?: string | null
          organization_id: string
          phone?: string | null
          resume_url?: string | null
          source?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_company?: string | null
          current_title?: string | null
          email?: string | null
          full_name?: string
          id?: string
          linkedin_url?: string | null
          location?: string | null
          organization_id?: string
          phone?: string | null
          resume_url?: string | null
          source?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          contact_email: string | null
          contact_person: string | null
          contact_phone: string | null
          created_at: string | null
          id: string
          industry: string | null
          name: string
          organization_id: string
          status: string
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          industry?: string | null
          name: string
          organization_id: string
          status?: string
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          industry?: string | null
          name?: string
          organization_id?: string
          status?: string
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      interviews: {
        Row: {
          application_id: string
          created_at: string | null
          id: string
          notes: string | null
          organization_id: string
          scheduled_at: string
          status: string
          updated_at: string | null
        }
        Insert: {
          application_id: string
          created_at?: string | null
          id?: string
          notes?: string | null
          organization_id: string
          scheduled_at: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          application_id?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          organization_id?: string
          scheduled_at?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interviews_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interviews_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          ai_benefits: Json | null
          ai_core_responsibilities: string | null
          ai_education_requirements: string | null
          ai_experience_level: string | null
          ai_hiring_manager_email_address: string | null
          ai_hiring_manager_name: string | null
          ai_job_language: string | null
          ai_key_skills: Json | null
          ai_keywords: Json | null
          ai_remote_location: string | null
          ai_remote_location_derived: string | null
          ai_requirements_summary: string | null
          ai_salary_currency: string | null
          ai_salary_maxvalue: number | null
          ai_salary_minvalue: number | null
          ai_salary_unittext: string | null
          ai_salary_value: number | null
          ai_taxonomies_a: Json | null
          ai_visa_sponsorship: boolean | null
          ai_work_arrangement: string | null
          ai_work_arrangement_office_days: number | null
          ai_working_hours: number | null
          cities_derived: Json | null
          client_id: string | null
          countries_derived: Json | null
          country: string | null
          created_at: string | null
          date_posted: string | null
          date_validthrough: string | null
          description: string | null
          description_text: string | null
          employment_type: Json | null
          external_apply_url: string | null
          external_id: number | null
          id: string
          lats_derived: Json | null
          linkedin_id: number | null
          linkedin_org_description: string | null
          linkedin_org_employees: number | null
          linkedin_org_foundeddate: string | null
          linkedin_org_headquarters: string | null
          linkedin_org_industry: string | null
          linkedin_org_locations: Json | null
          linkedin_org_size: string | null
          linkedin_org_slogan: string | null
          linkedin_org_specialties: Json | null
          linkedin_org_type: string | null
          linkedin_org_url: string | null
          lngs_derived: Json | null
          location: string | null
          locations_derived: Json | null
          locations_raw: Json | null
          organization_id: string
          organization_logo: string | null
          organization_name: string | null
          organization_url: string | null
          posted_at: string | null
          recruiter_name: string | null
          recruiter_title: string | null
          recruiter_url: string | null
          regions_derived: Json | null
          remote_derived: boolean | null
          salary_raw: Json | null
          seniority: string | null
          source: string | null
          source_domain: string | null
          source_type: string | null
          status: string
          title: string
          updated_at: string | null
          url: string | null
          work_type: string | null
        }
        Insert: {
          ai_benefits?: Json | null
          ai_core_responsibilities?: string | null
          ai_education_requirements?: string | null
          ai_experience_level?: string | null
          ai_hiring_manager_email_address?: string | null
          ai_hiring_manager_name?: string | null
          ai_job_language?: string | null
          ai_key_skills?: Json | null
          ai_keywords?: Json | null
          ai_remote_location?: string | null
          ai_remote_location_derived?: string | null
          ai_requirements_summary?: string | null
          ai_salary_currency?: string | null
          ai_salary_maxvalue?: number | null
          ai_salary_minvalue?: number | null
          ai_salary_unittext?: string | null
          ai_salary_value?: number | null
          ai_taxonomies_a?: Json | null
          ai_visa_sponsorship?: boolean | null
          ai_work_arrangement?: string | null
          ai_work_arrangement_office_days?: number | null
          ai_working_hours?: number | null
          cities_derived?: Json | null
          client_id?: string | null
          countries_derived?: Json | null
          country?: string | null
          created_at?: string | null
          date_posted?: string | null
          date_validthrough?: string | null
          description?: string | null
          description_text?: string | null
          employment_type?: Json | null
          external_apply_url?: string | null
          external_id?: number | null
          id?: string
          lats_derived?: Json | null
          linkedin_id?: number | null
          linkedin_org_description?: string | null
          linkedin_org_employees?: number | null
          linkedin_org_foundeddate?: string | null
          linkedin_org_headquarters?: string | null
          linkedin_org_industry?: string | null
          linkedin_org_locations?: Json | null
          linkedin_org_size?: string | null
          linkedin_org_slogan?: string | null
          linkedin_org_specialties?: Json | null
          linkedin_org_type?: string | null
          linkedin_org_url?: string | null
          lngs_derived?: Json | null
          location?: string | null
          locations_derived?: Json | null
          locations_raw?: Json | null
          organization_id: string
          organization_logo?: string | null
          organization_name?: string | null
          organization_url?: string | null
          posted_at?: string | null
          recruiter_name?: string | null
          recruiter_title?: string | null
          recruiter_url?: string | null
          regions_derived?: Json | null
          remote_derived?: boolean | null
          salary_raw?: Json | null
          seniority?: string | null
          source?: string | null
          source_domain?: string | null
          source_type?: string | null
          status?: string
          title: string
          updated_at?: string | null
          url?: string | null
          work_type?: string | null
        }
        Update: {
          ai_benefits?: Json | null
          ai_core_responsibilities?: string | null
          ai_education_requirements?: string | null
          ai_experience_level?: string | null
          ai_hiring_manager_email_address?: string | null
          ai_hiring_manager_name?: string | null
          ai_job_language?: string | null
          ai_key_skills?: Json | null
          ai_keywords?: Json | null
          ai_remote_location?: string | null
          ai_remote_location_derived?: string | null
          ai_requirements_summary?: string | null
          ai_salary_currency?: string | null
          ai_salary_maxvalue?: number | null
          ai_salary_minvalue?: number | null
          ai_salary_unittext?: string | null
          ai_salary_value?: number | null
          ai_taxonomies_a?: Json | null
          ai_visa_sponsorship?: boolean | null
          ai_work_arrangement?: string | null
          ai_work_arrangement_office_days?: number | null
          ai_working_hours?: number | null
          cities_derived?: Json | null
          client_id?: string | null
          countries_derived?: Json | null
          country?: string | null
          created_at?: string | null
          date_posted?: string | null
          date_validthrough?: string | null
          description?: string | null
          description_text?: string | null
          employment_type?: Json | null
          external_apply_url?: string | null
          external_id?: number | null
          id?: string
          lats_derived?: Json | null
          linkedin_id?: number | null
          linkedin_org_description?: string | null
          linkedin_org_employees?: number | null
          linkedin_org_foundeddate?: string | null
          linkedin_org_headquarters?: string | null
          linkedin_org_industry?: string | null
          linkedin_org_locations?: Json | null
          linkedin_org_size?: string | null
          linkedin_org_slogan?: string | null
          linkedin_org_specialties?: Json | null
          linkedin_org_type?: string | null
          linkedin_org_url?: string | null
          lngs_derived?: Json | null
          location?: string | null
          locations_derived?: Json | null
          locations_raw?: Json | null
          organization_id?: string
          organization_logo?: string | null
          organization_name?: string | null
          organization_url?: string | null
          posted_at?: string | null
          recruiter_name?: string | null
          recruiter_title?: string | null
          recruiter_url?: string | null
          regions_derived?: Json | null
          remote_derived?: boolean | null
          salary_raw?: Json | null
          seniority?: string | null
          source?: string | null
          source_domain?: string | null
          source_type?: string | null
          status?: string
          title?: string
          updated_at?: string | null
          url?: string | null
          work_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          author_id: string
          author_name: string
          content: string
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          organization_id: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          author_name: string
          content: string
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          organization_id: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          author_name?: string
          content?: string
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          organization_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          link: string | null
          message: string | null
          metadata: Json | null
          organization_id: string
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          link?: string | null
          message?: string | null
          metadata?: Json | null
          organization_id: string
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          link?: string | null
          message?: string | null
          metadata?: Json | null
          organization_id?: string
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      org_members: {
        Row: {
          created_at: string | null
          google_calendar_token: Json | null
          id: string
          organization_id: string
          role: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          google_calendar_token?: Json | null
          id?: string
          organization_id: string
          role?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          google_calendar_token?: Json | null
          id?: string
          organization_id?: string
          role?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          clerk_org_id: string | null
          created_at: string | null
          id: string
          logo_url: string | null
          name: string
          settings: Json | null
          updated_at: string | null
        }
        Insert: {
          clerk_org_id?: string | null
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name: string
          settings?: Json | null
          updated_at?: string | null
        }
        Update: {
          clerk_org_id?: string | null
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          settings?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      pipeline_stages: {
        Row: {
          created_at: string | null
          id: string
          name: string
          organization_id: string
          sort_order: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          organization_id: string
          sort_order?: number
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          organization_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "pipeline_stages_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      tracked_candidates: {
        Row: {
          added_by_user_id: string
          candidate_id: string
          created_at: string
          id: string
          linkedin_url: string | null
          notes: string | null
          organization_id: string
          updated_at: string
        }
        Insert: {
          added_by_user_id: string
          candidate_id: string
          created_at?: string
          id?: string
          linkedin_url?: string | null
          notes?: string | null
          organization_id: string
          updated_at?: string
        }
        Update: {
          added_by_user_id?: string
          candidate_id?: string
          created_at?: string
          id?: string
          linkedin_url?: string | null
          notes?: string | null
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tracked_candidates_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tracked_candidates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_logs: {
        Row: {
          id: string
          organization_id: string
          entity_type: string
          entity_id: string
          candidate_id: string | null
          user_id: string
          user_name: string
          action_type: string
          action_details: Json
          old_values: Json | null
          new_values: Json | null
          duration_minutes: number | null
          created_at: string | null
          metadata: Json
        }
        Insert: {
          id?: string
          organization_id: string
          entity_type: string
          entity_id: string
          candidate_id?: string | null
          user_id: string
          user_name: string
          action_type: string
          action_details?: Json
          old_values?: Json | null
          new_values?: Json | null
          duration_minutes?: number | null
          created_at?: string | null
          metadata?: Json
        }
        Update: {
          id?: string
          organization_id?: string
          entity_type?: string
          entity_id?: string
          candidate_id?: string | null
          user_id?: string
          user_name?: string
          action_type?: string
          action_details?: Json
          old_values?: Json | null
          new_values?: Json | null
          duration_minutes?: number | null
          created_at?: string | null
          metadata?: Json
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_logs_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      set_user_context: { Args: { p_user_id: string }; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
