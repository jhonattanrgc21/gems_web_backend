import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import Project from '../database/entities/project.entity';
import User from '../database/entities/user.entity';

// ======================================
//			Project Controller
// ======================================
export default class ProjectController {
	static getAll = async (req: Request, res: Response) => {
		let projects;
		let { id } = res.locals.jwtPayload;

		const user = await getRepository(User).findOne(id);
		// Verifico si existen proyectos
		projects = await getRepository(Project).find({
			where: { user },
			relations: ['boards'],
		});

		if (projects.length){
			// Si existen proyectos, devuelvo sus datos
			res.json(projects);
		}
		else
			// En caso contrario, envio un error.
			return res.status(404).json({
				message: 'Error, no existen proyectos registrados.',
			});
	};

	static getById = async (req: Request, res: Response) => {
		const { id } = req.params;
		const { id_user } = res.locals.jwtPayload;
		const user = await getRepository(User).findOne(id_user);

		try {
			// Si existe el proyecto, devuelvo su nombre.
			const project = await getRepository(Project).findOneOrFail(id, {
				where: { user },
				relations: ['boards'],
			});
			res.json(project);
		} catch (error) {
			// En caso contrario, envio un error.
			return res.status(404).json({
				message: 'Error, este proyecto no existe.',
			});
		}
	};

	static newProject = async (req: Request, res: Response) => {
		const { name } = req.body;
		const { id } = res.locals.jwtPayload;

		// Validando que vienen datos del Front-End
		if (!name)
			return res
				.status(400)
				.json({ message: 'Este campo es requerido.' });

		let project = new Project();

		project.name = name;

		// Asocio al usuario correspondiente
		project.user = await getRepository(User).findOne(id);

		try {
			// Si no hay errores, guardo el registro de proyectos
			await getRepository(Project).save(project);
		} catch (error) {
			// En caso contrario, envio un error.
			return res.status(409).json({
				message: 'Error, ya existe un proyecto con este nombre.',
			});
		}

		res.status(201).json({
			message: 'Proyecto registrado con exito.',
		});
	};

	static editProject = async (req: Request, res: Response) => {
		const { id } = req.params;
		const { name } = req.body;

		let project: Project;
		try {
			// Si existe el proyecto, actualizo sus datos.
			project = await getRepository(Project).findOneOrFail(id);
			project.name = name;
		} catch (error) {
			// En caso contrario, envio un error.
			return res.status(404).json({
				message: 'Error, el proyecto no existe.',
			});
		}

		try {
			// Si no hay errores, guardo el registro del proyecto
			await getRepository(Project).save(project);
		} catch (error) {
			// En caso contrario, envio un error.
			return res.status(409).json({
				message: 'Error, ya existe un proyecto con este nombre.',
			});
		}

		return res.status(201).json('Proyecto actualizado con exito.');
	};

	static deleteProject = async (req: Request, res: Response) => {
		const { id } = req.params;

		try {
			// Verifico si el proyecto existe.
			await getRepository(Project).findOneOrFail(id);
		} catch (error) {
			// En caso contrario, envio un error.
			return res.status(404).json({
				message: 'Error, el proyecto no existe.',
			});
		}

		await getRepository(Project).delete(id);

		res.status(201).json({
			message: 'Proyecto eliminado con exito.',
		});
	};
}
