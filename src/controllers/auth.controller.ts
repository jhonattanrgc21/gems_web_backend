import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import jwt from 'jsonwebtoken';
import User from '../database/entities/user.entity';
import { transporter } from '../config/mailer';

// ======================================
//			Auth Controller
// ======================================
export default class AuthController {
	static login = async (req: Request, res: Response) => {
		const { email, password } = req.body;

		// Validando los datos que vienen del Front-End
		if (!(email && password))
			res.status(400).json({
				message: 'Todos los datos son requeridos.',
			});

		let user: User;
		try {
			// Validando el email
			user = await getRepository(User).findOneOrFail({ email });
		} catch (error) {
			try {
				// Validando el username
				user = await getRepository(User).findOneOrFail({
					username: email,
				});
			} catch (error) {
				res.status(400).json({
					message: 'Email o username icorrecto.',
				});
			}
		}

		// Validando la contraseña
		if (!user.matchPassword(password)) {
			return res.status(400).json({
				message: 'Contraseña incorrecta.',
			});
		}

		const token = jwt.sign(
			{ id: user.id, email: user.email },
			process.env.SECRET_KEY || 'JG-DEV',
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

	static forgotPassword = async (req: Request, res: Response) => {
		const { email } = req.body;

		// Validando mlos datos que vienen del Front-End
		if (!email)
			res.status(400).json({
				message: 'El email es requerido.',
			});

		const message =
			'Revise su correo electrónico para obtener un enlace para restablecer su contraseña.';
		let emailStatus = 'Ok';
		let user: User;

		try {
			// Validando el email
			user = await getRepository(User).findOneOrFail({ email });
		} catch (error) {
			res.status(400).json({
				message: 'Error, este usuario no esta registrado..',
			});
		}

		// Genero un nuevo token que expira en 10 minutos para cambiar la contraseña
		const token = jwt.sign(
			{ id: user.id, email: user.email },
			process.env.SECRET_KEY_RESET || 'JG-DEV123',
			{ expiresIn: '10m' },
		);

		let verificacionLink = `http://localhost:3004/change/${token}`;
		user.resetToken = token;

		/*
			En esta seccion se procede a enviar el correo de recuperacion
		*/
		try {
			await transporter.sendMail({
				from: '"Emprendimiento T-Board" <jhonattanrgc21@gmail.com>', // sender address
				to: user.email, // list of receivers
				subject: 'Recuperacion de contraseña ✔', // Subject line
				html: `
				<b>Por favor haga click sobre el siguiente enlace o coloquelo en el navegador para completar el proceso de recuperacion: </b>
				<a href= "${verificacionLink}">${verificacionLink}</a>
				`,
			});
		} catch (error) {
			emailStatus = error;
			res.status(400).json({ message: 'Algo salio mal.' });
		}

		// Guardo el nuevo token del usuario
		try {
			user = await getRepository(User).save(user);
		} catch (error) {
			emailStatus = error;
			res.status(400).json({ message: 'Algo salio mal.' });
		}

		res.status(201).json({ message, info: emailStatus });
	};

	static createNewPassword = async (req: Request, res: Response) => {
		const { password, confirmPassword } = req.body;
		const resetToken = req.headers.reset as string;

		// Validando los datos que vienen del Front-End
		if (!(password && confirmPassword && resetToken)) {
			return res.status(400).json({
				message: 'Todos los campos son requeridos.',
			});
		}

		if (password != confirmPassword) {
			return res.status(401).json({
				message: 'Error, las contraseñas no coinciden.',
			});
		}

		let jwtPayload;
		let user: User;
		try {
			jwtPayload = jwt.verify(
				resetToken,
				process.env.SECRET_KEY_RESET || 'JG-DEV123',
			);
			user = await getRepository(User).findOneOrFail({ resetToken });
		} catch (error) {
			res.status(400).json({ message: 'Algo salio mal.' });
		}

		user.password = password;
		console.log(user.password);
		try {
			// Si no hay errores, guardo el registro de Usuario
			user.encryptPassword();
			await getRepository(User).save(user);
		} catch (error) {
			// En caso contrario, envio un error.
			return res.status(404).json({
				message: 'Algo salio mal al guardar el password.',
			});
		}

		res.json({ message: 'Contraseña creada con exito.' });
	};
}
