import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { compare, genSalt, hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { omit } from 'ramda';
import { UserRepository } from '../users/user.repository';
import { LoginDto, ForgotPasswordDto, ResetPasswordDto, LoginResponseDto } from './dto';
import { ForgotPassword } from './forgot-password.entity';
import { emailTemplate } from '../../mail/template';
import { User } from '../users/user.entity';

@Injectable()
export class AuthenticationService {
	constructor(
		@InjectRepository(UserRepository)
		private readonly userRepository: UserRepository,
		@InjectRepository(ForgotPassword)
		private readonly forgotPasswordRepository: Repository<ForgotPassword>,
		private readonly mailerService: MailerService,
		private readonly configService: ConfigService
	) {}

	public async login(data: LoginDto): Promise<LoginResponseDto> {
		try {
			const found = await this.userRepository.findOneWithPermissions({ email: data.email });
			const isPasswordValid = await compare(data.password, found.password);

			if (!isPasswordValid) {
				throw new Error();
			}

			const token = sign({ user: omit(['password'], found) }, process.env.JWT_SECRET);

			return {
				user: omit(['password'], found),
				token
			};
		} catch {
			throw new BadRequestException('User with given credentials not found');
		}
	}

	public async forgotPassword(data: ForgotPasswordDto): Promise<void> {
		try {
			const found = await this.userRepository.findOne({ email: data.email });

			if (!found) {
				throw new BadRequestException("User don't exist");
			}

			const token = await genSalt(5);

			await this.forgotPasswordRepository.insert({
				email: found.email,
				token
			});

			await this.sendPasswordResetEmail(found, token);
		} catch (err) {
			throw new InternalServerErrorException();
		}
	}

	public async resetPassword(data: ResetPasswordDto): Promise<void> {
		try {
			const found = await this.forgotPasswordRepository.findOneOrFail({ token: data.token });
			const salt = await genSalt(4);
			const hashedPassword = await hash(data.password, salt);

			await this.userRepository.update({ email: found.email }, { password: hashedPassword });
			this.forgotPasswordRepository.delete({ token: data.token });
		} catch {
			throw new BadRequestException('Request expired');
		}
	}

	private async sendPasswordResetEmail(user: User, token: string): Promise<any> {
		const template = emailTemplate('reset-password', {
			name: user.name,
			email: user.email,
			projectName: this.configService.get('project.name'),
			resetUrl: `https://www.${this.configService.get('project.domain')}/reset-password/${token}`
		});

		return this.mailerService.sendMail({
			to: 'mail@mail.com',
			from: `noreply@${this.configService.get('project.domain')}`,
			subject: 'Password reset request',
			html: template
		});
	}
}
