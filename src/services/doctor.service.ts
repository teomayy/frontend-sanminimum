import { IUser, TypeUserForm } from '@/types/auth.types'

import { axiosWithAuth } from '@/api/interceptors'

export interface IProfileResponse {
	doctor: IUser
	statistics: {
		label: string
		value: number
	}[]
}

class DoctorService {
	private BASE_URL = '/doctor/profile'

	async getProfile() {
		const response = await axiosWithAuth.get<IProfileResponse>(this.BASE_URL)

		const statistics = Object.entries(response.data.statistics).map(
			([key, value]) => ({
				label: this.getStatisticLabel(key),
				value: value
			})
		)
		return { ...response.data, statistics }
	}

	private getStatisticLabel(key: string): string {
		const labels: Record<string, string> = {
			totalReports: 'Всего заявок',
			expiredReports: 'Просроченные заявок',
			expiringSoonReports: 'Истекающий срок действия заявок'
		}

		return labels[key] || key
	}

	async update(data: TypeUserForm) {
		const response = await axiosWithAuth.put(this.BASE_URL, data)
		return response.data
	}
}

export const doctorService = new DoctorService()
