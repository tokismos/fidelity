import { AppText } from "@/components/ui/AppText"
import { Card } from "@/components/ui/Card"
import { PurchaseDots } from "@/components/ui/PurchaseDots"
import { RewardProgress } from "@/types"

type Props = {
  progress: RewardProgress
}

// The line under the count: what is left before the free one
const progressNote = ({ current, target, isReady, isFinished }: RewardProgress) => {
  if (isFinished) return "Already given. This card works only once."
  if (isReady) return "The card is full. The next one is free."
  const left = target - current
  return `${left} more ${left === 1 ? "purchase" : "purchases"}, then 1 free`
}

// A Buy N get 1 card, large: one circle per purchase, the free one last
export const PurchaseCard = ({ progress }: Props) => (
  <Card className="px-[22px] pb-[26px] pt-7">
    <PurchaseDots total={progress.target} filled={progress.current} size="l" />
    <AppText weight="black" tabular className="mt-7 text-[44px] leading-[46px] tracking-[-1.4px]">
      {progress.current} of {progress.target}
    </AppText>
    <AppText className="mt-[6px] text-ink-2">{progressNote(progress)}</AppText>
  </Card>
)
