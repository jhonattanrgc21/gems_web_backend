import { Router } from 'express';

// ======================================
//			Controllers
// ======================================
import AuthController from '../controllers/auth.controller';

// ======================================
//			Middlewares
// ======================================
import { checkJwt } from '../app/middlewares/auth.middleware';

// ======================================
//			Auth Routes
// ======================================
const routes = Router()

routes.post('/login', AuthController.login);
routes.post('/change-password', [checkJwt], AuthController.changePassword);
routes.post('/logaut', AuthController.logout);

export default routes;
