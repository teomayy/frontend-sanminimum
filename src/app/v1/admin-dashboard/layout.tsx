import type { PropsWithChildren } from 'react'

import AdminDashboardLayout from '@/components/admin-dashboard-layout/AdminDashboardLayout'

export default function Layout({ children }: PropsWithChildren<unknown>) {
	return <AdminDashboardLayout>{children}</AdminDashboardLayout>
}
