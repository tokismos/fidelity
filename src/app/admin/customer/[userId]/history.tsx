import { ErrorView } from "@/components/ErrorView"
import { HistoryList } from "@/components/history/HistoryList"
import { LoadingView } from "@/components/LoadingView"
import { NavBar } from "@/components/ui/NavBar"
import { useCustomerTimeline } from "@/hooks/useCustomerTimeline"
import { useGetStore } from "@/hooks/useGetStore"
import { useGetUserStore } from "@/hooks/useGetUserStore"
import { useGetWheelSpins } from "@/hooks/useGetWheelSpins"
import { customerName } from "@/utils/text"
import { useLocalSearchParams } from "expo-router"
import { View } from "react-native"

// "Maya Okafor" -> "Maya", "maya.okafor" stays as it is
const firstName = (name: string) => name.split(" ")[0] || name

export default function CustomerHistory() {
  const { userId } = useLocalSearchParams<{ userId: string }>()

  const store = useGetStore()
  const storeId = store.data?.id
  const membership = useGetUserStore({ userId, storeId })
  const activity = useCustomerTimeline({ userId, storeId })
  const spins = useGetWheelSpins({ userId, storeId })

  if (store.isLoading || membership.isLoading) return <LoadingView />
  if (store.error || membership.error) return <ErrorView message={(store.error ?? membership.error)?.message} />

  const name = firstName(customerName(membership.data?.profile))

  return (
    <View className="flex-1 bg-ground">
      <NavBar title={`${name}'s history`} />
      <HistoryList
        timeline={activity.timeline}
        spins={spins.data ?? []}
        onRefresh={() => Promise.all([activity.refetch(), spins.refetch()])}
        refreshing={activity.isRefetching || spins.isRefetching}
      />
    </View>
  )
}
