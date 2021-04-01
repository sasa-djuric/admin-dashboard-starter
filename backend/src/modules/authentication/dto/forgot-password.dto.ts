import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsEmail()
	email: string;
}
