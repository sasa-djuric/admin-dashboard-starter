import { Controller, Body, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthenticationGuard, PermissionsGuard } from '../../guards';
import { FiltersDto, IdParamDto } from '../../dto/';
import { WithFilters } from '../../types';
import { CreateRoleDto, UpdateRoleDto } from './dto';
import { RolesPermissions } from './enums';
import { Role } from './role.entity';
import { RolesService } from './roles.service';
import { Cache } from 'src/cache/decorators';

const TTL = 24 * 60 * 60;

@Controller('roles')
@UseGuards(AuthenticationGuard)
export class RolesController {
	constructor(private readonly rolesService: RolesService) {}

	@Get()
	@UseGuards(new PermissionsGuard(RolesPermissions.Read))
	getAll(@Query() filters?: FiltersDto): Promise<WithFilters<Array<Role>>> {
		return this.rolesService.getAll(filters);
	}

	@Get('/:id')
	@UseGuards(new PermissionsGuard(RolesPermissions.Read))
	@Cache<any, IdParamDto>('role', ({ params }) => params.id, TTL)
	getById(@Param() params: IdParamDto) {
		return this.rolesService.getById(params.id);
	}

	@Post()
	@UseGuards(new PermissionsGuard(RolesPermissions.Create))
	create(@Body() data: CreateRoleDto) {
		return this.rolesService.create(data);
	}

	@Put('/:id')
	@UseGuards(new PermissionsGuard(RolesPermissions.Update))
	@Cache<any, IdParamDto>('role', ({ params }) => params.id, TTL)
	update(@Param() params: IdParamDto, @Body() data: UpdateRoleDto) {
		return this.rolesService.update(params.id, data);
	}

	@Delete('/:id')
	@UseGuards(new PermissionsGuard(RolesPermissions.Delete))
	@Cache<any, IdParamDto>('role', ({ params }) => params.id, TTL)
	remove(@Param() params: IdParamDto) {
		return this.rolesService.remove(params.id);
	}
}
