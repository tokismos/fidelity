import { updateStore } from "@/api/updateStore"
import { useGetStore } from "@/hooks/useGetStore"
import { queryKeys } from "@/hooks/queryKeys"
import { uploadImageToBucket } from "@/utils/uploadImageToBucket"
import { useMutation, useQueryClient } from "@tanstack/react-query"

type Variables = {
  name?: string
  // A new photo picked on the phone, or the URL of the current one
  image?: string
  timezone?: string
}

const isUploaded = (image: string) => image.startsWith("http")

// Edits the signed in admin's store, only the fields that are given
export const useUpdateStore = () => {
  const { data: store } = useGetStore()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ name, image, timezone }: Variables) => {
      const imageUrl = image && !isUploaded(image) ? await uploadImageToBucket({ uri: image, folder: "stores" }) : image

      return updateStore({ storeId: store?.id, name: name?.trim(), imageUrl, timezone })
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.store.all }),
  })

  return { updateStore: mutation.mutate, ...mutation }
}
