import { getUserStore } from "@/api/getUserStore"
import { queryKeys } from "@/hooks/queryKeys"
import { Id } from "@/types"
import { useQuery } from "@tanstack/react-query"

type Props = {
  userId: Id
  storeId: Id
}

export const useGetUserStore = ({ userId, storeId }: Props) =>
  useQuery({
    queryKey: queryKeys.userStores.byUserStore(userId, storeId),
    queryFn: () => getUserStore({ userId, storeId }),
    enabled: !!userId && !!storeId,
  })
