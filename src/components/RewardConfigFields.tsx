import { REWARD_FORM_FIELDS } from "@/constants/rewardTypes"
import { FormField } from "@/components/RewardFormField"
import { RewardFormField, RewardFormValues, RewardType } from "@/types"

type Props = {
  type: RewardType
  values: RewardFormValues
  onChange: (key: RewardFormField, value: string) => void
}

// The fields that depend on the reward type
export const RewardConfigFields = ({ type, values, onChange }: Props) => (
  <>
    {REWARD_FORM_FIELDS[type].map((field) => (
      <FormField
        key={field.key}
        label={field.label}
        placeholder={field.placeholder}
        value={values[field.key]}
        onChangeText={(value) => onChange(field.key, value)}
        keyboardType={field.numeric ? "numeric" : "default"}
      />
    ))}
  </>
)
