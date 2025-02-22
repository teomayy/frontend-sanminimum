'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useState } from 'react'
import { toast } from 'sonner'

import { Heading } from '@/components/ui/Heading'
import Loader from '@/components/ui/Loader'
import { DatePickerField } from '@/components/ui/fields/DatePicker'
import { ConfirmPopup } from '@/components/ui/popups/ConfirmPopup'

import { IDoctor } from '@/types/doctor.types'
import { IReport } from '@/types/report.types'

import { adminService } from '@/services/admin.service'

export default function ReportsPage() {
	const [filters, setFilters] = useState({
		searchQuery: '',
		status: 'all',
		startDate: '',
		endDate: '',
		doctorId: ''
	})
	const [currentPage, setCurrentPage] = useState(1)
	const pageSize = 10
	const [selectedReport, setSelectedReport] = useState<string | null>(null)

	const {
		data: reports = [],
		isLoading,
		refetch
	} = useQuery<IReport[]>({
		queryKey: ['reports'],
		queryFn: () => adminService.getReports()
	})

	const { data: doctor = [] } = useQuery<IDoctor[]>({
		queryKey: ['doctor'],
		queryFn: () => adminService.getDoctors()
	})

	const handleFilterChange = (field: string, value: string) => {
		setFilters(prev => ({ ...prev, [field]: value }))
		setCurrentPage(1)
	}

	const { mutate: deleteReport } = useMutation({
		mutationKey: ['deleteReport'],
		mutationFn: adminService.deleteReport,
		onSuccess: () => {
			toast.success('Отчет успешно удален!')
			refetch()
			setSelectedReport(null)
		},
		onError: () => {
			toast.error('Ошибка при удалении отчета')
			setSelectedReport(null)
		}
	})

	const handleConfirmDelete = () => {
		if (selectedReport) {
			deleteReport(selectedReport)
		}
	}

	const getStatusColor = (expiryDate: string) => {
		const today = dayjs()
		const expiry = dayjs(expiryDate)
		const daysLeft = expiry.diff(today, 'days')

		if (daysLeft < 0) return 'text-red-500' // Истек
		if (daysLeft <= 10) return 'text-yellow-500' // Скоро истечет
		return 'text-green-500' // Действителен
	}

	const filteredReports = reports.filter(report => {
		// Поиск
		const matchesQuery =
			!filters.searchQuery ||
			report.fullName
				.toLowerCase()
				.includes(filters.searchQuery.toLowerCase()) ||
			report.workplace.toLowerCase().includes(filters.searchQuery.toLowerCase())

		const matchesDoctor =
			!filters.doctorId || report.doctorId === filters.doctorId

		// Фильтр по статусу
		const expiryDate = dayjs(report.expiryDate)
		const today = dayjs()
		let matchesStatus = true
		if (filters.status === 'expired') matchesStatus = expiryDate.isBefore(today)
		else if (filters.status === 'soon')
			matchesStatus =
				expiryDate.diff(today, 'days') <= 10 && expiryDate.isAfter(today)
		else if (filters.status === 'valid')
			matchesStatus = expiryDate.diff(today, 'days') > 10

		// Функция для получения цвета статуса

		// Фильтр по диапазону дат
		const matchesDateRange =
			(!filters.startDate ||
				dayjs(report.issueDate).isAfter(dayjs(filters.startDate))) &&
			(!filters.endDate ||
				dayjs(report.issueDate).isBefore(dayjs(filters.endDate)))

		return matchesQuery && matchesDoctor && matchesStatus && matchesDateRange
	})

	const paginatedReports = filteredReports.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize
	)

	if (isLoading) return <Loader />

	return (
		<div className='rounded-lg max-w-full overflow-x-auto min-h-screen mb-20'>
			<Heading title='Управление отчетами' />

			<div className='grid grid-col-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 '>
				<div className='flex flex-col gap-2'>
					<label htmlFor='search'>Поиск</label>
					<input
						type='text'
						id='search'
						placeholder='Поиск по имени или месту работы'
						value={filters.searchQuery}
						onChange={e => handleFilterChange('searchQuery', e.target.value)}
						className='border p-3 rounded'
					/>
				</div>

				<div className='flex flex-col gap-2'>
					<label htmlFor='doctor'>По доктору</label>
					<select
						id='doctor'
						value={filters.doctorId}
						onChange={e => handleFilterChange('doctorId', e.target.value)}
						className='border p-3 rounded'
					>
						<option value=''>Все доктора</option>
						{doctor.map(doctor => (
							<option
								key={doctor.id}
								value={doctor.id}
							>
								{doctor.name}
							</option>
						))}
					</select>
				</div>

				<div className='flex flex-col gap-2'>
					<label htmlFor='status'>По статусу</label>
					<select
						id='status'
						value={filters.status}
						onChange={e => handleFilterChange('status', e.target.value)}
						className='border p-3 rounded'
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
					value={filters.startDate}
					onChange={value => handleFilterChange('startDate', value)}
				/>
				<DatePickerField
					id='endDate'
					label='По дату'
					value={filters.endDate}
					onChange={value => handleFilterChange('endDate', value)}
				/>
			</div>

			<table className='table-auto w-full text-left border-collapse text-[7px] sm:text-[15px]'>
				<thead>
					<tr>
						<th className='border-b px-4 py-2'>ФИО</th>
						<th className='border-b px-4 py-2'>Место работы</th>
						<th className='border-b px-4 py-2'>Дата выдачи</th>
						<th className='border-b px-4 py-2'>Дата истечения</th>
						<th className='border-b px-4 py-2'>Статус</th>
						<th className='border-b px-4 py-2'>Действия</th>
					</tr>
				</thead>
				<tbody>
					{paginatedReports.length > 0 ? (
						paginatedReports.map((report: IReport) => (
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
								<td className='border-b px-4 py-2'>
									<button
										onClick={() => setSelectedReport(report.id)}
										className='bg-red-600 text-white px-3 py-2 rounded'
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
								className='text-center'
							>
								Нет отчетов
							</td>
						</tr>
					)}
				</tbody>
			</table>

			<div className='flex justify-between mt-4'>
				<button
					onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
					disabled={currentPage === 1}
					className='px-4 py-2 bg-secondary cursor-pointe rounded hover:bg-gray-400'
				>
					Предыдущая
				</button>
				<span>
					Страница {currentPage} из{' '}
					{Math.ceil(filteredReports.length / pageSize)}
				</span>
				<button
					onClick={() =>
						setCurrentPage(prev =>
							Math.min(prev + 1, Math.ceil(filteredReports.length / pageSize))
						)
					}
					disabled={
						currentPage === Math.ceil(filteredReports.length / pageSize)
					}
					className='px-4 py-2 cursor-pointer bg-secondary rounded hover:bg-gray-400'
				>
					Следующая
				</button>
			</div>
			{selectedReport && (
				<ConfirmPopup
					message='Вы уверены, что хотите удалить этот отчет?'
					onConfirm={handleConfirmDelete}
					onCancel={() => setSelectedReport(null)}
				/>
			)}
		</div>
	)
}
