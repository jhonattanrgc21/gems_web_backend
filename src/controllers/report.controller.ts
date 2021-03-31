import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Report from '../database/entities/reports.entity';
import { ReportInterface } from '../app/interfaces/report.interface';
import { tableCorrectionFactors } from '../config/tableCalculate';

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
			perPhase <= 0 ||
			temperature < 21 ||
			temperature > 80
		)
			return res.status(401).json({
				message:
					'Error, el valor del aislamiento y las fases deben estar entre 1 y 3, perPhase debe ser mayor a 0 y la temperatura debe estar entre 21 y 80.',
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

		// Caso 1
		if (temperature >= 21 && temperature <= 25)
			factordetemp = tableCorrectionFactors[aisolation][0];

		// Caso 2
		if (temperature >= 26 && temperature <= 30)
			factordetemp = tableCorrectionFactors[aisolation][1];

		// Caso 3
		if (temperature >= 31 && temperature <= 35)
			factordetemp = tableCorrectionFactors[aisolation][2];

		// Caso 4
		if (temperature >= 36 && temperature <= 40)
			factordetemp = tableCorrectionFactors[aisolation][3];

		// Caso 5
		if (temperature >= 41 && temperature <= 45)
			factordetemp = tableCorrectionFactors[aisolation][4];

		// Caso 6
		if (temperature >= 46 && temperature <= 50)
			factordetemp = tableCorrectionFactors[aisolation][5];

		// Caso 7
		if (temperature >= 51 && temperature <= 55)
			factordetemp = tableCorrectionFactors[aisolation][6];

		// Caso 8
		if (temperature >= 56 && temperature <= 60)
			factordetemp = tableCorrectionFactors[aisolation][7];

		// Caso 9
		if (temperature >= 61 && temperature <= 70)
			factordetemp = tableCorrectionFactors[aisolation][8];

		// Caso 10
		if (temperature >= 71 && temperature <= 80)
			factordetemp = tableCorrectionFactors[aisolation][9];

		// G94 = fases * CondPFases
		const G94 = loadPhases * perPhase;

		// Calculando I94 (redondeando hacia arriba G94)
		const I94 = Math.round(G94);

		// Calculando F96
		let F96;

		if (I94 == 1) F96 = 1;
		else {
			if (I94 <= 6) F96 = 0.8;
			else {
				if (I94 <= 9) F96 = 0.7;
				else {
					if (I94 <= 20) F96 = 0.5;
					else {
						if (I94 <= 30) F96 = 0.45;
						else {
							if (I94 <= 40) F96 = 0.4;
							else F96 = 0.35;
						}
					}
				}
			}
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
			return res.status(401).json({
				message: 'Error, no se pudo guardar el registro del reporte.',
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
