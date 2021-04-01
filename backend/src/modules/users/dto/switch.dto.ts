import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ID } from 'src/types';

export class SwitchRoleDto {
	@ApiProperty()
	@IsNotEmpty()
	id: ID;

	@ApiProperty()
	@IsNotEmpty()
	roleId: ID;
}
