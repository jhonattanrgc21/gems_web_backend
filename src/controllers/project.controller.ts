import { Router } from 'express';

// ======================================
//			Servicess
// ======================================
import ProjectServices from '../services/project.service';

// ======================================
//			Middlewares
// ======================================
import { checkJwt } from '../app/middlewares/auth.middleware';

// ======================================
//			Project Controller
// ======================================
const routes = Router();
const services = new ProjectServices();

// Crear un proyecto
routes.post('/', [checkJwt], services.created);

// Obtener todos los proyectos
routes.get('/', [checkJwt], services.findAll);

// Obtener un solo proyecto
routes.get('/:id', [checkJwt], services.findById);

// Actualizar un proyecto
routes.patch('/:id', [checkJwt], services.updated);

// Eliminar un proyecto
routes.delete('/:id', [checkJwt], services.deleted);

export default routes;
