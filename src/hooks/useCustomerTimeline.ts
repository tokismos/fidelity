import { useGetGivenRewards } from "@/hooks/useGetGivenRewards"
import { useGetHistory } from "@/hooks/useGetHistory"
import { useGetPurchaseLog } from "@/hooks/useGetPurchaseLog"
import { Id } from "@/types"
import { buildTimeline } from "@/utils/timeline"

type Props = {
  userId: Id
  storeId: Id
}

// Everything that happened to a customer in one store, newest first
export const useCustomerTimeline = ({ userId, storeId }: Props) => {
  const history = useGetHistory({ userId, storeId })
  const givenRewards = useGetGivenRewards({ userId, storeId })
  const purchases = useGetPurchaseLog({ userId, storeId })

  const timeline = buildTimeline({
    history: history.data ?? [],
    givenRewards: givenRewards.data ?? [],
    purchases: purchases.data ?? [],
  })

  return {
    timeline,
    refetch: () => Promise.all([history.refetch(), givenRewards.refetch(), purchases.refetch()]),
    isRefetching: history.isRefetching || givenRewards.isRefetching || purchases.isRefetching,
  }
}
