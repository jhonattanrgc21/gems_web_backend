// ======================================
//			Main Modules
// ======================================
import 'reflect-metadata';
import App from './app/app.module';
import * as dotenv from 'dotenv';
import connect from './config/database';

// ======================================
//				Constant
// ======================================
const PORT = process.env.NODE_PORT || 4000;

async function main(){
	// Para leer las variables de entorno
	dotenv.config();

	// Iniciando la conexion a la BD
	await connect();
	const app = App();

	app.listen(PORT, () =>
		console.log(`Application is running on: http://localhost:${PORT}`),
	);
}
main();
