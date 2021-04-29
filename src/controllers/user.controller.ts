import { Router } from 'express';

// ======================================
//			Servicess
// ======================================
import UserServices from '../services/user.service';

// ======================================
//			User Controller
// ======================================
const routes = Router();
const services = new UserServices();

// Crear un usuario
routes.post('/', services.created);

// Obtener todos los usuarios
routes.get('/', services.findAll);

// Obtener un solo usuario
routes.get('/:id', services.findById);

// Buscar usuario por email
routes.post('/verifyEmail', services.findByEmail);

// Buscar usuario por username
routes.post('/verifyUsername', services.findByUsername);

// Buscar usuario por profesionalID
routes.post('/verifyProfesionalID', services.findByProfesionalID);

// Actualizar un usuario
routes.patch('/:id', services.updated);

// Eliminar un usuario
routes.delete('/:id', services.deleted);

export default routes;
