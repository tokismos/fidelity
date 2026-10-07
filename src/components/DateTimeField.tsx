import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker"
import { Platform, Pressable, Text, View } from "react-native"

type Props = {
  label: string
  value: Date
  minimumDate: Date
  onChange: (date: Date) => void
}

// Date and time picker: one compact field on iOS, date then time dialogs on Android
export const DateTimeField = ({ label, value, minimumDate, onChange }: Props) => {
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
    <View className="mb-3 flex-row items-center justify-between">
      <Text className="text-sm font-semibold text-gray-700">{label}</Text>
      {Platform.OS === "ios" ? (
        <DateTimePicker
          value={value}
          mode="datetime"
          display="compact"
          minimumDate={minimumDate}
          onChange={(_, date) => date && onChange(date)}
        />
      ) : (
        <Pressable onPress={openAndroidPicker} className="rounded-lg bg-gray-100 px-3 py-2">
          <Text className="text-gray-800">
            {value.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
          </Text>
        </Pressable>
      )}
    </View>
  )
}
