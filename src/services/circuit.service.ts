import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import Circuit from '../database/entities/circuits.entity';

import { CircuitInterface } from '../app/interfaces/circuit.interface';

// ======================================
//			Circuit Service
// ======================================
export default class CircuitServices {
	// ======================================
	//			Crear Circuito
	// ======================================
	public async created(req: Request, res: Response) {
		const input: CircuitInterface = req.body;
		let circuit = new Circuit();

		// Validando los datos que vienen del front
		if (!input.name)
			return res
				.status(400)
				.json({ message: 'Error, el nombre es requerido.' });

		circuit.name = input.name;
		circuit.board_padre = input.board_padre;

		try {
			// Si no hay errores, guardo el registro
			await getRepository(Circuit).save(circuit);
		} catch (error) {
			return res.status(401).json({
				message: 'Error, no se pudo guardar el registro del circuito.',
			});
		}

		res.status(201).json({
			message: 'Circuito registrado con exito.',
		});
	}

	// ======================================
	//		Buscar Todos Los Circuitos
	// ======================================
	public async findAll(req: Request, res: Response) {
		let circuits;

		// Verifico si existen circuitos
		circuits = await getRepository(Circuit).find({
			relations: ['board_padre', 'reports'],
		});

		if (circuits.length)
			// Si hay circuitos, devuelvo sus nombres
			res.json(circuits);
		else
			return res.status(404).json({
				message: 'Error, no existen circuitos registrados.',
			});
	}

	// ======================================
	//		Buscar Circuito Por ID
	// ======================================
	public async findById(req: Request, res: Response) {
		const { id } = req.params;
		try {
			// Si existe el circuito, devuelvo sus datos.
			const report = await getRepository(Circuit).findOneOrFail(id, {
				relations: ['board_padre', 'reports'],
			});
			res.json(report);
		} catch (error) {
			return res.status(404).json({
				message: 'Error, este circuito no esta registrado.',
			});
		}
	}

	// ======================================
	//			Actualizar Circuito
	// ======================================
	public async updated(req: Request, res: Response) {
		const { id } = req.params;
		const input: CircuitInterface = req.body;

		let circuit: Circuit;
		try {
			// Si existe el circuito, actualizo sus datos.
			circuit = await getRepository(Circuit).findOneOrFail(id);
			circuit.name = input.name ? input.name : circuit.name;
		} catch (error) {
			return res.status(404).json({
				message: 'Error, el circuito no existe.',
			});
		}

		try {
			// Si no hay errores, guardo el registro del circuito
			await getRepository(Circuit).save(circuit);
		} catch (error) {
			return res.status(401).json({
				message: 'Error, algo salio mal.',
			});
		}

		return res
			.status(201)
			.json({ message: 'Circuito actualizado con exito.' });
	}

	// ======================================
	//			Crear Circuito
	// ======================================
	public async deleted(req: Request, res: Response) {
		const { id } = req.params;

		try {
			// Verifico si el circuito existe.
			await getRepository(Circuit).findOneOrFail(id);
		} catch (error) {
			return res.status(404).json({
				message: 'Error, este circuito no existe.',
			});
		}

		await getRepository(Circuit).delete(id);

		res.status(201).json({
			message: 'Circuito eliminado con exito.',
		});
	}
}
