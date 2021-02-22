import { Router } from 'express';

// ======================================
//			Routes
// ======================================
import auth from './auth.routes';
import user from './user.routes';
import project from './project.routes';
import country from './country.routes';
import circuit from './circuit.routes';

const routes = Router();

routes.use('/auth', auth);
routes.use('/user', user);
routes.use('/project', project);
routes.use('/country', country);
routes.use('/circuit', circuit);

export default routes;
