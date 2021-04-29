import Country from "../../database/entities/countries.entity";

// ======================================
//			User Interface
// ======================================
export interface RegisterUserInterface {
	username: string;
	email: string;
	password: string;
	first_name: string;
	last_name: string;
	profesionalID?: number;
	phone?: string;
	idioma: string;
}

export interface CreateUserInterface {
	username: string;
	email: string;
	password: string;
	first_name: string;
	last_name: string;
}

export interface UpdateUserInterface {
	email?: string;
	first_name?: string;
	last_name?: string;
	phone?: string;
	address?: string;
	profesionalID?: number;
	company?: string;
	status?: boolean;
	country?: Country;
}
