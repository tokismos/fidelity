import { colors } from "@/constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { ActivityIndicator, Pressable, Text, View } from "react-native"

type Props = {
  message: string
  // False when the change cannot be reversed safely, the banner then only confirms it
  canUndo: boolean
  isPending: boolean
  onUndo: () => void
  onDismiss: () => void
}

// Confirms the admin's last change and offers to reverse it
export const UndoBanner = ({ message, canUndo, isPending, onUndo, onDismiss }: Props) => (
  <View className="mb-3 flex-row items-center rounded-2xl border border-green-300 bg-green-50 px-3 py-2">
    <Ionicons name="checkmark-circle" size={22} color={colors.success} />
    <Text className="ml-2 flex-1 font-semibold text-green-800">{message}</Text>
    {canUndo && (
      <Pressable
        onPress={onUndo}
        disabled={isPending}
        className="ml-2 flex-row items-center rounded-lg border border-green-300 bg-white px-3 py-2"
      >
        {isPending ? (
          <ActivityIndicator size="small" color={colors.success} />
        ) : (
          <>
            <Ionicons name="arrow-undo-outline" size={16} color={colors.success} />
            <Text className="ml-1 text-sm font-bold text-green-700">Undo</Text>
          </>
        )}
      </Pressable>
    )}
    <Pressable onPress={onDismiss} accessibilityLabel="Dismiss" className="ml-1 p-2">
      <Ionicons name="close" size={18} color={colors.text} />
    </Pressable>
  </View>
)
