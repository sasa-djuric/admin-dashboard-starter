import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';
import { UserRepository } from '../users/user.respository';
import { sign } from 'jsonwebtoken';
import { omit } from 'ramda';
import { LoginDto, ForgotPasswordDto, ResetPasswordDto } from './dto';
import { ForgotPassword } from './forgot-password.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { emailTemplate } from '../../mail/template';
import { ConfigService } from '@nestjs/config';

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

	async login(data: LoginDto) {
		try {
			const found = await this.userRepository.findOneOrFail({ email: data.email });
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

	async forgotPassword(data: ForgotPasswordDto): Promise<void> {
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

			const template = emailTemplate('reset-password', {
				name: found.name,
				email: found.email,
				projectName: this.configService.get('project.name'),
				resetUrl: `${this.configService.get('project.domain')}/reset-password/${token}`
			});

			await this.mailerService.sendMail({
				to: 'mail@mail.com',
				from: 'noreply@x.com',
				subject: 'test',
				html: template
			});
		} catch (err) {
			throw new InternalServerErrorException();
		}
	}

	async resetPassword(data: ResetPasswordDto): Promise<void> {
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
}
