'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Heading } from '@/components/ui/Heading'
import { Button } from '@/components/ui/buttons/Button'
import { Field } from '@/components/ui/fields/Field'

import { IAuthForm } from '@/types/auth.types'

import { DASHBOARD_PAGES } from '@/config/pages-url.config'

import { authService } from '@/services/auth.service'

export function Auth() {
	const { register, handleSubmit, reset } = useForm<IAuthForm>({
		mode: 'onChange'
	})

	const [isLoginForm, setIsLoginForm] = useState(false)

	const { push } = useRouter()

	const { mutate } = useMutation({
		mutationKey: ['auth'],
		mutationFn: (data: IAuthForm) =>
			authService.main(isLoginForm ? 'login' : 'register', data),
		onSuccess() {
			toast.success('Успешно зашли!')
			reset()
			push(DASHBOARD_PAGES.HOME)
		}
	})

	const onSubmit: SubmitHandler<IAuthForm> = data => {
		mutate(data)
	}
	return (
		<div className='flex min-h-screen dark:bg-[#0b0c2e] bg-[#6e6541]'>
			<form
				className='w-1/4 m-auto dark:bg-sidebar bg-[#b19e70] text-white bg-text-black  rounded-xl p-layout'
				onSubmit={handleSubmit(onSubmit)}
			>
				<Heading title='Авторизация' />
				<Field
					id='login'
					label='Логин:'
					placeholder='Введите логин'
					type='login'
					extra='mb-4'
					{...register('login', {
						required: 'Login is required'
					})}
				/>
				<Field
					id='password'
					label='Пароль:'
					placeholder='Введите пароль'
					type='password'
					extra='mb-6'
					{...register('password', {
						required: 'Password is required'
					})}
				/>
				<div className='flex items-center gap-5 justify-center'>
					<Button onClick={() => setIsLoginForm(true)}>Войти</Button>
				</div>
			</form>
		</div>
	)
}
