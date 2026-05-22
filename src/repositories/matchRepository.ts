import BaseRepository from './baseRepository';
import Database from '../types/database';
import supabase from '../lib/supabase';

type MatchSchema = Database['public']['Tables']['matches'];
type SetSchema = Database['public']['Tables']['match_sets'];
type LineupSchema = Database['public']['Tables']['match_lineups'];
type RotationSchema = Database['public']['Tables']['match_rotations'];
type StatSchema = Database['public']['Tables']['match_statistics'];
type RallySchema = Database['public']['Tables']['rally_tracking'];

export class MatchRepository extends BaseRepository<MatchSchema> {
  constructor() {
    super('matches');
  }

  // Get all matches for a team
  async getMatchesByTeam(teamId: string): Promise<MatchSchema['Row'][]> {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .eq('team_id', teamId)
      .is('deleted_at', null);

    if (error) throw error;
    return data || [];
  }

  // Save set results (e.g. Set 1: 25-22)
  async saveSetResult(setResult: SetSchema['Insert']): Promise<SetSchema['Row']> {
    const { data, error } = await supabase
      .from('match_sets')
      .insert(setResult)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get set scores for a match
  async getMatchSets(matchId: string): Promise<SetSchema['Row'][]> {
    const { data, error } = await supabase
      .from('match_sets')
      .select('*')
      .eq('match_id', matchId)
      .order('set_number', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  // Save set starting lineup (Setter in Pos 1, Hitter in Pos 4, etc.)
  async saveLineup(lineup: LineupSchema['Insert']): Promise<LineupSchema['Row']> {
    const { data, error } = await supabase
      .from('match_lineups')
      .insert(lineup)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Log a volleyball event action (Kill, Ace, Reception quality 3, etc.)
  async logMatchAction(action: StatSchema['Insert']): Promise<StatSchema['Row']> {
    const { data, error } = await supabase
      .from('match_statistics')
      .insert(action)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Log a rally (serving team, side-out status, winner)
  async logRally(rally: RallySchema['Insert']): Promise<RallySchema['Row']> {
    const { data, error } = await supabase
      .from('rally_tracking')
      .insert(rally)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get match statistics for analysis
  async getMatchStatistics(matchId: string): Promise<StatSchema['Row'][]> {
    const { data, error } = await supabase
      .from('match_statistics')
      .select('*')
      .eq('match_id', matchId);

    if (error) throw error;
    return data || [];
  }

  // Get rally sequences for a match
  async getMatchRallies(matchId: string): Promise<RallySchema['Row'][]> {
    const { data, error } = await supabase
      .from('rally_tracking')
      .select('*')
      .eq('match_id', matchId)
      .order('set_number', { ascending: true })
      .order('rally_number', { ascending: true });

    if (error) throw error;
    return data || [];
  }
}

export const matchRepository = new MatchRepository();
export default matchRepository;
