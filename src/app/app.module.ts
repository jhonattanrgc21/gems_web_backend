// ======================================
//			Main Modules
// ======================================
import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import cookieParser from 'cookie-parser';

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
	app.use(cookieParser());

	// Routes
    app.use('/', routes);
	return app;
}
