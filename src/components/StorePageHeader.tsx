import { PointsBalance } from "@/components/PointsBalance"
import { SegmentedControl } from "@/components/SegmentedControl"
import { StoreHeader } from "@/components/StoreHeader"
import { Store } from "@/types"
import { View } from "react-native"

export type StorePageSection = "rewards" | "history"

type Props = {
  store: Pick<Store, "name" | "image_url"> | undefined
  points: number
  section: StorePageSection
  onSectionChange: (section: StorePageSection) => void
}

export const StorePageHeader = ({ store, points, section, onSectionChange }: Props) => (
  <View className="mb-3">
    {store && <StoreHeader name={store.name} imageUrl={store.image_url} />}
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
