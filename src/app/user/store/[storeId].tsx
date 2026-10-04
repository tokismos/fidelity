import { EmptyState } from "@/components/EmptyState"
import { ErrorView } from "@/components/ErrorView"
import { LoadingView } from "@/components/LoadingView"
import { RewardProgressCard } from "@/components/RewardProgressCard"
import { StorePageHeader, StorePageSection } from "@/components/StorePageHeader"
import { TimelineItem } from "@/components/TimelineItem"
import { useAuth } from "@/hooks/useAuth"
import { useCustomerRewards } from "@/hooks/useCustomerRewards"
import { useGetGivenRewards } from "@/hooks/useGetGivenRewards"
import { useGetHistory } from "@/hooks/useGetHistory"
import { useGetUserStores } from "@/hooks/useGetUserStores"
import { buildTimeline } from "@/utils/timeline"
import { FlashList } from "@shopify/flash-list"
import { Stack, useLocalSearchParams } from "expo-router"
import { useState } from "react"

export default function UserStore() {
  const { storeId } = useLocalSearchParams<{ storeId: string }>()
  const { userId } = useAuth()
  const [section, setSection] = useState<StorePageSection>("rewards")

  const { data: userStores } = useGetUserStores()
  const customer = useCustomerRewards({ userId, storeId })
  const history = useGetHistory({ userId, storeId })
  const givenRewards = useGetGivenRewards({ userId, storeId })

  const store = userStores?.find((userStore) => userStore.store.id === storeId)?.store

  if (customer.isLoading) return <LoadingView />
  if (customer.error) return <ErrorView message={customer.error.message} />

  const refresh = () => Promise.all([customer.refetch(), history.refetch(), givenRewards.refetch()])
  const isRefreshing = customer.isRefetching || history.isRefetching || givenRewards.isRefetching

  const header = (
    <>
      <Stack.Screen options={{ title: store?.name ?? "Store" }} />
      <StorePageHeader store={store} points={customer.points} section={section} onSectionChange={setSection} />
    </>
  )

  if (section === "history") {
    return (
      <FlashList
        className="bg-gray-50"
        contentContainerStyle={{ padding: 16 }}
        data={buildTimeline(history.data ?? [], givenRewards.data ?? [])}
        keyExtractor={(item) => `${item.kind}-${item.id}`}
        renderItem={({ item }) => <TimelineItem entry={item} />}
        ListHeaderComponent={header}
        ListEmptyComponent={<EmptyState icon="time-outline" title="No activity yet" />}
        onRefresh={refresh}
        refreshing={isRefreshing}
      />
    )
  }

  return (
    <FlashList
      className="bg-gray-50"
      contentContainerStyle={{ padding: 16 }}
      data={customer.items}
      keyExtractor={(item) => item.reward.id}
      renderItem={({ item }) => (
        <RewardProgressCard
          item={item}
          readyLabel="Ready!"
          href={{ pathname: "/user/reward/[rewardId]", params: { rewardId: item.reward.id } }}
        />
      )}
      ListHeaderComponent={header}
      ListEmptyComponent={<EmptyState icon="gift-outline" title="No rewards yet" />}
      onRefresh={refresh}
      refreshing={isRefreshing}
    />
  )
}
