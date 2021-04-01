import { IsNotEmpty, IsNotIn } from 'class-validator';
import { ID } from 'src/types';

export class SwitchRoleDto {
	@IsNotEmpty()
	id: ID;

	@IsNotEmpty()
	roleId: ID;
}
