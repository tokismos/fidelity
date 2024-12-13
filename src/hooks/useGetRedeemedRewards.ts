import { getRedeemedRewards } from "@/api/getRedeemedRewards"
import { useQuery } from "@tanstack/react-query"

export function useGetRedeemedRewards({ userId, storeId }: { userId: string; storeId: string }) {
  return useQuery({
    queryKey: ["useGetRedeemedRewards", userId, storeId],
    queryFn: () => getRedeemedRewards({ userId, storeId }),
    enabled: !!userId && !!storeId,
  })
}
