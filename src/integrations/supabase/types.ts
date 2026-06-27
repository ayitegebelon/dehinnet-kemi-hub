export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          achievement_type: string
          awarded_at: string | null
          icon: string | null
          id: string
          name_am: string
          name_en: string
          user_id: string
        }
        Insert: {
          achievement_type: string
          awarded_at?: string | null
          icon?: string | null
          id?: string
          name_am: string
          name_en: string
          user_id: string
        }
        Update: {
          achievement_type?: string
          awarded_at?: string | null
          icon?: string | null
          id?: string
          name_am?: string
          name_en?: string
          user_id?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          certificate_number: string
          completion_date: string
          course_id: string
          course_title: string
          id: string
          issued_at: string
          quiz_average: number | null
          student_name: string
          user_id: string
        }
        Insert: {
          certificate_number: string
          completion_date?: string
          course_id: string
          course_title: string
          id?: string
          issued_at?: string
          quiz_average?: number | null
          student_name: string
          user_id: string
        }
        Update: {
          certificate_number?: string
          completion_date?: string
          course_id?: string
          course_title?: string
          id?: string
          issued_at?: string
          quiz_average?: number | null
          student_name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      chemical_memory: {
        Row: {
          ai_summary: string | null
          analysis_result: string | null
          chemical_name: string
          created_at: string
          id: string
          risk_level: string | null
          safety_notes: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_summary?: string | null
          analysis_result?: string | null
          chemical_name: string
          created_at?: string
          id?: string
          risk_level?: string | null
          safety_notes?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_summary?: string | null
          analysis_result?: string | null
          chemical_name?: string
          created_at?: string
          id?: string
          risk_level?: string | null
          safety_notes?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          category: string
          created_at: string | null
          description_am: string | null
          description_en: string | null
          difficulty: string
          id: string
          image_url: string | null
          is_premium: boolean | null
          title_am: string
          title_en: string
          total_lessons: number | null
          updated_at: string | null
        }
        Insert: {
          category?: string
          created_at?: string | null
          description_am?: string | null
          description_en?: string | null
          difficulty?: string
          id?: string
          image_url?: string | null
          is_premium?: boolean | null
          title_am: string
          title_en: string
          total_lessons?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description_am?: string | null
          description_en?: string | null
          difficulty?: string
          id?: string
          image_url?: string | null
          is_premium?: boolean | null
          title_am?: string
          title_en?: string
          total_lessons?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      discussion_posts: {
        Row: {
          content: string
          course_id: string | null
          created_at: string | null
          id: string
          likes_count: number | null
          replies_count: number | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          course_id?: string | null
          created_at?: string | null
          id?: string
          likes_count?: number | null
          replies_count?: number | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          course_id?: string | null
          created_at?: string | null
          id?: string
          likes_count?: number | null
          replies_count?: number | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discussion_posts_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      discussion_replies: {
        Row: {
          content: string
          created_at: string | null
          id: string
          post_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          post_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          post_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discussion_replies_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "discussion_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      emergency_contacts: {
        Row: {
          created_at: string | null
          id: string
          is_primary: boolean | null
          name: string
          phone: string
          relationship: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          name: string
          phone: string
          relationship?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          name?: string
          phone?: string
          relationship?: string | null
          user_id?: string
        }
        Relationships: []
      }
      experiments: {
        Row: {
          created_at: string | null
          end_time: string | null
          id: string
          notes: string | null
          recipe_id: string | null
          safety_checklist_completed: boolean | null
          safety_incidents: Json | null
          start_time: string | null
          status: string | null
          success: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          end_time?: string | null
          id?: string
          notes?: string | null
          recipe_id?: string | null
          safety_checklist_completed?: boolean | null
          safety_incidents?: Json | null
          start_time?: string | null
          status?: string | null
          success?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          end_time?: string | null
          id?: string
          notes?: string | null
          recipe_id?: string | null
          safety_checklist_completed?: boolean | null
          safety_incidents?: Json | null
          start_time?: string | null
          status?: string | null
          success?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "experiments_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      flashcards: {
        Row: {
          back_am: string
          back_en: string
          category: string
          course_id: string | null
          created_at: string | null
          difficulty: string
          front_am: string
          front_en: string
          id: string
        }
        Insert: {
          back_am: string
          back_en: string
          category?: string
          course_id?: string | null
          created_at?: string | null
          difficulty?: string
          front_am: string
          front_en: string
          id?: string
        }
        Update: {
          back_am?: string
          back_en?: string
          category?: string
          course_id?: string | null
          created_at?: string | null
          difficulty?: string
          front_am?: string
          front_en?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "flashcards_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_notebook: {
        Row: {
          conclusion: string | null
          created_at: string
          experiment_date: string
          hypothesis: string | null
          id: string
          materials: string | null
          observations: string | null
          procedure: string | null
          safety_notes: string | null
          status: string
          title: string
          user_id: string
        }
        Insert: {
          conclusion?: string | null
          created_at?: string
          experiment_date?: string
          hypothesis?: string | null
          id?: string
          materials?: string | null
          observations?: string | null
          procedure?: string | null
          safety_notes?: string | null
          status?: string
          title: string
          user_id: string
        }
        Update: {
          conclusion?: string | null
          created_at?: string
          experiment_date?: string
          hypothesis?: string | null
          id?: string
          materials?: string | null
          observations?: string | null
          procedure?: string | null
          safety_notes?: string | null
          status?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      lessons: {
        Row: {
          content_am: string | null
          content_en: string | null
          course_id: string
          created_at: string | null
          duration_minutes: number | null
          id: string
          order_index: number | null
          title_am: string
          title_en: string
          video_url: string | null
        }
        Insert: {
          content_am?: string | null
          content_en?: string | null
          course_id: string
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          order_index?: number | null
          title_am: string
          title_en: string
          video_url?: string | null
        }
        Update: {
          content_am?: string | null
          content_en?: string | null
          course_id?: string
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          order_index?: number | null
          title_am?: string
          title_en?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          message_am: string
          message_en: string
          title_am: string
          title_en: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message_am: string
          message_en: string
          title_am: string
          title_en: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message_am?: string
          message_en?: string
          title_am?: string
          title_en?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          avatar_url: string | null
          created_at: string | null
          email: string
          father_name: string | null
          full_name: string
          id: string
          phone: string | null
          preferred_language: string | null
          safety_score: number | null
          skill_level: Database["public"]["Enums"]["skill_level"] | null
          subscription_expiry: string | null
          subscription_tier:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          created_at?: string | null
          email: string
          father_name?: string | null
          full_name: string
          id?: string
          phone?: string | null
          preferred_language?: string | null
          safety_score?: number | null
          skill_level?: Database["public"]["Enums"]["skill_level"] | null
          subscription_expiry?: string | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          father_name?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          preferred_language?: string | null
          safety_score?: number | null
          skill_level?: Database["public"]["Enums"]["skill_level"] | null
          subscription_expiry?: string | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      quiz_attempts: {
        Row: {
          completed_at: string
          copy_paste_count: number
          course_id: string
          flagged: boolean
          focus_lost_count: number
          id: string
          integrity_score: number
          lesson_id: string
          quiz_score: number
          rapid_answer_count: number
          student_name: string | null
          tab_switch_count: number
          user_id: string
          warnings: string[] | null
        }
        Insert: {
          completed_at?: string
          copy_paste_count?: number
          course_id: string
          flagged?: boolean
          focus_lost_count?: number
          id?: string
          integrity_score?: number
          lesson_id: string
          quiz_score?: number
          rapid_answer_count?: number
          student_name?: string | null
          tab_switch_count?: number
          user_id: string
          warnings?: string[] | null
        }
        Update: {
          completed_at?: string
          copy_paste_count?: number
          course_id?: string
          flagged?: boolean
          focus_lost_count?: number
          id?: string
          integrity_score?: number
          lesson_id?: string
          quiz_score?: number
          rapid_answer_count?: number
          student_name?: string | null
          tab_switch_count?: number
          user_id?: string
          warnings?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_attempts_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          correct_answer: number
          created_at: string | null
          explanation_am: string | null
          explanation_en: string | null
          id: string
          lesson_id: string
          options: Json
          question_am: string
          question_en: string
        }
        Insert: {
          correct_answer?: number
          created_at?: string | null
          explanation_am?: string | null
          explanation_en?: string | null
          id?: string
          lesson_id: string
          options?: Json
          question_am: string
          question_en: string
        }
        Update: {
          correct_answer?: number
          created_at?: string | null
          explanation_am?: string | null
          explanation_en?: string | null
          id?: string
          lesson_id?: string
          options?: Json
          question_am?: string
          question_en?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      recipes: {
        Row: {
          category: string
          created_at: string | null
          description_am: string | null
          description_en: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          equipment_required: Json | null
          estimated_time_minutes: number | null
          id: string
          image_url: string | null
          ingredients: Json
          is_premium: boolean | null
          name_am: string
          name_en: string
          safety_requirements: Json
          steps: Json
          success_rate_percent: number | null
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description_am?: string | null
          description_en?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          equipment_required?: Json | null
          estimated_time_minutes?: number | null
          id?: string
          image_url?: string | null
          ingredients: Json
          is_premium?: boolean | null
          name_am: string
          name_en: string
          safety_requirements: Json
          steps: Json
          success_rate_percent?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description_am?: string | null
          description_en?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          equipment_required?: Json | null
          estimated_time_minutes?: number | null
          id?: string
          image_url?: string | null
          ingredients?: Json
          is_premium?: boolean | null
          name_am?: string
          name_en?: string
          safety_requirements?: Json
          steps?: Json
          success_rate_percent?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      safety_analyses: {
        Row: {
          analysis_type: string
          created_at: string
          danger_level: string | null
          id: string
          inputs: Json
          raw_reply: string | null
          structured: Json | null
          summary: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_type: string
          created_at?: string
          danger_level?: string | null
          id?: string
          inputs?: Json
          raw_reply?: string | null
          structured?: Json | null
          summary?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis_type?: string
          created_at?: string
          danger_level?: string | null
          id?: string
          inputs?: Json
          raw_reply?: string | null
          structured?: Json | null
          summary?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      safety_certifications: {
        Row: {
          certification_type: string
          expires_at: string | null
          id: string
          level: string
          passed_at: string | null
          score: number | null
          user_id: string
        }
        Insert: {
          certification_type: string
          expires_at?: string | null
          id?: string
          level: string
          passed_at?: string | null
          score?: number | null
          user_id: string
        }
        Update: {
          certification_type?: string
          expires_at?: string | null
          id?: string
          level?: string
          passed_at?: string | null
          score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      safety_incidents: {
        Row: {
          chemicals_involved: Json | null
          description: string | null
          experiment_id: string | null
          id: string
          incident_type: string
          reported_at: string | null
          resolved: boolean | null
          response_taken: Json | null
          severity: string | null
          user_id: string
        }
        Insert: {
          chemicals_involved?: Json | null
          description?: string | null
          experiment_id?: string | null
          id?: string
          incident_type: string
          reported_at?: string | null
          resolved?: boolean | null
          response_taken?: Json | null
          severity?: string | null
          user_id: string
        }
        Update: {
          chemicals_involved?: Json | null
          description?: string | null
          experiment_id?: string | null
          id?: string
          incident_type?: string
          reported_at?: string | null
          resolved?: boolean | null
          response_taken?: Json | null
          severity?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "safety_incidents_experiment_id_fkey"
            columns: ["experiment_id"]
            isOneToOne: false
            referencedRelation: "experiments"
            referencedColumns: ["id"]
          },
        ]
      }
      study_streaks: {
        Row: {
          current_streak: number
          id: string
          last_study_date: string | null
          longest_streak: number
          total_study_days: number
          updated_at: string
          user_id: string
        }
        Insert: {
          current_streak?: number
          id?: string
          last_study_date?: string | null
          longest_streak?: number
          total_study_days?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          current_streak?: number
          id?: string
          last_study_date?: string | null
          longest_streak?: number
          total_study_days?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_flashcard_progress: {
        Row: {
          confidence_level: number | null
          flashcard_id: string
          id: string
          last_reviewed_at: string | null
          next_review_at: string | null
          review_count: number | null
          user_id: string
        }
        Insert: {
          confidence_level?: number | null
          flashcard_id: string
          id?: string
          last_reviewed_at?: string | null
          next_review_at?: string | null
          review_count?: number | null
          user_id: string
        }
        Update: {
          confidence_level?: number | null
          flashcard_id?: string
          id?: string
          last_reviewed_at?: string | null
          next_review_at?: string | null
          review_count?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_flashcard_progress_flashcard_id_fkey"
            columns: ["flashcard_id"]
            isOneToOne: false
            referencedRelation: "flashcards"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          id: string
          lesson_id: string
          quiz_score: number | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          lesson_id: string
          quiz_score?: number | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          lesson_id?: string
          quiz_score?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      leaderboard: {
        Row: {
          avatar_url: string | null
          avg_quiz_score: number | null
          completed_lessons: number | null
          current_streak: number | null
          full_name: string | null
          skill_level: Database["public"]["Enums"]["skill_level"] | null
          total_points: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "user" | "admin" | "superadmin"
      difficulty_level: "beginner" | "intermediate" | "advanced"
      skill_level: "beginner" | "intermediate" | "advanced"
      subscription_tier: "free" | "premium" | "institution"
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
    Enums: {
      app_role: ["user", "admin", "superadmin"],
      difficulty_level: ["beginner", "intermediate", "advanced"],
      skill_level: ["beginner", "intermediate", "advanced"],
      subscription_tier: ["free", "premium", "institution"],
    },
  },
} as const
