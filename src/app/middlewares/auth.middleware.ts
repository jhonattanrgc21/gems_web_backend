import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

// ======================================
//			Auth Middleware
// ======================================
export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
	const token = <string>req.headers['auth-token'];
	let jwtPayload;

	try {
		jwtPayload = <any>jwt.verify(token, process.env.SECRET_HEY || 'JG-DEV');
		res.locals.jwtPayload = jwtPayload;
	} catch (error) {
		return res.status(401).json({ message: 'No esta autorizado' });
	}

	const { id, email } = jwtPayload;

	const newToken = jwt.sign(
		{ id, email },
		process.env.SECRET_HEY || 'JG-DEV',
		{ expiresIn: '1h' },
	);

	res.setHeader('token', newToken);

	/// creating Cookie in Client machine for Auth
	res.cookie('jwt', newToken, {
		expires: new Date(Date.now() + (process.env.SECRET_HEY || 'JG-DEV')),
		// secure:true,
		httpOnly: true,
	});
	/// creating Cookie of Logged user Details in claint machine
	res.cookie('user', jwtPayload, {
		expires: new Date(Date.now() + (process.env.SECRET_HEY || 'JG-DEV')),
	});

	next();
}
