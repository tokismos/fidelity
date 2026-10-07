import { SegmentedControl } from "@/components/SegmentedControl"
import { Text, View } from "react-native"

type Props = {
  isOneTime: boolean
  onChange: (isOneTime: boolean) => void
}

type Availability = "reusable" | "one_time"

export const RewardAvailabilityField = ({ isOneTime, onChange }: Props) => (
  <View className="mb-4">
    <Text className="mb-1 text-sm font-semibold text-gray-700">Availability</Text>
    <SegmentedControl<Availability>
      options={[
        { value: "reusable", label: "Reusable" },
        { value: "one_time", label: "One time" },
      ]}
      value={isOneTime ? "one_time" : "reusable"}
      onChange={(value) => onChange(value === "one_time")}
    />
    <Text className="mt-1 text-xs text-gray-500">
      {isOneTime
        ? "Each customer can get this reward only once."
        : "Customers can earn this reward again after receiving it."}
    </Text>
  </View>
)
