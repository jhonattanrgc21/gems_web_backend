import { Router } from 'express';

// ======================================
//			Controllers
// ======================================
import ProjectController from '../controllers/project.controller';

// ======================================
//			Middlewares
// ======================================
import { checkJwt } from '../app/middlewares/auth.middleware';

// ======================================
//			Project Routes
// ======================================
const routes = Router();

// Obtener todos los proyectos
routes.get('/', [checkJwt], ProjectController.getAll);

// Obtener un solo proyecto
routes.get('/:id',[checkJwt], ProjectController.getById);

// Crear un proyecto
routes.post('/', [checkJwt], ProjectController.newProject);

// Actualizar un proyecto
routes.patch('/:id', [checkJwt], ProjectController.editProject);

// Eliminar un proyecto
routes.delete('/:id', [checkJwt], ProjectController.deleteProject);

export default routes;
