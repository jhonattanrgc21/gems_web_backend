import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import Circuit from '../database/entities/circuit.entity';

import { CircuitInterface } from '../app/interfaces/circuit.interface';

// ======================================
//			Circuit Controller
// ======================================
export default class CircuitController {
	static getAll = async (req: Request, res: Response) => {
		let circuits;

		// Verifico si existen circuitos
		circuits = await getRepository(Circuit).find({
			relations: ['board_padre', 'board_hijo', 'reports'],
		});

		if (circuits.length)
			// Si hay circuitos, devuelvo sus nombres
			res.json(circuits);
		// En caso contrario, envio un error.
		else
			return res.status(404).json({
				message: 'Error, no existen circuitos registrados.',
			});

	};

	static getById = async (req: Request, res: Response) => {
		const { id } = req.params;
		try {
			// Si existe el circuito, devuelvo sus datos.
			const report = await getRepository(Circuit).findOneOrFail(id, {
				relations: ['board_padre', 'board_hijo', 'reports'],
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
			if (!input.name)
				return res
					.status(400)
					.json({ message: 'Error, el nombre es requerido.' });

			circuit.name = input.name;
			circuit.board_padre = input.board_padre;
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
			circuit.name = input.name? input.name : circuit.name;
		} catch (error) {
			// En caso contrario, envio un error.
			return res.status(404).json({
				message: 'Error, el circuito no existe.',
			});
		}

		try {
			// Si no hay errores, guardo el registro del circuito
			await getRepository(Circuit).save(circuit);
		} catch (error) {
			// En caso contrario, envio un error.
			return res.status(401).json({
				message: 'Error, algo salio mal.',
			});
		}

		return res.status(201).json({ message: 'Circuito actualizado con exito.'});
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
			message: 'Circuito eliminado con exito.',
		});
	};
}
