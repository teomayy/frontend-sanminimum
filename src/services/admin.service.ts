import { TypeUserForm } from '@/types/auth.types'
import { IDoctor } from '@/types/doctor.types'

import { axiosWithAuth } from '@/api/interceptors'

class AdminService {
	private BASE_URL = '/admin'

	async addDoctor(data: { login: string; name: string; password: string }) {
		const response = await axiosWithAuth.post(`/admin/doctor`, data)
		return response.data
	}

	async getDoctors(): Promise<IDoctor[]> {
		try {
			const response = await axiosWithAuth.get('/admin/doctors')
			return response.data
		} catch (error) {
			console.error('Ошибка при получении списка докторов:', error)
			throw new Error('Не удалось получить список докторов')
		}
	}

	async getReports(doctorId?: string) {
		const response = await axiosWithAuth.get('/admin/reports', {
			params: doctorId ? { doctorId } : undefined
		})

		return response.data
	}

	async update(data: TypeUserForm) {
		const response = await axiosWithAuth.put('/admin', data)
		return response.data
	}

	async getProfile() {
		return axiosWithAuth.get('/admin')
	}

	async deleteDoctor(id: string) {
		const response = await axiosWithAuth.delete(`admin/doctor/${id}`)
		return response.data
	}

	async deleteReport(id: string) {
		const response = await axiosWithAuth.delete(`/admin/report/${id}`)
		return response.data
	}

	async getStatistics() {
		const response = await axiosWithAuth.get(`/admin/stats`)
		return response.data
	}
}

export const adminService = new AdminService()
