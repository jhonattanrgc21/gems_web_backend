import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import Report from '../database/entities/report.entity';

import { ReportInterface } from '../app/interfaces/report.interface';
import {
	tableTemperature,
	tableCorrectionFactors,
} from '../config/tableCalculate';

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
		let {
			loadType,
			power,
			distance,
			powerFactor,
			voltajeDrop,
			aisolation,
			temperature,
			loadPhases,
			perPhase,
		} = req.body;

		/*
			la temperatura debe estar entre 21 y 80
			El aislamiento debe estar ebtre 1 y 3
			Las fases deben estar entre 1 y 3
		*/

		if (
			aisolation < 1 ||
			aisolation > 3 ||
			loadPhases < 1 ||
			loadPhases > 3 ||
			perPhase <= 0
		)
			return res.status(401).json({
				message:
					'Error, el valor del aislamiento y las fases deben estar entre 1 y 3 y perPhase debe ser mayor a 0.',
			});

		let O95;
		switch (loadPhases) {
			case 1:
				// O95 = F7 / (120 * fp)
				O95 = power / (120 * powerFactor);
				break;

			case 2:
				// O95 = F7 / (220 * fp)
				O95 = power / (220 * powerFactor);
				break;

			case 3:
				// O95 = F7 / (1.73 * 208 * fp)
				O95 = power / (1.73 * 208 * powerFactor);
				break;

			default:
				return res.status(401).json({
					message: 'Error de tension.',
				});
		}

		//Calculando el factor de temperatura
		aisolation--;
		let factordetemp;
		switch (temperature) {
			// caso 1
			case 21:
			case 22:
			case 23:
			case 24:
			case 25:
				factordetemp = tableCorrectionFactors[aisolation][0];
				break;

			// caso 2
			case 26:
			case 27:
			case 28:
			case 29:
			case 30:
				factordetemp = tableCorrectionFactors[aisolation][1];
				break;

			// caso 3
			case 31:
			case 32:
			case 33:
			case 34:
			case 35:
				factordetemp = tableCorrectionFactors[aisolation][2];
				break;

			// caso 4
			case 36:
			case 37:
			case 38:
			case 39:
			case 40:
				factordetemp = tableCorrectionFactors[aisolation][3];
				break;

			// caso 5
			case 41:
			case 42:
			case 43:
			case 44:
			case 45:
				factordetemp = tableCorrectionFactors[aisolation][4];
				break;

			// caso 6
			case 46:
			case 47:
			case 48:
			case 49:
			case 50:
				factordetemp = tableCorrectionFactors[aisolation][5];
				break;

			// caso 7
			case 51:
			case 52:
			case 53:
			case 54:
			case 55:
				factordetemp = tableCorrectionFactors[aisolation][6];
				break;

			// caso 8
			case 56:
			case 57:
			case 58:
			case 59:
			case 60:
				factordetemp = tableCorrectionFactors[aisolation][7];
				break;

			// caso 9
			case 61:
			case 62:
			case 63:
			case 64:
			case 65:
			case 66:
			case 67:
			case 68:
			case 69:
			case 70:
				factordetemp = tableCorrectionFactors[aisolation][8];
				break;

			// caso 10
			case 71:
			case 72:
			case 73:
			case 74:
			case 75:
			case 76:
			case 77:
			case 78:
			case 79:
			case 80:
				factordetemp = tableCorrectionFactors[aisolation][9];
				break;

			default:
				return res.status(401).json({
					message:
						'Error, la temperatura debe estar entre 21 y 80 grados.',
				});
		}

		// G94 = fases * CondPFases
		const G94 = loadPhases * perPhase;

		// Calculando I94 (redondeando hacia arriba G94)
		const I94 = Math.round(G94);

		// Calculando F96
		let F96;
		switch (I94) {
			// caso 1
			case 1:
				F96 = 1;
				break;

			// caso 2
			case 4:
			case 5:
			case 6:
				F96 = 0.8;
				break;

			// caso 3
			case 7:
			case 8:
			case 9:
				F96 = 0.7;
				break;

			// caso 4
			case 10:
			case 11:
			case 12:
			case 13:
			case 14:
			case 15:
			case 16:
			case 17:
			case 18:
			case 19:
			case 20:
				F96 = 0.5;
				break;

			// caso 5
			case 21:
			case 22:
			case 23:
			case 24:
			case 25:
			case 26:
			case 27:
			case 28:
			case 29:
			case 30:
				F96 = 0.45;
				break;

			// caso 6
			case 31:
			case 32:
			case 33:
			case 34:
			case 35:
			case 36:
			case 37:
			case 38:
			case 39:
			case 40:
				F96 = 0.4;
				break;

			// caso 7
			default:
				F96 = 0.35;
				break;
		}

		// Asignando el valor de D98
		const D98 = 1.25;

		// Calculando E102 = (D98 * D89) / (I96 * F96 * factordetemp)
		const E102 = (D98 * O95) / (1 * F96 * factordetemp);

		// Calculando I_conFact = E102 / CondPFase
		const I_conFact = E102 / perPhase;

		const calculos = {
			current: E102,
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

		return res
			.status(201)
			.json({ message: 'Reporte actualizado con exito.' });
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
