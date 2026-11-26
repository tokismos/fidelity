import { getRecentCustomers } from "@/api/getRecentCustomers"
import { useGetStore } from "@/hooks/useGetStore"
import { queryKeys } from "@/hooks/queryKeys"
import { useQuery } from "@tanstack/react-query"

// The latest customers served in the signed in admin's store
export const useGetRecentCustomers = (limit = 3) => {
  const { data: store } = useGetStore()
  const storeId = store?.id

  return useQuery({
    queryKey: queryKeys.customers.recent(storeId, limit),
    queryFn: () => getRecentCustomers({ storeId, limit }),
    enabled: !!storeId,
  })
}
