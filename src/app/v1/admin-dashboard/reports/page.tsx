import { Metadata } from 'next'

import { NO_INDEX_SITE } from '@/constants/seo.constants'

import ReportsPage from './Reports'

export const metadata: Metadata = {
	title: 'Заявки',
	...NO_INDEX_SITE
}

export default function Page() {
	return <ReportsPage />
}
