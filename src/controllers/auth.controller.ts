import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import jwt from 'jsonwebtoken';
import User from '../database/entities/users.entity';
import { transporter } from '../config/mailer';

// ======================================
//			Auth Controller
// ======================================
export default class AuthController {
	static register = async (req: Request, res: Response) => {
		let {
			username,
			email,
			password,
			first_name,
			last_name,
			profesionalID,
			phone,
			idioma,
		} = req.body;

		let user;
		const message =
			'Revise su correo electrónico para obtener un enlace para confirmar su registro.';
		let emailStatus = 'Ok';

		// Validando que vienen datos del Front-End
		if (
			!(
				username &&
				email &&
				password &&
				first_name &&
				last_name &&
				phone &&
				idioma
			)
		)
			return res
				.status(400)
				.json({ message: 'Todos los campos son requeridos.' });

		if (idioma != 'es' && idioma != 'en')
			res.status(400).json({
				message: 'Error, el idioma no es valido.',
			});

		// Validando por username
		user = await getRepository(User).findOne({ username });
		if (user)
			return res.status(409).json({
				message: 'Error, ya existe un usuario con este username.',
			});

		// Validando por email
		user = await getRepository(User).findOne({ email });
		if (user)
			return res.status(409).json({
				message: 'Error, ya existe un usuario con este email.',
			});

		if (profesionalID) {
			// Validando por profesionalID
			user = await getRepository(User).findOne({ profesionalID });
			if (user)
				return res.status(409).json({
					message:
						'Error, ya existe un usuario con este profesionalID.',
				});
		}

		if (phone) {
			// Validando por numero de telefono
			user = await getRepository(User).findOne({ phone });
			if (user)
				return res.status(409).json({
					message:
						'Error, ya existe un usuario con este numero de telefono.',
				});
		}


		let entity = new User();
		entity.username = username;
		entity.email = email;
		entity.password = password;
		entity.first_name = first_name;
		entity.last_name = last_name;
		entity.profesionalID = profesionalID ? profesionalID : null;
		entity.phone = phone;

		// Genero un nuevo token que expira en 10 minutos para cambiar la contraseña
		const token = jwt.sign(
			{ id: entity.id, email: entity.email },
			process.env.SECRET_KEY_RESET || 'JG-DEV123',
			{ expiresIn: '6d' },
		);

		let verificacionLink = `http://localhost:3004/message/${token}`;
		entity.confirmToken = token;

		try {
			// Si no hay errores, guardo el registro de Usuario
			await getRepository(User).save(entity);
		} catch (error) {
			// En caso contrario, envio un error.
			return res.status(404).json({
				message: 'Algo salio mal.',
			});
		}

		/*
			En esta seccion se procede a enviar el correo de confirmacion
		*/
		let texto: string;
		let asunto: string;

		if (idioma === 'en') {
			texto =
				'Please click on the following link or place it in your browser to complete the registration process:';
			asunto = 'Confirmation of registration';
		} else {
			texto =
				'Por favor haga click sobre el siguiente enlace o coloquelo en el navegador para completar el proceso de registro:';
			asunto = 'Confirmacion de registro';
		}

		try {
			await transporter.sendMail({
				from: '"Emprendimiento T-Board" <jhonattanrgc21@gmail.com>', // sender address
				to: entity.email, // list of receivers
				subject: `${asunto} ✔`, // Subject line
				html: `
				<b>${texto} </b>
				<a href= "${verificacionLink}">${verificacionLink}</a>
				`,
			});
		} catch (error) {
			emailStatus = error;
			res.status(400).json({ message: 'Algo salio mal.' });
		}

		res.status(201).json({ message, info: emailStatus });
	};

	static verifyUser = async (req: Request, res: Response) => {
		const confirmToken = req.headers.confirm as string;

		if (!confirmToken)
			return res.status(400).json({ message: 'Algo salio mal.' });

		let jwtPayload;
		let user: User;
		try {
			jwtPayload = jwt.verify(
				confirmToken,
				process.env.SECRET_KEY_RESET || 'JG-DEV123',
			);
			user = await getRepository(User).findOneOrFail({
				confirmToken,
			});
		} catch (error) {
			res.status(400).json({ message: 'Algo salio mal.' });
		}

		if (user.status)
			return res.status(404).json({
				message: 'Error, este usuario ya esta verificado.',
			});

		user.status = true;

		try {
			// Si no hay errores, guardo el registro de Usuario
			await getRepository(User).save(user);
		} catch (error) {
			// En caso contrario, envio un error.
			return res.status(404).json({
				message:
					'Algo salio mal al modificar el estatus de activacion.',
			});
		}

		res.json({ message: 'Su cuenta fue verificada exitosamente.' });
	};

