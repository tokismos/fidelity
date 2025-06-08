import { updateReward } from '../api/updateReward';
import { Reward } from '../types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useGetStore } from './useGetStore';

type Props = {
  updatedReward: Reward;
};

export const useUpdateReward = ({ rewardId }: { rewardId: string }) => {
  const queryClient = useQueryClient();
  const { data: store } = useGetStore();

  const mutation = useMutation({
    mutationFn: async ({ updatedReward }: Props) => {
      if (!rewardId) {
        throw new Error('rewardId is required');
      }

      return updateReward({ rewardId, updatedReward });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getRewards', store?.id] });
    },
  });

  const updateRewardMutation = ({ updatedReward }: Props) => {
    mutation.mutate({ updatedReward });
  };

  return {
    updateReward: updateRewardMutation,
    ...mutation,
  };
};
