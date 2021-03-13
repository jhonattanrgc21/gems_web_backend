import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import Report from '../database/entities/report.entity';

import { ReportInterface } from '../app/interfaces/report.interface';

// ======================================
//			Report Controller
// ======================================
export default class CircuitController {
	static getAll = async (req: Request, res: Response) => {
		let reports;

		// Verifico si existen reportes
		reports = await getRepository(Report).find({
			relations: ['circuit'],
		});

		if (reports.length)
			// Si hay reportes, devuelvo sus datos
			res.json(reports);
		// En caso contrario, envio un error.
		else
			return res.status(404).json({
				message: 'Error, no existen reportes registrados.',
			});
	};

	static listForm = (req: Request, res: Response) => {
		const calculos = {
			current: (Math.floor(Math.random() * 2000) + 1).toString(),
			cable_width: (Math.floor(Math.random() * 2000) + 1).toString(),
			pipe_diameter: (Math.floor(Math.random() * 2000) + 1).toString(),
			protection_device: (
				Math.floor(Math.random() * 2000) + 1
			).toString(),
			voltaje_drop: (Math.floor(Math.random() * 2000) + 1).toString(),
		};

		return res.json(calculos);
	};

	static getById = async (req: Request, res: Response) => {
		const { id } = req.params;
		try {
			// Si existe el reporte, devuelvo sus datos.
			const report = await getRepository(Report).findOneOrFail(id, {
				relations: ['circuit'],
			});
			res.json(report);
		} catch (error) {
			// En caso contrario, envio un error.
			return res.status(404).json({
				message: 'Error, este reporte no esta registrado.',
			});
		}
	};

	static newReport = async (req: Request, res: Response) => {
		const input: ReportInterface = req.body;
		let report = new Report();

		// Validando que vienen datos del Front-End
		if (
			!(
				input.current &&
				input.cable_width &&
				input.pipe_diameter &&
				input.protection_device &&
				input.voltaje_drop
			)
		)
			return res
				.status(400)
				.json({ message: 'Todos los campos son requeridod.' });

			report.current = input.current;
			report.cable_width = input.cable_width;
			report.pipe_diameter = input.pipe_diameter;
			report.protection_device = input.protection_device;
			report.voltaje_drop = input.voltaje_drop;
			report.circuit = input.circuit;

		try {
			// Si no hay errores, guardo el registro
			await getRepository(Report).save(report);
		} catch (error) {
			// En caso contrario, emito un error
			return res.status(401).json({
				message: 'Error, algo salio mal.',
			});
		}
		res.status(201).json({
			message: 'Reporte registrado con exito.',
		});
	};

	static editReport = async (req: Request, res: Response) => {
		const { id } = req.params;
		const input: ReportInterface = req.body;

		let report: Report;
		try {
			// Si existe el report, actualizo sus datos.
			report = await getRepository(Report).findOneOrFail(id);
			report.current = input.current;
			report.cable_width = input.cable_width;
			report.pipe_diameter = input.pipe_diameter;
			report.protection_device = input.protection_device;
			report.voltaje_drop = input.voltaje_drop;
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
			return res.status(401).json({
				message: 'Error, algo salio mal.',
			});
		}

		return res.status(201).json({message: 'Reporte actualizado con exito.'});
	};

	static deleteReport = async (req: Request, res: Response) => {
		const { id } = req.params;

		try {
			// Verifico si el reporte existe.
			await getRepository(Report).findOneOrFail(id);
		} catch (error) {
			// En caso contrario, envio un error.
			return res.status(404).json({
				message: 'Error, este reporte no existe.',
			});
		}

		await getRepository(Report).delete(id);

		res.status(201).json({
			message: 'Reporte eliminado con exito.',
		});
	};
}
