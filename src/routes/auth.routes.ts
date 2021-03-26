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

// Iniciar sesion
routes.post('/login', AuthController.login);

// Cambiar contraseña despues de iniciar sesion
routes.post('/change-password', [checkJwt], AuthController.changePassword);

// Olvide mi contraseña
routes.put('/forgot-password', AuthController.forgotPassword);

// Crear nueva contraseña en caso de que se olvidara la anterior
routes.put('/new-password', AuthController.createNewPassword);

export default routes;
