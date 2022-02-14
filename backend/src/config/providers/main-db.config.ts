import { registerAs } from '@nestjs/config';
import { ConnectionOptions } from 'typeorm';

const config = (): ConnectionOptions => ({
	type: 'mysql',
	host: process.env.MYSQL_HOST || 'localhost',
	port: 3306,
	username: process.env.MYSQL_USERNAME || 'root',
	password: process.env.MYSQL_PASSWORD || 'password',
	database: process.env.MYSQL_DATABASE || 'main',
	entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
	subscribers: [__dirname + '/../../**/*.entity.subscriber{.ts,.js}'],
	migrations: ['dist/providers/db/migration/*{.ts,.js}'],
	migrationsRun: process.env.NODE_ENV !== 'development',
	synchronize: process.env.NODE_ENV === 'development',
	logging: process.env.NODE_ENV === 'development',
	cli: {
		entitiesDir: 'src/providers/db/entity',
		migrationsDir: 'src/providers/db/migration',
		subscribersDir: 'src/providers/db/subscriber'
	}
});

export const dbConfig = registerAs('main-database', config);

export default config();
