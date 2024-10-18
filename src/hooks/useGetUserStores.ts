import { useQuery } from "@tanstack/react-query"
import { useAuth } from "./useAuth"
import { getUserStores } from "@/api/getUserStores"

export const useGetUserStores = () => {
  const { userId } = useAuth()

  const query = useQuery({
    queryKey: ["getUserStores", userId],
    queryFn: () => getUserStores({ userId }),
    enabled: !!userId,
  })

  return { ...query, userStores: query.data }
}
