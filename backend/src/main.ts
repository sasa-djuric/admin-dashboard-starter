import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'express';
import { AppModule } from './modules/app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { cors: true });
	app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
	app.setGlobalPrefix('/v1');
	app.use(json({ limit: '20mb' }));
	app.use(urlencoded({ limit: '20mb', extended: true }));
	app.use(cookieParser());
	app.enableCors({
		credentials: true,
		origin: true
	});

	const config = new DocumentBuilder()
		.setTitle('Nestjs skelet')
		.setDescription('Project skelet')
		.setVersion('1.0')
		.build();

	const document = SwaggerModule.createDocument(app, config);

	SwaggerModule.setup('api', app, document);

	await app.listen(3000);
}
bootstrap();
