import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, Length } from 'class-validator';
import { ID } from 'src/core/types';

export class UpdateDto {
	@ApiProperty()
	@IsOptional()
	@Length(3)
	name: string;

	@ApiProperty()
	@IsOptional()
	@IsEmail()
	email: string;

	@ApiProperty()
	@IsOptional()
	@Transform(({ value }) => parseInt(value))
	roleId: ID;

	@ApiProperty()
	@IsOptional()
	profileImage: Express.Multer.File;

	@ApiProperty()
	@IsOptional()
	isActive: boolean;
}
