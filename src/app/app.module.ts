// ======================================
//			Main Modules
// ======================================
import cors from 'cors';
import helmet from 'helmet';
import express from 'express';

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
