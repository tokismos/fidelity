import { View } from "react-native"

type Props = {
  current: number
  target: number
  isReady: boolean
}

export const ProgressBar = ({ current, target, isReady }: Props) => {
  const percent = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 100

  return (
    <View className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
      <View
        className={`h-full rounded-full ${isReady ? "bg-green-500" : "bg-blue-500"}`}
        style={{ width: `${percent}%` }}
      />
    </View>
  )
}
