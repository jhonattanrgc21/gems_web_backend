import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Report from '../database/entities/reports.entity';
import Circuit from '../database/entities/circuits.entity';
import {
	CreateReportInterface,
	UpdateReportInterface,
} from '../app/interfaces/report.interface';
import {
	tableCorrectionFactors,
	tableTemperature,
	calibresTemperatura,
	calibres9,
	table9,
	s21,
	b161Y,
	b161X,
	pipe,
} from '../config/tableCalculate';

// ======================================
//			Report Service
// ======================================
export default class CircuitServices {
	// ======================================
	//			Crear Reporte
	// ======================================
	public async created(req: Request, res: Response) {
		const input: CreateReportInterface = req.body;
		let report = new Report();

		// Validando que vienen datos del Front-End
		if (
			Object.values(input).length != 18 ||
			Object.keys(input.circuit).length == 0
		)
			return res.status(400).json({
				message:
					'Todos los campos son requeridod y es necesario los datos del circuito padre.',
			});

		try {
			await getRepository(Circuit).findOneOrFail(input.circuit.id);
		} catch (error) {
			return res.status(401).json({
				message: 'Error, el circuito padre no existe.',
			});
		}

		report.loadType = input.loadType;
		report.power = input.power;
		report.distance = input.distance;
		report.powerFactor = report.powerFactor;
		report.voltageDrop = input.voltageDrop;
		report.aisolation = input.aisolation;
		report.temperature = input.temperature;
		report.loadPhases = input.loadPhases;
		report.perPhase = input.perPhase;
		report.feeder_include_neutral_wire = input.feeder_include_neutral_wire;
		report.pipe_material = input.pipe_material;
		report.system_voltage = input.system_voltage;
		report.current = input.current;
		report.cable_width = input.cable_width;
		report.pipe_diameter = input.pipe_diameter;
		report.protection_device = input.protection_device;
		report.voltaje_drop = input.voltage_drop;
		report.circuit = input.circuit;

		try {
			// Si no hay errores, guardo el registro
			await getRepository(Report).save(report);
			res.status(201).json({
				message: 'Reporte registrado con exito.',
				report,
			});
		} catch (error) {
			return res.status(401).json({
				message: 'Error, no se pudo guardar el registro del reporte.',
			});
		}
	}

