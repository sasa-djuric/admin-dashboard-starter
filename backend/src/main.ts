import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';
import { AuthenticationGuard } from './guards/authentication.guard';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { cors: true });
	app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
	app.useGlobalGuards(new AuthenticationGuard());
	app.use(json({ limit: '20mb' }));
	app.use(urlencoded({ limit: '20mb', extended: true }));
	await app.listen(3000);
}
bootstrap();
