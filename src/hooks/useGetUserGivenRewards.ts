import { getUserGivenRewards } from "@/api/getUserGivenRewards"
import { queryKeys } from "@/hooks/queryKeys"
import { Id } from "@/types"
import { useQuery } from "@tanstack/react-query"

type Props = {
  userId: Id
}

export const useGetUserGivenRewards = ({ userId }: Props) =>
  useQuery({
    queryKey: queryKeys.givenRewards.byUser(userId),
    queryFn: () => getUserGivenRewards({ userId }),
    enabled: !!userId,
  })
