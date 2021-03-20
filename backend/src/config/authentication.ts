import { registerAs } from '@nestjs/config';

export interface AuthenticationConfig {
	jwtSecret: string;
}

export const authenticationConfig = registerAs(
	'authConfig',
	(): AuthenticationConfig => ({
		jwtSecret: process.env.JWT_SECRET
	})
);
