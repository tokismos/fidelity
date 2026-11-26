import { HistoryList } from "@/components/history/HistoryList"
import { NavBar } from "@/components/ui/NavBar"
import { Screen } from "@/components/ui/Screen"
import { useAuth } from "@/hooks/useAuth"
import { useCustomerTimeline } from "@/hooks/useCustomerTimeline"
import { useGetUserStores } from "@/hooks/useGetUserStores"
import { useGetWheelSpins } from "@/hooks/useGetWheelSpins"
import { useLocalSearchParams } from "expo-router"

export default function UserStoreHistory() {
  const { storeId } = useLocalSearchParams<{ storeId: string }>()
  const { userId } = useAuth()

  const { data: userStores } = useGetUserStores()
  const { timeline, refetch, isRefetching } = useCustomerTimeline({ userId, storeId })
  const spins = useGetWheelSpins({ userId, storeId })

  const storeName = userStores?.find((userStore) => userStore.store.id === storeId)?.store.name

  return (
    <Screen>
      <NavBar title="History" subtitle={storeName} />
      <HistoryList
        timeline={timeline}
        spins={spins.data ?? []}
        onRefresh={() => Promise.all([refetch(), spins.refetch()])}
        refreshing={isRefetching || spins.isRefetching}
      />
    </Screen>
  )
}
