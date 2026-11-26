import { SearchField } from "@/components/SearchField"
import { AppText } from "@/components/ui/AppText"
import { Avatar } from "@/components/ui/Avatar"
import { ListRow } from "@/components/ui/ListRow"
import { StoreCustomer } from "@/types"
import { customerName, initials } from "@/utils/text"
import { View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

type Props = {
  search: string
  onSearchChange: (text: string) => void
  // Customers matching the search, already cut to the few to show
  results: StoreCustomer[]
  onPick: (customer: StoreCustomer) => void
}

// The white panel at the bottom of the scanner: find a customer by name or email
export const CustomerSearchPanel = ({ search, onSearchChange, results, onPick }: Props) => {
  const insets = useSafeAreaInsets()
  const isSearching = search.trim().length > 0

  return (
    <View className="rounded-t-[28px] bg-surface px-4 pt-[10px]" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
      <View className="mx-auto mb-[14px] h-[5px] w-10 rounded-[3px] bg-line-2" />
      {isSearching && (
        <View className="-mx-4 mb-2">
          {results.map((customer) => {
            const name = customerName(customer.profile)
            return (
              <ListRow
                key={customer.id}
                title={name}
                subtitle={customer.profile?.email ?? undefined}
                leading={<Avatar label={initials(name)} />}
                showChevron
                onPress={() => onPick(customer)}
              />
            )
          })}
          {results.length === 0 && <AppText className="py-3 text-center text-ink-2">No customer found.</AppText>}
        </View>
      )}
      <SearchField value={search} onChangeText={onSearchChange} placeholder="Or type a name or email" />
    </View>
  )
}
