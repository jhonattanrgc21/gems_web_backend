import { Router } from 'express';

// ======================================
//			Servicess
// ======================================
import CircuitServices from '../services/circuit.service';

// ======================================
//			Middlewares
// ======================================
import { checkJwt } from '../app/middlewares/auth.middleware';

// ======================================
//			Circuit Controller
// ======================================
const routes = Router();
const services = new CircuitServices();

// Crear un circuito
routes.post('/', [checkJwt], services.created);

// Obtener todos los circuitos
routes.get('/', [checkJwt], services.findAll);

// Obtener un solo circuito
routes.get('/:id', [checkJwt], services.findById);

// Actualizar un circuito
routes.patch('/:id', [checkJwt], services.updated);

// Eliminar un circuito
routes.delete('/:id', [checkJwt], services.deleted);

export default routes;
