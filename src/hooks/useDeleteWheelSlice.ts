import { deleteWheelSlice } from "@/api/deleteWheelSlice"
import { queryKeys } from "@/hooks/queryKeys"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useDeleteWheelSlice = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: deleteWheelSlice,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.wheelSlices.all }),
  })

  return { deleteWheelSlice: mutation.mutate, ...mutation }
}
