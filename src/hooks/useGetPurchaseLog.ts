import { getPurchaseLog } from "@/api/getPurchaseLog"
import { queryKeys } from "@/hooks/queryKeys"
import { Id } from "@/types"
import { useQuery } from "@tanstack/react-query"

type Props = {
  userId: Id
  storeId: Id
}

export const useGetPurchaseLog = ({ userId, storeId }: Props) =>
  useQuery({
    queryKey: queryKeys.purchaseLog.byUserStore(userId, storeId),
    queryFn: () => getPurchaseLog({ userId, storeId }),
    enabled: !!userId && !!storeId,
  })
