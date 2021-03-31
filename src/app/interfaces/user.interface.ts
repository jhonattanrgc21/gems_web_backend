import Country from "../../database/entities/countries.entity";

// ======================================
//			User Interface
// ======================================
export interface CreateUserInterface {
	username: string;
	email: string;
	password: string;
	first_name: string;
	last_name: string;
	profesionalID?: number;
	status?: boolean;
}

export interface UpdateUserInterface {
	email?: string;
	first_name?: string;
	last_name?: string;
	phone?: string;
	address?: string;
	profesionalID?: number;
	status?: boolean;
	country?: Country;
}
