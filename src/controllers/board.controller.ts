import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Project from '../database/entities/project.entity';
import Board from '../database/entities/board.entity';
import {
	CreateBoardInterface,
	UpdateBoardInterface,
} from '../app/interfaces/board.interface';

// ======================================
//			Report Controller
// ======================================
export default class BoardController {
	static getAll = async (req: Request, res: Response) => {
		let boards;

		// Verifico si existen tableros
		boards = await getRepository(Board).find({
			relations: ['project'],
		});

		if (boards.length)
			// Si existen tableros, devuelvo sus datos
			res.json(boards);
		// En caso contrario, envio un error.
		else
			return res.status(404).json({
				message: 'Error, no existen tableros registrados.',
			});
	};

	static getById = async (req: Request, res: Response) => {
		const { id } = req.params;
		try {
			// Si existe el tablero, devuelvo sus datos.
			const board = await getRepository(Board).findOneOrFail(id, {
				relations: ['project'],
			});
			res.json(board);
		} catch (error) {
			// En caso contrario, envio un error.
			return res.status(404).json({
				message: 'Error, este tablero no esta registrado.',
			});
		}
	};

	static newBoard = async (req: Request, res: Response) => {
		const input: CreateBoardInterface = req.body;

		// Validando que vienen datos del Front-End
		if (!input.name)
			return res
				.status(400)
				.json({ message: 'Todos el nombre es requeridod.' });

		if (input.project) {
			const board = new Board();
			board.name = input.name;
			board.project = input.project;

			await getRepository(Board).save(board);

			res.status(201).json({
				message: 'Tablero registrado con exito.',
			});
		} else {
			return res.status(401).json({
				message: 'Error, no se encontro el proyecto asociado.',
			});
		}
	};

	static editBoard = async (req: Request, res: Response) => {
		const { id } = req.params;
		const input: UpdateBoardInterface = req.body;

		let board: Board;
		try {
			// Si existe el tablero, actualizo sus datos.
			board = await getRepository(Board).findOneOrFail(id);
			board.name = input.name ? input.name : board.name;
		} catch (error) {
			// En caso contrario, envio un error.
			return res.status(404).json({
				message: 'Error, el tablero no esta registrado.',
			});
		}

		await getRepository(Board).save(board);

		return res.status(201).json('Tablero actualizado con exito.');
	};

	static deleteBoard = async (req: Request, res: Response) => {
		const { id } = req.params;

		try {
			// Verifico si el reporte existe.
			await getRepository(Board).findOneOrFail(id);
		} catch (error) {
			// En caso contrario, envio un error.
			return res.status(404).json({
				message: 'Error, el tablero no existe.',
			});
		}

		await getRepository(Board).delete(id);

		res.status(201).json({
			message: 'Tablero eliminado con exito.',
		});
	};
}
