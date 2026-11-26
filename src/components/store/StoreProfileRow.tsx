import { AppText } from "@/components/ui/AppText"
import { Card } from "@/components/ui/Card"
import { colors } from "@/constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { Image, View } from "react-native"

type Props = {
  name: string
  imageUrl: string | null
  onPress: () => void
}

// The store photo and name at the top of the Store tab. Opens the name and photo sheet.
export const StoreProfileRow = ({ name, imageUrl, onPress }: Props) => (
  <Card onPress={onPress} accessibilityLabel={`${name}, name and photo`}>
    <View className="flex-row items-center gap-3 py-[14px] pl-[14px] pr-3">
      <View className="h-16 w-16 items-center justify-center overflow-hidden rounded-[18px] bg-ground">
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} className="h-full w-full" accessibilityIgnoresInvertColors />
        ) : (
          <Ionicons name="storefront-outline" size={28} color={colors.ink} />
        )}
      </View>
      <View className="min-w-0 flex-1">
        <AppText weight="bold" numberOfLines={2} className="text-[19px] leading-[23px]">
          {name}
        </AppText>
        <AppText numberOfLines={1} className="text-[14px] text-ink-2">
          Name and photo
        </AppText>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.ink3} />
    </View>
  </Card>
)
