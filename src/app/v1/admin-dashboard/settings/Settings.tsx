'use client'

import { SubmitHandler, useForm } from 'react-hook-form'

import { LogoutButton } from '@/components/doctor-dashboard-layout/sidebar/LogoutButton'
import { Button } from '@/components/ui/buttons/Button'
import { Field } from '@/components/ui/fields/Field'

import { TypeUserForm } from '@/types/auth.types'

import { useInitialData } from './useInitialDate'
import { useUpdateSettings } from './useUpdateSettings'

export function Settings() {
	const { register, handleSubmit, reset } = useForm<TypeUserForm>({
		mode: 'onChange'
	})

	useInitialData(reset)

	const { isPending, mutate } = useUpdateSettings()

	const onSubmit: SubmitHandler<TypeUserForm> = data => {
		const { password, ...rest } = data

		mutate({
			...rest,
			password: password || undefined
		})
	}

	return (
		<div className='p-6 flex justify-start'>
			<form
				className='w-full max-w-2xl'
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
					<div>
						<Field
							id='login'
							label='Логин:'
							placeholder='Введите логин:'
							type='text'
							{...register('login', {
								required: 'Email is required!'
							})}
							extra='mb-4'
						/>
						<Field
							id='name'
							label='ФИО:'
							placeholder='Введите полное имя'
							{...register('name')}
							extra='mb-4'
						/>
						<Field
							id='password'
							label='Пароль:'
							placeholder='Введите новый пароль'
							type='password'
							{...register('password')}
							extra='mb-10'
						/>
						<div className='sm:hidden flex mt-4'>
							<LogoutButton />
						</div>
					</div>
				</div>
				<Button
					type='submit'
					disabled={isPending}
				>
					Сохранить
				</Button>
			</form>
		</div>
	)
}
