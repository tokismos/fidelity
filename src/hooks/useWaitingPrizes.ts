import { getWheelSpins } from "@/api/getWheelSpins"
import { useAuth } from "@/hooks/useAuth"
import { queryKeys } from "@/hooks/queryKeys"
import { WheelSpin } from "@/types"
import { pendingPrizes } from "@/utils/wheel"
import { useQueries } from "@tanstack/react-query"

type Props = {
  storeIds: string[]
}

// Wheel prizes the signed in customer won and has not received yet, per store
export const useWaitingPrizes = ({ storeIds }: Props) => {
  const { userId } = useAuth()
  const results = useQueries({
    queries: storeIds.map((storeId) => ({
      queryKey: queryKeys.wheelSpins.byUserStore(userId, storeId),
      queryFn: () => getWheelSpins({ userId, storeId }),
      enabled: !!userId,
    })),
  })

  const byStore: Record<string, WheelSpin[]> = Object.fromEntries(
    storeIds.map((storeId, index) => [storeId, pendingPrizes(results[index]?.data ?? [])]),
  )

  return {
    byStore,
    isRefetching: results.some((result) => result.isRefetching),
    refetch: () => Promise.all(results.map((result) => result.refetch())),
  }
}
