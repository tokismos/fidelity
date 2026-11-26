import { ErrorView } from "@/components/ErrorView"
import { LoadingView } from "@/components/LoadingView"
import { ActionToast } from "@/components/owner/ActionToast"
import { GiveRewardSheet, GiveTarget } from "@/components/owner/GiveRewardSheet"
import { PurchaseCard } from "@/components/owner/PurchaseCard"
import { RewardSummaryCard } from "@/components/owner/RewardSummaryCard"
import { Button } from "@/components/ui/Button"
import { LinkText } from "@/components/ui/LinkText"
import { NavBar } from "@/components/ui/NavBar"
import { Screen } from "@/components/ui/Screen"
import { useAddPurchase } from "@/hooks/useAddPurchase"
import { useCustomerRewards } from "@/hooks/useCustomerRewards"
import { useGetPromotions } from "@/hooks/useGetPromotions"
import { useGetReward } from "@/hooks/useGetReward"
import { useGetStore } from "@/hooks/useGetStore"
import { useGiveReward } from "@/hooks/useGiveReward"
import { useNow } from "@/hooks/useNow"
import { useRemovePurchase } from "@/hooks/useRemovePurchase"
import { useUndoToast } from "@/hooks/useUndoToast"
import { activePromotion } from "@/utils/promotions"
import { customerName } from "@/utils/text"
import { useLocalSearchParams } from "expo-router"
import { useState } from "react"
import { Alert, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function AdminCustomerReward() {
  const { userId, rewardId } = useLocalSearchParams<{ userId: string; rewardId: string }>()
  const [giveTarget, setGiveTarget] = useState<GiveTarget | null>(null)
  const insets = useSafeAreaInsets()

  const store = useGetStore()
  const storeId = store.data?.id
  const reward = useGetReward({ rewardId })
  const customer = useCustomerRewards({ userId, storeId })
  const now = useNow()
  const promotions = useGetPromotions({ storeIds: storeId ? [storeId] : [] })
  const multiplier = storeId ? (activePromotion(promotions.data ?? [], storeId, now)?.multiplier ?? 1) : 1

  const { giveReward, isPending: isGiving } = useGiveReward()
  const { addPurchase, isPending: isAddingPurchase } = useAddPurchase()
  const { removePurchase, isPending: isRemovingPurchase } = useRemovePurchase()
  const { toast, showAction, showMessage, hideToast } = useUndoToast({ userId, storeId, multiplier })

  if (store.isLoading || reward.isLoading || customer.isLoading) return <LoadingView />
  if (reward.error || !reward.data) return <ErrorView message={reward.error?.message} />
  if (customer.error) return <ErrorView message={customer.error.message} />
  if (!customer.membership) return <ErrorView message="This person is not a customer of your store yet." />

  const name = customerName(customer.membership.profile)
  const title = reward.data.title
  // Paused rewards are not in the list of active rewards
  const item = customer.items.find((entry) => entry.reward.id === rewardId)
  const progress = item?.progress
  const isCard = reward.data.type === "BUY_N_GET_1"
  const canGive = !!item && item.progress.isReady && !item.progress.isFinished
  const showError = (error: Error) => Alert.alert("Something went wrong", error.message)
  const canRemove = isCard && !!progress && progress.current > 0 && !progress.isFinished
  // Footer button and its bottom space, the 12 above it, then the link: the toast goes above the link
  const toastAboveLink = Math.max(insets.bottom, 16) + 58 + 12 + 44 + 8

  const purchaseAction = (change: 1 | -1) => ({ kind: "purchase" as const, rewardId, rewardTitle: title, change })

  const addOne = () =>
    addPurchase({ userId, rewardId }, { onSuccess: () => showAction(purchaseAction(1)), onError: showError })

  const confirmRemoveOne = () =>
    Alert.alert("Remove the last purchase?", `${name} will have one purchase less on ${title}.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () =>
          removePurchase({ userId, rewardId }, { onSuccess: () => showAction(purchaseAction(-1)), onError: showError }),
      },
    ])

  const give = () =>
    giveReward(
      { userId, rewardId },
      {
        onSuccess: () => {
          setGiveTarget(null)
          showMessage(`${title} given.`)
        },
        onError: showError,
      },
    )

  const openGive = () => item && setGiveTarget({ kind: "reward", item })

  const footer = canGive ? (
    <Button
      title={isCard ? "Give the free one" : `Give ${title}`}
      variant="rose"
      icon="gift-outline"
      onPress={openGive}
    />
  ) : isCard && item && !item.progress.isFinished ? (
    <Button title="Add 1 purchase" icon="add" onPress={addOne} isLoading={isAddingPurchase} />
  ) : undefined

  return (
    <View className="flex-1 bg-ground">
      <NavBar title={title} subtitle={name} />
      <Screen edges={["bottom"]} contentClassName="px-4" footer={footer}>
        <View className="flex-1 justify-center">
          {isCard && progress ? (
            <PurchaseCard progress={progress} />
          ) : (
            <RewardSummaryCard reward={reward.data} progress={progress} />
          )}
        </View>
        {canRemove && (
          <LinkText title="Remove the last one" tone="quiet" onPress={confirmRemoveOne} disabled={isRemovingPurchase} />
        )}
      </Screen>
      <ActionToast toast={toast} onHide={hideToast} bottom={canRemove ? toastAboveLink : undefined} />
      <GiveRewardSheet
        target={giveTarget}
        onClose={() => setGiveTarget(null)}
        points={customer.points}
        isPending={isGiving}
        onGive={give}
      />
    </View>
  )
}
