import { join } from 'path';
import { createConnection } from 'typeorm';

// ======================================
//				Database
// ======================================

export default async function connect(){
    await createConnection({
		type: 'mysql',
		host: 'localhost',
		port: 3306,
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
		synchronize: true,
		entityPrefix: 'gems_',
        entities: [join(__dirname, '../database/entities/**.entity.{ts,js}')],
	})
		.then(() => console.log('Database is Connected'))
		.catch((error) => console.log(error));
}
