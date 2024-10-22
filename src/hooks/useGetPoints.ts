import { useGetStore } from "./useGetStore"
import { useQuery } from "@tanstack/react-query"
import { getUserPoints } from "@/api/getUserPoints"
import { Id } from "@/types"

export const useGetPoints = ({ userId }: { userId: Id }) => {
  const { data: store, error: storeError, isLoading: storeLoading } = useGetStore()

  const storeId = store?.id ?? null

  const query = useQuery({
    queryKey: ["getUserPoints", storeId],
    queryFn: () => getUserPoints({ userId, storeId }),
    enabled: !!storeId && !!userId,
  })

  return {
    ...query,
    userPoints: query.data?.points,
    isLoading: query.isLoading || storeLoading,
    error: query.error || storeError,
  }
}
