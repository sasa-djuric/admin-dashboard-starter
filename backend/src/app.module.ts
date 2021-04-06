import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppService } from './app.service';
import { Role } from './modules/roles/role.entity';

// Modules
import { MailerModule } from '@nestjs-modules/mailer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { UsersModule } from './modules/users/users.module';
import { UsersService } from './modules/users/users.service';
import { UserRepository } from './modules/users/user.repository';
import { RolesModule } from './modules/roles/roles.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { LoggingModule } from './modules/logging/logging.module';
import { RedisModule } from 'nestjs-redis';
import { RolesService } from './modules/roles/roles.service';
import { PhotosModule } from './modules/photos/photos.module';

// Config
import { appConfig } from 'src/config/app';
import { dbConfig } from './config/providers/main-db.config';
import { mailConfig } from './config/mail';
import { redisConfig } from './config/providers/redis.config';
import { projectConfig } from './config/project';
import { authenticationConfig } from './config/authentication';

// Core
import { UnhandledExceptionFilter } from './core/filters';
import { CurrentUserMiddleware } from './core/middlewares/current-user.middleware';
import { CacheModule } from './core/cache/cache.module';

// Utils
import { join } from 'path';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: ['.env.development.local'],
			ignoreEnvFile: !(!process.env.NODE_ENV || process.env.NODE_ENV === 'development'),
			load: [
				appConfig,
				dbConfig,
				mailConfig,
				projectConfig,
				authenticationConfig,
				redisConfig
			]
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (config: ConfigService) => config.get('main-database'),
			inject: [ConfigService]
		}),
		RedisModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => configService.get('redis'),
			inject: [ConfigService]
		}),
		MailerModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (config: ConfigService) => config.get('mail'),
			inject: [ConfigService]
		}),
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '../public')
		}),
		TypeOrmModule.forFeature([Role, UserRepository]),
		AuthenticationModule,
		RolesModule,
		UsersModule,
		PhotosModule,
		CacheModule,
		LoggingModule
	],
	providers: [
		AppService,
		UsersService,
		RolesService,
		ConfigService,
		{
			provide: APP_FILTER,
			useClass: UnhandledExceptionFilter
		}
	]
})
export class AppModule {
	constructor(private readonly appService: AppService) {}

	configure(consumer: MiddlewareConsumer): void {
		consumer.apply(CurrentUserMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
	}

	onModuleInit() {
		return this.appService.handleFirstRun();
	}
}
