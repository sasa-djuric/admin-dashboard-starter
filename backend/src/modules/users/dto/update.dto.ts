import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, Length } from 'class-validator';
import { ID } from 'src/types';

export class UpdateDto {
	@IsOptional()
	@Length(3)
	name: string;

	@IsOptional()
	@IsEmail()
	email: string;

	@IsOptional()
	@Transform(({ value }) => parseInt(value))
	roleId: ID;

	profileImage: Express.Multer.File;

	@IsOptional()
	isActive: boolean;
}
