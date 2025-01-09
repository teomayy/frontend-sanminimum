import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { ICreateReportDto } from '@/types/report.types'

import { reportService } from '@/services/report.service'

export function useReports(filters?: Record<string, any>) {
	const queryClient = useQueryClient()

	const { data: reports = [], isLoading: isLoadingReports } = useQuery({
		queryKey: ['reports', filters],
		queryFn: () => reportService.getReportsByDoctor(filters),
		select: data => data || []
	})

	const { mutate: createReport } = useMutation({
		mutationKey: ['createReport'],
		mutationFn: (data: ICreateReportDto) => reportService.createReport(data),
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: ['reports']
			})
		}
	})

	const { mutate: updateReport, isPending: isUpdatePending } = useMutation({
		mutationKey: ['updateReport'],
		mutationFn: ({
			id,
			data
		}: {
			id: string
			data: Partial<ICreateReportDto>
		}) => reportService.updateReport(id, data),
		onSuccess: () => {
			toast.success('Отчет успешно обновлен!')
			queryClient.invalidateQueries({ queryKey: ['reports'] })
		},
		onError: () => {
			toast.error('Ошибка при обновлении отчета')
		}
	})

	const { mutate: deleteReport, isPending: isDeletePending } = useMutation({
		mutationKey: ['deleteReport'],
		mutationFn: (id: string) => reportService.deleteReport(id),
		onSuccess: () => {
			toast.success('Отчет удален успешно!')
			queryClient.invalidateQueries({
				queryKey: ['reports']
			})
		},
		onError: () => {
			toast.error('Ошибка при удалении отчета')
		}
	})

	return {
		reports,
		isLoadingReports,
		createReport,
		deleteReport,
		updateReport,
		isDeletePending,
		isUpdatePending
	}
}
