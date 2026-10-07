import { EmptyState } from "@/components/EmptyState"
import { ErrorView } from "@/components/ErrorView"
import { LoadingView } from "@/components/LoadingView"
import { PromotionForm } from "@/components/PromotionForm"
import { PromotionListItem } from "@/components/PromotionListItem"
import { useAddPromotion } from "@/hooks/useAddPromotion"
import { useEndPromotion } from "@/hooks/useEndPromotion"
import { useGetPromotions } from "@/hooks/useGetPromotions"
import { useGetStore } from "@/hooks/useGetStore"
import { useNow } from "@/hooks/useNow"
import { Promotion } from "@/types"
import { promotionStatus } from "@/utils/promotions"
import { deviceTimeZone } from "@/utils/time"
import { FlashList } from "@shopify/flash-list"
import { Alert, Text, View } from "react-native"

const STATUS_ORDER = { active: 0, upcoming: 1, ended: 2 }

export default function Promotions() {
  const now = useNow()
  const store = useGetStore()
  const storeIds = store.data ? [store.data.id] : []
  const promotions = useGetPromotions({ storeIds })
  const { addPromotion, isPending: isAdding } = useAddPromotion()
  const { endPromotion, isPending: isEnding } = useEndPromotion()

  if (store.isLoading || promotions.isLoading) return <LoadingView />
  if (store.error || promotions.error) return <ErrorView message={(store.error ?? promotions.error)?.message} />

  const timeZone = store.data?.timezone ?? deviceTimeZone()
  const showError = (error: Error) => Alert.alert("Something went wrong", error.message)

  const sorted = [...(promotions.data ?? [])].sort(
    (a, b) =>
      STATUS_ORDER[promotionStatus(a, now)] - STATUS_ORDER[promotionStatus(b, now)] ||
      a.starts_at.localeCompare(b.starts_at),
  )

  const confirmEnd = (promotion: Promotion) => {
    const isActive = promotionStatus(promotion, now) === "active"
    Alert.alert(isActive ? "End promotion" : "Cancel promotion", isActive ? "End it now?" : "Cancel this promotion?", [
      { text: "Back", style: "cancel" },
      {
        text: isActive ? "End now" : "Cancel it",
        style: "destructive",
        onPress: () => endPromotion({ promotionId: promotion.id }, { onError: showError }),
      },
    ])
  }

  return (
    <FlashList
      className="bg-gray-50"
      contentContainerStyle={{ padding: 16 }}
      data={sorted}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <PromotionListItem
          promotion={item}
          now={now}
          timeZone={timeZone}
          isPending={isEnding}
          onEnd={() => confirmEnd(item)}
        />
      )}
      ListHeaderComponent={
        <View>
          <Text className="mb-3 text-gray-600">
            Points added during a promotion are multiplied automatically. Customers see it in the app.
          </Text>
          <PromotionForm
            isPending={isAdding}
            onSubmit={(promotion) =>
              addPromotion(
                { storeId: store.data?.id, ...promotion },
                {
                  onSuccess: () => Alert.alert("Promotion saved", "Your customers can now see it."),
                  onError: (error) =>
                    Alert.alert(
                      "Could not save the promotion",
                      error.message.includes("promotions_no_overlap")
                        ? "It overlaps with another promotion."
                        : error.message,
                    ),
                },
              )
            }
          />
          <Text className="mb-2 mt-6 text-lg font-bold text-gray-900">Your promotions</Text>
        </View>
      }
      ListEmptyComponent={<EmptyState icon="flash-outline" title="No promotions yet" />}
      onRefresh={promotions.refetch}
      refreshing={promotions.isRefetching}
    />
  )
}
