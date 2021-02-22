import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Circuit from '../database/entities/circuit.entity';
import Board from '../database/entities/board.entity';
import { CircuitInterface } from '../app/interfaces/circuit.interface';

// ======================================
//			Report Controller
// ======================================
export default class CircuitController {
	static getAll = async (req: Request, res: Response) => {
		let circuits;

		// Verifico si existen circuitos
		circuits = await getRepository(Circuit).find({
			relations: ['board_padre', 'board_hijo'],
		});

		if (circuits.length)
			// Si hay reportes, devuelvo sus nombres
			res.json(circuits);
		// En caso contrario, envio un error.
		else
			return res.status(404).json({
				message: 'Error, no existen circuitos registrados.',
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
			// Si existe el circuit, devuelvo sus datos.
			const report = await getRepository(Circuit).findOneOrFail(id, {
				relations: ['board_padre', 'board_hijo'],
			});
			res.json(report);
		} catch (error) {
			// En caso contrario, envio un error.
			return res.status(404).json({
				message: 'Error, este circuito no esta registrado.',
			});
		}
	};

	static newCircuit = async (req: Request, res: Response) => {
		const input: CircuitInterface = req.body;
		let circuit = new Circuit();

		if (input.board_hijo) {
			circuit.board_padre = input.board_padre;
			circuit.board_hijo = input.board_hijo;
		} else {
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

			circuit.current = input.current;
			circuit.cable_width = input.cable_width;
			circuit.pipe_diameter = input.pipe_diameter;
			circuit.protection_device = input.protection_device;
			circuit.voltaje_drop = input.voltaje_drop;
		}
		try {
			// Si no hay errores, guardo el registro
			await getRepository(Circuit).save(circuit);
		} catch (error) {
			// En caso contrario, emito un error
			return res.status(401).json({
				message: 'Error, algo salio mal.',
			});
		}
		res.status(201).json({
			message: 'Circuito registrado con exito.',
		});
	};

	static editCircuit = async (req: Request, res: Response) => {
		const { id } = req.params;
		const input: CircuitInterface = req.body;

		let circuit: Circuit;
		try {
			// Si existe el circuito, actualizo sus datos.
			circuit = await getRepository(Circuit).findOneOrFail(id);
			circuit.current = input.current;
			circuit.cable_width = input.cable_width;
			circuit.pipe_diameter = input.pipe_diameter;
			circuit.protection_device = input.protection_device;
			circuit.voltaje_drop = input.voltaje_drop;
		} catch (error) {
			// En caso contrario, envio un error.
			return res.status(404).json({
				message: 'Error, el circuito no existe.',
			});
		}

		try {
			// Si no hay errores, guardo el registro de Usuario
			await getRepository(Circuit).save(circuit);
		} catch (error) {
			// En caso contrario, envio un error.
			return res.status(401).json({
				message: 'Error, algo salio mal.',
			});
		}

		return res.status(201).json('Circuito actualizado con exito.');
	};

	static deleteCircuit = async (req: Request, res: Response) => {
		const { id } = req.params;

		try {
			// Verifico si el circuito existe.
			await getRepository(Circuit).findOneOrFail(id);
		} catch (error) {
			// En caso contrario, envio un error.
			return res.status(404).json({
				message: 'Error, este circuito no existe.',
			});
		}

		await getRepository(Circuit).delete(id);

		res.status(201).json({
			message: 'Reporte eliminado con exito.',
		});
	};
}
