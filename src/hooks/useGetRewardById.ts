import { getRewardById } from '../api/getRewardById';
import { useQuery } from '@tanstack/react-query';

export const useGetRewardById = ({ rewardId }: { rewardId: string }) => {
  const query = useQuery({
    queryKey: ['getRewardById', rewardId],
    queryFn: () => getRewardById({ rewardId }),
    enabled: !!rewardId,
  });

  return {
    ...query,
    rewardById: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
};
