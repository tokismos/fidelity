import { EmptyState } from "@/components/EmptyState"
import { ErrorView } from "@/components/ErrorView"
import { LoadingView } from "@/components/LoadingView"
import { StoreCard } from "@/components/StoreCard"
import { useGetPromotions } from "@/hooks/useGetPromotions"
import { useNow } from "@/hooks/useNow"
import { useStoreOverviews } from "@/hooks/useStoreOverviews"
import { activePromotion } from "@/utils/promotions"
import { FlashList } from "@shopify/flash-list"

export default function UserHome() {
  const { storeIds, overviews, isLoading, error, refetch, isRefetching } = useStoreOverviews()
  const now = useNow()
  const promotions = useGetPromotions({ storeIds })

  if (isLoading) return <LoadingView />
  if (error) return <ErrorView message={error.message} />

  return (
    <FlashList
      className="bg-gray-50"
      contentContainerStyle={{ padding: 16 }}
      data={overviews}
      keyExtractor={(item) => item.userStore.id}
      renderItem={({ item }) => (
        <StoreCard
          overview={item}
          multiplier={activePromotion(promotions.data ?? [], item.userStore.store.id, now)?.multiplier}
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
