import { colors } from "@/constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { Href, Link } from "expo-router"
import { ComponentProps } from "react"
import { Pressable, Text, View } from "react-native"

type Props = {
  icon: ComponentProps<typeof Ionicons>["name"]
  title: string
  subtitle?: string
  // Text on the right, when the row is not a link
  value?: string
  href?: Href
  isLast?: boolean
}

export const SettingsRow = ({ icon, title, subtitle, value, href, isLast = false }: Props) => {
  const content = (
    <View className={`flex-row items-center p-4 ${isLast ? "" : "border-b border-gray-100"}`}>
      <View className="h-9 w-9 items-center justify-center rounded-xl bg-primary-50">
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <View className="ml-3 flex-1">
        <Text className="font-semibold text-gray-900" numberOfLines={1}>
          {title}
        </Text>
        {subtitle && <Text className="text-xs text-gray-500">{subtitle}</Text>}
      </View>
      {value && <Text className="text-sm font-semibold text-gray-500">{value}</Text>}
      {href && <Ionicons name="chevron-forward" size={20} color={colors.muted} />}
    </View>
  )

  if (!href) return content

  return (
    <Link href={href} asChild>
      <Pressable>{content}</Pressable>
    </Link>
  )
}
