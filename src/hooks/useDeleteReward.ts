import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteReward } from '../api/deleteReward';

export const useDeleteReward = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ rewardId }: { rewardId: string }) =>
      deleteReward({ rewardId }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['getRewards'] }),
  });

  return { deleteReward: mutation.mutate, ...mutation };
};
