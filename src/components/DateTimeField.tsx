import { ListRow } from "@/components/ui/ListRow"
import { colors } from "@/constants/colors"
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker"
import { useState } from "react"
import { Platform, View } from "react-native"

type Props = {
  label: string
  value: Date
  minimumDate: Date
  onChange: (date: Date) => void
}

const formatValue = (date: Date) =>
  date.toLocaleString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
  })

// A row with the chosen date and time. On iOS a tap opens a picker under the row,
// on Android it opens the date then the time dialog.
export const DateTimeField = ({ label, value, minimumDate, onChange }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  const openAndroidPicker = () =>
    DateTimePickerAndroid.open({
      value,
      mode: "date",
      minimumDate,
      onChange: (dateEvent, date) => {
        if (dateEvent.type !== "set" || !date) return
        DateTimePickerAndroid.open({
          value: date,
          mode: "time",
          onChange: (timeEvent, time) => {
            if (timeEvent.type === "set" && time) onChange(time)
          },
        })
      },
    })

  return (
    <View>
      <ListRow
        title={label}
        subtitle={formatValue(value)}
        showChevron
        onPress={Platform.OS === "ios" ? () => setIsOpen((open) => !open) : openAndroidPicker}
      />
      {Platform.OS === "ios" && isOpen && (
        <View className="items-center pb-2">
          <DateTimePicker
            value={value}
            mode="datetime"
            display="spinner"
            themeVariant="light"
            textColor={colors.ink}
            minimumDate={minimumDate}
            onChange={(_, date) => date && onChange(date)}
          />
        </View>
      )}
    </View>
  )
}
