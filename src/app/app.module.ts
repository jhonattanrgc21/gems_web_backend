// ======================================
//			Main Modules
// ======================================
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

	// Routes
    app.use('/', routes);
	return app;
}
