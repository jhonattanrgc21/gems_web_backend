import Country from "../../database/entities/country.entity";

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
}

export interface UpdateUserInterface {
	email?: string;
	first_name?: string;
	last_name?: string;
	phone?: string;
	address?: string;
	profesionalID?: number;
	country?: Country;
}
