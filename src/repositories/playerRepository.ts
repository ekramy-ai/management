import BaseRepository from './baseRepository';
import Database from '../types/database';
import supabase from '../lib/supabase';

type PlayerSchema = Database['public']['Tables']['players'];
type PlayerProfile = Database['public']['Tables']['player_profiles']['Row'];
type PlayerMedical = Database['public']['Tables']['player_medical']['Row'];
type PlayerContract = Database['public']['Tables']['player_contracts']['Row'];
type PlayerDocument = Database['public']['Tables']['player_documents']['Row'];
type PlayerStats = Database['public']['Tables']['player_statistics']['Row'];

type CompletePlayer = PlayerSchema['Row'] & {
  profile: PlayerProfile | null;
  medical: PlayerMedical[] | null;
  contracts: PlayerContract[] | null;
  documents: PlayerDocument[] | null;
  statistics: PlayerStats[] | null;
};

export class PlayerRepository extends BaseRepository<PlayerSchema> {
  constructor() {
    super('players');
  }

  // Get full player profiles inside a club
  async getPlayersByClub(clubId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('players')
      .select('*, player_profiles(*)')
      .eq('club_id', clubId)
      .is('deleted_at', null);

    if (error) throw error;
    return data || [];
  }

  // Get full player aggregates (contracts, medical, profiles)
  async getCompletePlayerDetail(playerId: string): Promise<CompletePlayer | null> {
    const player = await this.getById(playerId);
    if (!player) return null;

    const { data: profile } = await supabase
      .from('player_profiles')
      .select('*')
      .eq('player_id', playerId)
      .single();

    const { data: medical } = await supabase
      .from('player_medical')
      .select('*')
      .eq('player_id', playerId);

    const { data: contracts } = await supabase
      .from('player_contracts')
      .select('*')
      .eq('player_id', playerId);

    const { data: documents } = await supabase
      .from('player_documents')
      .select('*')
      .eq('player_id', playerId);

    const { data: statistics } = await supabase
      .from('player_statistics')
      .select('*')
      .eq('player_id', playerId);

    return {
      ...player,
      profile: profile || null,
      medical: medical || [],
      contracts: contracts || [],
      documents: documents || [],
      statistics: statistics || []
    };
  }

  // Get player medical files (Only readable by authorized staff/player themselves due to RLS)
  async getPlayerMedicalRecord(playerId: string): Promise<PlayerMedical[]> {
    const { data, error } = await supabase
      .from('player_medical')
      .select('*')
      .eq('player_id', playerId);

    if (error) throw error;
    return data || [];
  }

  // Add/Update Medical record
  async saveMedicalRecord(record: Database['public']['Tables']['player_medical']['Insert']): Promise<PlayerMedical> {
    const { data, error } = await supabase
      .from('player_medical')
      .insert(record)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Add/Update Contract sheet
  async saveContract(contract: Database['public']['Tables']['player_contracts']['Insert']): Promise<PlayerContract> {
    const { data, error } = await supabase
      .from('player_contracts')
      .insert(contract)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Add Document metadata link
  async uploadDocumentRecord(document: Database['public']['Tables']['player_documents']['Insert']): Promise<PlayerDocument> {
    const { data, error } = await supabase
      .from('player_documents')
      .insert(document)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

export const playerRepository = new PlayerRepository();
export default playerRepository;
