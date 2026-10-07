import { getPromotions } from "@/api/getPromotions"
import { queryKeys } from "@/hooks/queryKeys"
import { useQuery } from "@tanstack/react-query"

type Props = {
  storeIds: string[]
}

export const useGetPromotions = ({ storeIds }: Props) =>
  useQuery({
    queryKey: queryKeys.promotions.byStores(storeIds),
    queryFn: () => getPromotions({ storeIds }),
    enabled: storeIds.length > 0,
  })
