import { NextRequest, NextResponse } from 'next/server'

import { EnumTokens } from './services/auth-token.service'

export async function middleware(req: NextRequest) {
	const url = req.nextUrl.clone()
	const refreshToken = req.cookies.get(EnumTokens.REFRESH_TOKEN)?.value

	if (url.pathname === '/') {
		url.pathname = '/v1'
		return NextResponse.redirect(url)
	}

	if (!refreshToken) {
		if (!req.nextUrl.pathname.startsWith('/auth')) {
			url.pathname = '/auth'
			return NextResponse.redirect(url)
		}
		return NextResponse.next()
	}

	// Проверка роли пользователя из токена
	const userRole = await getUserRole(refreshToken)

	if (!userRole) {
		url.pathname = '/auth'
		return NextResponse.redirect(url)
	}

	const isAdmin = userRole === 'admin'
	const isDoctor = userRole === 'doctor'

	if (req.nextUrl.pathname === '/v1') {
		if (isAdmin) {
			return NextResponse.redirect(new URL('/v1/admin-dashboard', req.url))
		}

		if (isDoctor) {
			return NextResponse.redirect(new URL('/v1/doctor-dashboard', req.url))
		}
	}

	if (req.nextUrl.pathname.startsWith('/v1/admin-dashboard') && !isAdmin) {
		return NextResponse.redirect(new URL('/auth', req.url))
	}

	if (req.nextUrl.pathname.startsWith('/v1/doctor-dashboard') && !isDoctor) {
		return NextResponse.redirect(new URL('/auth', req.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/', '/v1/:path*', '/auth/']
}

// Моделируем функцию получения роли пользователя
async function getUserRole(refreshToken: string): Promise<string | null> {
	if (!refreshToken) {
		console.error('Ошибка: refreshToken отсутствует')
		return null
	}
	try {
		const response = await fetch(
			'https://mses-sanminimum.uz/api/auth/verify-role',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${refreshToken}`
				}
			}
		)

		if (!response.ok) {
			console.error('Ошибка ответа от сервера:', await response.text())
			return null
		}

		const data = await response.json()
		console.log('USER ROLE:', data.role)
		return data.role // Ожидаем, что API вернет роль пользователя
	} catch (error) {
		console.error('Ошибка проверки роли пользователя:', error)
		return null
	}
}
