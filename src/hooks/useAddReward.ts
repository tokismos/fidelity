import { useMutation, useQueryClient } from '@tanstack/react-query';

import { addReward } from '../api/addReward';
import { useGetStore } from './useGetStore';
import { Reward } from '../types';

export const useAddReward = () => {
  const queryClient = useQueryClient();
  const { data: store, error, isLoading } = useGetStore();

  const mutation = useMutation({
    mutationFn: ({ title, description, config, type }: Reward) => {
      if (!store) {
        throw new Error('Error, there is no store.');
      }
      return addReward({ title, description, storeId: store.id, config, type });
    },

    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['getRewards'] }),
  });

  const addNewReward = ({ title, description, config, type }: Reward) => {
    if (isLoading) {
      console.log('Fetching the store is still loading');
      return;
    }
    if (error) {
      console.log('Error while getting the store');
      return;
    }

    mutation.mutate({ title, description, config, type });
  };
  return { addReward: addNewReward, ...mutation };
};
