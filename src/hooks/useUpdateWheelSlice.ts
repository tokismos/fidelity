import { updateWheelSlice } from "@/api/updateWheelSlice"
import { queryKeys } from "@/hooks/queryKeys"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useUpdateWheelSlice = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: updateWheelSlice,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.wheelSlices.all }),
  })

  return { updateWheelSlice: mutation.mutate, ...mutation }
}
