import { AppText } from "@/components/ui/AppText"
import { Card } from "@/components/ui/Card"
import { Chip } from "@/components/ui/Chip"
import { ProgressRail } from "@/components/ui/ProgressRail"
import { PurchaseDots } from "@/components/ui/PurchaseDots"
import { Tile } from "@/components/ui/Tile"
import { Promotion, StoreOverview } from "@/types"
import { shopSummary } from "@/utils/customerRewards"
import { multiplierName } from "@/utils/promotions"
import { describeReward } from "@/utils/rewards"
import { View } from "react-native"

type Props = {
  overview: StoreOverview
  // Wheel prizes waiting in this shop
  prizeCount: number
  // The promotion running now in this shop
  promotion: Promotion | undefined
  onPress: () => void
}

// The distance to the next reward, the number in bold: "160 points to 10% off"
const NextLine = ({ count, text }: { count?: number; text: string }) => (
  <AppText numberOfLines={2} className="shrink text-[14px] text-ink-2">
    {count !== undefined && (
      <AppText weight="bold" tabular className="text-[14px] text-ink">
        {count}
      </AppText>
    )}
    {text}
  </AppText>
)

// A customer's card in one shop: the points, a small path to the rewards and what comes next
export const ShopCard = ({ overview: { userStore, items, readyCount }, prizeCount, promotion, onPress }: Props) => {
  const { store, points } = userStore
  const summary = shopSummary(items, points)
  const ready = readyCount + prizeCount

  const line = (() => {
    switch (summary.kind) {
      case "points": {
        const { next, reached } = summary
        if (next) return <NextLine count={next.progress.target - points} text={` points to ${next.reward.title}`} />
        if (reached) return <NextLine text={`${reached.reward.title} is ready`} />
        return null
      }
      case "card": {
        const { reward, progress } = summary.card
        if (progress.isReady) return <NextLine text={`${reward.title} is ready`} />
        const remaining = progress.target - progress.current
        return <NextLine count={remaining} text={` more ${remaining === 1 ? "purchase" : "purchases"}, then 1 free`} />
      }
      case "none":
        return summary.offer ? <NextLine text={describeReward(summary.offer.reward)} /> : null
    }
  })()

  return (
    <Card onPress={onPress} accessibilityLabel={`${store.name}, ${points} points`} className="p-[18px]">
      <View className="flex-row items-center gap-3">
        <Tile icon="storefront-outline" imageUri={store.image_url} />
        <View className="min-w-0 flex-1 items-start gap-1">
          <AppText weight="bold" numberOfLines={2} className="text-[17px]">
            {store.name}
          </AppText>
          {promotion && <Chip label={multiplierName(promotion.multiplier)} tone="sun" icon="flash-outline" />}
        </View>
        <View className="items-end">
          {summary.kind === "card" ? (
            <AppText weight="black" tabular className="text-[30px] leading-[32px] tracking-[-0.8px]">
              {summary.card.progress.current}
              <AppText weight="bold" className="text-[16px] tracking-normal text-ink-2">
                {" of "}
              </AppText>
              {summary.card.progress.target}
            </AppText>
          ) : (
            <AppText weight="black" tabular className="text-[30px] leading-[32px] tracking-[-0.8px]">
              {points}
            </AppText>
          )}
          <AppText className="text-[12px] leading-[14px] text-ink-2">
            {summary.kind === "card" ? "purchases" : "points"}
          </AppText>
        </View>
      </View>

      {summary.kind === "points" && (
        <View className="mt-4">
          <ProgressRail stops={summary.stops} position={summary.position} />
        </View>
      )}
      {summary.kind === "card" && (
        <View className="mt-4">
          <PurchaseDots total={summary.card.progress.target} filled={summary.card.progress.current} size="m" />
        </View>
      )}

      {(line || ready > 0) && (
        <View className="mt-[10px] min-h-[20px] flex-row items-center justify-between gap-2">
          <View className="min-w-0 flex-1 flex-row">{line}</View>
          {ready > 0 && <Chip label={`${ready} ready`} tone="rose" />}
        </View>
      )}
    </Card>
  )
}
