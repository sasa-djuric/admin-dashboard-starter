import { IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordDto {
	@IsNotEmpty()
	@MinLength(6)
	password: string;

	@IsNotEmpty()
	token: string;
}
