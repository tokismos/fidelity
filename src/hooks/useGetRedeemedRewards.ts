import { useQuery } from "@tanstack/react-query"
import { getRedeemedRewards } from "./getRedeemedRewards"

export function useGetRedeemedRewards({ userId, storeId }: { userId: string; storeId: string }) {
  return useQuery({
    queryKey: ["useGetRedeemedRewards", userId, storeId],
    queryFn: () => getRedeemedRewards({ userId, storeId }),
    enabled: !!userId && !!storeId,
  })
}
