import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { ID } from 'src/core/types';

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

	profileImage: Express.Multer.File;
}
