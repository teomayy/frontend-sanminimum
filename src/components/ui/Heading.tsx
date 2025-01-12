interface IHeading {
	title: string
}

export function Heading({ title }: IHeading) {
	return (
		<div>
			<h1 className='text-3xl text-black dark:text:white font-medium'>
				{title}
			</h1>
			<div className='my-3 h-0.5 bg-brandLinear dark:bg-border w-full' />
		</div>
	)
}
