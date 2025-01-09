'use client'

import { Dialog } from '@headlessui/react'
import { useState } from 'react'

import { IReport } from '@/types/report.types'

import { EditReportForm } from './EditReportForm'

export function EditReportModal({
	report,
	onClose
}: {
	report: IReport
	onClose: () => void
}) {
	const [isOpen, setIsOpen] = useState(true)

	const handleClose = () => {
		setIsOpen(false)
		onClose()
	}

	return (
		<Dialog
			open={isOpen}
			onClose={handleClose}
			className='fixed inset-0 z-10 flex items-center justify-center   dark:bg-black/50'
		>
			<Dialog.Panel className='bg-[#958eb1] dark:bg-black rounded-lg p-6 w-[90%] max-w-lg'>
				<Dialog.Title className='text-xl font-bold mb-4'>
					Редактирование отчета
				</Dialog.Title>
				<EditReportForm report={report} />
				<button
					onClick={handleClose}
					className='mt-5 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
				>
					Закрыть
				</button>
			</Dialog.Panel>
		</Dialog>
	)
}
