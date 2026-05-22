// TypeScript Types for Supabase / PostgreSQL Schema
// Phase 2: Complete Type Safety definitions for VolleyClub Pro

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      roles: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
      }
      permissions: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
      }
      role_permissions: {
        Row: {
          role_id: string
          permission_id: string
        }
        Insert: {
          role_id: string
          permission_id: string
        }
        Update: {
          role_id?: string
          permission_id?: string
        }
      }
      user_roles: {
        Row: {
          user_id: string
          role_id: string
        }
        Insert: {
          user_id: string
          role_id: string
        }
        Update: {
          user_id?: string
          role_id?: string
        }
      }
      clubs: {
        Row: {
          id: string
          name_en: string
          name_ar: string
          logo_url: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          name_en: string
          name_ar: string
          logo_url?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          name_en?: string
          name_ar?: string
          logo_url?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      seasons: {
        Row: {
          id: string
          club_id: string
          name_en: string
          name_ar: string
          start_date: string
          end_date: string
          is_active: boolean
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          club_id: string
          name_en: string
          name_ar: string
          start_date: string
          end_date: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          club_id?: string
          name_en?: string
          name_ar?: string
          start_date?: string
          end_date?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      sports: {
        Row: {
          id: string
          name_en: string
          name_ar: string
          created_at: string
        }
        Insert: {
          id?: string
          name_en: string
          name_ar: string
          created_at?: string
        }
        Update: {
          id?: string
          name_en?: string
          name_ar?: string
          created_at?: string
        }
      }
      age_groups: {
        Row: {
          id: string
          club_id: string
          name_en: string
          name_ar: string
          min_age: number | null
          max_age: number | null
          created_at: string
        }
        Insert: {
          id?: string
          club_id: string
          name_en: string
          name_ar: string
          min_age?: number | null
          max_age?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          club_id?: string
          name_en?: string
          name_ar?: string
          min_age?: number | null
          max_age?: number | null
          created_at?: string
        }
      }
      teams: {
        Row: {
          id: string
          club_id: string
          season_id: string | null
          age_group_id: string | null
          sport_id: string | null
          name_en: string
          name_ar: string
          gender: 'Men' | 'Women' | 'Mixed'
          color_hex: string
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          club_id: string
          season_id?: string | null
          age_group_id?: string | null
          sport_id?: string | null
          name_en: string
          name_ar: string
          gender: 'Men' | 'Women' | 'Mixed'
          color_hex?: string
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          club_id?: string
          season_id?: string | null
          age_group_id?: string | null
          sport_id?: string | null
          name_en?: string
          name_ar?: string
          gender?: 'Men' | 'Women' | 'Mixed'
          color_hex?: string
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      players: {
        Row: {
          id: string
          user_id: string | null
          club_id: string
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          club_id: string
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          club_id?: string
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      player_profiles: {
        Row: {
          player_id: string
          full_name_en: string
          full_name_ar: string
          jersey_number: number | null
          position: 'Setter' | 'Opposite' | 'Outside Hitter' | 'Middle Blocker' | 'Libero' | null
          dominant_hand: 'Right' | 'Left' | 'Ambidextrous' | null
          height_cm: number | null
          weight_kg: number | null
          birth_date: string | null
          parent_name: string | null
          parent_phone: string | null
          parent_email: string | null
          photo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          player_id: string
          full_name_en: string
          full_name_ar: string
          jersey_number?: number | null
          position?: 'Setter' | 'Opposite' | 'Outside Hitter' | 'Middle Blocker' | 'Libero' | null
          dominant_hand?: 'Right' | 'Left' | 'Ambidextrous' | null
          height_cm?: number | null
          weight_kg?: number | null
          birth_date?: string | null
          parent_name?: string | null
          parent_phone?: string | null
          parent_email?: string | null
          photo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          player_id?: string
          full_name_en?: string
          full_name_ar?: string
          jersey_number?: number | null
          position?: 'Setter' | 'Opposite' | 'Outside Hitter' | 'Middle Blocker' | 'Libero' | null
          dominant_hand?: 'Right' | 'Left' | 'Ambidextrous' | null
          height_cm?: number | null
          weight_kg?: number | null
          birth_date?: string | null
          parent_name?: string | null
          parent_phone?: string | null
          parent_email?: string | null
          photo_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      player_medical: {
        Row: {
          id: string
          player_id: string
          medical_status: 'Fit' | 'Injured' | 'Rehabilitation' | 'Pending Clearance'
          injury_details: string | null
          blood_type: string | null
          allergies: string | null
          last_checkup_date: string | null
          clearance_document_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          player_id: string
          medical_status?: 'Fit' | 'Injured' | 'Rehabilitation' | 'Pending Clearance'
          injury_details?: string | null
          blood_type?: string | null
          allergies?: string | null
          last_checkup_date?: string | null
          clearance_document_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          player_id?: string
          medical_status?: 'Fit' | 'Injured' | 'Rehabilitation' | 'Pending Clearance'
          injury_details?: string | null
          blood_type?: string | null
          allergies?: string | null
          last_checkup_date?: string | null
          clearance_document_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      player_contracts: {
        Row: {
          id: string
          player_id: string
          contract_number: string | null
          start_date: string
          end_date: string
          salary: number | null
          currency: string
          status: 'Active' | 'Terminated' | 'Expired'
          document_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          player_id: string
          contract_number?: string | null
          start_date: string
          end_date: string
          salary?: number | null
          currency?: string
          status?: 'Active' | 'Terminated' | 'Expired'
          document_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          player_id?: string
          contract_number?: string | null
          start_date?: string
          end_date?: string
          salary?: number | null
          currency?: string
          status?: 'Active' | 'Terminated' | 'Expired'
          document_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      player_documents: {
        Row: {
          id: string
          player_id: string
          name: string
          document_type: 'ID' | 'Passport' | 'National Registration' | 'Insurance' | 'Other'
          document_url: string
          expiry_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          player_id: string
          name: string
          document_type: 'ID' | 'Passport' | 'National Registration' | 'Insurance' | 'Other'
          document_url: string
          expiry_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          player_id?: string
          name?: string
          document_type?: 'ID' | 'Passport' | 'National Registration' | 'Insurance' | 'Other'
          document_url?: string
          expiry_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      player_statistics: {
        Row: {
          id: string
          player_id: string
          season_id: string
          matches_played: number
          sets_played: number
          kills: number
          attacks: number
          attack_errors: number
          aces: number
          serve_errors: number
          blocks: number
          digs: number
          assists: number
          receptions: number
          reception_errors: number
          updated_at: string
        }
        Insert: {
          id?: string
          player_id: string
          season_id: string
          matches_played?: number
          sets_played?: number
          kills?: number
          attacks?: number
          attack_errors?: number
          aces?: number
          serve_errors?: number
          blocks?: number
          digs?: number
          assists?: number
          receptions?: number
          reception_errors?: number
          updated_at?: string
        }
        Update: {
          id?: string
          player_id?: string
          season_id?: string
          matches_played?: number
          sets_played?: number
          kills?: number
          attacks?: number
          attack_errors?: number
          aces?: number
          serve_errors?: number
          blocks?: number
          digs?: number
          assists?: number
          receptions?: number
          reception_errors?: number
          updated_at?: string
        }
      }
      staff: {
        Row: {
          id: string
          user_id: string | null
          club_id: string
          full_name_en: string
          full_name_ar: string
          email: string | null
          phone: string | null
          photo_url: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          club_id: string
          full_name_en: string
          full_name_ar: string
          email?: string | null
          phone?: string | null
          photo_url?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          club_id?: string
          full_name_en?: string
          full_name_ar?: string
          email?: string | null
          phone?: string | null
          photo_url?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      staff_roles: {
        Row: {
          id: string
          staff_id: string
          team_id: string | null
          role: 'Head Coach' | 'Assistant Coach' | 'Physiotherapist' | 'Analyst' | 'Team Manager' | 'Club Admin'
          created_at: string
        }
        Insert: {
          id?: string
          staff_id: string
          team_id?: string | null
          role: 'Head Coach' | 'Assistant Coach' | 'Physiotherapist' | 'Analyst' | 'Team Manager' | 'Club Admin'
          created_at?: string
        }
        Update: {
          id?: string
          staff_id?: string
          team_id?: string | null
          role?: 'Head Coach' | 'Assistant Coach' | 'Physiotherapist' | 'Analyst' | 'Team Manager' | 'Club Admin'
          created_at?: string
        }
      }
      staff_attendance: {
        Row: {
          id: string
          staff_id: string
          date: string
          status: 'Present' | 'Late' | 'Absent' | 'Excused'
          check_in: string | null
          check_out: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          staff_id: string
          date: string
          status: 'Present' | 'Late' | 'Absent' | 'Excused'
          check_in?: string | null
          check_out?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          staff_id?: string
          date?: string
          status?: 'Present' | 'Late' | 'Absent' | 'Excused'
          check_in?: string | null
          check_out?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      staff_documents: {
        Row: {
          id: string
          staff_id: string
          name: string
          document_type: string | null
          document_url: string
          expiry_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          staff_id: string
          name: string
          document_type?: string | null
          document_url: string
          expiry_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          staff_id?: string
          name?: string
          document_type?: string | null
          document_url?: string
          expiry_date?: string | null
          created_at?: string
        }
      }
      training_sessions: {
        Row: {
          id: string
          team_id: string
          season_id: string
          title_en: string
          title_ar: string
          focus_area: 'Technical' | 'Tactical' | 'Physical' | 'Recovery' | 'Match Preparation'
          date: string
          start_time: string
          duration_minutes: number
          location: string | null
          description: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          team_id: string
          season_id: string
          title_en: string
          title_ar: string
          focus_area: 'Technical' | 'Tactical' | 'Physical' | 'Recovery' | 'Match Preparation'
          date: string
          start_time: string
          duration_minutes: number
          location?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          team_id?: string
          season_id?: string
          title_en?: string
          title_ar?: string
          focus_area?: 'Technical' | 'Tactical' | 'Physical' | 'Recovery' | 'Match Preparation'
          date?: string
          start_time?: string
          duration_minutes?: number
          location?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      attendance_sessions: {
        Row: {
          id: string
          club_id: string
          session_type: 'Training' | 'Match'
          reference_id: string
          date: string
          taken_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          club_id: string
          session_type: 'Training' | 'Match'
          reference_id: string
          date: string
          taken_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          club_id?: string
          session_type?: 'Training' | 'Match'
          reference_id?: string
          date?: string
          taken_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      attendance_records: {
        Row: {
          id: string
          session_id: string
          player_id: string | null
          staff_id: string | null
          status: 'Present' | 'Late' | 'Absent' | 'Excused' | 'Injured'
          minutes_late: number
          check_in_time: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          session_id: string
          player_id?: string | null
          staff_id?: string | null
          status: 'Present' | 'Late' | 'Absent' | 'Excused' | 'Injured'
          minutes_late?: number
          check_in_time?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          player_id?: string | null
          staff_id?: string | null
          status?: 'Present' | 'Late' | 'Absent' | 'Excused' | 'Injured'
          minutes_late?: number
          check_in_time?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      attendance_notes: {
        Row: {
          id: string
          record_id: string
          note: string
          author_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          record_id: string
          note: string
          author_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          record_id?: string
          note?: string
          author_id?: string | null
          created_at?: string
        }
      }
      disciplinary_actions: {
        Row: {
          id: string
          player_id: string
          reason: string
          action_type: string
          issued_by: string | null
          issue_date: string
          status: 'Pending' | 'Resolved' | 'Appealed'
          created_at: string
        }
        Insert: {
          id?: string
          player_id: string
          reason: string
          action_type: string
          issued_by?: string | null
          issue_date: string
          status?: 'Pending' | 'Resolved' | 'Appealed'
          created_at?: string
        }
        Update: {
          id?: string
          player_id?: string
          reason?: string
          action_type?: string
          issued_by?: string | null
          issue_date?: string
          status?: 'Pending' | 'Resolved' | 'Appealed'
          created_at?: string
        }
      }
      training_plans: {
        Row: {
          id: string
          club_id: string
          author_id: string | null
          title_en: string
          title_ar: string
          objectives: string | null
          drills_json: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          club_id: string
          author_id?: string | null
          title_en: string
          title_ar: string
          objectives?: string | null
          drills_json?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          club_id?: string
          author_id?: string | null
          title_en?: string
          title_ar?: string
          objectives?: string | null
          drills_json?: Json
          created_at?: string
          updated_at?: string
        }
      }
      trainings: {
        Row: {
          id: string
          session_id: string
          plan_id: string | null
          notes: string | null
          rpe_average: number | null
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          plan_id?: string | null
          notes?: string | null
          rpe_average?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          plan_id?: string | null
          notes?: string | null
          rpe_average?: number | null
          created_at?: string
        }
      }
      training_loads: {
        Row: {
          id: string
          session_id: string
          team_id: string
          planned_duration: number
          actual_duration: number | null
          intensity_level: number | null
          load_score: number | null
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          team_id: string
          planned_duration: number
          actual_duration?: number | null
          intensity_level?: number | null
          load_score?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          team_id?: string
          planned_duration?: number
          actual_duration?: number | null
          intensity_level?: number | null
          load_score?: number | null
          created_at?: string
        }
      }
      rpe_logs: {
        Row: {
          id: string
          session_id: string
          player_id: string
          rpe_score: number
          session_duration_minutes: number
          calculated_load: number
          feedback: string | null
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          player_id: string
          rpe_score: number
          session_duration_minutes: number
          calculated_load: number
          feedback?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          player_id?: string
          rpe_score?: number
          session_duration_minutes?: number
          calculated_load?: number
          feedback?: string | null
          created_at?: string
        }
      }
      training_notes: {
        Row: {
          id: string
          training_id: string
          author_id: string | null
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          training_id: string
          author_id?: string | null
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          training_id?: string
          author_id?: string | null
          content?: string
          created_at?: string
        }
      }
      matches: {
        Row: {
          id: string
          team_id: string
          season_id: string
          opponent_name_en: string
          opponent_name_ar: string
          date: string
          time: string
          location_en: string | null
          location_ar: string | null
          status: 'Scheduled' | 'Live' | 'Completed' | 'Cancelled'
          competition_name_en: string | null
          competition_name_ar: string | null
          our_score: number
          opponent_score: number
          video_url: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          team_id: string
          season_id: string
          opponent_name_en: string
          opponent_name_ar: string
          date: string
          time: string
          location_en?: string | null
          location_ar?: string | null
          status?: 'Scheduled' | 'Live' | 'Completed' | 'Cancelled'
          competition_name_en?: string | null
          competition_name_ar?: string | null
          our_score?: number
          opponent_score?: number
          video_url?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          team_id?: string
          season_id?: string
          opponent_name_en?: string
          opponent_name_ar?: string
          date?: string
          time?: string
          location_en?: string | null
          location_ar?: string | null
          status?: 'Scheduled' | 'Live' | 'Completed' | 'Cancelled'
          competition_name_en?: string | null
          competition_name_ar?: string | null
          our_score?: number
          opponent_score?: number
          video_url?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      match_lineups: {
        Row: {
          id: string
          match_id: string
          set_number: number
          pos_1_player_id: string | null
          pos_2_player_id: string | null
          pos_3_player_id: string | null
          pos_4_player_id: string | null
          pos_5_player_id: string | null
          pos_6_player_id: string | null
          libero_player_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          match_id: string
          set_number: number
          pos_1_player_id?: string | null
          pos_2_player_id?: string | null
          pos_3_player_id?: string | null
          pos_4_player_id?: string | null
          pos_5_player_id?: string | null
          pos_6_player_id?: string | null
          libero_player_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          match_id?: string
          set_number?: number
          pos_1_player_id?: string | null
          pos_2_player_id?: string | null
          pos_3_player_id?: string | null
          pos_4_player_id?: string | null
          pos_5_player_id?: string | null
          pos_6_player_id?: string | null
          libero_player_id?: string | null
          created_at?: string
        }
      }
      match_rotations: {
        Row: {
          id: string
          match_id: string
          set_number: number
          rotation_number: number
          details: Json
          created_at: string
        }
        Insert: {
          id?: string
          match_id: string
          set_number: number
          rotation_number: number
          details?: Json
          created_at?: string
        }
        Update: {
          id?: string
          match_id?: string
          set_number?: number
          rotation_number?: number
          details?: Json
          created_at?: string
        }
      }
      match_sets: {
        Row: {
          id: string
          match_id: string
          set_number: number
          our_score: number
          opponent_score: number
          is_completed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          match_id: string
          set_number: number
          our_score?: number
          opponent_score?: number
          is_completed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          match_id?: string
          set_number?: number
          our_score?: number
          opponent_score?: number
          is_completed?: boolean
          created_at?: string
        }
      }
      match_statistics: {
        Row: {
          id: string
          match_id: string
          set_number: number
          player_id: string
          action_type: 'Serve' | 'Receive' | 'Set' | 'Attack' | 'Block' | 'Dig'
          action_quality: string
          details: Json
          timestamp: string | null
          created_at: string
        }
        Insert: {
          id?: string
          match_id: string
          set_number: number
          player_id: string
          action_type: 'Serve' | 'Receive' | 'Set' | 'Attack' | 'Block' | 'Dig'
          action_quality: string
          details?: Json
          timestamp?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          match_id?: string
          set_number?: number
          player_id?: string
          action_type?: 'Serve' | 'Receive' | 'Set' | 'Attack' | 'Block' | 'Dig'
          action_quality?: string
          details?: Json
          timestamp?: string | null
          created_at?: string
        }
      }
      rally_tracking: {
        Row: {
          id: string
          match_id: string
          set_number: number
          rally_number: number
          serving_team: 'Us' | 'Opponent'
          winner: 'Us' | 'Opponent'
          side_out: boolean
          first_attack_type: 'Transition' | 'Receive' | null
          first_attack_quality: 'Kill' | 'Neutral' | 'Error' | null
          events_json: Json
          created_at: string
        }
        Insert: {
          id?: string
          match_id: string
          set_number: number
          rally_number: number
          serving_team: 'Us' | 'Opponent'
          winner: 'Us' | 'Opponent'
          side_out: boolean
          first_attack_type?: 'Transition' | 'Receive' | null
          first_attack_quality?: 'Kill' | 'Neutral' | 'Error' | null
          events_json?: Json
          created_at?: string
        }
        Update: {
          id?: string
          match_id?: string
          set_number?: number
          rally_number?: number
          serving_team?: 'Us' | 'Opponent'
          winner?: 'Us' | 'Opponent'
          side_out?: boolean
          first_attack_type?: 'Transition' | 'Receive' | null
          first_attack_quality?: 'Kill' | 'Neutral' | 'Error' | null
          events_json?: Json
          created_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          club_id: string
          title_en: string
          title_ar: string
          report_type: 'Attendance' | 'Player Performance' | 'Match Analysis' | 'Training Load'
          parameters: Json
          data: Json
          generated_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          club_id: string
          title_en: string
          title_ar: string
          report_type: 'Attendance' | 'Player Performance' | 'Match Analysis' | 'Training Load'
          parameters?: Json
          data?: Json
          generated_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          club_id?: string
          title_en?: string
          title_ar?: string
          report_type?: 'Attendance' | 'Player Performance' | 'Match Analysis' | 'Training Load'
          parameters?: Json
          data?: Json
          generated_by?: string | null
          created_at?: string
        }
      }
      analytics_snapshots: {
        Row: {
          id: string
          club_id: string
          snapshot_date: string
          metric_name: string
          metric_value: number
          created_at: string
        }
        Insert: {
          id?: string
          club_id: string
          snapshot_date: string
          metric_name: string
          metric_value: number
          created_at?: string
        }
        Update: {
          id?: string
          club_id?: string
          snapshot_date?: string
          metric_name?: string
          metric_value?: number
          created_at?: string
        }
      }
      dashboards: {
        Row: {
          id: string
          user_id: string
          layout_json: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          layout_json: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          layout_json?: Json
          created_at?: string
        }
      }
      performance_metrics: {
        Row: {
          id: string
          player_id: string
          date: string
          metric_type: string
          metric_value: number
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          player_id: string
          date: string
          metric_type: string
          metric_value: number
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          player_id?: string
          date?: string
          metric_type?: string
          metric_value?: number
          notes?: string | null
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title_en: string
          title_ar: string
          message_en: string
          message_ar: string
          type: 'Info' | 'Warning' | 'Success' | 'Alert'
          is_read: boolean
          link: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title_en: string
          title_ar: string
          message_en: string
          message_ar: string
          type?: 'Info' | 'Warning' | 'Success' | 'Alert'
          is_read?: boolean
          link?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title_en?: string
          title_ar?: string
          message_en?: string
          message_ar?: string
          type?: 'Info' | 'Warning' | 'Success' | 'Alert'
          is_read?: boolean
          link?: string | null
          created_at?: string
        }
      }
      announcements: {
        Row: {
          id: string
          club_id: string
          author_id: string | null
          title_en: string
          title_ar: string
          content_en: string
          content_ar: string
          target_teams: string[] | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          club_id: string
          author_id?: string | null
          title_en: string
          title_ar: string
          content_en: string
          content_ar: string
          target_teams?: string[] | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          club_id?: string
          author_id?: string | null
          title_en?: string
          title_ar?: string
          content_en?: string
          content_ar?: string
          target_teams?: string[] | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string | null
          receiver_id: string | null
          team_id: string | null
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          sender_id?: string | null
          receiver_id?: string | null
          team_id?: string | null
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          sender_id?: string | null
          receiver_id?: string | null
          team_id?: string | null
          content?: string
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          club_id: string
          title: string
          description: string | null
          assigned_to: string | null
          due_date: string | null
          status: 'Todo' | 'In Progress' | 'Completed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          club_id: string
          title: string
          description?: string | null
          assigned_to?: string | null
          due_date?: string | null
          status?: 'Todo' | 'In Progress' | 'Completed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          club_id?: string
          title?: string
          description?: string | null
          assigned_to?: string | null
          due_date?: string | null
          status?: 'Todo' | 'In Progress' | 'Completed'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_hitting_efficiency: {
        Args: {
          p_player_id: string
          p_season_id?: string
        }
        Returns: number
      }
      calculate_side_out_percentage: {
        Args: {
          p_team_id: string
          p_match_id?: string
        }
        Returns: number
      }
      calculate_serve_receive_rating: {
        Args: {
          p_player_id: string
          p_season_id?: string
        }
        Returns: number
      }
      get_setter_distribution: {
        Args: {
          p_match_id: string
          p_set_number?: number
        }
        Returns: {
          target_zone: string
          set_count: number
          percentage: number
        }[]
      }
      get_repeated_absences: {
        Args: {
          p_threshold?: number
        }
        Returns: {
          player_id: string
          full_name_en: string
          full_name_ar: string
          team_name_en: string
          absence_count: number
        }[]
      }
      calculate_monthly_attendance_report: {
        Args: {
          p_team_id: string
          p_start_date: string
          p_end_date: string
        }
        Returns: {
          player_id: string
          full_name_en: string
          full_name_ar: string
          total_sessions: number
          present_count: number
          late_count: number
          absent_count: number
          excused_count: number
          injured_count: number
          attendance_rate: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
export default Database;
