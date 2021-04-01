import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { ID } from 'src/types';

export class CreateDto {
	@IsNotEmpty()
	@Length(3)
	name: string;

	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	roleId: ID;

	profileImage: Express.Multer.File;
}
