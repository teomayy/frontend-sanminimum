import { forwardRef } from 'react'

interface InputFieldProps {
	id: string
	label: string
	extra?: string
	placeholder: string
	variant?: string
	state?: 'error' | 'success'
	disabled?: boolean
	type?: string
	isNumber?: boolean
	value?: string
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const Field = forwardRef<HTMLInputElement, InputFieldProps>(
	(
		{
			label,
			id,
			extra,
			type,
			placeholder,
			state,
			disabled,
			isNumber,
			value,
			onChange,
			...rest
		},
		ref
	) => {
		return (
			<div className={`${extra} text-bg dark:text-white`}>
				<label
					htmlFor={id}
					className={`text-sm text-text-bg dark:text-white ml-1.5 font-medium`}
				>
					{label}
				</label>
				<input
					ref={ref}
					disabled={disabled}
					type={type}
					id={id}
					placeholder={placeholder}
					value={value}
					onChange={onChange}
					className={`mt-2 flex w-full items-center justify-center rounded-lg border dark:border-border bg-white/0 p-3 text-base outline-none dark:placeholder:text-white/30 placeholder:font-normal duration-500 transition-colors border-gray-400  focus:border-primary ${
						disabled === true
							? '!border-none !bg-gray-100 dark:!bg-white/5 dark:placeholder:!text-[rgba(255,255,255,0.15)]'
							: state === 'error'
								? 'border-red-500 text-red-500 placeholder:text-red-500 dark:!border-red-400 dark:!text-red-400 dark:placeholder:!text-red-400'
								: state === 'success'
									? 'border-green-500 text-green-500 placeholder:text-green-500 dark:!border-green-400 dark:!text-green-400 dark:placeholder:!text-green-400'
									: ''
					}`}
					onKeyDown={event => {
						if (
							isNumber &&
							!/[0-9]/.test(event.key) &&
							event.key !== 'Backspace' &&
							event.key !== 'Tab' &&
							event.key !== 'Enter' &&
							event.key !== 'ArrowLeft' &&
							event.key !== 'ArrowRight'
						) {
							event.preventDefault()
						}
					}}
					{...rest}
				/>
			</div>
		)
	}
)

Field.displayName = 'field'
