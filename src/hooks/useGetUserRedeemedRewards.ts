import { getUserRedeemedRewards } from "@/api/getUserRedeemedRewards"
import { useQuery } from "@tanstack/react-query"

export const useGetUserRedeemedRewards = ({ userId, storeId }: { userId: string; storeId: string }) => {
  const query = useQuery({
    queryKey: ["useGetUserRedeemedRewards", userId, storeId],
    queryFn: () => getUserRedeemedRewards({ userId, storeId }),
    enabled: !!userId && !!storeId,
  })

  return { ...query, userRedeemedRewards: query.data }
}
