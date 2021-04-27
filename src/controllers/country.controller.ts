import { Router } from 'express';

// ======================================
//			Servicess
// ======================================
import CountryServices from '../services/country.service';

// ======================================
//			Country Controller
// ======================================
const routes = Router();
const services = new CountryServices();

// Crear un pais
routes.post('/', services.created);

// Obtener todos los paises
routes.get('/', services.findAll);

// Obtener un solo pais
routes.get('/:id', services.findById);

// Actualizar un pais
routes.patch('/:id', services.updated);

// Eliminar un pais
routes.delete('/:id', services.deleted);

export default routes;
