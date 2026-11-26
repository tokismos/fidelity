import { AppText } from "@/components/ui/AppText"
import { Button } from "@/components/ui/Button"
import { colors } from "@/constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { Linking, View } from "react-native"

type Props = {
  // False once the phone will not show the question again: only the settings can allow it then
  canAskAgain: boolean
  onAllow: () => void
}

// Shown on the scanner, over the dark background, when the camera is not allowed
export const CameraPermissionPrompt = ({ canAskAgain, onAllow }: Props) => (
  <View className="w-full items-center">
    <Ionicons name="camera-outline" size={44} color={colors.white} />
    <AppText weight="bold" className="mt-4 text-center text-[18px] text-white">
      Allow the camera
    </AppText>
    <AppText className="mt-1 text-center text-white">
      {canAskAgain
        ? "It is needed to scan your customers' codes."
        : "The camera is off for this app. Turn it on in Settings to scan codes."}
    </AppText>
    <View className="mt-6 w-full">
      {canAskAgain ? (
        <Button title="Allow camera" variant="white" onPress={onAllow} />
      ) : (
        <Button title="Open settings" variant="white" onPress={() => Linking.openSettings()} />
      )}
    </View>
  </View>
)
