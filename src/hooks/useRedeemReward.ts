import { redeemReward } from "@/api/redeemReward"
import { Reward } from "@/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"

type Props = { userId: string; rewardId: string; config: Reward["config"] }

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
