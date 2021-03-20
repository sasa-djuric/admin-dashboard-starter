import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { projectConfig } from '../../config/project';
import { UserRepository } from '../users/user.repository';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { ForgotPassword } from './forgot-password.entity';

@Module({
	imports: [TypeOrmModule.forFeature([UserRepository, ForgotPassword]), ConfigModule.forFeature(projectConfig)],
	providers: [AuthenticationService],
	controllers: [AuthenticationController]
})
export class AuthenticationModule {}
