import { getRewardProgress } from "@/api/getRewardProgress"
import { queryKeys } from "@/hooks/queryKeys"
import { Id } from "@/types"
import { useQuery } from "@tanstack/react-query"

type Props = {
  userId: Id
  storeId: Id
}

export const useGetRewardProgress = ({ userId, storeId }: Props) =>
  useQuery({
    queryKey: queryKeys.progress.byUserStore(userId, storeId),
    queryFn: () => getRewardProgress({ userId, storeId }),
    enabled: !!userId && !!storeId,
  })
