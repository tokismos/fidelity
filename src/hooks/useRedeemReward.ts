import { redeemReward } from "@/api/redeemReward"
import { Id, Reward, REWARD_TYPES } from "@/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"

type Props = { userId: string; rewardId: string; config: Reward<REWARD_TYPES>["config"] }

export const useRedeemReward = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: redeemReward,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useGetUserRedeemedRewards"] })
    },
  })
  const redeemRewardMutation = ({ userId, rewardId, config }: Props) => {
    mutation.mutate({ userId, rewardId, config })
  }

  return { redeemReward: redeemRewardMutation, ...mutation }
}
