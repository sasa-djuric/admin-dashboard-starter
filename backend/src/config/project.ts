import { registerAs } from '@nestjs/config';

export interface ProjectConfig {
	name: string;
	domain: string;
	url: string;
}

export const projectConfig = registerAs(
	'project',
	(): ProjectConfig => ({
		name: process.env.PROJECT_NAME,
		domain: process.env.PROJECT_DOMAIN,
		url: process.env.PROJECT_URL
	})
);
