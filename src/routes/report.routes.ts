import { Router } from 'express';

// ======================================
//			Controllers
// ======================================
import ReportController from '../controllers/report.controller';

// ======================================
//			Middlewares
// ======================================
import { checkJwt } from '../app/middlewares/auth.middleware';

// ======================================
//			Report Routes
// ======================================
const routes = Router();

// Obtener todos los reportes
routes.get('/', [checkJwt], ReportController.getAll);

// Obtener la lista de valores previos a la insercion del registro
routes.post('/listForm', ReportController.listForm);

// Obtener un solo reporte
routes.get('/:id', [checkJwt], ReportController.getById);

// Crear un reporte
routes.post('/', [checkJwt], ReportController.newReport);

// Actualizar un reporte
routes.patch('/:id', [checkJwt], ReportController.editReport);

// Eliminar un reporte
routes.delete('/:id', [checkJwt], ReportController.deleteReport);

export default routes;
