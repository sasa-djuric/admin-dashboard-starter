import { IsNotEmpty } from 'class-validator';

export class ImportListDto {
	@IsNotEmpty()
	file: string;
}
