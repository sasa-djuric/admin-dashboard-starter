import { IsArray, IsBoolean, IsNotEmpty } from 'class-validator';
import { Permissions } from 'src/types';

export class CreateRoleDto {
	@IsNotEmpty()
	name: string;

	@IsNotEmpty()
	@IsBoolean()
	isActive: boolean;

	@IsNotEmpty()
	@IsArray()
	permissions: Array<Permissions>;
}
