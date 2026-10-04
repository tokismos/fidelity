import { getUserStores } from "@/api/getUserStores"
import { useAuth } from "@/hooks/useAuth"
import { queryKeys } from "@/hooks/queryKeys"
import { useQuery } from "@tanstack/react-query"

// Stores where the signed in customer has a card
export const useGetUserStores = () => {
  const { userId } = useAuth()

  return useQuery({
    queryKey: queryKeys.userStores.byUser(userId),
    queryFn: () => getUserStores({ userId }),
    enabled: !!userId,
  })
}
