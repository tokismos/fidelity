import { getUserRedeemedRewardIds } from '../api/getUserRedeemedRewardIds';
import { useQuery } from '@tanstack/react-query';

export const useGetUserRedeemedRewardIds = ({
  userId,
  storeId,
}: {
  userId: string;
  storeId: string;
}) => {
  const query = useQuery({
    queryKey: ['useGetUserRedeemedRewardIds', userId, storeId],
    queryFn: () => getUserRedeemedRewardIds({ userId, storeId }),
    enabled: !!userId && !!storeId,
  });

  return { ...query, userRedeemedRewards: query.data };
};
