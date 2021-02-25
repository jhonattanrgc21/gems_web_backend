import { Router } from 'express';

// ======================================
//			Routes
// ======================================
import auth from './auth.routes';
import user from './user.routes';
import project from './project.routes';
import country from './country.routes';
import circuit from './circuit.routes';
import board from './board.routes';
import report from './report.routes';

const routes = Router();

routes.use('/auth', auth);
routes.use('/country', country);
routes.use('/user', user);
routes.use('/project', project);
routes.use('/board', board);
routes.use('/circuit', circuit);
routes.use('/report', circuit);

export default routes;
