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

// Registrar usuarios
routes.post('/register', AuthController.register);

// Confirmar registros de usuarios
routes.post('/verifyUser', AuthController.verifyUser);

// Reenviar correo de verificacion
routes.post('/resend-verification', AuthController.resendVerification);

// Iniciar sesion
routes.post('/login', AuthController.login);

// Cambiar contraseña despues de iniciar sesion
routes.post('/change-password', [checkJwt], AuthController.changePassword);

// Olvide mi contraseña
routes.put('/forgot-password', AuthController.forgotPassword);

// Crear nueva contraseña en caso de que se olvidara la anterior
routes.put('/new-password', AuthController.createNewPassword);

export default routes;
