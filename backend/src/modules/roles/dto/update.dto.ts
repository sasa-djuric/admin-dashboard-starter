import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional } from 'class-validator';
import { Permissions } from '../../../core/types';

export class UpdateRoleDto {
	@ApiProperty()
	@IsOptional()
	name?: string;

	@ApiProperty()
	@IsOptional()
	@IsBoolean()
	isActive?: boolean;

	@ApiProperty()
	@IsOptional()
	@IsArray()
	permissions?: Array<Permissions>;
}
