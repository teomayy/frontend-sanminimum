import { useQuery } from '@tanstack/react-query'

import { adminService } from '@/services/admin.service'

export function useAdminProfile() {
	const { data, isLoading, isSuccess, error } = useQuery({
		queryKey: ['profile'],
		queryFn: () => adminService.getProfile()
	})

	return { data, isLoading, isSuccess }
}
