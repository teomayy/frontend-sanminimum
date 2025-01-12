import {
	ClipboardList,
	LayoutDashboard,
	Settings,
	Stethoscope
} from 'lucide-react'

import { DASHBOARD_PAGES } from '@/config/pages-url.config'

import { IMenuItem } from './menu.interface'

export const MENU: IMenuItem[] = [
	{
		icon: LayoutDashboard,
		link: DASHBOARD_PAGES.HOME_ADMIN,
		name: 'Панель управления'
	},
	{
		icon: Stethoscope,
		link: DASHBOARD_PAGES.DOCTORS,
		name: 'Добавить доктора'
	},
	{
		icon: ClipboardList,
		link: DASHBOARD_PAGES.REPORTS,
		name: 'Заявки'
	},
	{
		icon: Settings,
		link: DASHBOARD_PAGES.SETTINGS_ADMIN,
		name: 'Настройки'
	}
]
