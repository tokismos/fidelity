import { ButtonWithIndicator } from "@/components/ButtonWithIndicator"
import { colors } from "@/constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { Text, View } from "react-native"

type Props = {
  isPending: boolean
  onAdd: () => void
}

export const NotACustomerCard = ({ isPending, onAdd }: Props) => (
  <View className="items-center rounded-xl bg-white p-6 shadow-sm">
    <Ionicons name="person-add-outline" size={48} color={colors.primary} />
    <Text className="mt-3 text-xl font-bold text-gray-900">New customer</Text>
    <Text className="mb-5 mt-1 text-center text-gray-500">
      This person is not in your store yet. Add them to start giving points and rewards.
    </Text>
    <ButtonWithIndicator title="Add to my store" isLoading={isPending} onPress={onAdd} />
  </View>
)
