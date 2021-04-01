import { Transform } from 'class-transformer';
import { IsIn, IsOptional } from 'class-validator';

export class FiltersDto {
	@IsOptional()
	search?: string;

	@IsOptional()
	@Transform(({ value }) => value.toUpperCase())
	@IsIn(['ASC', 'DESC'])
	order?: 'ASC' | 'DESC';

	@IsOptional()
	orderBy?: string;

	@IsOptional()
	@Transform(({ value }) => (typeof value === 'string' ? +value : value))
	offset?: number;

	@IsOptional()
	@Transform(({ value }) => (typeof value === 'string' ? +value : value))
	limit?: number;
}
