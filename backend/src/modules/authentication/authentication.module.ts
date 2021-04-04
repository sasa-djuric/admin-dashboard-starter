import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { projectConfig } from '../../config/project';
import { UserRepository } from '../users/user.repository';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { ForgotPassword } from './forgot-password.entity';
import { TokenService } from './token/token.service';
import { TokenController } from './token/token.controller';
import { UsersService } from '../users/users.service';
import { Activation } from './activation.entity';

@Global()
@Module({
	imports: [
		TypeOrmModule.forFeature([UserRepository, ForgotPassword, Activation]),
		ConfigModule.forFeature(projectConfig)
	],
	providers: [AuthenticationService, TokenService, UsersService, ConfigService],
	controllers: [AuthenticationController, TokenController],
	exports: [TokenService, AuthenticationService]
})
export class AuthenticationModule {}
