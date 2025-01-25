'use client'

import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'

import Loader from '@/components/ui/Loader'
import { DatePickerField } from '@/components/ui/fields/DatePicker'
import { ConfirmPopup } from '@/components/ui/popups/ConfirmPopup'

import { EditReportModal } from './EditReportModal'
import { ReportDate } from './ReportDate'
import { useReports } from './hooks/useReports'

export function ReportView() {
	const [isArchivedView, setIsArchivedView] = useState(false)
	const {
		reports,
		isLoadingReports,
		deleteReport,
		isDeletePending,
		archiveReport,
		restoreReport
	} = useReports(isArchivedView)

	const [editingReport, setEditingReport] = useState<string | null>(null)
	const [deletingReportId, setDeletingReportId] = useState<string | null>(null)
	const [searchQuery, setSearchQuery] = useState('')
	const [statusFilter, setStatusFilter] = useState<
		'all' | 'expired' | 'soon' | 'valid'
	>('all')

	const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' })

	const router = useRouter()

	// Функция для фильтрации данных
	const filteredReports = useMemo(() => {
		if (!reports) return []

		return reports.filter(report => {
			const matchesQuery =
				searchQuery === '' ||
				report.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
				report.workplace.toLowerCase().includes(searchQuery.toLowerCase())

			const expiryDate = dayjs(report.expiryDate)
			const today = dayjs()
			let matchesStatus = true
			if (statusFilter === 'expired') matchesStatus = expiryDate.isBefore(today)
			else if (statusFilter === 'soon')
				matchesStatus =
					expiryDate.diff(today, 'days') <= 10 && expiryDate.isAfter(today)
			else if (statusFilter === 'valid')
				matchesStatus = expiryDate.diff(today, 'days') > 10

			const matchesDateRange =
				(!dateRange.startDate ||
					dayjs(report.issueDate).isAfter(dayjs(dateRange.startDate))) &&
				(!dateRange.endDate ||
					dayjs(report.issueDate).isBefore(dayjs(dateRange.endDate)))

			return matchesQuery && matchesStatus && matchesDateRange
		})
	}, [reports, searchQuery, statusFilter, dateRange])

	const handleDelete = useCallback((reportId: string) => {
		setDeletingReportId(reportId)
	}, [])

	const confirmDelete = useCallback(() => {
		if (deletingReportId) {
			deleteReport(deletingReportId)
			setDeletingReportId(null)
		}
	}, [deleteReport, deletingReportId])

	if (isLoadingReports) {
		return <Loader />
	}

	// Функция для получения цвета статуса
	const getStatusColor = (expiryDate: string) => {
		const today = dayjs()
		const expiry = dayjs(expiryDate)
		const daysLeft = expiry.diff(today, 'days')

		if (daysLeft < 0) return 'text-red-500' // Истек
		if (daysLeft <= 10) return 'text-yellow-500' // Скоро истечет
		return 'text-green-500' // Действителен
	}

	return (
		<div className='rounded-lg max-w-full overflow-x-auto'>
			<div className='flex flex-col md:flex-row justify-between items-center mb-4'>
				<h2 className='text-xl md:text-2xl font-bold mb-4 md:mb-0'>
					{isArchivedView ? 'Архив отчетов' : 'Мои отчеты'}
				</h2>
				<div className='flex sm:flex-row gap-4'>
					<button
						className='bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600'
						onClick={() => router.push('/v1/doctor-dashboard/create-reports')}
					>
						Добавить отчет
					</button>
					<button
						className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600'
						onClick={() => setIsArchivedView(!isArchivedView)}
					>
						{isArchivedView ? 'Показать активные' : 'Показать архив'}
					</button>
				</div>
			</div>
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
				<div className='flex flex-col gap-2'>
					<label htmlFor=''>Поиск</label>
					<input
						type='text'
						placeholder='Поиск по имени или месту работы'
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
						className='bg-transparent border-b p-3 rounded '
					/>
				</div>
				<div className='flex flex-col gap-2'>
					<label>По статусу</label>
					<select
						value={statusFilter}
						onChange={e => setStatusFilter(e.target.value as any)}
						className='border relative  flex items-center justify-between r border-border  p-3 text-base rounded-lg'
					>
						<option value='all'>Все</option>
						<option value='expired'>Истек</option>
						<option value='soon'>Скоро истечет</option>
						<option value='valid'>Действителен</option>
					</select>
				</div>

				<DatePickerField
					id='startDate'
					label='С даты'
					value={dateRange.startDate}
					onChange={value =>
						setDateRange(prev => ({
							...prev,
							startDate: value
						}))
					}
				/>

				<DatePickerField
					id='endDate'
					label='По дату'
					value={dateRange.endDate}
					onChange={value =>
						setDateRange(prev => ({
							...prev,
							endDate: value
						}))
					}
				/>
			</div>
			<div className='overflow-x-hidden max-h-screen mt-20'>
				<table className='table-auto w-full  text-left border-collapse text-[7px] sm:text-[15px]'>
					<thead className='dark:text-brandLinear sticky top-0 z-10 '>
						<tr className='border-b'>
							<th className='border-b px-4 py-2'>ФИО</th>
							<th className='border-b px-4 py-2'>Место работы</th>
							<th className='border-b px-4 py-2'>Дата выдачи</th>
							<th className='border-b px-4 py-2'>Дата истечения</th>
							<th className='border-b px-4 py-2'>Статус</th>
							<th className='border-b px-4 py-2'>Действия</th>
						</tr>
					</thead>
					<tbody>
						{filteredReports && filteredReports.length > 0 ? (
							filteredReports.map(report => (
								<tr key={report.id}>
									<td className='border-b px-4 py-2'>{report.fullName}</td>
									<td className='border-b px-4 py-2'>{report.workplace}</td>
									<td className='border-b px-4 py-2'>
										<ReportDate date={report.issueDate} />
									</td>
									<td className='border-b px-4 py-2'>
										<ReportDate date={report.expiryDate} />
									</td>
									<td
										className={`border-b px-4 py-2 font-bold ${getStatusColor(report.expiryDate)}`}
									>
										{getStatusColor(report.expiryDate).includes('red')
											? 'Истек'
											: getStatusColor(report.expiryDate).includes('yellow')
												? 'Скоро истечет'
												: 'Действителен'}
									</td>

									<td className='border-b px-4 py-2 flex gap-5'>
										{isArchivedView ? (
											<div className='flex flex-row gap-4 '>
												<button
													className='bg-green-600 p-3 text-white rounded-lg hover:bg-green-700'
													onClick={() => restoreReport(report.id)}
												>
													Восстановить
												</button>
												<button
													className='bg-red-600 p-3 text-white rounded-lg hover:bg-red-700'
													onClick={() => handleDelete(report.id)}
													disabled={isDeletePending}
												>
													Удалить
												</button>
											</div>
										) : (
											<div className='flex flex-row gap-4'>
												{' '}
												<button
													className='bg-primary rounded-lg p-3 text-white'
													onClick={() => setEditingReport(report.id)}
												>
													Редактировать
												</button>
												<button
													className='bg-[#e47709] rounded-lg p-3'
													onClick={() => archiveReport(report.id)}
												>
													Архивировать
												</button>
											</div>
										)}
									</td>
								</tr>
							))
						) : (
							<tr>
								<td
									colSpan={6}
									className='border px-4 py-2 text-center'
								>
									Нет отчетов
								</td>
							</tr>
						)}
					</tbody>
				</table>

				{deletingReportId && (
					<ConfirmPopup
						message='Вы уверены, что хотите удалить отчет?'
						onConfirm={confirmDelete}
						onCancel={() => setDeletingReportId(null)}
					/>
				)}
			</div>

			{editingReport && (
				<EditReportModal
					report={reports.find(r => r.id === editingReport)!}
					onClose={() => setEditingReport(null)}
				/>
			)}
		</div>
	)
}
