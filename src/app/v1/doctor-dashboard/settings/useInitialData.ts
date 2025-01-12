import { useEffect } from 'react'
import { UseFormReset } from 'react-hook-form'

import { TypeUserForm } from '@/types/auth.types'

import { useDoctorProfile } from '@/hooks/useDoctorProfile'

export function useInitialData(reset: UseFormReset<TypeUserForm>) {
	const { data, isSuccess } = useDoctorProfile()

	useEffect(() => {
		if (isSuccess && data) {
			reset({
				login: data.doctor.login,
				name: data.doctor.name
			})
		}
	}, [isSuccess])
}
