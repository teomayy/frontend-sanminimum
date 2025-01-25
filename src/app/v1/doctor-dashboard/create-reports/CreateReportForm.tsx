'use client'

import { useMutation } from '@tanstack/react-query'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import Loader from '@/components/ui/Loader'
import { Button } from '@/components/ui/buttons/Button'
import { DatePickerField } from '@/components/ui/fields/DatePicker'
import { Field } from '@/components/ui/fields/Field'

import { IReport } from '@/types/report.types'

import { reportService } from '@/services/report.service'

export function CreateReportForm() {
	const { register, handleSubmit, reset, control, formState } =
		useForm<IReport>({
			mode: 'onChange'
		})

	const { errors } = formState

	const { mutate, isPending } = useMutation({
		mutationKey: ['createReport'],
		mutationFn: (data: IReport) => reportService.createReport(data),
		onSuccess() {
			toast.success('Заявка успешно создана!')
			reset()
		},
		onError(error: any) {
			console.error('Ошибка создания заявки:', error)
			toast.error(error.response?.data.message || 'Ошибка при создании заявки')
		}
	})

	const onSubmit: SubmitHandler<IReport> = data => {
		mutate(data)
	}

	return (
		<div className='max-x-full overflow-auto mb-20'>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='mx-auto text-bg dark:text-white'
			>
				{isPending && <Loader />}

				<Field
					type='text'
					id='fullName'
					label='ФИО'
					placeholder='Введите ФИО'
					extra='mb-4'
					{...register('fullName', {
						required: 'Поле ФИО обязательно'
					})}
					state={errors.fullName ? 'error' : undefined}
				/>
				{errors.fullName && (
					<p className='text-red-500 text-sm mt-1'>{errors.fullName.message}</p>
				)}
				<Controller
					name='birthDate'
					control={control}
					defaultValue=''
					rules={{
						required: 'Поле дата рождения обязательно'
					}}
					render={({ field }) => (
						<div className='mb-4'>
							<DatePickerField
								id='birthDate'
								label='Дата рождения'
								position='left'
								value={field.value}
								onChange={field.onChange}
							/>
							{errors.birthDate && (
								<p className='text-red-500 text-sm mt-1'>
									{errors.birthDate.message}
								</p>
							)}
						</div>
					)}
				/>

				<Field
					type='text'
					id='workplace'
					label='Место работы'
					placeholder='Введите место работы'
					extra='mb-4'
					{...register('workplace', {
						required: 'Поле место работы обязательно'
					})}
					state={errors.workplace ? 'error' : undefined}
				/>
				{errors.workplace && (
					<p className='text-red-500 text-sm mt-1'>
						{errors.workplace.message}
					</p>
				)}
				<Field
					type='text'
					label='Должность'
					id='position'
					placeholder='Введите должность'
					extra='mb-4'
					{...register('position', {
						required: 'Поле должность обязательно'
					})}
					state={errors.position ? 'error' : undefined}
				/>
				{errors.position && (
					<p className='text-red-500 text-sm mt-1'>{errors.position.message}</p>
				)}
				<Field
					type='tel'
					label='Телефон'
					id='phone'
					placeholder='+998XXXXXXXXX'
					extra='mb-4'
					{...register('phone', {
						required: 'Поле телефон обязательно'
					})}
					state={errors.phone ? 'error' : undefined}
				/>
				{errors.phone && (
					<p className='text-red-500 text-sm mt-1'>{errors.phone.message}</p>
				)}
				<Field
					type='text'
					label='ID сертификата'
					id='certificateId'
					placeholder='Введите номер сертификата'
					extra='mb-4'
					{...register('certificateId', {
						required: 'Поле ID сертификата обязательно'
					})}
					state={errors.certificateId ? 'error' : undefined}
				/>
				{errors.certificateId && (
					<p className='text-red-500 text-sm mt-1'>
						{errors.certificateId.message}
					</p>
				)}
				<Controller
					name='issueDate'
					control={control}
					defaultValue=''
					rules={{
						required: 'Поле дата выдачи обязательно'
					}}
					render={({ field }) => (
						<div className='mb-4'>
							<DatePickerField
								id='issueDate'
								label='Дата выдачи'
								position='left'
								value={field.value}
								onChange={field.onChange}
							/>
							{errors.issueDate && (
								<p className='text-red-500 text-sm mt-1'>
									{errors.issueDate.message}
								</p>
							)}
						</div>
					)}
				/>
				<Button
					type='submit'
					disabled={isPending}
				>
					{isPending ? 'Создание...' : 'Создать заявку'}
				</Button>
			</form>
		</div>
	)
}
