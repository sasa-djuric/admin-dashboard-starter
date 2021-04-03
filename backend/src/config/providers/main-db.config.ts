import { registerAs } from '@nestjs/config';
import { ConnectionOptions } from 'typeorm';

const config = (): ConnectionOptions => ({
	type: 'mysql',
	host: process.env.MAIN_DATABASE_HOST || 'localhost',
	port: 3306,
	username: process.env.MAIN_DATABASE_USERNAME || 'root',
	password: process.env.MAIN_DATABASE_PASSWORD || 'password',
	database: process.env.MAIN_DATABASE || 'main',
	entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
	subscribers: [__dirname + '/../../**/*.entity.subscriber{.ts,.js}'],
	migrations: ['src/migration/*{.ts,.js}'],
	synchronize: false,
	logging: false,
	cli: {
		entitiesDir: 'src/providers/db/entity',
		migrationsDir: 'src/providers/db/migration',
		subscribersDir: 'src/providers/db/subscriber'
	}
});

export const dbConfig = registerAs('main-database', config);

export default config();
