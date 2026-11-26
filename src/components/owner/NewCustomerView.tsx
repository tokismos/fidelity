import { AppText } from "@/components/ui/AppText"
import { Button } from "@/components/ui/Button"
import { NavBar } from "@/components/ui/NavBar"
import { Screen } from "@/components/ui/Screen"
import { colors } from "@/constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { View } from "react-native"

type Props = {
  storeName: string
  isPending: boolean
  onAdd: () => void
}

// A scanned person who is not a customer of the store yet. The store cannot read their profile
// until they are added, so their name shows once they are in.
export const NewCustomerView = ({ storeName, isPending, onAdd }: Props) => (
  <View className="flex-1 bg-ground">
    <NavBar title="New customer" />
    <Screen
      edges={["bottom"]}
      contentClassName="items-center justify-center px-5"
      footer={<Button title={`Add to ${storeName}`} icon="add" onPress={onAdd} isLoading={isPending} />}
    >
      <View className="h-[104px] w-[104px] items-center justify-center rounded-full bg-ink">
        <Ionicons name="person-outline" size={44} color={colors.white} />
      </View>
      <AppText weight="black" className="mt-[18px] text-center text-[28px] leading-[32px] tracking-[-0.4px]">
        Not in {storeName} yet
      </AppText>
      <AppText className="mt-1 text-center text-ink-2">Add them to give points and rewards.</AppText>
    </Screen>
  </View>
)
