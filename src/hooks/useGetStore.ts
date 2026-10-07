import { getStore } from "@/api/getStore"
import { useAuth } from "@/hooks/useAuth"
import { queryKeys } from "@/hooks/queryKeys"
import { useQuery } from "@tanstack/react-query"

// The store owned by the signed in admin
export const useGetStore = () => {
  const { userId } = useAuth()

  return useQuery({
    queryKey: queryKeys.store.byOwner(userId),
    queryFn: () => getStore({ userId }),
    enabled: !!userId,
  })
}
