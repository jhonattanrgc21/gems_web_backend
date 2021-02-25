import { Router } from 'express';

// ======================================
//			Controllers
// ======================================
import CircuitController from '../controllers/circuit.controller';

// ======================================
//			Middlewares
// ======================================
import { checkJwt } from '../app/middlewares/auth.middleware';

// ======================================
//			Circuit Routes
// ======================================
const routes = Router();

// Obtener todos los circuitos
routes.get('/', [checkJwt], CircuitController.getAll);

// Obtener un solo circuito
routes.get('/:id', [checkJwt], CircuitController.getById);

// Crear un circuito
routes.post('/', [checkJwt], CircuitController.newCircuit);

// Actualizar un circuito
routes.patch('/:id', [checkJwt], CircuitController.editCircuit);

// Eliminar un circuito
routes.delete('/:id', [checkJwt], CircuitController.deleteCircuit);

export default routes;
