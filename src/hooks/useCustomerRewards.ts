import { useGetRewardProgress } from "@/hooks/useGetRewardProgress"
import { useGetRewards } from "@/hooks/useGetRewards"
import { useGetUserStore } from "@/hooks/useGetUserStore"
import { Id, RewardWithProgress } from "@/types"
import { getRewardProgress } from "@/utils/rewards"

type Props = {
  userId: Id
  storeId: Id
}

// A customer's points in one store and where they stand for each active reward
export const useCustomerRewards = ({ userId, storeId }: Props) => {
  const membership = useGetUserStore({ userId, storeId })
  const rewards = useGetRewards({ storeId, activeOnly: true })
  const progress = useGetRewardProgress({ userId, storeId })

  const points = membership.data?.points ?? 0

  const items: RewardWithProgress[] = (rewards.data ?? []).map((reward) => {
    const purchases = progress.data?.find((item) => item.reward_id === reward.id)?.purchases ?? 0
    return { reward, progress: getRewardProgress(reward, points, purchases) }
  })

  const refetch = () => Promise.all([membership.refetch(), rewards.refetch(), progress.refetch()])

  return {
    membership: membership.data,
    points,
    items,
    isLoading: membership.isLoading || rewards.isLoading || progress.isLoading,
    isRefetching: membership.isRefetching || rewards.isRefetching || progress.isRefetching,
    error: membership.error ?? rewards.error ?? progress.error,
    refetch,
  }
}
