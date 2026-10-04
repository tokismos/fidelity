import { updateReward } from "@/api/updateReward"
import { queryKeys } from "@/hooks/queryKeys"
import { Id, RewardFormValues, RewardType } from "@/types"
import { buildRewardConfig } from "@/utils/rewards"
import { uploadImageToBucket } from "@/utils/uploadImageToBucket"
import { useMutation, useQueryClient } from "@tanstack/react-query"

type Variables = {
  rewardId: Id
  type: RewardType
  values: RewardFormValues
}

const isUploaded = (image: string) => image.startsWith("http")

export const useUpdateReward = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ rewardId, type, values }: Variables) => {
      let imageUrl = values.image
      if (imageUrl && !isUploaded(imageUrl)) {
        imageUrl = await uploadImageToBucket({ uri: imageUrl, folder: "rewards" })
      }

      return updateReward({
        rewardId,
        title: values.title.trim(),
        description: values.description.trim(),
        config: buildRewardConfig(type, values, imageUrl),
      })
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.rewards.all }),
  })

  return { updateReward: mutation.mutate, ...mutation }
}
