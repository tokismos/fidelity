import { getUserProgress } from "@/api/getUserProgress"
import { queryKeys } from "@/hooks/queryKeys"
import { Id } from "@/types"
import { useQuery } from "@tanstack/react-query"

type Props = {
  userId: Id
}

export const useGetUserProgress = ({ userId }: Props) =>
  useQuery({
    queryKey: queryKeys.progress.byUser(userId),
    queryFn: () => getUserProgress({ userId }),
    enabled: !!userId,
  })
