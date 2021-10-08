import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, Length } from 'class-validator';
import { ID } from '../../../core/types';

export class CreateDto {
	@ApiProperty()
	@IsNotEmpty()
	@Length(3)
	name: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@ApiProperty()
	@IsNotEmpty()
	roleId: ID;

	@ApiProperty()
	@IsOptional()
	profileImage: Express.Multer.File;
}
