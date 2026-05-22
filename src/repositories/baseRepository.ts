import supabase from '../lib/supabase';

export abstract class BaseRepository<T extends { Row: any; Insert: any; Update: any }> {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  async getById(id: string): Promise<T['Row'] | null> {
    const { data, error } = await supabase
      .from(this.tableName as any)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // Supabase single row not found code
        return null;
      }
      throw error;
    }
    return data;
  }

  async getAll(): Promise<T['Row'][]> {
    const { data, error } = await supabase
      .from(this.tableName as any)
      .select('*');

    if (error) throw error;
    return data || [];
  }

  async create(item: T['Insert']): Promise<T['Row']> {
    const { data, error } = await supabase
      .from(this.tableName as any)
      .insert(item as any)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, item: T['Update']): Promise<T['Row']> {
    const { data, error } = await supabase
      .from(this.tableName as any)
      .update(item as any)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.tableName as any)
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async softDelete(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.tableName as any)
      .update({ deleted_at: new Date().toISOString() } as any)
      .eq('id', id);

    if (error) throw error;
  }
}
export default BaseRepository;
