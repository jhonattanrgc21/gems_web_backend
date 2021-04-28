import { Router } from 'express';

// ======================================
//			Servicess
// ======================================
import AuthServices from '../services/auth.service';

// ======================================
//			Middlewares
// ======================================
import { checkJwt } from '../app/middlewares/auth.middleware';

// ======================================
//			Auth Controller
// ======================================
const routes = Router()
const services = new AuthServices();

// Registrar usuarios
routes.post('/register', services.register);

// Confirmar registros de usuarios
routes.post('/verifyUser', checkJwt,services.verifyUser);

// Reenviar correo de verificacion
routes.post('/resend-verification', services.resendVerification);

// Iniciar sesion
routes.post('/login', services.login);

// Cambiar contraseña despues de iniciar sesion
routes.post('/change-password', [checkJwt], services.changePassword);

// Olvide mi contraseña
routes.put('/forgot-password', services.forgotPassword);

// Crear nueva contraseña en caso de que se olvidara la anterior
routes.put('/new-password', services.newPassword);

export default routes;
