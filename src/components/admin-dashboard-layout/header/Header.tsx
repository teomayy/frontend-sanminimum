import { GlobalLoader } from '../../doctor-dashboard-layout/header/GlobalLoader'

import { Profile } from './profile/Profile'

export function Header() {
	return (
		<header>
			<GlobalLoader />
			<Profile />
		</header>
	)
}
