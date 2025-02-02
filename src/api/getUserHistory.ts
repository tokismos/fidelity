import { Id } from '../types';
import { supabase } from '../utils/supabase';

export const getUserHistory = async ({
  userId,
  storeId,
}: {
  userId: Id;
  storeId: Id;
}) => {
  if (!userId || !storeId) return null;

  try {
    const { data, error } = await supabase
      .from('history')
      .select('*')
      .eq('user_id', userId)
      .eq('store_id', storeId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data;
  } catch (error) {
    console.log('Error getting the history', error);

    throw error;
  }
};
