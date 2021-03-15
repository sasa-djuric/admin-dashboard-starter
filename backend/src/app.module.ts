import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './modules/categories/categories.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from './config/providers/main-db.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { UsersModule } from './modules/users/users.module';
import { UserRepository } from './modules/users/user.respository';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailConfig } from './config/mail';
import { projectConfig } from './config/project';

@Module({
	imports: [
		CategoriesModule,
		ConfigModule.forRoot({
			envFilePath: '.env.development',
			ignoreEnvFile: !(!process.env.NODE_ENV || process.env.NODE_ENV === 'development'),
			load: [dbConfig, mailConfig, projectConfig]
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
		TypeOrmModule.forFeature([UserRepository]),
		AuthenticationModule,
		UsersModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {
	constructor(private readonly userRepository: UserRepository) {
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

		return this.userRepository.insert({
			email: 'admin@startup.com',
			name: 'Admin',
			password: 'administrator'
		});
	}
}
