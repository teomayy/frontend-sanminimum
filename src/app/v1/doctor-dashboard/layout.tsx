import type { PropsWithChildren } from 'react'

import DoctorDashboardLayout from '@/components/doctor-dashboard-layout/DoctorDashboardLayout'

export default function Layout({ children }: PropsWithChildren<unknown>) {
	return <DoctorDashboardLayout>{children}</DoctorDashboardLayout>
}
