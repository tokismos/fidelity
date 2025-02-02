import { Reward, RewardConfig } from '../types';
import { getImageUrl } from '../utils/getImageUrl';
import { supabase } from '../utils/supabase';

export const getRewards = async ({
  storeId,
}: {
  storeId: string;
}): Promise<Reward[] | null> => {
  if (!storeId) return null;

  try {
    const { data, error } = await supabase
      .from('rewards')
      .select('id,title,description,type,config,store_id')
      .eq('store_id', storeId);

    if (error) throw error;
    return data.map((item) => {
      const reward = item as Reward;

      const config = reward.config as RewardConfig;
      if (config.image_path) {
        return {
          ...reward,
          config: {
            ...config,
            image_path: getImageUrl(config.image_path),
          },
        };
      }
      return reward;
    });
  } catch (error) {
    console.log('Error getting the rewards for store.', error);
    throw error;
  }
};
