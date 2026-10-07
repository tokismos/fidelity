import { NumberStepper } from "@/components/NumberStepper"
import { FormField } from "@/components/RewardFormField"
import { REWARD_FORM_FIELDS } from "@/constants/rewardTypes"
import { RewardFormField, RewardFormValues, RewardType } from "@/types"

type Props = {
  type: RewardType
  values: RewardFormValues
  onChange: (key: RewardFormField, value: string) => void
}

// Points go up in steps of 10, everything else one by one
const stepFor = (key: RewardFormField) => (key === "points_needed_value" ? 10 : 1)

// The fields that depend on the reward type
export const RewardConfigFields = ({ type, values, onChange }: Props) =>
  REWARD_FORM_FIELDS[type].map((field) =>
    field.numeric ? (
      <NumberStepper
        key={field.key}
        label={field.label}
        hint={`For example ${field.placeholder}`}
        value={values[field.key]}
        onChange={(value) => onChange(field.key, value)}
        step={stepFor(field.key)}
      />
    ) : (
      <FormField
        key={field.key}
        label={field.label}
        placeholder={field.placeholder}
        value={values[field.key]}
        onChangeText={(value) => onChange(field.key, value)}
      />
    ),
  )
