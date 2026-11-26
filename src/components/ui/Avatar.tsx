import { AppText } from "@/components/ui/AppText"
import { View } from "react-native"

type Props = {
  // Already the initials, e.g. "MO"
  label: string
  size?: "m" | "l"
}

export const Avatar = ({ label, size = "m" }: Props) => (
  <View
    className={`items-center justify-center rounded-full bg-ink ${size === "l" ? "h-16 w-16" : "h-[42px] w-[42px]"}`}
  >
    <AppText weight="bold" className={`text-white ${size === "l" ? "text-[20px]" : "text-[14px]"}`}>
      {label}
    </AppText>
  </View>
)
