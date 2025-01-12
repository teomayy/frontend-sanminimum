import { GanttChartSquare } from 'lucide-react'
import Link from 'next/link'

import { COLORS } from '@/constants/color.constants'

import { DASHBOARD_PAGES } from '@/config/pages-url.config'

import { LogoutButton } from '../../doctor-dashboard-layout/sidebar/LogoutButton'

import { MenuItem } from './MenuItem'
import { MENU } from './menu.data'

export function Sidebar() {
	return (
		<aside className='border-r border-r-brandLinear dark:border-r-border h-full flex flex-col justify-between dark:bg-sidebar'>
			<div>
				<Link
					href={DASHBOARD_PAGES.HOME_ADMIN}
					className='flex items-center gap-2.5 p-layout border-b
					border-b-brandLinear dark:border-b-border'
				>
					<GanttChartSquare
						color={COLORS.primary}
						size={38}
					/>
					<span className='text-2xl font-bold relative'>
						SANMINIMUM
						<span className='absolute -top-1 -right-6 text-xs opacity-40 rotate-[18deg] font-normal'>
							beta
						</span>
					</span>
				</Link>
				<div className='p-3 relative'>
					<LogoutButton />
					{MENU.map(item => (
						<MenuItem
							item={item}
							key={item.link}
						/>
					))}
				</div>
			</div>
		</aside>
	)
}
