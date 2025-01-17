import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

export function ReportDate({ date }: { date: string }) {
	const [formattedDate, setFormattedDate] = useState('')

	useEffect(() => {
		setFormattedDate(dayjs(date).format('DD.MM.YYYY'))
	}, [date])

	return <span>{formattedDate || '...'}</span>
}
