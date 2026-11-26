import { AppText } from "@/components/ui/AppText"
import { Field } from "@/components/ui/Field"
import { Stepper } from "@/components/ui/Stepper"
import { REWARD_FORM_FIELDS } from "@/constants/rewardTypes"
import { RewardFormField, RewardFormValues, RewardType } from "@/types"
import { View } from "react-native"

type Props = {
  type: RewardType
  values: RewardFormValues
  onChange: (key: RewardFormField, value: string) => void
}

// The fields that depend on the reward type: steppers for counts, text fields for the rest
export const RewardTypeFields = ({ type, values, onChange }: Props) =>
  REWARD_FORM_FIELDS[type].map((field) =>
    field.step ? (
      <View key={field.key}>
        <AppText weight="bold" className="mx-1 mb-[6px] text-[13px]">
          {field.label}
        </AppText>
        <Stepper
          variant="box"
          value={Number(values[field.key]) || 0}
          onChange={(value) => onChange(field.key, String(value))}
          step={field.step}
          min={1}
          max={field.max}
          unit={field.unit}
          accessibilityLabel={field.label}
        />
      </View>
    ) : (
      <Field
        key={field.key}
        label={field.label}
        placeholder={field.placeholder}
        value={values[field.key]}
        onChangeText={(value) => onChange(field.key, value)}
        keyboardType={field.numeric ? "decimal-pad" : "default"}
        autoCapitalize="sentences"
      />
    ),
  )
