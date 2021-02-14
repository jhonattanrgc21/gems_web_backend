import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import User from '../database/entities/user.entity';
import Country from '../database/entities/country.entity';

// ======================================
//			User Controller
// ======================================
export default class UserController {
	static getAll = async (req: Request, res: Response) => {
		let users;

		try {
			// Verifico si existen usuarios
			users = await getRepository(User).find({
				select: [
					'id',
					'email',
					'username',
					'first_name',
					'last_name'
				]
			});
		} catch (e) {
			// En caso contrario, envio un error.
			return res.status(404).json({
				message: 'Algo salio mal.',
			});
		}

		if (users.length)
			// Si existen usuarios, devuelvo sus datos
			res.json(users);
		else
			// En caso contrario, envio un error.
			return res.status(404).json({
				message: 'Error, no existen usuarios.',
			});
	};

	static getById = async (req: Request, res: Response) => {
		const { id } = req.params;
		try {
			// Si existe el usuario, devuelvo sus datos.
			const user = await getRepository(User).findOneOrFail(id, {
				select: [
					'email',
					'username',
					'first_name',
					'last_name',
					'phone',
					'address',
					'profesionalID',
					'country'
				],
				relations: ['country'],
			});
			res.json(user);
		} catch (error) {
			// En caso contrario, envio un error.
			return res.status(404).json({
				message: 'Error, el usuario no existe.',
			});
		}
	};

	static newUser = async (req: Request, res: Response) => {
		const {
			username,
			email,
			password,
			first_name,
			last_name,
			country,
			phone,
			address,
			profesionalID,
		} = req.body;

		// Validando que vienen datos del Front-End
		if (!(username && email && password && first_name && last_name && profesionalID))
			return res
				.status(400)
				.json({ message: 'Todos los campos son requeridos.' });

		let user = new User();

		user.username = username;
		user.email = email;
		user.password = password;
		user.first_name = first_name;
		user.last_name = last_name;
		user.profesionalID = profesionalID;
		user.phone = phone;
		user.address = address;

		if (country) {
			let pais: Country;
			try {
				// Verificar si el pais existe
				pais = await getRepository(Country).findOneOrFail(country);
			} catch (error) {
				// En caso contrario, envio un error.
				return res.status(401).json({
					message: 'Error, este pais no esta registrado..',
				});
			}
			user.country = pais;
		}


		try {
			// Si no hay errores, guardo el registro de Usuario
			user.encryptPassword();
			await getRepository(User).save(user);
		} catch (error) {
			// En caso contrario, envio un error.
			return res.status(409).json({
				message: 'Error, ya existe un usuario con este email.',
			});
		}

		res.status(201).json({
			message: 'Usuario registrado con exito.',
		});
	};

	static editUser = async (req: Request, res: Response) => {
		const { id } = req.params;
		const {
			email,
			first_name,
			last_name,
			phone,
			address,
			profesionalID,
			country,
		} = req.body;

		let user: User;
		try {
			// Si existe el usuario, actualizo sus datos.
			user = await getRepository(User).findOneOrFail(id);
			if (email) user.email = email;

			if (first_name) user.first_name = first_name;

			if (last_name) user.last_name = last_name;

			if (phone) user.phone = phone;

			if (address) user.address = address;

			user.profesionalID = profesionalID;

			if (country) {
				let pais: Country;
				try {
					// Verificar si el pais existe
					pais = await getRepository(Country).findOneOrFail(country);
				} catch (error) {
					// En caso contrario, envio un error.
					return res.status(401).json({
						message: 'Error, este pais no esta registrado..',
					});
				}
				user.country = pais;
			}
		} catch (error) {
			// En caso contrario, envio un error.
			return res.status(404).json({
				message: 'Error, el usuario no existe.',
			});
		}

		try {
			// Si no hay errores, guardo el registro de Usuario
			await getRepository(User).save(user);
		} catch (error) {
			// En caso contrario, envio un error.
			return res.status(409).json({
				message: 'Error, el usuario ya esta en uso.',
			});
		}

		return res.status(201).json('Usuario actualizado con exito.');
	};

	static deleteUser = async (req: Request, res: Response) => {
		const { id } = req.params;

		try {
			// Verifico si el usuario existe.
			await getRepository(User).findOneOrFail(id);
		} catch (error) {
			// En caso contrario, envio un error.
			return res.status(404).json({
				message: 'Error, el usuario no existe.',
			});
		}

		await getRepository(User).delete(id);

		res.status(201).json({
			message: 'Usuario eliminado con exito.',
		});
	};
}
