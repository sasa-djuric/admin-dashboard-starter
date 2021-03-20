import { IsArray, IsBoolean, IsOptional } from 'class-validator';
import { Permissions } from 'src/types';

export class UpdateRoleDto {
	@IsOptional()
	name?: string;

	@IsOptional()
	@IsBoolean()
	isActive?: boolean;

	@IsOptional()
	@IsArray()
	permissions?: Array<Permissions>;
}