	// ======================================
	//			Report Service
	// ======================================
	public async reportPrevio(req: Request, res: Response) {
		let {
			loadType, // Tipo de carga. Sus valores deben en el back estar entre 0 y 2 y en el front los que ya aparecen en el menu desplegable
			power, // Potencia del circuito
			distance, // Distancia del circuito
			powerFactor, // Factor de potencia. Es un valor decimal entre 0 y 1
			voltageDrop, // Caida de voltaeje
			aisolation, // Aislamiento. Debe estar entre 0 y 2 en el back y en el front los que ya aparecen en el menu desplegable
			temperature, // Debe estar entre 21 y 80
			loadPhases, //  Fases. Debe estar entre 1 y 3
			perPhase, // condPFases. Debe ser mayor a 0
			feeder_include_neutral_wire, // Sistema alimentado con neutro. Debe ser true o false
			pipe_material, // Material por tuberia. Sus valoresen el front  som: [pvc | al | acero] y en el back debe estar entre 0 y 2
			system_voltage, // Tension del sistema. Sus valores son 120, 208, 220
		} = req.body;

		// Validando los datos de entrada
		if (
			aisolation < 0 ||
			aisolation > 2 ||
			loadPhases < 1 ||
			loadPhases > 3 ||
			perPhase <= 0 ||
			power <= 0 ||
			distance <= 0 ||
			powerFactor <= 0 ||
			voltageDrop <= 0 ||
			temperature < 21 ||
			temperature > 80
		)
			return res.status(401).json({
				message:
					'Error, el valor de aisolation debe estar entre 0 y 2, las loadPhases debe estar entre 1 y 3, perPhase, power, powerFator, distance, voltageDro debe ser mayor a 0 y la temperatura debe estar entre 21 y 80.',
			});

		let col_ral, col_xal;

		switch (pipe_material) {
			case 0:
				col_ral = 2; // 4
				col_xal = 0; // 2
				break;

			case 1:
				col_ral = 3; // 5
				col_xal = 0; // 2
				break;

			case 2:
				col_ral = 4; // 6
				col_xal = 1; // 3
				break;

			default:
				return res.status(401).json({
					message:
						'Error, el valor de pipe_material debe estar entre 0 y 2.',
				});
		}

		// Calculos del diagrama de flujo

		let O95;
		switch (loadPhases) {
			case 1:
			case 2:
				// O95 = F7 / (tension * fp)
				O95 = power / (system_voltage * powerFactor);
				break;

			case 3:
				// O95 = F7 / (1.73 * 208 * fp)
				O95 = power / (1.73 * system_voltage * powerFactor);
				break;

			default:
				return res.status(401).json({
					message: 'Error de tension.',
				});
		}

		//Calculando el factor de temperatura
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
		let F96: number;

		if (I94 < 4) F96 = 1;
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

		// Asignando el valor de D98. Este es el valor de la fholgura
		const D98 = 1.25;

		// Calculando E102 = (D98 * D89) / (I96 * F96 * factordetemp)
		const E102 = (D98 * O95) / (1 * F96 * factordetemp);

		// Calculando I_conFact = E102 / CondPFase
		const I_conFact = E102 / perPhase;

		// Calculando condporcapacidad = calibre y F107 = grado ubicado por el aislamiento
		let condporcapacidad: string, F107: number, indexTemperature: number;

		indexTemperature = tableTemperature[aisolation].findIndex(
			(elem) => elem > I_conFact,
		);
		if (indexTemperature == -1)
			return res.status(401).json({
				message:
					'Error, no se pudo calcular el condporcapacidad y el F107.',
			});

		condporcapacidad = calibresTemperatura[indexTemperature];
		F107 = tableTemperature[aisolation][indexTemperature];

		let n = -1,
			DV: number,
			Ral: number,
			Xal: number,
			index: number,
			CalibreSelecc: string;

		index = calibres9.indexOf(condporcapacidad);

		if (index == -1)
			return res.status(401).json({
				message: 'Error, condporcapacidad no existe en la tabla 9.',
			});

		do {
			n++;
			if (n == 0) {
				CalibreSelecc = condporcapacidad;
				Ral = table9[col_ral][index];
				Xal = table9[col_xal][index];
			} else {
				if (index + n <= calibres9.length) {
					Ral = table9[col_ral][index + n];
					Xal = table9[col_xal][index + n];
				} else
					return res.status(401).json({
						message:
							'Error, el Ral y el Xal no exiten en la tabla9.',
					});

				if (indexTemperature + n <= calibresTemperatura.length)
					CalibreSelecc = CalibreSelecc =
						calibresTemperatura[indexTemperature + n];
				else
					return res.status(401).json({
						message:
							'Error, CalibreSelecc no existe en la tabla  de temperatura.',
					});
			}

			// Calculando el Zeficaz = Ral * fp + Xal * sin(acos(fp))
			const Zeficaz =
				Ral * powerFactor + Xal * Math.sin(Math.acos(powerFactor));

			// Calculando el DV
			switch (loadPhases) {
				case 1:
				case 2:
					DV =
						((((2 * Zeficaz * distance) / 1000) *
							I_conFact *
							factordetemp) /
							D98 /
							system_voltage) *
						100;
					break;

				case 3:
					DV =
						((((Zeficaz * distance) / 1000) *
							I_conFact *
							factordetemp) /
							D98 /
							system_voltage) *
						100;
					break;

				default:
					return res.status(401).json({
						message: 'Error de tension.',
					});
			}
		} while (DV >= voltageDrop);

		// Calculando CorrienteDeProtecc = O95 * 1.25
		const CorrienteDeProtecc = O95 * D98;

		// Calculando Protecc
		const Protecc = s21.find((elem) => elem > CorrienteDeProtecc);
		if (!Protecc)
			return res.status(401).json({
				message:
					'Error, no se encontro el valor para Protecc en el vector s21.',
			});

		// Condicional del Neutro
		let D184: number;
		if (feeder_include_neutral_wire) D184 = I94 + 1;
		else D184 = I94;

		D184++;

		const PosicionY: number = b161Y.indexOf(CalibreSelecc);
		let PosicionX: number;
		if (PosicionY != -1) {
			const fila = b161X[PosicionY].reverse();
			PosicionX = fila.findIndex((elem) => elem >= D184);
		} else
			return res.status(401).json({
				message:
					'Error, no se encontro el calibre en la PosicionY del vector B161.',
			});

		const calculos = {
			current: E102,
			cable_width: CalibreSelecc,
			pipe_diameter: pipe[PosicionX],
			protection_device: Protecc,
			voltage_drop: DV,
		};

		return res.json(calculos);
	}

