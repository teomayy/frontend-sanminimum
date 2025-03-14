import { Metadata } from 'next'

import { Heading } from '@/components/ui/Heading'

import { NO_INDEX_SITE } from '@/constants/seo.constants'

import { Statistics } from './Statistics'

export const metadata: Metadata = {
	title: 'Админ панель',
	...NO_INDEX_SITE
}

export default function DashboardPage() {
	return (
		<div>
			<Heading title='Статистика' />
			<Statistics />
		</div>
	)
}
