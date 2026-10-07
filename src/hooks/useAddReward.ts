import { addReward } from "@/api/addReward"
import { queryKeys } from "@/hooks/queryKeys"
import { useGetStore } from "@/hooks/useGetStore"
import { RewardFormValues, RewardType } from "@/types"
import { buildRewardConfig } from "@/utils/rewards"
import { uploadImageToBucket } from "@/utils/uploadImageToBucket"
import { useMutation, useQueryClient } from "@tanstack/react-query"

type Variables = {
  type: RewardType
  values: RewardFormValues
}

export const useAddReward = () => {
  const { data: store } = useGetStore()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ type, values }: Variables) => {
      const imageUrl = values.image ? await uploadImageToBucket({ uri: values.image, folder: "rewards" }) : null
      const config = buildRewardConfig(type, values, imageUrl)

      return addReward({
        storeId: store?.id,
        type,
        title: values.title.trim(),
        description: values.description.trim(),
        config,
        isOneTime: values.is_one_time,
      })
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.rewards.all }),
  })

  return { addReward: mutation.mutate, ...mutation }
}
