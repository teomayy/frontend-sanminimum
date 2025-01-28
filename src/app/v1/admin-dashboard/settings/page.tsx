import { Metadata } from 'next'

import { Heading } from '@/components/ui/Heading'

import { NO_INDEX_SITE } from '@/constants/seo.constants'

import { Settings } from './Settings'

export const metadata: Metadata = {
	title: 'Настройки',
	...NO_INDEX_SITE
}

export default function ReportPage() {
	return (
		<div>
			<Heading title='Настройки' />
			<Settings />
		</div>
	)
}
