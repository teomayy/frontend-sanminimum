import { IAuthForm, IAuthResponse } from '@/types/auth.types'

import { axiosClassic } from '@/api/interceptors'

import { removeFromStorage, saveTokenStorage } from './auth-token.service'

export const authService = {
	async main(type: 'login' | 'register', data: IAuthForm) {
		const response = await axiosClassic.post<IAuthResponse>(
			`/auth/${type}`,
			data
		)

		if (response.data.accessToken) saveTokenStorage(response.data.accessToken)

		return response
	},

	async getNewTokens() {
		const response = await axiosClassic.post<IAuthResponse>(
			'/auth/login/access-token'
		)

		if (response.data.accessToken) saveTokenStorage(response.data.accessToken)

		return response
	},

	async logout() {
		try {
			const response = await axiosClassic.post<boolean>(
				'/auth/logout',
				{},
				{ withCredentials: true }
			)

			document.cookie.split(';').forEach(c => {
				document.cookie = c
					.replace(/^ +/, '')
					.replace(/= */, '=;expires=' + new Date().toUTCString() + ';path=/')
			})
			localStorage.clear()
			sessionStorage.clear

			window.location.href = '/auth'

			if (response.data) removeFromStorage()

			return response
		} catch (error) {
			console.error('Ошибка при выходе', error)
		}
	}
}
