import { registerAs } from '@nestjs/config';

export interface AppConfig {
	userEmail: string;
	userPassword: string;
	userName: string;
}

export const appConfig = registerAs(
	'app',
	(): AppConfig => ({
		userEmail: process.env.USER_EMAIL,
		userPassword: process.env.USER_PASSWORD,
		userName: process.env.USER_NAME
	})
);
