import BaseRepository from './baseRepository';
import Database from '../types/database';
import supabase from '../lib/supabase';

type SessionSchema = Database['public']['Tables']['training_sessions'];
type PlanSchema = Database['public']['Tables']['training_plans'];
type LoadSchema = Database['public']['Tables']['training_loads'];
type RpeSchema = Database['public']['Tables']['rpe_logs'];

export class TrainingRepository extends BaseRepository<SessionSchema> {
  constructor() {
    super('training_sessions');
  }

  // Get all training sessions for a team
  async getTrainingsByTeam(teamId: string): Promise<SessionSchema['Row'][]> {
    const { data, error } = await supabase
      .from('training_sessions')
      .select('*')
      .eq('team_id', teamId)
      .is('deleted_at', null)
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Save/Create training exercise plans (drills json)
  async saveTrainingPlan(plan: PlanSchema['Insert']): Promise<PlanSchema['Row']> {
    const { data, error } = await supabase
      .from('training_plans')
      .insert(plan)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get training plans for a club
  async getTrainingPlansByClub(clubId: string): Promise<PlanSchema['Row'][]> {
    const { data, error } = await supabase
      .from('training_plans')
      .select('*')
      .eq('club_id', clubId);

    if (error) throw error;
    return data || [];
  }

  // Log planned/actual load score
  async saveTrainingLoad(load: LoadSchema['Insert']): Promise<LoadSchema['Row']> {
    const { data, error } = await supabase
      .from('training_loads')
      .insert(load)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Log individual player RPE score
  async logPlayerRpe(rpeLog: RpeSchema['Insert']): Promise<RpeSchema['Row']> {
    const { data, error } = await supabase
      .from('rpe_logs')
      .insert(rpeLog)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get RPE scores submitted for a session
  async getSessionRpeLogs(sessionId: string): Promise<RpeSchema['Row'][]> {
    const { data, error } = await supabase
      .from('rpe_logs')
      .select('*')
      .eq('session_id', sessionId);

    if (error) throw error;
    return data || [];
  }
}

export const trainingRepository = new TrainingRepository();
export default trainingRepository;
