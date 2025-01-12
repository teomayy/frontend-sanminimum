'use client'

import cn from 'clsx'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import { X } from 'lucide-react'
import { forwardRef, useState } from 'react'
import { DayPicker, SelectSingleEventHandler } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

import { useOutside } from '@/hooks/useOutside'

import './DatePicker.scss'

dayjs.locale('uz')
dayjs.extend(LocalizedFormat)

interface DatePickerFieldProps {
	id: string
	label: string
	value: string
	onChange: (value: string) => void
	extra?: string
	position?: 'left' | 'right'
}

export const DatePickerField = forwardRef<
	HTMLInputElement,
	DatePickerFieldProps
>(({ id, label, value, onChange, extra, position = 'right' }, ref) => {
	const [selected, setSelected] = useState<Date>()
	const { isShow, setIsShow, ref: wrapperRef } = useOutside(false)

	const handleDaySelect: SelectSingleEventHandler = date => {
		const ISOdate = date?.toISOString()

		setSelected(date)
		if (ISOdate) {
			onChange(ISOdate)
			setIsShow(false)
		} else {
			onChange('')
		}
	}

	return (
		<div
			className={`${extra} relative cursor-pointer`}
			ref={wrapperRef}
		>
			<label
				htmlFor={id}
				className={`text-sm text-black dark:text-white ml-1.5 font-medium`}
			>
				{label}
			</label>
			<div
				className={`relative mt-2 flex items-center justify-between rounded-lg border dark:border-border text-white bg-primary dark:bg-white/0 p-3 text-base outline-none dark:placeholder:text-white/30 placeholder:font-normal transition-colors duration-500 focus-within:border-primary`}
				onClick={() => setIsShow(!isShow)}
			>
				{value ? (
					<span>{dayjs(value).format('LL')}</span>
				) : (
					<span className=' dark:text-white/30'>Выберите дату</span>
				)}
				{value && (
					<button
						className='absolute bg-primary text-white -top-2 -right-4 opacity-30 hover:opacity-100 transition-opacity'
						onClick={e => {
							e.stopPropagation()
							onChange('')
						}}
					>
						<X size={14} />
					</button>
				)}
			</div>
			{isShow && (
				<div
					className={cn(
						'absolute bg-brandLinear dark:bg-navy-700 p-2 rounded-lg flex justify-center shadow-md z-20',
						position === 'left' ? 'left-0' : 'right-0'
					)}
				>
					<DayPicker
						captionLayout='dropdown'
						mode='single'
						selected={selected}
						defaultMonth={selected}
						onSelect={handleDaySelect}
						weekStartsOn={1}
					/>
				</div>
			)}
		</div>
	)
})

DatePickerField.displayName = 'DatePickerField'
