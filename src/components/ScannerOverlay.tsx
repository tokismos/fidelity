import { colors } from "@/constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { Pressable, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

type Props = {
  isTorchOn: boolean
  onToggleTorch: () => void
  onClose: () => void
  onSearchInstead: () => void
}

const CORNER = "absolute h-11 w-11 border-white"

// Viewfinder, controls and the way out drawn over the camera
export const ScannerOverlay = ({ isTorchOn, onToggleTorch, onClose, onSearchInstead }: Props) => (
  <SafeAreaView className="absolute inset-0 justify-between" pointerEvents="box-none">
    <View className="flex-row items-center justify-between px-5 pt-2">
      <Pressable
        onPress={onClose}
        accessibilityLabel="Close scanner"
        className="h-11 w-11 items-center justify-center rounded-xl bg-white/20"
      >
        <Ionicons name="close" size={24} color={colors.white} />
      </Pressable>
      <Text className="text-base font-bold text-white">Scan a customer</Text>
      <Pressable
        onPress={onToggleTorch}
        accessibilityLabel={isTorchOn ? "Turn the torch off" : "Turn the torch on"}
        className={`h-11 w-11 items-center justify-center rounded-xl ${isTorchOn ? "bg-white" : "bg-white/20"}`}
      >
        <Ionicons
          name={isTorchOn ? "flashlight" : "flashlight-outline"}
          size={22}
          color={isTorchOn ? colors.ink : colors.white}
        />
      </Pressable>
    </View>

    <View className="items-center" pointerEvents="none">
      <View className="h-64 w-64">
        <View className={`${CORNER} left-0 top-0 rounded-tl-3xl border-l-4 border-t-4`} />
        <View className={`${CORNER} right-0 top-0 rounded-tr-3xl border-r-4 border-t-4`} />
        <View className={`${CORNER} bottom-0 left-0 rounded-bl-3xl border-b-4 border-l-4`} />
        <View className={`${CORNER} bottom-0 right-0 rounded-br-3xl border-b-4 border-r-4`} />
      </View>
      <Text className="mt-6 px-10 text-center text-base font-semibold text-white">
        Point the camera at the customer's QR code. Their card opens automatically.
      </Text>
    </View>

    <View className="px-5 pb-4">
      <Pressable onPress={onSearchInstead} className="flex-row items-center justify-center rounded-2xl bg-white py-4">
        <Ionicons name="search" size={20} color={colors.ink} />
        <Text className="ml-2 font-bold text-gray-900">Find a customer by email instead</Text>
      </Pressable>
    </View>
  </SafeAreaView>
)
