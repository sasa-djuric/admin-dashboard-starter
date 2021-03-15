import { Injectable } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { isNumber } from '../../../utils/isNumber';
import { CategoryType } from '../categories.type.enum';

const categoryTypes = Object.keys(CategoryType)
	.filter(key => !isNumber(key))
	.map(key => Object(CategoryType)[key]);

@Injectable()
export class CreateCategoryDto {
	@IsNotEmpty()
	name: string;

	@IsNotEmpty()
	description: string;

	@IsOptional()
	@IsIn(categoryTypes)
	@Transform(({ value }) => (value === null ? CategoryType.None : value))
	type: CategoryType = CategoryType.None;

	@IsNotEmpty()
	@IsString()
	icon: string;

	@IsOptional()
	banner: string | null;

	@IsOptional()
	@IsArray()
	parentCategories: Array<number>;

	@IsOptional()
	@IsArray()
	subcategories: Array<number>;

	@IsNotEmpty()
	@IsBoolean()
	isMaster: boolean;

	@IsNotEmpty()
	@IsBoolean()
	isActive: boolean;
}
