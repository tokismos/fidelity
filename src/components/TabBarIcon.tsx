import { Ionicons } from "@expo/vector-icons"
import { ComponentProps } from "react"
import { ColorValue } from "react-native"

type Props = {
  name: ComponentProps<typeof Ionicons>["name"]
  color: ColorValue
}

// The tab bar gives a ColorValue (it can be a number or null), but the icon only takes a color string
export const TabBarIcon = ({ name, color }: Props) => (
  <Ionicons name={name} size={22} color={typeof color === "string" ? color : undefined} />
)
