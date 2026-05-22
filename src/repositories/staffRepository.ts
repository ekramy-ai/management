import BaseRepository from './baseRepository';
import Database from '../types/database';
import supabase from '../lib/supabase';

type StaffSchema = Database['public']['Tables']['staff'];
type StaffRoleSchema = Database['public']['Tables']['staff_roles'];
type StaffAttendanceSchema = Database['public']['Tables']['staff_attendance'];
type StaffDocumentSchema = Database['public']['Tables']['staff_documents'];

export class StaffRepository extends BaseRepository<StaffSchema> {
  constructor() {
    super('staff');
  }

  // Get staff roster for a club with their roles
  async getStaffByClub(clubId: string): Promise<(StaffSchema['Row'] & { staff_roles: StaffRoleSchema['Row'][] })[]> {
    const { data, error } = await supabase
      .from('staff')
      .select('*, staff_roles(*)')
      .eq('club_id', clubId)
      .is('deleted_at', null);

    if (error) throw error;
    return (data || []) as any;
  }

  // Get complete staff details including roles, attendance logs, and documents
  async getCompleteStaffDetail(staffId: string): Promise<
    | (StaffSchema['Row'] & {
        roles: StaffRoleSchema['Row'][];
        attendance: StaffAttendanceSchema['Row'][];
        documents: StaffDocumentSchema['Row'][];
      })
    | null
  > {
    const staff = await this.getById(staffId);
    if (!staff) return null;

    const { data: roles } = await supabase
      .from('staff_roles')
      .select('*')
      .eq('staff_id', staffId);

    const { data: attendance } = await supabase
      .from('staff_attendance')
      .select('*')
      .eq('staff_id', staffId)
      .order('date', { ascending: false });

    const { data: documents } = await supabase
      .from('staff_documents')
      .select('*')
      .eq('staff_id', staffId);

    return {
      ...staff,
      roles: roles || [],
      attendance: attendance || [],
      documents: documents || []
    };
  }

  // Assign role to a staff member
  async assignStaffRole(role: StaffRoleSchema['Insert']): Promise<StaffRoleSchema['Row']> {
    const { data, error } = await supabase
      .from('staff_roles')
      .insert(role)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Remove a role assignment
  async removeStaffRole(roleId: string): Promise<void> {
    const { error } = await supabase
      .from('staff_roles')
      .delete()
      .eq('id', roleId);

    if (error) throw error;
  }

  // Log staff attendance record
  async saveStaffAttendance(attendance: StaffAttendanceSchema['Insert']): Promise<StaffAttendanceSchema['Row']> {
    const { data, error } = await supabase
      .from('staff_attendance')
      .insert(attendance)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Save/Upload staff document metadata
  async saveStaffDocument(document: StaffDocumentSchema['Insert']): Promise<StaffDocumentSchema['Row']> {
    const { data, error } = await supabase
      .from('staff_documents')
      .insert(document)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

export const staffRepository = new StaffRepository();
export default staffRepository;
