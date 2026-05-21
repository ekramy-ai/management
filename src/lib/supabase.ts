/**
 * Supabase client setup for VolleyClub Pro.
 * Provides a production-ready structure that can be instantly wired up to a live
 * Supabase project by installing `@supabase/supabase-js` and providing env variables.
 */

export interface DatabaseSchema {
  teams: {
    Row: {
      id: string;
      name_en: string;
      name_ar: string;
      age_group: string;
      gender: string;
      head_coach_id: string | null;
      description_en: string | null;
      description_ar: string | null;
      color_hex: string;
      created_at: string;
    };
    Insert: Omit<DatabaseSchema['teams']['Row'], 'id' | 'created_at'>;
    Update: Partial<DatabaseSchema['teams']['Row']>;
  };
  players: {
    Row: {
      id: string;
      team_id: string | null;
      name_en: string;
      name_ar: string;
      jersey_number: number;
      position: string;
      status: string;
      height: number;
      weight: number;
      birth_date: string;
      nationality_en: string;
      nationality_ar: string;
      stats: Record<string, any>;
      notes_en: string | null;
      notes_ar: string | null;
    };
    Insert: Omit<DatabaseSchema['players']['Row'], 'id'>;
    Update: Partial<DatabaseSchema['players']['Row']>;
  };
}

// Config variables for manual wiring
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-project.supabase.co';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key';

// Mock Supabase Client implementation
class MockSupabaseClient {
  auth = {
    getUser: async () => {
      // Mock authenticated session
      return {
        data: {
          user: {
            id: 'mock-user-id-1',
            email: 'admin@volleyclub.com',
            user_metadata: {
              name: 'Coach Alberto',
              role: 'Head Coach'
            }
          }
        },
        error: null
      };
    },
    signInWithPassword: async ({ email }: { email: string }) => {
      return {
        data: { session: { access_token: 'mock-token' } },
        error: null
      };
    },
    signOut: async () => {
      return { error: null };
    }
  };

  from(table: keyof DatabaseSchema) {
    return {
      select: (query = '*') => ({
        eq: (col: string, val: any) => ({
          single: async () => ({ data: null, error: null }),
          then: (cb: any) => cb({ data: [], error: null })
        }),
        then: (cb: any) => cb({ data: [], error: null })
      }),
      insert: (data: any) => ({
        select: () => ({
          single: async () => ({ data: null, error: null })
        })
      }),
      update: (data: any) => ({
        eq: (col: string, val: any) => ({
          select: () => ({
            single: async () => ({ data: null, error: null })
          })
        })
      }),
      delete: () => ({
        eq: (col: string, val: any) => ({
          then: (cb: any) => cb({ error: null })
        })
      })
    };
  }
}

export const supabase = new MockSupabaseClient();
