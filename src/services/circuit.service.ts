import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import Circuit from '../database/entities/circuits.entity';
import Board from '../database/entities/boards.entity';
import {
	CreateCircuitInterface,
	UpdateCircuitInterface,
} from '../app/interfaces/circuit.interface';

// ======================================
//			Circuit Service
// ======================================
export default class CircuitServices {
	// ======================================
	//			Crear Circuito
	// ======================================
	public async created(req: Request, res: Response) {
		const input: CreateCircuitInterface = req.body;
		let circuit = new Circuit();

		// Validando los datos que vienen del front
		if (!input.name && !input.board_padre.id)
			return res.status(400).json({
				message:
					'Error, el nombre es requerido y los datos del board padre.',
			});

		try {
			await getRepository(Board).findOneOrFail(input.board_padre.id);
		} catch (error) {
			return res.status(401).json({
				message: 'Error, el board padre no existe.',
			});
		}

		circuit.name = input.name;
		circuit.board_padre = input.board_padre;

		try {
			// Si no hay errores, guardo el registro
			await getRepository(Circuit).save(circuit);
			res.status(201).json({
				message: 'Circuito registrado con exito.',
				circuit,
			});
		} catch (error) {
			return res.status(401).json({
				message: 'Error, no se pudo guardar el registro del circuito.',
			});
		}
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
			// Si hay circuitos, devuelvo sus datos
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
		const id: string = req.params.id;
		try {
			// Si existe el circuito, devuelvo sus datos.
			const circuit = await getRepository(Circuit).findOneOrFail(id, {
				relations: ['board_padre', 'reports'],
			});
			res.json(circuit);
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
		const id: string = req.params.id;
		const input: UpdateCircuitInterface = req.body;
		let circuit: Circuit;
		try {
			// Si existe el circuito, actualizo sus datos.
			circuit = await getRepository(Circuit).findOneOrFail(id, {
				where: { board_padre: input.board_padre },
				relations: ['board_padre', 'reports'],
			});
			circuit.name = input.name ? input.name : circuit.name;

			circuit.loadType =
				input.loadType > -1 ? input.loadType : circuit.loadType;
			circuit.power = input.power ? input.power : circuit.power;
			circuit.distance =
				input.distance > -1 ? input.distance : circuit.distance;
			circuit.powerFactor =
				input.powerFactor > -1
					? input.powerFactor
					: circuit.powerFactor;
			circuit.voltageDrop =
				input.voltageDrop > -1
					? input.voltageDrop
					: circuit.voltageDrop;
			circuit.aisolation =
				input.aisolation > -1 ? input.aisolation : circuit.aisolation;
			circuit.temperature =
				input.temperature > -1
					? input.temperature
					: circuit.temperature;
			circuit.loadPhases =
				input.loadPhases > -1 ? input.loadPhases : circuit.loadPhases;
			circuit.perPhase =
				input.perPhase > -1 ? input.perPhase : circuit.perPhase;
			circuit.feeder_include_neutral_wire =
				input.feeder_include_neutral_wire;
			circuit.pipe_material =
				input.pipe_material > -1
					? input.pipe_material
					: circuit.pipe_material;
			circuit.system_voltage =
				input.system_voltage > -1
					? input.system_voltage
					: circuit.system_voltage;
		} catch (error) {
			return res.status(404).json({
				message: 'Error, el circuito no existe.',
			});
		}

		try {
			// Si no hay errores, guardo el registro del circuito
			await getRepository(Circuit).save(circuit);
			res.status(201).json({
				message: 'Circuito actualizado con exito.',
				circuit,
			});
		} catch (error) {
			return res.status(401).json({
				message: 'Error, algo salio mal.',
			});
		}
	}

	// ======================================
	//			Eliminar Circuito
	// ======================================
	public async deleted(req: Request, res: Response) {
		const id: string = req.params.id;
		let circuit: Circuit;
		try {
			// Verifico si el circuito existe.
			circuit = await getRepository(Circuit).findOneOrFail(id);

			// Elimino el circuito
			await getRepository(Circuit).delete(id);

			res.status(201).json({
				message: 'Circuito eliminado con exito.',
				circuit,
			});
		} catch (error) {
			return res.status(404).json({
				message: 'Error, este circuito no existe.',
			});
		}
	}
}
