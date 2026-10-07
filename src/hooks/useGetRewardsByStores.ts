import { getRewardsByStores } from "@/api/getRewardsByStores"
import { queryKeys } from "@/hooks/queryKeys"
import { useQuery } from "@tanstack/react-query"

type Props = {
  storeIds: string[]
}

export const useGetRewardsByStores = ({ storeIds }: Props) =>
  useQuery({
    queryKey: queryKeys.rewards.byStores(storeIds),
    queryFn: () => getRewardsByStores({ storeIds }),
    enabled: storeIds.length > 0,
  })
