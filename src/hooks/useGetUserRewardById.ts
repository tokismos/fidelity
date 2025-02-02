import { getUserRewardById } from '../api/getUserRewardById';
import { useQuery } from '@tanstack/react-query';

export const useGetUserRewardById = ({
  userRewardId,
}: {
  userRewardId: string;
}) => {
  const query = useQuery({
    queryKey: ['useGetUserRewardById', userRewardId],

    queryFn: () => getUserRewardById({ userRewardId }),

    enabled: !!userRewardId,
  });

  return { ...query, userReward: query.data };
};
