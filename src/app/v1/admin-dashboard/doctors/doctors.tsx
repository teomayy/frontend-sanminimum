'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'

import { Heading } from '@/components/ui/Heading'
import Loader from '@/components/ui/Loader'
import { Button } from '@/components/ui/buttons/Button'
import { Field } from '@/components/ui/fields/Field'
import { ConfirmPopup } from '@/components/ui/popups/ConfirmPopup'

import { IDoctor } from '@/types/doctor.types'

import { adminService } from '@/services/admin.service'

export default function DoctorPage() {
	const [newDoctor, setNewDoctor] = useState({
		login: '',
		name: '',
		password: ''
	})

	const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null)

	const {
		data: doctors = [],
		refetch,
		isPending
	} = useQuery<IDoctor[], Error>({
		queryKey: ['doctors'],
		queryFn: adminService.getDoctors
	})

	const { mutate: addDoctor } = useMutation({
		mutationKey: ['addDoctor'],
		mutationFn: adminService.addDoctor,
		onSuccess() {
			toast.success('Доктор добавлен успешно')
			refetch()
			setNewDoctor({ login: '', name: '', password: '' })
		},
		onError: (error, any) => {
			toast.error(error.message || 'Ошибка добавления доктора')
		}
	})

	const handleAddDoctor = () => {
		addDoctor(newDoctor)
	}

	const { mutate: deleteDoctor } = useMutation({
		mutationKey: ['deleteDoctor'],
		mutationFn: adminService.deleteDoctor,
		onSuccess() {
			toast.success('Доктор успешно удален!')
			refetch()
			setSelectedDoctor(null)
		},
		onError: error => {
			toast.error(error.message || 'Ошибка удаления доктора')
			setSelectedDoctor(null)
		}
	})

	const confirmDeleteDoctor = (doctorId: string) => {
		setSelectedDoctor(doctorId)
	}

	const handleConfirmDelete = () => {
		if (selectedDoctor) {
			deleteDoctor(selectedDoctor)
		}
	}

	return (
		<div className='overflow-auto h-screen p-4'>
			<Heading title='Управление докторами' />

			<div className='mb-4'>
				<h2 className='text-xl font-semibold mb-4'>Добавить нового доктора</h2>
				<div className='grid grid-cols-1  gap-4'>
					<Field
						id='login'
						label='Логин'
						type='text'
						placeholder='Логин'
						value={newDoctor.login}
						onChange={e =>
							setNewDoctor({ ...newDoctor, login: e.target.value })
						}
					/>
					<Field
						id='fullName'
						type='text'
						label='ФИО'
						placeholder='ФИО'
						value={newDoctor.name}
						extra='mb-4'
						onChange={e => setNewDoctor({ ...newDoctor, name: e.target.value })}
					/>
					<Field
						id='password'
						type='password'
						label='Пароль'
						placeholder='Пароль'
						value={newDoctor.password}
						extra='mb-4'
						onChange={e =>
							setNewDoctor({ ...newDoctor, password: e.target.value })
						}
					/>
				</div>

				<Button onClick={handleAddDoctor}>Добавить</Button>
			</div>
			<div className='my-3 h-0.5 bg-brandLinear dark:bg-border w-full' />

			<h2 className='text-xl font-semibold'>Список докторов</h2>
			{isPending ? (
				<Loader />
			) : (
				<div className='overflow-auto'>
					<table className='table-auto w-full  text-left border-collapse text-sm sm:text-base'>
						<thead className='dark:text-brandLinear sticky top-0 z-10'>
							<tr className='border-b '>
								<th className='border-b px-4 py-2'>#</th>
								<th className='border-b px-4 py-2'>ФИО</th>
								<th className='border-b px-4 py-2'>Логин</th>
								<th className='border-b px-4 py-2'>Действия</th>
							</tr>
						</thead>
						<tbody>
							{doctors?.map((doctor: IDoctor, index: number) => (
								<tr
									key={doctor.id}
									className='dark:hover:bg-[#14165b] hover:bg-[#dbd0d0] text-xs sm:text-sm'
								>
									<td className='border-b px-4 py-2'>{index + 1}</td>
									<td className='border-b px-4 py-2'>{doctor.name}</td>
									<td className='border-b px-4 py-2'>{doctor.login}</td>
									<td className='border-b px-4 py-2'>
										<button
											onClick={() => {
												confirmDeleteDoctor(doctor.id)
											}}
											className='bg-red-600 p-3 text-white rounded-lg hover:bg-red-700'
										>
											Удалить
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
			{selectedDoctor && (
				<ConfirmPopup
					onConfirm={handleConfirmDelete}
					onCancel={() => setSelectedDoctor(null)}
					message='Вы уверены, что хотите удалить этого доктора?'
				/>
			)}
		</div>
	)
}
