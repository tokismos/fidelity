import { getUserRewardByRewardId } from "@/api/getUserRewardByRewardId"
import { useQuery } from "@tanstack/react-query"

export const useGetUserRewardByRewardId = ({ rewardId }: { rewardId: string }) => {
  const query = useQuery({
    queryKey: ["useGetUserRewardByRewardId", rewardId],

    queryFn: () => getUserRewardByRewardId({ rewardId }),

    enabled: !!rewardId,
  })

  return { ...query, userReward: query.data }
}
