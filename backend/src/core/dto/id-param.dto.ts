import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { ID } from '../types';

export class IdParamDto {
	@IsNotEmpty()
	@Transform(({ value }) => parseInt(value))
	id: ID;
}
