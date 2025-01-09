import { PropsWithChildren } from 'react'

import { Header } from './header/Header'
import { Sidebar } from './sidebar/Sidebar'

export default function DashboardLayout({
	children
}: PropsWithChildren<unknown>) {
	return (
		<div className='bg-[#F9F6E6] dark:bg-bg text-bg dark:text-white grid min-h-screen 2xl:grid-cols-[1.1fr_6fr] grid-cols-[1.2fr-6fr]'>
			<Sidebar />

			<main className='p-big-layout overflow-x-hidden max-h-screen relative'>
				<Header />
				{children}
			</main>
		</div>
	)
}
