import { Injectable } from '@nestjs/common';
import { IsNotEmpty } from 'class-validator';

@Injectable()
export class GetSubcategoriesDto {
	@IsNotEmpty()
	id: string;
}
