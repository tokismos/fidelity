import { Reward, RewardConfig } from '../types';
import { getImageUrl } from '../utils/getImageUrl';
import { supabase } from '../utils/supabase';

export const getRewardById = async ({ rewardId }: { rewardId: string }) => {
  if (!rewardId) return null;

  try {
    const { data, error } = await supabase
      .from('rewards')
      .select('id,title,description,type,config,store_id')
      .eq('id', rewardId)
      .single();
    if (error) throw error;

    const config = data.config as RewardConfig;

    if (config.image_path) {
      return {
        ...data,
        config: {
          ...config,
          image_path: getImageUrl(config.image_path),
        },
      };
    }

    return data as unknown as Reward;
  } catch (error) {
    console.log('Error getting the reward  by id.', error);

    throw error;
  }
};
