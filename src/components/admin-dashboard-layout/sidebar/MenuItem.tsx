import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { IMenuItem } from './menu.interface'

export function MenuItem({ item }: { item: IMenuItem }) {
	if (typeof window === 'undefined') {
		return null
	}
	const pathname = usePathname()
	const isActive = pathname === item.link

	const [isMobile, setIsMobile] = useState(false)

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 768)
		}
		handleResize()
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	if (isMobile) {
		return (
			<div className={`cursor-pointer ${isActive ? 'text-[#149E53]' : ' '}`}>
				<Link
					href={item.link}
					className='flex gap-2.5 items-center py-1.5 mt-2 px-layout transition-colors hover:bg-gray-300 dark:hover:bg-border rounded-lg flex-col'
				>
					<item.icon />
					<span className='text-center'>{item.name}</span>
				</Link>
			</div>
		)
	}

	return (
		<div className={`cursor-pointer ${isActive ? 'text-primary' : ' '}`}>
			<Link
				href={item.link}
				className='flex gap-2.5 items-center py-1.5 mt-2 px-layout transition-colors hover:bg-gray-300 dark:hover:bg-border rounded-lg '
			>
				<item.icon />
				<span>{item.name}</span>
			</Link>
		</div>
	)
}
