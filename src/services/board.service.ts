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
		let project: Project;

		// Busco al usuario y proyecto asociado a este tablero
		const user = await getRepository(User).findOne(id_user);

		// Validando que los datos que vienen del Front-End
		if (!input.project.id && !input.name)
			return res.status(401).json({
				message:
					'Error, el proyecto asociado no existe o el nombre del tablero es requerido.',
			});

		try {
			project = await getRepository(Project).findOneOrFail(
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

		const board = new Board();
		board.name = input.name;
		board.project = input.project;

		// Comprobando si existe un tablero padre
		if (input.board_padre) {
			let encontrado = project.boards.find(
				(elem) => elem.id === input.board_padre.id,
			);
			if (encontrado) board.board_padre = input.board_padre;
			else
				return res.status(401).json({
					message: 'Error, no se encontro el tablero asociado.',
				});
		}

		await getRepository(Board).save(board);

		return res.status(201).json({
			message: 'Tablero registrado con exito.',
			board,
		});
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
		const id: string = req.params.id;

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
		const id: string = req.params.id;
		const input: BoardInterface = req.body;
		const id_user = res.locals.jwtPayload.id;
		let project: Project;

		// Busco al usuario correspondiente
		const user = await getRepository(User).findOne(id_user);
		if (!input.project.id)
			return res.status(401).json({
				message: 'Error, el proyecto asociado no existe.',
			});

		// Busco al proyecto asociado
		try {
			project = await getRepository(Project).findOneOrFail(
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
			board = await getRepository(Board).findOneOrFail(id, {
				where: { project },
				relations: [
					'project',
					'circuits',
					'board_padre',
					'board_hijos',
				],
			});
			board.name = input.name ? input.name : board.name;

			// Guardo el registro
			await getRepository(Board).save(board);
			return res
				.status(201)
				.json({ message: 'Tablero actualizado con exito.', board });
		} catch (error) {
			return res.status(404).json({
				message: 'Error, el tablero no esta registrado.',
			});
		}
	}

	// ======================================
	//			Eliminar Tablero
	// ======================================
	public async deleted(req: Request, res: Response) {
		const id: string = req.params.id;
		let board: Board;
		try {
			// Verifico si el tablero existe.
			board = await getRepository(Board).findOneOrFail(id);
			await getRepository(Board).delete(id);

			return res.status(201).json({
				message: 'Tablero eliminado con exito.',
				board,
			});
		} catch (error) {
			return res.status(404).json({
				message: 'Error, el tablero no existe.',
			});
		}
	}
}
