import { supabase } from '../utils/supabase';

type Props = {
  rewardId: string;
};

export const deleteReward = async ({ rewardId }: Props) => {
  if (!rewardId) {
    throw new Error('Reward Id is required to delete ');
  }
  try {
    const { error } = await supabase
      .from('rewards')
      .delete()
      .eq('id', rewardId);
    if (error) {
      throw error;
    }
  } catch (error) {
    console.log('Error deleting reward :', error);
    throw error;
  }
};
