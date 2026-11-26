import { getWheelSlices } from "@/api/getWheelSlices"
import { queryKeys } from "@/hooks/queryKeys"
import { Id } from "@/types"
import { useQuery } from "@tanstack/react-query"

type Props = {
  storeId: Id
}

export const useGetWheelSlices = ({ storeId }: Props) =>
  useQuery({
    queryKey: queryKeys.wheelSlices.byStore(storeId),
    queryFn: () => getWheelSlices({ storeId }),
    enabled: !!storeId,
  })
