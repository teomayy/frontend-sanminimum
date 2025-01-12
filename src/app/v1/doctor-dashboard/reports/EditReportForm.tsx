'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/buttons/Button'
import { DatePickerField } from '@/components/ui/fields/DatePicker'
import { Field } from '@/components/ui/fields/Field'

import { IReport } from '@/types/report.types'

import { useReports } from './hooks/useReports'

export function EditReportForm({ report }: { report: IReport }) {
	const { updateReport } = useReports()
	const [form, setForm] = useState(report)

	const handleChange = (field: string, value: string) => {
		setForm({ ...form, [field]: value })
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		updateReport({ id: form.id, data: form })
	}

	return (
		<form onSubmit={handleSubmit}>
			<Field
				id='fullName'
				label='ФИО'
				value={form.fullName}
				onChange={e => handleChange('fullName', e.target.value)}
				placeholder='Введите ФИО'
			/>
			<Field
				id='workplace'
				label='Место работы'
				value={form.workplace}
				onChange={e => handleChange('workplace', e.target.value)}
				placeholder='Введите место работы'
			/>
			<Field
				id='phone'
				label='Телефон'
				placeholder='+998XXXXXXXXX'
				value={form.phone}
				onChange={e => handleChange('phone', e.target.value)}
			/>
			<Field
				id='position'
				label='Должность'
				value={form.position}
				onChange={e => handleChange('position', e.target.value)}
				placeholder='Введите должность'
			/>
			<DatePickerField
				id='issueDate'
				label='Дата выдачи'
				value={form.issueDate}
				onChange={value => handleChange('issueDate', value)}
			/>
			<Button
				className='mt-4'
				type='submit'
			>
				Обновить
			</Button>
		</form>
	)
}
