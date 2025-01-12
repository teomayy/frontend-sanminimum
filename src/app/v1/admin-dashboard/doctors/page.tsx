import { Metadata } from 'next'

import { NO_INDEX_SITE } from '@/constants/seo.constants'

import DoctorPage from './doctors'

export const metadata: Metadata = {
	title: 'Докторы',
	...NO_INDEX_SITE
}

export default function Page() {
	return <DoctorPage />
}
