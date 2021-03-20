import { IsNotEmpty } from 'class-validator';
import { ID } from 'src/types';

export class IdParamDto {
	@IsNotEmpty()
	id: ID;
}
