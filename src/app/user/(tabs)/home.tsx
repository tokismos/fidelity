import { EmptyState } from "@/components/EmptyState"
import { ErrorView } from "@/components/ErrorView"
import { LoadingView } from "@/components/LoadingView"
import { StoreCard } from "@/components/StoreCard"
import { useGetPromotions } from "@/hooks/useGetPromotions"
import { useGetUserStores } from "@/hooks/useGetUserStores"
import { useNow } from "@/hooks/useNow"
import { activePromotion } from "@/utils/promotions"
import { FlashList } from "@shopify/flash-list"

export default function UserHome() {
  const { data: userStores, isLoading, error, refetch, isRefetching } = useGetUserStores()
  const now = useNow()
  const promotions = useGetPromotions({ storeIds: (userStores ?? []).map((userStore) => userStore.store.id) })

  if (isLoading) return <LoadingView />
  if (error) return <ErrorView message={error.message} />

  return (
    <FlashList
      className="bg-gray-50"
      contentContainerStyle={{ padding: 16 }}
      data={userStores ?? []}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <StoreCard
          userStore={item}
          multiplier={activePromotion(promotions.data ?? [], item.store.id, now)?.multiplier}
        />
      )}
      ListEmptyComponent={
        <EmptyState
          icon="storefront-outline"
          title="No stores yet"
          message="Show your QR code at a store to join its loyalty program."
        />
      }
      onRefresh={() => Promise.all([refetch(), promotions.refetch()])}
      refreshing={isRefetching || promotions.isRefetching}
    />
  )
}
