import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Board from '../database/entities/boards.entity';
import User from '../database/entities/users.entity';
import Project from '../database/entities/projects.entity';
import { BoardInterface } from '../app/interfaces/board.interface';

// ======================================
//			Board Service
// ======================================
export default class BoardServices {
	// ======================================
	//			Crear Tablero
	// ======================================
	public async created(req: Request, res: Response) {
		const input: BoardInterface = req.body;

		const id_user = res.locals.jwtPayload.id;
		const user = await getRepository(User).findOne(id_user);

		const project = await getRepository(Project).findOne(input.project.id, {
			where: { user },
			relations: ['boards'],
		});

		if (project) {
			// Validando que los datos que vienen del Front-End
			if (!input.name)
				return res
					.status(400)
					.json({ message: 'El nombre es requerido.' });

			const board = new Board();
			board.name = input.name;
			board.project = input.project;

			// Comprobando si existe un tablero padre
			if (input.board_padre) {
				let encontrado = false,
					i = 0;
				const n = project.boards.length;

				while (i < n && !encontrado) {
					if (project.boards[i].id === input.board_padre.id)
						encontrado = true;
					else i++;
				}

				if (encontrado) board.board_padre = input.board_padre;
				else
					return res.status(401).json({
						message: 'Error, no se encontro el tablero asociado.',
					});
			}

			await getRepository(Board).save(board);

			return res.status(201).json({
				message: 'Tablero registrado con exito.',
			});
		} else {
			return res.status(401).json({
				message: 'Error, no se encontro el proyecto asociado.',
			});
		}
	}

	// ======================================
	//			Buscar Todos Los Tableros
	// ======================================
	public async findAll(req: Request, res: Response) {
		let boards;

		// Verifico si existen tableros
		boards = await getRepository(Board).find({
			relations: ['project', 'circuits', 'board_padre', 'board_hijos'],
		});

		if (boards.length)
			// Si existen tableros, devuelvo sus datos
			res.json(boards);
		else
			return res.status(404).json({
				message: 'Error, no existen tableros registrados.',
			});
	}

	// ======================================
	//			Buscar Tablero Por ID
	// ======================================
	public async findById(req: Request, res: Response) {
		const { id } = req.params;

		try {
			// Si existe el tablero, devuelvo sus datos.
			const board = await getRepository(Board).findOneOrFail(id, {
				relations: [
					'project',
					'circuits',
					'board_padre',
					'board_hijos',
				],
			});
			res.json(board);
		} catch (error) {
			return res.status(404).json({
				message: 'Error, este tablero no esta registrado.',
			});
		}
	}

	// ======================================
	//			Actualizar Tablero
	// ======================================
	public async updated(req: Request, res: Response) {
		const { id } = req.params;
		const input: BoardInterface = req.body;
		const id_user = res.locals.jwtPayload.id;

		const user = await getRepository(User).findOne(id_user);

		try {
			const project = await getRepository(Project).findOneOrFail(
				input.project.id,
				{
					where: { user },
					relations: ['boards'],
				},
			);
		} catch (error) {
			return res.status(401).json({
				message: 'Error, no se encontro el proyecto asociado.',
			});
		}

		let board: Board;
		try {
			// Si existe el tablero, actualizo sus datos.
			board = await getRepository(Board).findOneOrFail(id);
			board.name = input.name ? input.name : board.name;
		} catch (error) {
			return res.status(404).json({
				message: 'Error, el tablero no esta registrado.',
			});
		}

		await getRepository(Board).save(board);

		return res
			.status(201)
			.json({ message: 'Tablero actualizado con exito.' });
	}

	// ======================================
	//			Eliminar Tablero
	// ======================================
	public async deleted(req: Request, res: Response) {
		const { id } = req.params;

		try {
			// Verifico si el tablero existe.
			await getRepository(Board).findOneOrFail(id);
		} catch (error) {
			return res.status(404).json({
				message: 'Error, el tablero no existe.',
			});
		}

		await getRepository(Board).delete(id);

		return res.status(201).json({
			message: 'Tablero eliminado con exito.',
		});
	}
}
