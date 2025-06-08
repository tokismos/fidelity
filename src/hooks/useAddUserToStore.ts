import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useGetStore } from './useGetStore';
import { addUserToStore } from '../api/addUserToStore';
import { Id } from '../types';

export const useAddUserToStore = () => {
  const queryClient = useQueryClient();
  const { data: store, error, isLoading } = useGetStore();

  const mutation = useMutation({
    mutationFn: ({ userId }: { userId: Id }) => {
      if (!store) {
        throw new Error('Error, there is no store.');
      }
      return addUserToStore({ userId, storeId: store.id });
    },

    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['getUserPoints'] }),
  });

  const addNewUserToStore = ({ userId }: { userId: Id }) => {
    if (isLoading) {
      console.log('Fetching the store is still loading');
      return;
    }
    if (error) {
      console.log('Error while getting the store');
      return;
    }

    mutation.mutate({ userId });
  };
  return { addUserToStore: addNewUserToStore, store, ...mutation };
};
