import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordDto {
	@ApiProperty()
	@IsNotEmpty()
	@MinLength(6)
	password: string;

	@ApiProperty()
	@IsNotEmpty()
	token: string;
}
