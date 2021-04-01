import { Controller, Body, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthenticationGuard, PermissionsGuard } from '../../core/guards';
import { FiltersDto, IdParamDto } from '../../core/dto';
import { ID, WithFilters } from '../../core/types';
import { CreateRoleDto, UpdateRoleDto } from './dto';
import { RolesPermissions } from './enums';
import { Role } from './role.entity';
import { RolesService } from './roles.service';
import { Cache } from '../../core/cache/decorators';
import { ApiParam, ApiQuery } from '@nestjs/swagger';

const TTL = 24 * 60 * 60;

@Controller('roles')
@UseGuards(AuthenticationGuard)
export class RolesController {
	constructor(private readonly rolesService: RolesService) {}

	@Get('/')
	@UseGuards(new PermissionsGuard(RolesPermissions.Read))
	@ApiQuery({ name: 'filters', required: false })
	getAll(@Query() filters?: FiltersDto): Promise<WithFilters<Array<Role>>> {
		return this.rolesService.getAll(filters);
	}

	@Get('/:id')
	@UseGuards(new PermissionsGuard(RolesPermissions.Read))
	@Cache<any, IdParamDto>('role', ({ params }) => params.id, TTL)
	@ApiParam({ name: 'id', required: true })
	getById(@Param() params: IdParamDto): Promise<Role> {
		return this.rolesService.getById(params.id);
	}

	@Post('/')
	@UseGuards(new PermissionsGuard(RolesPermissions.Create))
	create(@Body() data: CreateRoleDto): Promise<Role> {
		return this.rolesService.create(data);
	}

	@Put('/:id')
	@UseGuards(new PermissionsGuard(RolesPermissions.Update))
	@Cache<any, IdParamDto>('role', ({ params }) => params.id, TTL)
	@ApiParam({ name: 'id', required: true })
	update(@Param() params: IdParamDto, @Body() data: UpdateRoleDto): Promise<Role> {
		return this.rolesService.update(params.id, data);
	}

	@Delete('/:id')
	@UseGuards(new PermissionsGuard(RolesPermissions.Delete))
	@Cache<any, IdParamDto>('role', ({ params }) => params.id, TTL)
	@ApiParam({ name: 'id', required: true })
	remove(@Param() params: IdParamDto): Promise<{ id: ID }> {
		return this.rolesService.remove(params.id);
	}
}
