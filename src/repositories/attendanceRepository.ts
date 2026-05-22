import BaseRepository from './baseRepository';
import Database from '../types/database';
import supabase from '../lib/supabase';

type AttendanceSessionSchema = Database['public']['Tables']['attendance_sessions'];
type AttendanceRecordSchema = Database['public']['Tables']['attendance_records'];

export class AttendanceRepository extends BaseRepository<AttendanceSessionSchema> {
  constructor() {
    super('attendance_sessions');
  }

  // Create an attendance session (e.g. for a training session or a match)
  async createAttendanceSession(
    clubId: string,
    sessionType: 'Training' | 'Match',
    referenceId: string,
    date: string,
    takenByUserId: string
  ): Promise<AttendanceSessionSchema['Row']> {
    const { data, error } = await supabase
      .from('attendance_sessions')
      .insert({
        club_id: clubId,
        session_type: sessionType,
        reference_id: referenceId,
        date,
        taken_by: takenByUserId
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Save/Update multiple attendance records at once
  async saveAttendanceRecords(
    records: AttendanceRecordSchema['Insert'][]
  ): Promise<AttendanceRecordSchema['Row'][]> {
    const { data, error } = await supabase
      .from('attendance_records')
      .insert(records)
      .select();

    if (error) throw error;
    return data || [];
  }

  // Get all attendance logs for a specific session ID (with profiles info)
  async getSessionRecords(sessionId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('attendance_records')
      .select('*, player_profiles:player_id(*), staff_details:staff_id(*)')
      .eq('session_id', sessionId);

    if (error) throw error;
    return data || [];
  }

  // Fetch monthly attendance report using postgres function
  async getMonthlyReport(
    teamId: string,
    startDate: string,
    endDate: string
  ): Promise<Database['public']['Functions']['calculate_monthly_attendance_report']['Returns']> {
    const { data, error } = await supabase
      .rpc('calculate_monthly_attendance_report', {
        p_team_id: teamId,
        p_start_date: startDate,
        p_end_date: endDate
      });

    if (error) throw error;
    return data || [];
  }

  // Fetch players with repeated unexcused absences using postgres function
  async getRepeatedAbsences(threshold: number): Promise<Database['public']['Functions']['get_repeated_absences']['Returns']> {
    const { data, error } = await supabase
      .rpc('get_repeated_absences', {
        p_threshold: threshold
      });

    if (error) throw error;
    return data || [];
  }
}

export const attendanceRepository = new AttendanceRepository();
export default attendanceRepository;
