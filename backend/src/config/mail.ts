import { MailerOptions } from '@nestjs-modules/mailer';
import { registerAs } from '@nestjs/config';

export const mailConfig = registerAs(
	'mail',
	(): MailerOptions => ({
		transport: {
			host: process.env.MAIL_HOST,
			port: process.env.MAIL_PORT,
			secure: true,
			auth: {
				user: process.env.MAIL_USERNAME,
				pass: process.env.MAIL_PASSWORD
			}
		},
		defaults: {
			from: process.env.MAIL_DEFAULT_FROM
		}
	})
);
