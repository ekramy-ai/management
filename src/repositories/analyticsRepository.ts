import Database from '../types/database';
import supabase from '../lib/supabase';

type PerformanceMetricSchema = Database['public']['Tables']['performance_metrics'];
type ReportSchema = Database['public']['Tables']['reports'];
type AnalyticsSnapshotSchema = Database['public']['Tables']['analytics_snapshots'];

export class AnalyticsRepository {
  // 1. Database Function RPC Invocation Helpers

  // Get Hitting Efficiency for a player (either season specific or dynamic from matches)
  async getHittingEfficiency(playerId: string, seasonId?: string): Promise<number> {
    const { data, error } = await supabase.rpc('calculate_hitting_efficiency', {
      p_player_id: playerId,
      p_season_id: seasonId || null
    });

    if (error) throw error;
    return data || 0.0;
  }

  // Get Side-Out Percentage for a team or specific match
  async getSideOutPercentage(teamId: string, matchId?: string): Promise<number> {
    const { data, error } = await supabase.rpc('calculate_side_out_percentage', {
      p_team_id: teamId,
      p_match_id: matchId || null
    });

    if (error) throw error;
    return data || 0.0;
  }

  // Get Serve Receive Rating for a player
  async getServeReceiveRating(playerId: string, seasonId?: string): Promise<number> {
    const { data, error } = await supabase.rpc('calculate_serve_receive_rating', {
      p_player_id: playerId,
      p_season_id: seasonId || null
    });

    if (error) throw error;
    return data || 0.0;
  }

  // Get Setter Distribution breakdown (Zone counts & percentages) for a match/set
  async getSetterDistribution(
    matchId: string,
    setNumber?: number
  ): Promise<Database['public']['Functions']['get_setter_distribution']['Returns']> {
    const { data, error } = await supabase.rpc('get_setter_distribution', {
      p_match_id: matchId,
      p_set_number: setNumber || null
    });

    if (error) throw error;
    return data || [];
  }

  // 2. Athletic / Performance Testing Metrics (Vertical Jump, Spike Reach, etc.)

  // Save athletic testing results for a player
  async savePerformanceMetric(metric: PerformanceMetricSchema['Insert']): Promise<PerformanceMetricSchema['Row']> {
    const { data, error } = await supabase
      .from('performance_metrics')
      .insert(metric)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Retrieve performance metrics for a player
  async getPlayerPerformanceMetrics(playerId: string, metricType?: string): Promise<PerformanceMetricSchema['Row'][]> {
    let query = supabase
      .from('performance_metrics')
      .select('*')
      .eq('player_id', playerId)
      .order('date', { ascending: false });

    if (metricType) {
      query = query.eq('metric_type', metricType);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  // 3. Club Reports & Snapshots Management

  // Save generated analytical report
  async saveReport(report: ReportSchema['Insert']): Promise<ReportSchema['Row']> {
    const { data, error } = await supabase
      .from('reports')
      .insert(report)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Fetch reports generated for a club
  async getReportsByClub(clubId: string, reportType?: string): Promise<ReportSchema['Row'][]> {
    let query = supabase
      .from('reports')
      .select('*')
      .eq('club_id', clubId)
      .order('created_at', { ascending: false });

    if (reportType) {
      query = query.eq('report_type', reportType);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  // Save analytics snapshot (metric timeline tracking)
  async saveSnapshot(snapshot: AnalyticsSnapshotSchema['Insert']): Promise<AnalyticsSnapshotSchema['Row']> {
    const { data, error } = await supabase
      .from('analytics_snapshots')
      .insert(snapshot)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Fetch snapshots for a specific metric in a club
  async getSnapshots(clubId: string, metricName: string): Promise<AnalyticsSnapshotSchema['Row'][]> {
    const { data, error } = await supabase
      .from('analytics_snapshots')
      .select('*')
      .eq('club_id', clubId)
      .eq('metric_name', metricName)
      .order('snapshot_date', { ascending: true });

    if (error) throw error;
    return data || [];
  }
}

export const analyticsRepository = new AnalyticsRepository();
export default analyticsRepository;
