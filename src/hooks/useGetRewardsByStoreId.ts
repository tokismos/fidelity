import { getRewards } from "@/api/getRewards"
import { StoreId } from "@/types"
import { useQuery } from "@tanstack/react-query"

export const useGetRewardsByStoreId = ({ storeId }: StoreId) => {
  const query = useQuery({
    queryKey: ["getRewards", storeId],
    queryFn: () => getRewards({ storeId }),
    enabled: !!storeId,
  })

  return {
    ...query,
    rewards: query.data,
    isLoading: query.isLoading,
    error: query.error,
  }
}
