import { AppText } from "@/components/ui/AppText"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Sheet } from "@/components/ui/Sheet"
import { colors } from "@/constants/colors"
import { RewardWithProgress, WheelSpin } from "@/types"
import { Ionicons } from "@expo/vector-icons"
import { useRef } from "react"
import { View } from "react-native"

// What the owner is about to give: a reward of the store or a prize won on the wheel
export type GiveTarget = { kind: "reward"; item: RewardWithProgress } | { kind: "prize"; prize: WheelSpin }

type Props = {
  // The sheet is open while a target is set
  target: GiveTarget | null
  onClose: () => void
  // The customer's points, for the before and after of a points reward
  points: number
  isPending: boolean
  onGive: (target: GiveTarget) => void
}

export const giveTargetTitle = (target: GiveTarget) =>
  target.kind === "reward" ? target.item.reward.title : (target.prize.reward?.title ?? "the prize")

// The line that says what giving it does, for everything that is not a points reward
const giveNote = (target: GiveTarget) => {
  if (target.kind === "prize") return "Won on the wheel. It costs no points."
  const { reward } = target.item
  if (reward.type === "BUY_N_GET_1") return "The card goes back to 0."
  if (reward.type === "FREE_ITEM_WITH_PURCHASE")
    return `Give it only when the customer buys a ${reward.config.item_name}.`
  return null
}

const PointsChange = ({ points, cost }: { points: number; cost: number }) => (
  <Card className="px-[18px] pt-[22px]">
    <View className="flex-row items-center">
      <View className="flex-1 items-center">
        <AppText weight="black" tabular className="text-[46px] leading-[48px] tracking-[-1.5px] text-ink-3">
          {points}
        </AppText>
        <AppText className="mt-[6px] text-[13px] text-ink-2">points now</AppText>
      </View>
      <Ionicons name="chevron-forward" size={24} color={colors.ink3} />
      <View className="flex-1 items-center">
        <AppText weight="black" tabular className="text-[46px] leading-[48px] tracking-[-1.5px]">
          {points - cost}
        </AppText>
        <AppText className="mt-[6px] text-[13px] text-ink-2">points after</AppText>
      </View>
    </View>
    <View className="mt-5 border-t border-ground pb-4 pt-[14px]">
      <AppText className="text-center">
        <AppText weight="bold" tabular>
          {cost} points
        </AppText>{" "}
        will be taken
      </AppText>
    </View>
  </Card>
)

// Asks before giving a reward. A points reward shows the points before and after.
export const GiveRewardSheet = ({ target, onClose, points, isPending, onGive }: Props) => {
  // Keeps the last target so the sheet does not go blank while it closes
  const last = useRef(target)
  if (target) last.current = target
  const shown = target ?? last.current

  if (!shown) return null

  const title = giveTargetTitle(shown)
  const note = giveNote(shown)
  const cost = shown.kind === "reward" && shown.item.progress.unit === "points" ? shown.item.progress.target : null

  return (
    <Sheet visible={!!target} onClose={onClose} title={`Give ${title}?`}>
      {cost !== null ? (
        <PointsChange points={points} cost={cost} />
      ) : (
        note && (
          <Card className="px-[18px] py-5">
            <AppText className="text-center">{note}</AppText>
          </Card>
        )
      )}
      <View className="mt-4 gap-[10px]">
        <Button title={`Give ${title}`} variant="rose" onPress={() => onGive(shown)} isLoading={isPending} />
        <Button title="Cancel" variant="line" onPress={onClose} />
      </View>
    </Sheet>
  )
}
