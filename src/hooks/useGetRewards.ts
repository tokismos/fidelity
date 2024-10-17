import { useQuery } from "@tanstack/react-query"

import { useGetStore } from "./useGetStore"
import { getRewards } from "@/api/getRewards"

export const useGetRewards = () => {
  const { data: store, error: storeError, isLoading: storeLoading } = useGetStore()
  const storeId = store?.id

  const query = useQuery({
    queryKey: ["getRewards", storeId],
    queryFn: () => getRewards({ storeId: storeId ?? null }),
    enabled: !!storeId,
  })

  return { ...query, rewards: query.data, isLoading: query.isLoading || storeLoading, error: query.error || storeError }
}
