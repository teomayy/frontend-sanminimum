import { PropsWithChildren } from 'react'

import { Header } from './header/Header'
import { Sidebar } from './sidebar/Sidebar'

export default function AdminDashboardLayout({
	children
}: PropsWithChildren<unknown>) {
	return (
		<div className='bg-[#F9F6E6] dark:bg-bg text-bg dark:text-white grid min-h-screen 2xl:grid-cols-[1.1fr_6fr] grid-cols-[1.2fr-6fr] md:grid-cols-[1fr_5fr] sm:grid-col-1'>
			<Sidebar />
			<main className='p-big-layout overflow-x-hidden max-h-screen relative'>
				<Header />
				{children}
			</main>
		</div>
	)
}
