import { registerAs } from '@nestjs/config';

export interface ProjectConfig {
	name: string;
	domian: string;
}

export const projectConfig = registerAs('project', () => ({
	name: process.env.PROJECT_NAME,
	domain: process.env.PROJECT_DOMAIN
}));
