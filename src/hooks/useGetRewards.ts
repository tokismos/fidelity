import { getRewards } from "@/api/getRewards"
import { queryKeys } from "@/hooks/queryKeys"
import { Id } from "@/types"
import { useQuery } from "@tanstack/react-query"

type Props = {
  storeId: Id
  activeOnly: boolean
}

export const useGetRewards = ({ storeId, activeOnly }: Props) =>
  useQuery({
    queryKey: queryKeys.rewards.byStore(storeId, activeOnly),
    queryFn: () => getRewards({ storeId, activeOnly }),
    enabled: !!storeId,
  })
