import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Role } from '../roles/role.entity';

// Modules
import { MailerModule } from '@nestjs-modules/mailer';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthenticationModule } from '../authentication/authentication.module';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { UserRepository } from '../users/user.repository';
import { RolesModule } from '../roles/roles.module';

// Config
import { dbConfig } from '../../config/providers/main-db.config';
import { mailConfig } from '../../config/mail';
import { redisConfig } from '../../config/providers/redis.config';
import { projectConfig } from '../../config/project';
import { authenticationConfig } from '../../config/authentication';

// Middlewares
import { CurrentUserMiddleware } from 'src/middlewares/current-user.middleware';
import { CacheModule } from 'src/cache/cache.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: '.env.development',
			ignoreEnvFile: !(!process.env.NODE_ENV || process.env.NODE_ENV === 'development'),
			load: [dbConfig, mailConfig, projectConfig, authenticationConfig, redisConfig]
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (config: ConfigService) => config.get('main-database'),
			inject: [ConfigService]
		}),
		MailerModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (config: ConfigService) => config.get('mail'),
			inject: [ConfigService]
		}),
		TypeOrmModule.forFeature([Role, UserRepository]),
		AuthenticationModule,
		RolesModule,
		UsersModule,
		CacheModule
	],
	controllers: [AppController],
	providers: [AppService, UsersService]
})
export class AppModule {
	constructor(
		@InjectRepository(Role) private readonly roleRepository: Repository<Role>,
		private readonly userRepository: UserRepository
	) {}

	configure(consumer: MiddlewareConsumer): void {
		consumer.apply(CurrentUserMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
	}

	onModuleInit() {
		this.handleFirstRun();
	}

	isFirstRun() {
		return this.userRepository.count().then(result => !result);
	}

	async handleFirstRun() {
		const isFirstRun = await this.isFirstRun();

		if (!isFirstRun) {
			return;
		}

		const entities = ['roles', 'users'];
		const permissions = ['create', 'read', 'update', 'delete'];
		const allPermissions = entities.flatMap(entity => permissions.map(permission => `${entity}:${permission}`));

		const role = this.roleRepository.create({
			name: 'Admin',
			isActive: true,
			permissions: allPermissions
		});

		await this.roleRepository.insert(role);

		return this.userRepository.insert({
			email: 'admin@startup.com',
			name: 'Admin',
			password: 'administrator',
			role: role.id
		});
	}
}
