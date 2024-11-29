import { redeemReward } from "@/api/redeemReward"
import { Reward } from "@/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"

type Props = { userId: string; rewardId: string; config: Reward["config"]; storeId: string }

export const useRedeemReward = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: redeemReward,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useGetUserRedeemedRewardsIds"] })
    },
  })
  const redeemRewardMutation = ({ userId, rewardId, config, storeId }: Props) => {
    mutation.mutate({ userId, rewardId, config, storeId })
  }

  return { redeemReward: redeemRewardMutation, ...mutation }
}
