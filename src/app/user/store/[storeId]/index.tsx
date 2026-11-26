import { CodeSheet } from "@/components/customer/CodeSheet"
import { StoreExtras } from "@/components/customer/StoreExtras"
import { StorePath } from "@/components/customer/StorePath"
import { ErrorView } from "@/components/ErrorView"
import { LoadingView } from "@/components/LoadingView"
import { PromotionChip } from "@/components/PromotionChip"
import { Button } from "@/components/ui/Button"
import { IconButton } from "@/components/ui/IconButton"
import { NavBar } from "@/components/ui/NavBar"
import { Screen } from "@/components/ui/Screen"
import { useAuth } from "@/hooks/useAuth"
import { useCustomerRewards } from "@/hooks/useCustomerRewards"
import { useGetPromotions } from "@/hooks/useGetPromotions"
import { useGetUserStores } from "@/hooks/useGetUserStores"
import { useGetWheelSlices } from "@/hooks/useGetWheelSlices"
import { useGetWheelSpins } from "@/hooks/useGetWheelSpins"
import { useNow } from "@/hooks/useNow"
import { buildPath } from "@/utils/path"
import { activePromotion } from "@/utils/promotions"
import { isWheelReady, nextSpinAt, spinWaitLabel } from "@/utils/wheel"
import { router, useLocalSearchParams } from "expo-router"
import { useState } from "react"
import { RefreshControl, ScrollView, View } from "react-native"

export default function UserStore() {
  const { storeId } = useLocalSearchParams<{ storeId: string }>()
  const { userId } = useAuth()
  const now = useNow()
  const [isCodeOpen, setIsCodeOpen] = useState(false)

  const { data: userStores } = useGetUserStores()
  const customer = useCustomerRewards({ userId, storeId })
  const promotions = useGetPromotions({ storeIds: [storeId] })
  const wheelSlices = useGetWheelSlices({ storeId })
  const wheelSpins = useGetWheelSpins({ userId, storeId })

  if (customer.isLoading) return <LoadingView />
  if (customer.error) return <ErrorView message={customer.error.message} />

  const store = userStores?.find((userStore) => userStore.store.id === storeId)?.store
  const spins = wheelSpins.data ?? []
  const path = buildPath({ items: customer.items, points: customer.points, prizes: spins })
  const promotion = activePromotion(promotions.data ?? [], storeId, now)

  const waitLabel = spinWaitLabel(nextSpinAt(spins), now)
  const prizeCount = path.prizes.length
  const wheelLine = !isWheelReady(wheelSlices.data)
    ? null
    : !waitLabel
      ? "You can spin"
      : prizeCount > 0
        ? `${prizeCount} ${prizeCount === 1 ? "prize" : "prizes"} waiting`
        : waitLabel

  const openReward = (rewardId: string) => router.push({ pathname: "/user/reward/[rewardId]", params: { rewardId } })
  const refresh = () => {
    Promise.all([customer.refetch(), promotions.refetch(), wheelSlices.refetch(), wheelSpins.refetch()])
  }

  return (
    <Screen
      edges={["bottom"]}
      footer={<Button title="Show my code" icon="qr-code-outline" onPress={() => setIsCodeOpen(true)} />}
    >
      <NavBar
        title={store?.name ?? ""}
        trailing={
          <View className="flex-row items-center gap-1">
            {promotion && <PromotionChip promotion={promotion} timeZone={store?.timezone ?? null} now={now} />}
            <IconButton
              icon="time-outline"
              accessibilityLabel="History"
              onPress={() => router.push({ pathname: "/user/store/[storeId]/history", params: { storeId } })}
            />
          </View>
        }
      />
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-6 pt-[6px]"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={customer.isRefetching} onRefresh={refresh} />}
      >
        <StorePath path={path} points={customer.points} onOpenReward={openReward} />
        <StoreExtras
          cards={path.cards}
          offers={path.offers}
          wheelLine={wheelLine}
          onOpenReward={openReward}
          onOpenWheel={() => router.push({ pathname: "/user/wheel/[storeId]", params: { storeId } })}
        />
      </ScrollView>
      <CodeSheet visible={isCodeOpen} onClose={() => setIsCodeOpen(false)} storeName={store?.name} />
    </Screen>
  )
}
