export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  api: {
    Tables: {
      appointments: {
        Row: {
          id: string
          first_name: string
          last_name: string
          company_name: string
          email: string
          phone: string | null
          address: string | null
          purpose_id: string
          message: string | null
          appointment_type: 'phone' | 'video' | 'in_person'
          appointment_date: string
          duration_minutes: number
          reminders_enabled: boolean
          status: 'confirmed' | 'cancelled' | 'modified'
          google_calendar_event_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          company_name: string
          email: string
          phone?: string | null
          address?: string | null
          purpose_id: string
          message?: string | null
          appointment_type: 'phone' | 'video' | 'in_person'
          appointment_date: string
          duration_minutes: number
          reminders_enabled?: boolean
          status?: 'confirmed' | 'cancelled' | 'modified'
          google_calendar_event_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          company_name?: string
          email?: string
          phone?: string | null
          address?: string | null
          purpose_id?: string
          message?: string | null
          appointment_type?: 'phone' | 'video' | 'in_person'
          appointment_date?: string
          duration_minutes?: number
          reminders_enabled?: boolean
          status?: 'confirmed' | 'cancelled' | 'modified'
          google_calendar_event_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      appointment_settings: {
        Row: {
          id: string
          title: string
          description: string | null
          photo_url: string | null
          google_calendar_sync_url: string | null
          email_reminder_enabled: boolean
          sms_reminder_enabled: boolean
          email_reminder_template: string | null
          sms_reminder_template: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          photo_url?: string | null
          google_calendar_sync_url?: string | null
          email_reminder_enabled?: boolean
          sms_reminder_enabled?: boolean
          email_reminder_template?: string | null
          sms_reminder_template?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          photo_url?: string | null
          google_calendar_sync_url?: string | null
          email_reminder_enabled?: boolean
          sms_reminder_enabled?: boolean
          email_reminder_template?: string | null
          sms_reminder_template?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      appointment_purposes: {
        Row: {
          id: string
          title: string
          description: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      appointment_durations: {
        Row: {
          id: string
          duration_minutes: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          duration_minutes: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          duration_minutes?: number
          is_active?: boolean
          created_at?: string
        }
      }
      availability_slots: {
        Row: {
          id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          day_of_week: number
          start_time: string
          end_time: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          is_active?: boolean
          created_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      appointment_status: 'pending' | 'confirmed' | 'cancelled' | 'modified'
    }
    CompositeTypes: Record<string, never>
  }
}

type ApiSchema = Database[Extract<keyof Database, "api">]

export type Tables<
  SchemaTableNameOrOptions extends
    | keyof (ApiSchema["Tables"] & ApiSchema["Views"])
    | { schema: keyof Database },
  TableName extends SchemaTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[SchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[SchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = SchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[SchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[SchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : SchemaTableNameOrOptions extends keyof (ApiSchema["Tables"] &
        ApiSchema["Views"])
    ? (ApiSchema["Tables"] &
        ApiSchema["Views"])[SchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  SchemaTableNameOrOptions extends
    | keyof ApiSchema["Tables"]
    | { schema: keyof Database },
  TableName extends SchemaTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[SchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = SchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[SchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : SchemaTableNameOrOptions extends keyof ApiSchema["Tables"]
    ? ApiSchema["Tables"][SchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  SchemaTableNameOrOptions extends
    | keyof ApiSchema["Tables"]
    | { schema: keyof Database },
  TableName extends SchemaTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[SchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = SchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[SchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : SchemaTableNameOrOptions extends keyof ApiSchema["Tables"]
    ? ApiSchema["Tables"][SchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  SchemaEnumNameOrOptions extends
    | keyof ApiSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends SchemaEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[SchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = SchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[SchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : SchemaEnumNameOrOptions extends keyof ApiSchema["Enums"]
    ? ApiSchema["Enums"][SchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  SchemaCompositeTypeNameOrOptions extends
    | keyof ApiSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends SchemaCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[SchemaCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = SchemaCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[SchemaCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : SchemaCompositeTypeNameOrOptions extends keyof ApiSchema["CompositeTypes"]
    ? ApiSchema["CompositeTypes"][SchemaCompositeTypeNameOrOptions]
    : never
