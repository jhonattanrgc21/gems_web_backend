import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import {
	CreateUserInterface,
	UpdateUserInterface,
} from '../app/interfaces/user.interface';
import User from '../database/entities/users.entity';

// ======================================
//			User Service
// ======================================
export default class UserServices {
	// ======================================
	//			Crear Usuaris
	// ======================================
	public async created(req: Request, res: Response) {
		const input: CreateUserInterface = req.body;
		let user;

		// Validando los datos que vienen del front
		if (
			!(
				input.username &&
				input.email &&
				input.password &&
				input.first_name &&
				input.last_name
			)
		)
			return res
				.status(400)
				.json({ message: 'Todos los campos son requeridos.' });

		let entity = new User();
		entity.username = input.username;
		entity.email = input.email;
		entity.password = input.password;
		entity.first_name = input.first_name;
		entity.last_name = input.last_name;
		entity.status = true;

		try {
			// Si no hay errores, guardo el registro de Usuario
			entity.encryptPassword();
			await getRepository(User).save(entity);

			res.status(201).json({
				message: 'Usuario registrado con exito.',
			});
		} catch (error) {
			// En caso contrario, envio un error.
			return res.status(404).json({
				message: 'Error, no se pudo guardar el registro del usuario..',
			});
		}
	}

	// ======================================
	//		Buscar Todos los Uusuarios
	// ======================================
	public async findAll(req: Request, res: Response) {
		let users;
		users = await getRepository(User).find({
			select: [
				'id',
				'email',
				'username',
				'first_name',
				'last_name',
				'profesionalID',
				'company',
				'phone',
				'status',
			],
			relations: ['country', 'projects'],
		});

		// Si existen usuarios, devuelvo sus datos
		if (users.length) res.json(users);
		else
			return res.status(404).json({
				message: 'Error, no existen usuarios registrados.',
			});
	}

	// ======================================
	//		Buscar Usuario Por ID
	// ======================================
	public async findById(req: Request, res: Response) {
		const id: string = req.params.id;
		try {
			// Si existe el usuario, devuelvo sus datos.
			const user = await getRepository(User).findOneOrFail(id, {
				relations: ['country', 'projects'],
			});
			delete user.password;
			delete user.confirmToken;
			delete user.resetToken;
			res.json(user);
		} catch (error) {
			return res.status(404).json({
				message: 'Error, este usuario no existe.',
			});
		}
	}

	// ======================================
	//		Buscar Usuario Por Email
	// ======================================
	public async findByEmail(req: Request, res: Response) {
		const email: string = req.body.email;
		try {
			// Si existe el usuario, devuelvo sus datos.
			const user = await getRepository(User).findOneOrFail({ email });
			delete user.password;
			delete user.confirmToken;
			delete user.resetToken;
		} catch (error) {
			return res.status(404).json({
				message: 'Error, este usuario no existe.',
			});
		}
	}

	// ======================================
	//		Buscar Usuario Por Username
	// ======================================
	public async findByUsername(req: Request, res: Response) {
		const username: string = req.body.username;
		try {
			// Si existe el usuario, devuelvo sus datos.
			const user = await getRepository(User).findOneOrFail({ username });
			delete user.password;
			delete user.confirmToken;
			delete user.resetToken;
			res.json(user);
		} catch (error) {
			return res.status(404).json({
				message: 'Error, este usuario no existe.',
			});
		}
	}

	// ======================================
	//	Buscar Usuario Por ProfesionalID
	// ======================================
	public async findByProfesionalID(req: Request, res: Response) {
		const profesionalID: number = req.body.profesionalID;
		try {
			// Si existe el usuario, devuelvo sus datos.
			const user = await getRepository(User).findOneOrFail({
				profesionalID,
			});
			delete user.password;
			delete user.confirmToken;
			delete user.resetToken;
			res.json(user);
		} catch (error) {
			return res.status(404).json({
				message: 'Error, este usuario no existe.',
			});
		}
	}

	// ======================================
	//			Actualizar Usuario
	// ======================================
	public async updated(req: Request, res: Response) {
		const id: string = req.params.id;
		const input: UpdateUserInterface = req.body;
		let entity: User;

		try {
			// Si existe el usuario, actualizo sus datos.
			entity = await getRepository(User).findOneOrFail(id);

			// Validando por email
			if (input.email) {
				const user = await getRepository(User).findOne(input.email);
				if (user)
					return res.status(409).json({
						message: 'Error, ya existe un usuario con este email.',
					});
				entity.email = input.email;
			}

			entity.first_name = input.first_name
				? input.first_name
				: entity.first_name;

			entity.last_name = input.last_name
				? input.last_name
				: entity.last_name;

			entity.phone = input.phone ? input.phone : entity.phone;
			entity.address = input.address ? input.address : entity.address;
			entity.profesionalID = input.profesionalID
				? input.profesionalID
				: entity.profesionalID;
			entity.company = input.company ? input.company : entity.company;
			entity.status = input.status ? input.status : entity.status;
			entity.country = input.country ? input.country : entity.country;
		} catch (error) {
			return res.status(404).json({
				message: 'Error, el usuario no esta registrado.',
			});
		}

		try {
			// Si no hay errores, guardo el registro de Usuario
			await getRepository(User).save(entity);
		} catch (error) {
			// En caso contrario, envio un error.
			return res.status(409).json({
				message:
					'Error, ya existe un usuario con este profesionalID o numero de telefono.',
			});
		}

		res.status(201).json({
			message: 'Usuario actualizado con exito.',
		});
	}

	// ======================================
	//			Eliminarr Usuario
	// ======================================
	public async deleted(req: Request, res: Response) {
		const id: string = req.params.id;

		try {
			// Verifico si el usuario existe.
			await getRepository(User).findOneOrFail(id);
		} catch (error) {
			return res.status(404).json({
				message: 'Error, el usuario no existe.',
			});
		}

		await getRepository(User).delete(id);

		res.status(201).json({
			message: 'Usuario eliminado con exito.',
		});
	}
}
