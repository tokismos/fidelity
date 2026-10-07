import { CustomerHeader, CustomerSection } from "@/components/CustomerHeader"
import { EmptyState } from "@/components/EmptyState"
import { ErrorView } from "@/components/ErrorView"
import { LoadingView } from "@/components/LoadingView"
import { NotACustomerCard } from "@/components/NotACustomerCard"
import { RewardProgressCard } from "@/components/RewardProgressCard"
import { TimelineItem } from "@/components/TimelineItem"
import { useAddCustomer } from "@/hooks/useAddCustomer"
import { useCustomerRewards } from "@/hooks/useCustomerRewards"
import { useCustomerTimeline } from "@/hooks/useCustomerTimeline"
import { useGetPromotions } from "@/hooks/useGetPromotions"
import { useGetStore } from "@/hooks/useGetStore"
import { useNow } from "@/hooks/useNow"
import { useUpdatePoints } from "@/hooks/useUpdatePoints"
import { OperationType } from "@/types"
import { activePromotion } from "@/utils/promotions"
import { FlashList } from "@shopify/flash-list"
import { useLocalSearchParams } from "expo-router"
import { useState } from "react"
import { Alert, ScrollView } from "react-native"

export default function Customer() {
  const { userId } = useLocalSearchParams<{ userId: string }>()
  const [section, setSection] = useState<CustomerSection>("rewards")

  const store = useGetStore()
  const storeId = store.data?.id
  const customer = useCustomerRewards({ userId, storeId })
  const activity = useCustomerTimeline({ userId, storeId })
  const now = useNow()
  const promotions = useGetPromotions({ storeIds: storeId ? [storeId] : [] })
  const { updatePoints, isPending: isUpdatingPoints } = useUpdatePoints()
  const { addCustomer, isPending: isAdding } = useAddCustomer()

  if (store.isLoading || customer.isLoading) return <LoadingView />
  if (store.error || customer.error) return <ErrorView message={(store.error ?? customer.error)?.message} />

  if (!customer.membership) {
    return (
      <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ padding: 16 }}>
        <NotACustomerCard
          isPending={isAdding}
          onAdd={() =>
            addCustomer(
              { userId, storeId },
              { onError: () => Alert.alert("Could not add customer", "This QR code is not linked to an account.") },
            )
          }
        />
      </ScrollView>
    )
  }

  const changePoints = (amount: number, operationType: OperationType) => {
    const save = () =>
      updatePoints(
        { userId, storeId, amount, operationType },
        { onError: (error) => Alert.alert("Could not update points", error.message) },
      )

    if (operationType === "add") return save()

    Alert.alert("Remove points", `Remove ${amount} points from this customer?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: save },
    ])
  }

  const refresh = () => Promise.all([customer.refetch(), activity.refetch()])
  const isRefreshing = customer.isRefetching || activity.isRefetching

  const header = (
    <CustomerHeader
      email={customer.membership.profile?.email ?? "Customer"}
      points={customer.points}
      isUpdatingPoints={isUpdatingPoints}
      multiplier={storeId ? (activePromotion(promotions.data ?? [], storeId, now)?.multiplier ?? 1) : 1}
      onChangePoints={changePoints}
      section={section}
      onSectionChange={setSection}
    />
  )

  if (section === "history") {
    return (
      <FlashList
        className="bg-gray-50"
        contentContainerStyle={{ padding: 16 }}
        data={activity.timeline}
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
          readyLabel="Ready to give"
          href={{
            pathname: "/admin/customer/[userId]/reward/[rewardId]",
            params: { userId, rewardId: item.reward.id },
          }}
        />
      )}
      ListHeaderComponent={header}
      ListEmptyComponent={
        <EmptyState
          icon="gift-outline"
          title="No active rewards"
          message="Create or activate one in the Rewards tab."
        />
      }
      onRefresh={refresh}
      refreshing={isRefreshing}
    />
  )
}
