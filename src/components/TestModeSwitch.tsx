import { AppText } from "@/components/ui/AppText"
import { colors } from "@/constants/colors"
import { Switch, View } from "react-native"

type Props = {
  value: boolean
  onChange: (value: boolean) => void
}

// Development only: unlimited wheel spins, accepted only by a local database
export const TestModeSwitch = ({ value, onChange }: Props) => (
  <View className="min-h-[44px] flex-row items-center justify-center gap-3">
    <AppText className="text-[13px] text-ink-3">Test mode, unlimited spins</AppText>
    <Switch
      value={value}
      onValueChange={onChange}
      trackColor={{ true: colors.ink, false: colors.line2 }}
      accessibilityLabel="Test mode, unlimited spins"
    />
  </View>
)