	// ======================================
	//		Buscar Todos Los Reportes
	// ======================================
	public async findAll(req: Request, res: Response) {
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
	}

	// ======================================
	//		Buscar Reporte Por ID
	// ======================================
	public async findById(req: Request, res: Response) {
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
	}

	// ======================================
	//			Actualizar Reporte
	// ======================================
	public async updated(req: Request, res: Response) {
		const id: string = req.params.id;
		const input: UpdateReportInterface = req.body;
		let circuit: Circuit;
		let report: Report;

		if (Object.keys(input.circuit).length == 0)
			return res.status(401).json({
				message: 'Error, el circuito padre no existe.',
			});

		try {
			circuit = await getRepository(Circuit).findOneOrFail(
				input.circuit.id,
			);
		} catch (error) {
			return res.status(401).json({
				message: 'Error, el circuito padre no existe.',
			});
		}

		try {
			// Si existe el report, actualizo sus datos.
			report = await getRepository(Report).findOneOrFail(id, {
				where: { circuit },
				relations: ['circuit'],
			});

			report.loadType =
				input.loadType > -1 ? input.loadType : report.loadType;
			report.power = input.power > -1 ? input.power : report.power;
			report.distance =
				input.distance > -1 ? input.distance : report.distance;
			report.powerFactor =
				report.powerFactor > -1
					? input.powerFactor
					: report.powerFactor;
			report.voltageDrop =
				input.voltageDrop > -1 ? input.voltageDrop : report.voltageDrop;
			report.aisolation =
				input.aisolation > -1 ? input.aisolation : report.aisolation;
			report.temperature =
				input.temperature > -1 ? input.temperature : report.temperature;
			report.loadPhases =
				input.loadPhases > -1 ? input.loadPhases : report.loadPhases;
			report.perPhase =
				input.perPhase > -1 ? input.perPhase : report.perPhase;
			report.feeder_include_neutral_wire =
				input.feeder_include_neutral_wire;
			report.pipe_material =
				input.pipe_material > -1
					? input.pipe_material
					: report.pipe_material;
			report.system_voltage =
				input.system_voltage > -1
					? input.system_voltage
					: report.system_voltage;
			report.current =
				input.current > -1 ? input.current : report.current;
			report.cable_width = input.cable_width
				? input.cable_width
				: report.cable_width;
			report.pipe_diameter = input.pipe_diameter
				? input.pipe_diameter
				: report.pipe_diameter;
			report.protection_device =
				input.protection_device > -1
					? input.protection_device
					: report.protection_device;
			report.voltaje_drop =
				input.voltage_drop > -1
					? input.voltage_drop
					: report.voltaje_drop;
		} catch (error) {
			return res.status(404).json({
				message: 'Error, el reporte no existe.',
			});
		}

		try {
			// Si no hay errores, guardo el registro de Usuario
			await getRepository(Report).save(report);
			res.status(201).json({
				message: 'Reporte actualizado con exito.',
				report,
			});
		} catch (error) {
			// En caso contrario, envio un error.
			return res.status(401).json({
				message: 'Error, algo salio mal.',
			});
		}
	}

	// ======================================
	//			Eliminar Reporte
	// ======================================
	public async deleted(req: Request, res: Response) {
		const id: string = req.params.id;
		let report: Report;
		try {
			// Verifico si el reporte existe.
			report = await getRepository(Report).findOneOrFail(id);

			// Elimino el registro del reporte
			await getRepository(Report).delete(id);
			res.status(201).json({
				message: 'Reporte eliminado con exito.',
				report,
			});
		} catch (error) {
			// En caso contrario, envio un error.
			return res.status(404).json({
				message: 'Error, este reporte no existe.',
			});
		}
	}
}
