import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "./useAuth"
import { addStore } from "@/api/addStore"
import { Stores } from "@/types"

export const useAddStore = () => {
  const { userId } = useAuth()
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: ({ storeName }: { storeName: Stores["name"] }) => addStore({ storeName, userId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["getStore"] }),
  })
  return { addStore: mutation.mutate, ...mutation }
}
