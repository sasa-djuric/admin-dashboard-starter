import { IsNotEmpty } from 'class-validator';

export class ActivationDto {
	@IsNotEmpty()
	password: string;

	@IsNotEmpty()
	token: string;
}
