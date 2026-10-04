import { getStoreCustomers } from "@/api/getStoreCustomers"
import { queryKeys } from "@/hooks/queryKeys"
import { Id } from "@/types"
import { useQuery } from "@tanstack/react-query"

type Props = {
  storeId: Id
}

export const useGetStoreCustomers = ({ storeId }: Props) =>
  useQuery({
    queryKey: queryKeys.customers.byStore(storeId),
    queryFn: () => getStoreCustomers({ storeId }),
    enabled: !!storeId,
  })
