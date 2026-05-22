import { createClient } from '@supabase/supabase-js';
import DatabaseSchema from '../types/database';

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Mock Fallback Client for offline local development
class MockSupabaseClient {
  auth = {
    getUser: async () => {
      return {
        data: {
          user: {
            id: 'mock-user-id-1',
            email: 'admin@volleyclub.com',
            user_metadata: {
              name: 'Coach Ahmed Hassan',
              role: 'Head Coach'
            }
          }
        },
        error: null
      };
    },
    signInWithPassword: async () => {
      return {
        data: { session: { access_token: 'mock-token' } },
        error: null
      };
    },
    signOut: async () => {
      return { error: null };
    }
  };

  from(table: string) {
    return {
      select: (query = '*') => ({
        eq: (col: string, val: any) => ({
          single: async () => ({ data: null, error: null }),
          order: (col2: string, opts: any) => ({
            then: (cb: any) => cb({ data: [], error: null })
          }),
          then: (cb: any) => cb({ data: [], error: null })
        }),
        order: (col: string, opts: any) => ({
          then: (cb: any) => cb({ data: [], error: null })
        }),
        then: (cb: any) => cb({ data: [], error: null })
      }),
      insert: (data: any) => ({
        select: () => ({
          single: async () => ({ data: null, error: null })
        }),
        then: (cb: any) => cb({ data: null, error: null })
      }),
      update: (data: any) => ({
        eq: (col: string, val: any) => ({
          select: () => ({
            single: async () => ({ data: null, error: null })
          }),
          then: (cb: any) => cb({ data: null, error: null })
        })
      }),
      delete: () => ({
        eq: (col: string, val: any) => ({
          then: (cb: any) => cb({ error: null })
        })
      })
    };
  }

  rpc(fnName: string, args: any) {
    return {
      then: (cb: any) => cb({ data: null, error: null })
    };
  }
}

// Instantiate the actual client if credentials exist, otherwise fall back to mock
export const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY)
  ? createClient<DatabaseSchema>(SUPABASE_URL, SUPABASE_ANON_KEY)
  : (new MockSupabaseClient() as any);
export default supabase;
