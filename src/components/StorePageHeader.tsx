import { PointsBalance } from "@/components/PointsBalance"
import { PromotionBanner } from "@/components/PromotionBanner"
import { SegmentedControl } from "@/components/SegmentedControl"
import { StoreHeader } from "@/components/StoreHeader"
import { Promotion, Store } from "@/types"
import { deviceTimeZone } from "@/utils/time"
import { View } from "react-native"

export type StorePageSection = "rewards" | "history"

type Props = {
  store: Pick<Store, "name" | "image_url" | "timezone"> | undefined
  promotion: Promotion | undefined
  now: Date
  points: number
  section: StorePageSection
  onSectionChange: (section: StorePageSection) => void
}

export const StorePageHeader = ({ store, points, promotion, now, section, onSectionChange }: Props) => (
  <View className="mb-3">
    {store && <StoreHeader name={store.name} imageUrl={store.image_url} />}
    {promotion && (
      <View className="mt-3">
        <PromotionBanner promotion={promotion} now={now} timeZone={store?.timezone ?? deviceTimeZone()} />
      </View>
    )}
    <View className="mt-3">
      <PointsBalance points={points} label="Your points" />
    </View>
    <View className="mt-4">
      <SegmentedControl
        options={[
          { value: "rewards", label: "Rewards" },
          { value: "history", label: "History" },
        ]}
        value={section}
        onChange={onSectionChange}
      />
    </View>
  </View>
)
