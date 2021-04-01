import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ActivationDto {
	@ApiProperty()
	@IsNotEmpty()
	password: string;

	@ApiProperty()
	@IsNotEmpty()
	token: string;
}
