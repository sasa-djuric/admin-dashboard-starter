import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { compare, genSalt, hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { omit } from 'ramda';
import { UserRepository } from '../users/user.repository';
import { LoginDto, ForgotPasswordDto, ResetPasswordDto, LoginResponseDto, ActivationDto } from './dto';
import { ForgotPassword } from './forgot-password.entity';
import { emailTemplate } from '../../mail/template';
import { User } from '../users/user.entity';
import { TokenService } from './token/token.service';
import { ID } from '../../types';
import { Activation } from './activation.entity';

@Injectable()
export class AuthenticationService {
	constructor(
		@InjectRepository(UserRepository)
		private readonly userRepository: UserRepository,
		@InjectRepository(ForgotPassword)
		private readonly forgotPasswordRepository: Repository<ForgotPassword>,
		@InjectRepository(Activation)
		private readonly activationRepository: Repository<Activation>,
		private readonly mailerService: MailerService,
		private readonly configService: ConfigService,
		private readonly tokenService: TokenService
	) {}

	private readonly RESET_REQUEST_EXPIRE_TIME = 2 * 24 * 60 * 60 * 1000;

	public async login(data: LoginDto): Promise<LoginResponseDto & { refreshToken: string }> {
		try {
			const user = await this.userRepository.findOneWithPermissions({ email: data.email }, true);
			const isPasswordValid = await compare(data.password, user.password);

			if (!isPasswordValid || !user.isActive || !user.isActivated) {
				throw new Error();
			}

			const token = this.tokenService.generateAccessToken(user);
			const refreshToken = this.tokenService.setRefreshToken(user.id);

			return {
				user: omit(['password'], user),
				token,
				refreshToken
			};
		} catch {
			throw new BadRequestException('Wrong e-mail of password');
		}
	}

	public async forgotPassword(data: ForgotPasswordDto): Promise<void> {
		const user = await this.userRepository.findOne({ email: data.email });

		if (!user || !user.isActive) {
			throw new BadRequestException("User don't exist");
		}

		await this.cleanupPasswordResetRequests(user.id);

		const token = await genSalt();
		const createdForgotRequest = this.forgotPasswordRepository.create({
			userId: user.id,
			token
		});

		try {
			await this.forgotPasswordRepository.insert(createdForgotRequest);
			await this.sendPasswordResetEmail(user, token);
		} catch (err) {
			this.forgotPasswordRepository.delete({ id: createdForgotRequest.id });
			throw err;
		}
	}

	public async resetPassword(data: ResetPasswordDto): Promise<void> {
		const request = await this.forgotPasswordRepository.findOne({ token: data.token });
		const requestTime = new Date(request.createdAt).getTime();
		const expireTime = requestTime + this.RESET_REQUEST_EXPIRE_TIME;
		const isExpired = Date.now() > expireTime;

		if (!request) {
			throw new BadRequestException('Invalid reset password request');
		}

		if (isExpired) {
			throw new BadRequestException('Request expired');
		}

		await this.userRepository.update({ id: request.userId }, { password: data.password });
		this.forgotPasswordRepository.delete({ token: data.token });
	}

	public async hashPassword(password: string): Promise<string> {
		const salt = await genSalt();
		return hash(password, salt);
	}

	private async sendPasswordResetEmail(user: User, token: string): Promise<void> {
		const template = emailTemplate('reset-password', {
			name: user.name,
			email: user.email,
			logoUrl: 'data,',
			projectName: this.configService.get('project.name'),
			projectUrl: this.configService.get('project.url'),
			resetUrl: `${this.configService.get('project.url')}/reset-password/${encodeURIComponent(token)}`
		});

		await this.mailerService.sendMail({
			to: user.email,
			from: `noreply@${this.configService.get('project.domain')}`,
			subject: 'Password reset request',
			html: template
		});
	}

	public async handleAccountActivation(user: User): Promise<void> {
		const activationToken = await genSalt();
		const createdActivation = this.activationRepository.create({
			userId: user.id,
			token: activationToken
		});

		try {
			await this.activationRepository.insert(createdActivation);
			await this.sendAccountActivationEmail(user, activationToken);
		} catch (err) {
			this.activationRepository.delete(createdActivation);
			throw err;
		}
	}

	private async sendAccountActivationEmail(user: User, token: string): Promise<void> {
		const template = emailTemplate('account-activation', {
			logoUrl: 'data,',
			projectName: this.configService.get('project.name'),
			projectUrl: this.configService.get('project.url'),
			activationUrl: `${this.configService.get('project.url')}/activation/${encodeURIComponent(token)}`
		});

		await this.mailerService.sendMail({
			to: user.email,
			from: `noreply@${this.configService.get('project.domain')}`,
			subject: 'Account activation',
			html: template
		});
	}

	public async activation(data: ActivationDto): Promise<void> {
		const activationRequest = await this.activationRepository.findOne({ token: data.token });

		if (!activationRequest) {
			throw new BadRequestException('Invalid activation request');
		}

		await this.userRepository.update(
			{ id: activationRequest.userId },
			{ password: data.password, isActivated: true }
		);

		this.activationRepository.delete({ id: activationRequest.id });
	}

	private async cleanupPasswordResetRequests(userId: ID): Promise<void> {
		try {
			await this.forgotPasswordRepository.delete({ id: userId });
		} catch {}
	}
}
