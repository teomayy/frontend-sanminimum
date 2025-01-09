'use client'

import Loader from '@/components/ui/Loader'

import { useProfile } from '@/hooks/useProfile'

export function Profile() {
	const { data, isLoading } = useProfile()

	return (
		<div>
			<div className='absolute top-big-layout right-big-layout'>
				{isLoading ? (
					<Loader />
				) : (
					<div className='flex items-center gap '>
						<div className='text-right mr-3'>
							<p className='font-bold -mb-1'>{data?.doctor.name}</p>
							<p className='text-sm opacity-40'>{data?.doctor.login}</p>
						</div>

						<div className='w-10 h-10 flex justify-center items-center text-2xl text-white bg-primary rounded uppercase'>
							{data?.doctor.name?.charAt(0) || 'A'}
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
