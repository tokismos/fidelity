import { Id, Stores } from '../types';
import { supabase } from '../utils/supabase';

type Props = {
  storeName: Stores['name'];
  userId: Id;
};

export const addStore = async ({ storeName, userId }: Props) => {
  if (!userId) {
    throw new Error('User ID is required to add a store');
  }
  try {
    const { data, error } = await supabase
      .from('stores')
      .insert({ name: storeName, owner_id: userId })
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.log('Error adding the store:', error);
    throw error;
  }
};
