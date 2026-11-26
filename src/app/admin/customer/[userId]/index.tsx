import { ErrorView } from "@/components/ErrorView"
import { LoadingView } from "@/components/LoadingView"
import { ActionToast } from "@/components/owner/ActionToast"
import { AddPointsSheet } from "@/components/owner/AddPointsSheet"
import { CustomerCards } from "@/components/owner/CustomerCards"
import { CustomerMenuSheet } from "@/components/owner/CustomerMenuSheet"
import { CustomerPath } from "@/components/owner/CustomerPath"
import { GiveRewardSheet, GiveTarget, giveTargetTitle } from "@/components/owner/GiveRewardSheet"
import { NewCustomerView } from "@/components/owner/NewCustomerView"
import { PromotionChip } from "@/components/PromotionChip"
import { Button } from "@/components/ui/Button"
import { IconButton } from "@/components/ui/IconButton"
import { NavBar } from "@/components/ui/NavBar"
import { Screen } from "@/components/ui/Screen"
import { useAddCustomer } from "@/hooks/useAddCustomer"
import { useCustomerRewards } from "@/hooks/useCustomerRewards"
import { useGetPromotions } from "@/hooks/useGetPromotions"
import { useGetStore } from "@/hooks/useGetStore"
import { useGetWheelSpins } from "@/hooks/useGetWheelSpins"
import { useGiveReward } from "@/hooks/useGiveReward"
import { useGiveWheelPrize } from "@/hooks/useGiveWheelPrize"
import { useNow } from "@/hooks/useNow"
import { useUndoToast } from "@/hooks/useUndoToast"
import { useUpdatePoints } from "@/hooks/useUpdatePoints"
import { OperationType } from "@/types"
import { buildPath } from "@/utils/path"
import { activePromotion } from "@/utils/promotions"
import { customerName } from "@/utils/text"
import { router, useLocalSearchParams } from "expo-router"
import { useState } from "react"
import { Alert, RefreshControl, View } from "react-native"

type SheetName = "points" | "menu"

// Time for a sheet to slide away before the next one opens: two modals cannot open at once
const SHEET_SWITCH_MS = 400

export default function Customer() {
  const { userId } = useLocalSearchParams<{ userId: string }>()
  const [sheet, setSheet] = useState<SheetName | null>(null)
  const [pointsMode, setPointsMode] = useState<"add" | "remove">("add")
  const [giveTarget, setGiveTarget] = useState<GiveTarget | null>(null)

  const store = useGetStore()
  const storeId = store.data?.id
  const customer = useCustomerRewards({ userId, storeId })
  const spins = useGetWheelSpins({ userId, storeId })
  const now = useNow()
  const promotions = useGetPromotions({ storeIds: storeId ? [storeId] : [] })
  const promotion = storeId ? activePromotion(promotions.data ?? [], storeId, now) : undefined
  const multiplier = promotion?.multiplier ?? 1

  const { updatePoints, isPending: isUpdatingPoints } = useUpdatePoints()
  const { giveReward, isPending: isGivingReward } = useGiveReward()
  const { giveWheelPrize, isPending: isGivingPrize } = useGiveWheelPrize()
  const { addCustomer, isPending: isAddingCustomer } = useAddCustomer()
  const { toast, showAction, showMessage, hideToast } = useUndoToast({ userId, storeId, multiplier })

  if (store.isLoading || customer.isLoading) return <LoadingView />
  if (store.error || customer.error) return <ErrorView message={(store.error ?? customer.error)?.message} />

  const storeName = store.data?.name ?? "your store"
  const showError = (error: Error) => Alert.alert("Something went wrong", error.message)

  if (!customer.membership) {
    return (
      <NewCustomerView
        storeName={storeName}
        isPending={isAddingCustomer}
        onAdd={() =>
          addCustomer(
            { userId, storeId },
            { onError: () => Alert.alert("Could not add customer", "This code is not linked to an account.") },
          )
        }
      />
    )
  }

  const name = customerName(customer.membership.profile)
  const path = buildPath({ items: customer.items, points: customer.points, prizes: spins.data ?? [] })

  const openAddPoints = () => {
    setPointsMode("add")
    setSheet("points")
  }

  const openRemovePoints = () => {
    setSheet(null)
    setPointsMode("remove")
    setTimeout(() => setSheet("points"), SHEET_SWITCH_MS)
  }

  const changePoints = (amount: number) => {
    const operationType: OperationType = pointsMode === "remove" ? "subtract" : "add"
    const save = () =>
      updatePoints(
        { userId, storeId, amount, operationType },
        {
          onSuccess: (result) => {
            setSheet(null)
            if (result) showAction({ kind: "points", operation: operationType, amount: result.amount })
          },
          onError: showError,
        },
      )

    // During a promotion removed points cannot be put back, so ask first
    if (operationType === "subtract" && promotion) {
      Alert.alert("Remove points", "This cannot be undone while a promotion is running.", [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", style: "destructive", onPress: save },
      ])
      return
    }
    save()
  }

  const give = (target: GiveTarget) => {
    const done = {
      onSuccess: () => {
        setGiveTarget(null)
        showMessage(`${giveTargetTitle(target)} given.`)
      },
      onError: showError,
    }
    if (target.kind === "prize") return giveWheelPrize({ spinId: target.prize.id }, done)
    giveReward({ userId, rewardId: target.item.reward.id }, done)
  }

  const refresh = () => {
    Promise.all([customer.refetch(), spins.refetch(), promotions.refetch()])
  }

  return (
    <View className="flex-1 bg-ground">
      <NavBar
        title={name}
        trailing={
          <>
            {promotion && <PromotionChip promotion={promotion} timeZone={store.data?.timezone ?? null} now={now} />}
            <IconButton icon="ellipsis-horizontal" onPress={() => setSheet("menu")} accessibilityLabel="More" />
          </>
        }
      />
      <Screen
        scroll
        edges={["bottom"]}
        refreshControl={<RefreshControl refreshing={customer.isRefetching} onRefresh={refresh} />}
        footer={<Button title="Add points" icon="add" onPress={openAddPoints} />}
      >
        <CustomerPath path={path} points={customer.points} onGive={setGiveTarget} />
        <CustomerCards
          cards={path.cards}
          offers={path.offers}
          onGive={setGiveTarget}
          onOpenCard={(item) =>
            router.push({
              pathname: "/admin/customer/[userId]/reward/[rewardId]",
              params: { userId, rewardId: item.reward.id },
            })
          }
        />
      </Screen>

      <ActionToast toast={toast} onHide={hideToast} />

      <AddPointsSheet
        visible={sheet === "points"}
        onClose={() => setSheet(null)}
        mode={pointsMode}
        multiplier={multiplier}
        points={customer.points}
        isPending={isUpdatingPoints}
        onSubmit={changePoints}
      />
      <CustomerMenuSheet
        visible={sheet === "menu"}
        onClose={() => setSheet(null)}
        title={name}
        onHistory={() => {
          setSheet(null)
          router.push({ pathname: "/admin/customer/[userId]/history", params: { userId } })
        }}
        onRemovePoints={openRemovePoints}
      />
      <GiveRewardSheet
        target={giveTarget}
        onClose={() => setGiveTarget(null)}
        points={customer.points}
        isPending={giveTarget?.kind === "prize" ? isGivingPrize : isGivingReward}
        onGive={give}
      />
    </View>
  )
}
