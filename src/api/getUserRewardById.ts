import { FetchedUserReward, UserReward } from '../types';
import { supabase } from '../utils/supabase';

export const getUserRewardById = async ({
  userRewardId,
}: {
  userRewardId: string;
}): Promise<UserReward | null> => {
  if (!userRewardId) return null;

  try {
    const { data, error } = await supabase
      .from('user_rewards')
      .select('id,config,status,reward:rewards!inner(title,description,type)')
      .eq('id', userRewardId)
      .returns<FetchedUserReward[]>()
      .single();

    if (error) throw error;

    const { id, config, status } = data;
    return {
      id,
      config,
      status,
      title: data.reward?.title,
      description: data.reward?.description,
      type: data.reward?.type,
    };
  } catch (error) {
    console.log('Error getting user reward', error);
    throw error;
  }
};
