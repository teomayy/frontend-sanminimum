import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { TypeUserForm } from '@/types/auth.types'

import { doctorService } from '@/services/doctor.service'

export function useUpdateSettings() {
	const queryClient = useQueryClient()

	const { mutate, isPending } = useMutation({
		mutationKey: ['update profile'],
		mutationFn: (data: TypeUserForm) => doctorService.update(data),
		onSuccess() {
			toast.success('Профиль успешно обновлен!')
			queryClient.invalidateQueries({ queryKey: ['profile'] })
		}
	})

	return { mutate, isPending }
}
