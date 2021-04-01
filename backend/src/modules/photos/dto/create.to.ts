import { IsNotEmpty } from 'class-validator';

export class SaveB64PhotoDto {
	@IsNotEmpty()
	name: string;

	@IsNotEmpty()
	data: string;
}
