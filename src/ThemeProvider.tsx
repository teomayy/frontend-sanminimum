'use client'

import { ThemeProvider } from 'next-themes'

interface ProviderProps {
	children: React.ReactNode
}

export default function Provider({ children }: ProviderProps) {
	return (
		<ThemeProvider
			attribute='class'
			defaultTheme='dark'
		>
			{children}
		</ThemeProvider>
	)
}
