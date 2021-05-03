import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Project from '../database/entities/projects.entity';
import User from '../database/entities/users.entity';

// ======================================
//			Project Service
// ======================================
export default class ProjectServices {
	// ======================================
	//			Crear Proyectos
	// ======================================
	public async created(req: Request, res: Response) {
		const name: string = req.body.name;
		const id = res.locals.jwtPayload.id;

		// Validando los datos que vienen del front
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
			delete project.user.password;
			delete project.user.confirmToken;
			delete project.user.resetToken;
			res.status(201).json({
				message: 'Proyecto registrado con exito.',
				project,
			});
		} catch (error) {
			return res.status(409).json({
				message: 'Error, ya existe un proyecto con este nombre.',
			});
		}
	}

	// ======================================
	//		Buscar Todos Los Proyectos
	// ======================================
	public async findAll(req: Request, res: Response) {
		let projects;
		let id = res.locals.jwtPayload.id;

		const user = await getRepository(User).findOne(id);

		// Verifico si existen proyectos
		projects = await getRepository(Project).find({
			where: { user },
			relations: ['boards'],
		});

		// Si existen proyectos, devuelvo sus datos
		if (projects.length) res.json(projects);
		else
			return res.status(404).json({
				message: 'Error, no existen proyectos registrados.',
			});
	}

	// ======================================
	//		Buscar Proyecto Por ID
	// ======================================
	public async findById(req: Request, res: Response) {
		const id: string = req.params.id;
		const id_user = res.locals.jwtPayload.id;
		const user = await getRepository(User).findOne(id_user);

		const project = await getRepository(Project).findOne(id, {
			where: { user },
			relations: ['user', 'boards'],
		});

		// Si existe el proyecto, devuelvo sus datos.
		if (project) {
			delete project.user.password;
			delete project.user.confirmToken;
			delete project.user.resetToken;
			res.json(project);
		} else {
			return res.status(404).json({
				message: 'Error, este proyecto no esta registrado.',
			});
		}
	}

	// ======================================
	//			Actualizar Proyecto
	// ======================================
	public async updated(req: Request, res: Response) {
		const id: string = req.params.id;
		const name: string = req.body.name;
		const id_user = res.locals.jwtPayload.id;

		const user = await getRepository(User).findOne(id_user);

		let project: Project;
		try {
			// Si existe el proyecto, actualizo su nombre.
			project = await getRepository(Project).findOneOrFail(id, {
				where: { user },
				relations: ['user', 'boards'],
			});
			project.name = name;
		} catch (error) {
			return res.status(404).json({
				message: 'Error, este proyecto no existe.',
			});
		}

		try {
			// Si no hay errores, guardo el registro del proyecto
			await getRepository(Project).save(project);
			delete project.user.password;
			delete project.user.confirmToken;
			delete project.user.resetToken;
			res.status(201).json({
				message: 'Proyecto actualizado con exito.',
				project,
			});
		} catch (error) {
			// En caso contrario, envio un error.
			return res.status(409).json({
				message: 'Error, no se pudo guardar el registro',
			});
		}
	}

	// ======================================
	//			Eliminar Proyecto
	// ======================================
	public async deleted(req: Request, res: Response) {
		const id: string = req.params.id;
		const id_user = res.locals.jwtPayload.id;
		let project: Project;
		const user = await getRepository(User).findOne(id_user);

		try {
			// Verifico si el proyecto existe.
			project = await getRepository(Project).findOneOrFail(id, {
				where: { user },
				relations: ['user', 'boards']
			});

			delete project.user.password;
			delete project.user.confirmToken;
			delete project.user.resetToken;

			// Elimino el registro del proyecto
			await getRepository(Project).delete(id);
			res.status(201).json({
				message: 'Proyecto eliminado con exito.',
				project,
			});
		} catch (error) {
			return res.status(404).json({
				message: 'Error, el proyecto no existe.',
			});
		}
	}
}
