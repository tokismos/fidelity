import { getReward } from "@/api/getReward"
import { queryKeys } from "@/hooks/queryKeys"
import { Id } from "@/types"
import { useQuery } from "@tanstack/react-query"

type Props = {
  rewardId: Id
}

export const useGetReward = ({ rewardId }: Props) =>
  useQuery({
    queryKey: queryKeys.rewards.byId(rewardId),
    queryFn: () => getReward({ rewardId }),
    enabled: !!rewardId,
  })
