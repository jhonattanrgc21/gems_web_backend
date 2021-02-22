import { Router } from 'express';

// ======================================
//			Controllers
// ======================================
import BoardController from '../controllers/board.controller';

// ======================================
//			Middlewares
// ======================================
import { checkJwt } from '../app/middlewares/auth.middleware';

// ======================================
//			Board Routes
// ======================================
const routes = Router();

// Obtener todos los tableros
routes.get('/', [checkJwt], BoardController.getAll);

// Obtener un solo tablero
routes.get('/:id', [checkJwt], BoardController.getById);

// Crear un tablero
routes.post('/', [checkJwt], BoardController.newBoard);

// Actualizar un tablero
routes.patch('/:id', [checkJwt], BoardController.editBoard);

// Eliminar un tablero
routes.delete('/:id', [checkJwt], BoardController.deleteBoard);

export default routes;
