import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { getStore } from '../api/getStore';

export const useGetStore = () => {
  const { userId } = useAuth();

  return useQuery({
    queryKey: ['getStore', userId],
    queryFn: () => getStore({ userId }),
    enabled: !!userId,
  });
};
