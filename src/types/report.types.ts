export interface IReport {
	id: string
	fullName: string
	birthDate: string
	workplace: string
	position: string
	phone: string
	certificateId: string
	issueDate: string
	expiryDate: string
	isDeleted: boolean
	createdAt: string
	updatedAt: string
}

export interface ICreateReportDto {
	fullName: string
	birthDate: string
	workplace: string
	position: string
	phone: string
	certificateId: string
	issueDate: string
}
