import { CodeSheet } from "@/components/customer/CodeSheet"
import { ShopCard } from "@/components/customer/ShopCard"
import { EmptyState } from "@/components/EmptyState"
import { ErrorView } from "@/components/ErrorView"
import { LoadingView } from "@/components/LoadingView"
import { Button } from "@/components/ui/Button"
import { LargeTitle } from "@/components/ui/LargeTitle"
import { Screen } from "@/components/ui/Screen"
import { useGetPromotions } from "@/hooks/useGetPromotions"
import { useNow } from "@/hooks/useNow"
import { useStoreOverviews } from "@/hooks/useStoreOverviews"
import { useWaitingPrizes } from "@/hooks/useWaitingPrizes"
import { activePromotion } from "@/utils/promotions"
import { FlashList } from "@shopify/flash-list"
import { router } from "expo-router"
import { useState } from "react"
import { View } from "react-native"

export default function UserHome() {
  const { storeIds, overviews, isLoading, error, refetch, isRefetching } = useStoreOverviews()
  const now = useNow()
  const promotions = useGetPromotions({ storeIds })
  const prizes = useWaitingPrizes({ storeIds })
  const [isCodeOpen, setIsCodeOpen] = useState(false)

  if (isLoading) return <LoadingView />
  if (error) return <ErrorView message={error.message} />

  return (
    <Screen>
      <LargeTitle title="My cards" />
      <FlashList
        data={overviews}
        keyExtractor={(item) => item.userStore.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 24 }}
        ItemSeparatorComponent={() => <View className="h-[14px]" />}
        renderItem={({ item }) => (
          <ShopCard
            overview={item}
            prizeCount={prizes.byStore[item.userStore.store.id]?.length ?? 0}
            promotion={activePromotion(promotions.data ?? [], item.userStore.store.id, now)}
            onPress={() =>
              router.push({ pathname: "/user/store/[storeId]", params: { storeId: item.userStore.store.id } })
            }
          />
        )}
        ListEmptyComponent={
          <View>
            <EmptyState
              icon="card-outline"
              title="No cards yet"
              message="Show your code in a shop to get your first card."
            />
            <Button title="Show my code" icon="qr-code-outline" onPress={() => setIsCodeOpen(true)} />
          </View>
        }
        onRefresh={() => Promise.all([refetch(), promotions.refetch(), prizes.refetch()])}
        refreshing={isRefetching || promotions.isRefetching || prizes.isRefetching}
      />
      <CodeSheet visible={isCodeOpen} onClose={() => setIsCodeOpen(false)} />
    </Screen>
  )
}