	static resendVerification = async (req: Request, res: Response) => {
		const { email, idioma } = req.body;
		const message =
			'Revise su correo electrónico para obtener un enlace para confirmar su registro.';
		let emailStatus = 'Ok';
		let user: User;

		if (!(email && idioma))
			res.status(400).json({
				message: 'Todos los campos son requeridos.',
			});

		if (idioma != 'es' && idioma != 'en')
			res.status(400).json({
				message: 'Error, el idioma no es valido.',
			});

		try {
			// Validando por email
			user = await getRepository(User).findOneOrFail({ email });
		} catch (error) {
			try {
				// Validando por username
				user = await getRepository(User).findOneOrFail({
					username: email,
				});
			} catch (error) {
				return res.status(400).json({
					message: 'Error, este usuario no esta registrado.',
				});
			}
		}

		if (!user.status)
			return res.status(400).json({
				message: 'Error, este usuario ya esta verificado.',
			});

		// Genero un nuevo token que expira en 10 minutos para cambiar la contraseña
		const token = jwt.sign(
			{ id: user.id, email: user.email },
			process.env.SECRET_KEY_RESET || 'JG-DEV123',
			{ expiresIn: '30d' },
		);

		let verificacionLink = `http://localhost:3004/message/${token}`;

		user.confirmToken = token;

		try {
			// Si no hay errores, guardo el registro de Usuario
			await getRepository(User).save(user);
		} catch (error) {
			// En caso contrario, envio un error.
			return res.status(404).json({
				message: 'Algo salio mal.',
			});
		}

		/*
			En esta seccion se procede a enviar el correo de confirmacion
		*/
		let texto: string;
		let asunto: string;

		if (idioma === 'en') {
			texto =
				'Please click on the following link or place it in your browser to complete the registration process:';
			asunto = 'Confirmation of registration';
		} else {
			texto =
				'Por favor haga click sobre el siguiente enlace o coloquelo en el navegador para completar el proceso de registro:';
			asunto = 'Confirmacion de registro';
		}

		try {
			await transporter.sendMail({
				from: '"Emprendimiento T-Board" <jhonattanrgc21@gmail.com>', // sender address
				to: user.email, // list of receivers
				subject: `${asunto} ✔`, // Subject line
				html: `
				<b>${texto} </b>
				<a href= "${verificacionLink}">${verificacionLink}</a>
				`,
			});
		} catch (error) {
			emailStatus = error;
			res.status(400).json({ message: 'Algo salio mal.' });
		}

		res.status(201).json({ message, info: emailStatus });
	};

