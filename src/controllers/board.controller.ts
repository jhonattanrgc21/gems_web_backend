import { Router } from 'express';

// ======================================
//			Servicess
// ======================================
import BoardServices from '../services/board.service';

// ======================================
//			Middlewares
// ======================================
import { checkJwt } from '../app/middlewares/auth.middleware';

// ======================================
//			Board Controller
// ======================================
const routes = Router();
const services = new BoardServices();

// Crear un tablero
routes.post('/', [checkJwt], services.created);

// Obtener todos los tableros
routes.get('/', [checkJwt], services.findAll);

// Obtener un solo tablero
routes.get('/:id', [checkJwt], services.findById);

// Actualizar un tablero
routes.patch('/:id', [checkJwt], services.updated);

// Eliminar un tablero
routes.delete('/:id', [checkJwt], services.deleted);

export default routes;
