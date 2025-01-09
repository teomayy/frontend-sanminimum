import { useQuery } from '@tanstack/react-query'

import { doctorService } from '@/services/doctor.service'

export function useProfile() {
	const { data, isLoading, isSuccess, error } = useQuery({
		queryKey: ['profile'],
		queryFn: () => doctorService.getProfile()
	})

	return { data, isLoading, isSuccess }
}
