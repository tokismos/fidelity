import { getTodayStats } from "@/api/getTodayStats"
import { useGetStore } from "@/hooks/useGetStore"
import { useNow } from "@/hooks/useNow"
import { queryKeys } from "@/hooks/queryKeys"
import { deviceTimeZone, startOfDay } from "@/utils/time"
import { useQuery } from "@tanstack/react-query"

// Today's numbers of the signed in admin's store, the day counted in the store time zone
export const useGetTodayStats = () => {
  const { data: store } = useGetStore()
  const storeId = store?.id
  // Checked every minute, so a new day starts a new count
  const now = useNow(60000)
  const since = startOfDay(now, store?.timezone ?? deviceTimeZone())

  return useQuery({
    queryKey: queryKeys.todayStats.byStore(storeId, since),
    queryFn: () => getTodayStats({ storeId, since }),
    enabled: !!storeId,
  })
}
