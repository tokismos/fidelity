import { getWheelSpins } from "@/api/getWheelSpins"
import { queryKeys } from "@/hooks/queryKeys"
import { Id } from "@/types"
import { useQuery } from "@tanstack/react-query"

type Props = {
  userId: Id
  storeId: Id
}

export const useGetWheelSpins = ({ userId, storeId }: Props) =>
  useQuery({
    queryKey: queryKeys.wheelSpins.byUserStore(userId, storeId),
    queryFn: () => getWheelSpins({ userId, storeId }),
    enabled: !!userId && !!storeId,
  })
