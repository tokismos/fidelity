import { useGetStore } from "./useGetStore"
import { useGetRewardsByStoreId } from "./useGetRewardsByStoreId"

export const useGetRewards = () => {
  const { data: store, error: storeError, isLoading: storeLoading } = useGetStore()

  const query = useGetRewardsByStoreId({ storeId: store?.id })

  return { ...query, rewards: query.data, isLoading: query.isLoading || storeLoading, error: query.error || storeError }
}
