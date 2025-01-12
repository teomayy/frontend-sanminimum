class DASHBOARD {
	private root = '/v1'

	HOME = `${this.root}`
	HOME_DOCTOR = `${this.root}/doctor-dashboard`
	APPLICATIONS = `${this.HOME_DOCTOR}/reports`
	SETTINGS_DOCTOR = `${this.HOME_DOCTOR}/settings`
	CREATE_REPORT = `${this.HOME_DOCTOR}/create-reports`

	HOME_ADMIN = `${this.root}/admin-dashboard`
	DOCTORS = `${this.HOME_ADMIN}/doctors`
	REPORTS = `${this.HOME_ADMIN}/reports`
	SETTINGS_ADMIN = `${this.HOME_ADMIN}/settings`
}

export const DASHBOARD_PAGES = new DASHBOARD()
