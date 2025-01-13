import { TypeUserForm } from '@/types/auth.types'

import { axiosWithAuth } from '@/api/interceptors'

export const adminService = {
	async addDoctor(data: { login: string; name: string; password: string }) {
		const response = await axiosWithAuth.post('/admin/doctor', data)
		return response.data
	},

	async getDoctors() {
		return axiosWithAuth.get('/admin/doctors')
	},

	async getReports(doctorId?: string) {
		const response = await axiosWithAuth.get('/admin/reports', {
			params: doctorId ? { doctorId } : undefined
		})

		return response.data
	},

	async update(data: TypeUserForm) {
		const response = await axiosWithAuth.put('/admin', data)
		return response.data
	},

	async getProfile() {
		return axiosWithAuth.get('/admin')
	},

	async deleteDoctor(id: string) {
		const response = await axiosWithAuth.delete(`admin/doctor/${id}`)
		return response.data
	},

	async deleteReport(id: string) {
		const response = await axiosWithAuth.delete(`/admin/report/${id}`)
		return response.data
	}
}
