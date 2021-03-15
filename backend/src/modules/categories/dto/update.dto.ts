import { Injectable } from '@nestjs/common';
import { IsNotEmpty } from 'class-validator';
import { CreateCategoryDto } from './create.dto';

@Injectable()
export class UpdateCategoryDto extends CreateCategoryDto {
	@IsNotEmpty()
	id: number;
}
