'use client'

import Loader from '@/components/ui/Loader'

import { useProfile } from '@/hooks/useProfile'

export function Statistics() {
	const { data, isLoading } = useProfile()

	return isLoading ? (
		<Loader />
	) : (
		<div className='grid grid-cols-3 gap-12 mt-7'>
			{data?.statistics.length ? (
				data.statistics.map(statistic => (
					<div
						className='bg-primary dark:bg-border/5 rounded p-layout text-center text-white  hover:-translate-y-3 transition-transform duration-500'
						key={statistic.label}
					>
						<div className='text-xl'>{statistic.label}</div>
						<div className='text-3xl font-semibold'>{statistic.value}</div>
					</div>
				))
			) : (
				<div>Статистики не загружены</div>
			)}
		</div>
	)
}
