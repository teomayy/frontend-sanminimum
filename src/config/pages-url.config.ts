class DASHBOARD {
	private root = '/v1'

	HOME = this.root
	APPLICATIONS = `${this.root}/reports`
	SETTINGS = `${this.root}/settings`
	CREATE_REPORT = `${this.root}/create-reports`
}

export const DASHBOARD_PAGES = new DASHBOARD()
