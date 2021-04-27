import { Router } from 'express';

// ======================================
//			Routes
// ======================================
import authController from '../controllers/auth.controller';
import userController from '../controllers/user.controller';
import projectController from '../controllers/project.controller';
import countryController from '../controllers/country.controller';
import circuitController from '../controllers/circuit.controller';
import boardController from '../controllers/board.controller';
import reportController from '../controllers/report.controller';

const routes = Router();

routes.use('/auth', authController);
routes.use('/country', countryController);
routes.use('/user', userController);
routes.use('/project', projectController);
routes.use('/board', boardController);
routes.use('/circuit', circuitController);
routes.use('/report', reportController);

export default routes;
