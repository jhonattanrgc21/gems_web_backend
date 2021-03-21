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

		if (projects.length) {
			// Si existen proyectos, devuelvo sus datos
			res.json(projects);
		}
		// En caso contrario, envio un error.
		else
			return res.status(404).json({
				message: 'Error, no existen proyectos registrados.',
			});
	};

	static getById = async (req: Request, res: Response) => {
		const { id } = req.params;
		const id_user = res.locals.jwtPayload.id;
		const user = await getRepository(User).findOne(id_user);

		const project = await getRepository(Project).findOne(id, {
			where: { user },
			relations: ['boards'],
		});

		if (project) {
			// Si existe el proyecto, devuelvo sus datos.
			res.json(project);
		} else {
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

		const id_user = res.locals.jwtPayload.id;
		const user = await getRepository(User).findOne(id_user);

		let project: Project;
		project = await getRepository(Project).findOne(id, {
			where: { user },
			relations: ['boards'],
		});

		if (project) {
			// Si existe el proyecto, actualizo su nombre.
			project.name = name;
		} else {
			// En caso contrario, envio un error.
			return res.status(404).json({
				message: 'Error, este proyecto no existe.',
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

		return res.status(201).json({
			message: 'Proyecto actualizado con exito.',
		});
	};

	static deleteProject = async (req: Request, res: Response) => {
		const { id } = req.params;

		const id_user = res.locals.jwtPayload.id;
		const user = await getRepository(User).findOne(id_user);
		try {
			// Verifico si el proyecto existe.
			await getRepository(Project).findOneOrFail(id, {
				where: { user }
			});
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
