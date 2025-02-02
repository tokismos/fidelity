import { supabase } from '../utils/supabase';

export const incrementPurchase = async ({
  userRewardId,
}: {
  userRewardId: string;
}) => {
  const { data, error } = await supabase.rpc('increment_purchases_by_one', {
    reward_id: userRewardId,
  });
};
