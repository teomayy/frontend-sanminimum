'use client'

import Loader from '@/components/ui/Loader'

import { useAdminProfile } from '@/hooks/useAdminProfile'

export function Profile() {
	const { data, isLoading } = useAdminProfile()

	return (
		<div>
			<div className='absolute top-big-layout right-big-layout'>
				{isLoading ? (
					<Loader />
				) : (
					<div className='flex items-center gap '>
						<div className='text-right mr-3'>
							<p className='font-bold -mb-1'>{data?.data?.name}</p>
							<p className='text-sm opacity-40'>{data?.data?.login}</p>
						</div>

						<div className='w-10 h-10 flex justify-center items-center text-2xl text-white bg-primary rounded uppercase'>
							{data?.data?.name?.charAt(0) || 'A'}
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
