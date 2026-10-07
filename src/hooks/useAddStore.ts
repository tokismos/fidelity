import { addStore } from "@/api/addStore"
import { useAuth } from "@/hooks/useAuth"
import { queryKeys } from "@/hooks/queryKeys"
import { deviceTimeZone } from "@/utils/time"
import { uploadImageToBucket } from "@/utils/uploadImageToBucket"
import { useMutation, useQueryClient } from "@tanstack/react-query"

type Variables = {
  name: string
  imageUri: string
}

export const useAddStore = () => {
  const { userId } = useAuth()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ name, imageUri }: Variables) => {
      const imageUrl = await uploadImageToBucket({ uri: imageUri, folder: "stores" })
      return addStore({ userId, name, imageUrl, timezone: deviceTimeZone() })
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.store.all }),
  })

  return { addStore: mutation.mutate, ...mutation }
}
