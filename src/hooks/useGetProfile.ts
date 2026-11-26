import { getProfile } from "@/api/getProfile"
import { useAuth } from "@/hooks/useAuth"
import { queryKeys } from "@/hooks/queryKeys"
import { useQuery } from "@tanstack/react-query"

// The signed in user's profile
export const useGetProfile = () => {
  const { userId } = useAuth()

  return useQuery({
    queryKey: queryKeys.profile.byUser(userId),
    queryFn: () => getProfile({ userId }),
    enabled: !!userId,
  })
}
