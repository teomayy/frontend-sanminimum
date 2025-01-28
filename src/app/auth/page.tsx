import { Metadata } from 'next'

import { NO_INDEX_SITE } from '@/constants/seo.constants'

import { Auth } from './Auth'

export const metadata: Metadata = {
	title: 'Авторизация',
	...NO_INDEX_SITE
}

export default function AuthPage() {
	return <Auth />
}
