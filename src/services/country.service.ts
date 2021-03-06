import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Country from '../database/entities/countries.entity';

// ======================================
//			Country Service
// ======================================
export default class CountryServices {
	// ======================================
	//			Crear Pais
	// ======================================
	public async created(req: Request, res: Response) {
		const { code, prefix, name } = req.body;

		// Validando los datos que vienen datos del Front-End
		if (!(code && prefix && name))
			return res
				.status(400)
				.json({ message: 'Todos los campos son requeridos.' });

		let country = new Country();

		country.code = code;
		country.prefix = prefix;
		country.name = name;

		try {
			// Si no hay errores, guardo el registro del pais
			await getRepository(Country).save(country);
		} catch (error) {
			// En caso contrario, envio un error.
			return res.status(409).json({
				message: 'Error, ya existe un pais con estos datos.',
			});
		}

		res.status(201).json({
			message: 'Pais registrado con exito.',
		});
	}

	// ======================================
	//		Buscar Todos Los Paises
	// ======================================
	public async findAll(req: Request, res: Response) {
		let countries;

		// Verifico si existen registros de paises
		countries = await getRepository(Country).find();

		if (countries.length) {
			res.json(countries);
		}
		// En caso contrario, envio un error.
		else
			return res.status(404).json({
				message: 'Error, no existen paises registrados.',
			});
	}

	// ======================================
	//			Buscar Pais Por ID
	// ======================================
	public async findById(req: Request, res: Response) {
		const { id } = req.params;
		try {
			// Si existen registros de paises, devuelvo sus datos.
			const country = await getRepository(Country).findOneOrFail(id);
			res.json(country);
		} catch (error) {
			// En caso contrario, envio un error.
			return res.status(404).json({
				message: 'Error, el pais no se encuentra registrado.',
			});
		}
	}

	// ======================================
	//			Actualizar Pais
	// ======================================
	public async updated(req: Request, res: Response) {
		const { id } = req.params;
		const { code, prefix, name } = req.body;

		let country: Country;
		try {
			// Si existe el pais, actualizo sus datos.
			country = await getRepository(Country).findOneOrFail(id);
			country.code = code;
			country.prefix = prefix;
			country.name = name;
		} catch (error) {
			// En caso contrario, envio un error.
			return res.status(404).json({
				message: 'Error, el pais no esta registrado.',
			});
		}

		try {
			// Si no hay errores, guardo el registro del Pais
			await getRepository(Country).save(country);
		} catch (error) {
			// En caso contrario, envio un error.
			return res.status(409).json({
				message: 'Error, ya existe un pais con estos datos.',
			});
		}

		return res.status(201).json('Pais actualizado con exito.');
	}

	// ======================================
	//			Eliminar Pais
	// ======================================
	public async deleted(req: Request, res: Response) {
		const { id } = req.params;

		try {
			// Verifico si el pais existe.
			await getRepository(Country).findOneOrFail(id);
		} catch (error) {
			// En caso contrario, envio un error.
			return res.status(404).json({
				message: 'Error, el pais no esta registrado.',
			});
		}

		await getRepository(Country).delete(id);

		res.status(201).json({
			message: 'Registro de pais eliminado con exito.',
		});
	}
}
