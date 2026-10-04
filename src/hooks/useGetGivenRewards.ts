import { getGivenRewards } from "@/api/getGivenRewards"
import { queryKeys } from "@/hooks/queryKeys"
import { Id } from "@/types"
import { useQuery } from "@tanstack/react-query"

type Props = {
  userId: Id
  storeId: Id
}

export const useGetGivenRewards = ({ userId, storeId }: Props) =>
  useQuery({
    queryKey: queryKeys.givenRewards.byUserStore(userId, storeId),
    queryFn: () => getGivenRewards({ userId, storeId }),
    enabled: !!userId && !!storeId,
  })
