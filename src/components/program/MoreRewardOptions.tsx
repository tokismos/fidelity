import { PhotoPicker } from "@/components/PhotoPicker"
import { AppText } from "@/components/ui/AppText"
import { Card } from "@/components/ui/Card"
import { Field } from "@/components/ui/Field"
import { ListRow } from "@/components/ui/ListRow"
import { Segmented } from "@/components/ui/Segmented"
import { RewardFormValues } from "@/types"
import { useState } from "react"
import { View } from "react-native"

type Props = {
  values: RewardFormValues
  onDescriptionChange: (description: string) => void
  onImageChange: (image: string | null) => void
  onOneTimeChange: (isOneTime: boolean) => void
}

type Availability = "every" | "once"

// The optional part of the reward form, closed at first: description, photo, only once
export const MoreRewardOptions = ({ values, onDescriptionChange, onImageChange, onOneTimeChange }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  if (!isOpen) {
    return (
      <Card className="mt-2">
        <ListRow
          title="More options"
          subtitle="Description, photo, only once"
          showChevron
          onPress={() => setIsOpen(true)}
        />
      </Card>
    )
  }

  return (
    <View className="gap-4">
      <Field
        label="Description"
        optional
        value={values.description}
        onChangeText={onDescriptionChange}
        placeholder="What the customer gets"
        multiline
      />
      <PhotoPicker label="Photo" size="square" image={values.image} onChange={onImageChange} />
      <View>
        <AppText weight="bold" className="mx-1 mb-[6px] text-[13px]">
          How often
        </AppText>
        <Segmented<Availability>
          options={[
            { value: "every", label: "Every time" },
            { value: "once", label: "Only once" },
          ]}
          value={values.is_one_time ? "once" : "every"}
          onChange={(value) => onOneTimeChange(value === "once")}
        />
      </View>
    </View>
  )
}
