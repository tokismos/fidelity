import { getHistory } from "@/api/getHistory"
import { queryKeys } from "@/hooks/queryKeys"
import { Id } from "@/types"
import { useQuery } from "@tanstack/react-query"

type Props = {
  userId: Id
  storeId: Id
}

export const useGetHistory = ({ userId, storeId }: Props) =>
  useQuery({
    queryKey: queryKeys.history.byUserStore(userId, storeId),
    queryFn: () => getHistory({ userId, storeId }),
    enabled: !!userId && !!storeId,
  })
