import { ICreateReportDto, IReport } from '@/types/report.types'

import { axiosWithAuth } from '@/api/interceptors'

interface IReportFilters {
	doctorId?: string
	startDate?: string
	endDate?: string
}

class ReportService {
	private BASE_URL = '/reports'

	async createReport(data: ICreateReportDto): Promise<IReport> {
		try {
			const response = await axiosWithAuth.post<IReport>(this.BASE_URL, data)
			return response.data
		} catch (error) {
			console.error('Ошибка при создании отчета:', error)
			throw new Error('Не удалось создать отчет')
		}
	}

	async updateReport(
		id: string,
		data: Partial<ICreateReportDto>
	): Promise<IReport> {
		try {
			const response = await axiosWithAuth.put<IReport>(
				`${this.BASE_URL}/${id}`,
				data
			)
			return response.data
		} catch (error) {
			console.error(`Ошибка при обновлении отчета с ID ${id}:`, error)
			throw new Error('Не удалось обновить отчет')
		}
	}

	async deleteReport(id: string): Promise<void> {
		try {
			await axiosWithAuth.delete(`${this.BASE_URL}/${id}`)
		} catch (error) {
			console.error(`Ошибка при удалении отчета с ID ${id}:`, error)
			throw new Error('Не удалось удалить отчет')
		}
	}

	async getReportsByDoctor(filters?: IReportFilters): Promise<IReport[]> {
		try {
			const response = await axiosWithAuth.get<IReport[]>(this.BASE_URL, {
				params: filters
			})
			return response.data
		} catch (error) {
			console.error('Ошибка при получении отчетов врача:', error)
			throw new Error('Не удалось получить отчеты')
		}
	}

	async getAllReports(): Promise<IReport[]> {
		try {
			const response = await axiosWithAuth.get<IReport[]>(
				`${this.BASE_URL}/all`
			)
			return response.data
		} catch (error) {
			console.error('Ошибка при получении всех отчетов:', error)
			throw new Error('Не удалось получить все отчеты')
		}
	}

	async getReportById(id: string): Promise<IReport> {
		try {
			const response = await axiosWithAuth.get<IReport>(
				`${this.BASE_URL}/${id}`
			)
			return response.data
		} catch (error) {
			console.error(`Ошибка при получении отчета с ID ${id}:`, error)
			throw new Error('Не удалось получить отчет')
		}
	}
}

export const reportService = new ReportService()
