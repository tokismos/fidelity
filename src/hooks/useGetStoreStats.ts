import { getStoreStats } from "@/api/getStoreStats"
import { queryKeys } from "@/hooks/queryKeys"
import { Id } from "@/types"
import { useQuery } from "@tanstack/react-query"

type Props = {
  storeId: Id
}

export const useGetStoreStats = ({ storeId }: Props) =>
  useQuery({
    queryKey: queryKeys.store.stats(storeId),
    queryFn: () => getStoreStats({ storeId }),
    enabled: !!storeId,
  })
