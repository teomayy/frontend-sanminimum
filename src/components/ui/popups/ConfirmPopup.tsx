interface ConfirmPopupProps {
	message: string
	onConfirm: () => void
	onCancel: () => void
}

export function ConfirmPopup({
	message,
	onConfirm,
	onCancel
}: ConfirmPopupProps) {
	return (
		<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10 '>
			<div className='dark:bg-[#2e3184] bg-#875050 p-6 rounded shadow-lg text-center'>
				<p className='mb-4'>{message}</p>
				<div className='flex justify-center gap-4'>
					<button
						className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'
						onClick={onConfirm}
					>
						Удалить
					</button>
					<button
						className='dark:bg-[#7e7a7a] px-4 py-2 bg-gray-300 rounded hover:bg-gray-400'
						onClick={onCancel}
					>
						Отмена
					</button>
				</div>
			</div>
		</div>
	)
}
