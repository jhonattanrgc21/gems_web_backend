import { Router } from 'express';

// ======================================
//			Servicess
// ======================================
import ReportServices from '../services/report.service';

// ======================================
//			Middlewares
// ======================================
import { checkJwt } from '../app/middlewares/auth.middleware';

// ======================================
//			Report Controller
// ======================================
const routes = Router();
const services = new ReportServices();

// Crear un reporte
routes.post('/', [checkJwt], services.created);

// Obtener todos los reportes
routes.get('/', [checkJwt], services.findAll);

// Obtener la lista de valores previos a la insercion del registro
routes.post('/listForm', [checkJwt],services.reportPrevio);

// Obtener un solo reporte
routes.get('/:id', [checkJwt], services.findById);

// Actualizar un reporte
routes.patch('/:id', [checkJwt], services.updated);

// Eliminar un reporte
routes.delete('/:id', [checkJwt], services.deleted);

export default routes;
