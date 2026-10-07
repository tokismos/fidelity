import { colors } from "@/constants/colors"
import { ActivityIndicator, Pressable, Text } from "react-native"

type Variant = "primary" | "success" | "danger" | "secondary"

type Props = {
  isLoading: boolean
  title: string
  onPress: () => void
  variant?: Variant
  disabled?: boolean
}

const BUTTON_CLASS: Record<Variant, string> = {
  primary: "bg-primary-600",
  success: "bg-green-600",
  danger: "bg-red-600",
  secondary: "border border-gray-300 bg-white",
}

const TEXT_CLASS: Record<Variant, string> = {
  primary: "text-white",
  success: "text-white",
  danger: "text-white",
  secondary: "text-gray-800",
}

export const ButtonWithIndicator = ({ isLoading, title, onPress, variant = "primary", disabled = false }: Props) => (
  <Pressable
    onPress={onPress}
    disabled={isLoading || disabled}
    className={`mb-3 w-full flex-row items-center justify-center rounded-lg py-3 ${BUTTON_CLASS[variant]} ${
      disabled ? "opacity-50" : ""
    }`}
  >
    {isLoading && (
      <ActivityIndicator size="small" color={variant === "secondary" ? colors.text : colors.white} className="mr-2" />
    )}
    <Text className={`text-center text-lg font-semibold ${TEXT_CLASS[variant]}`}>{title}</Text>
  </Pressable>
)