	static login = async (req: Request, res: Response) => {
		const { email, password } = req.body;

		// Validando los datos que vienen del Front-End
		if (!(email && password))
			return res.status(400).json({
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

		if (!user.status)
			return res.status(404).json({
				message: 'Error, este usuario no esta verificado.',
			});

		const token = jwt.sign(
			{ id: user.id, email: user.email },
			process.env.SECRET_KEY || 'JG-DEV',
			{ expiresIn: '6d' },
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
			return res.status(401).json({
				message: 'La contraseña actual no coincide.',
			});

		// Si la contraseña actual es correcta, la actualizo
		user.password = newPassword;
		user.encryptPassword();
		await getRepository(User).save(user);

		res.json({ message: 'Contraseña actualizada con exito.' });
	};

	static forgotPassword = async (req: Request, res: Response) => {
		const { email, idioma } = req.body;

		// Validando mlos datos que vienen del Front-End
		if (!(email && idioma))
			return res.status(400).json({
				message: 'Todos los campos son requeridos.',
			});

		if (idioma != 'es' && idioma != 'en')
			res.status(400).json({
				message: 'Error, el idioma no es valido.',
			});

		const message =
			'Revise su correo electrónico para obtener un enlace para restablecer su contraseña.';
		let emailStatus = 'Ok';
		let user: User;

		try {
			// Validando el email
			user = await getRepository(User).findOneOrFail({ email });
		} catch (error) {
			return res.status(400).json({
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

		let texto: string;
		let asunto: string;

		if (idioma === 'en') {
			texto =
				'Please click on the following link or place it in your browser to complete the registration process:';
			asunto = 'Password recovery';
		} else {
			texto =
				'Por favor haga click sobre el siguiente enlace o coloquelo en el navegador para completar el proceso de registro:';
			asunto = 'Recuperacion de contraseñao';
		}
		try {
			await transporter.sendMail({
				from: '"Emprendimiento T-Board" <jhonattanrgc21@gmail.com>', // sender address
				to: user.email, // list of receivers
				subject: `${asunto} ✔`, // Subject line
				html: `
				<b>${texto} </b>
				<a href= "${verificacionLink}">${verificacionLink}</a>
				`,
			});
		} catch (error) {
			emailStatus = error;
			return res.status(400).json({ message: 'Algo salio mal.' });
		}

		// Guardo el nuevo token del usuario
		try {
			user = await getRepository(User).save(user);
		} catch (error) {
			emailStatus = error;
			return res.status(400).json({ message: 'Algo salio mal.' });
		}

		res.status(201).json({ message, info: emailStatus });
	};

	static forgotPasswordSms = async (req: Request, res: Response) => {
		const { phone, idioma } = req.body;

		// Validando mlos datos que vienen del Front-End
		if (!(phone && idioma))
			return res.status(400).json({
				message: 'Todos los campos son requeridos.',
			});

		if (idioma != 'es' && idioma != 'en')
			res.status(400).json({
				message: 'Error, el idioma no es valido.',
			});

		let user: User;

		try {
			// Validando por phone
			user = await getRepository(User).findOneOrFail({ phone });
		} catch (error) {
			return res.status(400).json({
				message: 'Error, este usuario no esta registrado..',
			});
		}

		// Genero un nuevo token que expira en 5 minutos para cambiar la contraseña
		const token = jwt.sign(
			{ id: user.id, email: user.email },
			process.env.SECRET_KEY_RESET || 'JG-DEV123',
			{ expiresIn: '5m' },
		);

		const code = (Math.floor(Math.random() * 2000) + 1).toString();
		user.code = code;
		user.resetToken = token;

		// Guardo el nuevo token del usuario
		try {
			user = await getRepository(User).save(user);
		} catch (error) {
			return res.status(400).json({ message: 'Algo salio mal.' });
		}

		res.json({ message: 'OK', token });
	};

	static verifyCode = async (req: Request, res: Response) => {};

	static createNewPassword = async (req: Request, res: Response) => {
		const { password, confirmPassword, idioma } = req.body;
		const resetToken = req.headers.reset as string;

		// Validando los datos que vienen del Front-End
		if (!(password && confirmPassword && idioma && resetToken)) {
			return res.status(400).json({
				message: 'Todos los campos son requeridos.',
			});
		}

		if (password != confirmPassword) {
			return res.status(401).json({
				message: 'Error, las contraseñas no coinciden.',
			});
		}

		if (idioma != 'es' && idioma != 'en')
			res.status(400).json({
				message: 'Error, el idioma no es valido.',
			});

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

		/*
			En esta seccion se procede a enviar el correo de recuperacion
		*/
		let texto: string;
		let asunto: string;

		if (idioma === 'en') {
			texto = 'Your password was successfully changed:';
			asunto = 'Change of password';
		} else {
			texto = 'Su contraseña fue cambiada exitosamente.';
			asunto = 'Cambio de contraseña';
		}
		try {
			await transporter.sendMail({
				from: '"Emprendimiento T-Board" <jhonattanrgc21@gmail.com>', // sender address
				to: user.email, // list of receivers
				subject: `${asunto} ✔`, // Subject line
				html: `
				<b>${texto} </b>
				`,
			});
		} catch (error) {
			return res.status(400).json({ message: 'Algo salio mal.' });
		}

		res.json({ message: 'Contraseña creada con exito.' });
	};
}
