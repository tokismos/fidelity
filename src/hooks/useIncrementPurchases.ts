import { useMutation, useQueryClient } from '@tanstack/react-query';

import { incrementPurchase } from '../api/incrementPurchase';

export const useIncrementPurchases = ({
  userRewardId,
}: {
  userRewardId: string;
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => incrementPurchase({ userRewardId }),

    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['useGetUserRewardById', userRewardId],
      }),
  });

  return { incrementPurchase: mutation.mutate, ...mutation };
};
