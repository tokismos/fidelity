import { AppText } from "@/components/ui/AppText"
import { Stepper } from "@/components/ui/Stepper"
import { View } from "react-native"

type Props = {
  title: string
  // Small help line, up to two lines
  hint?: string
  value: number
  onChange: (value: number) => void
  step?: number
  min?: number
  max?: number
}

// A row of a sheet's list card: a name and a help line on the left, a stepper on the right
export const StepperRow = ({ title, hint, value, onChange, step, min, max }: Props) => (
  <View className="min-h-[60px] flex-row items-center gap-3 py-3 pl-4 pr-3">
    <View className="min-w-0 flex-1">
      <AppText weight="bold" numberOfLines={1} className="text-[16px] leading-[20px]">
        {title}
      </AppText>
      {hint && (
        <AppText numberOfLines={2} className="text-[13px] leading-[17px] text-ink-2">
          {hint}
        </AppText>
      )}
    </View>
    <Stepper value={value} onChange={onChange} step={step} min={min} max={max} accessibilityLabel={title} />
  </View>
)
