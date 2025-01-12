'use client'

import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useState } from 'react'
import { toast } from 'sonner'

import { Heading } from '@/components/ui/Heading'
import Loader from '@/components/ui/Loader'
import { DatePickerField } from '@/components/ui/fields/DatePicker'

import { adminService } from '@/services/admin.service'

export default function ReportsPage() {
	const [filters, setFilters] = useState({
		searchQuery: '',
		doctorId: '',
		status: 'all',
		startDate: '',
		endDate: ''
	})
	const [currentPage, setCurrentPage] = useState(1)
	const pageSize = 10

	const {
		data: reports,
		isLoading,
		refetch
	} = useQuery({
		queryKey: ['reports', filters],
		queryFn: () => adminService.getReports(filters.doctorId || undefined),
		staleTime: 5000
	})

	const { data: doctors } = useQuery({
		queryKey: ['doctors'],
		queryFn: adminService.getDoctors
	})

	const handleFilterChange = (field: string, value: string) => {
		setFilters(prev => ({ ...prev, [field]: value }))
		setCurrentPage(1)
	}

	const handleDelete = (reportId: string) => {
		if (confirm('Вы уверены, что хотите удалить этот отчет?')) {
			adminService
				.deleteReport(reportId)
				.then(() => {
					toast.success('Отчет успешно удален!')
					refetch()
				})
				.catch(() => {
					toast.error('Ошибка при удалении отчета')
				})
		}
	}

	const getStatusLabel = (expiryDate: string) => {
		const today = dayjs()
		const expiry = dayjs(expiryDate)
		const daysLeft = expiry.diff(today, 'days')

		if (daysLeft < 0) return { label: 'Истек', color: 'text-red-500' }
		if (daysLeft <= 10)
			return { label: 'Скоро истечет', color: 'text-yellow-500' }
		return { label: 'Действителен', color: 'text-green-500' }
	}

	const filteredReports = reports?.filter(report => {
		const matchesQuery =
			filters.searchQuery === '' ||
			report.fullName
				.toLowerCase()
				.includes(filters.searchQuery.toLowerCase()) ||
			report.workplace.toLowerCase().includes(filters.searchQuery.toLowerCase())

		const expiryDate = dayjs(report.expiryDate)
		const today = dayjs()
		let matchesStatus = true
		if (filters.status === 'expired') matchesStatus = expiryDate.isBefore(today)
		else if (filters.status === 'soon')
			matchesStatus =
				expiryDate.diff(today, 'days') <= 10 && expiryDate.isAfter(today)
		else if (filters.status === 'valid')
			matchesStatus = expiryDate.diff(today, 'days') > 10

		const matchesDateRange =
			(!filters.startDate ||
				dayjs(report.issueDate).isAfter(dayjs(filters.startDate))) &&
			(!filters.endDate ||
				dayjs(report.issueDate).isBefore(dayjs(filters.endDate)))

		return matchesQuery && matchesStatus && matchesDateRange
	})

	const paginatedReports = filteredReports?.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize
	)

	if (isLoading) {
		return <Loader />
	}

	return (
		<div className='p-6 rounded-lg'>
			<Heading title='Управление отчетами' />
			<div className='flex gap-6 mb-6'>
				<div className='flex flex-col gap-2  items-center w-[400px]'>
					<label htmlFor=''>Поиск</label>
					<input
						type='text'
						placeholder='Поиск по имени или месту работы'
						value={filters.searchQuery}
						onChange={e => handleFilterChange('searchQuery', e.target.value)}
						className='bg-transparent border-b p-3 rounded w-[400px]'
					/>
				</div>
				<div className=' flex gap-7 justify-center items-center'>
					<div className='flex flex-col gap-2'>
						<label htmlFor=''>По докторам</label>
						<select
							value={filters.doctorId}
							onChange={e => handleFilterChange('doctorId', e.target.value)}
							className='border p-3 rounded '
						>
							<option value=''>Все доктора</option>
							{doctors?.data.map(doctor => (
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
						<label htmlFor=''>По статусу</label>
						<select
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

			<table className='table-auto w-full border-collapse'>
				<thead>
					<tr>
						<th className='border-b px-4 py-2'>ФИО</th>
						<th className='border-b px-4 py-2'>Место работы</th>
						<th className='border-b px-4 py-2'>Доктор</th>
						<th className='border-b px-4 py-2'>Дата выдачи</th>
						<th className='border-b px-4 py-2'>Дата истечения</th>
						<th className='border-b px-4 py-2'>Статус</th>
						<th className='border-b px-4 py-2'>Действия</th>
					</tr>
				</thead>
				<tbody>
					{paginatedReports && paginatedReports.length > 0 ? (
						paginatedReports.map(report => (
							<tr key={report.id}>
								<td className='border-b px-4 py-2'>{report.fullName}</td>
								<td className='border-b px-4 py-2'>{report.workplace}</td>
								<td className='border-b px-4 py-2'>{report.doctor.name}</td>
								<td className='border-b px-4 py-2'>
									{dayjs(report.issueDate).format('DD.MM.YYYY')}
								</td>
								<td className='border-b px-4 py-2'>
									{dayjs(report.expiryDate).format('DD.MM.YYYY')}
								</td>
								<td
									className={`border-b px-4 py-2 ${getStatusLabel(report.expiryDate).color}`}
								>
									{getStatusLabel(report.expiryDate).label}
								</td>
								<td className='border-b px-4 py-2'>
									<button
										onClick={() => handleDelete(report.id)}
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
								colSpan={7}
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
					className='px-4 py-2 bg-gray-300 rounded hover:bg-gray-400'
				>
					Предыдущая
				</button>
				<span>
					Страница {currentPage} из{' '}
					{Math.ceil((filteredReports?.length || 0) / pageSize)}
				</span>
				<button
					onClick={() =>
						setCurrentPage(prev =>
							Math.min(
								prev + 1,
								Math.ceil((filteredReports?.length || 0) / pageSize)
							)
						)
					}
					disabled={
						currentPage === Math.ceil((filteredReports?.length || 0) / pageSize)
					}
					className='px-4 py-2 bg-gray-300 rounded hover:bg-gray-400'
				>
					Следующая
				</button>
			</div>
		</div>
	)
}
