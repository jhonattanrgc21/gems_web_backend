import { Router } from 'express';

// ======================================
//			Controllers
// ======================================
import CountryController from '../controllers/country.controller';

// ======================================
//			Country Routes
// ======================================
const routes = Router();

// Obtener todos los paises
routes.get('/', CountryController.getAll);

// Obtener un solo pais
routes.get('/:id', CountryController.getById);

// Crear un pais
routes.post('/', CountryController.newCountry);

// Actualizar un pais
routes.patch('/:id', CountryController.editCountry);

// Eliminar un pais
routes.delete('/:id', CountryController.deleteCountry);

export default routes;
