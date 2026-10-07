import { AdminRewardRow } from "@/components/AdminRewardRow"
import { CustomerHeader, CustomerSection } from "@/components/CustomerHeader"
import { EmptyState } from "@/components/EmptyState"
import { ErrorView } from "@/components/ErrorView"
import { LoadingView } from "@/components/LoadingView"
import { NotACustomerCard } from "@/components/NotACustomerCard"
import { SectionTitle } from "@/components/SectionTitle"
import { TimelineItem } from "@/components/TimelineItem"
import { UndoBanner } from "@/components/UndoBanner"
import { useAddCustomer } from "@/hooks/useAddCustomer"
import { useAddPurchase } from "@/hooks/useAddPurchase"
import { useCustomerRewards } from "@/hooks/useCustomerRewards"
import { useCustomerTimeline } from "@/hooks/useCustomerTimeline"
import { useGetPromotions } from "@/hooks/useGetPromotions"
import { useGetStore } from "@/hooks/useGetStore"
import { useGiveReward } from "@/hooks/useGiveReward"
import { useNow } from "@/hooks/useNow"
import { useRemovePurchase } from "@/hooks/useRemovePurchase"
import { useUpdatePoints } from "@/hooks/useUpdatePoints"
import { LastAction, OperationType, RewardWithProgress } from "@/types"
import { activePromotion } from "@/utils/promotions"
import { giveRewardMessage, rewardRows } from "@/utils/rewards"
import { countVisits, timelineRows } from "@/utils/timeline"
import { describeLastAction } from "@/utils/undo"
import { FlashList } from "@shopify/flash-list"
import { useLocalSearchParams } from "expo-router"
import { useState } from "react"
import { Alert, ScrollView, View } from "react-native"

const ADMIN_GROUP_TITLES = { ready: "Ready to give", inProgress: "In progress", received: "Already given" }

export default function Customer() {
  const { userId } = useLocalSearchParams<{ userId: string }>()
  const [section, setSection] = useState<CustomerSection>("rewards")
  const [lastAction, setLastAction] = useState<LastAction | null>(null)

  const store = useGetStore()
  const storeId = store.data?.id
  const customer = useCustomerRewards({ userId, storeId })
  const activity = useCustomerTimeline({ userId, storeId })
  const now = useNow()
  const promotions = useGetPromotions({ storeIds: storeId ? [storeId] : [] })
  const { updatePoints, isPending: isUpdatingPoints } = useUpdatePoints()
  const { addPurchase, isPending: isStamping } = useAddPurchase()
  const { removePurchase, isPending: isUnstamping } = useRemovePurchase()
  const { giveReward, isPending: isGiving } = useGiveReward()
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

  const multiplier = storeId ? (activePromotion(promotions.data ?? [], storeId, now)?.multiplier ?? 1) : 1
  const showError = (error: Error) => Alert.alert("Something went wrong", error.message)

  const changePoints = (amount: number, operationType: OperationType) => {
    const save = () =>
      updatePoints(
        { userId, storeId, amount, operationType },
        {
          onSuccess: (result) =>
            result && setLastAction({ kind: "points", operation: operationType, amount: result.amount }),
          onError: showError,
        },
      )

    if (operationType === "add") return save()

    Alert.alert("Remove points", `Remove ${amount} points from this customer?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: save },
    ])
  }

  const stamp = ({ reward }: RewardWithProgress) =>
    addPurchase(
      { userId, rewardId: reward.id },
      {
        onSuccess: () => setLastAction({ kind: "purchase", rewardId: reward.id, rewardTitle: reward.title, change: 1 }),
        onError: showError,
      },
    )

  const give = (item: RewardWithProgress) =>
    Alert.alert(`Give ${item.reward.title}?`, giveRewardMessage(item, customer.points), [
      { text: "Cancel", style: "cancel" },
      {
        text: "Give reward",
        onPress: () =>
          giveReward(
            { userId, rewardId: item.reward.id },
            { onSuccess: () => setLastAction(null), onError: showError },
          ),
      },
    ])

  // Reverses the last change. Adding points during a promotion multiplies them, so removed points
  // are only put back when no promotion is running.
  const undo = () => {
    if (!lastAction) return
    const done = { onSuccess: () => setLastAction(null), onError: showError }

    if (lastAction.kind === "points") {
      const operationType: OperationType = lastAction.operation === "add" ? "subtract" : "add"
      return updatePoints({ userId, storeId, amount: lastAction.amount, operationType }, done)
    }
    if (lastAction.change > 0) return removePurchase({ userId, rewardId: lastAction.rewardId }, done)
    addPurchase({ userId, rewardId: lastAction.rewardId }, done)
  }

  const canUndo = !!lastAction && (lastAction.kind === "purchase" || lastAction.operation === "add" || multiplier === 1)
  const isPending = isUpdatingPoints || isStamping || isUnstamping || isGiving

  const refresh = () => Promise.all([customer.refetch(), activity.refetch()])
  const isRefreshing = customer.isRefetching || activity.isRefetching

  const header = (
    <View>
      {lastAction && (
        <UndoBanner
          message={describeLastAction(lastAction)}
          canUndo={canUndo}
          isPending={isPending}
          onUndo={undo}
          onDismiss={() => setLastAction(null)}
        />
      )}
      <CustomerHeader
        email={customer.membership.profile?.email ?? "Customer"}
        memberSince={customer.membership.created_at}
        visits={countVisits(activity.timeline)}
        points={customer.points}
        isUpdatingPoints={isUpdatingPoints}
        multiplier={multiplier}
        onChangePoints={changePoints}
        section={section}
        onSectionChange={setSection}
      />
    </View>
  )

  if (section === "history") {
    return (
      <FlashList
        className="bg-gray-50"
        contentContainerStyle={{ padding: 16 }}
        data={timelineRows(activity.timeline)}
        keyExtractor={(row) => row.id}
        renderItem={({ item: row }) =>
          row.kind === "day" ? <SectionTitle title={row.title} /> : <TimelineItem entry={row.entry} />
        }
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
      data={rewardRows(customer.items, ADMIN_GROUP_TITLES)}
      keyExtractor={(row) => row.id}
      renderItem={({ item: row }) =>
        row.kind === "title" ? (
          <SectionTitle title={row.title} tone={row.id === "title-ready" ? "success" : "default"} />
        ) : (
          <AdminRewardRow
            item={row.item}
            isPending={isPending}
            onGive={() => give(row.item)}
            onStamp={() => stamp(row.item)}
            href={{
              pathname: "/admin/customer/[userId]/reward/[rewardId]",
              params: { userId, rewardId: row.item.reward.id },
            }}
          />
        )
      }
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
