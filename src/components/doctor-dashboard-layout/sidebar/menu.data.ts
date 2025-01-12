import {
	ClipboardCheckIcon,
	ClipboardList,
	LayoutDashboard,
	Settings
} from 'lucide-react'

import { DASHBOARD_PAGES } from '@/config/pages-url.config'

import { IMenuItem } from './menu.interface'

export const MENU: IMenuItem[] = [
	{
		icon: LayoutDashboard,
		link: DASHBOARD_PAGES.HOME_DOCTOR,
		name: 'Панель управления'
	},
	{
		icon: ClipboardCheckIcon,
		link: DASHBOARD_PAGES.CREATE_REPORT,
		name: 'Создать заявку'
	},
	{
		icon: ClipboardList,
		link: DASHBOARD_PAGES.APPLICATIONS,
		name: 'Заявки'
	},
	{
		icon: Settings,
		link: DASHBOARD_PAGES.SETTINGS_DOCTOR,
		name: 'Настройки'
	}
]
