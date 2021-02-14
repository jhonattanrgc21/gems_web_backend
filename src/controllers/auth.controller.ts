import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import jwt from 'jsonwebtoken';
import User from '../database/entities/user.entity';

// ======================================
//			Auth Controller
// ======================================
export default class AuthController {
	static login = async (req: Request, res: Response) => {
		const { email, password } = req.body;

		// Validando los datos que vienen del Front-End
		if (!(email && password))
			res.status(400).json({ message: 'Email y Password requerido.' });

		let user: User;
		try {
			// Validando el email
			user = await getRepository(User).findOneOrFail({
				where: { email },
			});
		} catch (error) {
			res.status(400).json({ message: 'Email icorrecto.' });
		}

		// Validando la contraseña
		if (!user.matchPassword(password)) {
			return res.status(400).json({
				message: 'Contraseña incorrecta.',
			});
		}

		const token = jwt.sign(
			{ id: user.id, email: user.email },
			process.env.SECRET_HEY || 'JG-DEV',
			{ expiresIn: '1h' },
		);

		/* Si el usuario esta registrado le envio
			el token al Front-End */
		res.json({ message: 'OK', token });
	};

	static changePassword = async (req: Request, res: Response) => {
		const { id } = res.locals.jwtPayload;
		const { password, newPassword } = req.body;

		// Validando que vienen datos del Front-End
		if (!(password && newPassword))
			return res
				.status(400)
				.json({ message: 'Los dos campos son requeridos.' });

		let user: User;
		try {
			user = await getRepository(User).findOneOrFail(id);
		} catch (error) {
			res.status(400).json({ message: 'Algo salio mal.' });
		}

		// Si el usuario existe, verifico su contraseña actual
		if (!user.matchPassword(password))
			res.status(401).json({
				message: 'La contraseña actual no coincide.',
			});

		// Si la contraseña actual es correcta, la actualizo
		user.password = newPassword;
		user.encryptPassword();
		await getRepository(User).save(user);

		res.json({ message: 'Contraseña actualizada con exito.' });
	};

	static logout = (req: Request, res: Response) => {
		res.clearCookie('jwt');
		res.clearCookie('user');
	};
}
