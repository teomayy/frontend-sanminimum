import { Heading } from '@/components/ui/Heading'

import { CreateReportForm } from '../create-reports/CreateReportForm'

export default function ReportPage() {
	return (
		<div>
			<Heading title='Создать заявку' />
			<CreateReportForm />
		</div>
	)
}
