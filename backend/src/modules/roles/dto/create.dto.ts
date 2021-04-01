import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty } from 'class-validator';
import { Permissions } from 'src/core/types';

export class CreateRoleDto {
	@ApiProperty()
	@IsNotEmpty()
	name: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsBoolean()
	isActive: boolean;

	@ApiProperty()
	@IsNotEmpty()
	@IsArray()
	permissions: Array<Permissions>;
}
