import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Report from '../database/entities/report.entity';
import User from '../database/entities/user.entity';

// ======================================
//			Report Controller
// ======================================
export default class ReportController {
	static getAll = async (req: Request, res: Response) => {
		let reports;
		try {
			// Verifico si existen reportes
			reports = await getRepository(Report).find({
				select: [
					'current',
					'cable_width',
					'pipe_diameter',
					'protection_device',
					'voltaje_drop'
				]
			});
		} catch (error) {
			// En caso contrario, envio un error.
			return res.status(404).json({
				message: 'Algo salio mal.',
			});
		}

		if (reports.length)
			// Si hay reportes, devuelvo sus nombres
			res.json(reports);
		// En caso contrario, envio un error.
		else
			return res.status(404).json({
				message: 'Error, no existen reportes.',
			});
	};

	static listForm = (req: Request, res: Response) => {
		const calculos = {
			current: (Math.floor(Math.random() * 2000) + 1).toString(),
			cable_width: (Math.floor(Math.random() * 2000) + 1).toString(),
			pipe_diameter: (Math.floor(Math.random() * 2000) + 1).toString(),
			protection_device: ( Math.floor(Math.random() * 2000) + 1).toString(),
			voltaje_drop: (Math.floor(Math.random() * 2000) + 1).toString()
		};

		return res.json(calculos);
	}

	static getAllUser = async (req: Request, res: Response) => {
		let reports;
		let { id } = res.locals.jwtPayload;
		const user = await getRepository(User).findOne(id);
		try {
			// Verifico si existen reportes
			reports = await getRepository(Report).find({
				select: [
					'current',
					'cable_width',
					'pipe_diameter',
					'protection_device',
					'voltaje_drop',
				],
				where: { user },
				relations: ['user'],
			});
		} catch (error) {
			// En caso contrario, envio un error.
			return res.status(404).json({
				message: 'Algo salio mal.',
			});
		}

		if (reports.length)
			// Si existen reportes, devuelvo sus datos
			res.json(reports);
		// En caso contrario, envio un error.
		else
			return res.status(404).json({
				message: 'Error, no existen reportes.',
			});
	};

	static getById = async (req: Request, res: Response) => {
		const { id } = req.params;
		try {
			// Si existe el reporte, devuelvo sus datos.
			const report = await getRepository(Report).findOneOrFail(id, {
				select: [
					'current',
					'cable_width',
					'pipe_diameter',
					'protection_device',
					'voltaje_drop',
				],
			});
			res.json(report);
		} catch (error) {
			// En caso contrario, envio un error.
			return res.status(404).json({
				message: 'Error, el reporte no existe.',
			});
		}
	};

	static newReport = async (req: Request, res: Response) => {
		const {
			current,
			cable_width,
			pipe_diameter,
			protection_device,
			voltaje_drop,
		} = req.body;
		const { id } = res.locals.jwtPayload;

		// Validando que vienen datos del Front-End
		if (!(current && cable_width && pipe_diameter && protection_device && voltaje_drop))
			return res
				.status(400)
				.json({ message: 'Todos los campos son requeridod.' });

		let report = new Report();
		let user: User;
		report.current = current;
		report.cable_width = cable_width;
		report.pipe_diameter = pipe_diameter;
		report.protection_device = protection_device;
		report.voltaje_drop = voltaje_drop;

		try {
			// Buscar al usuario correspodiente
			user = await getRepository(User).findOneOrFail(id);
		} catch (error) {
			// En caso contrario, envio un error.
			return res.status(401).json({
				message: 'Error, el usuario no existe.',
			});
		}

		report.user = user;

		try {
			// Si no hay errores, guardo el registro de proyectos
			await getRepository(Report).save(report);
		} catch (error) {
			// En caso contrario, envio un error.
			return res.status(409).json({
				message: 'Error, ya existe un reporte con estos datos.',
			});
		}

		res.status(201).json({
			message: 'Reporte registrado con exito.',
		});
	};

	static editReport = async (req: Request, res: Response) => {
		const { id } = req.params;
		const { current, cable_width, pipe_diameter, protection_device, voltaje_drop} = req.body;

		let report: Report;
		try {
			// Si existe el reporte, actualizo sus datos.
			report = await getRepository(Report).findOneOrFail(id);
			report.current = current;
			report.cable_width = cable_width;
			report.pipe_diameter = pipe_diameter;
			report.protection_device = protection_device;
			report.voltaje_drop = voltaje_drop;
		} catch (error) {
			// En caso contrario, envio un error.
			return res.status(404).json({
				message: 'Error, el reporte no existe.',
			});
		}

		try {
			// Si no hay errores, guardo el registro de Usuario
			await getRepository(Report).save(report);
		} catch (error) {
			// En caso contrario, envio un error.
			return res.status(409).json({
				message: 'Error, el reporte ya esta en uso.',
			});
		}

		return res.status(201).json('Reporte actualizado con exito.');
	};

	static deleteReport = async (req: Request, res: Response) => {
		const { id } = req.params;

		try {
			// Verifico si el reporte existe.
			await getRepository(Report).findOneOrFail(id);
		} catch (error) {
			// En caso contrario, envio un error.
			return res.status(404).json({
				message: 'Error, el reporte no existe.',
			});
		}

		await getRepository(Report).delete(id);

		res.status(201).json({
			message: 'Reporte eliminado con exito.',
		});
	};
}
