export interface IAuthForm {
	login: string
	password: string
}

export interface IUser {
	id: number
	name?: string
	login: string
}

export interface IAuthResponse {
	accessToken: string
	doctor: IUser
}

export type TypeUserForm = Omit<IUser, 'id'> & { password?: string }
