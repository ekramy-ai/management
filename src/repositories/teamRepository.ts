import BaseRepository from './baseRepository';
import Database from '../types/database';
import supabase from '../lib/supabase';

type TeamSchema = Database['public']['Tables']['teams'];
type PlayerRow = Database['public']['Tables']['players']['Row'] & {
  player_profiles: Database['public']['Tables']['player_profiles']['Row'] | null;
};

export class TeamRepository extends BaseRepository<TeamSchema> {
  constructor() {
    super('teams');
  }

  // Get active teams for a club, ignoring soft deleted ones
  async getActiveTeamsByClub(clubId: string): Promise<TeamSchema['Row'][]> {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('club_id', clubId)
      .is('deleted_at', null);

    if (error) throw error;
    return data || [];
  }

  // Get teams details along with season info
  async getTeamsWithSeason(clubId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('teams')
      .select('*, seasons(name_en, name_ar, is_active)')
      .eq('club_id', clubId)
      .is('deleted_at', null);

    if (error) throw error;
    return data || [];
  }

  // Get team roster - returns players list with profiles
  async getTeamRoster(teamId: string): Promise<PlayerRow[]> {
    // A player is on a team if their player_statistics shows matches played in the team's season,
    // or if they are mapped to the team. To make it reliable, we query player_statistics or players joined with profiles.
    // Let's query players associated with the club and team
    const { data, error } = await supabase
      .from('players')
      .select('*, player_profiles(*)')
      .is('deleted_at', null);

    if (error) throw error;
    
    // We can filter player statistics to match this team's season
    const { data: statsData, error: statsError } = await supabase
      .from('player_statistics')
      .select('player_id')
      .eq('season_id', (
        // Subquery or first query the team's season id
        await supabase.from('teams').select('season_id').eq('id', teamId).single()
      ).data?.season_id || '');

    if (statsError) throw statsError;

    const teamPlayerIds = new Set(statsData?.map((s: { player_id: string }) => s.player_id) || []);
    return (data || []).filter((p: PlayerRow) => teamPlayerIds.has(p.id)) as PlayerRow[];
  }
}

export const teamRepository = new TeamRepository();
export default teamRepository;
