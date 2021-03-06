// ======================================
//			Main Modules
// ======================================
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

// ======================================
//				Routes
// ======================================
import routes from "../routes/index.routes";

// ======================================
//				Bootstraping
// ======================================
export default function App(){

    const app = express();

	// middlewares
	app.use(express.json());
	app.use(cors());
	app.use(helmet());

	// Routes
    app.use('/', routes);
	return app;
}
