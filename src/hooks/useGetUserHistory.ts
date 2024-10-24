import { useQuery } from "@tanstack/react-query"

import { getUserHistory } from "@/api/getUserHistory"
import { Id } from "@/types"

export const useGetUserHistory = ({ userId, storeId }: { userId: Id; storeId: Id }) => {
  const query = useQuery({
    queryKey: ["getUserHistory", { userId, storeId }],
    queryFn: () => getUserHistory({ userId, storeId }),
    enabled: !!userId && !!storeId,
  })

  return { ...query, userHistory: query.data }
}
