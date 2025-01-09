'use client'

import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import Loader from '@/components/ui/Loader'
import { DatePickerField } from '@/components/ui/fields/DatePicker'

import { EditReportModal } from './EditReportModal'
import { useReports } from './hooks/useReports'

export function ReportView() {
	const { reports, isLoadingReports, deleteReport, isDeletePending } =
		useReports()

	const [editingReport, setEditingReport] = useState<string | null>(null)
	const [searchQuery, setSearchQuery] = useState('')
	const [statusFilter, setStatusFilter] = useState<
		'all' | 'expired' | 'soon' | 'valid'
	>('all')
	const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' })

	const router = useRouter()

	// Функция для фильтрации данных
	const filteredReports = reports?.filter(report => {
		// Фильтр по поисковой строке
		const matchesQuery =
			searchQuery === '' ||
			report.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
			report.workplace.toLowerCase().includes(searchQuery.toLowerCase())

		// Фильтр по статусу
		const expiryDate = dayjs(report.expiryDate)
		const today = dayjs()
		let matchesStatus = true
		if (statusFilter === 'expired') matchesStatus = expiryDate.isBefore(today)
		else if (statusFilter === 'soon')
			matchesStatus =
				expiryDate.diff(today, 'days') <= 10 && expiryDate.isAfter(today)
		else if (statusFilter === 'valid')
			matchesStatus = expiryDate.diff(today, 'days') > 10

		// Фильтр по диапазону дат
		const matchesDateRange =
			(!dateRange.startDate ||
				dayjs(report.issueDate).isAfter(dayjs(dateRange.startDate))) &&
			(!dateRange.endDate ||
				dayjs(report.issueDate).isBefore(dayjs(dateRange.endDate)))

		return matchesQuery && matchesStatus && matchesDateRange
	})

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
		<div className=' p-6 rounded-lg '>
			<div className='flex justify-between items-center mb-4'>
				<h2 className='text-2xl font-bold mb-4'>Мои отчеты</h2>
				<button
					className='bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600'
					onClick={() => router.push('/v1/create-reports')}
				>
					Добавить отчет
				</button>
			</div>

			<div className='flex gap-4 mb-6'>
				<div className='flex flex-col gap-2 w-[400px]'>
					<label htmlFor=''>Поиск</label>
					<input
						type='text'
						placeholder='Поиск по имени или месту работы'
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
						className='bg-transparent border-b p-3 rounded '
					/>
				</div>

				<div className='flex flex-col gap-2 text-[#000] dark:text-white/50 '>
					<label>По статусу</label>
					<select
						value={statusFilter}
						onChange={e => setStatusFilter(e.target.value as any)}
						className='border relative  flex items-center justify-between r border-border dark:bg-transparent p-3 text-base rounded-lg'
					>
						<option value='all'>Все</option>
						<option value='expired'>Истек</option>
						<option value='soon'>Скоро истечет</option>
						<option value='valid'>Действителен</option>
					</select>
				</div>

				<div className='flex gap-7 justify-center items-center w-1/3'>
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
						extra='w-1/2'
					/>
				</div>
			</div>
			<div className='overflow-x-hidden max-h-screen mt-20'>
				<table className='table-auto w-full  text-left border-collapse'>
					<thead className='dark:text-brandLinear sticky top-0 z-10 '>
						<tr className=''>
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
										{dayjs(report.issueDate).format('DD.MM.YYYY')}
									</td>
									<td className='border-b px-4 py-2'>
										{dayjs(report.expiryDate).format('DD.MM.YYYY')}
									</td>
									<td
										className={`border-b px-4 py-2 font-bold ${getStatusColor(report.expiryDate)}`}
									>
										{dayjs(report.expiryDate).isBefore(dayjs())
											? 'Истек'
											: dayjs(report.expiryDate).diff(dayjs(), 'days') <= 10
												? 'Скоро истечет'
												: 'Действителен'}
									</td>

									<td className='border-b px-4 py-2 flex gap-5'>
										<button
											className='bg-primary rounded-lg p-3 text-white'
											onClick={() => setEditingReport(report.id)}
										>
											Редактировать
										</button>
										<button
											className='bg-red-600 p-3 text-white rounded-lg hover:bg-red-700'
											onClick={() => deleteReport(report.id)}
											disabled={isDeletePending}
										>
											Удалить
										</button>
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
