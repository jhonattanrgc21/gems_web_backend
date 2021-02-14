import { Router } from 'express';

// ======================================
//			Controllers
// ======================================
import UserController from '../controllers/user.controller';

// ======================================
//			User Routes
// ======================================
const routes = Router();

// Obtener todos los usuarios
routes.get('/', UserController.getAll);

// Obtener un solo usuario
routes.get('/:id', UserController.getById);

// Crear un usuario
routes.post('/', UserController.newUser);

// Actualizar un usuario
routes.patch('/:id', UserController.editUser);

// Eliminar un usuario
routes.delete('/:id', UserController.deleteUser);

export default routes;
