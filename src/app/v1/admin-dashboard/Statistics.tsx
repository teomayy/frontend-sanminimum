'use client'

import { useQuery } from '@tanstack/react-query'

import Loader from '@/components/ui/Loader'

import { adminService } from '@/services/admin.service'

export function Statistics() {
	const { data: stats, isPending } = useQuery({
		queryKey: ['adminStats'],
		queryFn: adminService.getStatistics
	})

	if (isPending) {
		return <Loader />
	}

	return (
		<div className='grid grid-cols-3 gap-6 mt-7'>
			<div className='bg-primary dark:bg-border/5 rounded p-layout text-center text-white  hover:-translate-y-3 transition-transform duration-500'>
				<div className='text-xl'>👨‍⚕️ Всего докторов</div>
				<div className='text-3xl font-semibold'>{stats.doctorCount || 0}</div>
			</div>
			<div className='bg-primary dark:bg-border/5 rounded p-layout text-center text-white  hover:-translate-y-3 transition-transform duration-500'>
				<div className='text-xl'>✅ Активные заявки</div>
				<div className='text-3xl font-semibold'>
					{stats.activeReportsCount || 0}
				</div>
			</div>
			<div className='bg-primary dark:bg-border/5 rounded p-layout text-center text-white  hover:-translate-y-3 transition-transform duration-500'>
				<div className='text-xl'>📂 Архивные заявки</div>
				<div className='text-3xl font-semibold'>
					{stats.archivedReportsCount || 0}
				</div>
			</div>
		</div>
	)
}
