import { EmptyState } from "@/components/EmptyState"
import { ErrorView } from "@/components/ErrorView"
import { LoadingView } from "@/components/LoadingView"
import { PromotionForm } from "@/components/PromotionForm"
import { PromotionListItem } from "@/components/PromotionListItem"
import { PromotionStatusCard } from "@/components/PromotionStatusCard"
import { SectionTitle } from "@/components/SectionTitle"
import { useAddPromotion } from "@/hooks/useAddPromotion"
import { useEndPromotion } from "@/hooks/useEndPromotion"
import { useGetPromotions } from "@/hooks/useGetPromotions"
import { useGetStore } from "@/hooks/useGetStore"
import { useNow } from "@/hooks/useNow"
import { Promotion } from "@/types"
import { activePromotion, nextPromotion, promotionStatus } from "@/utils/promotions"
import { deviceTimeZone } from "@/utils/time"
import { FlashList } from "@shopify/flash-list"
import { Alert, Text, View } from "react-native"

const STATUS_ORDER = { active: 0, upcoming: 1, ended: 2 }

export default function Promotions() {
  const now = useNow()
  const store = useGetStore()
  const storeId = store.data?.id
  const storeIds = storeId ? [storeId] : []
  const promotions = useGetPromotions({ storeIds })
  const { addPromotion, isPending: isAdding } = useAddPromotion()
  const { endPromotion, isPending: isEnding } = useEndPromotion()

  if (store.isLoading || promotions.isLoading) return <LoadingView />
  if (store.error || promotions.error) return <ErrorView message={(store.error ?? promotions.error)?.message} />

  const timeZone = store.data?.timezone ?? deviceTimeZone()
  const showError = (error: Error) => Alert.alert("Something went wrong", error.message)

  const running = storeId ? activePromotion(promotions.data ?? [], storeId, now) : undefined
  const current = running ?? (storeId ? nextPromotion(promotions.data ?? [], storeId, now) : undefined)

  const others = [...(promotions.data ?? [])]
    .filter((promotion) => promotion.id !== current?.id)
    .sort(
      (a, b) =>
        STATUS_ORDER[promotionStatus(a, now)] - STATUS_ORDER[promotionStatus(b, now)] ||
        b.starts_at.localeCompare(a.starts_at),
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
      data={others}
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
          {current && (
            <View className="mb-4">
              <PromotionStatusCard
                promotion={current}
                now={now}
                timeZone={timeZone}
                isPending={isEnding}
                onEnd={() => confirmEnd(current)}
              />
            </View>
          )}
          <SectionTitle title={current ? "Start another one" : "Start a promotion"} />
          <PromotionForm
            isPending={isAdding}
            hasRunningPromotion={!!running}
            onSubmit={(promotion) =>
              addPromotion(
                { storeId, ...promotion },
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
          {others.length > 0 && <SectionTitle title="Other promotions" />}
        </View>
      }
      ListEmptyComponent={current ? null : <EmptyState icon="flash-outline" title="No promotions yet" />}
      onRefresh={promotions.refetch}
      refreshing={promotions.isRefetching}
    />
  )
}
