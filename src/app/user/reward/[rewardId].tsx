import { CodeSheet } from "@/components/customer/CodeSheet"
import { RewardHero } from "@/components/customer/RewardHero"
import { RewardStateCard } from "@/components/customer/RewardStateCard"
import { ErrorView } from "@/components/ErrorView"
import { LoadingView } from "@/components/LoadingView"
import { Button } from "@/components/ui/Button"
import { NavBar } from "@/components/ui/NavBar"
import { Screen } from "@/components/ui/Screen"
import { useAuth } from "@/hooks/useAuth"
import { useCustomerRewards } from "@/hooks/useCustomerRewards"
import { useGetReward } from "@/hooks/useGetReward"
import { useGetUserStores } from "@/hooks/useGetUserStores"
import { useGetWheelSpins } from "@/hooks/useGetWheelSpins"
import { pendingPrizes } from "@/utils/wheel"
import { useLocalSearchParams } from "expo-router"
import { useState } from "react"
import { RefreshControl, ScrollView } from "react-native"

export default function UserReward() {
  const { rewardId } = useLocalSearchParams<{ rewardId: string }>()
  const { userId } = useAuth()
  const [isCodeOpen, setIsCodeOpen] = useState(false)

  const reward = useGetReward({ rewardId })
  const storeId = reward.data?.store_id
  const customer = useCustomerRewards({ userId, storeId })
  const spins = useGetWheelSpins({ userId, storeId })
  const { data: userStores } = useGetUserStores()

  if (reward.isLoading || customer.isLoading || spins.isLoading) return <LoadingView />
  if (reward.error || !reward.data) return <ErrorView message={reward.error?.message} />

  const storeName = userStores?.find((userStore) => userStore.store.id === storeId)?.store.name
  // A prize won on the wheel is ready even when the reward is not in the shop's list
  const prize = pendingPrizes(spins.data ?? []).find((spin) => spin.reward_id === rewardId)
  const item = customer.items.find((entry) => entry.reward.id === rewardId)
  if (!item && !prize) return <ErrorView message="This reward is not available right now." />

  const progress = prize ? null : (item?.progress ?? null)
  const isFinished = !!progress?.isFinished
  // Same rule as the state card: a wheel prize is always ready
  const isReady = !progress || progress.isReady
  const readyMessage =
    reward.data.type === "FREE_ITEM_WITH_PURCHASE" && !prize
      ? `Buy a ${reward.data.config.item_name} and show your code at the counter.`
      : "Show your code at the counter to get it."

  return (
    <Screen
      edges={["bottom"]}
      footer={!isFinished && <Button title="Show my code" icon="qr-code-outline" onPress={() => setIsCodeOpen(true)} />}
    >
      <NavBar title={reward.data.title} subtitle={storeName} />
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow justify-center gap-[14px] px-4 pb-10 pt-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={customer.isRefetching || spins.isRefetching}
            onRefresh={() => {
              Promise.all([reward.refetch(), customer.refetch(), spins.refetch()])
            }}
          />
        }
      >
        <RewardHero reward={reward.data} isReady={isReady} />
        <RewardStateCard progress={progress} readyMessage={readyMessage} />
      </ScrollView>
      <CodeSheet visible={isCodeOpen} onClose={() => setIsCodeOpen(false)} storeName={storeName} />
    </Screen>
  )
}
